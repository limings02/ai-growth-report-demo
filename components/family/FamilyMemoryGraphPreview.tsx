"use client";

// components/family/FamilyMemoryGraphPreview.tsx
// family mode 成长星图——轻量 SVG，绿色 / 米白 / 暖黄配色（Phase 12.2 新增）。
//
// 布局策略：
// - 中心节点：graph.centerDescription，固定在 SVG 中心
// - 周围节点：最多前 12 个，椭圆轨道均匀排列
// - 点击节点切换选中，下方展示详情面板
// - normalizeNode：对 LLM 非严格输出做轻量防御
// - relatedTo 边去重（edgeKey = sorted pair）
// - 超过 12 个节点时显示轻提示
// - 不新增依赖，不做 force layout，不做动画

import { useMemo, useState } from "react";
import type { MemoryGraphHints, MemoryGraphNodeHint } from "@/lib/memory-core/types";
import MemorySectionCard from "@/components/memory/MemorySectionCard";

// ── 节点视觉配置（family 绿色 / 米白 / 暖黄色调）────────────────
const NODE_TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string; border: string }> = {
  subject: { emoji: "🌱", label: "孩子",   color: "#dcfce7", border: "#86efac" },
  person:  { emoji: "👨‍👩‍👧", label: "家人",   color: "#fef9c3", border: "#fde047" },
  time:    { emoji: "📅", label: "时间",   color: "#ecfdf5", border: "#6ee7b7" },
  event:   { emoji: "⭐", label: "成长事件", color: "#fefce8", border: "#fde68a" },
  place:   { emoji: "📍", label: "地点",   color: "#f0fdf4", border: "#86efac" },
  emotion: { emoji: "💛", label: "情绪",   color: "#fffbeb", border: "#fcd34d" },
  keyword: { emoji: "✨", label: "关键词", color: "#f7fee7", border: "#bef264" },
  memory:  { emoji: "📷", label: "记忆",   color: "#fefce8", border: "#fde68a" },
  letter:  { emoji: "✉️", label: "信件",   color: "#f0fdf4", border: "#6ee7b7" },
  message: { emoji: "💬", label: "话语",   color: "#fafaf9", border: "#a8a29e" },
};
const DEFAULT_CFG = { emoji: "✨", label: "节点", color: "#f0fdf4", border: "#86efac" };

// ── 布局常数 ─────────────────────────────────────────────────────
const SVG_W = 360;
const SVG_H = 260;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const RADIUS_X = 132;
const RADIUS_Y = 92;
const MAX_NODES = 12;
const MAX_RELATED_EDGES = 8;

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

// ── normalizeNode：对 LLM 非严格输出做轻量防御 ───────────────────
function normalizeNode(node: MemoryGraphNodeHint, index: number): MemoryGraphNodeHint {
  return {
    type: NODE_TYPE_CONFIG[node.type as string] ? node.type : "memory",
    label:
      typeof node.label === "string" && node.label.trim()
        ? node.label.trim()
        : `成长节点 ${index + 1}`,
    description:
      typeof node.description === "string" ? node.description : "",
    emotion:
      typeof node.emotion === "string" && node.emotion.trim()
        ? node.emotion.trim()
        : undefined,
    relatedTo: Array.isArray(node.relatedTo)
      ? node.relatedTo.filter(
          (x): x is string => typeof x === "string" && x.trim().length > 0
        )
      : [],
  };
}

type PositionedNode = MemoryGraphNodeHint & { id: string; x: number; y: number };

function buildLayout(nodes: MemoryGraphNodeHint[]): PositionedNode[] {
  const limited = nodes.slice(0, MAX_NODES);
  return limited.map((node, i) => {
    const angle = (2 * Math.PI * i) / limited.length - Math.PI / 2;
    return {
      ...node,
      id: `${node.type}-${i}-${node.label}`,
      x: CX + Math.cos(angle) * RADIUS_X,
      y: CY + Math.sin(angle) * RADIUS_Y,
    };
  });
}

type Props = { graph: MemoryGraphHints };

