"use client";

// 第一屏：Hero 区 —— 情感冲击 + 预览卡片
export default function LandingHero({ onStart }: { onStart: () => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-5 py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fff8f3 0%, #fdf0e8 40%, #fce8e0 100%)" }}>

      {/* 背景装饰圆 */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #f4b8a0, transparent)" }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #fcd5c0, transparent)" }} />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* 左侧文字区 */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* 小标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: "#fde8dc", color: "#c0674a" }}>
            <span>🎁</span>
            <span>给孩子的成长礼物</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{ color: "#2d1f1a", lineHeight: "1.35" }}>
            有一天，孩子会看见<br />
            <span style={{ color: "#e07a5f" }}>自己是如何被爱着长大的。</span>
          </h1>

          {/* 副标题 */}
          <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
            style={{ color: "#7a5a52" }}>
            上传这一年的照片和故事，AI 会帮你整理成一份<br className="hidden sm:block" />
            未来会被珍藏的成长礼物。
          </p>

          {/* 按钮组 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-white text-base font-semibold shadow-lg
                transition-all hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}>
              开始记录这一年 →
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-6 py-4 rounded-full text-base font-medium
                transition-colors hover:bg-white cursor-pointer"
              style={{ color: "#c0674a", border: "1.5px solid #f4b8a0", background: "transparent" }}>
              看看会生成什么
            </button>
          </div>

          {/* 隐私说明 */}
          <p className="mt-6 text-xs" style={{ color: "#b08878" }}>
            🔒 照片仅在本地预览，第一版不会上传服务器
          </p>
        </div>

        {/* 右侧预览卡片 —— 模拟成长册 */}
        <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
          <PreviewCard />
        </div>
      </div>
    </section>
  );
}

// 成长礼物预览卡片（仿手账/相册质感）
function PreviewCard() {
  return (
    <div className="rounded-3xl p-6 shadow-2xl relative"
      style={{
        background: "#fffaf7",
        border: "1px solid #f0ddd5",
        boxShadow: "0 20px 60px rgba(200, 120, 90, 0.15), 0 4px 20px rgba(0,0,0,0.05)"
      }}>

      {/* 卡片顶部装饰 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f4b8a0" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fcd5c0" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fde8dc" }} />
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: "#fde8dc", color: "#c0674a" }}>
          2024 成长礼物
        </span>
      </div>

      {/* 卡片标题 */}
      <h3 className="text-lg font-bold mb-1" style={{ color: "#2d1f1a" }}>
        小小的你，正在认真长大
      </h3>
      <p className="text-xs mb-5" style={{ color: "#b08878" }}>写给三岁的小熊宝</p>

      {/* 照片占位 */}
      <div className="rounded-2xl mb-4 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fde8dc, #fcd5c0)", height: "100px" }}>
        <span className="text-3xl">📸</span>
      </div>

      {/* 年度关键词 */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: "#b08878" }}>✨ 年度关键词</p>
        <div className="flex flex-wrap gap-1.5">
          {["第一次走路", "爱笑", "小话痨", "勇敢"].map((kw) => (
            <span key={kw} className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "#fde8dc", color: "#c0674a" }}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 成长时间线 */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: "#b08878" }}>⏱ 成长时间线</p>
        <div className="space-y-2">
          {[
            { time: "3月", event: "第一次独立走完整段路" },
            { time: "7月", event: "说了第一个完整的句子" },
            { time: "12月", event: "开始喜欢问「为什么」" },
          ].map((item) => (
            <div key={item.time} className="flex items-start gap-2 text-xs">
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium"
                style={{ background: "#f4b8a0", color: "#8b4a38" }}>
                {item.time}
              </span>
              <span style={{ color: "#5a3d35" }}>{item.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 写给 18 岁 */}
      <div className="rounded-xl p-3" style={{ background: "#fdf5f2" }}>
        <p className="text-xs font-semibold mb-1.5" style={{ color: "#b08878" }}>💌 写给 18 岁的你</p>
        <p className="text-xs leading-relaxed italic" style={{ color: "#7a5a52" }}>
          &ldquo;那时候你还那么小，却已经对世界充满好奇。妈妈希望你永远保留这份热情……&rdquo;
        </p>
      </div>
    </div>
  );
}
