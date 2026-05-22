"use client";

import { useState } from "react";
import { GrowthReportFormData, InterviewQuestion } from "@/lib/types";

type Props = {
  formData: GrowthReportFormData;
  onChange: (patch: Partial<GrowthReportFormData>) => void;
};

// 问题占位提示（按 index 对应，超出则用通用提示）
const placeholders = [
  "例如：开始喜欢问问题，变得更有主见了……",
  "例如：第一次自己背书包去上学那天……",
  "例如：会自己穿鞋了，会骑平衡车了……",
  "例如：「妈妈，我长大了要保护你。」",
  "例如：第一次去海边，上了幼儿园，家里添了小猫……",
  "例如：恐龙、画画、《小猪佩奇》、堆积木……",
  "例如：生病那晚他第一次说「妈妈辛苦了」……",
  "例如：希望你永远保留现在这份对世界的好奇……",
];

// 常驻提示（显示在问题标题下方，帮助用户写出具体内容）
const hints = [
  "可以是很小的变化：开始自己做决定、变得爱问问题、或者突然有了一个固定习惯。",
  "不一定是大事。一次放学路上、一次生病、一次旅行、一次普通的晚饭都可以。",
  "写具体动作会更好，比如第一次自己穿鞋、第一次完整讲一个故事。",
  "原话最珍贵，哪怕只有一句，也会让这份成长册更像 ta。",
  "写发生了什么，也写当时谁在场、孩子是什么反应。",
  "可以是玩具、动画、食物、某个人、某个地方，越具体越好。",
  "不用写得煽情。写那个动作、那个眼神、那句话就够了。",
  "想象 ta 很多年后打开这一页。你最想让 ta 知道，现在的你为什么愿意记录这些。",
];

export default function InterviewForm({ formData, onChange }: Props) {
  // 正在编辑标题的题目 id
  const [editingId, setEditingId] = useState<string | null>(null);

  const questions = formData.questions;

  function updateQuestion(id: string, patch: Partial<InterviewQuestion>) {
    onChange({
      questions: questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    });
  }

  function deleteQuestion(id: string) {
    onChange({ questions: questions.filter((q) => q.id !== id) });
  }

  function addQuestion() {
    const newQ: InterviewQuestion = {
      id: `custom-${Date.now()}`,
      label: "你想记录的问题",
      answer: "",
    };
    onChange({ questions: [...questions, newQ] });
    // 新增后立即进入标题编辑模式
    setEditingId(newQ.id);
  }

  return (
    <section className="rounded-3xl p-6 mb-6"
      style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>

      {/* 区块标题 */}
      <h3 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>
        💬 回答几个问题
      </h3>
      <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        以下问题仅作引导，可以修改标题、删除不想回答的问题，或在底部添加自己的问题。
      </p>

      {/* 问题列表 */}
      <div className="space-y-5">
        {questions.map((q, idx) => (
          <div key={q.id} className="group">

            {/* 问题标题行 */}
            <div className="flex items-start gap-2 mb-1.5">
              {/* 序号 */}
              <span className="flex-shrink-0 mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ background: "#fde8dc", color: "#c0674a" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* 标题：正常态 / 编辑态 */}
              {editingId === q.id ? (
                <input
                  autoFocus
                  type="text"
                  value={q.label}
                  onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  className="flex-1 text-sm font-medium px-2 py-0.5 rounded outline-none"
                  style={{
                    background: "white",
                    border: "1.5px solid var(--primary-light)",
                    color: "var(--foreground)",
                  }}
                />
              ) : (
                <span
                  className="flex-1 text-sm font-medium leading-snug cursor-text
                    hover:underline decoration-dashed underline-offset-2"
                  style={{ color: "var(--foreground)" }}
                  title="点击可修改问题"
                  onClick={() => setEditingId(q.id)}
                >
                  {q.label}
                </span>
              )}

              {/* 操作按钮：编辑 / 删除（hover 显示） */}
              <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="修改问题标题"
                  onClick={() => setEditingId(editingId === q.id ? null : q.id)}
                  className="text-xs px-1.5 py-0.5 rounded cursor-pointer transition-colors hover:bg-white"
                  style={{ color: "var(--text-muted)" }}>
                  ✏️
                </button>
                <button
                  type="button"
                  title="删除这道题"
                  onClick={() => deleteQuestion(q.id)}
                  className="text-xs px-1.5 py-0.5 rounded cursor-pointer transition-colors hover:bg-white"
                  style={{ color: "var(--text-muted)" }}>
                  🗑️
                </button>
              </div>
            </div>

            {/* 常驻 hint */}
            {hints[idx] && (
              <p className="text-xs mb-2 pl-7" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                ✦ {hints[idx]}
              </p>
            )}

            {/* 回答输入框 */}
            <textarea
              rows={3}
              placeholder={placeholders[idx] ?? "写下你的回答……"}
              value={q.answer}
              onChange={(e) => updateQuestion(q.id, { answer: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-shadow
                focus:shadow-md"
              style={{
                background: "white",
                border: "1.5px solid var(--border)",
                color: "var(--foreground)",
                lineHeight: "1.6",
              }}
            />
          </div>
        ))}
      </div>

      {/* 添加问题按钮 */}
      <button
        type="button"
        onClick={addQuestion}
        className="mt-5 w-full py-3 rounded-xl text-sm font-medium cursor-pointer
          border-dashed transition-colors hover:bg-white"
        style={{
          border: "1.5px dashed var(--primary-light)",
          color: "var(--primary)",
          background: "transparent",
        }}>
        + 添加自己的问题
      </button>

      {/* 自由文本区 */}
      <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
          📓 其他想说的话（选填）
        </label>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          可以粘贴日记、育儿备忘录，或者任何你想对宝贝说的话
        </p>
        <textarea
          rows={5}
          placeholder={"例如：\n今年最难忘的是他生病那段时间，虽然辛苦，但每次看到他恢复活力，就觉得一切都值得……\n\n（也可以直接粘贴你的育儿日记）"}
          value={formData.freeNote}
          onChange={(e) => onChange({ freeNote: e.target.value })}
          className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-shadow
            focus:shadow-md"
          style={{
            background: "white",
            border: "1.5px solid var(--border)",
            color: "var(--foreground)",
            lineHeight: "1.7",
          }}
        />
      </div>
    </section>
  );
}
