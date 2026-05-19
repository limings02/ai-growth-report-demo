"use client";

// components/personal/PersonalMemoryGraphPreview.tsx
// personal mode 个人记忆 SVG 星图（Phase 10.4 / 10.4.1 稳健性收尾）。
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

// ── 节点视觉配置 ─────────────────────────────────────────────────
const NODE_TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string; border: string }> = {
  subject: { emoji: "👤", label: "主角",   color: "#dbeafe", border: "#93c5fd" },
  person:  { emoji: "🙋", label: "人物",   color: "#fce7f3", border: "#f9a8d4" },
  time:    { emoji: "📅", label: "时间",   color: "#e0f2fe", border: "#7dd3fc" },
  event:   { emoji: "⏱", label: "事件",   color: "#dcfce7", border: "#86efac" },
  place:   { emoji: "📍", label: "地点",   color: "#fef9c3", border: "#fde047" },
  emotion: { emoji: "💛", label: "情绪",   color: "#fef3c7", border: "#fcd34d" },
  keyword: { emoji: "✨", label: "关键词", color: "#ede9fe", border: "#c4b5fd" },
  memory:  { emoji: "📓", label: "记忆",   color: "#fff7ed", border: "#fdba74" },
  letter:  { emoji: "✉️", label: "信件",   color: "#f0fdf4", border: "#86efac" },
  message: { emoji: "💬", label: "话语",   color: "#f1f5f9", border: "#94a3b8" },
};
const DEFAULT_CFG = { emoji: "✨", label: "节点", color: "#e8edf8", border: "#8090b8" };

// ── 布局常数 ─────────────────────────────────────────────────────
const SVG_W = 360;
const SVG_H = 260;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const RADIUS_X = 135;
const RADIUS_Y = 95;
const MAX_NODES = 12;
const MAX_RELATED_EDGES = 8;

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

