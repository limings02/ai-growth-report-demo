"use client";

// components/couple/RelationshipGalaxyPreview.tsx
// Relationship Galaxy 轻量 SVG 星图。
//
// 职责：
// - 展示 MemoryArtifact.graph 里的节点和边
// - 纯前端布局，不调用 AI，不引入新依赖
// - 节点点击后在下方展示详情卡片
//
// 布局策略：
// - 最多展示前 12 个节点
// - emotion / message / keyword 靠内圈（radius 85）
// - event / place / time / person / memory 靠外圈（radius 115）
// - 从 12 点方向（-π/2）开始均匀分布

import { useMemo, useState } from "react";
import type { MemoryGraphHints, MemoryGraphNodeHint } from "@/lib/memory-core/types";

type Props = {
  graph: MemoryGraphHints;
};

// ── 节点类型视觉配置 ───────────────────────────────────────────────
const NODE_TYPE_CONFIG: Record<string, {
  emoji: string;
  label: string;
  color: string;
  glow: string;
  radius: number;
}> = {
  person:  { emoji: "👤", label: "人物",   color: "#f4b8a0", glow: "#e8836a", radius: 24 },
  time:    { emoji: "📅", label: "时间",   color: "#fde8dc", glow: "#f4b8a0", radius: 22 },
  event:   { emoji: "⏱", label: "事件",   color: "#fcd5c0", glow: "#e8836a", radius: 22 },
  emotion: { emoji: "💛", label: "情绪",   color: "#ffe0b2", glow: "#f4b8a0", radius: 20 },
  message: { emoji: "💬", label: "对话",   color: "#ddd0c8", glow: "#b09080", radius: 20 },
  keyword: { emoji: "✨", label: "关键词", color: "#fff3e0", glow: "#e8836a", radius: 20 },
  place:   { emoji: "📍", label: "地点",   color: "#e8cdb8", glow: "#c08070", radius: 20 },
  memory:  { emoji: "📓", label: "记忆",   color: "#f9d6c7", glow: "#e8836a", radius: 20 },
};

const DEFAULT_NODE_CFG = { emoji: "✨", label: "节点", color: "#fde8dc", glow: "#e8836a", radius: 20 };

// ── 带布局坐标的节点 ─────────────────────────────────────────────
type PositionedNode = MemoryGraphNodeHint & {
  id: string;
  x: number;
  y: number;
};

const CX = 180;
const CY = 160;
const INNER_TYPES = ["emotion", "message", "keyword"];

