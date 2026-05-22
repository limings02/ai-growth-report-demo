"use client";

// components/MemoryModeHome.tsx
// 全局记忆主题首页。这是用户进入网站后第一眼看到的页面。
// 内容 mode-neutral，不出现孩子/成长/父母等 family 专属表达。

import { MEMORY_MODES, type MemoryMode } from "@/lib/memory-core/modes";
import EmotionalBackdrop from "@/components/visual/EmotionalBackdrop";

type Props = {
  onSelectMode: (mode: MemoryMode) => void;
  onOpenArchive?: () => void;
  onOpenAuth?: () => void;
};

export default function MemoryModeHome({ onSelectMode, onOpenArchive, onOpenAuth }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "linear-gradient(160deg, #fff8f3 0%, #fdf0e8 40%, #fce8e0 100%)" }}
    >
      <EmotionalBackdrop tone="home" />

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
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 reveal-up"
              style={{ color: "#2d1f1a", lineHeight: "1.35" }}
            >
              把散落的人生片段，<br />
              <span style={{ color: "#e07a5f" }}>整理成一份会被珍藏的记忆册。</span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-3"
              style={{ color: "#7a5a52" }}
            >
              选择一个记忆主题，AI 会把照片、问答、对话和故事<br className="hidden sm:block" />
              整理成时间线、纪念文、关键词与记忆图谱。
            </p>

            {/* 状态说明：修正为全部可体验 */}
            <p className="text-sm" style={{ color: "#b08878" }}>
              四种记忆主题均可体验 · 当前档案默认保存在本地浏览器
            </p>
          </div>

          {/* ── 四个 Mode 卡片 ────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MEMORY_MODES.map((cfg) => {
              const isAvailable = cfg.status === "available";
              const isPreview = cfg.status === "preview";
              const isComingSoon = cfg.status === "coming_soon";
              // available 和 preview 都可点击，coming_soon 也可以点（进入 coming soon 页）
              const isClickable = isAvailable || isPreview || isComingSoon;

              // 卡片视觉强度
              const cardOpacity = isComingSoon ? 0.72 : 1;
              const cardBackground = isAvailable ? "#fffaf7" : isPreview ? "#fef9f6" : "#f9f5f3";
              const cardBorder = isAvailable
                ? "1.5px solid #f4b8a0"
                : isPreview
                ? "1.5px solid #f0c8b0"
                : "1.5px solid #ead8d0";
              const cardShadow = isAvailable
                ? "0 2px 12px rgba(200, 120, 90, 0.10)"
                : isPreview
                ? "0 2px 8px rgba(200, 120, 90, 0.07)"
                : "none";

              // 状态角标
              const badgeStyle = isAvailable
                ? { background: "#e8f5e9", color: "#2e7d32" }
                : isPreview
                ? { background: "#fff3e0", color: "#e65100" }
                : { background: "#fde8dc", color: "#c0674a" };
              const badgeText = isAvailable ? "可生成" : isPreview ? "可体验" : "即将开放";

              return (
                <div
                  key={cfg.id}
                  onClick={() => isClickable && onSelectMode(cfg.id)}
                  className="relative rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  style={{
                    background: cardBackground,
                    border: cardBorder,
                    cursor: isClickable ? "pointer" : "default",
                    opacity: cardOpacity,
                    boxShadow: cardShadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!isComingSoon) {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 6px 24px rgba(200, 120, 90, 0.18)";
                      el.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isComingSoon) {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = cardShadow;
                      el.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {/* 状态角标 */}
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={badgeStyle}
                  >
                    {badgeText}
                  </span>

                  {/* Emoji 图标 */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: isAvailable || isPreview ? "#fde8dc" : "#f0e8e4" }}
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

                  {/* 底部打开场景 */}
                  <div
                    className="rounded-xl px-3 py-2.5 text-xs leading-relaxed space-y-1"
                    style={{
                      background: isAvailable ? "#fdf0e8" : isPreview ? "#fef5ef" : "#f5eee9",
                      color: "#9d7b72",
                    }}
                  >
                    {cfg.id === "family" && (
                      <>
                        <p>
                          <span style={{ color: "#e8836a", fontWeight: 600 }}>→ </span>
                          <span style={{ color: "#7a5a52" }}>18 岁生日那天，打开这本成长册</span>
                        </p>
                        <p style={{ color: "#b08878" }}>给未来孩子的礼物，现在开始整理</p>
                      </>
                    )}
                    {cfg.id === "couple" && (
                      <>
                        <p>
                          <span style={{ color: "#e8836a", fontWeight: 600 }}>→ </span>
                          <span style={{ color: "#7a5a52" }}>周年纪念日，用你们的故事</span>
                        </p>
                        <p style={{ color: "#b08878" }}>聊天 · 关键词 · Relationship Galaxy</p>
                      </>
                    )}
                    {cfg.id === "personal" && (
                      <>
                        <p>
                          <span style={{ color: "#e07a5f", fontWeight: 600 }}>→ </span>
                          <span style={{ color: "#7a5a52" }}>写给未来自己的阶段档案</span>
                        </p>
                        <p style={{ color: "#b08878" }}>毕业 · 换城市 · 30 岁前后</p>
                      </>
                    )}
                    {cfg.id === "memorial" && (
                      <>
                        <p>
                          <span style={{ color: "#e07a5f", fontWeight: 600 }}>→ </span>
                          <span style={{ color: "#7a5a52" }}>给家人留下可以慢慢读起的故事</span>
                        </p>
                        <p style={{ color: "#b08878" }}>整理记忆 · 不做对话模拟</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 我的记忆档案 + 账户入口 ──────────────────────── */}
          {(onOpenArchive || onOpenAuth) && (
            <div className="text-center mt-10">
              <div className="inline-flex flex-wrap items-center justify-center gap-3">
                {onOpenArchive && (
                  <button
                    type="button"
                    onClick={onOpenArchive}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm cursor-pointer transition-all hover:shadow-md"
                    style={{ background: "#fffaf7", border: "1px solid #f0ddd5", color: "#9d7b72" }}
                  >
                    <span>📚</span>
                    <span>我的记忆档案</span>
                  </button>
                )}
                {onOpenAuth && (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm cursor-pointer transition-all hover:shadow-md"
                    style={{ background: "#fffaf7", border: "1px solid #f0ddd5", color: "#9d7b72" }}
                  >
                    <span>👤</span>
                    <span>账户 / 登录</span>
                  </button>
                )}
              </div>
              <p className="text-xs mt-2" style={{ color: "#c0a090" }}>
                {onOpenArchive && "查看保存在当前浏览器中的记忆册"}
                {onOpenArchive && onOpenAuth && " · "}
                {onOpenAuth && "账户功能测试中，当前不会自动同步本地记忆"}
              </p>
            </div>
          )}

          {/* ── 底部说明 ──────────────────────────────── */}
          <p className="text-center text-xs mt-6" style={{ color: "#c0a090" }}>
            🔒 当前记忆档案默认保存在本地浏览器；登录功能处于测试阶段，不会自动上传内容。
          </p>
        </div>
      </main>
    </div>
  );
}
