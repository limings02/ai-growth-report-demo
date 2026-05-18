// lib/domains/couple/mockArtifact.ts
// 用于本地开发环境调试 couple 结果页的 mock artifact。
//
// 用途：
// - 不调用 DeepSeek，直接跳入 CoupleArtifactPreview
// - 调试 RelationshipGalaxyPreview、打印样式、fallback 提示等
//
// 约束：
// - 不要放真实用户隐私
// - 不要在生产环境展示此数据（入口已通过 isDev 控制）

import type { MemoryArtifact } from "@/lib/memory-core/types";

export const MOCK_COUPLE_ARTIFACT: MemoryArtifact = {
  artifactVersion: "0.1",
  mode: "couple",
  narrative: {
    title: "小A 和 小B 的晚安星球",
    keywords: ["晚安", "电影", "散步", "老地方", "安心"],
    summary:
      "这是一份用于本地开发预览的恋爱纪念册示例。它模拟了用户提供聊天片段和恋爱问答后，AI 可能整理出的结果。\n\n它不代表真实用户故事，只用于调试 CoupleArtifactPreview、RelationshipGalaxyPreview 和打印效果。",
    timeline: [
      {
        time: "2021年夏天",
        title: "第一次认真聊天",
        description:
          "那天你们聊到很晚，从最近的生活聊到喜欢的电影。很多后来的晚安，都是从那一晚开始变得不一样。",
      },
      {
        time: "2021年秋天",
        title: "老地方的散步",
        description:
          "有些地方因为反复一起经过，慢慢变成了只属于你们的坐标。",
      },
      {
        time: "后来",
        title: "普通但舒服的一天",
        description:
          "没有特别大的事件，只是一起吃饭、聊天、回消息，却让人觉得安心。",
      },
    ],
    longFormText: {
      title: "写给未来你们的信",
      content:
        "写给未来的你们：\n\n如果有一天你们忘了最开始为什么靠近，就回来看看这些聊天和故事。那里有很多很小的证据，证明你们曾经认真地喜欢过彼此。\n\n那些晚安、电影、散步和老地方，并不只是普通日常。它们是关系一点点生长出来的痕迹。",
      voice: "anniversary-letter",
    },
    socialPosts: [
      {
        title: "温柔版",
        content: "把一些普通日子整理起来，才发现原来很多爱意都藏在小事里。",
      },
      {
        title: "纪念日版",
        content:
          "又一起走过了一段时间。愿我们以后回头看，仍然记得这些微小但真实的瞬间。",
      },
      {
        title: "简洁版",
        content: "一些聊天，一些散步，一些晚安，组成了我们的故事。",
      },
    ],
  },
  graph: {
    title: "晚安星球",
    subtitle: "那些反复出现的小事，组成了你们的关系宇宙",
    centerDescription: "我们的故事",
    nodes: [
      {
        type: "message",
        label: "晚安",
        description: "反复出现的聊天结尾，像一种稳定的陪伴。",
        emotion: "安心",
        relatedTo: ["想你", "电影"],
      },
      {
        type: "keyword",
        label: "电影",
        description: "聊天里经常出现的话题，也是靠近彼此的一种方式。",
        emotion: "靠近",
        relatedTo: ["晚安"],
      },
      {
        type: "place",
        label: "老地方",
        description: "因为一起经过很多次，变得有了特殊意义。",
        emotion: "熟悉",
        relatedTo: ["散步"],
      },
      {
        type: "event",
        label: "散步",
        description: "没有目的地的路，也会成为记忆里很温柔的一段。",
        emotion: "放松",
        relatedTo: ["老地方"],
      },
      {
        type: "emotion",
        label: "想你",
        description: "很多没有明说的话，其实都藏在反复出现的问候里。",
        emotion: "想念",
        relatedTo: ["晚安"],
      },
    ],
  },
  extensions: {
    sourceTrace: {
      usedQuestions: [
        "你们第一次认真聊天是什么时候？",
        "你们之间有什么反复出现的小习惯？",
      ],
      usedFreeNote: true,
      missingContext: ["这是 mock 数据，不代表真实用户材料。"],
      groundingNotes: [
        "用于本地调试展示组件、打印样式和 Relationship Galaxy。",
      ],
    },
    qualityReview: {
      riskOfFabrication: "medium",
      emotionalTone: "温柔、克制、带一点纪念感",
      weaknesses: ["这是 mock 示例，不应用于真实内容判断。"],
      suggestionsForBetterInput: [
        "真实生成时，请补充具体聊天片段、地点、事件和想表达的话。",
      ],
    },
  },
};
