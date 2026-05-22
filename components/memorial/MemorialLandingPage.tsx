"use client";

// components/memorial/MemorialLandingPage.tsx
// memorial mode 的介绍落地页（Phase 15.0 情绪升级版）。
// 庄重、克制、有空间感；明确安全边界；删除 preview/mock 旧文案。
// 绝不出现：复活 / 召回 / 和 ta 对话 / 数字生命 / 再见一面。

import EmotionalBackdrop from "@/components/visual/EmotionalBackdrop";

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

export default function MemorialLandingPage({ onStart, onBackToModes }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "linear-gradient(160deg, #f8f7f4 0%, #f2efea 50%, #ece8e0 100%)" }}
    >
      <EmotionalBackdrop tone="memorial" />
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
            🕯️ 纪念册
          </p>
          <h1
            className="text-3xl font-bold leading-snug mb-4 reveal-up"
            style={{ color: "#2a2520" }}
          >
            把关于 ta 的故事，
            <br />
            整理成一份
            <br />
            <span style={{ color: "#8c7d6e" }}>可以被家人慢慢读起的纪念册。</span>
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

        {/* 明确边界声明 */}
        <div
          className="rounded-xl px-4 py-4 mb-5 text-xs leading-relaxed space-y-1.5"
          style={{ background: "rgba(255,255,255,0.55)", color: "#7a7065", border: "1px solid #d4cfc8" }}
        >
          <p className="font-semibold text-sm mb-2" style={{ color: "#5a5248" }}>我们不会做什么</p>
          <p>· 不模拟 ta 说话，不制造对话</p>
          <p>· 不使用「复活」「再见一面」等表达</p>
          <p>· 不替代真实的怀念和悲伤</p>
          <p>· 只帮助整理你愿意留下的故事</p>
        </div>

        {/* 隐私说明 */}
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{ background: "rgba(255,255,255,0.5)", color: "#9a908a", border: "1px solid #e0dbd4" }}
        >
          <p className="font-medium mb-1" style={{ color: "#6a6058" }}>🔒 关于你的隐私</p>
          <p>
            照片不上传，不保存云端。当前档案默认保存在本地浏览器；登录不会自动上传。
          </p>
        </div>

      </div>
    </div>
  );
}
