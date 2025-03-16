// /app/api/user/updatePass/route.ts

import { NextRequest, NextResponse } from "next/server"; //next/serverよりリクエスト、レスポンスのインポート
import { authenticateRequest } from "../../utils/authRequest"; //トークン検証、デコード機能をインポート
import { auth } from "../../utils/firebaseAdmin"; //Firebase AuthenticationのインスタンスをfirebaseAdmin.tsからインポート

export async function POST(request: NextRequest) {
  try {
    // トークンの検証を実施
    const decodedToken = await authenticateRequest(request);

    if (!decodedToken) {
      //デコードしたトークンが存在しない場合、エラー処理
      return NextResponse.json(
        { success: false, error: "認証できません: トークンが不正です" },
        { status: 401 }
      );
    }

    const uid = decodedToken.uid; //トークンよりuidを抽出
    const body = await request.json(); //クライアントからのリクエストをJSON形式でbodyに格納
    const { password } = body; //bodyからpasswordを抽出

    if (!password) {
      //passwordが存在しなければ
      return NextResponse.json(
        //エラーをリターン
        { error: "Password are required" },
        { status: 400 }
      );
    }

    const userCredential = await auth.updateUser(uid, {
      //Admin SDKのupdateUserメソッドで該当uidのパスワードを更新
      password: password,
    });

    return NextResponse.json({
      //処理に成功すれば、成功メッセージをリターン
      message: "User Register successful",
      user: userCredential.email,
    });
  } catch (error: unknown) {
    //エラー発生の場合は、エラーをリターン
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
