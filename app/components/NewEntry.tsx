// /app/components/NewEntry.tsx
"use client";

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
import { Loader2 } from "lucide-react"; //追加
import { toast } from "sonner"; //追加

type Props = {
  learnings: StudyData[];
  loading: boolean; //追加
  updateDb: (data: StudyData) => Promise<void>; //追加
  entryDb: (data: StudyData) => Promise<void>; //追加
};

const NewEntry = ({ learnings, loading, updateDb, entryDb }: Props) => {
  //props、 loading, updateDb, entryDb追加
  const [entryLearning, setEntryLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
    email: "",
  });
  const [open, setOpen] = useState(false);

  //追加：input入力時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEntryLearning({
      ...entryLearning,
      [name]: name === "time" ? Number(value) : value,
    });
  };

  //追加：登録ボタンクリック時の処理
  const handleEntry = async () => {
    if (entryLearning.title !== "" && entryLearning.time > 0) {
      if (learnings.some((l) => l.title === entryLearning.title)) {
        const existingLearning = learnings.find(
          (l) => l.title === entryLearning.title
        );
        if (existingLearning) {
          existingLearning.time += entryLearning.time;
          await updateDb(existingLearning);
        }
      } else {
        await entryDb(entryLearning);
      }
      setEntryLearning({ id: "", title: "", time: 0, email: "" });
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
          <Button className="w-full font-bold">新規データ登録</Button>
        </DialogTrigger>

        {/*ダイアログ本体*/}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規データ登録</DialogTitle>
            <DialogDescription>
              学習内容と時間を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                学習内容
              </label>
              <Input
                id="title"
                name="title"
                value={entryLearning.title}
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
                value={entryLearning.time}
                onChange={handleInputChange} //変更
                className="col-span-3 focus-visible:ring-0"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <div>入力されている学習内容：{entryLearning.title}</div>
              <div>入力されている学習時間：{entryLearning.time}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleEntry} //変更
              disabled={loading} //追加
              className="font-bold"
            >
              {loading ? ( //追加
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default NewEntry;
