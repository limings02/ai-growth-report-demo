// lib/domains/memorial/defaultQuestions.ts
// memorial mode 的默认访谈问题。
// 面向家族纪念册材料采集，不做心理咨询，不模拟逝者语气。

export const MEMORIAL_DEFAULT_QUESTIONS = [
  {
    id: "who",
    question: "你想纪念的人是谁？你们是什么关系？",
  },
  {
    id: "most-memorable",
    question: "你最想保留下 ta 的哪一面？",
  },
  {
    id: "scene",
    question: "有没有一个具体场景，最能代表 ta？",
  },
  {
    id: "habit",
    question: "ta 常说的一句话，或一个习惯是什么？",
  },
  {
    id: "connections",
    question: "ta 和家庭、朋友、同事之间有什么重要连接？",
  },
  {
    id: "sensory-anchor",
    question: "有没有一个物品、地点、声音或味道会让你想到 ta？",
  },
  {
    id: "for-posterity",
    question: "如果把 ta 的一生整理给后辈看，你希望他们记住什么？",
  },
  {
    id: "boundary",
    question: "有什么内容你不希望被过度渲染或误解？",
  },
];

export type MemorialQuestion = (typeof MEMORIAL_DEFAULT_QUESTIONS)[number];
