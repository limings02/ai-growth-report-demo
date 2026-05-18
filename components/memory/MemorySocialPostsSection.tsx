"use client";

// components/memory/MemorySocialPostsSection.tsx
// 通用社交分享文案展示区，含复制按钮。

import { useState } from "react";
import type { MemorySocialPost } from "@/lib/memory-core/types";
import MemorySectionCard from "./MemorySectionCard";

type Props = {
  socialPosts: MemorySocialPost[];
  title?: string;
  emptyHint?: string;
};

export default function MemorySocialPostsSection({
  socialPosts,
  title = "📱 分享文案",
  emptyHint = "这次没有生成分享文案。可以补充更具体的场景、想表达的情绪或分享用途后重新生成。",
}: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  function handleCopy(content: string, idx: number) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  if (socialPosts.length === 0) {
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
      <div className="space-y-3">
        {socialPosts.map((post, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid #f0ddd5" }}
          >
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ background: "#fde8dc" }}
            >
              <span className="text-xs font-semibold" style={{ color: "#c0674a" }}>
                {post.title}
              </span>
              <button
                onClick={() => handleCopy(post.content, i)}
                className="print:hidden text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all"
                style={{
                  background: copiedIdx === i ? "#e8836a" : "white",
                  color: copiedIdx === i ? "white" : "#c0674a",
                }}
              >
                {copiedIdx === i ? "✓ 已复制" : "复制"}
              </button>
            </div>
            <p
              className="text-xs leading-relaxed p-3 whitespace-pre-line"
              style={{ background: "white", color: "#2d1f1a" }}
            >
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </MemorySectionCard>
  );
}
