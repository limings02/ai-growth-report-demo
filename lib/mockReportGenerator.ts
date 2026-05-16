// 纯函数：不操作 DOM，不读写 localStorage，不发请求
// 根据用户填写内容生成 mock 年报，后续可替换为真实 AI API

import { GrowthReportFormData, ReportData, TimelineItem, SocialPost } from "./types";

// 风格对应的语气描述，用于调整文案
const styleConfig = {
  warm:         { tone: "温暖细腻", greeting: "亲爱的宝贝" },
  playful:      { tone: "俏皮活泼", greeting: "嗨，小家伙" },
  documentary:  { tone: "真实深情", greeting: "致我们的孩子" },
  literary:     { tone: "诗意悠远", greeting: "给未来的你" },
};

export function generateMockReport(formData: GrowthReportFormData): ReportData {
  const { childName, childAge, reportYear, parentName, style, questions, freeNote } = formData;

  const name = childName || "宝贝";
  const age = childAge !== "" ? childAge : "?";
  const cfg = styleConfig[style];

  // 收集用户填写的有效回答
  const answers = questions.filter((q) => q.answer.trim() !== "");
  const hasAnswers = answers.length > 0;

  // ── 年报标题 ──────────────────────────────────────────────
  const title = `${name}的 ${reportYear} 成长礼物`;

  // ── 年度关键词 ────────────────────────────────────────────
  // 从回答中提取关键词，不足则用默认词补足
  const keywords = extractKeywords(answers.map((a) => a.answer), name, age as number);

  // ── 年度成长总结 ──────────────────────────────────────────
  const yearlySummary = buildSummary({ name, age, reportYear, parentName, cfg, answers, freeNote });

  // ── 重要瞬间时间线 ────────────────────────────────────────
  const timeline = buildTimeline(answers, name, hasAnswers);

  // ── 父母写给孩子的一封信 ──────────────────────────────────
  const letter = buildLetter({ name, age, reportYear, parentName, cfg, answers, freeNote });

  // ── 朋友圈文案 3 版本 ─────────────────────────────────────
  const socialPosts = buildSocialPosts({ name, age, reportYear, parentName, style, answers });

  return { title, keywords, yearlySummary, timeline, letter, socialPosts };
}

// ─────────────────────────────────────────────────────────────
// 内部函数
// ─────────────────────────────────────────────────────────────

function extractKeywords(
  answers: string[],
  name: string,
  age: number | "?"
): string[] {
  // 从第一条回答里截取前几个字作为关键词之一
  const fromAnswer = answers[0]
    ? smartSlice(answers[0], 6)
    : null;

  const defaults = [
    `${age}岁的${name}`,
    "认真成长",
    "被爱包围",
    "好奇世界",
    "温暖瞬间",
  ];

  const base: string[] = fromAnswer ? [fromAnswer, ...defaults.slice(1)] : defaults;
  return base.slice(0, 5);
}

function buildSummary({
  name, age, reportYear, parentName, cfg, answers, freeNote,
}: {
  name: string;
  age: number | "?";
  reportYear: number;
  parentName: string;
  cfg: { tone: string; greeting: string };
  answers: { label: string; answer: string }[];
  freeNote: string;
}): string {
  const q1 = answers[0]?.answer ?? "";
  const q2 = answers[1]?.answer ?? "";
  const q6 = answers.find((a) => a.label.includes("最喜欢"))?.answer ?? "";
  const q8 = answers.find((a) => a.label.includes("18 岁"))?.answer ?? "";

  const para1 = `${reportYear} 年，${name} ${age} 岁。` +
    (q1
      ? `这一年，${q1.length > 30 ? q1.slice(0, 30) + "……" : q1}`
      : `这一年，${name} 在${parentName}的陪伴下，悄悄又长大了一岁。`);

  const para2 = q6
    ? `这一年，${name} 最爱的是${q6.length > 20 ? q6.slice(0, 20) + "……" : q6}。每次看到${name}沉浸其中的样子，${parentName}心里都是满满的柔软。`
    : `这一年，${name}对世界充满了好奇，每一个小小的发现都让${parentName}感到惊喜。`;

  const para3 = q2
    ? `${parentName}最难忘的，是${q2.length > 40 ? q2.slice(0, 40) + "……" : q2}`
    : `时间过得很快，转眼间又是一年。那些平凡的日子，因为有${name}，变得格外闪光。`;

  const para4 = q8
    ? `${parentName}想对未来的${name}说：${q8.length > 50 ? q8.slice(0, 50) + "……" : q8}`
    : freeNote
    ? `这一年，${parentName}心里有太多话想说。${freeNote.slice(0, 60)}……`
    : `无论${name}将来走到哪里，这一年的成长都已经悄悄刻在了生命里，永远不会消失。`;

  return [para1, para2, para3, para4].join("\n\n");
}

