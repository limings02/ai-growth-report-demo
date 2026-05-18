// components/personal/PersonalMemoryGraphPreview.tsx
// personal mode 轻量图谱展示——节点卡片列表，不引入 SVG 依赖。

import type { MemoryGraphHints } from "@/lib/memory-core/types";
import MemorySectionCard from "@/components/memory/MemorySectionCard";

const NODE_TYPE_EMOJI: Record<string, string> = {
  subject: "👤",
  person:  "🙋",
  time:    "📅",
  event:   "⏱",
  place:   "📍",
  emotion: "💛",
  keyword: "✨",
  message: "💬",
  memory:  "📓",
  letter:  "✉️",
};

type Props = {
  graph: MemoryGraphHints;
};

export default function PersonalMemoryGraphPreview({ graph }: Props) {
  if (graph.nodes.length === 0) {
    return (
      <MemorySectionCard title="🧭 个人记忆图谱">
        <p className="text-xs" style={{ color: "#6b7db3" }}>
          还没有足够信息生成记忆图谱。可以补充重要的人、地点、事件或情绪后重新生成。
        </p>
      </MemorySectionCard>
    );
  }

  return (
    <MemorySectionCard title="🧭 个人记忆图谱">
      {graph.title && (
        <p className="text-sm font-bold mb-0.5" style={{ color: "#1a2340" }}>
          {graph.title}
        </p>
      )}
      {graph.subtitle && (
        <p className="text-xs mb-4" style={{ color: "#6b7db3" }}>
          {graph.subtitle}
        </p>
      )}
      <div className="grid grid-cols-1 gap-2">
        {graph.nodes.map((node, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #dde3f0" }}
          >
            <span className="text-base flex-shrink-0">
              {NODE_TYPE_EMOJI[node.type] ?? "✨"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#1a2340" }}>
                {node.label}
              </p>
              {node.description && (
                <p className="text-xs leading-relaxed" style={{ color: "#6b7db3" }}>
                  {node.description}
                </p>
              )}
              {node.emotion && (
                <span
                  className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#e8edf8", color: "#5568a0" }}
                >
                  {node.emotion}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </MemorySectionCard>
  );
}
