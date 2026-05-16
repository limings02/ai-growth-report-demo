"use client";

import { useState } from "react";
import { AppState, GrowthReportFormData, ReportData } from "@/lib/types";
import ChildInfoForm from "./ChildInfoForm";
import PhotoUploader from "./PhotoUploader";
import InterviewForm from "./InterviewForm";

// 表单初始值
const defaultFormData: GrowthReportFormData = {
  childName: "",
  childAge: "",
  reportYear: new Date().getFullYear(),
  parentName: "",
  style: "warm",
  photos: [],
  q1: "", q2: "", q3: "", q4: "",
  q5: "", q6: "", q7: "", q8: "",
};

type Props = {
  onBackToLanding: () => void;
  // 阶段3接入后，这里会传入生成结果的回调
};

export default function GrowthReportApp({ onBackToLanding }: Props) {
  const [appState, setAppState] = useState<AppState>("input");
  const [formData, setFormData] = useState<GrowthReportFormData>(defaultFormData);
  const [_report, setReport] = useState<ReportData | null>(null);

  function handleFormChange(patch: Partial<GrowthReportFormData>) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  function handleGenerate() {
    // 阶段3实现：目前先跳到 generating 状态演示流程
    setAppState("generating");
    setTimeout(() => {
      // 阶段3会在这里调用 generateMockReport(formData)
      setReport(null);
      setAppState("result");
    }, 2000);
  }

  // 简单校验：必填项检查
  function isFormValid(): boolean {
    return (
      formData.childName.trim() !== "" &&
      formData.childAge !== "" &&
      formData.parentName.trim() !== "" &&
      formData.q1.trim() !== ""
    );
  }

  if (appState === "generating") {
    return <GeneratingScreen />;
  }

  if (appState === "result") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ background: "var(--background)" }}>
        <p className="text-2xl mb-4">🎉</p>
        <p className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          成长礼物生成成功！
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          阶段4将在这里展示完整年报
        </p>
        <button
          onClick={() => setAppState("input")}
          className="px-6 py-3 rounded-full text-white cursor-pointer"
          style={{ background: "var(--primary)" }}>
          返回重新填写
        </button>
      </div>
    );
  }

  // input 状态：展示表单
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

        {/* 页面标题 */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          记录孩子这一年 🌱
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          认真填写，AI 会为你生成一份独一无二的成长礼物
        </p>

        {/* 基本信息表单 */}
        <ChildInfoForm formData={formData} onChange={handleFormChange} />

        {/* 照片上传 */}
        <PhotoUploader
          photos={formData.photos}
          onAdd={(items) => handleFormChange({ photos: [...formData.photos, ...items] })}
          onRemove={(id) => {
            const removed = formData.photos.find((p) => p.id === id);
            if (removed) URL.revokeObjectURL(removed.previewUrl); // 释放内存
            handleFormChange({ photos: formData.photos.filter((p) => p.id !== id) });
          }}
        />

        {/* 访谈问题 */}
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
              请至少填写孩子昵称、年龄、父母称呼和第一个问题
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 生成中动画界面
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
