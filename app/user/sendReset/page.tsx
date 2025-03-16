// /app/user/sendReset/page.tsx
"use client";

import type React from "react";

import { auth } from "@/app/utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AtSign, Send, Loader2 } from "lucide-react";

const SendReset = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  //パスワードリセット申請処理
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // パスワードリセットメール送信
      await sendPasswordResetEmail(auth, email);
      toast.success("パスワード設定メールを確認してください");
      router.push("/user/login"); // sendPasswordResetEmailが成功した場合にのみページ遷移
    } catch (err: unknown) {
      console.error("Error during password reset:", err);
      toast.error("パスワード更新に失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>パスワードリセット申請</CardTitle>
          <CardDescription>
            入力したメールアドレス宛にパスワードリセットURLの案内をお送りします。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                type="email"
                placeholder="登録メールアドレスを入力"
                name="email"
                value={email}
                required
                className="pl-10 focus-visible:ring-0"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="submit"
                className="flex-1 font-bold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                リセット申請する
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                戻る
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default SendReset;
