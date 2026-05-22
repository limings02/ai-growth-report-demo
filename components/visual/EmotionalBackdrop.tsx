// components/visual/EmotionalBackdrop.tsx
// 轻量情绪动效背景层（Phase 15.1A 修复版）。
// 纯 CSS，不引入动画库；pointer-events-none，不影响交互。
// aria-hidden，不影响可访问性。
// @media print 下隐藏。
//
// 修复（Phase 15.1A）：
// - glow 使用外层定位 div + 内层动效 div，避免 translate 被 scale 覆盖
// - 使用 fixed z-0；调用方需确保主内容容器有 relative z-10

type EmotionalTone = "home" | "family" | "couple" | "personal" | "memorial";

type Props = {
  tone: EmotionalTone;
};

const TONE_CONFIG: Record<EmotionalTone, {
  glows: { cx: string; cy: string; r: string; color: string; opacity: number }[];
  chips: string[];
  chipColors: { bg: string; text: string };
}> = {
  home: {
    glows: [
      { cx: "15%", cy: "20%", r: "220px", color: "#f4b8a0", opacity: 0.18 },
      { cx: "80%", cy: "15%", r: "180px", color: "#fcd5c0", opacity: 0.14 },
      { cx: "60%", cy: "75%", r: "200px", color: "#e8836a", opacity: 0.10 },
    ],
    chips: ["第一次认真说晚安", "她三岁那年的夏天", "搬去新城市的第一晚", "外婆总爱坐在窗边", "那年冬天的旧相册"],
    chipColors: { bg: "rgba(255,250,247,0.75)", text: "#9d7b72" },
  },
  family: {
    glows: [
      { cx: "10%", cy: "25%", r: "200px", color: "#fcd5c0", opacity: 0.20 },
      { cx: "85%", cy: "20%", r: "160px", color: "#f4b8a0", opacity: 0.15 },
      { cx: "50%", cy: "80%", r: "180px", color: "#c8e6c9", opacity: 0.12 },
    ],
    chips: ["第一次叫妈妈", "三岁那年的画", "幼儿园门口的拥抱", "十八岁那天再打开", "睡前讲了多少个故事"],
    chipColors: { bg: "rgba(255,248,245,0.80)", text: "#c0674a" },
  },
  couple: {
    glows: [
      { cx: "20%", cy: "15%", r: "200px", color: "#f4b8a0", opacity: 0.18 },
      { cx: "75%", cy: "25%", r: "160px", color: "#ce93d8", opacity: 0.10 },
      { cx: "55%", cy: "80%", r: "190px", color: "#e8836a", opacity: 0.12 },
    ],
    chips: ["到家了吗", "今天也很想你", "我们那天真的笑了很久", "下次还去那个地方", "早安 睡了吗"],
    chipColors: { bg: "rgba(255,248,248,0.80)", text: "#c0674a" },
  },
  personal: {
    glows: [
      { cx: "15%", cy: "20%", r: "200px", color: "#90caf9", opacity: 0.15 },
      { cx: "80%", cy: "15%", r: "170px", color: "#ce93d8", opacity: 0.10 },
      { cx: "45%", cy: "75%", r: "180px", color: "#a5d6a7", opacity: 0.08 },
    ],
    chips: ["大学四年", "第一份工作", "搬去新城市", "走出低谷", "三十岁前后"],
    chipColors: { bg: "rgba(248,250,255,0.80)", text: "#5568a0" },
  },
  memorial: {
    glows: [
      { cx: "10%", cy: "20%", r: "180px", color: "#f5deb3", opacity: 0.15 },
      { cx: "80%", cy: "15%", r: "160px", color: "#d4cfc8", opacity: 0.12 },
      { cx: "50%", cy: "80%", r: "170px", color: "#c8b99a", opacity: 0.10 },
    ],
    chips: ["ta 总爱坐在窗边", "旧照片里的笑容", "ta 说过的话", "家里的老味道", "那些小习惯"],
    chipColors: { bg: "rgba(255,255,250,0.75)", text: "#7a7065" },
  },
};

const DRIFT_DELAYS = ["0s", "1.2s", "2.5s", "3.8s", "1.6s"];
const FLOAT_DELAYS = ["0s", "1.5s", "3s", "0.8s", "2.2s"];

export default function EmotionalBackdrop({ tone }: Props) {
  const config = TONE_CONFIG[tone];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      {/* Radial glow orbs
          外层 div 负责定位（translate -50% -50%），
          内层 div 负责 soft-pulse scale 动画，
          两层分离避免 transform 覆盖 */}
      {config.glows.map((glow, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: glow.cx,
            top: glow.cy,
            transform: "translate(-50%, -50%)",
            animationDelay: FLOAT_DELAYS[i % FLOAT_DELAYS.length],
          }}
        >
          <div
            className="rounded-full soft-pulse"
            style={{
              width: glow.r,
              height: glow.r,
              background: `radial-gradient(circle, ${glow.color} 0%, transparent 70%)`,
              opacity: glow.opacity,
              animationDelay: FLOAT_DELAYS[i % FLOAT_DELAYS.length],
            }}
          />
        </div>
      ))}

      {/* Floating memory chips */}
      {config.chips.map((chip, i) => (
        <div
          key={chip}
          className="absolute memory-drift"
          style={{
            left: `${12 + i * 18}%`,
            top: `${20 + (i % 3) * 22}%`,
            animationDelay: DRIFT_DELAYS[i % DRIFT_DELAYS.length],
          }}
        >
          <span
            className="inline-block text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{
              background: config.chipColors.bg,
              color: config.chipColors.text,
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.6)",
              fontSize: "11px",
            }}
          >
            {chip}
          </span>
        </div>
      ))}
    </div>
  );
}
