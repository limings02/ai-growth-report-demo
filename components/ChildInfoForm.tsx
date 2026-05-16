"use client";

import { GrowthReportFormData } from "@/lib/types";

type Props = {
  formData: GrowthReportFormData;
  onChange: (patch: Partial<GrowthReportFormData>) => void;
};

const styleOptions = [
  { value: "warm", label: "🌸 温暖", desc: "柔和细腻，像妈妈的日记" },
  { value: "playful", label: "🎈 俏皮", desc: "活泼有趣，像孩子的视角" },
  { value: "documentary", label: "📷 纪实", desc: "真实客观，像成长档案" },
  { value: "literary", label: "🍃 文艺", desc: "诗意隽永，像给未来的信" },
] as const;

export default function ChildInfoForm({ formData, onChange }: Props) {
  return (
    <section className="rounded-3xl p-6 mb-6"
      style={{ background: "#fffaf7", border: "1px solid var(--border)" }}>
      <h3 className="text-base font-bold mb-5" style={{ color: "var(--foreground)" }}>
        📋 基本信息
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* 孩子昵称 */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            孩子昵称 <span style={{ color: "#e07a5f" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="例如：小熊宝、阿橙"
            value={formData.childName}
            onChange={(e) => onChange({ childName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-shadow
              focus:shadow-md"
            style={{
              background: "white",
              border: "1.5px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* 孩子年龄 */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            孩子年龄 <span style={{ color: "#e07a5f" }}>*</span>
          </label>
          <input
            type="number"
            placeholder="例如：3"
            min={0}
            max={18}
            value={formData.childAge}
            onChange={(e) => onChange({ childAge: e.target.value === "" ? "" : Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-shadow
              focus:shadow-md"
            style={{
              background: "white",
              border: "1.5px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* 总结年份 */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            总结年份
          </label>
          <input
            type="number"
            min={2000}
            max={2099}
            value={formData.reportYear}
            onChange={(e) => onChange({ reportYear: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-shadow
              focus:shadow-md"
            style={{
              background: "white",
              border: "1.5px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* 父母称呼 */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            父母称呼 <span style={{ color: "#e07a5f" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="例如：妈妈、爸爸、爸爸妈妈"
            value={formData.parentName}
            onChange={(e) => onChange({ parentName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-shadow
              focus:shadow-md"
            style={{
              background: "white",
              border: "1.5px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {/* 风格选择 */}
      <div>
        <label className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-muted)" }}>
          文案风格
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {styleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ style: opt.value })}
              className="flex flex-col items-start px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer"
              style={{
                border: formData.style === opt.value
                  ? "2px solid var(--primary)"
                  : "1.5px solid var(--border)",
                background: formData.style === opt.value ? "#fde8dc" : "white",
              }}
            >
              <span className="text-sm font-medium mb-0.5" style={{ color: "var(--foreground)" }}>
                {opt.label}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
