"use client";

// components/memory/MemoryArtifactPreview.tsx
// 通用 MemoryArtifact 展示容器。
//
// 包含完整页面 shell：
// - 顶部操作栏（返回/首页/保存PDF/再做一本）
// - 打印专用标题区
// - fallback 提示
// - 封面区
// - 时间线
// - 长文/信件
// - 分享文案
// - graph 插槽（由 caller 传入 mode-specific 图谱组件）
// - 质量说明
// - 使用建议
// - 溯源折叠
// - 底部按钮
//
// couple mode 通过 CoupleArtifactPreview 使用；
// personal / memorial mode 将来复用本组件，各自传入 graphSlot。

import type { MemoryArtifact, MemorySourceTrace, MemoryQualityReview } from "@/lib/memory-core/types";
import MemoryPrintButton from "./MemoryPrintButton";
import MemoryFallbackNotice from "./MemoryFallbackNotice";
import MemoryCoverSection from "./MemoryCoverSection";
import MemoryTimelineSection from "./MemoryTimelineSection";
import MemoryLongFormSection from "./MemoryLongFormSection";
import MemorySocialPostsSection from "./MemorySocialPostsSection";
import MemoryQualityReviewPanel from "./MemoryQualityReviewPanel";
import MemoryUsageTipsSection from "./MemoryUsageTipsSection";
import MemorySourceTraceDetails from "./MemorySourceTraceDetails";

type Props = {
  artifact: MemoryArtifact;

  onBackToEdit: () => void;
  onCreateAnother: () => void;
  onBackToHome?: () => void;

  // mode-specific 文案配置
  modeLabel?: string;
  badge?: string;
  fallbackTitle?: string;
  printBrandText?: string;

  emptyKeywordsHint?: string;
  timelineTitle?: string;
  emptyTimelineHint?: string;
  longFormFallbackTitle?: string;
  socialPostsTitle?: string;
  emptySocialPostsHint?: string;

  usagePrimaryTip: string;
  usageSecondaryTip?: string;

  // graph 渲染插槽（mode-specific 图谱组件由 caller 传入）
  graphSlot?: React.ReactNode;

  className?: string;
};

export default function MemoryArtifactPreview({
  artifact,
  onBackToEdit,
  onCreateAnother,
  onBackToHome,
  modeLabel = "记忆内容",
  badge,
  fallbackTitle = "记忆纪念册",
  printBrandText = "由 Memory Wiki 生成",
  emptyKeywordsHint,
  timelineTitle,
  emptyTimelineHint,
  longFormFallbackTitle,
  socialPostsTitle,
  emptySocialPostsHint,
  usagePrimaryTip,
  usageSecondaryTip,
  graphSlot,
  className = "",
}: Props) {
  const { narrative, extensions } = artifact;

  const sourceTrace = extensions?.sourceTrace as MemorySourceTrace | undefined;
  const qualityReview = extensions?.qualityReview as MemoryQualityReview | undefined;

  const isFallbackArtifact =
    narrative.summary.includes("最小记忆整理结果") ||
    narrative.longFormText.voice === "fallback";

  return (
    <div className={`min-h-screen print:bg-white ${className}`} style={{ background: "#fffaf7" }}>
      {/* 顶部操作栏（打印时隐藏） */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between gap-2 print:hidden"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onBackToEdit}
            className="text-sm cursor-pointer hover:underline"
            style={{ color: "#9d7b72" }}
          >
            ← 返回修改
          </button>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-sm cursor-pointer hover:underline"
              style={{ color: "#b08878" }}
            >
              首页
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MemoryPrintButton label="保存 PDF" />
          <button
            onClick={onCreateAnother}
            className="text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
            style={{ background: "#fde8dc", color: "#c0674a" }}
          >
            再做一本
          </button>
        </div>
      </div>

      {/* 打印时显示的标题区（正常浏览隐藏） */}
      <div className="hidden print:block text-center py-6 px-4">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#2d1f1a" }}>
          {narrative.title || fallbackTitle}
        </h1>
        <p className="text-xs" style={{ color: "#9d7b72" }}>{printBrandText}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20 pt-6 print:max-w-none print:px-0 print:pb-0">

        <MemoryFallbackNotice
          isFallback={isFallbackArtifact}
          onBackToEdit={onBackToEdit}
          modeLabel={modeLabel}
        />

        <MemoryCoverSection
          narrative={narrative}
          badge={badge}
          fallbackTitle={fallbackTitle}
          emptyKeywordsHint={emptyKeywordsHint}
        />

        <MemoryTimelineSection
          timeline={narrative.timeline}
          title={timelineTitle}
          emptyHint={emptyTimelineHint}
        />

        <MemoryLongFormSection
          longFormText={narrative.longFormText}
          fallbackTitle={longFormFallbackTitle}
        />

        <MemorySocialPostsSection
          socialPosts={narrative.socialPosts}
          title={socialPostsTitle}
          emptyHint={emptySocialPostsHint}
        />

        {/* graph 插槽：由各 mode 传入对应图谱组件 */}
        {graphSlot}

        <MemoryQualityReviewPanel qualityReview={qualityReview} />

        <MemoryUsageTipsSection
          primaryTip={usagePrimaryTip}
          secondaryTip={usageSecondaryTip}
        />

        <MemorySourceTraceDetails sourceTrace={sourceTrace} />

        {/* 底部按钮（打印时隐藏） */}
        <div className="flex gap-3 print:hidden">
          <button
            onClick={onBackToEdit}
            className="flex-1 py-3 rounded-full text-sm font-medium cursor-pointer transition-all hover:shadow-md"
            style={{ background: "#fde8dc", color: "#c0674a" }}
          >
            ← 返回修改
          </button>
          <button
            onClick={onCreateAnother}
            className="flex-1 py-3 rounded-full text-sm font-semibold text-white cursor-pointer transition-all shadow-md hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
          >
            再做一本 ✨
          </button>
        </div>
      </div>
    </div>
  );
}
