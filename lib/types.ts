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

// 单条访谈问题（标签可编辑、可删除、可自定义新增）
export type InterviewQuestion = {
  id: string;
  label: string;   // 问题标题，用户可修改
  answer: string;  // 用户填写的回答
};

// 表单输入（避免与浏览器原生 FormData 冲突，使用 GrowthReportFormData）
export type GrowthReportFormData = {
  childName: string;
  childAge: number | "";
  reportYear: number;
  parentName: string;
  style: "warm" | "playful" | "documentary" | "literary";
  photos: PhotoItem[];
  questions: InterviewQuestion[]; // 访谈问题列表（可增删改）
  freeNote: string;               // 自由文本区：日记、备忘录等
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
