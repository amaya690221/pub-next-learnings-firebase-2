// /app/user/register/page.tsx
"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/utils/firebase";
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
import { AtSign, Lock, Loader2 } from "lucide-react";

const Register = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    passwordConf: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // input入力値変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //登録するボタンクリック時処理
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formState.password !== formState.passwordConf) {
      toast.error("パスワードが一致しません");
      setLoading(false);
      return;
    } else if (formState.password.length < 6) {
      toast.error("パスワードは6文字以上にしてください");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
      console.log("User Signuped:", userCredential);
      toast.success("ユーザー登録が完了しました。");
      router.push("/");
    } catch (err: unknown) {
      toast.error("サインアップに失敗しました", {
        description: `${err}`,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>ユーザー登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  type="email"
                  placeholder="メールアドレスを入力"
                  name="email"
                  value={formState.email}
                  required
                  className="pl-10 focus-visible:ring-0"
                  onChange={handleInputChange}
                />
              </div>
              <CardDescription className="text-xs">
                パスワードは6文字以上
              </CardDescription>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="パスワードを入力"
                  name="password"
                  value={formState.password}
                  required
                  className="pl-10 focus-visible:ring-0"
                  onChange={handleInputChange}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="パスワードを入力(確認)"
                  name="passwordConf"
                  value={formState.passwordConf}
                  required
                  className="pl-10 focus-visible:ring-0"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                登録する
              </Button>
            </div>
          </form>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Register;
