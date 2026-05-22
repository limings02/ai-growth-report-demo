"use client";

// components/family/FamilyLandingPage.tsx
// family mode 的专属 landing 页（Phase 15.1A.1 修复版）。
// 增加情绪背景层和未来打开场景；不删除原有子组件。
// 层级说明：backdrop = fixed z-0；sticky nav = z-20；正文内容 = relative z-10。

import LandingHero from "@/components/LandingHero";
import FutureScene from "@/components/FutureScene";
import ValueCards from "@/components/ValueCards";
import HowItWorks from "@/components/HowItWorks";
import EmotionalBackdrop from "@/components/visual/EmotionalBackdrop";

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
  onOpenArchive?: () => void;
};

export default function FamilyLandingPage({ onStart, onBackToModes, onOpenArchive }: Props) {
  return (
    <main className="flex-1 flex flex-col relative">
      {/* 背景层：fixed z-0，不影响交互 */}
      <EmotionalBackdrop tone="family" />

      {/* 顶部导航：sticky z-20，独立于正文 z-10 */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between gap-3"
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
        {onOpenArchive && (
          <button
            onClick={onOpenArchive}
            className="text-sm cursor-pointer hover:underline flex items-center gap-1"
            style={{ color: "#c0674a" }}
          >
            📚 我的成长册
          </button>
        )}
      </div>

      {/* 正文内容：统一包在 relative z-10，确保所有子组件都在 backdrop 上方 */}
      <div className="relative z-10">
        {/* 情绪引导语 */}
        <div className="text-center px-6 pt-8 pb-2">
          <p className="text-sm leading-relaxed max-w-sm mx-auto reveal-up" style={{ color: "#c0674a", fontWeight: 500 }}>
            有些成长，不应该只躺在相册里。<br />
            它们可以变成一份在很多年后重新打开的礼物。
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {["18 岁生日", "毕业那天", "离家上大学前"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,248,245,0.85)", color: "#c0674a", border: "1px solid #f0ddd5" }}
              >
                {tag}打开这本成长册
              </span>
            ))}
          </div>
        </div>

        {/* 从照片到成长册：Before / After */}
        <div className="px-5 pb-2 pt-4">
          <div className="max-w-lg mx-auto">
            <div
              className="rounded-2xl p-5 mb-3"
              style={{ background: "rgba(253,232,220,0.35)", border: "1px solid #f0ddd5" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "#b08878" }}>整理前</p>
              <ul className="text-sm space-y-1.5" style={{ color: "#9d7b72" }}>
                <li>· 照片散在相册里，翻不到那一张</li>
                <li>· 视频存着但太长，没有人会从头看</li>
                <li>· 那些细节，大人忘了，孩子还不懂</li>
              </ul>
            </div>
            <div className="text-center py-2 text-base" style={{ color: "#e07a5f" }}>↓ AI 整理之后</div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(232,131,106,0.10)", border: "1px solid #f0ddd5" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "#c0674a" }}>整理后</p>
              <ul className="text-sm space-y-1.5" style={{ color: "#7a5a52" }}>
                <li>· 一份有封面、有时间线、有关键词的成长册</li>
                <li>· 一封写给未来孩子的信</li>
                <li>· 一张记录成长节点的记忆星图</li>
                <li>· 一个可以被珍藏、被打开的礼物</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 原有的孩子成长 landing 内容 */}
        <LandingHero onStart={onStart} />
        <FutureScene />
        <ValueCards />
        <HowItWorks onStart={onStart} />

        {/* 仪式感：在这些时刻打开这本成长册 */}
        <div className="px-5 py-10">
          <div className="max-w-lg mx-auto">
            <h2
              className="text-lg font-bold text-center mb-2"
              style={{ color: "#2d1f1a" }}
            >
              在这些时刻，打开这本成长册
            </h2>
            <p className="text-center text-sm mb-7" style={{ color: "#9d7b72" }}>
              它不只是现在的礼物，更是将来才能打开的信。
            </p>
            <div className="space-y-3">
              {[
                { icon: "🎂", scene: "18 岁生日那天", desc: "从孩子学会走路一直到长大成人，这本册子见证了中间所有的细节。" },
                { icon: "🎓", scene: "毕业的时候", desc: "一个阶段结束了。打开这份成长记录，看看是怎样一步步走到今天的。" },
                { icon: "🚪", scene: "离家上大学前", desc: "下一次打开，他也许会在另一个城市。这是你们还在一起时留下的记录。" },
                { icon: "🌙", scene: "很久以后，孩子给自己看", desc: "有一天他会想知道，自己小时候是什么样的孩子。这本册子会告诉他。" },
              ].map((item) => (
                <div
                  key={item.scene}
                  className="flex gap-4 rounded-2xl p-4"
                  style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "#2d1f1a" }}>{item.scene}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#9d7b72" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
