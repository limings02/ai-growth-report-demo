"use client";

// components/family/FamilyLandingPage.tsx
// family mode 的专属 landing 页。
// 允许使用孩子成长专属文案，因为这是 family 范围内的内容。
// 顶部有「← 返回记忆主题」，让用户可以退回全局首页。

import LandingHero from "@/components/LandingHero";
import FutureScene from "@/components/FutureScene";
import ValueCards from "@/components/ValueCards";
import HowItWorks from "@/components/HowItWorks";

type Props = {
  onStart: () => void;
  onBackToModes: () => void;
};

export default function FamilyLandingPage({ onStart, onBackToModes }: Props) {
  return (
    <main className="flex-1 flex flex-col">
      {/* 顶部导航：返回记忆主题选择 */}
      <div
        className="sticky top-0 z-20 px-5 py-3"
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
      </div>

      {/* 原有的孩子成长 landing 内容 */}
      <LandingHero onStart={onStart} />
      <FutureScene />
      <ValueCards />
      <HowItWorks onStart={onStart} />
    </main>
  );
}
