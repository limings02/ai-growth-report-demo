"use client";

import { useState } from "react";
import { AppState, GrowthReportFormData, InterviewQuestion, ReportData } from "@/lib/types";
import { generateMockReport } from "@/lib/mockReportGenerator";
import ChildInfoForm from "./ChildInfoForm";
import PhotoUploader from "./PhotoUploader";
import InterviewForm from "./InterviewForm";

// 默认问题列表（仅作引导示例，用户可全部删改）
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
  return labels.map((label, i) => ({
    id: `default-${i}`,
    label,
    answer: "",
  }));
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
  const [report, setReport] = useState<ReportData | null>(null);

  function handleFormChange(patch: Partial<GrowthReportFormData>) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  function handleGenerate() {
    setAppState("generating");
    setTimeout(() => {
      const result = generateMockReport(formData);
      setReport(result);
      setAppState("result");
    }, 2000);
  }

  // 校验：只要填了昵称、年龄、称呼就可以生成
  function isFormValid(): boolean {
    return (
      formData.childName.trim() !== "" &&
      formData.childAge !== "" &&
      formData.parentName.trim() !== ""
    );
  }

  if (appState === "generating") {
    return <GeneratingScreen />;
  }

  if (appState === "result" && report) {
    return (
      <div className="min-h-screen px-4 py-10" style={{ background: "var(--background)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setAppState("input")}
              className="text-sm cursor-pointer hover:underline"
              style={{ color: "var(--text-muted)" }}>
              ← 返回修改
            </button>
          </div>

          {/* 标题 */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            🎉 {report.title}
          </h2>

          {/* 关键词 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>✨ 年度关键词</p>
            <div className="flex flex-wrap gap-2">
              {report.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full text-sm"
                  style={{ background: "#fde8dc", color: "#c0674a" }}>{kw}</span>
              ))}
            </div>
          </div>

          {/* 成长总结 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>💛 年度成长总结</p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--foreground)" }}>
              {report.yearlySummary}
            </p>
          </div>

          {/* 时间线 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>⏱ 重要瞬间</p>
            <div className="space-y-3">
              {report.timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold h-fit"
                    style={{ background: "#f4b8a0", color: "#8b4a38" }}>{item.time}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 信件 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>✉️ 给孩子的信</p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--foreground)" }}>
              {report.letter}
            </p>
          </div>

          {/* 朋友圈 */}
          <div className="rounded-2xl p-5 mb-10" style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>📱 朋友圈文案</p>
            <div className="space-y-4">
              {report.socialPosts.map((post) => (
                <div key={post.title}>
                  <p className="text-xs font-medium mb-1.5" style={{ color: "#c0674a" }}>— {post.title}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line p-3 rounded-xl"
                    style={{ background: "white", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto">

        {/* 顶部导航 */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBackToLanding}
            className="text-sm cursor-pointer hover:underline"
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

        {/* 生成按钮 */}
        <div className="mt-10 mb-16">
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
              请填写孩子昵称、年龄和父母称呼后即可生成
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
