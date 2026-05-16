// ─────────────────────────────────────────────────────────────
// Mock 年报生成器
//
// 实现 ReportGeneratorI 接口。
// 当前：用本地模板拼接，模拟生成过程，不调用任何 API。
//
// 接入真实 AI 时：
//   1. 新建 lib/aiReportGenerator.ts，实现同一个 ReportGeneratorI 接口
//   2. 在 GrowthReportApp.tsx 中把 mockGenerator 替换成 aiGenerator
//   3. 本文件可以保留用于开发/测试
//
// Skill 系统扩展点已标注 TODO，每个 skill 对应一个独立的 AI 调用：
//   - TODO[skill:keywords]      关键词提取 skill
//   - TODO[skill:summary]       成长总结生成 skill
//   - TODO[skill:timeline]      时间线结构化 skill
//   - TODO[skill:letter]        亲子信件生成 skill
//   - TODO[skill:social]        朋友圈文案生成 skill
//   - TODO[skill:video]         视频脚本生成 skill（未来）
//   - TODO[skill:illustration]  插画提示词生成 skill（未来）
// ─────────────────────────────────────────────────────────────

import { RawMaterial, ReportData, ReportGeneratorI, TimelineItem, SocialPost } from "./types";

class MockReportGenerator implements ReportGeneratorI {
  async generate(material: RawMaterial): Promise<ReportData> {
    // 模拟网络延迟，让 generating 状态可见
    await delay(1800);

    return {
      title: this.buildTitle(material),
      keywords: this.buildKeywords(material),     // TODO[skill:keywords]
      yearlySummary: this.buildSummary(material), // TODO[skill:summary]
      timeline: this.buildTimeline(material),     // TODO[skill:timeline]
      letter: this.buildLetter(material),         // TODO[skill:letter]
      socialPosts: this.buildSocialPosts(material), // TODO[skill:social]

      // TODO[skill:video] videoScript: undefined
      // TODO[skill:illustration] illustrationPrompts: undefined

      skillStatus: {
        keywords: "done",
        yearlySummary: "done",
        timeline: "done",
        letter: "done",
        socialPosts: "done",
      },
    };
  }

  // ── 标题 ──────────────────────────────────────────────────
  private buildTitle(m: RawMaterial): string {
    const name = m.childName || "宝贝";
    return `${name}的 ${m.reportYear} 成长礼物`;
  }

  // ── 关键词 ────────────────────────────────────────────────
  // TODO[skill:keywords]: 替换为 AI 从 qaList + freeNote 提取关键词
  private buildKeywords(m: RawMaterial): string[] {
    const name = m.childName || "宝贝";
    const age = m.childAge !== "" ? m.childAge : "?";
    const fromQ = m.qaList[0]?.answer ? smartSlice(m.qaList[0].answer, 6) : null;
    const defaults = [`${age}岁的${name}`, "认真成长", "被爱包围", "好奇世界", "温暖瞬间"];
    return fromQ ? [fromQ, ...defaults.slice(1)] : defaults;
  }

