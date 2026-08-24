"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAi } from "@/components/AiContext";
import { api, type ReviewResult } from "@/lib/api";

const SAMPLE = `# 弱论文示例
## 摘要
用了 K-Means。
## 结果分析
效果很好。
`;

export default function PaperPage() {
  const { setPage } = useAi();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPage("paper-lab");
    // load demo weak paper via fetch from public? embed sample + note to upload demo file
    fetch("/demo/weak_kmeans_paper.md")
      .then((r) => (r.ok ? r.text() : SAMPLE))
      .then(setText)
      .catch(() => setText(SAMPLE));
  }, [setPage]);

  async function run() {
    setBusy(true);
    try {
      const r = await api.reviewText("demo-paper", text);
      setResult(r);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    setBusy(true);
    try {
      const r = await api.reviewFile(file);
      setResult(r);
      setText(await file.text());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl">Paper Lab · Reviewer</h1>
      <p className="muted mt-2">Modeling Training Rubric（训练评分，非官方竞赛分）。强调证据与验证。</p>
      <div className="panel mt-6">
        <textarea
          className="w-full min-h-64 border border-[var(--line)] bg-white/80 p-3 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn" type="button" disabled={busy} onClick={run}>
            运行 Reviewer
          </button>
          <label className="btn ghost cursor-pointer">
            上传 Markdown/文本
            <input type="file" accept=".md,.txt,.markdown" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
        </div>
      </div>
      {result && (
        <div className="panel mt-6 fade-up">
          <div className="brand text-3xl">
            {result.total} / {result.max_total}
          </div>
          <p className="text-xs muted mt-1">{result.disclaimer}</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {result.dimensions.map((d) => (
              <div key={d.dimension} className="text-sm flex justify-between border-b border-[var(--line)] py-1">
                <span>{d.dimension}</span>
                <span>
                  {d.score}/{d.max}
                </span>
              </div>
            ))}
          </div>
          <h3 className="brand text-xl mt-6">Gap Analysis</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {result.training_plan.map((t) => (
              <li key={t.focus}>
                <b>{t.focus}</b> × {t.recommended_drills} — {t.reason}
              </li>
            ))}
          </ul>
          {result.evidence?.length > 0 && (
            <div className="mt-4 text-sm">
              <div className="font-medium">证据要点</div>
              <ul className="list-disc pl-5 muted">
                {result.evidence.map((e, i) => (
                  <li key={i}>{e.finding}</li>
                ))}
              </ul>
            </div>
          )}
          <Link href="/daily" className="btn ghost inline-block mt-4">
            转入 Daily Review
          </Link>
        </div>
      )}
    </div>
  );
}
