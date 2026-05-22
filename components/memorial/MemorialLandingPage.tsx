"use client";

// components/memorial/MemorialLandingPage.tsx
// memorial mode 落地页（Phase 15.1B 情绪叙事扩写版）。
// 庄重、克制、有空间感；不模拟逝者；不做对话或人格替代。
// 只帮助整理家人提供的材料，留给家族和后来的人。

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

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10 relative z-10">

        {/* ── 1. Hero 情绪区 ────────────────────────────────────── */}
        <div className="mb-14">
          <p className="text-xs font-medium mb-3 opacity-60" style={{ color: "#5a5248" }}>
            🕯️ 纪念册
          </p>
          <h1
            className="text-3xl font-bold leading-snug mb-5 reveal-up"
            style={{ color: "#2a2520" }}
          >
            把关于 ta 的故事，
            <br />
            整理成一份
            <br />
            <span style={{ color: "#8c7d6e" }}>可以被家人慢慢读起的纪念册。</span>
          </h1>
          <p className="text-sm leading-loose mb-7" style={{ color: "#5a5248" }}>
            不只是照片，而是那些日常的细节——
            <br />
            ta 的习惯、ta 说过的话、ta 让你记住的一个场景。
            <br />
            这些都值得被好好整理，留给你自己，也留给后来的人。
          </p>

          {/* Hero CTA */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #8c7d6e, #6e6058)" }}
          >
            开始整理这份记忆 →
          </button>
        </div>

        {/* ── 2. 为什么要整理 ───────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#2a2520" }}>
            为什么值得把这些故事整理下来
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7a7065" }}>
            不是因为要忘，而是因为不想丢失那些细节。
          </p>
          <div className="space-y-3">
            {[
              {
                icon: "🕰️",
                title: "很多细节会慢慢变模糊",
                desc: "起初你以为会永远记得。但随着时间，那些具体的细节——ta 喜欢哪张椅子，ta 在某天说过的一句话——开始变得模糊。",
              },
              {
                icon: "🖼️",
                title: "旧照片需要文字",
                desc: "相册里那些照片，只有你知道拍摄时发生了什么。把那些背后的故事留下来，照片才真正完整。",
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "家族故事需要被传下去",
                desc: "那些属于你们家庭的故事、习俗和记忆，后来的人也应该知道。文字是比照片更持久的记录。",
              },
              {
                icon: "🌱",
                title: "整理本身也是一种告别",
                desc: "把那些值得留下的片段认真梳理一遍，对自己、对 ta，都是一种温柔的交代。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.55)", border: "1px solid #e0dbd4" }}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#2a2520" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#7a7065" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. 记忆细节卡片 ─────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#2a2520" }}>
            可以写进纪念册的细节
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7a7065" }}>
            不需要宏大的故事，日常的细节才是记忆的质地。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { emoji: "🪑", title: "ta 常坐的位置", desc: "那个角落或那把椅子，对你们来说有特别的意义。" },
              { emoji: "🍳", title: "ta 爱做的一道菜", desc: "味道、做法、和那顿饭有关的一个场景。" },
              { emoji: "💬", title: "ta 总说的一句话", desc: "那些你听了很多次、现在还会浮现的话。" },
              { emoji: "📷", title: "某张旧照片背后的故事", desc: "照片里拍不到的，那一天真正发生的事。" },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-4 soft-slide-up"
                style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e0dbd4" }}
              >
                <p className="text-xl mb-2">{card.emoji}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: "#2a2520" }}>{card.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#7a7065" }}>{card.desc}</p>
              </div>
            ))}
          </div>
          {/* 第五张占据全宽 */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e0dbd4" }}
          >
            <p className="text-xl mb-2">🏡</p>
            <p className="text-xs font-semibold mb-1" style={{ color: "#2a2520" }}>家里某个物件</p>
            <p className="text-xs leading-relaxed" style={{ color: "#7a7065" }}>
              那件摆在角落的东西、那本旧书、那双鞋，背后有一段值得留下来的记忆。
            </p>
          </div>
        </div>

        {/* ── 4. 它会整理什么 ──────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#2a2520" }}>
            它不只是整理文字，而是帮你留住那个人的轮廓
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7a7065" }}>
            你提供材料，AI 帮你整理成四种形式。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                emoji: "⏱",
                title: "人生片段时间线",
                desc: "把那些重要的时间节点，整理成一条看得见的线。不是全部，只是你们觉得值得留下来的那些。",
              },
              {
                emoji: "🔑",
                title: "家族记忆整理",
                desc: "把散落在记忆里的细节，整理成一份有温度的记录。人名、地名、往来和关系，都有了归处。",
              },
              {
                emoji: "👥",
                title: "重要人物与关系",
                desc: "ta 生命里出现过的人，以及那些连接。让家族的脉络可以被看见，也可以被讲述。",
              },
              {
                emoji: "✉️",
                title: "可保存的纪念文",
                desc: "写给家人、写给后辈，或只是写给自己看的一段话。不模板，不套话，来自你们真实提供的材料。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e0dbd4" }}
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-sm mb-1.5" style={{ color: "#2a2520" }}>{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#7a7065" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. 示例预览 ──────────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#2a2520" }}>
            它可能看起来像这样
          </h2>
          <p className="text-xs mb-5" style={{ color: "#9a908a" }}>
            以下是示例片段，不是你的真实生成结果
          </p>

          {/* 纪念文片段 */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "#fdf9f6",
              border: "1px solid #e0dbd4",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #ede8e0 27px, #ede8e0 28px)",
              backgroundSize: "100% 28px",
              backgroundPositionY: "36px",
            }}
          >
            <p className="text-xs font-semibold mb-3 relative z-10" style={{ color: "#8c7d6e" }}>
              ✉️ 纪念文片段示例
            </p>
            <p
              className="text-sm leading-loose relative z-10"
              style={{ color: "#2a2520", fontFamily: "'PingFang SC', 'Hiragino Sans GB', serif" }}
            >
              他不喜欢拍照，所以相册里他的出现总是很少。
              <br />但他在那里，在每一次饭桌旁边，在每一次出门时站在门口目送我们。
              <br /><br />
              把这些写下来，是因为我想让孩子们知道，
              <br />他们的外公是一个怎样生活过的人。
            </p>
          </div>

          {/* 时间线片段 */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e0dbd4" }}
          >
            <p className="text-xs font-semibold mb-4" style={{ color: "#8c7d6e" }}>⏱ 人生片段时间线示例</p>
            <div className="space-y-4">
              {[
                { time: "1960 年代", title: "在农村长大，最早的记忆是麦地", desc: "他说过，那时候天很蓝，早晨出门能看见远处的山。" },
                { time: "1985", title: "和外婆认识，在工厂的礼堂跳舞", desc: "他后来不爱提这些，但外婆说那天他穿了一件白衬衫。" },
                { time: "2003", title: "第一次坐飞机，来看我们", desc: "他说脚踩在地上就好，不喜欢飘在空中的感觉。" },
              ].map((item) => (
                <div key={item.time} className="flex gap-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 h-fit"
                    style={{ background: "#ece8e0", color: "#7a7065" }}
                  >
                    {item.time}
                  </span>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: "#2a2520" }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#7a7065" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 记忆细节小卡片示例 */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e0dbd4" }}
          >
            <p className="text-xs font-semibold mb-3" style={{ color: "#8c7d6e" }}>📌 记忆细节片段示例</p>
            <div className="space-y-2">
              {[
                "他喜欢靠窗的位置，说看得见外面心里踏实",
                "家里有一本红色封面的日历，他每年都买同一个牌子",
                "他不爱说「我爱你」，但会在你要走的时候多留你喝一杯茶",
              ].map((detail) => (
                <p
                  key={detail}
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ background: "#f5f1ec", color: "#5a5248" }}
                >
                  · {detail}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── 6. 适合场景 ──────────────────────────────────────── */}
        <div className="mb-10">
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

        {/* ── 中部 CTA ─────────────────────────────────────────── */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg mb-10"
          style={{ background: "linear-gradient(135deg, #8c7d6e, #6e6058)" }}
        >
          开始整理这份记忆 →
        </button>

        {/* ── 7. 边界说明（庄重温柔版）───────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-semibold mb-4" style={{ color: "#7a7065" }}>
            关于这本纪念册的边界
          </p>
          <div
            className="rounded-2xl px-5 py-4 space-y-2"
            style={{ background: "rgba(255,255,255,0.55)", border: "1px solid #d4cfc8" }}
          >
            {[
              { positive: true,  text: "只整理你主动提供的照片、文字和故事" },
              { positive: false, text: "不创造新的个人表达" },
              { positive: false, text: "不包装成交互式人格" },
              { positive: false, text: "不替代真实的怀念与悲伤" },
              { positive: true,  text: "帮助这些记忆被家人慢慢读起" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2.5">
                <span className="text-sm flex-shrink-0" style={{ color: item.positive ? "#8c7d6e" : "#b8b0a8" }}>
                  {item.positive ? "✓" : "·"}
                </span>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: item.positive ? "#5a5248" : "#7a7065" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. 隐私说明 ──────────────────────────────────────── */}
        <div
          className="rounded-xl px-4 py-3 mb-5 text-xs leading-relaxed"
          style={{ background: "rgba(255,255,255,0.5)", color: "#9a908a", border: "1px solid #e0dbd4" }}
        >
          <p className="font-medium mb-1" style={{ color: "#6a6058" }}>🔒 关于你的隐私</p>
          <p>
            照片不上传，不保存云端。当前档案默认保存在本地浏览器；登录不会自动上传。
          </p>
        </div>

        {/* ── 底部 CTA ──────────────────────────────────────────── */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #8c7d6e, #6e6058)" }}
        >
          开始整理这份记忆 →
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "#9a908a" }}>
          填写完成后，AI 会整理生成这份家族纪念册
        </p>

      </div>
    </div>
  );
}
