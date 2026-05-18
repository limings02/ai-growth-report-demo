"use client";

// components/couple/CouplePrintButton.tsx
// 兼容 wrapper，内部使用通用 MemoryPrintButton。
// 保留此文件避免破坏已有 import 引用。

import MemoryPrintButton from "@/components/memory/MemoryPrintButton";

type Props = {
  label?: string;
};

export default function CouplePrintButton({ label = "打印 / 保存 PDF" }: Props) {
  return <MemoryPrintButton label={label} />;
}
