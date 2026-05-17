"use client";

// components/ComingSoonModePage.tsx
// 当用户点击 couple / personal / memorial 时展示的 coming soon 页面。
// 展示 mode 信息，不提供任何生成入口。

import { getMemoryModeConfig, type MemoryMode } from "@/lib/memory-core/modes";

type Props = {
  mode: MemoryMode;
  onBack: () => void;
};

// 各 mode 的额外说明文案
const EXTRA_DESC: Partial<Record<MemoryMode, string>> = {
  couple:
    "情侣模式未来会支持粘贴聊天记录、上传照片预览、生成恋爱时间线和 Relationship Galaxy，把你们在一起的每个瞬间变成可珍藏的纪念册。",
  personal:
    "个人模式将帮助你整理某段人生阶段的感悟、决定与转折，生成带有时间轴的私人回忆录，可以导出和分享。",
  memorial:
    "纪念馆模式会为挚爱的人留下一座数字纪念空间，收录他们的故事与精神，让记忆不随时间消散，代代相传。",
};

export default function ComingSoonModePage({ mode, onBack }: Props) {
  const cfg = getMemoryModeConfig(mode);
  const extra = EXTRA_DESC[mode];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #fff8f3 0%, #fdf0e8 50%, #fce8e0 100%)" }}
    >
      {/* 顶部返回 */}
      <div
        className="sticky top-0 z-20 px-5 py-3"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <button
          onClick={onBack}
          className="text-sm cursor-pointer hover:underline flex items-center gap-1"
          style={{ color: "#9d7b72" }}
        >
          ← 返回记忆主题
        </button>
      </div>

      {/* 主体内容 */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="max-w-lg w-full text-center">

          {/* Emoji 大图标 */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6"
            style={{ background: "#fde8dc" }}
          >
            {cfg.emoji}
          </div>

          {/* 标题 */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#2d1f1a" }}>
            {cfg.title}
          </h1>
          <p className="text-sm font-medium mb-6" style={{ color: "#c0674a" }}>
            {cfg.subtitle}
          </p>

          {/* 即将开放标签 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
            style={{ background: "#fde8dc", color: "#c0674a" }}
          >
            <span>🚀</span>
            <span>即将开放</span>
          </div>

          {/* 描述 */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#7a5a52" }}>
            {cfg.description}
          </p>

          {/* 核心使用场景 */}
          <div
            className="rounded-2xl p-4 mb-5 text-sm leading-relaxed text-left"
            style={{ background: "#fff7f4", border: "1px solid #f0ddd5", color: "#9d7b72" }}
          >
            <p className="font-semibold mb-1" style={{ color: "#c0674a" }}>💡 核心使用场景</p>
            <p>{cfg.primaryUseCase}</p>
          </div>

          {/* 额外说明（各 mode 独特内容） */}
          {extra && (
            <div
              className="rounded-2xl p-4 text-sm leading-relaxed text-left"
              style={{ background: "#f5f0ff", border: "1px solid #e0d5f5", color: "#5a4a7a" }}
            >
              <p className="font-semibold mb-1" style={{ color: "#7a5ab8" }}>✨ 功能预告</p>
              <p>{extra}</p>
            </div>
          )}

          {/* 返回按钮 */}
          <button
            onClick={onBack}
            className="mt-10 px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all hover:shadow-md"
            style={{
              background: "linear-gradient(135deg, #e8836a, #e07a5f)",
              color: "white",
            }}
          >
            ← 返回选择其他记忆主题
          </button>
        </div>
      </main>
    </div>
  );
}
