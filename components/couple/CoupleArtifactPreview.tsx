"use client";

// components/couple/CoupleArtifactPreview.tsx
// 展示 couple mode 生成的 MemoryArtifact。
//
// 当前展示内容：
// - 封面（标题 + 关键词 + summary）
// - 恋爱时间线
// - 周年信 / 写给未来你们的信
// - 分享文案
// - Relationship Galaxy 雏形（节点卡片列表，不做复杂 SVG）
// - 生成质量说明（sourceTrace / qualityReview）

import { useState } from "react";
import type { MemoryArtifact, MemorySourceTrace, MemoryQualityReview } from "@/lib/memory-core/types";

type Props = {
  artifact: MemoryArtifact;
  onBackToEdit: () => void;
  onCreateAnother: () => void;
};

// 图谱节点类型的视觉配置
const NODE_TYPE_CONFIG: Record<string, { emoji: string; label: string }> = {
  person:  { emoji: "👤", label: "人物" },
  time:    { emoji: "📅", label: "时间" },
  event:   { emoji: "⏱", label: "事件" },
  emotion: { emoji: "💛", label: "情绪" },
  message: { emoji: "💬", label: "对话" },
  keyword: { emoji: "✨", label: "关键词" },
  place:   { emoji: "📍", label: "地点" },
  memory:  { emoji: "📓", label: "记忆" },
};

