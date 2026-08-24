"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAi } from "@/components/AiContext";
import { api, type DailyReview } from "@/lib/api";

export default function DailyPage() {
  const { setPage } = useAi();
  const [data, setData] = useState<DailyReview | null>(null);

  useEffect(() => {
    setPage("daily-review");
    api.dailyReview().then(setData).catch(() => setData(null));
  }, [setPage]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl">Daily Review</h1>
      <p className="muted mt-2">不是随机 10 题，而是今天最该复习的知识。</p>
      {data ? (
        <div className="panel mt-6">
          <div className="brand text-3xl">今日复习</div>
          <p className="mt-2">预计 {data.estimated_minutes} 分钟</p>
          <p className="muted text-sm mt-1">{data.message} · 薄弱 {data.weak_count}</p>
          <ul className="mt-4 space-y-2">
            {data.due.map((d) => (
              <li key={`${d.item_type}-${d.item_id}`} className="flex justify-between border-b border-[var(--line)] py-2 text-sm">
                <span>
                  <span className="chip mr-2">{d.item_type}</span>
                  {d.item_id}
                </span>
                <span className="muted">{Number(d.score).toFixed(0)}</span>
              </li>
            ))}
          </ul>
          <Link href="/atlas/kmeans" className="btn inline-block mt-4">
            开始训练（K-Means Quiz）
          </Link>
        </div>
      ) : (
        <p className="muted mt-6">无法加载复习队列。</p>
      )}
    </div>
  );
}
