"use client";

// components/couple/CoupleMemoryApp.tsx
// Couple mode 输入页骨架（Phase 8.1）。
//
// 当前阶段：
// - 收集情侣信息、聊天文本、问答和自由文本
// - 点击"生成"后展示 MemoryRawMaterial JSON 预览（开发验收用途）
// - 不调用 DeepSeek，不调用 /api/generate-report
//
// 下一阶段（Phase 8.2）接入：
// - 真实生成链路（runMemorySkill → couple-memory skill）
// - MemoryArtifact 结果展示

import { useState } from "react";
import {
  coupleRawInputToMemoryRawMaterial,
  type CoupleRawInput,
} from "@/lib/domains/couple/adapter";
import {
  DEFAULT_COUPLE_QUESTIONS,
  type CoupleQuestion,
} from "@/lib/domains/couple/defaultQuestions";
import type { MemoryRawMaterial } from "@/lib/memory-core/types";

type CoupleStyle = CoupleRawInput["style"];

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
};

const STYLE_OPTIONS: { value: CoupleStyle; label: string }[] = [
  { value: "romantic", label: "🌹 浪漫温情" },
  { value: "documentary", label: "📷 纪实风格" },
  { value: "playful", label: "🎈 俏皮活泼" },
  { value: "literary", label: "🍃 文艺清淡" },
];

