"use client";

import { useState } from "react";

export default function PrintButton() {
  const [printing, setPrinting] = useState(false);

  function handlePrint() {
    setPrinting(true);
    // 等一帧让 React 更新完成再调用打印
    requestAnimationFrame(() => {
      window.print();
      setPrinting(false);
    });
  }

  return (
    <button
      onClick={handlePrint}
      disabled={printing}
      className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all
        hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: "var(--primary)", color: "white" }}
    >
      {printing ? "准备中…" : "🖨️ 打印 / 保存 PDF"}
    </button>
  );
}
