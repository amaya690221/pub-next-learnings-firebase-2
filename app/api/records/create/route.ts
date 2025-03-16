//  /app/api/records/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../utils/authRequest";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseAdmin } from "../../utils/firebaseAdmin";
import { collectionName } from "@/app/utils/firebase";

// **データ追加**

export async function POST(request: NextRequest) {
  try {
    // トークンの検証を実施
    const decodedToken = await authenticateRequest(request);
    //デコードされたトークンをauthRequest.tsのauthenticateRequestから取得
    if (!decodedToken) {
      //デコードされたトークンが取得できなければ、エラー処理
      return NextResponse.json(
        { success: false, error: "認証できません: トークンが不正です" },
        { status: 401 }
      );
    }

    const data = await request.json(); //リクエストボディをJSON形式で取得
    const email = decodedToken.email; //トークンからemailを取得
    const db = getFirestore(firebaseAdmin); // データベースのインスタンスをfirebaseAdmin権限で取得

    // データを追加
    const docRef = await db.collection(collectionName).add({
      ...data,
      email,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error creating study:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
