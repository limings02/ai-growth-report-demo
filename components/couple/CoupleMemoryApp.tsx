"use client";

// components/couple/CoupleMemoryApp.tsx
// Couple mode 主状态机（Phase 8.2）。
//
// 状态：input → generating → result / error
// - input：填写表单
// - generating：调用 /api/generate-couple-memory
// - result：展示 CoupleArtifactPreview
// - error：展示错误卡片，可返回修改
//
// 隐私约束：
// - 不读取微信数据库，不自动导入聊天记录
// - chatText 由用户主动粘贴
// - 照片只记录数量，不上传

import { useState } from "react";
import type { CoupleRawInput } from "@/lib/domains/couple/adapter";
import {
  DEFAULT_COUPLE_QUESTIONS,
  type CoupleQuestion,
} from "@/lib/domains/couple/defaultQuestions";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import CoupleArtifactPreview from "./CoupleArtifactPreview";
import { MOCK_COUPLE_ARTIFACT } from "@/lib/domains/couple/mockArtifact";
import InputComfortNote from "@/components/memory/InputComfortNote";

type CoupleStyle = CoupleRawInput["style"];
type CoupleAppStatus = "input" | "generating" | "result" | "error";

type CoupleFormState = {
  partnerAName: string;
  partnerBName: string;
  relationshipTimeRange: string;
  anniversaryDate: string;
  style: CoupleStyle;
  photoCount: number;
  chatText: string;
  questions: CoupleQuestion[];
  freeNote: string;
};

type Props = {
  onBackToLanding: () => void;
  onBackToHome?: () => void;
};

const STYLE_OPTIONS: { value: CoupleStyle; label: string }[] = [
  { value: "romantic", label: "🌹 浪漫温情" },
  { value: "documentary", label: "📷 纪实风格" },
  { value: "playful", label: "🎈 俏皮活泼" },
  { value: "literary", label: "🍃 文艺清淡" },
];

