// components/memory/MemoryLongFormSection.tsx
// 通用长文内容展示区（信件、纪念文等）。

import type { MemoryLongFormText } from "@/lib/memory-core/types";

type Props = {
  longFormText: MemoryLongFormText;
  fallbackTitle?: string;
};

export default function MemoryLongFormSection({
  longFormText,
  fallbackTitle = "写给未来的话",
}: Props) {
  if (!longFormText.content) return null;

  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{
        background: "#fffdf9",
        border: "1px solid #f0ddd5",
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, #f5e8e0 27px, #f5e8e0 28px)",
        backgroundSize: "100% 28px",
        backgroundPositionY: "40px",
      }}
    >
      <p className="text-xs font-semibold mb-3 relative z-10" style={{ color: "#9d7b72" }}>
        ✉️ {longFormText.title || fallbackTitle}
      </p>
      <p
        className="text-sm leading-loose whitespace-pre-line relative z-10"
        style={{ color: "#3d2c2c", fontFamily: "'PingFang SC', 'Hiragino Sans GB', serif" }}
      >
        {longFormText.content}
      </p>
    </div>
  );
}
