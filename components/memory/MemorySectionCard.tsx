// components/memory/MemorySectionCard.tsx
// 通用展示 section 容器，供所有 mode 的 artifact 展示页使用。
// 不含任何 mode-specific 字段。

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function MemorySectionCard({ title, children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl p-5 mb-5 ${className}`}
      style={{ background: "#fffaf7", border: "1px solid #f0ddd5" }}
    >
      <p className="text-xs font-semibold mb-3" style={{ color: "#9d7b72" }}>
        {title}
      </p>
      {children}
    </div>
  );
}
