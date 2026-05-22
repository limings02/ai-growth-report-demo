// lib/domains/personal/defaultQuestions.ts
// personal mode 的默认访谈问题。
// hint 字段只在 UI 显示，不传给 AI。

export const PERSONAL_DEFAULT_QUESTIONS = [
  {
    id: "time-range",
    question: "这段人生阶段大概从什么时候到什么时候？",
    hint: "可以是「大三到工作第一年」，或者「那段特别难熬的两年」，不需要精确日期。",
  },
  {
    id: "biggest-change",
    question: "这一阶段你最重要的变化是什么？",
    hint: "可以是观念上的、生活方式上的、某种关系上的，不需要是「变好了」——只要是真实发生的变化。",
  },
  {
    id: "turning-point",
    question: "有没有一个具体事件让你觉得自己变了？",
    hint: "可以很小的事：一次谈话、一次搬家、一次等待结果时的感受。不需要有「意义」。",
  },
  {
    id: "important-people",
    question: "这一阶段出现过哪些重要的人？",
    hint: "不只是「重要」的人，也可以是某个只交集了一段时间、但让你记得的人。ta 说过什么、做过什么？",
  },
  {
    id: "sensory-anchor",
    question: "有没有一个地点、物品、声音或习惯能代表这段时间？",
    hint: "比如某家你常去的店、某首单曲循环的歌、每天会路过的一个路口、睡前一定做的某件小事。",
  },
  {
    id: "emotion",
    question: "那时候的你最常有的情绪是什么？",
    hint: "可以不是漂亮答案：迷茫、压力大、松了一口气、很累但还在撑、莫名地平静——都可以写。",
  },
  {
    id: "letter-to-self",
    question: "如果给那时候的自己写一句话，你会写什么？",
    hint: "不用写得有文学感。最简单的一句「你会撑过去的」或者「那个选择其实不坏」就够了。",
  },
];

export type PersonalQuestion = (typeof PERSONAL_DEFAULT_QUESTIONS)[number];