  // ── 成长总结 ──────────────────────────────────────────────
  // TODO[skill:summary]: 替换为 AI 根据 qaList + freeNote + style 生成 3-4 段总结
  private buildSummary(m: RawMaterial): string {
    const name = m.childName || "宝贝";
    const age = m.childAge !== "" ? m.childAge : "?";
    const q1 = m.qaList[0]?.answer ?? "";
    const q6 = m.qaList.find((q) => q.question.includes("最喜欢"))?.answer ?? "";
    const q2 = m.qaList[1]?.answer ?? "";
    const q8 = m.qaList.find((q) => q.question.includes("18 岁"))?.answer ?? "";

    const para1 = `${m.reportYear} 年，${name} ${age} 岁。` +
      (q1 ? `这一年，${safeSlice(q1, 30)}` : `这一年，${name} 在 ${m.parentName} 的陪伴下，悄悄又长大了一岁。`);

    const para2 = q6
      ? `这一年，${name} 最爱的是${safeSlice(q6, 20)}。每次看到 ${name} 沉浸其中的样子，${m.parentName} 心里都是满满的柔软。`
      : `这一年，${name} 对世界充满了好奇，每一个小小的发现都让 ${m.parentName} 感到惊喜。`;

    const para3 = q2
      ? `${m.parentName} 最难忘的，是${safeSlice(q2, 40)}`
      : `时间过得很快，转眼间又是一年。那些平凡的日子，因为有 ${name}，变得格外闪光。`;

    const para4 = q8
      ? `${m.parentName} 想对未来的 ${name} 说：${safeSlice(q8, 50)}`
      : m.freeNote
      ? `这一年，${m.parentName} 心里有太多话想说。${safeSlice(m.freeNote, 60)}`
      : `无论 ${name} 将来走到哪里，这一年的成长都已经悄悄刻在了生命里，永远不会消失。`;

    return [para1, para2, para3, para4].join("\n\n");
  }

  // ── 时间线 ────────────────────────────────────────────────
  // TODO[skill:timeline]: 替换为 AI 从 qaList + freeNote 结构化提取事件，自动判断时间节点
  private buildTimeline(m: RawMaterial): TimelineItem[] {
    const name = m.childName || "宝贝";
    if (m.qaList.length === 0) return defaultTimeline(name);

    const items: TimelineItem[] = [];

    const eventQ = m.qaList.find((q) =>
      q.question.includes("旅行") || q.question.includes("入学") || q.question.includes("生日")
    );
    if (eventQ) {
      items.push({ time: "年中", title: smartSlice(eventQ.answer, 12), description: safeSlice(eventQ.answer, 60) });
    }

    const abilityQ = m.qaList.find((q) => q.question.includes("新能力"));
    if (abilityQ) {
      items.push({ time: "成长", title: `学会了${smartSlice(abilityQ.answer, 8)}`, description: safeSlice(abilityQ.answer, 60) });
    }

    const quoteQ = m.qaList.find((q) => q.question.includes("哪句话"));
    if (quoteQ) {
      items.push({ time: "金句", title: `${name}说：「${smartSlice(quoteQ.answer, 12)}」`, description: quoteQ.answer });
    }

    const movingQ = m.qaList.find((q) => q.question.includes("感动"));
    if (movingQ) {
      items.push({ time: "感动", title: smartSlice(movingQ.answer, 12), description: safeSlice(movingQ.answer, 60) });
    }

    if (items.length < 3) {
      items.push(...defaultTimeline(name).slice(0, 3 - items.length));
    }

    return items.slice(0, 5);
  }

  // ── 亲子信件 ──────────────────────────────────────────────
  // TODO[skill:letter]: 替换为 AI 根据 style + qaList + freeNote 生成情感丰富的完整信件
  private buildLetter(m: RawMaterial): string {
    const name = m.childName || "宝贝";
    const age = m.childAge !== "" ? m.childAge : "?";
    const greetings: Record<string, string> = {
      warm: "亲爱的宝贝",
      playful: "嗨，小家伙",
      documentary: "致我们的孩子",
      literary: "给未来的你",
    };
    const greeting = greetings[m.style] ?? "亲爱的宝贝";

    const q8 = m.qaList.find((q) => q.question.includes("18 岁"))?.answer ?? "";
    const q7 = m.qaList.find((q) => q.question.includes("感动"))?.answer ?? "";
    const q1 = m.qaList[0]?.answer ?? "";

    const opening = `${greeting}，${name}：\n\n`;
    const body1 = `${m.reportYear} 年，你 ${age} 岁。` +
      (q1 ? `${m.parentName} 记得，这一年你${safeSlice(q1, 40)}。` : `这是 ${m.parentName} 认真陪着你走过的第 ${age} 年。`);
    const body2 = q7
      ? `\n\n${m.parentName} 最难忘的一刻，是${safeSlice(q7, 60)}。那个瞬间，${m.parentName} 突然意识到，你真的在一点一点长大了。`
      : `\n\n你每天都在给 ${m.parentName} 惊喜。那些小小的进步，那些软乎乎的拥抱，那些你说过又忘记的话，${m.parentName} 都认真记着。`;
    const body3 = m.freeNote
      ? `\n\n${safeSlice(m.freeNote, 80)}……`
      : `\n\n时间过得太快，快到 ${m.parentName} 有时候想把你这个样子永远留住。`;
    const q8section = q8
      ? `\n\n${safeSlice(q8, 100)}`
      : `\n\n希望你长大以后，还记得自己小时候有多被爱。希望你知道，无论走到哪里，${m.parentName} 永远是你最坚实的后盾。`;
    const closing = `\n\n爱你的 ${m.parentName}\n${m.reportYear} 年`;

    return opening + body1 + body2 + body3 + q8section + closing;
  }