function buildGalaxyLayout(nodes: MemoryGraphNodeHint[]): PositionedNode[] {
  const limited = nodes.slice(0, 12);
  return limited.map((node, index) => {
    const angle = (Math.PI * 2 * index) / limited.length - Math.PI / 2;
    const orbitRadius = INNER_TYPES.includes(node.type) ? 85 : 115;
    return {
      ...node,
      id: `${node.type}-${index}-${node.label}`,
      x: CX + Math.cos(angle) * orbitRadius,
      y: CY + Math.sin(angle) * orbitRadius,
    };
  });
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// ── 主组件 ────────────────────────────────────────────────────────
export default function RelationshipGalaxyPreview({ graph }: Props) {
  const layout = useMemo(() => buildGalaxyLayout(graph.nodes), [graph.nodes]);

  // 用 useMemo 派生默认 selectedId，避免在 useEffect 里 setState
  const defaultSelectedId = useMemo(
    () => layout[0]?.id ?? "",
    [layout]
  );
  const [selectedId, setSelectedId] = useState<string>(() => defaultSelectedId);

  // selectedNode：优先找 selectedId，fallback 到 layout[0]
  const selectedNode = layout.find((n) => n.id === selectedId) ?? layout[0];

  if (graph.nodes.length === 0) {
    return (
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "#9d7b72" }}>
          🌌 Relationship Galaxy
        </p>
        <p className="text-xs" style={{ color: "#9d7b72" }}>
          Relationship Galaxy 还没有足够节点。可以补充地点、昵称、反复出现的对话、共同经历或情绪关键词。
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
    >
      {/* 标题区 */}
      <p className="text-xs font-semibold mb-1" style={{ color: "#9d7b72" }}>
        🌌 Relationship Galaxy
      </p>
      <p className="text-sm font-bold mb-0.5" style={{ color: "#2d1f1a" }}>
        {graph.title}
      </p>
      <p className="text-xs mb-2" style={{ color: "#9d7b72" }}>
        {graph.subtitle}
      </p>
      {/* 边界说明：不是关系判断，只是记忆整理 */}
      <p
        className="text-xs mb-4 px-3 py-1.5 rounded-lg"
        style={{ background: "#f9f5f3", color: "#b08878" }}
      >
        这不是关系判断，只是把你们故事里反复出现的人、地点、情绪和对话整理成一张记忆星图。
      </p>

      {/* ── SVG 星图 ── */}
      <div className="relative w-full overflow-hidden" style={{ borderRadius: "12px" }}>
        <svg
          viewBox="0 0 360 320"
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ maxHeight: "320px" }}
        >
          <defs>
            {/* 每种节点类型的光晕 filter */}
            {Object.entries(NODE_TYPE_CONFIG).map(([type, cfg]) => (
              <filter key={type} id={`glow-${type}`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor={cfg.glow} floodOpacity="0.55" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            <radialGradient id="galaxyBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f4b8a0" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* 背景晕圈 */}
          <ellipse cx={CX} cy={CY} rx={140} ry={120} fill="url(#galaxyBg)" />

          {/* 装饰星点 */}
          {[[30, 20], [330, 30], [20, 280], [340, 290], [180, 10], [60, 150], [300, 150]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.2} fill="#f4b8a0" opacity={0.18 + (i % 3) * 0.12} />
          ))}

          {/* 从中心到每个节点的连线 */}
          {layout.map((node) => (
            <line
              key={`edge-${node.id}`}
              x1={CX} y1={CY}
              x2={node.x} y2={node.y}
              stroke="#f4b8a0"
              strokeWidth={node.id === selectedId ? 1.2 : 0.7}
              strokeOpacity={node.id === selectedId ? 0.45 : 0.22}
            />
          ))}

          {/* relatedTo 弱连接边 */}
          {layout.flatMap((node) =>
            node.relatedTo
              .map((label) => layout.find((n) => n.label === label))
              .filter((target): target is PositionedNode => !!target && target.id !== node.id)
              .map((target) => (
                <line
                  key={`rel-${node.id}-${target.id}`}
                  x1={node.x} y1={node.y}
                  x2={target.x} y2={target.y}
                  stroke="#f4b8a0"
                  strokeWidth={0.5}
                  strokeOpacity={0.12}
                  strokeDasharray="3 5"
                />
              ))
          )}

          {/* 中心节点 */}
          <circle cx={CX} cy={CY} r={32} fill="#f4b8a0" opacity={0.25} />
          <circle cx={CX} cy={CY} r={26} fill="#f4b8a0" opacity={0.85} />
          <text x={CX} y={CY - 6} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
            💑
          </text>
          <text
            x={CX} y={CY + 11}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fontWeight="bold" fill="#2d1f1a"
          >
            {truncate(graph.centerDescription || "我们", 7)}
          </text>

          {/* 各节点 */}
          {layout.map((node) => {
            const cfg = NODE_TYPE_CONFIG[node.type] ?? DEFAULT_NODE_CFG;
            const isSelected = node.id === selectedId;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedId(node.id)}
              >
                <circle
                  cx={node.x} cy={node.y}
                  r={cfg.radius + 7}
                  fill={cfg.glow}
                  opacity={isSelected ? 0.22 : 0.08}
                />
                <circle
                  cx={node.x} cy={node.y}
                  r={cfg.radius}
                  fill={cfg.color}
                  opacity={isSelected ? 1 : 0.82}
                  filter={isSelected ? `url(#glow-${node.type})` : undefined}
                  stroke={isSelected ? "#f4b8a0" : "transparent"}
                  strokeWidth={isSelected ? 1.5 : 0}
                />
                <text
                  x={node.x} y={node.y - 4}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={cfg.radius >= 22 ? 12 : 10}
                >
                  {cfg.emoji}
                </text>
                <text
                  x={node.x} y={node.y + (cfg.radius >= 22 ? 10 : 9)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={7}
                  fontWeight={isSelected ? "bold" : "normal"}
                  fill="#2d1f1a"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {truncate(node.label, 5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── 选中节点详情卡片 ── */}
      {selectedNode && (
        <div
          className="mt-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,248,243,0.9)", border: "1px solid #f0ddd5" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">
              {(NODE_TYPE_CONFIG[selectedNode.type] ?? DEFAULT_NODE_CFG).emoji}
            </span>
            <span className="text-xs font-semibold" style={{ color: "#c0674a" }}>
              {(NODE_TYPE_CONFIG[selectedNode.type] ?? DEFAULT_NODE_CFG).label}
            </span>
            <span className="text-sm font-bold" style={{ color: "#2d1f1a" }}>
              {selectedNode.label}
            </span>
          </div>
          {selectedNode.description && (
            <p className="text-xs leading-relaxed mb-2" style={{ color: "#7a5a52" }}>
              {selectedNode.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {selectedNode.emotion && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#fde8dc", color: "#c0674a" }}
              >
                {selectedNode.emotion}
              </span>
            )}
            {selectedNode.relatedTo.map((rel) => (
              <span
                key={rel}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#f5f0ee", color: "#9d7b72" }}
              >
                ↔ {rel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
