"use client";

import { useState, useMemo } from "react";
import type { RawMaterial, ReportData } from "@/lib/types";
import { buildLifeGraph } from "@/lib/graph/buildLifeGraph";
import type { LifeGraphNode, LifeGraphNodeType, LifeGraphEdge } from "@/lib/graph/types";
import type { AiGraphHints } from "@/lib/skill-runtime/types";

type Props = {
  rawMaterial: RawMaterial;
  report: ReportData;
  graphHints?: AiGraphHints; // AI 生成的星图语义节点，优先使用；缺失时 fallback 到前端派生
};

// ── 节点类型视觉配置 ──────────────────────────────────────────────
// 保留旧 child/year，新增通用类型（subject/person/time/place/message/emotion）
const NODE_CONFIG: Record<string, {
  color: string;
  glowColor: string;
  radius: number;
  emoji: string;
  typeName: string;
  typeHint: string;
}> = {
  // ── 旧 family-specific 类型（保留兼容） ──
  child:   { color: "#f4b8a0", glowColor: "#e8836a", radius: 38, emoji: "🌸", typeName: "主角",       typeHint: "这一年的主角" },
  year:    { color: "#fde8dc", glowColor: "#f4b8a0", radius: 26, emoji: "📅", typeName: "年份",       typeHint: "这一年的成长记录" },
  // ── 共用类型 ──
  keyword: { color: "#fcd5c0", glowColor: "#e8836a", radius: 20, emoji: "✨", typeName: "关键词",     typeHint: "这是这一年反复出现的成长印记" },
  event:   { color: "#e8cdb8", glowColor: "#c08070", radius: 22, emoji: "⏱", typeName: "重要瞬间",   typeHint: "这是今年值得被记住的一个瞬间" },
  letter:  { color: "#fde8dc", glowColor: "#f4b8a0", radius: 24, emoji: "✉️", typeName: "给未来的信",  typeHint: "这是父母想留给未来孩子的话" },
  memory:  { color: "#ddd0c8", glowColor: "#b09080", radius: 20, emoji: "📓", typeName: "记录",       typeHint: "这是父母亲手补充的原始记录" },
  // ── 通用类型（Phase 6 新增）──
  subject: { color: "#f4b8a0", glowColor: "#e8836a", radius: 38, emoji: "🌸", typeName: "主题",       typeHint: "这段记忆的中心" },
  person:  { color: "#f4b8a0", glowColor: "#e8836a", radius: 26, emoji: "👤", typeName: "人物",       typeHint: "这段记忆中的重要人物" },
  time:    { color: "#fde8dc", glowColor: "#f4b8a0", radius: 26, emoji: "📅", typeName: "时间",       typeHint: "这段记忆发生的时间" },
  place:   { color: "#e8cdb8", glowColor: "#c08070", radius: 22, emoji: "📍", typeName: "地点",       typeHint: "这段记忆中的地点" },
  message: { color: "#ddd0c8", glowColor: "#b09080", radius: 20, emoji: "💬", typeName: "对话",       typeHint: "一段被记住的话" },
  emotion: { color: "#fcd5c0", glowColor: "#e8836a", radius: 20, emoji: "💛", typeName: "情绪",       typeHint: "这段记忆里的情绪" },
};

// ── 标签截断 ────────────────────────────────────────────────────
function truncateLabel(label: string, type: LifeGraphNodeType): string {
  const maxLen: Partial<Record<LifeGraphNodeType, number>> = {
    child:   8,
    year:    6,
    subject: 8,
    person:  6,
    time:    6,
    keyword: 5,
    event:   5,
    place:   6,
    message: 6,
    emotion: 5,
    letter:  6,
    memory:  6,
  };
  const max = maxLen[type] ?? 6;
  return label.length > max ? label.slice(0, max) + "…" : label;
}

// ── 布局计算 ─────────────────────────────────────────────────────
function computeLayout(nodes: LifeGraphNode[]): Map<string, { x: number; y: number }> {
  const layout = new Map<string, { x: number; y: number }>();
  const cx = 0.5;
  const cy = 0.48;

  // 中心节点：优先 subject，fallback child
  const centerNode =
    nodes.find((n) => n.type === "subject") ??
    nodes.find((n) => n.type === "child");

  // 时间节点：优先 time，fallback year
  const timeNode =
    nodes.find((n) => n.type === "time") ??
    nodes.find((n) => n.type === "year");

  if (centerNode) layout.set(centerNode.id, { x: cx, y: cy });
  if (timeNode) layout.set(timeNode.id, { x: cx - 0.28, y: cy - 0.28 });

  // 关键词 + 情绪节点环绕中心
  const keywords = nodes.filter((n) => n.type === "keyword" || n.type === "emotion");
  keywords.forEach((node, i) => {
    const total = keywords.length;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    layout.set(node.id, { x: cx + 0.26 * Math.cos(angle), y: cy + 0.26 * Math.sin(angle) });
  });

  // 事件 + 地点节点外圈
  const events = nodes.filter((n) => n.type === "event" || n.type === "place");
  events.forEach((node, i) => {
    const total = events.length;
    const offset = keywords.length > 0 ? Math.PI / keywords.length : Math.PI / 4;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2 + offset;
    layout.set(node.id, { x: cx + 0.38 * Math.cos(angle), y: cy + 0.38 * Math.sin(angle) });
  });

  // 信件 + 记录 + 对话 + 人物节点底部
  const specials = nodes.filter((n) =>
    n.type === "letter" ||
    n.type === "memory" ||
    n.type === "message" ||
    n.type === "person"
  );
  specials.forEach((node, i) => {
    layout.set(node.id, { x: i === 0 ? cx + 0.30 : cx - 0.30, y: cy + 0.35 });
  });

  return layout;
}

