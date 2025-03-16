// /app/user/updatepass/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { auth } from "@/app/utils/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import { getToken } from "@/app/utils/getToken";

const UpdatePass = () => {
  const [formState, setFormState] = useState({
    password: "",
    passwordConf: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  //ユーザがセッション中か否かの判定処理
  useEffect(() => {
    const authUser = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      const currentToken = await getToken();
      setToken(currentToken);
    });
    return () => {
      authUser();
    };
  }, []);

  // input入力値変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //パスワードを更新するボタンをクリックした時の処理
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.passwordConf) {
      toast.error("パスワードが一致しません");
      return;
    } else if (formState.password.length < 6) {
      toast.error("パスワードは6文字以上にしてください");
      return;
    }
    try {
      setLoading(true);
      const password = formState.password;
      const response = await fetch("/api/user/updatePass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unknown error");
      }
      console.log("User Signuped:", result);
      toast.success("パスワード更新が完了しました");
      router.push("/"); // updatePasswordが成功した場合にのみページ遷移
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
          <CardTitle>パスワード更新</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="新パスワードを入力"
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
                  placeholder="新パスワードを入力(確認)"
                  name="passwordConf"
                  value={formState.passwordConf}
                  required
                  className="pl-10 focus-visible:ring-0"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <Button
                type="submit"
                className="flex-1 font-bold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                パスワードを更新する
              </Button>
            </div>
          </form>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1"
            >
              戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default UpdatePass;
