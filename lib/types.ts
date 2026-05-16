// 照片项：浏览器本地预览，不上传服务器
export type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string; // URL.createObjectURL 生成
};

// 时间线事件
export type TimelineItem = {
  time: string;        // 如 "3月"、"暑假"
  title: string;
  description: string;
};

// 朋友圈文案
export type SocialPost = {
  title: string;
  content: string;
};

// 表单输入（避免与浏览器原生 FormData 冲突，使用 GrowthReportFormData）
export type GrowthReportFormData = {
  childName: string;
  childAge: number | "";
  reportYear: number;
  parentName: string;
  style: "warm" | "playful" | "documentary" | "literary";
  photos: PhotoItem[];
  q1: string; // 今年孩子最大的变化是什么？
  q2: string; // 今年最让你印象深刻的一件事是什么？
  q3: string; // 今年孩子学会了什么新能力？
  q4: string; // 今年孩子说过哪句话让你印象很深？
  q5: string; // 今年有没有一次重要旅行、生日、入学或家庭事件？
  q6: string; // 今年孩子最喜欢什么？
  q7: string; // 今年你作为父母最感动的一刻是什么？
  q8: string; // 你想对 18 岁的孩子说什么？
};

// 年报输出
export type ReportData = {
  title: string;
  keywords: string[];
  yearlySummary: string;
  timeline: TimelineItem[];
  letter: string;
  socialPosts: SocialPost[];
};

// 应用状态
export type AppState = "landing" | "input" | "generating" | "result";
