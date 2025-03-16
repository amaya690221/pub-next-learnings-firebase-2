// /app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>404 - ページが見つかりません</CardTitle>
        </CardHeader>
        <CardContent className="text-left">
          <p className="mb-4">
            アクセスしようとしたページは存在しません。
            URLをご確認の上、再度アクセスしてください。
          </p>
          <Button
            variant="link"
            className="w-full font-bold"
            onClick={() => router.back()}
          >
            前に戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default NotFound;