export default function CoupleMemoryApp({ onBackToLanding, onBackToHome }: Props) {
  const [status, setStatus] = useState<CoupleAppStatus>("input");
  const [artifact, setArtifact] = useState<MemoryArtifact | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [form, setForm] = useState<CoupleFormState>({
    partnerAName: "",
    partnerBName: "",
    relationshipTimeRange: "",
    anniversaryDate: "",
    style: "romantic",
    photoCount: 0,
    chatText: "",
    questions: DEFAULT_COUPLE_QUESTIONS,
    freeNote: "",
  });

  function handleAnswerChange(id: string, answer: string) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, answer } : q
      ),
    }));
  }

  const answeredCount = form.questions.filter((q) => q.answer.trim()).length;
  const chatLength = form.chatText.length;

  // 表单有效性：基本信息 + 至少一条内容 + chatText 未超长
  const isFormBasicValid =
    form.partnerAName.trim() !== "" &&
    form.partnerBName.trim() !== "" &&
    form.relationshipTimeRange.trim() !== "";
  const hasContent =
    form.chatText.trim() !== "" ||
    form.freeNote.trim() !== "" ||
    answeredCount >= 1;
  const isChatTooLong = chatLength > 12000;
  const isFormValid = isFormBasicValid && hasContent && !isChatTooLong;

  // 开发预览入口：只在 NODE_ENV=development 时显示，不会出现在生产环境
  const isDev = process.env.NODE_ENV === "development";

  async function handleGenerate() {
    if (!isFormValid) return;

    setStatus("generating");
    setErrorMessage("");

    const input: CoupleRawInput = {
      partnerAName: form.partnerAName,
      partnerBName: form.partnerBName,
      relationshipTimeRange: form.relationshipTimeRange,
      anniversaryDate: form.anniversaryDate || undefined,
      style: form.style,
      photoCount: form.photoCount,
      chatText: form.chatText || undefined,
      qaList: form.questions
        .filter((q) => q.answer.trim())
        .map((q) => ({ question: q.label, answer: q.answer })),
      freeNote: form.freeNote,
    };

    try {
      const response = await fetch("/api/generate-couple-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = (await response.json()) as { artifact?: MemoryArtifact; error?: string };

      if (!response.ok || !data.artifact) {
        setErrorMessage(data.error ?? "生成失败，请稍后重试");
        setStatus("error");
        return;
      }

      setArtifact(data.artifact);
      setStatus("result");
    } catch {
      setErrorMessage("网络错误，请检查网络连接后重试");
      setStatus("error");
    }
  }

  // ── 结果页 ────────────────────────────────────────────────────
  if (status === "result" && artifact) {
    // 低敏来源摘要：不保存 chatText / freeNote 原文
    const coupleArchiveSource = {
      inputTitle: `${form.partnerAName || "我"} & ${form.partnerBName || "TA"}`,
      inputSummary: `${form.relationshipTimeRange}，${answeredCount} 条问答，${form.photoCount} 张照片`,
      sourceQuestionCount: answeredCount,
      photoCount: form.photoCount,
      style: form.style,
    };
    return (
      <CoupleArtifactPreview
        artifact={artifact}
        source={coupleArchiveSource}
        onBackToEdit={() => setStatus("input")}
        onCreateAnother={() => {
          setArtifact(null);
          setErrorMessage("");
          setStatus("input");
        }}
        onBackToHome={onBackToHome}
      />
    );
  }

  // ── 生成中 ────────────────────────────────────────────────────
  if (status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ background: "#fffaf7" }}>
        <div className="text-4xl mb-5 animate-bounce">💑</div>
        <p className="text-lg font-semibold mb-3" style={{ color: "#2d1f1a" }}>
          正在整理你们的故事…
        </p>
        <p className="text-sm mb-6" style={{ color: "#9d7b72" }}>
          正在整理你们的聊天、问答和故事
        </p>
        <div className="w-48 h-1.5 rounded-full overflow-hidden mb-3"
          style={{ background: "#f0ddd5" }}>
          <div className="h-full rounded-full animate-pulse"
            style={{ background: "linear-gradient(90deg, #f4b8a0, #e8836a)", width: "70%" }} />
        </div>
        <p className="text-xs" style={{ color: "#c0a090" }}>
          请不要关闭页面
        </p>
      </div>
    );
  }

  // ── 错误页 ────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ background: "#fffaf7" }}>
        <div className="max-w-md w-full">
          <div className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "#fff0ee", border: "1px solid #fcd5c0" }}>
            <div className="text-3xl mb-3">😔</div>
            <p className="text-base font-semibold mb-2" style={{ color: "#c0674a" }}>
              生成遇到了问题
            </p>
            <p className="text-sm" style={{ color: "#9d7b72" }}>
              {errorMessage}
            </p>
          </div>
          <button
            onClick={() => setStatus("input")}
            className="w-full py-3 rounded-full text-white text-sm font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
          >
            ← 返回修改
          </button>
        </div>
      </div>
    );
  }

  // ── 输入页 ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#fffaf7" }}>
      {/* 顶部导航 */}
      <div
        className="sticky top-0 z-20 px-5 py-3"
        style={{
          background: "rgba(255, 250, 247, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #f0ddd5",
        }}
      >
        <button
          onClick={onBackToLanding}
          className="text-sm cursor-pointer hover:underline flex items-center gap-1"
          style={{ color: "#9d7b72" }}
        >
          ← 返回恋爱纪念册介绍
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 标题区 */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: "#fde8dc", color: "#c0674a" }}
          >
            <span>💑</span>
            <span>恋爱纪念册</span>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#2d1f1a" }}>
            把你们的故事，整理成一本纪念册
          </h2>
          <p className="text-sm mb-4" style={{ color: "#9d7b72" }}>
            填写关系信息、粘贴聊天片段、回答几个问题，AI 会帮你生成恋爱时间线和周年纪念信。
          </p>
          <InputComfortNote mode="couple" variant="hero" />
        </div>

        {/* ── 基本信息 ── */}
        <section className="mb-6">
          <SectionCard title="💑 你们的信息">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#7a5a52" }}>
                  你的昵称
                </label>
                <input
                  type="text"
                  placeholder="如：小A"
                  value={form.partnerAName}
                  onChange={(e) => setForm((p) => ({ ...p, partnerAName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#7a5a52" }}>
                  TA 的昵称
                </label>
                <input
                  type="text"
                  placeholder="如：小B"
                  value={form.partnerBName}
                  onChange={(e) => setForm((p) => ({ ...p, partnerBName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a" }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1" style={{ color: "#7a5a52" }}>
                在一起的时间跨度
              </label>
              <input
                type="text"
                placeholder="如：2021.06 - 至今"
                value={form.relationshipTimeRange}
                onChange={(e) => setForm((p) => ({ ...p, relationshipTimeRange: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a" }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1" style={{ color: "#7a5a52" }}>
                纪念日（可选）
              </label>
              <input
                type="text"
                placeholder="如：2021.06.18"
                value={form.anniversaryDate}
                onChange={(e) => setForm((p) => ({ ...p, anniversaryDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#7a5a52" }}>
                文案风格
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm((p) => ({ ...p, style: opt.value }))}
                    className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all"
                    style={
                      form.style === opt.value
                        ? { background: "#e8836a", color: "white" }
                        : { background: "#fde8dc", color: "#c0674a", border: "1px solid #f4b8a0" }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>
        </section>

        {/* ── 照片说明 ── */}
        <section className="mb-6">
          <SectionCard title="📸 照片">
            <p className="text-xs mb-3" style={{ color: "#9d7b72" }}>
              照片上传能力后续接入。当前只记录数量，照片不上传服务器，不传给 AI。
            </p>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium" style={{ color: "#7a5a52" }}>
                大概有几张照片？
              </label>
              <input
                type="number"
                min={0}
                value={form.photoCount}
                onChange={(e) => setForm((p) => ({ ...p, photoCount: Math.max(0, Number(e.target.value)) }))}
                className="w-20 px-3 py-1.5 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a" }}
              />
              <span className="text-xs" style={{ color: "#b08878" }}>张</span>
            </div>
          </SectionCard>
        </section>

        {/* ── 聊天文本 ── */}
        <section className="mb-6">
          <SectionCard title="💬 聊天片段（可选）">
            <p className="text-xs mb-3" style={{ color: "#9d7b72" }}>
              可以粘贴一小段你们想保存的聊天记录。不读取微信数据库，只处理你主动粘贴的文本。
            </p>
            <textarea
              rows={6}
              placeholder="粘贴一段有代表性的聊天记录，或者你们互发过的话……"
              value={form.chatText}
              onChange={(e) => setForm((p) => ({ ...p, chatText: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a", lineHeight: 1.7 }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: chatLength > 5000 ? "#c0674a" : "#b08878" }}>
                已输入 {chatLength} 字
              </span>
              {chatLength > 5000 && (
                <span className="text-xs" style={{ color: "#c0674a" }}>
                  建议先粘贴最有代表性的片段
                </span>
              )}
            </div>
          </SectionCard>
        </section>

        {/* ── 访谈问题 ── */}
        <section className="mb-6">
          <SectionCard title={`💬 关于你们（已回答 ${answeredCount} / ${form.questions.length}）`}>
            <div className="space-y-5">
              {form.questions.map((q, idx) => (
                <div key={q.id}>
                  <p className="text-xs font-medium mb-1.5 flex items-start gap-1.5">
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0"
                      style={{ background: "#fde8dc", color: "#c0674a" }}
                    >
                      Q{idx + 1}
                    </span>
                    <span style={{ color: "#7a5a52" }}>{q.label}</span>
                  </p>
                  {q.hint && (
                    <p className="text-xs mb-1.5 pl-1" style={{ color: "#b08878" }}>
                      ✦ {q.hint}
                    </p>
                  )}
                  <textarea
                    rows={3}
                    placeholder="可以写具体的细节……"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                    style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a", lineHeight: 1.7 }}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </section>

        {/* ── 自由记录 ── */}
        <section className="mb-8">
          <SectionCard title="📓 自由记录（可选）">
            <p className="text-xs mb-3" style={{ color: "#9d7b72" }}>
              可以写纪念日、旅行、约定、想对对方说的话……
            </p>
            <textarea
              rows={4}
              placeholder="随心写，什么都可以……"
              value={form.freeNote}
              onChange={(e) => setForm((p) => ({ ...p, freeNote: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ border: "1px solid #f0ddd5", background: "white", color: "#2d1f1a", lineHeight: 1.7 }}
            />
          </SectionCard>
        </section>

        {/* ── 生成按钮 ── */}
        <div className="mb-6">
          {!isFormBasicValid && (
            <p className="text-center text-xs mb-3" style={{ color: "#b08878" }}>
              请填写两人昵称和在一起的时间跨度
            </p>
          )}
          {isFormBasicValid && !hasContent && (
            <p className="text-center text-xs mb-3" style={{ color: "#b08878" }}>
              先写一点也可以——粘贴一段聊天、回答 1 个问题，或写一段自由记录，就能生成初版
            </p>
          )}
          {isChatTooLong && (
            <p className="text-center text-xs mb-3" style={{ color: "#c0674a" }}>
              聊天文本过长。请先粘贴最有代表性的一小段，建议不超过 5000 字。
            </p>
          )}
          {/* 隐私说明（Part H）：不阻断流程，只是小字提示 */}
          <p className="text-center text-xs mb-3" style={{ color: "#b08878" }}>
            点击生成后，只会发送你填写的文字内容；不会读取微信数据库，也不会上传照片。
          </p>
          <button
            onClick={handleGenerate}
            disabled={!isFormValid}
            className="w-full py-4 rounded-full text-white text-base font-semibold shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01] active:scale-95"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}
          >
            生成恋爱纪念册 ✨
          </button>

          {/* 开发预览入口：只在 development 环境显示，生产环境不可见 */}
          {isDev && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  setArtifact(MOCK_COUPLE_ARTIFACT);
                  setErrorMessage("");
                  setStatus("result");
                }}
                className="w-full py-2 rounded-full text-xs font-medium cursor-pointer transition-all hover:shadow-sm"
                style={{
                  background: "#f5f0ee",
                  color: "#9d7b72",
                  border: "1px dashed #c8b8b0",
                }}
              >
                🔧 使用 mock 结果预览（开发用）
              </button>
              <p className="text-center mt-1" style={{ color: "#b08878", fontSize: "11px" }}>
                不会调用 DeepSeek，也不会发送当前表单内容，仅用于调试结果页、星图和打印样式。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "#9d7b72" }}>
        {title}
      </p>
      {children}
    </div>
  );
}
