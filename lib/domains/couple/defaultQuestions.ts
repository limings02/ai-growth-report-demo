// lib/domains/couple/defaultQuestions.ts
// couple mode 默认访谈问题。
// hint 字段只在 UI 显示，不传给 AI。

export type CoupleQuestion = {
  id: string;
  label: string;
  answer: string;
  hint?: string;
};

export const DEFAULT_COUPLE_QUESTIONS: CoupleQuestion[] = [
  {
    id: "first-meet",
    label: "你们第一次认识或第一次见面，是在什么时候？当时有什么细节让你记得？",
    answer: "",
    hint: "不需要讲完整故事，写一个你们都会记得的小细节就够了——比如当时的地点、某句话、某个眼神。",
  },
  {
    id: "first-heartbeat",
    label: "你第一次觉得「好像有点喜欢 TA」，是因为什么？",
    answer: "",
    hint: "可以是很小的事：因为 ta 说了一句什么，或者做了一个什么动作，或者某天你突然注意到了 ta。",
  },
  {
    id: "important-moment",
    label: "这段关系里，你最想保存下来的一个瞬间是什么？",
    answer: "",
    hint: "不一定是「特别有意义」的大事。一个普通的下午、一顿没什么特别的饭，也可以是这个瞬间。",
  },
  {
    id: "inside-joke",
    label: "你们之间有没有只有彼此懂的称呼、梗、暗号或习惯？",
    answer: "",
    hint: "比如你们给某条路起的名字、发消息时的习惯用语、某个重复了很多次的玩笑。",
  },
  {
    id: "hard-time",
    label: "你们有没有一起经历过一次不容易的时刻？后来是怎么过去的？",
    answer: "",
    hint: "不需要讲清楚始末，只要说说你记得的部分——是谁先开口的，还是你们各自等了一段时间？",
  },
  {
    id: "ordinary-day",
    label: "你们最普通但最舒服的一天，通常是什么样的？",
    answer: "",
    hint: "早上还是晚上？在哪里？做什么？不需要浪漫，就是那种最真实的日常。",
  },
  {
    id: "future",
    label: "如果把这份纪念册送给未来的你们，你最想让未来的你们记住什么？",
    answer: "",
    hint: "写给若干年后的你们——那时候你们也许已经变了很多，这句话是现在的你想留给那时的你们的。",
  },
];
