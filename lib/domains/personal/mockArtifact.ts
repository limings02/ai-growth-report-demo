// lib/domains/personal/mockArtifact.ts
// personal mode 开发阶段的 mock artifact，用于前端骨架体验。
// 仅在开发环境展示，不调用 DeepSeek。

import type { MemoryArtifact } from "@/lib/memory-core/types";

export const MOCK_PERSONAL_ARTIFACT: MemoryArtifact = {
  artifactVersion: "1.0",
  mode: "personal",
  narrative: {
    title: "林夏的大学四年",
    keywords: ["成长", "孤独与自由", "第一次离家", "找到自己", "毕业前夕"],
    summary:
      "2019 年秋，林夏第一次独自拎着行李走进宿舍，那时她还不知道接下来四年会带走什么、又留下什么。\n\n大一的迷茫、大二的用力、大三那个漫长的低谷，到最后毕业答辩结束后在操场坐着看天空——每一段都清晰得像一张底片，压在心里，随时可以拿出来看。\n\n这份回忆录，是她给自己留下的那段时光的证明。",
    timeline: [
      {
        time: "2019.09",
        title: "第一次独自报到",
        description: "拖着两个行李箱走进陌生的城市，宿舍里四张床，室友还没到。那是第一次意识到，从今以后很多事要自己扛。",
      },
      {
        time: "2020.03",
        title: "疫情封校，第一次长时间独处",
        description: "学校封闭，无处可去。意外读完了一堆书，开始写日记。后来想想，那段强制的安静让她第一次真正开始「想事情」。",
      },
      {
        time: "2021.04",
        title: "实习失败，低谷期开始",
        description: "第一次实习被委婉拒绝转正，那几个月她不太爱说话，常常走路走到很远的地方才回来。",
      },
      {
        time: "2022.01",
        title: "大三下，慢慢回来了",
        description: "开始参加一个小组的课题研究，第一次觉得自己做的事是真的有意思的。导师说了一句话她记了很久：「你比你以为的更能承受不确定性。」",
      },
      {
        time: "2023.06",
        title: "毕业答辩结束",
        description: "答辩结束后没有马上走，在操场坐了很久。不是因为舍不得，而是想再坐一次——在这个既普通又不普通的地方，感受一下它还是它，而自己已经不是了。",
      },
    ],
    longFormText: {
      title: "写给大学时候的自己",
      voice: "self-reflection",
      content:
        "林夏：\n\n你现在大概正坐在宿舍，或者图书馆某个不起眼的位置，耳机里放着音乐，书翻开了但没有在看。\n\n我想告诉你，那种总觉得自己不够、总觉得别人都看穿你了的感觉，不是真的。你只是还没习惯带着不确定性生活，而这件事，其实很多人都不习惯。\n\n大三那段低谷，后来你会明白，它是某种必要的代价——不是你的错，只是那条路在那个时候弯了一个弯。你没有走丢，只是绕路了。\n\n毕业前那天坐在操场上，你盯着操场看了很久很久。不是因为舍不得，只是因为那一刻你感受到一件事——你真的来过这里，真的在这里活过一段时间，不是经过，是真实地在这里待过。\n\n那就够了。\n\n带着这些，继续走吧。",
    },
    socialPosts: [
      {
        title: "小红书 · 毕业季",
        content:
          "四年结束了 🎓\n\n不是最优秀的那个，也没有做到自己以为会做到的事。\n但是真的经历了一些只属于自己的时刻——\n\n大二那个喜欢在宿舍楼顶看城市灯光的夜晚，大三那段什么都觉得没意思的低谷，以及毕业那天操场上坐了很久的下午。\n\n谢谢那个时候的自己，撑过来了。✨",
      },
      {
        title: "朋友圈 · 阶段总结",
        content:
          "大学四年打卡完毕。\n\n离家、独处、低谷、慢慢回来——\n比想象中难，也比想象中值得。\n\n#毕业 #写给自己",
      },
      {
        title: "备忘录 · 给未来的提醒",
        content:
          "记住这段时间：\n· 第一次真正一个人\n· 第一次知道孤独可以是一种选择\n· 第一次觉得不确定也没关系\n\n这是你的基础。",
      },
    ],
  },
  graph: {
    title: "林夏的个人记忆图谱",
    subtitle: "大学四年的人、地点、情绪与转折",
    centerDescription: "林夏",
    nodes: [
      {
        type: "subject",
        label: "林夏",
        description: "这份回忆录的主角，经历了四年的成长与低谷。",
        emotion: "坚韧",
        relatedTo: ["大学宿舍", "导师"],
      },
      {
        type: "time",
        label: "大一入学",
        description: "第一次离家，独自报到，开始适应新生活。",
        emotion: "迷茫又期待",
        relatedTo: ["大学宿舍"],
      },
      {
        type: "place",
        label: "大学宿舍",
        description: "四年里最主要的空间，见证了迷茫、成长、低谷与复苏。",
        relatedTo: ["林夏"],
      },
      {
        type: "event",
        label: "实习被拒",
        description: "第一次被委婉告知不合适，开启了一段较长的低谷期。",
        emotion: "失落",
        relatedTo: ["低谷期", "林夏"],
      },
      {
        type: "emotion",
        label: "低谷期",
        description: "大三那段情绪底色灰暗的时期，常常走很远的路才回来。",
        relatedTo: ["实习被拒", "林夏"],
      },
      {
        type: "person",
        label: "导师",
        description: "课题研究期间遇到的导师，说了一句被她记住很久的话。",
        relatedTo: ["林夏"],
      },
      {
        type: "event",
        label: "毕业答辩",
        description: "四年的终点，结束后在操场独坐，感受一切真实发生过。",
        emotion: "平静",
        relatedTo: ["操场", "林夏"],
      },
      {
        type: "place",
        label: "操场",
        description: "毕业那天坐了很久的地方，不是因为舍不得，而是确认一切真实存在过。",
        relatedTo: ["毕业答辩"],
      },
      {
        type: "keyword",
        label: "孤独与自由",
        description: "这段时光最核心的情绪关键词，孤独不是坏事，是选择。",
        relatedTo: ["林夏"],
      },
    ],
  },
  extensions: {
    sourceTrace: {
      usedQuestions: [
        "这段人生阶段大概从什么时候到什么时候？",
        "这一阶段你最重要的变化是什么？",
        "有没有一个具体事件让你觉得自己变了？",
        "这一阶段出现过哪些重要的人？",
        "如果给那时候的自己写一句话，你会写什么？",
      ],
      usedFreeNote: true,
      missingContext: [
        "具体聊天记录或日记片段",
        "室友、朋友等人物的更多细节",
      ],
      groundingNotes: [
        "这是 mock 数据，仅用于前端体验预览，未调用真实 AI 生成",
      ],
    },
    qualityReview: {
      riskOfFabrication: "low",
      emotionalTone: "平静、内省、温柔",
      weaknesses: [
        "细节来源于 mock，不代表真实生成质量",
        "真实生成需要更具体的人物、事件、对话细节",
      ],
      suggestionsForBetterInput: [
        "补充更具体的人物姓名或昵称",
        "描述某个地点的具体画面",
        "回忆某句话或某个场景",
      ],
    },
  },
};