function buildTimeline(
  answers: { label: string; answer: string }[],
  name: string,
  hasAnswers: boolean
): TimelineItem[] {
  if (!hasAnswers) {
    return defaultTimeline(name);
  }

  const items: TimelineItem[] = [];

  // 优先从有实质内容的回答里提取时间线
  const eventAnswer = answers.find((a) =>
    a.label.includes("旅行") || a.label.includes("入学") || a.label.includes("生日")
  );
  if (eventAnswer) {
    items.push({
      time: "年中",
      title: smartSlice(eventAnswer.answer, 12),
      description: eventAnswer.answer.length > 30
        ? eventAnswer.answer.slice(0, 60) + "……"
        : eventAnswer.answer,
    });
  }

  const abilityAnswer = answers.find((a) => a.label.includes("新能力"));
  if (abilityAnswer) {
    items.push({
      time: "成长",
      title: `学会了${smartSlice(abilityAnswer.answer, 8)}`,
      description: abilityAnswer.answer.length > 30
        ? abilityAnswer.answer.slice(0, 60) + "……"
        : abilityAnswer.answer,
    });
  }

  const quoteAnswer = answers.find((a) => a.label.includes("哪句话"));
  if (quoteAnswer) {
    items.push({
      time: "金句",
      title: `${name}说：「${smartSlice(quoteAnswer.answer, 12)}」`,
      description: quoteAnswer.answer,
    });
  }

  const movingAnswer = answers.find((a) => a.label.includes("感动"));
  if (movingAnswer) {
    items.push({
      time: "感动",
      title: smartSlice(movingAnswer.answer, 12),
      description: movingAnswer.answer.length > 40
        ? movingAnswer.answer.slice(0, 60) + "……"
        : movingAnswer.answer,
    });
  }

  // 补足到至少 3 条
  if (items.length < 3) {
    items.push(...defaultTimeline(name).slice(0, 3 - items.length));
  }

  return items.slice(0, 5);
}

function defaultTimeline(name: string): TimelineItem[] {
  return [
    { time: "春天", title: "新的一年开始了", description: `${name}迎来了新的一岁，眼神里满是对世界的好奇。` },
    { time: "夏天", title: "努力在成长", description: `炎热的夏天，${name}学到了很多新东西，也有了很多第一次。` },
    { time: "秋天", title: "最爱的季节", description: `秋天的风吹过，${name}说了好多让人心软的话。` },
    { time: "冬天", title: "这一年快结束了", description: `寒冷的冬天，${name}依偎在家人怀里，又长大了一岁。` },
  ];
}

function buildLetter({
  name, age, reportYear, parentName, cfg, answers, freeNote,
}: {
  name: string;
  age: number | "?";
  reportYear: number;
  parentName: string;
  cfg: { tone: string; greeting: string };
  answers: { label: string; answer: string }[];
  freeNote: string;
}): string {
  const q8 = answers.find((a) => a.label.includes("18 岁"))?.answer ?? "";
  const q7 = answers.find((a) => a.label.includes("感动"))?.answer ?? "";
  const q1 = answers[0]?.answer ?? "";

  const opening = `${cfg.greeting}，${name}：\n\n`;

  const body1 = `${reportYear} 年，你 ${age} 岁。` +
    (q1
      ? `${parentName}记得，这一年你${q1.slice(0, 40)}。`
      : `这是${parentName}认真陪着你走过的第 ${age} 年。`);

  const body2 = q7
    ? `\n\n${parentName}最难忘的一刻，是${q7.slice(0, 60)}。那个瞬间，${parentName}突然意识到，你真的在一点一点长大了。`
    : `\n\n你每天都在给${parentName}惊喜。那些小小的进步，那些软乎乎的拥抱，那些你说过又忘记的话，${parentName}都认真记着。`;

  const body3 = freeNote
    ? `\n\n${freeNote.slice(0, 80)}……`
    : `\n\n时间过得太快，快到${parentName}有时候想把你这个样子永远留住。`;

  const q8section = q8
    ? `\n\n${q8.slice(0, 100)}`
    : `\n\n希望你长大以后，还记得自己小时候有多被爱。希望你知道，无论走到哪里，${parentName}永远是你最坚实的后盾。`;

  const closing = `\n\n爱你的 ${parentName}\n${reportYear} 年`;

  return opening + body1 + body2 + body3 + q8section + closing;
}

function buildSocialPosts({
  name, age, reportYear, parentName, style, answers,
}: {
  name: string;
  age: number | "?";
  reportYear: number;
  parentName: string;
  style: string;
  answers: { label: string; answer: string }[];
}): SocialPost[] {
  const q1 = answers[0]?.answer ?? "";
  const q8 = answers.find((a) => a.label.includes("18 岁"))?.answer ?? "";

  const posts: SocialPost[] = [
    {
      title: "温暖版",
      content: `${name} ${age} 岁，${reportYear} 年的成长礼物已经制作好了。\n\n` +
        (q1 ? `这一年，${q1.slice(0, 30)}……\n\n` : "") +
        `时间过得真快，每一年都舍不得让它就这么过去。\n\n` +
        `#成长记录 #${name}${age}岁 #给孩子的礼物`,
    },
    {
      title: "走心版",
      content: `写给 ${age} 岁的${name}，也写给 ${reportYear} 年的我们。\n\n` +
        (q8 ? `"${q8.slice(0, 40)}……"\n\n` : `有一天你会长大，但我们会一直记得你现在的样子。\n\n`) +
        `愿这份礼物，能让你看见自己是如何被爱着长大的。\n\n` +
        `#${reportYear}成长年报 #致未来的${name}`,
    },
    {
      title: "简洁版",
      content: `${name}，${age} 岁，${reportYear}。\n` +
        `${parentName}认真记录了你这一年。\n\n` +
        `这是给你的成长礼物 🎁\n\n` +
        `#成长礼物 #${name}的${reportYear}`,
    },
  ];

  return posts;
}

// 智能截取字符串，尽量在标点处断开
function smartSlice(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  const punctuations = ["，", "。", "、", "！", "？", ",", ".", "!"];
  for (let i = maxLen; i >= maxLen - 4 && i >= 0; i--) {
    if (punctuations.includes(str[i])) return str.slice(0, i);
  }
  return str.slice(0, maxLen);
}
