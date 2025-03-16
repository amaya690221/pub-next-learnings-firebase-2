//  /app/api/records/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../utils/authRequest";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseAdmin } from "../../utils/firebaseAdmin";
import { collectionName } from "@/app/utils/firebase";

// **データ削除**

export async function DELETE(request: NextRequest) {
  try {
    // トークンの検証を実施
    const decodedToken = await authenticateRequest(request);
    //デコードされたトークンをauthRequest.tsのauthenticateRequestから取得
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "認証できません: トークンが不正です" },
        { status: 401 }
      );
    }

    const data = await request.json(); //リクエストボディをJSON形式で取得
    const { id } = data; //リクエストボディからidを取得
    const email = decodedToken.email; //トークンからemailを取得
    const db = getFirestore(firebaseAdmin); // データベースのインスタンスをfirebaseAdmin権限で取得

    // ドキュメントの存在確認と所有者チェック
    const docRef = db.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      //ドキュメントが存在しない場合はエラー
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    const docData = doc.data();
    if (docData?.email !== email) {
      //emailが一致しない場合はエラー
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // データを削除
    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting study:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
