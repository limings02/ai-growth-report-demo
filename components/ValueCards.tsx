// 第三屏：情绪价值卡片区 —— 不用功能词，用情感词
export default function ValueCards() {
  const cards = [
    {
      icon: "🌱",
      title: "成长不会被忘记",
      desc: "把那些容易被时间冲淡的小瞬间，认真保存下来。",
    },
    {
      icon: "📸",
      title: "不只是照片",
      desc: "照片记录样子，故事记录当时的爱、变化和心情。",
    },
    {
      icon: "🎁",
      title: "留给未来的礼物",
      desc: "也许很多年后，这是孩子最珍贵的一份成年礼。",
    },
  ];

  return (
    <section className="px-5 py-20" style={{ background: "#fffaf7" }}>
      <div className="max-w-4xl mx-auto">

        {/* 标题 */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium mb-3 tracking-widest" style={{ color: "#c0674a" }}>
            为什么值得记录
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#2d1f1a" }}>
            每一年都只有一次
          </h2>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title}
              className="rounded-3xl p-7 flex flex-col items-start"
              style={{
                background: "linear-gradient(160deg, #fffaf7 0%, #fdf5f0 100%)",
                border: "1px solid #f0ddd5",
                boxShadow: "0 4px 24px rgba(200, 120, 90, 0.08)"
              }}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: "#2d1f1a" }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7a5a52" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