export default function CoupleMemoryApp({ onBackToLanding }: Props) {
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

  // 开发验收用途：展示转换后的 MemoryRawMaterial JSON
  const [previewMaterial, setPreviewMaterial] =
    useState<MemoryRawMaterial | null>(null);

  function handleAnswerChange(id: string, answer: string) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, answer } : q
      ),
    }));
  }

  function handlePreview() {
    const memoryMaterial = coupleRawInputToMemoryRawMaterial({
      partnerAName: form.partnerAName,
      partnerBName: form.partnerBName,
      relationshipTimeRange: form.relationshipTimeRange,
      anniversaryDate: form.anniversaryDate || undefined,
      style: form.style,
      photoCount: form.photoCount,
      chatText: form.chatText,
      qaList: form.questions
        .filter((q) => q.answer.trim())
        .map((q) => ({ question: q.label, answer: q.answer })),
      freeNote: form.freeNote,
    });
    setPreviewMaterial(memoryMaterial);
  }

  const answeredCount = form.questions.filter((q) => q.answer.trim()).length;
  const chatLength = form.chatText.length;
  const isFormBasicValid =
    form.partnerAName.trim() !== "" &&
    form.partnerBName.trim() !== "" &&
    form.relationshipTimeRange.trim() !== "";

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background, #fffaf7)" }}
    >
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
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "#2d1f1a" }}
          >
            把你们的故事，整理成一本纪念册
          </h2>
          <p className="text-sm" style={{ color: "#9d7b72" }}>
            填写关系信息、粘贴聊天片段、回答几个问题，AI
            会帮你生成恋爱时间线和周年纪念信。
          </p>
          <p
            className="text-xs mt-2 px-3 py-1.5 rounded-lg inline-block"
            style={{ background: "#fff0ee", color: "#c0674a" }}
          >
            ⚡ AI 生成能力下一阶段接入，当前展示输入预览
          </p>
        </div>

        {/* ── 基本信息 ── */}
        <section className="mb-6">
          <SectionCard title="💑 你们的信息">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#7a5a52" }}
                >
                  你的昵称
                </label>
                <input
                  type="text"
                  placeholder="如：小A"
                  value={form.partnerAName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, partnerAName: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    border: "1px solid #f0ddd5",
                    background: "white",
                    color: "#2d1f1a",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "#7a5a52" }}
                >
                  TA 的昵称
                </label>
                <input
                  type="text"
                  placeholder="如：小B"
                  value={form.partnerBName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, partnerBName: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    border: "1px solid #f0ddd5",
                    background: "white",
                    color: "#2d1f1a",
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#7a5a52" }}
              >
                在一起的时间跨度
              </label>
              <input
                type="text"
                placeholder="如：2021.06 - 至今"
                value={form.relationshipTimeRange}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    relationshipTimeRange: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{
                  border: "1px solid #f0ddd5",
                  background: "white",
                  color: "#2d1f1a",
                }}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#7a5a52" }}
              >
                纪念日（可选）
              </label>
              <input
                type="text"
                placeholder="如：2021.06.18"
                value={form.anniversaryDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, anniversaryDate: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{
                  border: "1px solid #f0ddd5",
                  background: "white",
                  color: "#2d1f1a",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "#7a5a52" }}
              >
                文案风格
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setForm((p) => ({ ...p, style: opt.value }))
                    }
                    className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all"
                    style={
                      form.style === opt.value
                        ? {
                            background: "var(--primary, #e8836a)",
                            color: "white",
                          }
                        : {
                            background: "#fde8dc",
                            color: "#c0674a",
                            border: "1px solid #f4b8a0",
                          }
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
              照片上传能力后续接入。当前只记录数量，照片不上传服务器，不传给
              AI。
            </p>
            <div className="flex items-center gap-3">
              <label
                className="text-xs font-medium"
                style={{ color: "#7a5a52" }}
              >
                大概有几张照片？
              </label>
              <input
                type="number"
                min={0}
                value={form.photoCount}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    photoCount: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="w-20 px-3 py-1.5 rounded-xl text-sm outline-none"
                style={{
                  border: "1px solid #f0ddd5",
                  background: "white",
                  color: "#2d1f1a",
                }}
              />
              <span className="text-xs" style={{ color: "#b08878" }}>
                张
              </span>
            </div>
          </SectionCard>
        </section>

        {/* ── 聊天文本 ── */}
        <section className="mb-6">
          <SectionCard title="💬 聊天片段（可选）">
            <p className="text-xs mb-3" style={{ color: "#9d7b72" }}>
              可以粘贴一小段你们想保存的聊天记录。MVP
              阶段不读取微信数据库，只处理你主动粘贴的文本。
            </p>
            <textarea
              rows={6}
              placeholder="粘贴一段有代表性的聊天记录，或者你们互发过的话……"
              value={form.chatText}
              onChange={(e) =>
                setForm((p) => ({ ...p, chatText: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{
                border: "1px solid #f0ddd5",
                background: "white",
                color: "#2d1f1a",
                lineHeight: 1.7,
              }}
            />
            <div className="flex justify-between mt-1">
              <span
                className="text-xs"
                style={{ color: chatLength > 5000 ? "#c0674a" : "#b08878" }}
              >
                已输入 {chatLength} 字
              </span>
              {chatLength > 5000 && (
                <span className="text-xs" style={{ color: "#c0674a" }}>
                  建议先粘贴最有代表性的片段，后续会做长聊天记录分段处理
                </span>
              )}
            </div>
          </SectionCard>
        </section>

        {/* ── 访谈问题 ── */}
        <section className="mb-6">
          <SectionCard
            title={`💬 关于你们（已回答 ${answeredCount} / ${form.questions.length}）`}
          >
            <div className="space-y-5">
              {form.questions.map((q, idx) => (
                <div key={q.id}>
                  <p
                    className="text-xs font-medium mb-1.5 flex items-start gap-1.5"
                  >
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0"
                      style={{ background: "#fde8dc", color: "#c0674a" }}
                    >
                      Q{idx + 1}
                    </span>
                    <span style={{ color: "#7a5a52" }}>{q.label}</span>
                  </p>
                  <textarea
                    rows={3}
                    placeholder="可以写具体的细节……"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                    style={{
                      border: "1px solid #f0ddd5",
                      background: "white",
                      color: "#2d1f1a",
                      lineHeight: 1.7,
                    }}
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
              onChange={(e) =>
                setForm((p) => ({ ...p, freeNote: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{
                border: "1px solid #f0ddd5",
                background: "white",
                color: "#2d1f1a",
                lineHeight: 1.7,
              }}
            />
          </SectionCard>
        </section>

        {/* ── 生成按钮 ── */}
        <div className="mb-6">
          {!isFormBasicValid && (
            <p
              className="text-center text-xs mb-3"
              style={{ color: "#b08878" }}
            >
              请填写两人昵称和在一起的时间跨度
            </p>
          )}
          <button
            onClick={handlePreview}
            disabled={!isFormBasicValid}
            className="w-full py-4 rounded-full text-white text-base font-semibold shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01] active:scale-95"
            style={{
              background: "linear-gradient(135deg, #e8836a, #e07a5f)",
            }}
          >
            生成恋爱纪念册（下一阶段接入）✨
          </button>
          <p
            className="text-center text-xs mt-2"
            style={{ color: "#b08878" }}
          >
            当前点击后展示 MemoryRawMaterial 预览，AI 生成下一阶段接入
          </p>
        </div>

        {/* ── 开发验收：MemoryRawMaterial JSON 预览 ── */}
        {previewMaterial && (
          <section className="mb-8">
            <SectionCard title="🔧 DEV · MemoryRawMaterial 预览">
              <p className="text-xs mb-2" style={{ color: "#9d7b72" }}>
                下方是当前输入转换后的 MemoryRawMaterial JSON，用于验证
                adapter。AI 生成接入后可移除此区域。
              </p>
              <pre
                className="text-xs p-3 rounded-xl overflow-auto"
                style={{
                  background: "#f5f0ee",
                  color: "#5a3d35",
                  maxHeight: "400px",
                  lineHeight: 1.6,
                }}
              >
                {JSON.stringify(previewMaterial, null, 2)}
              </pre>
            </SectionCard>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
    >
      <p
        className="text-xs font-semibold mb-3"
        style={{ color: "#9d7b72" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
