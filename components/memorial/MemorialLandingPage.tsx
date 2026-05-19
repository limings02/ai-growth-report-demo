"use client";

// components/memorial/MemorialLandingPage.tsx
// memorial mode 的介绍落地页。
// 定位：人生故事整理 / 家族记忆传承，克制、庄重、温柔。
// 不使用"复活"/"召回"/"和 ta 对话"等表达。

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

export default function MemorialLandingPage({ onStart, onBackToModes }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #f8f7f4 0%, #f2efea 50%, #ece8e0 100%)" }}
    >
      {/* 顶部导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3"
        style={{
          background: "rgba(248, 247, 244, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e0dbd4",
        }}
      >
        <button
          onClick={onBackToModes}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#7a7065" }}
        >
          ← 返回记忆主题
        </button>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10">

        {/* Hero 区 */}
        <div className="mb-10">
          <p className="text-xs font-medium mb-3 opacity-60" style={{ color: "#5a5248" }}>
            🕯️ 纪念册 · preview 体验
          </p>
          <h1
            className="text-3xl font-bold leading-snug mb-4"
            style={{ color: "#2a2520" }}
          >
            把关于 ta 的记忆，
            <br />
            整理成一本
            <br />
            可以留下来的故事
          </h1>
          <p className="text-sm leading-loose" style={{ color: "#5a5248" }}>
            不只是照片，而是那些日常的细节——
            <br />
            ta 的习惯、ta 说过的话、ta 让你记住的一个场景。
            <br />
            这些都值得被好好整理，留给你自己，也留给后来的人。
          </p>
        </div>

        {/* 价值卡片 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { emoji: "⏱", title: "人生片段时间线", desc: "把那些重要的时间节点，整理成一条看得见的线" },
            { emoji: "🔑", title: "家族记忆整理", desc: "把散落在记忆里的细节，整理成一份有温度的记录" },
            { emoji: "👥", title: "重要人物与关系", desc: "ta 生命里出现过的人，以及那些连接" },
            { emoji: "✉️", title: "可保存的纪念文", desc: "写给家人、写给后辈，或只是写给自己" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e0dbd4" }}
            >
              <p className="text-xl mb-2">{card.emoji}</p>
              <p className="text-xs font-semibold mb-1" style={{ color: "#2a2520" }}>
                {card.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#7a7065" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 适合场景 */}
        <div className="mb-8">
          <p className="text-xs font-semibold mb-3" style={{ color: "#5a5248" }}>
            适合什么时候整理
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "家庭纪念",
              "长辈故事整理",
              "清明 / 忌日",
              "家族相册配文字",
              "给后辈看的家族记忆",
              "不想让记忆消失的时候",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.8)", color: "#5a5248", border: "1px solid #d4cfc8" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA 按钮 */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg mb-5"
          style={{ background: "linear-gradient(135deg, #8c7d6e, #6e6058)" }}
        >
          开始整理这份记忆 →
        </button>

        {/* 边界说明 */}
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{ background: "rgba(255,255,255,0.5)", color: "#9a908a", border: "1px solid #e0dbd4" }}
        >
          <p className="font-medium mb-1" style={{ color: "#6a6058" }}>关于 preview 体验</p>
          <p>
            当前阶段展示的是 mock 结果预览，不会调用 AI，不会发送你填写的内容。
            填写内容只在本地浏览器使用，刷新即清除。照片不上传，不保存云端。
          </p>
        </div>

      </div>
    </div>
  );
}
