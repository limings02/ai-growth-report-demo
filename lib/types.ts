// ─────────────────────────────────────────────────────────────
// 表单输入层
// ─────────────────────────────────────────────────────────────

// 照片项：浏览器本地预览，不上传服务器
export type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string; // URL.createObjectURL 生成
};

// 单条访谈问题（标签可编辑、可删除、可自定义新增）
export type InterviewQuestion = {
  id: string;
  label: string;   // 问题标题，用户可修改
  answer: string;  // 用户填写的回答
};

// 表单输入（避免与浏览器原生 FormData 冲突）
export type GrowthReportFormData = {
  childName: string;
  childAge: number | "";
  reportYear: number;
  parentName: string;
  style: "warm" | "playful" | "documentary" | "literary";
  photos: PhotoItem[];
  questions: InterviewQuestion[]; // 访谈问题（可增删改）
  freeNote: string;               // 自由文本：日记、备忘录等
};

// ─────────────────────────────────────────────────────────────
// 原始材料层（Raw Material）
// 从表单提取后存储，是 AI 生成的输入，也是年报里"保留原始记录"的部分
// ─────────────────────────────────────────────────────────────

export type RawMaterial = {
  // 孩子基本信息
  childName: string;
  childAge: number | "";
  reportYear: number;
  parentName: string;
  style: GrowthReportFormData["style"];

  // 照片（仅 previewUrl，File 对象不序列化）
  photoUrls: string[];

  // 访谈问答对（过滤掉空回答）
  qaList: { question: string; answer: string }[];

  // 自由文本原文
  freeNote: string;
};

// ─────────────────────────────────────────────────────────────
// AI 生成结果层（Generated Content）
// 每个字段都是一个独立 skill 的输出，可以单独重新生成
// ─────────────────────────────────────────────────────────────

export type TimelineItem = {
  time: string;        // 如 "3月"、"暑假"
  title: string;
  description: string;
};

export type SocialPost = {
  title: string;   // 如 "温暖版"、"走心版"
  content: string;
};

// 单个 skill 的生成状态
export type SkillStatus = "pending" | "generating" | "done" | "error";

export type ReportData = {
  title: string;
  keywords: string[];
  yearlySummary: string;
  timeline: TimelineItem[];
  letter: string;
  socialPosts: SocialPost[];

  // TODO: 后续 skill 系统扩展点
  // videoScript?: string;       // 视频脚本 skill
  // illustrationPrompts?: string[]; // 插画生成 skill
  // voiceLetter?: string;       // 语音信件 skill

  // 各 skill 的生成状态（用于 UI 展示进度）
  skillStatus: {
    keywords: SkillStatus;
    yearlySummary: SkillStatus;
    timeline: SkillStatus;
    letter: SkillStatus;
    socialPosts: SkillStatus;
  };
};

// ─────────────────────────────────────────────────────────────
// 生成器接口（Generator Interface）
// mock 和真实 AI 都实现这个接口，切换时只需替换实现
// ─────────────────────────────────────────────────────────────

export interface ReportGeneratorI {
  generate(material: RawMaterial): Promise<ReportData>;
}

// ─────────────────────────────────────────────────────────────
// 应用状态
// ─────────────────────────────────────────────────────────────

export type AppState = "landing" | "input" | "generating" | "result";
