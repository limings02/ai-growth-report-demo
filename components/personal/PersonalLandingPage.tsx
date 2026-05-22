"use client";

// components/personal/PersonalLandingPage.tsx
// personal mode 落地页（Phase 15.1B 情绪叙事扩写版）。
// 人生阶段展厅：Hero / 情绪场景 / BeforeAfter / 它会整理什么 / 示例预览 / 未来打开 / 适合场景 / 隐私 / CTA。

import EmotionalBackdrop from "@/components/visual/EmotionalBackdrop";

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

const LIFE_STAGE_SCENES = [
  { emoji: "🎓", title: "毕业前后", desc: "那段时间又兴奋又不安。你不确定下一步，但你走了。值得被好好记住。" },
  { emoji: "🏙️", title: "搬去新城市", desc: "第一个人在陌生地方吃完第一顿饭。那种孤独和自由同时存在的感觉。" },
  { emoji: "💼", title: "第一份工作", desc: "什么都不懂但努力装作懂的样子。那段时间改变了你对很多事的看法。" },
  { emoji: "🌑", title: "走出低谷", desc: "也许某段时间你不太好。回头看，那段时间也是你的一部分。" },
  { emoji: "🌱", title: "某段关系结束", desc: "不一定是坏事，但那个人和那段时光，值得被好好放下。" },
  { emoji: "🔮", title: "三十岁前后", desc: "开始回望，开始整理，开始想把一些东西留下来。这很好。" },
];

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

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10 relative z-10">

        {/* ── 1. Hero 情绪区 ─────────────────────────────────────── */}
        <div className="mb-14">
          <p className="text-xs font-medium mb-3 opacity-60" style={{ color: "#5568a0" }}>
            📖 个人回忆录
          </p>
          <h1
            className="text-3xl font-bold leading-snug mb-5 reveal-up"
            style={{ color: "#1a2340" }}
          >
            把某段人生重新摊开，
            <br />
            <span style={{ color: "#6b8adc" }}>看见你是怎样走到今天的。</span>
          </h1>
          <p className="text-sm leading-loose mb-7" style={{ color: "#4a5880" }}>
            大学四年、第一份工作、换城市、走出低谷……
            <br />
            那些没说完的故事，值得被认真整理一次。
            <br />
            不是为了怀旧，是为了真正看清那段时间的自己。
          </p>

          {/* 浮动记忆 chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["毕业那年", "那段低谷", "第一份工作", "换城市那天", "三十岁前", "写给未来自己"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full slow-fade-in"
                style={{
                  background: "rgba(107, 138, 220, 0.12)",
                  color: "#5568a0",
                  border: "1px solid #c8d0e8",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hero CTA */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg gentle-glow"
            style={{ background: "linear-gradient(135deg, #6b8adc, #5568a0)" }}
          >
            开始整理这段人生 →
          </button>
        </div>

        {/* ── 2. 它在等那些你还没整理好的时光 ──────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#1a2340" }}>
            它在等那些你还没整理好的时光
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6b7db3" }}>
            选一段、选一年，或者选你最想整理的那个阶段。
          </p>
          <div className="grid grid-cols-2 gap-3">
            {LIFE_STAGE_SCENES.map((scene) => (
              <div
                key={scene.title}
                className="rounded-2xl p-4 soft-slide-up"
                style={{ background: "rgba(255,255,255,0.72)", border: "1px solid #dde3f0" }}
              >
                <p className="text-xl mb-2">{scene.emoji}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: "#1a2340" }}>
                  {scene.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7db3" }}>
                  {scene.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. 整理前 vs 整理后 ──────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-6" style={{ color: "#1a2340" }}>
            整理前 vs 整理后
          </h2>
          <div className="rounded-2xl p-5 mb-3" style={{ background: "rgba(240,240,250,0.6)", border: "1px solid #dde3f0" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#8090b8" }}>整理前</p>
            <ul className="text-sm space-y-2" style={{ color: "#6b7db3" }}>
              <li>· 照片散在相册里，想找找不到</li>
              <li>· 日记散在备忘录、朋友圈、聊天框里</li>
              <li>· 很多事你以为忘了，其实还在</li>
              <li>· 那段时间到底发生了什么，说不清楚</li>
            </ul>
          </div>
          <div className="text-center py-2 text-lg" style={{ color: "#6b8adc" }}>↓ AI 整理之后</div>
          <div className="rounded-2xl p-5" style={{ background: "rgba(107,138,220,0.10)", border: "1px solid #c8d0e8" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#5568a0" }}>整理后</p>
            <ul className="text-sm space-y-2" style={{ color: "#4a5880" }}>
              <li>· 一条清晰的人生阶段时间线</li>
              <li>· 那段时间最核心的关键词</li>
              <li>· 一封写给未来自己的信</li>
              <li>· 一张记录人、地点、事件的记忆图谱</li>
            </ul>
          </div>
        </div>

        {/* ── 4. 它会整理什么 ──────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#1a2340" }}>
            不只是回忆，而是重新认识那段时间里的自己
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6b7db3" }}>
            你提供材料，AI 帮你整理成四种形式。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                emoji: "⏱",
                title: "人生阶段时间线",
                desc: "那段时间里的重要节点，被整理成一条看得见的线。毕业、换城市、第一份工作、某个转折——都有自己的位置。",
              },
              {
                emoji: "🔑",
                title: "关键词与情绪底色",
                desc: "提炼那一阶段最核心的词：也许是「漂浮」，也许是「重建」，也许是「第一次一个人」。让那段时间有了名字。",
              },
              {
                emoji: "✉️",
                title: "写给未来自己的信",
                desc: "从现在的视角，回望那段时间，写一封只有你自己才懂的信。半年后、三年后、很久以后重新打开，还是这个你。",
              },
              {
                emoji: "🧭",
                title: "个人记忆图谱",
                desc: "那段时间出现过的人、去过的地方、发生的事、感受到的情绪——被整理成一张有形状的记忆地图。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #dde3f0" }}
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-sm mb-1.5" style={{ color: "#1a2340" }}>
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7db3" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. 示例预览 ──────────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#1a2340" }}>
            它可能看起来像这样
          </h2>
          <p className="text-xs mb-5" style={{ color: "#8090b8" }}>
            以下是示例片段，不是你的真实生成结果
          </p>

          {/* 时间线示例 */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #dde3f0" }}
          >
            <p className="text-xs font-semibold mb-4" style={{ color: "#5568a0" }}>⏱ 时间线片段示例</p>
            <div className="space-y-4">
              {[
                { time: "2019.09", title: "第一次独自报到", desc: "拎着行李走进陌生的宿舍，那是第一次意识到很多事要自己扛了。" },
                { time: "2021.04", title: "低谷期开始", desc: "那几个月常常走路走到很远的地方才回来，不太爱说话。现在想想那段时间也是一种清醒。" },
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

          {/* 关键词示例 */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #dde3f0" }}
          >
            <p className="text-xs font-semibold mb-3" style={{ color: "#5568a0" }}>🔑 关键词示例</p>
            <div className="flex flex-wrap gap-2">
              {["漂浮", "重建", "第一次一个人", "静下来", "慢慢摸索", "值得"].map((kw) => (
                <span
                  key={kw}
                  className="text-sm px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "#e8edf8", color: "#5568a0", border: "1px solid #c8d0e8" }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* 写给未来自己的信片段 */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#fafbff",
              border: "1px solid #dde3f0",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #e8edf8 27px, #e8edf8 28px)",
              backgroundSize: "100% 28px",
              backgroundPositionY: "36px",
            }}
          >
            <p className="text-xs font-semibold mb-3 relative z-10" style={{ color: "#5568a0" }}>
              ✉️ 写给未来自己的信片段示例
            </p>
            <p
              className="text-sm leading-loose relative z-10"
              style={{ color: "#1a2340", fontFamily: "'PingFang SC', 'Hiragino Sans GB', serif" }}
            >
              写给若干年后的你：<br /><br />
              那段时间你比自己想象中更勇敢。<br />
              你去了新城市，开始了一份新工作，<br />
              在没有人认识你的地方，<br />
              慢慢重新认识了自己。<br /><br />
              如果你忘了那种感觉，就回来这里看看。<br />
              这本册子是那段时间真实存在过的证据。
            </p>
          </div>
        </div>

        {/* ── 6. 未来重新打开的场景 ────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-lg font-bold mb-2" style={{ color: "#1a2340" }}>
            整理好之后，它会在未来某天等着你
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6b7db3" }}>
            不一定要马上读完。存下来，等到那个时刻。
          </p>
          <div className="space-y-3">
            {[
              { icon: "📅", scene: "半年后重新打开", desc: "那段时间现在看起来不一样了，也许比你以为的更重要。" },
              { icon: "💼", scene: "换工作之前重新打开", desc: "回顾上一段职场经历，看清楚自己真正想要的是什么。" },
              { icon: "🎂", scene: "30 岁生日那天打开", desc: "在整数的年纪，把来时的路重新走一遍。" },
              { icon: "🌙", scene: "很久以后，给自己解释那段时间", desc: "你会感谢那时候的自己，把那些细节好好留了下来。" },
            ].map((item) => (
              <div
                key={item.scene}
                className="flex gap-4 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #dde3f0" }}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#1a2340" }}>{item.scene}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7db3" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. 适合什么时候整理 ──────────────────────────────── */}
        <div className="mb-10">
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

        {/* ── 8. 隐私说明 ──────────────────────────────────────── */}
        <div
          className="rounded-xl px-4 py-3 mb-5 text-xs leading-relaxed"
          style={{ background: "rgba(255,255,255,0.5)", color: "#8090b8", border: "1px solid #dde3f0" }}
        >
          <p className="font-medium mb-1" style={{ color: "#5568a0" }}>🔒 关于你的隐私</p>
          <p>
            你可以只填写愿意整理的片段，不需要全部。当前档案默认保存在本地浏览器；登录不会自动上传。
          </p>
        </div>

        {/* ── 底部 CTA ──────────────────────────────────────────── */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg gentle-glow"
          style={{ background: "linear-gradient(135deg, #6b8adc, #5568a0)" }}
        >
          开始整理这段人生 →
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "#8090b8" }}>
          填写完成后，AI 会整理生成你的个人回忆录
        </p>

      </div>
    </div>
  );
}
