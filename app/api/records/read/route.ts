//  /app/api/records/read/route.ts

import { NextRequest, NextResponse } from "next/server";
import { StudyData } from "@/app/utils/studyData";
import { authenticateRequest } from "../../utils/authRequest";
import { getFirestore } from "firebase-admin/firestore"; //クライアント SDK (`firebase/firestore`) から Admin SDK (`firebase-admin/firestore`) に移行、より強力な権限とセキュリティ機能を利用可能に
import { firebaseAdmin } from "../../utils/firebaseAdmin";
import { collectionName } from "@/app/utils/firebase";

// **データ取得**

export async function GET(request: NextRequest) {
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

    console.log("decodedToken: ", decodedToken); //コンソールにトークン表示
    const email = decodedToken.email; // トークンからemailを取得
    const db = getFirestore(firebaseAdmin); // データベースのインスタンスをfirebaseAdmin権限で取得

    // firestoreDBのコレクション、collectionNameよりデータ取得、emailでフィルタリング
    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", email)
      .get();

    const studies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as StudyData[];

    return NextResponse.json({ success: true, data: studies }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching studies:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
