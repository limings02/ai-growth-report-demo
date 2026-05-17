"use client";

import { useState, useMemo } from "react";
import type { RawMaterial, ReportData } from "@/lib/types";
import { buildLifeGraph } from "@/lib/graph/buildLifeGraph";
import type { LifeGraphNode } from "@/lib/graph/types";

type Props = {
  rawMaterial: RawMaterial;
  report: ReportData;
};

// 节点类型对应的视觉配置
const NODE_CONFIG: Record<string, {
  color: string;
  glowColor: string;
  radius: number;
  emoji: string;
  typeName: string;
}> = {
  child:   { color: "#f4b8a0", glowColor: "#e8836a", radius: 38, emoji: "🌸", typeName: "主角" },
  year:    { color: "#fde8dc", glowColor: "#f4b8a0", radius: 26, emoji: "📅", typeName: "年份" },
  keyword: { color: "#fcd5c0", glowColor: "#e8836a", radius: 20, emoji: "✨", typeName: "关键词" },
  event:   { color: "#e8cdb8", glowColor: "#c08070", radius: 22, emoji: "⏱", typeName: "重要瞬间" },
  letter:  { color: "#fde8dc", glowColor: "#f4b8a0", radius: 24, emoji: "✉️", typeName: "给未来的信" },
  memory:  { color: "#ddd0c8", glowColor: "#b09080", radius: 20, emoji: "📓", typeName: "记录" },
};

