"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAi } from "@/components/AiContext";
import { api } from "@/lib/api";

const MODULES = [
  {
    href: "/atlas",
    title: "Model Atlas",
    zh: "模型地图",
    desc: "按问题类型 × 方法体系浏览算法，进入互动课程。",
  },
  {
    href: "/gym",
    title: "Modeling Gym",
    zh: "专项训练",
    desc: "从现实描述识别变量、目标、约束与模型族。",
  },
  {
    href: "/competition",
    title: "Competition",
    zh: "比赛工作台",
    desc: "拆题 → 数据诊断 → 特征 → 选模 → 评审闭环。",
  },
  {
    href: "/daily",
    title: "Daily Review",
    zh: "每日复习",
    desc: "按薄弱点与到期知识生成今日最该练的题。",
  },
  {
    href: "/paper",
    title: "Paper Lab",
    zh: "论文中心",
    desc: "训练型 Reviewer：证据化打分与差距训练。",
  },
  {
    href: "/profile",
    title: "Modeling Profile",
    zh: "能力画像",
    desc: "维度能力与模型掌握度，打通学习与比赛。",
  },
];

export default function HomePage() {
  const { setPage } = useAi();
  useEffect(() => {
    setPage("dashboard");
    api.health().catch(() => undefined);
  }, [setPage]);

  return (
    <div>
      <p className="chip mb-4">AI-Native Mathematical Modeling Workbench</p>
      <h1 className="text-4xl md:text-5xl max-w-3xl leading-[1.15]">
        数学建模 AI
        <br />
        学习与竞赛工作台
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--ink-soft)] text-lg">
        不是自动吐论文，也不是算法百科。把学习、训练、实战、评审与再训练连成闭环。
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/atlas/kmeans" className="btn">
          演示：K-Means 互动课
        </Link>
        <Link href="/competition" className="btn ghost">
          打开比赛工作台
        </Link>
        <button
          className="btn ghost"
          type="button"
          onClick={() => api.resetDemo().then(() => alert("Demo 状态已重置"))}
        >
          Reset Demo
        </button>
      </div>
      <div className="grid-modules mt-10">
        {MODULES.map((m, i) => (
          <Link
            key={m.href}
            href={m.href}
            className="card-link fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="text-xs muted tracking-wide uppercase">{m.title}</div>
            <div className="brand text-2xl mt-1">{m.zh}</div>
            <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
