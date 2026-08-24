import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "数学建模 AI 学习与竞赛工作台",
  description: "Learn → Practice → Solve → Review → Diagnose → Retrain",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