export default function CoupleArtifactPreview({ artifact, onBackToEdit, onCreateAnother }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { narrative, graph, extensions } = artifact;

  const sourceTrace = extensions?.sourceTrace as MemorySourceTrace | undefined;
  const qualityReview = extensions?.qualityReview as MemoryQualityReview | undefined;

  // 识别 fallback artifact：parseMemoryArtifact 解析失败时的兜底结果
  const isFallbackArtifact =
    narrative.summary.includes("最小记忆整理结果") ||
    narrative.longFormText.voice === "fallback";

  function handleCopy(content: string, idx: number) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  return (
    <div className="min-h-screen" style={{ background: "#fffaf7" }}>
      {/* 顶部操作栏 */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <button
          onClick={onBackToEdit}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#9d7b72" }}
        >
          ← 返回修改
        </button>
        <button
          onClick={onCreateAnother}
          className="text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all hover:shadow-md"
          style={{ background: "#fde8dc", color: "#c0674a" }}
        >
          再做一本
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20 pt-6">

        {/* ── Fallback 提示（生成结果不完整时展示）── */}
        {isFallbackArtifact && (
          <div
            className="rounded-2xl p-4 mb-5 flex gap-3"
            style={{ background: "#fff3e0", border: "1px solid #ffe0b2" }}
          >
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#e65100" }}>
                这次生成结果不完整
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#bf360c" }}>
                系统没有成功解析出完整的恋爱纪念册。你可以返回修改，补充更多聊天片段、
                具体时间、地点或故事后重新生成。
              </p>
              <button
                onClick={onBackToEdit}
                className="mt-2 text-xs underline cursor-pointer"
                style={{ color: "#e65100" }}
              >
                返回修改 →
              </button>
            </div>
          </div>
        )}

        {/* ── 封面区 ── */}
        <div
          className="rounded-3xl p-7 mb-5"
          style={{
            background: "linear-gradient(135deg, #fde8dc 0%, #fcd5c0 50%, #f4b8a0 100%)",
          }}
        >
          <p className="text-xs font-medium mb-3 opacity-70" style={{ color: "#8b4a38" }}>
            💑 恋爱纪念册
          </p>
          <h2 className="text-2xl font-bold leading-snug mb-3" style={{ color: "#2d1f1a" }}>
            {narrative.title || "恋爱纪念册"}
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
              这次材料中还没有提炼出稳定关键词。可以补充更多聊天片段或具体故事后重新生成。
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

        {/* ── 恋爱时间线 ── */}
        {narrative.timeline.length > 0 ? (
          <SectionCard title="⏱ 恋爱时间线">
            <div className="relative pl-4">
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px"
                style={{ background: "linear-gradient(to bottom, #f4b8a0, #fde8dc)" }}
              />
              <div className="space-y-5">
                {narrative.timeline.map((item, i) => (
                  <div key={i} className="relative flex gap-4">
                    <div
                      className="flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm mt-0.5"
                      style={{ background: "#e8836a", marginLeft: "-2px" }}
                    />
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "#fde8dc", color: "#c0674a" }}
                        >
                          {item.time}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "#2d1f1a" }}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#9d7b72" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="⏱ 恋爱时间线">
            <p className="text-xs" style={{ color: "#9d7b72" }}>
              还没有足够材料生成恋爱时间线。可以补充第一次见面、一次旅行、一次争吵与和好、一个普通但想保存的日常。
            </p>
          </SectionCard>
        )}

        {/* ── 写给未来你们的信 ── */}
        {narrative.longFormText.content && (
          <div
            className="rounded-2xl p-5 mb-5"
            style={{
              background: "#fffdf9",
              border: "1px solid #f0ddd5",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #f5e8e0 27px, #f5e8e0 28px)",
              backgroundSize: "100% 28px",
              backgroundPositionY: "40px",
            }}
          >
            <p className="text-xs font-semibold mb-3 relative z-10" style={{ color: "#9d7b72" }}>
              ✉️ {narrative.longFormText.title || "写给未来你们的信"}
            </p>
            <p
              className="text-sm leading-loose whitespace-pre-line relative z-10"
              style={{ color: "#3d2c2c", fontFamily: "'PingFang SC', 'Hiragino Sans GB', serif" }}
            >
              {narrative.longFormText.content}
            </p>
          </div>
        )}

        {/* ── 分享文案 ── */}
        {narrative.socialPosts.length > 0 ? (
          <SectionCard title="📱 分享文案">
            <div className="space-y-3">
              {narrative.socialPosts.map((post, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid #f0ddd5" }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2"
                    style={{ background: "#fde8dc" }}
                  >
                    <span className="text-xs font-semibold" style={{ color: "#c0674a" }}>
                      {post.title}
                    </span>
                    <button
                      onClick={() => handleCopy(post.content, i)}
                      className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all"
                      style={{
                        background: copiedIdx === i ? "#e8836a" : "white",
                        color: copiedIdx === i ? "white" : "#c0674a",
                      }}
                    >
                      {copiedIdx === i ? "✓ 已复制" : "复制"}
                    </button>
                  </div>
                  <p
                    className="text-xs leading-relaxed p-3 whitespace-pre-line"
                    style={{ background: "white", color: "#2d1f1a" }}
                  >
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="📱 分享文案">
            <p className="text-xs" style={{ color: "#9d7b72" }}>
              这次没有生成分享文案。可以补充更具体的纪念日、想表达的情绪或送礼场景后重新生成。
            </p>
          </SectionCard>
        )}

        {/* ── Relationship Galaxy 雏形 ── */}
        {graph && graph.nodes.length > 0 ? (
          <SectionCard title="🌌 Relationship Galaxy">
            <p className="text-xs mb-1 font-bold" style={{ color: "#2d1f1a" }}>
              {graph.title}
            </p>
            <p className="text-xs mb-4" style={{ color: "#9d7b72" }}>
              {graph.subtitle}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {graph.nodes.map((node, i) => {
                const nodeCfg = NODE_TYPE_CONFIG[node.type] ?? { emoji: "✨", label: node.type };
                return (
                  <div
                    key={i}
                    className="rounded-xl p-3"
                    style={{ background: "#f9f5f3", border: "1px solid #ead8d0" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{nodeCfg.emoji}</span>
                      <span className="text-xs font-semibold" style={{ color: "#2d1f1a" }}>
                        {node.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#9d7b72" }}>
                      {node.description}
                    </p>
                    {node.emotion && (
                      <span
                        className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "#fde8dc", color: "#c0674a" }}
                      >
                        {node.emotion}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="🌌 Relationship Galaxy">
            <p className="text-xs" style={{ color: "#9d7b72" }}>
              Relationship Galaxy 还没有足够节点。可以补充地点、昵称、反复出现的对话、共同经历或情绪关键词。
            </p>
          </SectionCard>
        )}

        {/* ── 生成质量说明 ── */}
        {qualityReview && (
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "#f9f5f3", border: "1px solid #ead8d0" }}
          >
            <p className="text-xs font-semibold mb-3" style={{ color: "#7a5a52" }}>
              📊 生成质量说明
            </p>
            <div className="space-y-2 text-xs" style={{ color: "#9d7b72" }}>
              <div className="flex items-center gap-2">
                <span>幻觉风险：</span>
                <span
                  className="px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background:
                      qualityReview.riskOfFabrication === "low"
                        ? "#e8f5e9"
                        : qualityReview.riskOfFabrication === "medium"
                        ? "#fff3e0"
                        : "#fff0ee",
                    color:
                      qualityReview.riskOfFabrication === "low"
                        ? "#2e7d32"
                        : qualityReview.riskOfFabrication === "medium"
                        ? "#e65100"
                        : "#c0674a",
                  }}
                >
                  {qualityReview.riskOfFabrication === "low"
                    ? "低"
                    : qualityReview.riskOfFabrication === "medium"
                    ? "中"
                    : "较高"}
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
          </div>
        )}

        {/* ── sourceTrace 折叠 ── */}
        {sourceTrace && (
          <details className="mb-5">
            <summary
              className="text-xs cursor-pointer px-3 py-2 rounded-xl"
              style={{ color: "#b08878", background: "#f9f5f3" }}
            >
              🔍 查看内容溯源
            </summary>
            <div
              className="mt-2 rounded-xl p-3 text-xs space-y-2"
              style={{ background: "#f5f0ee", color: "#7a5a52" }}
            >
              {sourceTrace.usedQuestions.length > 0 && (
                <div>
                  <p className="font-medium mb-1">使用的问题：</p>
                  <ul className="space-y-0.5" style={{ color: "#9d7b72" }}>
                    {sourceTrace.usedQuestions.map((q, i) => <li key={i}>· {q}</li>)}
                  </ul>
                </div>
              )}
              {sourceTrace.groundingNotes.length > 0 && (
                <div>
                  <p className="font-medium mb-1">内容依据说明：</p>
                  <ul className="space-y-0.5" style={{ color: "#9d7b72" }}>
                    {sourceTrace.groundingNotes.map((n, i) => <li key={i}>· {n}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}

        {/* ── 底部按钮 ── */}
        <div className="flex gap-3">
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
    >
      <p className="text-xs font-semibold mb-3" style={{ color: "#9d7b72" }}>
        {title}
      </p>
      {children}
    </div>
  );
}
