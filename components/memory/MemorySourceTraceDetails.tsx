// components/memory/MemorySourceTraceDetails.tsx
// 通用内容溯源折叠区，供所有 mode 的 artifact 结果页使用。
// 不含 mode-specific 文案。

import type { MemorySourceTrace } from "@/lib/memory-core/types";

type Props = {
  sourceTrace?: MemorySourceTrace;
};

export default function MemorySourceTraceDetails({ sourceTrace }: Props) {
  if (!sourceTrace) return null;

  return (
    <details className="mb-5">
      <summary
        className="text-xs cursor-pointer px-3 py-2 rounded-xl"
        style={{ color: "#b08878", background: "#f9f5f3" }}
      >
        🔍 查看内容溯源
      </summary>
      <div
        className="mt-2 rounded-xl p-3 text-xs space-y-2"
        style={{ background: "#f5f0ee", color: "#7a5a52" }}
      >
        {sourceTrace.usedQuestions.length > 0 && (
          <div>
            <p className="font-medium mb-1">使用的问题：</p>
            <ul className="space-y-0.5" style={{ color: "#9d7b72" }}>
              {sourceTrace.usedQuestions.map((q, i) => (
                <li key={i}>· {q}</li>
              ))}
            </ul>
          </div>
        )}
        {sourceTrace.missingContext.length > 0 && (
          <div>
            <p className="font-medium mb-1">缺失上下文：</p>
            <ul className="space-y-0.5" style={{ color: "#9d7b72" }}>
              {sourceTrace.missingContext.map((m, i) => (
                <li key={i}>· {m}</li>
              ))}
            </ul>
          </div>
        )}
        {sourceTrace.groundingNotes.length > 0 && (
          <div>
            <p className="font-medium mb-1">内容依据说明：</p>
            <ul className="space-y-0.5" style={{ color: "#9d7b72" }}>
              {sourceTrace.groundingNotes.map((n, i) => (
                <li key={i}>· {n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
