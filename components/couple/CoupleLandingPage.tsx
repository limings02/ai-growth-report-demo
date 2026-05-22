"use client";

// components/couple/CoupleLandingPage.tsx
// couple mode 的专属落地介绍页（Phase 15.0 情绪升级版）。
// 目标：浪漫、克制、有传播力；删除 Preview / 下一阶段开放 旧文案。

import EmotionalBackdrop from "@/components/visual/EmotionalBackdrop";

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

export default function CoupleLandingPage({ onStart, onBackToModes }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "linear-gradient(160deg, #fff8f3 0%, #fdf0e8 50%, #fce8e0 100%)" }}
    >
      <EmotionalBackdrop tone="couple" />
      {/* 顶部导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <button
          onClick={onBackToModes}
          className="text-sm cursor-pointer hover:underline flex items-center gap-1"
          style={{ color: "#9d7b72" }}
        >
          ← 返回记忆主题
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center px-5 py-14">
        <div className="w-full max-w-2xl">

          {/* ── Hero 情绪区 ─────────────────────────────────── */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "#fde8dc", color: "#c0674a" }}
            >
              <span>💑</span>
              <span>恋爱纪念册</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-bold mb-5 reveal-up"
              style={{ color: "#2d1f1a", lineHeight: "1.45" }}
            >
              把你们说过的晚安、争吵、和好与想念，<br />
              <span style={{ color: "#e07a5f" }}>整理成一本只属于两个人的恋爱纪念册。</span>
            </h1>

            <p
              className="text-base leading-relaxed mb-8 max-w-lg mx-auto"
              style={{ color: "#7a5a52" }}
            >
              恋爱时间线、关系关键词、周年信和 Relationship Galaxy，
              用你们真实的故事生成，不是模板，不是套词。
            </p>

            {/* Hero CTA */}
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg transition-all cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-95"
              style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
            >
              开始整理恋爱故事 →
            </button>
          </div>

          {/* ── 它会帮你整理什么 ─────────────────────────────── */}
          <div className="mb-12">
            <h2
              className="text-lg font-bold text-center mb-2"
              style={{ color: "#2d1f1a" }}
            >
              它不是简单总结聊天记录，
            </h2>
            <p className="text-center text-sm mb-7" style={{ color: "#9d7b72" }}>
              而是重新讲述你们的关系。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  emoji: "🕰️",
                  title: "恋爱时间线",
                  desc: "第一次认识、第一次心动、第一次旅行、一次争吵和一次和好，都可以成为你们关系里的节点。",
                },
                {
                  emoji: "✨",
                  title: "关系关键词",
                  desc: "从聊天和回答中提炼只属于你们的词：昵称、暗号、地点、习惯和反复出现的小事。",
                },
                {
                  emoji: "✉️",
                  title: "周年纪念信",
                  desc: "把普通日常写成一封能在纪念日、生日或某个深夜重新读起的信。",
                },
                {
                  emoji: "🌌",
                  title: "Relationship Galaxy",
                  desc: "把人、地点、对话、情绪连接成一张关系星图，让这段感情有可以看见的形状。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-5"
                  style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <p className="font-semibold text-sm mb-1.5" style={{ color: "#2d1f1a" }}>
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9d7b72" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 适合什么时候生成 ─────────────────────────────── */}
          <div className="mb-12">
            <h2
              className="text-lg font-bold text-center mb-6"
              style={{ color: "#2d1f1a" }}
            >
              适合在这些时刻，送给你们。
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "恋爱周年",
                "520 · 七夕",
                "生日礼物",
                "求婚前的小册子",
                "异地见面前",
                "一次和好之后",
                "普通但想被记住的一天",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: "#fde8dc", color: "#c0674a" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── 样例预览 ─────────────────────────────────────── */}
          <div className="mb-12">
            <h2
              className="text-lg font-bold text-center mb-2"
              style={{ color: "#2d1f1a" }}
            >
              未来它可能会这样整理你们的故事
            </h2>
            <p className="text-center text-xs mb-6" style={{ color: "#b08878" }}>
              以下是示例，不是你的真实生成结果
            </p>

            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "#c0674a" }}>
                ⏱ 恋爱时间线示例
              </p>
              <div
                className="rounded-xl p-4 text-sm leading-relaxed"
                style={{ background: "white", border: "1px solid #f0ddd5" }}
              >
                <p className="font-medium mb-1" style={{ color: "#2d1f1a" }}>
                  2023.06 · 第一次认真聊天
                </p>
                <p style={{ color: "#7a5a52" }}>
                  那天你们聊到很晚，从最近的生活聊到喜欢的电影。
                  后来很多次晚安，都是从那一晚开始变得不一样。
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#fde8dc", color: "#c0674a" }}>晚安</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#fde8dc", color: "#c0674a" }}>电影</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#fde8dc", color: "#c0674a" }}>散步</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#fde8dc", color: "#c0674a" }}>想你</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#fde8dc", color: "#c0674a" }}>老地方</span>
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "#fffdf9",
                border: "1px solid #f0ddd5",
                backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #f5e8e0 27px, #f5e8e0 28px)",
                backgroundSize: "100% 28px",
                backgroundPositionY: "36px",
              }}
            >
              <p className="text-xs font-semibold mb-3 relative z-10" style={{ color: "#c0674a" }}>
                ✉️ 周年信片段示例
              </p>
              <p
                className="text-sm leading-loose relative z-10"
                style={{ color: "#3d2c2c", fontFamily: "'PingFang SC', 'Hiragino Sans GB', serif" }}
              >
                写给未来的你们：<br /><br />
                如果有一天你们忘了最开始为什么靠近，<br />
                就回来看看这些聊天和故事。<br />
                那里有很多很小的证据，<br />
                证明你们曾经认真地喜欢过彼此。
              </p>
            </div>
          </div>

          {/* ── 隐私说明（温柔版）────────────────────────────── */}
          <div
            className="rounded-2xl p-5 mb-8"
            style={{ background: "#f9f5f3", border: "1px solid #ead8d0" }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: "#7a5a52" }}>
              🔒 你掌控自己要交出的记忆
            </p>
            <ul className="text-xs space-y-2" style={{ color: "#9d7b72" }}>
              <li>· 不读取微信数据库，不自动导入聊天记录</li>
              <li>· 只处理你主动粘贴的文本</li>
              <li>· 照片当前只记录数量，不上传服务器</li>
              <li>· 你可以只粘贴最想保存的一小段，不需要全部</li>
            </ul>
          </div>

          {/* ── 底部 CTA ──────────────────────────────────────── */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-full text-white text-base font-semibold shadow-lg transition-all cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-95"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
          >
            开始整理恋爱故事 →
          </button>

          <p className="text-center text-xs mt-3" style={{ color: "#b08878" }}>
            填写完成后，AI 会整理生成你们的恋爱纪念册
          </p>
        </div>
      </main>
    </div>
  );
}
