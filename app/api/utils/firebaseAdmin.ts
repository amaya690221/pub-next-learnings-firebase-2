// /app/utils/firebaseAdmin.ts
//Firebase Admin SDKの初期化及び、Firebase Auth インスタンスを取得するコンポーネント

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is not defined");
}

export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, "\n"), // 改行文字を適切に処理
    }),
  });

export const auth = getAuth();
