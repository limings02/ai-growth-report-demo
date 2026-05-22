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

        {/* 原有的孩子成长 landing 内容 */}
        <LandingHero onStart={onStart} />
        <FutureScene />
        <ValueCards />
        <HowItWorks onStart={onStart} />
      </div>
    </main>
  );
}
