"use client";

// components/memorial/MemorialMemoryApp.tsx
// memorial mode 主状态机：输入页 → mock 结果页。
// Phase 11.1：不调用 DeepSeek，点击生成后直接展示 mock artifact。

import { useState } from "react";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import { MEMORIAL_DEFAULT_QUESTIONS } from "@/lib/domains/memorial/defaultQuestions";
import { MOCK_MEMORIAL_ARTIFACT } from "@/lib/domains/memorial/mockArtifact";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import MemorialMemoryGraphPreview from "./MemorialMemoryGraphPreview";

type MemorialScreen = "input" | "result";
type QAItem = { question: string; answer: string };

type Props = {
  onBackToLanding: () => void;
  onBackToHome?: () => void;
};

const STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: "warm", label: "温柔回望" },
  { value: "documentary", label: "纪实记录" },
  { value: "solemn", label: "庄重克制" },
  { value: "family", label: "家族叙述" },
];

export default function MemorialMemoryApp({ onBackToLanding, onBackToHome }: Props) {
  const [screen, setScreen] = useState<MemorialScreen>("input");
  const [artifact, setArtifact] = useState<MemoryArtifact | null>(null);

  const [personName, setPersonName] = useState("");
  const [relation, setRelation] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [style, setStyle] = useState("warm");
  const [qaList, setQaList] = useState<QAItem[]>(
    MEMORIAL_DEFAULT_QUESTIONS.map((q) => ({ question: q.question, answer: "" }))
  );
  const [freeNote, setFreeNote] = useState("");

  function handleAnswerChange(idx: number, value: string) {
    setQaList((prev) => prev.map((q, i) => (i === idx ? { ...q, answer: value } : q)));
  }

  const hasContent =
    qaList.some((q) => q.answer.trim().length > 0) || freeNote.trim().length > 0;

  const canGenerate =
    personName.trim().length > 0 &&
    relation.trim().length > 0 &&
    hasContent;

  function handleGenerate() {
    if (!canGenerate) return;
    setArtifact(MOCK_MEMORIAL_ARTIFACT);
    setScreen("result");
  }

  function handleReset() {
    setArtifact(null);
    setPersonName("");
    setRelation("");
    setTimeRange("");
    setStyle("warm");
    setQaList(MEMORIAL_DEFAULT_QUESTIONS.map((q) => ({ question: q.question, answer: "" })));
    setFreeNote("");
    setScreen("input");
  }

  if (screen === "result" && artifact) {
    return (
      <MemoryArtifactPreview
        artifact={artifact}
        onBackToEdit={() => setScreen("input")}
        onCreateAnother={handleReset}
        onBackToHome={onBackToHome}
        modeLabel="纪念册"
        badge="🕯️ 纪念册"
        fallbackTitle="纪念册"
        printBrandText="由 Memory Wiki 整理"
        emptyKeywordsHint="还没有提炼出关键词。可以补充更具体的习惯、物品、场景或关系后重新生成。"
        timelineTitle="⏱ 人生片段时间线"
        emptyTimelineHint="还没有足够材料生成时间线。可以补充具体时间节点、重要事件或生活转折。"
        longFormFallbackTitle="写给家人的纪念文"
        socialPostsTitle="📱 纪念页文案"
        emptySocialPostsHint="这次没有生成纪念文案。可以补充想留给后辈的核心印象后重新生成。"
        usagePrimaryTip="你可以把这份纪念册保存成 PDF，作为家庭记忆资料长期留存。"
        usageSecondaryTip="当前是 preview 阶段，这份结果使用 mock 数据展示页面效果；真实 AI 生成会在后续阶段接入。如果想让未来生成更贴近真实记忆，可以补充更具体的场景、话语和细节。"
        graphSlot={<MemorialMemoryGraphPreview graph={artifact.graph} />}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f8f7f4 0%, #f0ece4 100%)" }}>
      {/* 顶部导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between"
        style={{
          background: "rgba(248, 247, 244, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e0dbd4",
        }}
      >
        <button
          onClick={onBackToLanding}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#7a7065" }}
        >
          ← 返回介绍页
        </button>
        <span className="text-xs" style={{ color: "#9a908a" }}>
          🕯️ 纪念册 · preview
        </span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 pb-24">
        <h2 className="text-xl font-bold mb-1" style={{ color: "#2a2520" }}>
          告诉我关于 ta 的故事
        </h2>
        <p className="text-sm mb-6" style={{ color: "#7a7065" }}>
          填写越具体，整理出来就越真实。
        </p>

        {/* 基本信息 */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #e0dbd4" }}
        >
          <p className="text-xs font-semibold mb-4" style={{ color: "#5a5248" }}>基本信息</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5a5248" }}>
                被纪念者称呼 <span style={{ color: "#c06050" }}>*</span>
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="例如：外婆、陈玉兰、父亲"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#f5f2ee", border: "1px solid #d4cfc8", color: "#2a2520" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5a5248" }}>
                你们的关系 <span style={{ color: "#c06050" }}>*</span>
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="例如：外孙女、儿子、老友"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#f5f2ee", border: "1px solid #d4cfc8", color: "#2a2520" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5a5248" }}>
                时间跨度（可选）
              </label>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="例如：1938 - 2021，或 ta 的某段人生"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#f5f2ee", border: "1px solid #d4cfc8", color: "#2a2520" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5a5248" }}>文稿风格</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStyle(opt.value)}
                    className="py-2 rounded-xl text-xs font-medium cursor-pointer transition-all"
                    style={{
                      background: style === opt.value ? "#8c7d6e" : "#f5f2ee",
                      color: style === opt.value ? "white" : "#5a5248",
                      border: `1px solid ${style === opt.value ? "#8c7d6e" : "#d4cfc8"}`,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 问答区 */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #e0dbd4" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#5a5248" }}>回忆问答</p>
          <p className="text-xs mb-4" style={{ color: "#9a908a" }}>
            选择你有话说的问题回答，至少回答 1 题
          </p>
          <div className="space-y-5">
            {qaList.map((qa, idx) => (
              <div key={idx}>
                <p className="text-xs font-medium mb-1.5" style={{ color: "#4a4038" }}>
                  {idx + 1}. {qa.question}
                </p>
                <textarea
                  value={qa.answer}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder="在这里写下你的回忆……"
                  rows={2}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ background: "#f5f2ee", border: "1px solid #d4cfc8", color: "#2a2520" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 自由文本 */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #e0dbd4" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#5a5248" }}>自由记录（可选）</p>
          <p className="text-xs mb-3" style={{ color: "#9a908a" }}>
            任何你想写下来的——某个场景、某句话、某个物品，或者你不希望被遗忘的细节
          </p>
          <textarea
            value={freeNote}
            onChange={(e) => setFreeNote(e.target.value)}
            placeholder="把想留下来的都写在这里……"
            rows={4}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            style={{ background: "#f5f2ee", border: "1px solid #d4cfc8", color: "#2a2520" }}
          />
        </div>

        {/* 校验提示 */}
        {!canGenerate && (personName || relation) && (
          <p className="text-xs mb-3 text-center" style={{ color: "#9a908a" }}>
            {!personName.trim() || !relation.trim()
              ? "请填写被纪念者称呼和你们的关系"
              : "请至少回答一个问题，或在自由记录里写一些内容"}
          </p>
        )}

        {/* 说明 */}
        <p className="text-xs text-center mb-3" style={{ color: "#9a908a" }}>
          当前是 preview 体验，点击后展示 mock 结果，不会调用 AI，不会发送你的内容。
        </p>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canGenerate ? "linear-gradient(135deg, #8c7d6e, #6e6058)" : "#c0b8b0",
          }}
        >
          预览纪念册 ✦
        </button>
      </div>
    </div>
  );
}
