// /app/api/utils/authRequest.ts
//トークン取得、検証、デコードを行うコンポーネント

import { NextRequest, NextResponse } from "next/server";
import { auth, firebaseAdmin } from "./firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";

export async function authenticateRequest(
  request: NextRequest
): Promise<DecodedIdToken | null> {
  //呼び出し側で型エラーが出た為、返り値、decodedTokenの型を明示
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    NextResponse.json(
      { success: false, error: "認証できません: トークンが無いか不正です" },
      { status: 401 }
    );
    return null;
  }

  const token = authHeader.split(" ")[1]; // トークンを取得

  if (!firebaseAdmin) {
    throw new Error("Firebase Admin is not initialized");
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken; // 検証成功時、トークンに含まれるユーザー情報を返す
  } catch (error) {
    console.error("Token verification error:", error);
    NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 401 }
    );
    return null;
  }
}
