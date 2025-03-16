// /app/user/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/utils/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AtSign, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 入力値変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userLogin = await signInWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
      console.log("User Logined:", userLogin);
      toast.success("ログインしました");
      router.push("/");
    } catch (err: unknown) {
      console.error("Error during sign up:", err);
      toast.error("ログインに失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                ログイン
              </Button>
            </div>
          </form>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full font-bold"
              onClick={() => router.push("/user/register")}
            >
              新規登録
            </Button>
            <Button
              variant="ghost"
              className="w-full font-bold"
              onClick={() => router.push("/user/sendReset")}
            >
              パスワードをお忘れですか？
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
