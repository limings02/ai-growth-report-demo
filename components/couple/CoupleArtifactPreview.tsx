"use client";

// components/couple/CoupleArtifactPreview.tsx
// 展示 couple mode 生成的 MemoryArtifact。
// 使用 components/memory/ 通用叙事展示组件，couple-specific 内容通过 props 传入。

import type { MemoryArtifact, MemorySourceTrace, MemoryQualityReview } from "@/lib/memory-core/types";
import RelationshipGalaxyPreview from "./RelationshipGalaxyPreview";
import MemoryPrintButton from "@/components/memory/MemoryPrintButton";
import MemoryQualityReviewPanel from "@/components/memory/MemoryQualityReviewPanel";
import MemorySourceTraceDetails from "@/components/memory/MemorySourceTraceDetails";
import MemoryFallbackNotice from "@/components/memory/MemoryFallbackNotice";
import MemoryCoverSection from "@/components/memory/MemoryCoverSection";
import MemoryTimelineSection from "@/components/memory/MemoryTimelineSection";
import MemoryLongFormSection from "@/components/memory/MemoryLongFormSection";
import MemorySocialPostsSection from "@/components/memory/MemorySocialPostsSection";
import MemoryUsageTipsSection from "@/components/memory/MemoryUsageTipsSection";

type Props = {
  artifact: MemoryArtifact;
  onBackToEdit: () => void;
  onCreateAnother: () => void;
  onBackToHome?: () => void;
};

export default function CoupleArtifactPreview({ artifact, onBackToEdit, onCreateAnother, onBackToHome }: Props) {
  const { narrative, graph, extensions } = artifact;

  const sourceTrace = extensions?.sourceTrace as MemorySourceTrace | undefined;
  const qualityReview = extensions?.qualityReview as MemoryQualityReview | undefined;

  const isFallbackArtifact =
    narrative.summary.includes("最小记忆整理结果") ||
    narrative.longFormText.voice === "fallback";

  return (
    <div className="min-h-screen print:bg-white" style={{ background: "#fffaf7" }}>
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
          {narrative.title || "恋爱纪念册"}
        </h1>
        <p className="text-xs" style={{ color: "#9d7b72" }}>由 Memory Wiki 生成</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20 pt-6 print:max-w-none print:px-0 print:pb-0">

        <MemoryFallbackNotice
          isFallback={isFallbackArtifact}
          onBackToEdit={onBackToEdit}
          modeLabel="恋爱纪念册"
        />

        <MemoryCoverSection
          narrative={narrative}
          badge="💑 恋爱纪念册"
          fallbackTitle="恋爱纪念册"
          emptyKeywordsHint="这次材料中还没有提炼出稳定关键词。可以补充更多聊天片段或具体故事后重新生成。"
        />

        <MemoryTimelineSection
          title="⏱ 恋爱时间线"
          timeline={narrative.timeline}
          emptyHint="还没有足够材料生成恋爱时间线。可以补充第一次见面、一次旅行、一次争吵与和好、一个普通但想保存的日常。"
        />

        <MemoryLongFormSection
          longFormText={narrative.longFormText}
          fallbackTitle="写给未来你们的信"
        />

        <MemorySocialPostsSection
          socialPosts={narrative.socialPosts}
          title="📱 分享文案"
          emptyHint="这次没有生成分享文案。可以补充更具体的纪念日、想表达的情绪或送礼场景后重新生成。"
        />

        {/* Relationship Galaxy 轻量 SVG 星图 */}
        <RelationshipGalaxyPreview graph={graph} />

        <MemoryQualityReviewPanel qualityReview={qualityReview} />

        <MemoryUsageTipsSection
          primaryTip="你可以把这份纪念册保存成 PDF，作为周年日、生日或某个普通日子的纪念。"
          secondaryTip="如果想让下一版更贴近你们，可以返回修改，补充更具体的聊天片段、地点、称呼、一次争吵与和好，或一段你想对 TA 说的话。"
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
