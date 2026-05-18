// lib/domains/personal/defaultQuestions.ts
// personal mode 的默认访谈问题。
// 面向个人阶段回忆录，帮助用户采集记忆材料。

export const PERSONAL_DEFAULT_QUESTIONS = [
  {
    id: "time-range",
    question: "这段人生阶段大概从什么时候到什么时候？",
  },
  {
    id: "biggest-change",
    question: "这一阶段你最重要的变化是什么？",
  },
  {
    id: "turning-point",
    question: "有没有一个具体事件让你觉得自己变了？",
  },
  {
    id: "important-people",
    question: "这一阶段出现过哪些重要的人？",
  },
  {
    id: "sensory-anchor",
    question: "有没有一个地点、物品、声音或习惯能代表这段时间？",
  },
  {
    id: "emotion",
    question: "那时候的你最常有的情绪是什么？",
  },
  {
    id: "letter-to-self",
    question: "如果给那时候的自己写一句话，你会写什么？",
  },
];

export type PersonalQuestion = (typeof PERSONAL_DEFAULT_QUESTIONS)[number];
