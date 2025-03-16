// /app/utils/studyData.ts

export type StudyData = {
  id?: string; // FirestoreではIDが必須ではない
  email: string;
  title: string;
  time: number;
};
