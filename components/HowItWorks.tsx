// 第四屏：使用步骤区 —— 轻轻提 AI，重点是简单
export default function HowItWorks({ onStart }: { onStart: () => void }) {
  const steps = [
    { num: "01", icon: "📸", title: "上传照片", desc: "选择这一年拍的照片，可以是几张也可以是很多张。" },
    { num: "02", icon: "💬", title: "回答几个问题", desc: "今年最难忘的事？孩子学会了什么？你想说的那句话。" },
    { num: "03", icon: "✨", title: "生成成长礼物", desc: "AI 帮你整理成一份排版精美的成长故事册。" },
    { num: "04", icon: "🖨️", title: "打印或保存", desc: "一键打印成 PDF，装进相框，或者压进成长纪念盒。" },
  ];

  return (
    <section className="px-5 py-20"
      style={{ background: "linear-gradient(180deg, #fffaf7 0%, #fdf0e8 100%)" }}>
      <div className="max-w-4xl mx-auto">

        {/* 标题 */}
        <div className="text-center mb-14">
          <p className="text-sm font-medium mb-3 tracking-widest" style={{ color: "#c0674a" }}>
            简单四步
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#2d1f1a" }}>
            只需要几分钟，整理孩子这一年的故事
          </h2>
        </div>

        {/* 步骤卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {steps.map((step) => (
            <div key={step.num}
              className="rounded-3xl p-6 flex flex-col"
              style={{
                background: "#fffaf7",
                border: "1px solid #f0ddd5",
                boxShadow: "0 4px 20px rgba(200, 120, 90, 0.07)"
              }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#fde8dc", color: "#c0674a" }}>
                  {step.num}
                </span>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#2d1f1a" }}>
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "#7a5a52" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* AI 轻描述 */}
        <p className="text-center text-sm mb-10" style={{ color: "#b08878" }}>
          🤍 AI 只是帮你整理，真正珍贵的是你记得的那些瞬间。
        </p>

        {/* 底部 CTA */}
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="px-10 py-4 rounded-full text-white text-base font-semibold shadow-lg
              transition-all hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}>
            开始记录这一年 →
          </button>
        </div>
      </div>
    </section>
  );
}
