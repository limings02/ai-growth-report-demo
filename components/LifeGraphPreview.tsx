"use client";

import { useState, useMemo } from "react";
import type { RawMaterial, ReportData } from "@/lib/types";
import { buildLifeGraph } from "@/lib/graph/buildLifeGraph";
import type { LifeGraphNode, LifeGraphNodeType } from "@/lib/graph/types";
import type { AiGraphHints } from "@/lib/skill-runtime/types";

type Props = {
  rawMaterial: RawMaterial;
  report: ReportData;
  graphHints?: AiGraphHints; // AI 生成的星图语义节点，优先使用；缺失时 fallback 到前端派生
};

// 节点类型对应的视觉配置
const NODE_CONFIG: Record<string, {
  color: string;
  glowColor: string;
  radius: number;
  emoji: string;
  typeName: string;
  typeHint: string; // 详情卡片中的解释文案
}> = {
  child:   { color: "#f4b8a0", glowColor: "#e8836a", radius: 38, emoji: "🌸", typeName: "主角",      typeHint: "这一年的主角" },
  year:    { color: "#fde8dc", glowColor: "#f4b8a0", radius: 26, emoji: "📅", typeName: "年份",      typeHint: "这一年的成长记录" },
  keyword: { color: "#fcd5c0", glowColor: "#e8836a", radius: 20, emoji: "✨", typeName: "关键词",    typeHint: "这是这一年反复出现的成长印记" },
  event:   { color: "#e8cdb8", glowColor: "#c08070", radius: 22, emoji: "⏱", typeName: "重要瞬间",  typeHint: "这是今年值得被记住的一个瞬间" },
  letter:  { color: "#fde8dc", glowColor: "#f4b8a0", radius: 24, emoji: "✉️", typeName: "给未来的信", typeHint: "这是父母想留给未来孩子的话" },
  memory:  { color: "#ddd0c8", glowColor: "#b09080", radius: 20, emoji: "📓", typeName: "记录",      typeHint: "这是父母亲手补充的原始记录" },
};

// 按节点类型决定标签最大字数
function truncateLabel(label: string, type: LifeGraphNodeType): string {
  const maxLen: Record<LifeGraphNodeType, number> = {
    child:   8,
    year:    6,
    keyword: 5,
    event:   5,
    letter:  6,
    memory:  6,
  };
  const max = maxLen[type] ?? 6;
  return label.length > max ? label.slice(0, max) + "…" : label;
}

// 布局：在 [0, 1] 范围内计算各节点坐标
function computeLayout(nodes: LifeGraphNode[]): Map<string, { x: number; y: number }> {
  const layout = new Map<string, { x: number; y: number }>();
  const cx = 0.5;
  const cy = 0.48;

  const keywords = nodes.filter((n) => n.type === "keyword");
  const events   = nodes.filter((n) => n.type === "event");
  const specials = nodes.filter((n) => n.type === "letter" || n.type === "memory");
  const yearNode = nodes.find((n) => n.type === "year");

  layout.set("child", { x: cx, y: cy });

  if (yearNode) layout.set(yearNode.id, { x: cx - 0.28, y: cy - 0.28 });

  keywords.forEach((node, i) => {
    const total = keywords.length;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    layout.set(node.id, { x: cx + 0.26 * Math.cos(angle), y: cy + 0.26 * Math.sin(angle) });
  });

  events.forEach((node, i) => {
    const total = events.length;
    const offset = keywords.length > 0 ? Math.PI / keywords.length : Math.PI / 4;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2 + offset;
    layout.set(node.id, { x: cx + 0.38 * Math.cos(angle), y: cy + 0.38 * Math.sin(angle) });
  });

  specials.forEach((node, i) => {
    layout.set(node.id, { x: i === 0 ? cx + 0.30 : cx - 0.30, y: cy + 0.35 });
  });

  return layout;
}

function toSvg(v: number, size: number, padding: number): number {
  return Math.max(padding, Math.min(size - padding, v * size));
}