  // ── 朋友圈文案 ────────────────────────────────────────────
  // TODO[skill:social]: 替换为 AI 生成多风格朋友圈文案，支持配图建议
  private buildSocialPosts(m: RawMaterial): SocialPost[] {
    const name = m.childName || "宝贝";
    const age = m.childAge !== "" ? m.childAge : "?";
    const q1 = m.qaList[0]?.answer ?? "";
    const q8 = m.qaList.find((q) => q.question.includes("18 岁"))?.answer ?? "";

    return [
      {
        title: "温暖版",
        content:
          `${name} ${age} 岁，${m.reportYear} 年的成长礼物已经制作好了。\n\n` +
          (q1 ? `这一年，${safeSlice(q1, 30)}……\n\n` : "") +
          `时间过得真快，每一年都舍不得让它就这么过去。\n\n` +
          `#成长记录 #${name}${age}岁 #给孩子的礼物`,
      },
      {
        title: "走心版",
        content:
          `写给 ${age} 岁的 ${name}，也写给 ${m.reportYear} 年的我们。\n\n` +
          (q8 ? `"${safeSlice(q8, 40)}……"\n\n` : `有一天你会长大，但我们会一直记得你现在的样子。\n\n`) +
          `愿这份礼物，能让你看见自己是如何被爱着长大的。\n\n` +
          `#${m.reportYear}成长年报 #致未来的${name}`,
      },
      {
        title: "简洁版",
        content:
          `${name}，${age} 岁，${m.reportYear}。\n` +
          `${m.parentName} 认真记录了你这一年。\n\n` +
          `这是给你的成长礼物 🎁\n\n` +
          `#成长礼物 #${name}的${m.reportYear}`,
      },
    ];
  }
}

// 导出单例
export const mockGenerator = new MockReportGenerator();

// ─────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 截取字符串，不超过 maxLen
function safeSlice(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "……";
}

// 尽量在标点处断开截取
function smartSlice(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  const puncts = ["，", "。", "、", "！", "？", ",", ".", "!"];
  for (let i = maxLen; i >= maxLen - 4 && i >= 0; i--) {
    if (puncts.includes(str[i])) return str.slice(0, i);
  }
  return str.slice(0, maxLen);
}

function defaultTimeline(name: string): TimelineItem[] {
  return [
    { time: "春天", title: "新的一年开始了", description: `${name} 迎来了新的一岁，眼神里满是对世界的好奇。` },
    { time: "夏天", title: "努力在成长", description: `炎热的夏天，${name} 学到了很多新东西，也有了很多第一次。` },
    { time: "秋天", title: "最爱的季节", description: `秋天的风吹过，${name} 说了好多让人心软的话。` },
    { time: "冬天", title: "这一年快结束了", description: `寒冷的冬天，${name} 依偎在家人怀里，又长大了一岁。` },
  ];
}
