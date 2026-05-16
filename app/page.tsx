"use client";

import { useState } from "react";
import LandingHero from "@/components/LandingHero";
import FutureScene from "@/components/FutureScene";
import ValueCards from "@/components/ValueCards";
import HowItWorks from "@/components/HowItWorks";
import GrowthReportApp from "@/components/GrowthReportApp";

export default function Home() {
  // showApp 控制 Landing Page 和表单/结果页的切换
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <GrowthReportApp onBackToLanding={() => setShowApp(false)} />;
  }

  return (
    <main className="flex-1 flex flex-col">
      <LandingHero onStart={() => setShowApp(true)} />
      <FutureScene />
      <ValueCards />
      <HowItWorks onStart={() => setShowApp(true)} />
    </main>
  );
}
