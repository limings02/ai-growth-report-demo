"use client";

// components/personal/PersonalMemoryApp.tsx
// personal mode 主状态机：输入页 → mock 结果页。
// Phase 10.1：不调用 DeepSeek，点击生成后直接展示 mock artifact。

import { useState } from "react";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import { PERSONAL_DEFAULT_QUESTIONS } from "@/lib/domains/personal/defaultQuestions";
import { MOCK_PERSONAL_ARTIFACT } from "@/lib/domains/personal/mockArtifact";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import PersonalMemoryGraphPreview from "./PersonalMemoryGraphPreview";

type PersonalScreen = "input" | "result";

type QAItem = { question: string; answer: string };

type Props = {
  onBackToLanding: () => void;
  onBackToHome?: () => void;
};

const STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: "reflective", label: "内省沉淀" },
  { value: "documentary", label: "纪实记录" },
  { value: "literary", label: "文学叙事" },
  { value: "warm", label: "温柔回望" },
];

export default function PersonalMemoryApp({ onBackToLanding, onBackToHome }: Props) {
  const [screen, setScreen] = useState<PersonalScreen>("input");
  const [artifact, setArtifact] = useState<MemoryArtifact | null>(null);

  // 表单状态
  const [personName, setPersonName] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [style, setStyle] = useState("reflective");
  const [qaList, setQaList] = useState<QAItem[]>(
    PERSONAL_DEFAULT_QUESTIONS.map((q) => ({ question: q.question, answer: "" }))
  );
  const [freeNote, setFreeNote] = useState("");

  function handleAnswerChange(idx: number, value: string) {
    setQaList((prev) => prev.map((q, i) => (i === idx ? { ...q, answer: value } : q)));
  }

  const hasContent =
    qaList.some((q) => q.answer.trim().length > 0) || freeNote.trim().length > 0;

  const canGenerate =
    personName.trim().length > 0 &&
    lifeStage.trim().length > 0 &&
    timeRange.trim().length > 0 &&
    hasContent;

  function handleGenerate() {
    if (!canGenerate) return;
    setArtifact(MOCK_PERSONAL_ARTIFACT);
    setScreen("result");
  }

  if (screen === "result" && artifact) {
    return (
      <MemoryArtifactPreview
        artifact={artifact}
        onBackToEdit={() => setScreen("input")}
        onCreateAnother={() => {
          setArtifact(null);
          setPersonName("");
          setLifeStage("");
          setTimeRange("");
          setStyle("reflective");
          setQaList(PERSONAL_DEFAULT_QUESTIONS.map((q) => ({ question: q.question, answer: "" })));
          setFreeNote("");
          setScreen("input");
        }}
        onBackToHome={onBackToHome}
        modeLabel="个人回忆录"
        badge="📖 个人回忆录"
        fallbackTitle="个人回忆录"
        printBrandText="由 Memory Wiki 生成"
        emptyKeywordsHint="还没有提炼出稳定关键词。可以补充更具体的经历、情绪或转折后重新生成。"
        timelineTitle="⏱ 人生阶段时间线"
        emptyTimelineHint="还没有足够材料生成时间线。可以补充具体时间、地点、事件或想保存的日常。"
        longFormFallbackTitle="写给未来自己的信"
        socialPostsTitle="📱 分享文案"
        emptySocialPostsHint="这次没有生成分享文案。可以补充更具体的场景、情绪或想分享的用途后重新生成。"
        usagePrimaryTip="你可以把这份个人回忆录保存成 PDF，作为阶段总结、生日礼物或未来回看的材料。"
        usageSecondaryTip="当前是 preview 阶段，这份结果使用 mock 数据展示页面效果；真实 AI 生成会在下一阶段接入。如果想让未来生成更贴近真实经历，可以补充更具体的人、地点、事件、情绪变化和当时说过的话。"
        graphSlot={<PersonalMemoryGraphPreview graph={artifact.graph} />}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f5f8ff 0%, #eef2fb 100%)" }}>
      {/* 顶部导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3 flex items-center justify-between"
        style={{
          background: "rgba(248, 250, 255, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #dde3f0",
        }}
      >
        <button
          onClick={onBackToLanding}
          className="text-sm cursor-pointer hover:underline"
          style={{ color: "#6b7db3" }}
        >
          ← 返回介绍页
        </button>
        <span className="text-xs" style={{ color: "#8090b8" }}>
          📖 个人回忆录 · preview
        </span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 pb-24">
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1a2340" }}>
          告诉我那段时间的故事
        </h2>
        <p className="text-sm mb-6" style={{ color: "#6b7db3" }}>
          填写越具体，整理出来就越像你自己。
        </p>

        {/* 基本信息 */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #dde3f0" }}
        >
          <p className="text-xs font-semibold mb-4" style={{ color: "#5568a0" }}>基本信息</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5568a0" }}>
                你的名字或称呼 <span style={{ color: "#e07a5f" }}>*</span>
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="例如：小林、阿夏、自己"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "#f0f4fc",
                  border: "1px solid #c8d0e8",
                  color: "#1a2340",
                }}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5568a0" }}>
                这是人生哪个阶段 <span style={{ color: "#e07a5f" }}>*</span>
              </label>
              <input
                type="text"
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value)}
                placeholder="例如：大学四年、第一份工作、移居北京那几年"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "#f0f4fc",
                  border: "1px solid #c8d0e8",
                  color: "#1a2340",
                }}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5568a0" }}>
                时间跨度 <span style={{ color: "#e07a5f" }}>*</span>
              </label>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="例如：2019 - 2023，或 2021.06 - 2022.12"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "#f0f4fc",
                  border: "1px solid #c8d0e8",
                  color: "#1a2340",
                }}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5568a0" }}>
                文案风格
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStyle(opt.value)}
                    className="py-2 rounded-xl text-xs font-medium cursor-pointer transition-all"
                    style={{
                      background: style === opt.value ? "#6b8adc" : "#f0f4fc",
                      color: style === opt.value ? "white" : "#5568a0",
                      border: `1px solid ${style === opt.value ? "#6b8adc" : "#c8d0e8"}`,
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
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #dde3f0" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#5568a0" }}>
            回忆问答
          </p>
          <p className="text-xs mb-4" style={{ color: "#8090b8" }}>
            选择你有话说的问题回答，至少回答 1 题
          </p>
          <div className="space-y-5">
            {qaList.map((qa, idx) => (
              <div key={idx}>
                <p className="text-xs font-medium mb-1.5" style={{ color: "#3a4870" }}>
                  {idx + 1}. {qa.question}
                </p>
                <textarea
                  value={qa.answer}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder="在这里写下你的回答……"
                  rows={2}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                  style={{
                    background: "#f0f4fc",
                    border: "1px solid #c8d0e8",
                    color: "#1a2340",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 自由文本 */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #dde3f0" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#5568a0" }}>
            自由记录（可选）
          </p>
          <p className="text-xs mb-3" style={{ color: "#8090b8" }}>
            日记片段、某句想说的话、某个场景的描述，随便写
          </p>
          <textarea
            value={freeNote}
            onChange={(e) => setFreeNote(e.target.value)}
            placeholder="把想说的都写在这里……"
            rows={4}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            style={{
              background: "#f0f4fc",
              border: "1px solid #c8d0e8",
              color: "#1a2340",
            }}
          />
        </div>

        {/* 校验提示 */}
        {!canGenerate && (personName || lifeStage || timeRange) && (
          <p className="text-xs mb-3 text-center" style={{ color: "#8090b8" }}>
            {!personName.trim() || !lifeStage.trim() || !timeRange.trim()
              ? "请填写名字、阶段名称和时间跨度"
              : "请至少回答一个问题，或在自由记录里写一些内容"}
          </p>
        )}

        {/* preview 说明 */}
        <p className="text-xs text-center mb-4" style={{ color: "#8090b8" }}>
          当前是 preview 体验，点击后展示 mock 结果，不会调用 AI，不会发送你的内容
        </p>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canGenerate
              ? "linear-gradient(135deg, #6b8adc, #5568a0)"
              : "#b0b8d0",
          }}
        >
          预览个人回忆录 ✨
        </button>
      </div>
    </div>
  );
}
