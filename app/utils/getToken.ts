// /app/utils/getToken.ts
//クライアント側でセッショントークンを取得する処理

import { getIdToken, User } from "firebase/auth"; //Firebase SDKのインポート
import { auth } from "./firebase"; //Firebaseクライアントから認証機能のインポート

export const getToken = async () => {
  //Firebase SDKのgetIdTokenメソッドでトークン取得
  const token = await getIdToken(auth.currentUser as User);
  return token; //トークンをリターン
};
