"use client";

// components/ModeSelector.tsx
// Mode 选择区域，展示四个记忆模式卡片。
// - family（available）：可点击，进入现有 GrowthReportApp 流程
// - couple / personal / memorial（coming_soon）：展示说明，点击无跳转
// 样式沿用项目温暖橘粉色调，不引入新设计语言。

import { MEMORY_MODES, type MemoryMode, type MemoryModeStatus } from "@/lib/memory-core/modes";

type Props = {
  /** 点击可用 mode 时触发，传入 mode id */
  onSelectMode: (mode: MemoryMode) => void;
};

export default function ModeSelector({ onSelectMode }: Props) {
  return (
    <section className="px-5 py-16" style={{ background: "#fffaf7" }}>
      <div className="max-w-5xl mx-auto">

        {/* 区域标题 */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest mb-2 uppercase"
            style={{ color: "#c0674a" }}>
            选择你的记忆主题
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#2d1f1a" }}>
            每段珍贵的记忆，都值得被好好保存
          </h2>
          <p className="text-sm" style={{ color: "#9d7b72" }}>
            选择一个模式，AI 会为你量身生成专属的记忆册
          </p>
        </div>

        {/* 四个 mode 卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMORY_MODES.map((modeConfig) => (
            <ModeCard
              key={modeConfig.id}
              emoji={modeConfig.emoji}
              title={modeConfig.title}
              subtitle={modeConfig.subtitle}
              description={modeConfig.description}
              primaryUseCase={modeConfig.primaryUseCase}
              status={modeConfig.status}
              onClick={
                modeConfig.status === "available"
                  ? () => onSelectMode(modeConfig.id)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 单个 mode 卡片 ────────────────────────────────────────────────
type ModeCardProps = {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  primaryUseCase: string;
  status: MemoryModeStatus;
  onClick?: () => void;
};

function ModeCard({ emoji, title, subtitle, description, primaryUseCase, status, onClick }: ModeCardProps) {
  const isAvailable = status === "available";

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
      className="relative rounded-2xl p-5 flex flex-col gap-3 transition-all"
      style={{
        background: isAvailable ? "#fffaf7" : "#f9f5f3",
        border: isAvailable ? "1.5px solid #f4b8a0" : "1.5px solid #ead8d0",
        cursor: isAvailable ? "pointer" : "default",
        opacity: isAvailable ? 1 : 0.75,
        boxShadow: isAvailable
          ? "0 2px 12px rgba(200, 120, 90, 0.10)"
          : "none",
      }}
      // 仅可用卡片有 hover 效果
      onMouseEnter={(e) => {
        if (isAvailable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 6px 24px rgba(200, 120, 90, 0.18)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (isAvailable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 2px 12px rgba(200, 120, 90, 0.10)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }
      }}
    >
      {/* Coming Soon 角标 */}
      {!isAvailable && (
        <span
          className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "#fde8dc", color: "#c0674a" }}
        >
          即将上线
        </span>
      )}

      {/* 可用模式：角标标注 */}
      {isAvailable && (
        <span
          className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "#e8f5e9", color: "#2e7d32" }}
        >
          可用
        </span>
      )}

      {/* Emoji 图标 */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: isAvailable ? "#fde8dc" : "#f0e8e4" }}
      >
        {emoji}
      </div>

      {/* 文字区 */}
      <div className="flex-1">
        <p className="font-bold text-base mb-0.5" style={{ color: "#2d1f1a" }}>{title}</p>
        <p className="text-xs mb-2" style={{ color: "#c0674a" }}>{subtitle}</p>
        <p className="text-xs leading-relaxed" style={{ color: "#7a5a52" }}>{description}</p>
      </div>

      {/* 底部使用场景 / CTA */}
      <div
        className="rounded-xl px-3 py-2 text-xs leading-relaxed"
        style={{ background: isAvailable ? "#fdf0e8" : "#f5eee9", color: "#9d7b72" }}
      >
        {isAvailable ? (
          <span>
            <span style={{ color: "#e8836a", fontWeight: 600 }}>→ 立即开始：</span>
            {primaryUseCase}
          </span>
        ) : (
          <span>💡 {primaryUseCase}</span>
        )}
      </div>
    </div>
  );
}
