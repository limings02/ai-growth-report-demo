// lib/server/parseReportJson.ts
import { ReportData, TimelineItem, SocialPost } from "@/lib/types";

const DEFAULT_KEYWORDS = ["认真成长", "被爱包围", "好奇世界", "温暖瞬间", "珍贵记忆"];

const DEFAULT_TIMELINE: TimelineItem[] = [
  { time: "春天", title: "新的一年开始了", description: "在家人的陪伴下，迎来新的一岁。" },
  { time: "夏天", title: "努力成长中", description: "炎热的夏天，学到了很多新东西。" },
  { time: "秋天", title: "丰收的季节", description: "秋天的风里，留下了很多珍贵的瞬间。" },
];

const DEFAULT_SOCIAL_POSTS: SocialPost[] = [
  { title: "温暖版", content: "孩子又长大了一岁，每一年都舍不得让它就这么过去。\n\n#成长记录 #给孩子的礼物" },
  { title: "走心版", content: "有一天，孩子会看见自己是如何被爱着长大的。这是我们给你的礼物。\n\n#致未来的你" },
  { title: "简洁版", content: "记录这一年，留给未来的你。🎁" },
];

// 从模型返回文本中提取 JSON（兼容偶尔包裹 ```json 的情况）
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1];
  return trimmed;
}

export function parseReportJson(raw: string, childName: string, reportYear: number): ReportData {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(extractJson(raw)) as Record<string, unknown>;
  } catch {
    throw new Error("AI 返回格式解析失败，请重试");
  }

  const str = (v: unknown, fallback = ""): string =>
    typeof v === "string" && v.trim() !== "" ? v : fallback;

  const strArr = (v: unknown, fallback: string[]): string[] => {
    if (Array.isArray(v) && v.length > 0) {
      return (v as unknown[])
        .filter((item) => typeof item === "string" && (item as string).trim() !== "")
        .map(String);
    }
    return fallback;
  };

  // keywords：至少 3 个
  let keywords = strArr(parsed.keywords, DEFAULT_KEYWORDS);
  if (keywords.length < 3) {
    const extra = DEFAULT_KEYWORDS.filter((k) => !keywords.includes(k));
    keywords = [...keywords, ...extra].slice(0, 5);
  }

  // timeline：至少 3 条
  let timeline: TimelineItem[] = DEFAULT_TIMELINE;
  if (Array.isArray(parsed.timeline) && parsed.timeline.length >= 3) {
    timeline = (parsed.timeline as unknown[]).map((item) => {
      const t = item as Record<string, unknown>;
      return {
        time: str(t.time, "某个时刻"),
        title: str(t.title, "成长瞬间"),
        description: str(t.description, ""),
      };
    });
  }

  // socialPosts：至少 3 条
  let socialPosts: SocialPost[] = DEFAULT_SOCIAL_POSTS;
  if (Array.isArray(parsed.socialPosts) && parsed.socialPosts.length >= 3) {
    socialPosts = (parsed.socialPosts as unknown[]).map((item) => {
      const p = item as Record<string, unknown>;
      return {
        title: str(p.title, "版本"),
        content: str(p.content, ""),
      };
    });
  }

  return {
    title: str(parsed.title, `${childName}的 ${reportYear} 成长礼物`),
    keywords,
    yearlySummary: str(parsed.yearlySummary, `${reportYear} 年，${childName} 又长大了一岁。`),
    timeline,
    letter: str(parsed.letter, `亲爱的 ${childName}，这是 ${reportYear} 年，爸爸妈妈写给你的话。`),
    socialPosts,
    skillStatus: {
      keywords: "done",
      yearlySummary: "done",
      timeline: "done",
      letter: "done",
      socialPosts: "done",
    },
  };
}
