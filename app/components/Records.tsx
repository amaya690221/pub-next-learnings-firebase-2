// /app/components/Records.tsx
"use client";

import { useEffect, useState } from "react";
import Edit from "./Edit";
import Delete from "./Delete";
import NewEntry from "./NewEntry";
import { StudyData } from "../utils/studyData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../utils/firebase";
import { getToken } from "../utils/getToken";

const Records = () => {
  const [email, setEmail] = useState("");
  const [learnings, setLearnings] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  /** ユーザがセッション中か否かの判定処理 **/
  useEffect(() => {
    const authUser = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        setEmail(user.email as string);
        //awaitを利用してトークンの取得を実施
        const currentToken = await getToken();
        setToken(currentToken);
      } else {
        router.push("/user/login"); //userがセッション中でなければ/user/loginに移動
      }
    });
    return () => {
      authUser();
    };
  }, []);

  /***Firestoreデータ取得***/
  const fetchDb = async () => {
    //引数は無しに
    console.log("token:", token);
    console.log("currentUser:", auth.currentUser);
    try {
      const res = await fetch("/api/records/read", {
        method: "GET",
        headers: {
          //ヘッダにトークン情報を付与
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        console.log("fetchStudies:", email, data);
        setLearnings(data.data);
      } else {
        console.error("fetchStudiesError", email, data);
        throw new Error(data.error || "Failed to fetch studies.");
      }
    } catch (err: unknown) {
      console.error("Error in fetchStudies:", err);
      toast.error("データ取得に失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Firestoreデータ新規登録 **/
  const entryDb = async (study: StudyData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/records/create", {
        method: "POST",
        body: JSON.stringify({
          title: study.title,
          time: study.time,
          email: email,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //ヘッダにトークン情報を付与
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        await fetchDb();
        toast.success("データ登録が完了しました");
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      toast.error("データ登録に失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  /**Firestoreデータ更新**/
  const updateDb = async (learnings: StudyData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/records/update", {
        method: "PUT",
        body: JSON.stringify(learnings),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //ヘッダにトークン情報を付与
        },
      });
      const data = await res.json();
      if (data.success) {
        await fetchDb();
        toast.success("データ更新が完了しました");
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      toast.error("データ更新に失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Firestoreデータ削除 **/
  const deleteDb = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/records/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //ヘッダにトークン情報を付与
        },
      });
      const data = await res.json();
      if (data.success) {
        await fetchDb(); // 引数は無しで
        toast.success("データを削除しました");
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      toast.error("データ削除に失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  //Firestore確認
  useEffect(() => {
    if (email) {
      fetchDb(); // 引数は無しで
      console.log("useEffectFirestore:", email, user);
    }
  }, [user]); // userが更新された時のみ実行

  /**ログアウト処理 **/
  const handleLogout = async () => {
    setLoading(true);
    try {
      const usertLogout = await auth.signOut();
      console.log("User Logout:", usertLogout);
      toast.success("ログアウトしました");
      router.push("/user/login");
    } catch (err: unknown) {
      console.error("Error during logout:", err);
      toast.error("ログアウトに失敗しました", {
        description: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  /**学習時間合計**/
  const calculateTotalTime = () => {
    return learnings.reduce((total, learning) => total + learning.time, 0);
  };

  return (
    <div className="flex items-center justify-center p-5">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mb-2 mt-10">ようこそ！{email} さん</div>
          <CardTitle>Learning Records</CardTitle>
        </CardHeader>
        <CardContent>
          {/*学習記録表示 */}
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">学習記録</h3>
            {loading && (
              <div className="p-10 flex justify-center">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>学習内容</TableHead>
                    <TableHead>時間(分)</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {learnings.map((learning, index) => (
                    <TableRow key={index}>
                      <TableCell>{learning.title}</TableCell>
                      <TableCell>{learning.time}</TableCell>
                      <TableCell>
                        <Edit
                          learning={learning}
                          updateDb={updateDb}
                          loading={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Delete
                          learning={learning}
                          deleteDb={deleteDb}
                          loading={loading}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {!loading && (
            <div className="p-5">
              <div>合計学習時間：{calculateTotalTime()}分</div>
            </div>
          )}

          {/*データ新規登録*/}
          <div className="p-6">
            <NewEntry
              learnings={learnings}
              loading={loading}
              updateDb={updateDb}
              entryDb={entryDb}
            />
          </div>

          {/* ログアウト*/}
          <div className="px-6 mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full font-bold">
                  ログアウト
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログアウト</AlertDialogTitle>
                  <AlertDialogDescription>
                    ログアウトしますか?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-destructive text-white font-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 text-secondary" />
                    ) : null}
                    ログアウト
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/*パスワード更新 */}
          <div className="px-6 mb-4">
            <Button
              variant="outline"
              className="w-full font-bold"
              onClick={() => router.push("/user/updatePass")}
            >
              パスワード更新
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Records;
