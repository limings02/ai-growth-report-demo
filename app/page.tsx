"use client";

// app/page.tsx
// 全局路由控制。
// 默认进入 MemoryModeHome（记忆主题选择页），
// 通过前端状态跳转到各子页面。
//
// Phase 8.1.1：couple mode 增加 couple-landing
// Phase 10.1：personal mode 从 coming-soon 改为 personal-landing → personal-app
// Phase 11.1：memorial mode 从 coming-soon 改为 memorial-landing → memorial-app

import { useState } from "react";
import type { MemoryMode } from "@/lib/memory-core/modes";
import MemoryModeHome from "@/components/MemoryModeHome";
import FamilyLandingPage from "@/components/family/FamilyLandingPage";
import ComingSoonModePage from "@/components/ComingSoonModePage";
import GrowthReportApp from "@/components/GrowthReportApp";
import CoupleLandingPage from "@/components/couple/CoupleLandingPage";
import CoupleMemoryApp from "@/components/couple/CoupleMemoryApp";
import PersonalLandingPage from "@/components/personal/PersonalLandingPage";
import PersonalMemoryApp from "@/components/personal/PersonalMemoryApp";
import MemorialLandingPage from "@/components/memorial/MemorialLandingPage";
import MemorialMemoryApp from "@/components/memorial/MemorialMemoryApp";
import FamilyArchivePage from "@/components/archive/FamilyArchivePage";

type HomeScreen =
  | "mode-select"
  | "family-landing"
  | "family-app"
  | "family-archive"
  | "couple-landing"
  | "couple-app"
  | "personal-landing"
  | "personal-app"
  | "memorial-landing"
  | "memorial-app"
  | "coming-soon";

export default function Home() {
  const [screen, setScreen] = useState<HomeScreen>("mode-select");
  const [selectedMode, setSelectedMode] = useState<MemoryMode | null>(null);

  function handleSelectMode(mode: MemoryMode) {
    setSelectedMode(mode);
    if (mode === "family") {
      setScreen("family-landing");
    } else if (mode === "couple") {
      setScreen("couple-landing");
    } else if (mode === "personal") {
      setScreen("personal-landing");
    } else if (mode === "memorial") {
      setScreen("memorial-landing");
    } else {
      setScreen("coming-soon");
    }
  }

  // family archive 历史列表页
  if (screen === "family-archive") {
    return (
      <FamilyArchivePage
        onBackToLanding={() => setScreen("family-landing")}
        onCreateNew={() => setScreen("family-app")}
        onBackToHome={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
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
        onOpenArchive={() => setScreen("family-archive")}
        onBackToModes={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // couple landing（恋爱纪念册介绍页）
  if (screen === "couple-landing") {
    return (
      <CoupleLandingPage
        onStart={() => setScreen("couple-app")}
        onBackToModes={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // couple 输入与生成页（已接入 AI 生成 MVP）
  if (screen === "couple-app") {
    return (
      <CoupleMemoryApp
        onBackToLanding={() => setScreen("couple-landing")}
        onBackToHome={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // personal landing（个人回忆录介绍页）
  if (screen === "personal-landing") {
    return (
      <PersonalLandingPage
        onStart={() => setScreen("personal-app")}
        onBackToModes={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // personal app（真实 AI 生成，dev 环境保留 mock 预览按钮）
  if (screen === "personal-app") {
    return (
      <PersonalMemoryApp
        onBackToLanding={() => setScreen("personal-landing")}
        onBackToHome={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // memorial landing（纪念册介绍页）
  if (screen === "memorial-landing") {
    return (
      <MemorialLandingPage
        onStart={() => setScreen("memorial-app")}
        onBackToModes={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // memorial app（preview 骨架，mock 结果，不调用 AI）
  if (screen === "memorial-app") {
    return (
      <MemorialMemoryApp
        onBackToLanding={() => setScreen("memorial-landing")}
        onBackToHome={() => {
          setSelectedMode(null);
          setScreen("mode-select");
        }}
      />
    );
  }

  // coming-soon（暂无其他 mode）
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
