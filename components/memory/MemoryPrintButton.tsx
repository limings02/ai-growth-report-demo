"use client";

// components/memory/MemoryPrintButton.tsx
// 通用浏览器打印按钮，供所有 mode 的 artifact 结果页使用。
//
// 约束：
// - 不使用第三方 PDF 库
// - 不上传数据，不存储数据
// - 打印时自身隐藏（print:hidden）

type Props = {
  label?: string;
};

export default function MemoryPrintButton({ label = "打印 / 保存 PDF" }: Props) {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      onClick={handlePrint}
      className="print:hidden text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all hover:shadow-md active:scale-95"
      style={{ background: "#fde8dc", color: "#c0674a", border: "1px solid #f4b8a0" }}
    >
      🖨️ {label}
    </button>
  );
}
