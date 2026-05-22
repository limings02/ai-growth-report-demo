"use client";

import { useState, useEffect, useRef } from "react";
import { AppState, GrowthReportFormData, InterviewQuestion, RawMaterial } from "@/lib/types";
import { extractRawMaterial } from "@/lib/extractRawMaterial";
import type { MemoryArtifact } from "@/lib/memory-core/types";
import { aiGenerator } from "@/lib/aiReportGenerator";
// 本地无 API Key 时可切换回 mock（mock 仍返回 ReportData，需临时适配）：
// import { mockGenerator } from "@/lib/mockReportGenerator";
// const generator = mockGenerator;
const generator = aiGenerator;

import ChildInfoForm from "./ChildInfoForm";
import PhotoUploader from "./PhotoUploader";
import InterviewForm from "./InterviewForm";
import FamilyArtifactPreview from "@/components/family/FamilyArtifactPreview";
import InputComfortNote from "@/components/memory/InputComfortNote";

function makeDefaultQuestions(): InterviewQuestion[] {
  const labels = [
    "今年孩子最大的变化是什么？",
    "今年最让你印象深刻的一件事是什么？",
    "今年孩子学会了什么新能力？",
    "今年孩子说过哪句话让你印象很深？",
    "今年有没有一次重要旅行、生日、入学或家庭事件？",
    "今年孩子最喜欢什么？",
    "今年你作为父母最感动的一刻是什么？",
    "你想对 18 岁的孩子说什么？",
  ];
  return labels.map((label, i) => ({ id: `default-${i}`, label, answer: "" }));
}

const defaultFormData: GrowthReportFormData = {
  childName: "",
  childAge: "",
  reportYear: new Date().getFullYear(),
  parentName: "",
  style: "warm",
  photos: [],
  questions: makeDefaultQuestions(),
  freeNote: "",
};

type Props = {
  onBackToLanding: () => void;
};

