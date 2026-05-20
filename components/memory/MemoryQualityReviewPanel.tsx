// components/memory/MemoryQualityReviewPanel.tsx
// 通用生成质量说明面板，供所有 mode 的 artifact 结果页使用。
// 不含 mode-specific 文案。

import type { MemoryQualityReview } from "@/lib/memory-core/types";
import MemorySectionCard from "./MemorySectionCard";

type Props = {
  qualityReview?: MemoryQualityReview;
};

const RISK_LABEL: Record<MemoryQualityReview["riskOfFabrication"], string> = {
  low: "低",
  medium: "中",
  high: "较高",
};

const RISK_STYLE: Record<MemoryQualityReview["riskOfFabrication"], React.CSSProperties> = {
  low:    { background: "#e8f5e9", color: "#2e7d32" },
  medium: { background: "#fff3e0", color: "#e65100" },
  high:   { background: "#fff0ee", color: "#c0674a" },
};

export default function MemoryQualityReviewPanel({ qualityReview }: Props) {
  if (!qualityReview) return null;

  return (
    <MemorySectionCard title="💡 内容参考说明">
      <div className="space-y-2 text-xs" style={{ color: "#9d7b72" }}>
        <div className="flex items-center gap-2">
          <span>参考可信度：</span>
          <span
            className="px-2 py-0.5 rounded-full font-medium"
            style={RISK_STYLE[qualityReview.riskOfFabrication]}
          >
            {RISK_LABEL[qualityReview.riskOfFabrication]}
          </span>
        </div>

        {qualityReview.weaknesses.length > 0 && (
          <div>
            <p className="font-medium mb-1">不足之处：</p>
            <ul className="space-y-0.5">
              {qualityReview.weaknesses.map((w, i) => (
                <li key={i}>· {w}</li>
              ))}
            </ul>
          </div>
        )}

        {qualityReview.suggestionsForBetterInput.length > 0 && (
          <div>
            <p className="font-medium mb-1">下次可以补充：</p>
            <ul className="space-y-0.5">
              {qualityReview.suggestionsForBetterInput.map((s, i) => (
                <li key={i}>· {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MemorySectionCard>
  );
}
