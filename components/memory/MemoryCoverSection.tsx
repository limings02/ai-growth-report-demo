// components/memory/MemoryCoverSection.tsx
// 通用 MemoryArtifact 封面区，展示标题、关键词、总结。

import type { MemoryNarrative } from "@/lib/memory-core/types";

type Props = {
  narrative: MemoryNarrative;
  badge?: string;
  fallbackTitle?: string;
  emptyKeywordsHint?: string;
};

export default function MemoryCoverSection({
  narrative,
  badge = "🌌 Memory Artifact",
  fallbackTitle = "记忆纪念册",
  emptyKeywordsHint = "这次材料中还没有提炼出稳定关键词。可以补充更多具体故事后重新生成。",
}: Props) {
  return (
    <div
      className="rounded-3xl p-7 mb-5"
      style={{
        background: "linear-gradient(135deg, #fde8dc 0%, #fcd5c0 50%, #f4b8a0 100%)",
      }}
    >
      <p className="text-xs font-medium mb-3 opacity-70" style={{ color: "#8b4a38" }}>
        {badge}
      </p>
      <h2 className="text-2xl font-bold leading-snug mb-3" style={{ color: "#2d1f1a" }}>
        {narrative.title || fallbackTitle}
      </h2>
      {narrative.keywords.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {narrative.keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.5)", color: "#8b4a38" }}
            >
              {kw}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs mb-4 opacity-60" style={{ color: "#8b4a38" }}>
          {emptyKeywordsHint}
        </p>
      )}
      {narrative.summary && (
        <p
          className="text-sm leading-loose whitespace-pre-line"
          style={{ color: "#3d2c2c", opacity: 0.85 }}
        >
          {narrative.summary}
        </p>
      )}
    </div>
  );
}
