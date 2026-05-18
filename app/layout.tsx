import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory Wiki｜AI 记忆整理与纪念生成器",
  description: "把重要的人、关系和人生片段，整理成会被珍藏的记忆。支持家庭亲子成长册、恋爱纪念册等多种记忆主题。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
