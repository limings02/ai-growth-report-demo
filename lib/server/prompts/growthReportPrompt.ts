// lib/server/prompts/growthReportPrompt.ts
import { RawMaterial } from "@/lib/types";

const STYLE_DESCRIPTIONS: Record<string, string> = {
  warm: "温暖细腻，像妈妈写给孩子的日记，充满柔软的爱意",
  playful: "俏皮活泼，有童趣，像从孩子视角看世界",
  documentary: "真实深情，克制但有力，像一份认真的成长档案",
  literary: "诗意悠远，有文学质感，像写给未来的一封长信",
};

export function buildGrowthReportPrompt(material: RawMaterial): string {
  const styleName = STYLE_DESCRIPTIONS[material.style] ?? STYLE_DESCRIPTIONS.warm;
  const age = material.childAge !== "" ? `${material.childAge} 岁` : "（年龄未填）";

  const qaSection =
    material.qaList.length > 0
      ? material.qaList
          .map((qa, i) => `问题${i + 1}：${qa.question}\n回答：${qa.answer}`)
          .join("\n\n")
      : "（用户未填写访谈问答）";

  const freeNoteSection = material.freeNote.trim()
    ? `\n\n【自由记录 / 日记原文】\n${material.freeNote}`
    : "";

  return `你是一位专业的家庭记忆整理师和儿童成长记录编辑。你的工作是帮助年轻父母，把他们提供的真实材料，整理成一份孩子长大后会珍藏的成长礼物。

【重要原则】
1. 必须严格基于用户提供的材料，禁止编造用户没有提到的具体事件、地点、疾病、人物、成绩。
2. 如果某个字段信息不足，可以做温和的总结性表达，但绝不虚构细节。
3. 文风要${styleName}。
4. 整体基调：温暖、真实、克制，不要油腻、不要煽情过度。
5. 面向读者：这份内容未来会被孩子本人读到，要经得起时间考验。

【孩子信息】
- 昵称：${material.childName}
- 年龄：${age}
- 总结年份：${material.reportYear} 年
- 父母称呼：${material.parentName}

【父母的回答】
${qaSection}${freeNoteSection}

【输出要求】
请输出严格的 JSON，不要输出 Markdown，不要输出代码块，不要输出任何解释性文字，直接输出 JSON 对象。

JSON 结构如下：
{
  "title": "孩子昵称 + 年份 + 成长礼物，例如：小熊宝的 2024 成长礼物",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "yearlySummary": "3-4 段，每段用\\n\\n分隔，基于用户填写内容的年度成长总结",
  "timeline": [
    { "time": "时间描述，如3月、暑假、年底", "title": "简短事件标题", "description": "1-2句事件描述" }
  ],
  "letter": "父母写给孩子的一封信，署名用父母称呼，结尾标注年份",
  "socialPosts": [
    { "title": "温暖版", "content": "适合发朋友圈的温暖文案，含话题标签" },
    { "title": "走心版", "content": "更深情的文案，适合配照片" },
    { "title": "简洁版", "content": "简短有力的版本" }
  ]
}

要求：
- keywords：3-5 个，从材料中提炼，不要泛泛的词
- yearlySummary：至少 200 字，基于真实回答内容
- timeline：3-5 条，从用户的回答中提取真实事件，信息不足时可以做季节性总结
- letter：至少 200 字，有温度，不煽情，对孩子说话的口吻
- socialPosts：3 条，每条风格不同`;
}
