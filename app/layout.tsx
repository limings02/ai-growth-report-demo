import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "给未来的你｜孩子的成长礼物",
  description: "上传孩子这一年的照片和故事，整理成一份未来会被珍藏的成长礼物。",
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
