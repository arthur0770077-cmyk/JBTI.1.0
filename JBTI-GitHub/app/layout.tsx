import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "JBTI 人格探索", template: "%s · JBTI" },
  description: "用 40 个日常选择，观察你的能量、节奏、认知与决策倾向。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}<Toaster position="top-center" richColors /></body>
    </html>
  );
}