function toSvg(v: number, size: number, padding: number): number {
  return Math.max(padding, Math.min(size - padding, v * size));
}

export default function LifeGraphPreview({ rawMaterial, report, graphHints }: Props) {
  const useAiHints = graphHints && graphHints.nodes.length > 0;

  const derivedGraph = useMemo(
    () => buildLifeGraph({ rawMaterial, report }),
    [rawMaterial, report]
  );

  const graph = useMemo(() => {
    if (!useAiHints) return derivedGraph;

    const aiNodes: LifeGraphNode[] = graphHints.nodes.map((n, i) => ({
      id: `ai-${n.type}-${i}`,
      type: n.type,
      label: n.label,
      description: n.description,
      source: "generated" as const,
    }));

    // 优先找 subject，fallback child
    const centerNode =
      derivedGraph.nodes.find((n) => n.type === "subject") ??
      derivedGraph.nodes.find((n) => n.type === "child");
    // 优先找 time，fallback year
    const timeNode =
      derivedGraph.nodes.find((n) => n.type === "time") ??
      derivedGraph.nodes.find((n) => n.type === "year");
    const timeId = timeNode?.id ?? "year";

    const baseNodes: LifeGraphNode[] = [
      centerNode
        ? { ...centerNode, description: graphHints.centerDescription }
        : null,
      timeNode ?? null,
      ...aiNodes,
    ].filter((n): n is LifeGraphNode => n !== null);

    const edgeIds = new Set<string>();
    const edges: LifeGraphEdge[] = [];
    function addEdge(id: string, source: string, target: string, label?: string) {
      if (!edgeIds.has(id)) {
        edgeIds.add(id);
        edges.push({ id, source, target, label });
      }
    }

    const centerId = centerNode?.id ?? "child";
    addEdge("e-center-time", centerId, timeId);

    aiNodes.forEach((aiNode) => {
      addEdge(`e-center-${aiNode.id}`, centerId, aiNode.id);
      if (aiNode.type === "event" || aiNode.type === "place") {
        addEdge(`e-time-${aiNode.id}`, timeId, aiNode.id);
      }
    });

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

  const graphTitle = useAiHints ? graphHints.title : "被爱点亮的这一年";
  const graphSubtitle = useAiHints ? graphHints.subtitle : "每一颗星，都是你认真记住过的瞬间。";

  // selectedId 初始化：优先 subject/child，fallback 第一个节点
  // 用 useMemo 从 graph.nodes 派生，避免在 useEffect 里 setState
  const defaultSelectedId = useMemo(() => {
    return (
      graph.nodes.find((n) => n.type === "subject")?.id ??
      graph.nodes.find((n) => n.type === "child")?.id ??
      graph.nodes[0]?.id ??
      ""
    );
  }, [graph.nodes]);

  const [selectedId, setSelectedId] = useState<string>(() => defaultSelectedId);

  const layout = useMemo(() => computeLayout(graph.nodes), [graph.nodes]);

  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? graph.nodes[0];
  const cfg = NODE_CONFIG[selectedNode?.type ?? "child"] ?? NODE_CONFIG.memory;

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
            const isKwEv = edge.id.startsWith("edge-kw-ev-") || edge.id.startsWith("e-rel-");
            const isTimeEv = edge.source.startsWith("year-") || edge.source.startsWith("time-");
            return (
              <line key={edge.id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#f4b8a0"
                strokeWidth={isKwEv ? 0.8 : isTimeEv ? 0.6 : 1}
                strokeOpacity={isKwEv ? 0.18 : isTimeEv ? 0.2 : 0.35}
                strokeDasharray={isKwEv ? "2 6" : isTimeEv ? "3 5" : undefined}
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
            const isCenterType = node.type === "child" || node.type === "subject";

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
                <text x={x} y={y - (isCenterType ? 6 : 4)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isCenterType ? 18 : 13}>
                  {c.emoji}
                </text>
                <text x={x} y={y + (isCenterType ? 14 : 11)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isCenterType ? 11 : 9}
                  fontWeight={isCenterType ? "bold" : "normal"}
                  fill={isCenterType ? "#2d1f1a" : "#3d2c2c"}
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {truncateLabel(node.label, node.type)}
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
