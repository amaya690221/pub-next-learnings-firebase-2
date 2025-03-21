// /app/components/Delete.tsx
"use client";

import { useState } from "react";
import type { StudyData } from "../utils/studyData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react"; //Loader2追加

type Props = {
  learning: StudyData;
  loading: boolean; //追加
  deleteDb: (id: string) => Promise<void>; //追加
};

const Delete = ({ learning, deleteDb, loading }: Props) => {
  //受け取るprops、deleteDb、loadingの追加
  const [open, setOpen] = useState(false);

  //追加
  //データ削除時の処理
  const handleDelete = async () => {
    await deleteDb(learning.id as string);
    if (!loading) {
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/*ダイアログ開閉ボタン*/}
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">削除</span>
          </Button>
        </DialogTrigger>
        {/*ダイアログ本体*/}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データ削除</DialogTitle>
            <DialogDescription>以下のデータを削除します。</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              学習内容：{learning.title}、学習時間: {learning.time}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete} //変更
              disabled={loading} //追加
              className="text-white font-bold"
            >
              {loading ? ( //追加
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Delete;
