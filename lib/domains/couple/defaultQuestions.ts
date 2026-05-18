// lib/domains/couple/defaultQuestions.ts
// couple mode 默认访谈问题。
//
// 设计原则：
// - 温柔，但不油腻
// - 不强迫用户暴露隐私
// - 不假设关系状态一定稳定美满
// - 问题要能引出真实的具体细节，而不是空泛表白

export type CoupleQuestion = {
  id: string;
  label: string;
  answer: string;
};

export const DEFAULT_COUPLE_QUESTIONS: CoupleQuestion[] = [
  {
    id: "first-meet",
    label: "你们第一次认识或第一次见面，是在什么时候？当时有什么细节让你记得？",
    answer: "",
  },
  {
    id: "first-heartbeat",
    label: "你第一次觉得「好像有点喜欢 TA」，是因为什么？",
    answer: "",
  },
  {
    id: "important-moment",
    label: "这段关系里，你最想保存下来的一个瞬间是什么？",
    answer: "",
  },
  {
    id: "inside-joke",
    label: "你们之间有没有只有彼此懂的称呼、梗、暗号或习惯？",
    answer: "",
  },
  {
    id: "hard-time",
    label: "你们有没有一起经历过一次不容易的时刻？后来是怎么过去的？",
    answer: "",
  },
  {
    id: "ordinary-day",
    label: "你们最普通但最舒服的一天，通常是什么样的？",
    answer: "",
  },
  {
    id: "future",
    label: "如果把这份纪念册送给未来的你们，你最想让未来的你们记住什么？",
    answer: "",
  },
];
