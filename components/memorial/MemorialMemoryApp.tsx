"use client";

// components/memorial/MemorialMemoryApp.tsx
// memorial mode 主状态机：input → generating → result / error
// Phase 11.2：接入 /api/generate-memorial-memory，返回真实 MemoryArtifact。
//
// 安全边界：
// - 不模拟逝者说话，不做 AI 复活
// - 只处理用户主动填写的文字内容
// - 照片不上传

import { useState } from "react";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import { MEMORIAL_DEFAULT_QUESTIONS } from "@/lib/domains/memorial/defaultQuestions";
import { MOCK_MEMORIAL_ARTIFACT } from "@/lib/domains/memorial/mockArtifact";
import MemoryArtifactPreview from "@/components/memory/MemoryArtifactPreview";
import MemorialMemoryGraphPreview from "./MemorialMemoryGraphPreview";
import ArchiveSaveButton from "@/components/archive/ArchiveSaveButton";

type MemorialScreen = "input" | "generating" | "result" | "error";
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

const isDev = process.env.NODE_ENV === "development";

export default function MemorialMemoryApp({ onBackToLanding, onBackToHome }: Props) {
  const [screen, setScreen] = useState<MemorialScreen>("input");
  const [artifact, setArtifact] = useState<MemoryArtifact | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [deceasedName, setDeceasedName] = useState("");
  const [narratorName, setNarratorName] = useState("");
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
    deceasedName.trim().length > 0 &&
    relation.trim().length > 0 &&
    timeRange.trim().length > 0 &&
    hasContent;

  function handleReset() {
    setArtifact(null);
    setErrorMessage("");
    setDeceasedName("");
    setNarratorName("");
    setRelation("");
    setTimeRange("");
    setStyle("warm");
    setQaList(MEMORIAL_DEFAULT_QUESTIONS.map((q) => ({ question: q.question, answer: "" })));
    setFreeNote("");
    setScreen("input");
  }

  async function handleGenerate() {
    if (!canGenerate) return;

    setScreen("generating");
    setErrorMessage("");

    const payload = {
      deceasedName,
      narratorName: narratorName.trim() || undefined,
      relationship: relation,
      timeRange,
      style,
      photoCount: 0,
      qaList,
      freeNote,
    };

    try {
      const res = await fetch("/api/generate-memorial-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { artifact?: MemoryArtifact; error?: string };

      if (!res.ok || !data.artifact) {
        throw new Error(data?.error || "生成失败，请稍后重试");
      }

      setArtifact(data.artifact);
      setScreen("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "生成失败，请稍后重试");
      setScreen("error");
    }
  }

  // ── 结果页 ────────────────────────────────────────────────────
  if (screen === "result" && artifact) {
    // 低敏来源摘要：不保存 freeNote 原文、不保存完整 qaList 原文
    // 安全边界：保存按钮文案使用通用"保存到本地"，不涉及逝者模拟
    const memorialAnsweredCount = qaList.filter((q) => q.answer.trim()).length;
    const memorialArchiveSource = {
      inputTitle: deceasedName,
      inputSummary: `${relation} · ${timeRange}，${memorialAnsweredCount} 条问答`,
      sourceQuestionCount: memorialAnsweredCount,
      photoCount: 0,
      style,
    };
    return (
      <MemoryArtifactPreview
        artifact={artifact}
        onBackToEdit={() => setScreen("input")}
        onCreateAnother={handleReset}
        onBackToHome={onBackToHome}
        topActionsSlot={
          <ArchiveSaveButton artifact={artifact} mode="memorial" source={memorialArchiveSource} />
        }
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
        usageSecondaryTip="如果想让下一版更贴近真实记忆，可以返回修改，补充更具体的场景、话语、物品、地点和时间节点。"
        graphSlot={<MemorialMemoryGraphPreview graph={artifact.graph} />}
      />
    );
  }

  // ── 生成中 ────────────────────────────────────────────────────
  if (screen === "generating") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ background: "linear-gradient(160deg, #f8f7f4 0%, #f0ece4 100%)" }}
      >
        <div className="text-4xl mb-5">🕯️</div>
        <p className="text-lg font-semibold mb-3" style={{ color: "#2a2520" }}>
          正在整理这份记忆…
        </p>
        <p className="text-sm mb-3 text-center max-w-xs" style={{ color: "#7a7065" }}>
          AI 正在根据你填写的文字整理人生片段、纪念文和记忆图谱。
        </p>
        <div className="w-48 h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "#e0dbd4" }}>
          <div
            className="h-full rounded-full animate-pulse"
            style={{ background: "linear-gradient(90deg, #c8a86a, #8c7d6e)", width: "70%" }}
          />
        </div>
        <p className="text-xs mb-2" style={{ color: "#9a908a" }}>
          这可能需要几十秒，请不要关闭页面。
        </p>
        <p className="text-xs" style={{ color: "#b0a898" }}>
          不会模拟逝者说话，只会整理你主动提供的材料。
        </p>
      </div>
    );
  }

  // ── 错误页 ────────────────────────────────────────────────────
  if (screen === "error") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ background: "linear-gradient(160deg, #f8f7f4 0%, #f0ece4 100%)" }}
      >
        <div className="max-w-md w-full">
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "#fdf5f0", border: "1px solid #e8d8cc" }}
          >
            <div className="text-3xl mb-3">😔</div>
            <p className="text-base font-semibold mb-2" style={{ color: "#8a5a48" }}>
              生成失败了
            </p>
            <p className="text-sm" style={{ color: "#7a7065" }}>
              {errorMessage}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setScreen("input")}
              className="w-full py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all hover:shadow-md"
              style={{ background: "#f0ece6", color: "#5a5248" }}
            >
              ← 返回修改
            </button>
            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-2xl text-white text-sm font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all"
              style={{ background: "linear-gradient(135deg, #8c7d6e, #6e6058)" }}
            >
              重新尝试
            </button>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="w-full py-2 rounded-2xl text-xs cursor-pointer transition-all hover:underline"
                style={{ color: "#9a908a" }}
              >
                回到首页
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 输入页 ────────────────────────────────────────────────────
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
          🕯️ 纪念册
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
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
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
                时间跨度 <span style={{ color: "#c06050" }}>*</span>
              </label>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="例如：1938 - 2021，或你们共同经历的年份"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#f5f2ee", border: "1px solid #d4cfc8", color: "#2a2520" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#5a5248" }}>
                你的称呼（可选）
              </label>
              <input
                type="text"
                value={narratorName}
                onChange={(e) => setNarratorName(e.target.value)}
                placeholder="例如：小敏、大儿子、外孙"
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
        {!canGenerate && (deceasedName || relation || timeRange) && (
          <p className="text-xs mb-3 text-center" style={{ color: "#9a908a" }}>
            {!deceasedName.trim() || !relation.trim() || !timeRange.trim()
              ? "请填写被纪念者称呼、你们的关系和时间跨度"
              : "请至少回答一个问题，或在自由记录里写一些内容"}
          </p>
        )}

        {/* 隐私说明 */}
        <p className="text-xs text-center mb-3" style={{ color: "#9a908a" }}>
          点击生成后，只会发送你填写的文字内容；不会上传照片，不会读取本地文件。
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
          生成纪念册 ✦
        </button>

        {/* 开发预览入口 */}
        {isDev && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setArtifact(MOCK_MEMORIAL_ARTIFACT);
                setErrorMessage("");
                setScreen("result");
              }}
              className="w-full py-2 rounded-2xl text-xs font-medium cursor-pointer transition-all hover:shadow-sm"
              style={{ background: "#f0ece6", color: "#7a7065", border: "1px dashed #c8c0b4" }}
            >
              🔧 开发预览：查看 mock 纪念册
            </button>
            <p className="text-center mt-1" style={{ color: "#9a908a", fontSize: "11px" }}>
              不会调用 DeepSeek，也不会发送当前表单内容，仅用于调试结果页和打印样式。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
