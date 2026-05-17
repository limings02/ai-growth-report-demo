"use client";

// components/MemoryModeHome.tsx
// 全局记忆主题首页。这是用户进入网站后第一眼看到的页面。
// 内容 mode-neutral，不出现孩子/成长/父母等 family 专属表达。

import { MEMORY_MODES, type MemoryMode } from "@/lib/memory-core/modes";

type Props = {
  onSelectMode: (mode: MemoryMode) => void;
};

export default function MemoryModeHome({ onSelectMode }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #fff8f3 0%, #fdf0e8 40%, #fce8e0 100%)" }}
    >
      {/* 背景装饰 */}
      <div
        className="fixed top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #f4b8a0, transparent)" }}
      />
      <div
        className="fixed bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #fcd5c0, transparent)" }}
      />

      <main className="flex-1 flex flex-col items-center justify-start px-5 pt-16 pb-20 relative z-10">
        <div className="w-full max-w-5xl">

          {/* ── 主标题区 ──────────────────────────────── */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "#fde8dc", color: "#c0674a" }}
            >
              <span>🧠</span>
              <span>AI 记忆整理助手</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5"
              style={{ color: "#2d1f1a", lineHeight: "1.35" }}
            >
              把重要的人生片段，<br />
              <span style={{ color: "#e07a5f" }}>整理成会被珍藏的记忆。</span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-3"
              style={{ color: "#7a5a52" }}
            >
              选择一个记忆主题，AI 会把照片、文字、对话和故事<br className="hidden sm:block" />
              整理成时间线、纪念文、星图与可分享的回忆册。
            </p>

            <p className="text-sm" style={{ color: "#b08878" }}>
              🟢 当前可体验：<strong>家庭亲子记忆</strong>
              &nbsp;·&nbsp;
              后续开放：情侣、个人、纪念馆
            </p>
          </div>

          {/* ── 四个 Mode 卡片 ────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MEMORY_MODES.map((cfg) => {
              const isAvailable = cfg.status === "available";
              return (
                <div
                  key={cfg.id}
                  onClick={() => onSelectMode(cfg.id)}
                  className="relative rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  style={{
                    background: isAvailable ? "#fffaf7" : "#f9f5f3",
                    border: isAvailable ? "1.5px solid #f4b8a0" : "1.5px solid #ead8d0",
                    cursor: "pointer",
                    opacity: isAvailable ? 1 : 0.78,
                    boxShadow: isAvailable
                      ? "0 2px 12px rgba(200, 120, 90, 0.10)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = isAvailable
                      ? "0 6px 24px rgba(200, 120, 90, 0.20)"
                      : "0 4px 16px rgba(200, 120, 90, 0.10)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = isAvailable
                      ? "0 2px 12px rgba(200, 120, 90, 0.10)"
                      : "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {/* 状态角标 */}
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={
                      isAvailable
                        ? { background: "#e8f5e9", color: "#2e7d32" }
                        : { background: "#fde8dc", color: "#c0674a" }
                    }
                  >
                    {isAvailable ? "可体验" : "即将开放"}
                  </span>

                  {/* Emoji 图标 */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: isAvailable ? "#fde8dc" : "#f0e8e4" }}
                  >
                    {cfg.emoji}
                  </div>

                  {/* 文字 */}
                  <div className="flex-1">
                    <p className="font-bold text-base mb-0.5" style={{ color: "#2d1f1a" }}>
                      {cfg.title}
                    </p>
                    <p className="text-xs mb-2" style={{ color: "#c0674a" }}>
                      {cfg.subtitle}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#7a5a52" }}>
                      {cfg.description}
                    </p>
                  </div>

                  {/* 底部 CTA */}
                  <div
                    className="rounded-xl px-3 py-2 text-xs leading-relaxed"
                    style={{ background: isAvailable ? "#fdf0e8" : "#f5eee9", color: "#9d7b72" }}
                  >
                    {isAvailable ? (
                      <span>
                        <span style={{ color: "#e8836a", fontWeight: 600 }}>→ 立即体验：</span>
                        {cfg.primaryUseCase}
                      </span>
                    ) : (
                      <span>💡 {cfg.primaryUseCase}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 底部说明 ──────────────────────────────── */}
          <p className="text-center text-xs mt-10" style={{ color: "#c0a090" }}>
            🔒 所有照片仅在本地预览，不会上传服务器
          </p>
        </div>
      </main>
    </div>
  );
}
