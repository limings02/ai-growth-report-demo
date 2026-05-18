// components/memory/MemoryFallbackNotice.tsx
// 当 parseMemoryArtifact 返回 fallback artifact 时，展示"生成结果不完整"提示。

type Props = {
  isFallback: boolean;
  onBackToEdit: () => void;
  modeLabel?: string;
};

export default function MemoryFallbackNotice({
  isFallback,
  onBackToEdit,
  modeLabel = "记忆内容",
}: Props) {
  if (!isFallback) return null;

  return (
    <div
      className="rounded-2xl p-4 mb-5 flex gap-3"
      style={{ background: "#fff3e0", border: "1px solid #ffe0b2" }}
    >
      <span className="text-xl flex-shrink-0">⚠️</span>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#e65100" }}>
          这次生成结果不完整
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#bf360c" }}>
          系统没有成功解析出完整的{modeLabel}。你可以返回修改，补充更多具体时间、地点、人物、对话或故事后重新生成。
        </p>
        <button
          onClick={onBackToEdit}
          className="mt-2 text-xs underline cursor-pointer"
          style={{ color: "#e65100" }}
        >
          返回修改 →
        </button>
      </div>
    </div>
  );
}
