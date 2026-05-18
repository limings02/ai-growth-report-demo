// components/memory/MemoryUsageTipsSection.tsx
// 通用"保存与使用建议"展示区。

import MemorySectionCard from "./MemorySectionCard";

type Props = {
  title?: string;
  primaryTip: string;
  secondaryTip?: string;
};

export default function MemoryUsageTipsSection({
  title = "💌 保存与使用建议",
  primaryTip,
  secondaryTip,
}: Props) {
  return (
    <MemorySectionCard title={title}>
      <p className="text-xs leading-relaxed" style={{ color: "#7a5a52" }}>
        {primaryTip}
      </p>
      {secondaryTip && (
        <p className="text-xs leading-relaxed mt-2" style={{ color: "#9d7b72" }}>
          {secondaryTip}
        </p>
      )}
    </MemorySectionCard>
  );
}