export default function FamilyMemoryGraphPreview({ graph }: Props) {
  const normalizedNodes = useMemo(
    () => graph.nodes.map(normalizeNode),
    [graph.nodes]
  );
  const layout = useMemo(() => buildLayout(normalizedNodes), [normalizedNodes]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const effectiveIndex = layout.length === 0 ? 0 : Math.min(selectedIndex, layout.length - 1);
  const selectedNode = layout[effectiveIndex] ?? null;
  const hasMore = graph.nodes.length > MAX_NODES;

  // ── 空状态 ────────────────────────────────────────────────────
  if (graph.nodes.length === 0) {
    return (
      <MemorySectionCard title="🌿 成长星图">
        <p className="text-xs" style={{ color: "#6b7280" }}>
          还没有足够信息生成成长星图。可以补充重要的人、事件、作品或亲子片段后重新生成。
        </p>
      </MemorySectionCard>
    );
  }

  return (
    <MemorySectionCard title="🌿 成长星图">
      {graph.title && (
        <p className="text-sm font-bold mb-0.5" style={{ color: "#15803d" }}>
          {graph.title}
        </p>
      )}
      {graph.subtitle && (
        <p className="text-xs mb-1" style={{ color: "#6b7280" }}>
          {graph.subtitle}
        </p>
      )}
      <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
        点击星图中的节点，查看孩子这一年的关键词、事件和记忆。
      </p>

      {/* SVG 星图 */}
      <div className="w-full overflow-hidden rounded-xl print:overflow-visible" style={{ background: "#f0fdf4" }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ maxHeight: `${SVG_H}px` }}
        >
          <defs>
            <radialGradient id="familyBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.07" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <ellipse cx={CX} cy={CY} rx={RADIUS_X + 10} ry={RADIUS_Y + 10} fill="url(#familyBg)" />

          {([[22, 18], [338, 22], [18, 242], [342, 238], [180, 10], [58, 128], [302, 128]] as [number, number][]).map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.2} fill="#22c55e" opacity={0.1 + (i % 3) * 0.08} />
          ))}

          {/* 中心 → 周围节点连线 */}
          {layout.map((node, i) => (
            <line
              key={`edge-${node.id}`}
              x1={CX} y1={CY} x2={node.x} y2={node.y}
              stroke="#86efac"
              strokeWidth={i === effectiveIndex ? 1.2 : 0.6}
              strokeOpacity={i === effectiveIndex ? 0.5 : 0.22}
            />
          ))}

          {/* relatedTo 虚线边（去重） */}
          {(() => {
            const edges: React.ReactNode[] = [];
            const drawnEdges = new Set<string>();
            let count = 0;
            for (const node of layout) {
              if (count >= MAX_RELATED_EDGES) break;
              for (const rel of node.relatedTo) {
                if (count >= MAX_RELATED_EDGES) break;
                const target = layout.find((n) => n.label === rel && n.id !== node.id);
                if (!target) continue;
                const edgeKey = [node.label, target.label].sort().join("::");
                if (drawnEdges.has(edgeKey)) continue;
                drawnEdges.add(edgeKey);
                edges.push(
                  <line
                    key={`rel-${edgeKey}`}
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                    stroke="#86efac"
                    strokeWidth={0.5}
                    strokeOpacity={0.12}
                    strokeDasharray="3 5"
                  />
                );
                count++;
              }
            }
            return edges;
          })()}

          {/* 中心节点 */}
          <circle cx={CX} cy={CY} r={30} fill="#22c55e" opacity={0.15} />
          <circle cx={CX} cy={CY} r={24} fill="#22c55e" opacity={0.82} />
          <text x={CX} y={CY - 5} textAnchor="middle" dominantBaseline="middle" fontSize={13}>
            🌱
          </text>
          <text
            x={CX} y={CY + 11}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={7} fontWeight="bold" fill="white"
          >
            {truncate(graph.centerDescription || "这一年", 6)}
          </text>

          {/* 周围节点 */}
          {layout.map((node, i) => {
            const cfg = NODE_TYPE_CONFIG[node.type] ?? DEFAULT_CFG;
            const isSelected = i === effectiveIndex;
            const r = 18;
            return (
              <g key={node.id} style={{ cursor: "pointer" }} onClick={() => setSelectedIndex(i)}>
                <circle cx={node.x} cy={node.y} r={r + 7} fill="#22c55e" opacity={isSelected ? 0.15 : 0} />
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill={cfg.color}
                  opacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? cfg.border : "transparent"}
                  strokeWidth={isSelected ? 1.8 : 0}
                />
                <text x={node.x} y={node.y - 4} textAnchor="middle" dominantBaseline="middle" fontSize={10}>
                  {cfg.emoji}
                </text>
                <text
                  x={node.x} y={node.y + 9}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={6}
                  fontWeight={isSelected ? "bold" : "normal"}
                  fill="#15803d"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {truncate(node.label, 5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hasMore && (
        <p className="mt-1 text-xs print:hidden" style={{ color: "#9ca3af" }}>
          已展示前 {MAX_NODES} 个代表性节点，其余节点可在后续版本中展开。
        </p>
      )}

      {/* 选中节点详情面板 */}
      {selectedNode && (
        <div
          className="mt-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,252,0.8)", border: "1px solid #d1fae5" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{(NODE_TYPE_CONFIG[selectedNode.type] ?? DEFAULT_CFG).emoji}</span>
            <span className="text-xs font-medium" style={{ color: "#15803d" }}>
              {(NODE_TYPE_CONFIG[selectedNode.type] ?? DEFAULT_CFG).label}
            </span>
            <span className="text-sm font-bold" style={{ color: "#1a2e05" }}>
              {selectedNode.label}
            </span>
          </div>
          {selectedNode.description && (
            <p className="text-xs leading-relaxed mb-2" style={{ color: "#374151" }}>
              {selectedNode.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {selectedNode.emotion && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#15803d" }}>
                {selectedNode.emotion}
              </span>
            )}
            {selectedNode.relatedTo.map((rel) => (
              <span key={rel} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#6b7280" }}>
                ↔ {rel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 打印时展示文字摘要 */}
      {layout.length > 0 && (
        <div className="hidden print:block mt-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "#15803d" }}>成长星图节点：</p>
          <ul className="text-xs space-y-1" style={{ color: "#374151" }}>
            {layout.map((node) => (
              <li key={node.id}>
                <span className="font-medium">{node.label}</span>
                {node.description ? `：${node.description}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </MemorySectionCard>
  );
}
