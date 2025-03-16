// /app/components/Edit.tsx
"use client";

import type React from "react";
import { useState } from "react";
import type { StudyData } from "../utils/studyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon, Loader2 } from "lucide-react"; //Loader2追加
import { toast } from "sonner"; //追加

type Props = {
  learning: StudyData;
  loading: boolean; //追加
  updateDb: (data: StudyData) => Promise<void>; //追加
};

const Edit = ({ learning, updateDb, loading }: Props) => {
  //updateDb, loading追加
  const [updateLearning, setUpdateLearning] = useState(learning);
  const [open, setOpen] = useState(false);

  //追加
  //input変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateLearning({
      ...updateLearning,
      [name]: name === "time" ? Number(value) : value,
    });
  };

  //追加
  //更新ボタンクリック時の処理
  const handleUpdate = async () => {
    if (updateLearning.title !== "" && updateLearning.time > 0) {
      await updateDb(updateLearning);
      if (!loading) {
        setOpen(false);
      }
    } else {
      toast.error("学習内容と時間を入力してください");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/*ダイアログ開閉ボタン*/}
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <EditIcon className="h-4 w-4" />
            <span className="sr-only">編集</span>
          </Button>
        </DialogTrigger>

        {/*ダイアログ本体*/}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>記録編集</DialogTitle>
            <DialogDescription>学習内容と時間を編集できます</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                学習内容
              </label>
              <Input
                id="title"
                name="title"
                value={updateLearning.title}
                onChange={handleInputChange} //変更
                className="col-span-3 focus-visible:ring-0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right">
                学習時間
              </label>
              <Input
                id="time"
                name="time"
                type="number"
                value={updateLearning.time}
                onChange={handleInputChange} //変更
                className="col-span-3 focus-visible:ring-0"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <div>入力されている学習内容：{updateLearning.title}</div>
              <div>入力されている学習時間：{updateLearning.time}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleUpdate} //変更
              disabled={loading} //追加
              className="font-bold"
            >
              {loading ? ( //追加
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              データを更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Edit;
