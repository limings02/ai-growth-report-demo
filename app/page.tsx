// 页面入口：阶段1展示静态首页，后续阶段会引入 GrowthReportApp 替换
export default function Home() {
  return (
    <main
      className="flex-1 flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--background)" }}
    >
      {/* 顶部装饰 */}
      <div className="text-5xl mb-6">🌸</div>

      {/* 主标题 */}
      <h1
        className="text-4xl font-bold text-center mb-3"
        style={{ color: "var(--foreground)" }}
      >
        AI 成长年报生成器
      </h1>

      {/* 副标题 */}
      <p className="text-lg text-center mb-2" style={{ color: "var(--text-muted)" }}>
        用 AI 为孩子生成专属年度成长总结
      </p>
      <p className="text-base text-center mb-10" style={{ color: "var(--text-muted)" }}>
        填写孩子信息 · 上传照片 · 一键生成 · 打印珍藏
      </p>

      {/* 功能亮点卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
        {[
          { icon: "📝", title: "智能文案", desc: "根据你的回答自动生成温暖文字" },
          { icon: "📸", title: "照片珍藏", desc: "上传照片，制作专属年报" },
          { icon: "🖨️", title: "一键打印", desc: "排版精美，直接保存为 PDF" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl p-5 text-center"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              {item.title}
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* 开始按钮（阶段1为静态，后续阶段接入状态机） */}
      <button
        className="px-10 py-4 rounded-full text-white text-lg font-semibold shadow-md
          transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
        style={{ background: "var(--primary)" }}
      >
        开始制作年报 →
      </button>

      {/* 底部说明 */}
      <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
        照片仅在本地预览，不上传服务器 · 完全免费
      </p>
    </main>
  );
}
