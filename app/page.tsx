"use client";

// app/page.tsx
// 全局路由控制。
// 默认进入 MemoryModeHome（记忆主题选择页），
// 通过前端状态跳转到各子页面。
//
// Phase 8.1 变更：
// - couple mode 从 ComingSoonModePage 改为进入 CoupleMemoryApp（输入骨架）
// - personal / memorial 仍然 coming soon

import { useState } from "react";
import type { MemoryMode } from "@/lib/memory-core/modes";
import MemoryModeHome from "@/components/MemoryModeHome";
import FamilyLandingPage from "@/components/family/FamilyLandingPage";
import ComingSoonModePage from "@/components/ComingSoonModePage";
import GrowthReportApp from "@/components/GrowthReportApp";
import CoupleMemoryApp from "@/components/couple/CoupleMemoryApp";

type HomeScreen =
  | "mode-select"
  | "family-landing"
  | "family-app"
  | "couple-app"
  | "coming-soon";

export default function Home() {
  const [screen, setScreen] = useState<HomeScreen>("mode-select");
  const [selectedMode, setSelectedMode] = useState<MemoryMode | null>(null);

  function handleSelectMode(mode: MemoryMode) {
    setSelectedMode(mode);
    if (mode === "family") {
      setScreen("family-landing");
    } else if (mode === "couple") {
      setScreen("couple-app");
    } else {
      setScreen("coming-soon");
    }
  }

  // family 生成页
  if (screen === "family-app") {
    return (
      <GrowthReportApp
        onBackToLanding={() => setScreen("family-landing")}
      />
    );
  }

  // family landing（孩子成长专属）
  if (screen === "family-landing") {
    return (
      <FamilyLandingPage
        onStart={() => setScreen("family-app")}
        onBackToModes={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // couple mode 输入页骨架（Phase 8.1，暂不接入 AI 生成）
  if (screen === "couple-app") {
    return (
      <CoupleMemoryApp
        onBackToModes={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // personal / memorial coming soon
  if (screen === "coming-soon" && selectedMode) {
    return (
      <ComingSoonModePage
        mode={selectedMode}
        onBack={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // 默认：全局记忆主题首页
  return <MemoryModeHome onSelectMode={handleSelectMode} />;
}
