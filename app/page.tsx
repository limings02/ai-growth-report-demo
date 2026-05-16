"use client";

import LandingHero from "@/components/LandingHero";
import FutureScene from "@/components/FutureScene";
import ValueCards from "@/components/ValueCards";
import HowItWorks from "@/components/HowItWorks";

// 页面入口：当前展示 Landing Page
// 阶段2起会引入 GrowthReportApp，把状态机嵌入这里
export default function Home() {
  // 占位：阶段2接入状态机后，这里改为切换到 input 状态
  function handleStart() {
    alert("表单功能即将上线，敬请期待！");
  }

  return (
    <main className="flex-1 flex flex-col">
      <LandingHero onStart={handleStart} />
      <FutureScene />
      <ValueCards />
      <HowItWorks onStart={handleStart} />
    </main>
  );
}
