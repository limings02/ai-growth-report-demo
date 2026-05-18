// components/memory/MemoryTimelineSection.tsx
// 通用时间线展示区，使用 MemorySectionCard 容器。

import type { MemoryTimelineItem } from "@/lib/memory-core/types";
import MemorySectionCard from "./MemorySectionCard";

type Props = {
  timeline: MemoryTimelineItem[];
  title?: string;
  emptyHint?: string;
};

export default function MemoryTimelineSection({
  timeline,
  title = "⏱ 时间线",
  emptyHint = "还没有足够材料生成时间线。可以补充具体时间、地点、事件或普通但想保存的日常。",
}: Props) {
  if (timeline.length === 0) {
    return (
      <MemorySectionCard title={title}>
        <p className="text-xs" style={{ color: "#9d7b72" }}>
          {emptyHint}
        </p>
      </MemorySectionCard>
    );
  }

  return (
    <MemorySectionCard title={title}>
      <div className="relative pl-4">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "linear-gradient(to bottom, #f4b8a0, #fde8dc)" }}
        />
        <div className="space-y-5">
          {timeline.map((item, i) => (
            <div key={i} className="relative flex gap-4">
              <div
                className="flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm mt-0.5"
                style={{ background: "#e8836a", marginLeft: "-2px" }}
              />
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#fde8dc", color: "#c0674a" }}
                  >
                    {item.time}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "#2d1f1a" }}>
                    {item.title}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#9d7b72" }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MemorySectionCard>
  );
}
