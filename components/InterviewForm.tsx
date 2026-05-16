"use client";

import { GrowthReportFormData } from "@/lib/types";

type Props = {
  formData: GrowthReportFormData;
  onChange: (patch: Partial<GrowthReportFormData>) => void;
};

const questions: { key: keyof GrowthReportFormData; label: string; placeholder: string; required?: boolean }[] = [
  {
    key: "q1",
    label: "今年孩子最大的变化是什么？",
    placeholder: "例如：开始喜欢问问题，变得更有主见了……",
    required: true,
  },
  {
    key: "q2",
    label: "今年最让你印象深刻的一件事是什么？",
    placeholder: "例如：第一次自己背书包去上学那天……",
  },
  {
    key: "q3",
    label: "今年孩子学会了什么新能力？",
    placeholder: "例如：会自己穿鞋了，会骑平衡车了……",
  },
  {
    key: "q4",
    label: "今年孩子说过哪句话让你印象很深？",
    placeholder: "例如：「妈妈，我长大了要保护你。」",
  },
  {
    key: "q5",
    label: "今年有没有一次重要旅行、生日、入学或家庭事件？",
    placeholder: "例如：第一次去海边，上了幼儿园，家里添了小猫……",
  },
  {
    key: "q6",
    label: "今年孩子最喜欢什么？",
    placeholder: "例如：恐龙、画画、《小猪佩奇》、堆积木……",
  },
  {
    key: "q7",
    label: "今年你作为父母最感动的一刻是什么？",
    placeholder: "例如：生病那晚他第一次说「妈妈辛苦了」……",
  },
  {
    key: "q8",
    label: "你想对 18 岁的孩子说什么？",
    placeholder: "例如：希望你永远保留现在这份对世界的好奇……",
  },
];

export default function InterviewForm({ formData, onChange }: Props) {
  return (
    <section className="rounded-3xl p-6 mb-6"
      style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
      <h3 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>
        💬 回答几个问题
      </h3>
      <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        带 <span style={{ color: "#e07a5f" }}>*</span> 为必填，其他题目越详细，年报越丰富
      </p>

      <div className="space-y-5">
        {questions.map((q, idx) => (
          <div key={q.key}>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              <span className="mr-1.5 text-xs px-1.5 py-0.5 rounded font-bold"
                style={{ background: "#fde8dc", color: "#c0674a" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              {q.label}
              {q.required && <span className="ml-1" style={{ color: "#e07a5f" }}>*</span>}
            </label>
            <textarea
              rows={3}
              placeholder={q.placeholder}
              value={formData[q.key] as string}
              onChange={(e) => onChange({ [q.key]: e.target.value })}
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
    </section>
  );
}
