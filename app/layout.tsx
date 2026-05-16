import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 成长年报生成器",
  description: "用 AI 为孩子生成专属成长年报，记录每一个珍贵瞬间",
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
