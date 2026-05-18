"use client";

// components/couple/CoupleLandingPage.tsx
// couple mode 的专属落地介绍页。
// 让用户在进入表单前了解当前可体验内容和边界，避免误解 AI 已经可以生成。

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

export default function CoupleLandingPage({ onStart, onBackToModes }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #fff8f3 0%, #fdf0e8 50%, #fce8e0 100%)" }}
    >
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

      {/* 主体 */}
      <main className="flex-1 flex flex-col items-center px-5 py-14">
        <div className="w-full max-w-2xl">

          {/* ── Hero 区 ── */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
              style={{ background: "#fde8dc", color: "#c0674a" }}
            >
              <span>💑</span>
              <span>恋爱纪念册</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4"
              style={{ color: "#2d1f1a", lineHeight: "1.4" }}
            >
              把你们的恋爱故事，<br />
              <span style={{ color: "#e07a5f" }}>整理成一本会被珍藏的纪念册。</span>
            </h1>

            <p
              className="text-base leading-relaxed mb-5 max-w-lg mx-auto"
              style={{ color: "#7a5a52" }}
            >
              从聊天片段、照片数量、纪念日和你们写下的故事中，
              整理出恋爱时间线、关系关键词、周年信和 Relationship Galaxy。
            </p>

            {/* 当前阶段提示 */}
            <div
              className="inline-block px-4 py-2 rounded-xl text-sm"
              style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffe0b2" }}
            >
              🧪 当前可体验：输入页与 MemoryRawMaterial 预览 &nbsp;·&nbsp; AI 生成下一阶段接入
            </div>
          </div>

          {/* ── 价值卡片 ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                emoji: "🕰️",
                title: "恋爱时间线",
                desc: "整理第一次认识、心动、旅行、争吵和好的节点，让那些瞬间不再只活在记忆里。",
              },
              {
                emoji: "✉️",
                title: "周年纪念信",
                desc: "把普通的聊天和日常，写成一封有仪式感的信，送给未来某一年的你们。",
              },
              {
                emoji: "🌌",
                title: "Relationship Galaxy",
                desc: "把人、地点、对话、情绪变成一张关系星图，让这段感情有了可以看见的形状。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-5"
                style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-sm mb-1" style={{ color: "#2d1f1a" }}>
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#9d7b72" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── 隐私说明 ── */}
          <div
            className="rounded-2xl p-4 mb-8"
            style={{ background: "#f9f5f3", border: "1px solid #ead8d0" }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: "#7a5a52" }}>
              🔒 隐私与边界
            </p>
            <ul className="text-xs space-y-1" style={{ color: "#9d7b72" }}>
              <li>• 不读取微信数据库，不自动导入聊天记录</li>
              <li>• 只处理你主动粘贴的文本</li>
              <li>• 照片当前只记录数量，不上传服务器</li>
            </ul>
          </div>

          {/* ── 当前阶段边界 ── */}
          <div
            className="rounded-2xl p-4 mb-10"
            style={{ background: "#fff3e0", border: "1px solid #ffe0b2" }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: "#e65100" }}>
              ⚠️ 当前阶段说明
            </p>
            <p className="text-xs" style={{ color: "#bf360c" }}>
              本阶段不会调用 AI，不会生成真实纪念册。
              点击开始后进入输入页，可填写信息并预览 MemoryRawMaterial 结构，
              验证你的故事已被完整收集。AI 生成在下一阶段接入。
            </p>
          </div>

          {/* ── CTA 按钮 ── */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-full text-white text-base font-semibold shadow-lg transition-all cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-95"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
          >
            开始整理恋爱故事 →
          </button>

          <p className="text-center text-xs mt-3" style={{ color: "#b08878" }}>
            填写完成后，你可以预览整理好的记忆结构
          </p>
        </div>
      </main>
    </div>
  );
}