// 布局：在 [0, 1] 范围内计算各节点坐标
function computeLayout(nodes: LifeGraphNode[]): Map<string, { x: number; y: number }> {
  const layout = new Map<string, { x: number; y: number }>();
  const cx = 0.5;
  const cy = 0.48;

  const keywords = nodes.filter((n) => n.type === "keyword");
  const events   = nodes.filter((n) => n.type === "event");
  const specials = nodes.filter((n) => n.type === "letter" || n.type === "memory");
  const yearNode = nodes.find((n) => n.type === "year");

  // 中心
  layout.set("child", { x: cx, y: cy });

  // 年份：左上
  if (yearNode) layout.set(yearNode.id, { x: cx - 0.28, y: cy - 0.28 });

  // 关键词：内圈均匀分布（从右上顺时针）
  keywords.forEach((node, i) => {
    const total = keywords.length;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const r = 0.26;
    layout.set(node.id, { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  });

  // 时间线事件：外圈均匀分布（错开关键词角度）
  events.forEach((node, i) => {
    const total = events.length;
    const offset = keywords.length > 0 ? Math.PI / keywords.length : Math.PI / 4;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2 + offset;
    const r = 0.38;
    layout.set(node.id, { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  });

  // letter / memory：底部左右
  specials.forEach((node, i) => {
    const xPos = i === 0 ? cx + 0.30 : cx - 0.30;
    layout.set(node.id, { x: xPos, y: cy + 0.35 });
  });

  return layout;
}

// 把 [0,1] 坐标映射到 SVG 像素坐标，并做边缘 clamp
function toSvg(v: number, size: number, padding: number): number {
  return Math.max(padding, Math.min(size - padding, v * size));
}

export default function LifeGraphPreview({ rawMaterial, report }: Props) {
  const graph = useMemo(
    () => buildLifeGraph({ rawMaterial, report }),
    [rawMaterial, report]
  );

  const [selectedId, setSelectedId] = useState<string>("child");

  const layout = useMemo(() => computeLayout(graph.nodes), [graph.nodes]);

  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? graph.nodes[0];
  const cfg = NODE_CONFIG[selectedNode?.type ?? "child"];

  // SVG 尺寸（响应式：用 viewBox 缩放）
  const W = 560;
  const H = 420;
  const PAD = 42;

  return (
    <div className="rounded-3xl overflow-hidden mb-4"
      style={{
        background: "linear-gradient(160deg, #3d2c2c 0%, #5a3d35 50%, #4a3030 100%)",
        boxShadow: "0 8px 40px rgba(60, 20, 10, 0.35)",
      }}>

      {/* 标题区 */}
      <div className="px-6 pt-6 pb-3">
        <p className="text-xs font-semibold mb-1" style={{ color: "#f4b8a0", letterSpacing: "0.12em" }}>
          ✦ 成长星图
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(244,184,160,0.6)" }}>
          这一年的爱、变化和瞬间，被整理成了一片小小星空。
        </p>
      </div>

      {/* 星图 SVG */}
      <div className="relative w-full" style={{ height: "420px" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* 各节点的 glow filter */}
            {Object.entries(NODE_CONFIG).map(([type, c]) => (
              <filter key={type} id={`glow-${type}`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodColor={c.glowColor} floodOpacity="0.6" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            {/* 星空背景点 */}
            <radialGradient id="starBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7a5a52" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* 背景光晕 */}
          <ellipse cx={W / 2} cy={H / 2} rx={W * 0.45} ry={H * 0.4}
            fill="url(#starBg)" />

          {/* 装饰小星星 */}
          {[
            [60, 40], [490, 60], [30, 300], [520, 350], [140, 380],
            [420, 30], [80, 200], [500, 200], [280, 15], [260, 400],
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.5}
              fill="#f4b8a0" opacity={0.2 + (i % 3) * 0.15} />
          ))}

          {/* 边（连线） */}
          {graph.edges.map((edge) => {
            const src = layout.get(edge.source);
            const tgt = layout.get(edge.target);
            if (!src || !tgt) return null;
            const x1 = toSvg(src.x, W, PAD);
            const y1 = toSvg(src.y, H, PAD);
            const x2 = toSvg(tgt.x, W, PAD);
            const y2 = toSvg(tgt.y, H, PAD);
            // year->event 用更细的虚线
            const isSecondary = edge.source.startsWith("year-");
            return (
              <line key={edge.id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#f4b8a0"
                strokeWidth={isSecondary ? 0.6 : 1}
                strokeOpacity={isSecondary ? 0.2 : 0.35}
                strokeDasharray={isSecondary ? "3 5" : undefined}
              />
            );
          })}

          {/* 节点 */}
          {graph.nodes.map((node) => {
            const pos = layout.get(node.id);
            if (!pos) return null;
            const c = NODE_CONFIG[node.type] ?? NODE_CONFIG.memory;
            const x = toSvg(pos.x, W, PAD);
            const y = toSvg(pos.y, H, PAD);
            const isSelected = node.id === selectedId;
            const scale = isSelected ? 1.18 : 1;

            return (
              <g key={node.id}
                style={{ cursor: "pointer", transform: `scale(${scale})`, transformOrigin: `${x}px ${y}px`, transition: "transform 0.2s" }}
                onClick={() => setSelectedId(node.id)}>
                {/* 外圈光晕 */}
                <circle cx={x} cy={y} r={c.radius + 8}
                  fill={c.glowColor} opacity={isSelected ? 0.25 : 0.1} />
                {/* 节点主体 */}
                <circle cx={x} cy={y} r={c.radius}
                  fill={c.color}
                  opacity={isSelected ? 1 : 0.85}
                  filter={isSelected ? `url(#glow-${node.type})` : undefined}
                  stroke={isSelected ? "#f4b8a0" : "transparent"}
                  strokeWidth={isSelected ? 1.5 : 0}
                />
                {/* Emoji */}
                <text x={x} y={y - (node.type === "child" ? 6 : 4)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.type === "child" ? 18 : 13}>
                  {c.emoji}
                </text>
                {/* 标签文字 */}
                <text x={x} y={y + (node.type === "child" ? 14 : 11)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.type === "child" ? 11 : 9}
                  fontWeight={node.type === "child" ? "bold" : "normal"}
                  fill={node.type === "child" ? "#2d1f1a" : "#3d2c2c"}
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {node.label.length > 6 ? node.label.slice(0, 6) + "…" : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 详情卡片 */}
      {selectedNode && (
        <div className="mx-4 mb-5 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,248,243,0.08)", border: "1px solid rgba(244,184,160,0.2)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{cfg.emoji}</span>
            <span className="text-xs font-semibold" style={{ color: "#f4b8a0" }}>
              {cfg.typeName}
            </span>
            <span className="text-sm font-bold" style={{ color: "#fde8dc" }}>
              {selectedNode.label}
            </span>
          </div>
          {selectedNode.description && (
            <p className="text-xs leading-relaxed" style={{ color: "rgba(244,184,160,0.75)" }}>
              {selectedNode.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
