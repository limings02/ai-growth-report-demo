// lib/domains/memorial/defaultQuestions.ts
// memorial mode 的默认访谈问题。
// hint 字段只在 UI 显示，不传给 AI。

export const MEMORIAL_DEFAULT_QUESTIONS = [
  {
    id: "who",
    question: "你想纪念的人是谁？你们是什么关系？",
    hint: "只需要简单说明，不需要完整介绍。ta 叫什么、你们是什么关系，就够了。",
  },
  {
    id: "most-memorable",
    question: "你最想保留下 ta 的哪一面？",
    hint: "可以是 ta 的性格、一个习惯、一种处事方式，或者你最记得的那种感觉。",
  },
  {
    id: "scene",
    question: "有没有一个具体场景，最能代表 ta？",
    hint: "不需要是「重要」的场景——可以是 ta 坐在哪里的样子、做什么事时的表情、一个你反复想起来的画面。",
  },
  {
    id: "habit",
    question: "ta 常说的一句话，或一个习惯是什么？",
    hint: "越日常越好：ta 爱说的口头禅、每天做的某件小事、一个你后来才意识到自己记住了的细节。",
  },
  {
    id: "connections",
    question: "ta 和家庭、朋友、同事之间有什么重要连接？",
    hint: "不需要面面俱到。挑一两个 ta 在意的人，或者 ta 在某段关系里的样子。",
  },
  {
    id: "sensory-anchor",
    question: "有没有一个物品、地点、声音或味道会让你想到 ta？",
    hint: "可以是 ta 常用的某件东西、家里的某个位置、某道菜的味道、某种声音或气味。",
  },
  {
    id: "for-posterity",
    question: "如果把 ta 的一生整理给后辈看，你希望他们记住什么？",
    hint: "不需要面面俱到。一两句就够——你希望后来的人知道，ta 是个怎样活过的人。",
  },
  {
    id: "boundary",
    question: "有什么内容你不希望被过度渲染或误解？",
    hint: "可以告诉我什么不写、什么不展开。整理过程中，你的判断比任何默认值都重要。",
  },
];

export type MemorialQuestion = (typeof MEMORIAL_DEFAULT_QUESTIONS)[number];
