"use client";

import { useState, useEffect, useRef } from "react";
import { AppState, GrowthReportFormData, InterviewQuestion, RawMaterial, ReportData } from "@/lib/types";
import { extractRawMaterial } from "@/lib/extractRawMaterial";
import { mockGenerator } from "@/lib/mockReportGenerator";
// TODO[ai-api]: 接入真实 AI 时，替换为：
// import { aiGenerator } from "@/lib/aiReportGenerator";
// const generator = aiGenerator;
const generator = mockGenerator;

import ChildInfoForm from "./ChildInfoForm";
import PhotoUploader from "./PhotoUploader";
import InterviewForm from "./InterviewForm";
import ReportPreview from "./ReportPreview";

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
  const [report, setReport] = useState<ReportData | null>(null);
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
      // TODO[ai-api]: 这里切换 generator 即可接入真实 AI，其余代码不变
      const result = await generator.generate(material);
      setReport(result);
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

  if (appState === "result" && report && rawMaterial) {
    return (
      <ReportPreview
        report={report}
        rawMaterial={rawMaterial}
        photos={formData.photos}
        onBack={() => setAppState("input")}
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
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          随心填写，AI 会为你生成一份独一无二的成长礼物
        </p>

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
                : `还需要至少回答 2 个问题（已回答 ${answeredCount} 个）`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function GeneratingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{ background: "var(--background)" }}>
      <div className="text-5xl mb-6 animate-bounce">🌸</div>
      <p className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
        正在生成成长礼物…
      </p>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        AI 正在认真整理孩子的故事，请稍等片刻
      </p>
    </div>
  );
}