export default function GrowthReportApp({ onBackToLanding }: Props) {
  const [appState, setAppState] = useState<AppState>("input");
  const [formData, setFormData] = useState<GrowthReportFormData>(defaultFormData);

  // 原始材料与生成结果分开存储
  const [rawMaterial, setRawMaterial] = useState<RawMaterial | null>(null);
  const [artifact, setArtifact] = useState<MemoryArtifact | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // 始终持有最新 photos 引用，供卸载清理使用
  const photosRef = useRef(formData.photos);
  useEffect(() => {
    photosRef.current = formData.photos;
  }, [formData.photos]);

  function handleFormChange(patch: Partial<GrowthReportFormData>) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  async function handleGenerate() {
    setGenerateError(null);
    setAppState("generating");

    // 提取原始材料（和 File 对象解耦，可序列化/传给 AI）
    const material = extractRawMaterial(formData);
    setRawMaterial(material);

    try {
      const result = await generator.generate(material);
      setArtifact(result);
      setAppState("result");
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "生成失败，请重试");
      setAppState("input");
    }
  }

  // 至少回答 2 道访谈问题
  const answeredCount = formData.questions.filter((q) => q.answer.trim() !== "").length;

  function isFormValid(): boolean {
    return (
      formData.childName.trim() !== "" &&
      formData.childAge !== "" &&
      formData.parentName.trim() !== "" &&
      answeredCount >= 2
    );
  }

  // 组件卸载时释放所有照片 objectURL，防止内存泄漏
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []); // 空依赖：只在卸载时执行，通过 ref 拿到最新列表

  if (appState === "generating") {
    return <GeneratingScreen />;
  }

  if (appState === "result" && artifact && rawMaterial) {
    return (
      <FamilyArtifactPreview
        artifact={artifact}
        rawMaterial={rawMaterial}
        photos={formData.photos}
        onBackToEdit={() => setAppState("input")}
        onCreateAnother={() => {
          setArtifact(null);
          setRawMaterial(null);
          setFormData(defaultFormData);
          setAppState("input");
        }}
        onBackToHome={onBackToLanding}
      />
    );
  }

  // input 状态
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBackToLanding} className="text-sm cursor-pointer hover:underline"
            style={{ color: "var(--text-muted)" }}>
            ← 返回首页
          </button>
          <span style={{ color: "var(--border)" }}>|</span>
          <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>
            填写孩子的故事
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          记录孩子这一年 🌱
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          随心填写，AI 会为你生成一份独一无二的成长礼物
        </p>

        <InputComfortNote mode="family" variant="hero" />

        {generateError && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm"
            style={{ background: "#fff0ee", color: "#c0674a", border: "1px solid #fcd5c0" }}>
            ⚠️ {generateError}
          </div>
        )}

        <ChildInfoForm formData={formData} onChange={handleFormChange} />
        <PhotoUploader
          photos={formData.photos}
          onAdd={(items) => handleFormChange({ photos: [...formData.photos, ...items] })}
          onRemove={(id) => {
            const removed = formData.photos.find((p) => p.id === id);
            if (removed) URL.revokeObjectURL(removed.previewUrl);
            handleFormChange({ photos: formData.photos.filter((p) => p.id !== id) });
          }}
        />
        <InterviewForm formData={formData} onChange={handleFormChange} />

        <div className="mt-10 mb-16">
          {/* 无照片温和提示 */}
          {formData.photos.length === 0 && (
            <p className="text-center text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              📷 也可以先不上传照片，但加入照片会让这份礼物更完整
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={!isFormValid()}
            className="w-full py-4 rounded-full text-white text-base font-semibold shadow-md
              transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
              hover:shadow-lg hover:scale-[1.01] active:scale-95"
            style={{ background: "linear-gradient(135deg, #e8836a, #e07a5f)" }}>
            生成成长礼物 ✨
          </button>

          {!isFormValid() && (
            <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              {formData.childName.trim() === "" || formData.childAge === "" || formData.parentName.trim() === ""
                ? "请填写孩子昵称、年龄和父母称呼"
                : `先写一点也可以——再回答 ${Math.max(0, 2 - answeredCount)} 个问题就能生成初版（已回答 ${answeredCount} 个）`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 动态等待提示，按时间段切换文案，让用户感知进度
const WAIT_STAGES = [
  { after: 0,   text: "AI 正在读取你写下的故事…" },
  { after: 8,   text: "正在整理年度关键词和成长总结…" },
  { after: 20,  text: "正在为孩子写一封信…" },
  { after: 35,  text: "正在生成时间线和朋友圈文案…" },
  { after: 55,  text: "快好了，正在做最后的整理…" },
  { after: 75,  text: "生成内容较长，请再耐心等一下…" },
  { after: 100, text: "马上就好，DeepSeek 正在认真写最后几段…" },
];

function GeneratingScreen() {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStage = [...WAIT_STAGES]
    .reverse()
    .find((s) => elapsed >= s.after) ?? WAIT_STAGES[0];

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{ background: "var(--background)" }}>
      <div className="text-5xl mb-6 animate-bounce">🌸</div>

      <p className="text-lg font-semibold mb-3" style={{ color: "var(--foreground)" }}>
        正在生成成长礼物…
      </p>

      {/* 动态阶段文案 */}
      <p className="text-sm mb-6 transition-all" style={{ color: "var(--text-muted)" }}>
        {currentStage.text}
      </p>

      {/* 进度条：最长按 90 秒满格 */}
      <div className="w-48 h-1.5 rounded-full overflow-hidden mb-3"
        style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            background: "linear-gradient(90deg, #f4b8a0, #e8836a)",
            width: `${Math.min((elapsed / 120) * 100, 95)}%`,
          }}
        />
      </div>

      {/* 经过时间 */}
      <p className="text-xs" style={{ color: "var(--border)" }}>
        已等待 {elapsed} 秒
      </p>
    </div>
  );
}
