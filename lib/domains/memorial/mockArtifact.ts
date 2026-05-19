// lib/domains/memorial/mockArtifact.ts
// memorial mode preview 阶段的 mock artifact。
// 用于前端体验，不调用 DeepSeek，不代表真实 AI 生成结果。
// 内容为虚构，不涉及真实个人。

import type { MemoryArtifact } from "@/lib/memory-core/types";

export const MOCK_MEMORIAL_ARTIFACT: MemoryArtifact = {
  artifactVersion: "1.0",
  mode: "memorial",
  narrative: {
    title: "外婆陈玉兰的人生故事",
    keywords: ["裁缝手艺", "大院邻里", "腌萝卜的味道", "周日早饭", "安静的人"],
    summary:
      "外婆陈玉兰是那种让人觉得安心的人——不多话，但什么都做得到位。\n\n她年轻时学了裁缝，在胡同口的小铺子里做了近三十年，街坊邻里的衣服几乎都经过她的手。她不觉得这是什么了不起的事，只说「做好了人家才会再来」。\n\n晚年搬来和孩子们住，但每年秋天还是会自己腌一缸萝卜，说城里买的没有那个味道。她走的时候，那缸萝卜还在阳台上，没人舍得扔。",
    timeline: [
      {
        time: "1938年",
        title: "出生于南方小城",
        description: "出生于湖南某小城，家中兄弟姐妹多，从小帮着料理家务。",
      },
      {
        time: "1950年代初",
        title: "学习裁缝手艺",
        description: "十几岁跟着邻居阿婆学裁缝，后来在胡同口开了自己的小铺子，做了近三十年。",
      },
      {
        time: "1960年",
        title: "成家，搬进大院",
        description: "与外公结婚后搬进单位大院，一住四十多年，和邻居们建立了深厚的往来。",
      },
      {
        time: "1990年代",
        title: "铺子关了，但手艺没停",
        description: "裁缝铺子关掉后，外婆还常给孙辈缝缝补补，说「手闲着难受」。",
      },
      {
        time: "2010年代初",
        title: "搬来和孩子同住",
        description: "搬来城里后，每年秋天仍坚持自己腌萝卜，说是南方老家的味道，买不来的。",
      },
      {
        time: "2021年",
        title: "安静地离开",
        description: "在家中安详离世。那年秋天腌的萝卜，还在阳台上放着。",
      },
    ],
    longFormText: {
      title: "写给后辈的纪念文",
      voice: "memorial-tribute",
      content:
        "外婆陈玉兰，1938年生，2021年离世。\n\n她这一生，没有什么大起大落的故事，但每一件事她都做得认真踏实。裁缝的手艺，让她在那个年代养活了一家人，也让街坊邻里有了一个信任的去处。\n\n我们记得的，不是什么大事：是她坐在窗边穿针引线的样子，是秋天阳台上那一缸腌萝卜，是周日早饭时她不说话只是默默给大家盛粥的样子。\n\n她不习惯被夸，更不习惯麻烦别人。走的时候也安静，就像她活着的方式。\n\n如果要留下什么给后来的人看，我们想说：她是那种让人觉得脚踏实地的人，是家里的底气。不说大道理，但什么都做得到位。这已经很了不起了。\n\n希望这份记录，能让没见过她的人也知道，这个家里有过这样一个人。",
    },
    socialPosts: [
      {
        title: "家庭纪念页",
        content:
          "外婆陈玉兰，1938—2021。\n\n裁缝，邻居，秋天腌萝卜的人。\n\n安静地来，安静地去，把一些踏实的东西留了下来。",
      },
      {
        title: "清明 · 简短留念",
        content:
          "清明，想起外婆。\n\n不是因为什么特别的事，是那个阳台上的萝卜缸，还是会想起来。",
      },
    ],
  },
  graph: {
    title: "陈玉兰的记忆图谱",
    subtitle: "她留下的人、地点与印记",
    centerDescription: "外婆陈玉兰",
    nodes: [
      {
        type: "subject",
        label: "外婆陈玉兰",
        description: "这份纪念册的主角，裁缝，大院里的邻居，安静的人。",
        relatedTo: ["裁缝铺子", "大院"],
      },
      {
        type: "place",
        label: "胡同口铺子",
        description: "她开了近三十年的裁缝小铺，街坊的衣服几乎都经过她的手。",
        emotion: "踏实",
        relatedTo: ["外婆陈玉兰"],
      },
      {
        type: "place",
        label: "大院",
        description: "住了四十多年的单位大院，邻里关系深厚，是她生活最长的地方。",
        relatedTo: ["外婆陈玉兰"],
      },
      {
        type: "memory",
        label: "腌萝卜",
        description: "每年秋天必腌的一缸萝卜，说是南方老家的味道，买不来的。她走后那缸还在阳台上。",
        emotion: "念想",
        relatedTo: ["外婆陈玉兰", "阳台"],
      },
      {
        type: "place",
        label: "阳台",
        description: "晚年生活的一个角落，每年秋天会在这里腌萝卜。",
        relatedTo: ["腌萝卜"],
      },
      {
        type: "keyword",
        label: "裁缝手艺",
        description: "年轻时学的手艺，做了一生，晚年还在给孙辈缝补。",
        relatedTo: ["胡同口铺子", "外婆陈玉兰"],
      },
      {
        type: "time",
        label: "1938年",
        description: "出生年份。",
        relatedTo: ["外婆陈玉兰"],
      },
      {
        type: "time",
        label: "2021年",
        description: "离世年份。",
        relatedTo: ["外婆陈玉兰"],
      },
      {
        type: "emotion",
        label: "安静",
        description: "她最典型的底色：不多话，不麻烦别人，但什么都做得到位。",
        relatedTo: ["外婆陈玉兰"],
      },
    ],
  },
  extensions: {
    sourceTrace: {
      usedQuestions: [
        "你最想保留下 ta 的哪一面？",
        "有没有一个具体场景，最能代表 ta？",
        "ta 常说的一句话，或一个习惯是什么？",
        "有没有一个物品、地点、声音或味道会让你想到 ta？",
      ],
      usedFreeNote: true,
      missingContext: [
        "外婆的出生地详情",
        "更多家庭成员的具体细节",
      ],
      groundingNotes: [
        "这是 mock 数据，仅用于前端体验预览，未调用真实 AI 生成",
      ],
    },
    qualityReview: {
      riskOfFabrication: "low",
      emotionalTone: "克制、温柔、踏实",
      weaknesses: [
        "mock 内容为虚构，不代表真实生成质量",
        "真实生成需要更多具体的家庭记忆材料",
      ],
      suggestionsForBetterInput: [
        "补充更具体的日常场景或对话片段",
        "描述家人眼中 ta 的一个典型时刻",
        "提供一件能代表 ta 的物品或习惯的细节",
      ],
    },
  },
};