// ── normalizeNode：对 LLM 非严格输出做轻量防御 ───────────────────
// TypeScript 类型层面 node 字段都合法，但真实 AI 输出仍可能出现
// 空 label、null relatedTo、非法 type 等运行时情况。
function normalizeNode(node: MemoryGraphNodeHint, index: number): MemoryGraphNodeHint {
  return {
    type: NODE_TYPE_CONFIG[node.type as string] ? node.type : "memory",
    label:
      typeof node.label === "string" && node.label.trim()
        ? node.label.trim()
        : `记忆节点 ${index + 1}`,
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

export default function PersonalMemoryGraphPreview({ graph }: Props) {
  // normalizeNode 在 useMemo 内运行，保证运行时安全
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
      <MemorySectionCard title="🧭 个人记忆图谱">
        <p className="text-xs" style={{ color: "#6b7db3" }}>
          还没有足够信息生成记忆图谱。可以补充重要的人、地点、事件或情绪后重新生成。
        </p>
      </MemorySectionCard>
    );
  }

  return (
    <MemorySectionCard title="🧭 个人记忆图谱">
      {/* 标题与副标题 */}
      {graph.title && (
        <p className="text-sm font-bold mb-0.5" style={{ color: "#1a2340" }}>
          {graph.title}
        </p>
      )}
      {graph.subtitle && (
        <p className="text-xs mb-1" style={{ color: "#6b7db3" }}>
          {graph.subtitle}
        </p>
      )}

      {/* 操作提示 */}
      <p className="text-xs mb-3" style={{ color: "#8090b8" }}>
        点击星图中的节点，查看这段人生里的关键人、事、地点和情绪。
      </p>

      {/* ── SVG 星图 ─────────────────────────────────────────── */}
      <div className="w-full overflow-hidden rounded-xl print:overflow-visible" style={{ background: "#f5f8ff" }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ maxHeight: `${SVG_H}px` }}
        >
          <defs>
            <radialGradient id="personalBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6b8adc" stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* 背景光晕 */}
          <ellipse cx={CX} cy={CY} rx={RADIUS_X + 10} ry={RADIUS_Y + 10} fill="url(#personalBg)" />

          {/* 装饰星点 */}
          {([[20, 15], [340, 20], [15, 245], [345, 240], [180, 8], [55, 130], [305, 130]] as [number, number][]).map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.2} fill="#8090b8" opacity={0.12 + (i % 3) * 0.1} />
          ))}

          {/* 中心 → 每个节点的连线 */}
          {layout.map((node, i) => (
            <line
              key={`edge-${node.id}`}
              x1={CX} y1={CY} x2={node.x} y2={node.y}
              stroke="#8090b8"
              strokeWidth={i === effectiveIndex ? 1.2 : 0.6}
              strokeOpacity={i === effectiveIndex ? 0.4 : 0.18}
            />
          ))}

          {/* relatedTo 虚线边（去重 + 最多 MAX_RELATED_EDGES 条） */}
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
                // 用排序后的 label pair 去重，避免 A-B 和 B-A 重复
                const edgeKey = [node.label, target.label].sort().join("::");
                if (drawnEdges.has(edgeKey)) continue;
                drawnEdges.add(edgeKey);
                edges.push(
                  <line
                    key={`rel-${edgeKey}`}
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                    stroke="#8090b8"
                    strokeWidth={0.5}
                    strokeOpacity={0.1}
                    strokeDasharray="3 5"
                  />
                );
                count++;
              }
            }
            return edges;
          })()}

          {/* 中心节点 */}
          <circle cx={CX} cy={CY} r={30} fill="#6b8adc" opacity={0.18} />
          <circle cx={CX} cy={CY} r={24} fill="#6b8adc" opacity={0.85} />
          <text x={CX} y={CY - 5} textAnchor="middle" dominantBaseline="middle" fontSize={13}>
            👤
          </text>
          <text
            x={CX} y={CY + 11}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={7} fontWeight="bold" fill="white"
          >
            {truncate(graph.centerDescription || "这段人生", 6)}
          </text>

          {/* 周围节点 */}
          {layout.map((node, i) => {
            const cfg = NODE_TYPE_CONFIG[node.type] ?? DEFAULT_CFG;
            const isSelected = i === effectiveIndex;
            const r = 18;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedIndex(i)}
              >
                {/* 外光圈（选中态） */}
                <circle cx={node.x} cy={node.y} r={r + 7} fill="#6b8adc" opacity={isSelected ? 0.18 : 0} />
                {/* 主圆 */}
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill={cfg.color}
                  opacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? cfg.border : "transparent"}
                  strokeWidth={isSelected ? 1.8 : 0}
                />
                {/* emoji */}
                <text
                  x={node.x} y={node.y - 4}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10}
                >
                  {cfg.emoji}
                </text>
                {/* label */}
                <text
                  x={node.x} y={node.y + 9}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={6}
                  fontWeight={isSelected ? "bold" : "normal"}
                  fill="#1a2340"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {truncate(node.label, 5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 超过 12 个节点时的轻提示（不影响打印） */}
      {hasMore && (
        <p className="mt-1 text-xs print:hidden" style={{ color: "#a0aec0" }}>
          已展示前 {MAX_NODES} 个代表性节点，其余节点可在后续版本中展开。
        </p>
      )}

      {/* ── 选中节点详情面板 ─────────────────────────────────── */}
      {selectedNode && (
        <div
          className="mt-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #dde3f0" }}
        >
          {/* type + label */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">
              {(NODE_TYPE_CONFIG[selectedNode.type] ?? DEFAULT_CFG).emoji}
            </span>
            <span className="text-xs font-medium" style={{ color: "#5568a0" }}>
              {(NODE_TYPE_CONFIG[selectedNode.type] ?? DEFAULT_CFG).label}
            </span>
            <span className="text-sm font-bold" style={{ color: "#1a2340" }}>
              {selectedNode.label}
            </span>
          </div>
          {/* description */}
          {selectedNode.description && (
            <p className="text-xs leading-relaxed mb-2" style={{ color: "#4a5880" }}>
              {selectedNode.description}
            </p>
          )}
          {/* emotion + relatedTo */}
          <div className="flex flex-wrap gap-1.5">
            {selectedNode.emotion && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#e8edf8", color: "#5568a0" }}
              >
                {selectedNode.emotion}
              </span>
            )}
            {selectedNode.relatedTo.map((rel) => (
              <span
                key={rel}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#f1f5f9", color: "#6b7db3" }}
              >
                ↔ {rel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 打印时展示节点摘要 */}
      {layout.length > 0 && (
        <div className="hidden print:block mt-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "#5568a0" }}>图谱节点：</p>
          <ul className="text-xs space-y-1" style={{ color: "#4a5880" }}>
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
