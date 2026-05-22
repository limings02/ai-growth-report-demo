"use client";

// components/personal/PersonalLandingPage.tsx
// personal mode 的介绍落地页（Phase 15.0 情绪升级版）。
// 删除 preview/mock 旧文案；呈现为真实可用的人生阶段展厅。

import EmotionalBackdrop from "@/components/visual/EmotionalBackdrop";

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

export default function PersonalLandingPage({ onStart, onBackToModes }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "linear-gradient(160deg, #f5f8ff 0%, #eef2fb 50%, #e8edf8 100%)" }}
    >
      <EmotionalBackdrop tone="personal" />
      {/* 顶部导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3"
        style={{
          background: "rgba(248, 250, 255, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #dde3f0",
        }}
      >
        <button
          onClick={onBackToModes}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#6b7db3" }}
        >
          ← 返回记忆主题
        </button>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10">

        {/* Hero 区 */}
        <div className="mb-10">
          <p className="text-xs font-medium mb-3 opacity-60" style={{ color: "#5568a0" }}>
            📖 个人回忆录
          </p>
          <h1
            className="text-3xl font-bold leading-snug mb-4 reveal-up"
            style={{ color: "#1a2340" }}
          >
            把某段人生重新摊开，
            <br />
            <span style={{ color: "#6b8adc" }}>看见那些你曾经怎样走过。</span>
          </h1>
          <p className="text-sm leading-loose" style={{ color: "#4a5880" }}>
            大学四年、第一份工作、搬去新城市、走出低谷……
            <br />
            那些你没说完的故事，值得被认真整理一次。
          </p>
        </div>

        {/* 价值卡片 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { emoji: "⏱", title: "人生阶段时间线", desc: "把那段时间的重要节点，整理成清晰的时间线" },
            { emoji: "🔑", title: "关键词与情绪底色", desc: "提炼那一阶段最核心的词，让它有名字" },
            { emoji: "✉️", title: "写给未来自己的信", desc: "从现在回望，写一封只有你自己才懂的信" },
            { emoji: "🧭", title: "个人记忆图谱", desc: "人、地点、事件、情绪——整理成一张记忆地图" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #dde3f0" }}
            >
              <p className="text-xl mb-2">{card.emoji}</p>
              <p className="text-xs font-semibold mb-1" style={{ color: "#1a2340" }}>
                {card.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7db3" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 适合场景 */}
        <div className="mb-8">
          <p className="text-xs font-semibold mb-3" style={{ color: "#5568a0" }}>
            适合什么时候整理
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "毕业前后",
              "换城市了",
              "换工作了",
              "走出一段低谷",
              "30 岁前后",
              "某段关系结束了",
              "想留给未来的自己",
              "想整理清楚那段时间",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.8)", color: "#5568a0", border: "1px solid #c8d0e8" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 静态样例预览 */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #dde3f0" }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "#5568a0" }}>
            示例：时间线片段
          </p>
          <div className="space-y-3">
            {[
              { time: "2019.09", title: "第一次独自报到", desc: "拎着行李走进陌生的宿舍，那是第一次意识到很多事要自己扛。" },
              { time: "2021.04", title: "低谷期开始", desc: "那几个月常常走路走到很远的地方才回来，不太爱说话。" },
              { time: "2023.06", title: "毕业那天在操场坐了很久", desc: "不是舍不得，只是想再确认一次——这一切真的发生过。" },
            ].map((item) => (
              <div key={item.time} className="flex gap-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 h-fit"
                  style={{ background: "#e8edf8", color: "#5568a0" }}
                >
                  {item.time}
                </span>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "#1a2340" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7db3" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA 按钮 */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg mb-5"
          style={{ background: "linear-gradient(135deg, #6b8adc, #5568a0)" }}
        >
          开始整理这段人生 →
        </button>

        {/* 隐私说明 */}
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{ background: "rgba(255,255,255,0.5)", color: "#8090b8", border: "1px solid #dde3f0" }}
        >
          <p className="font-medium mb-1" style={{ color: "#5568a0" }}>🔒 关于你的隐私</p>
          <p>
            你可以只填写愿意整理的片段。当前档案默认保存在本地浏览器；登录不会自动上传。
          </p>
        </div>

      </div>
    </div>
  );
}