export default function LifeGraphPreview({ rawMaterial, report, graphHints }: Props) {
  // 优先使用 AI 生成的 graphHints，fallback 到前端派生
  const useAiHints = graphHints && graphHints.nodes.length > 0;

  // 前端派生图谱（fallback 或与 AI 图谱合并用于布局/边）
  const derivedGraph = useMemo(
    () => buildLifeGraph({ rawMaterial, report }),
    [rawMaterial, report]
  );

  // 若有 AI 节点，重建节点和边（不复用 derivedGraph.edges，旧 edges 指向旧 id）
  const graph = useMemo(() => {
    if (!useAiHints) return derivedGraph;

    // AI 节点 id 用 label 的 slug，避免 id 冲突
    const aiNodes: LifeGraphNode[] = graphHints.nodes.map((n, i) => ({
      id: `ai-${n.type}-${i}`,
      type: n.type,
      label: n.label,
      description: n.description,
      source: "generated" as const,
    }));

    const childNode = derivedGraph.nodes.find((n) => n.type === "child");
    const yearNode = derivedGraph.nodes.find((n) => n.type === "year");
    const yearId = yearNode?.id ?? "year";

    const baseNodes: LifeGraphNode[] = [
      childNode ? { ...childNode, description: graphHints.centerDescription } : childNode!,
      ...(yearNode ? [yearNode] : []),
      ...aiNodes,
    ].filter(Boolean);

    // 为 AI 节点重建边
    const edgeIds = new Set<string>();
    const edges: import("@/lib/graph/types").LifeGraphEdge[] = [];
    function addEdge(id: string, source: string, target: string, label?: string) {
      if (!edgeIds.has(id)) { edgeIds.add(id); edges.push({ id, source, target, label }); }
    }

    // child → year
    addEdge("e-child-year", "child", yearId);

    aiNodes.forEach((aiNode) => {
      // child → 每个 AI 节点
      addEdge(`e-child-${aiNode.id}`, "child", aiNode.id);
      // year → event 类型的 AI 节点（虚线）
      if (aiNode.type === "event") {
        addEdge(`e-year-${aiNode.id}`, yearId, aiNode.id);
      }
    });

    // relatedTo 弱关联边：根据 label 查找对应节点 id
    const labelToId = new Map(aiNodes.map((n) => [n.label, n.id]));
    graphHints.nodes.forEach((n, i) => {
      const sourceId = `ai-${n.type}-${i}`;
      n.relatedTo.forEach((targetLabel) => {
        const targetId = labelToId.get(targetLabel);
        if (targetId && targetId !== sourceId) {
          addEdge(`e-rel-${sourceId}-${targetId}`, sourceId, targetId, "相关");
        }
      });
    });

    return { nodes: baseNodes, edges };
  }, [useAiHints, graphHints, derivedGraph]);

  // 标题和副标题：优先使用 AI 版本
  const graphTitle = useAiHints ? graphHints.title : "被爱点亮的这一年";
  const graphSubtitle = useAiHints ? graphHints.subtitle : "每一颗星，都是你认真记住过的瞬间。";

  const [selectedId, setSelectedId] = useState<string>("child");
  const layout = useMemo(() => computeLayout(graph.nodes), [graph.nodes]);

  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? graph.nodes[0];
  const cfg = NODE_CONFIG[selectedNode?.type ?? "child"];

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
        <p className="text-sm font-bold mb-1" style={{ color: "#f4b8a0", letterSpacing: "0.08em" }}>
          ✦ {graphTitle}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(244,184,160,0.6)" }}>
          {graphSubtitle}
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
            <radialGradient id="starBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7a5a52" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <ellipse cx={W / 2} cy={H / 2} rx={W * 0.45} ry={H * 0.4} fill="url(#starBg)" />

          {/* 装饰小星星 */}
          {([
            [60, 40], [490, 60], [30, 300], [520, 350], [140, 380],
            [420, 30], [80, 200], [500, 200], [280, 15], [260, 400],
          ] as [number, number][]).map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.5} fill="#f4b8a0" opacity={0.2 + (i % 3) * 0.15} />
          ))}

          {/* 边 */}
          {graph.edges.map((edge) => {
            const src = layout.get(edge.source);
            const tgt = layout.get(edge.target);
            if (!src || !tgt) return null;
            const x1 = toSvg(src.x, W, PAD);
            const y1 = toSvg(src.y, H, PAD);
            const x2 = toSvg(tgt.x, W, PAD);
            const y2 = toSvg(tgt.y, H, PAD);
            // relatedTo 弱关联用更淡的点线；year->event 用虚线；其他用实线
            const isKwEv = edge.id.startsWith("edge-kw-ev-") || edge.id.startsWith("e-rel-");
            const isYearEv = edge.source.startsWith("year-");
            return (
              <line key={edge.id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#f4b8a0"
                strokeWidth={isKwEv ? 0.8 : isYearEv ? 0.6 : 1}
                strokeOpacity={isKwEv ? 0.18 : isYearEv ? 0.2 : 0.35}
                strokeDasharray={isKwEv ? "2 6" : isYearEv ? "3 5" : undefined}
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
                <circle cx={x} cy={y} r={c.radius + 8} fill={c.glowColor} opacity={isSelected ? 0.25 : 0.1} />
                <circle cx={x} cy={y} r={c.radius}
                  fill={c.color}
                  opacity={isSelected ? 1 : 0.85}
                  filter={isSelected ? `url(#glow-${node.type})` : undefined}
                  stroke={isSelected ? "#f4b8a0" : "transparent"}
                  strokeWidth={isSelected ? 1.5 : 0}
                />
                <text x={x} y={y - (node.type === "child" ? 6 : 4)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.type === "child" ? 18 : 13}>
                  {c.emoji}
                </text>
                <text x={x} y={y + (node.type === "child" ? 14 : 11)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.type === "child" ? 11 : 9}
                  fontWeight={node.type === "child" ? "bold" : "normal"}
                  fill={node.type === "child" ? "#2d1f1a" : "#3d2c2c"}
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {truncateLabel(node.label, node.type)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 详情卡片：emoji + 类型名 + label → 解释文案 → description */}
      {selectedNode && (
        <div className="mx-4 mb-5 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,248,243,0.08)", border: "1px solid rgba(244,184,160,0.2)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{cfg.emoji}</span>
            <span className="text-xs font-semibold" style={{ color: "#f4b8a0" }}>
              {cfg.typeName}
            </span>
            <span className="text-sm font-bold" style={{ color: "#fde8dc" }}>
              {selectedNode.label}
            </span>
          </div>
          <p className="text-xs mb-1.5" style={{ color: "rgba(244,184,160,0.5)" }}>
            {cfg.typeHint}
          </p>
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
