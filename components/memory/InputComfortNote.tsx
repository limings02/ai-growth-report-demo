"use client";

// components/memory/InputComfortNote.tsx
// 填写安抚组件：降低用户心理阻力，传达"写一点就够"的信号。
// 不影响表单校验，不影响生成逻辑，纯视觉信息层。

type Mode = "family" | "couple" | "personal" | "memorial";
type Variant = "hero" | "mid-form" | "before-submit";

type Props = {
  mode: Mode;
  variant?: Variant;
};

type ComfortContent = {
  title: string;
  body: string;
};

const CONTENT: Record<Mode, ComfortContent> = {
  family: {
    title: "不用一次写完",
    body: "AI 可以帮你整理文字，但这份礼物真正珍贵的，是你愿意为孩子留下这些细节。\n想象很多年后，ta 打开这本成长册时的表情——你现在写下的每一句，都会变成那天的惊喜。",
  },
  couple: {
    title: "不用整理全部聊天",
    body: "只留下你们最想保留的一小段就够了。AI 会帮你整理成时间线、关键词和纪念信。\n重要的不是写得多完整，而是你愿意认真为这段关系准备一次。",
  },
  personal: {
    title: "先写几个还记得的片段",
    body: "不用把人生讲清楚。你只要写下几个还记得的瞬间，AI 会帮你把它们整理成一条线。\n有些阶段，当时说不清，后来才看得懂。",
  },
  memorial: {
    title: "慢慢来，不用一次写完",
    body: "AI 只能帮你整理材料，不能替代你的怀念。你愿意留下的每一个小片段，都已经很珍贵。\n只写你愿意写的部分，就已经足够开始。",
  },
};

// mode 对应的色系配置
const THEME: Record<Mode, { bg: string; border: string; titleColor: string; bodyColor: string; dot: string }> = {
  family: {
    bg: "rgba(253,232,220,0.40)",
    border: "#f4cdb8",
    titleColor: "#c0674a",
    bodyColor: "#7a5a52",
    dot: "#e8836a",
  },
  couple: {
    bg: "rgba(253,232,220,0.35)",
    border: "#f0ddd5",
    titleColor: "#b05a44",
    bodyColor: "#7a5a52",
    dot: "#e07a5f",
  },
  personal: {
    bg: "rgba(232,237,248,0.45)",
    border: "#c8d0e8",
    titleColor: "#5568a0",
    bodyColor: "#6b7db3",
    dot: "#6b8adc",
  },
  memorial: {
    bg: "rgba(240,237,232,0.55)",
    border: "#d4cfc8",
    titleColor: "#7a7065",
    bodyColor: "#8a8278",
    dot: "#8c7d6e",
  },
};

export default function InputComfortNote({ mode, variant = "hero" }: Props) {
  const content = CONTENT[mode];
  const theme = THEME[mode];

  // before-submit variant: 更简短的鼓励
  if (variant === "before-submit") {
    return (
      <p className="text-xs text-center mb-3" style={{ color: theme.bodyColor }}>
        先写一点也可以。回答 1 个问题，或写一段自由记录，就能生成初版——之后可以随时补充更多细节。
      </p>
    );
  }

  // mid-form variant: 单行卡片
  if (variant === "mid-form") {
    return (
      <div
        className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-4"
        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
      >
        <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: theme.dot }}>✦</span>
        <p className="text-xs leading-relaxed" style={{ color: theme.bodyColor }}>
          {content.body.split("\n")[0]}
        </p>
      </div>
    );
  }

  // hero variant (default): 完整卡片
  return (
    <div
      className="rounded-2xl px-5 py-4 mb-6"
      style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
    >
      <p className="text-xs font-semibold mb-2" style={{ color: theme.titleColor }}>
        ✦ {content.title}
      </p>
      <div className="space-y-1.5">
        {content.body.split("\n").map((line, i) => (
          <p key={i} className="text-xs leading-relaxed" style={{ color: theme.bodyColor }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
