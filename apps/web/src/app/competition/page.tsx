"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAi } from "@/components/AiContext";
import { api, type CompState, type DiagnoseResult, type SelectResult } from "@/lib/api";

const STAGE_LABELS: Record<string, string> = {
  problem_reader: "读题",
  decomposition: "拆解",
  data_doctor: "数据诊断",
  eda: "EDA",
  feature_engineering: "特征",
  model_selector: "选模",
  algorithm_lab: "算法",
  validation: "验证",
  visualization: "可视化",
  paper_writing: "论文",
  reviewer: "评审",
};

export default function CompetitionPage() {
  const { setPage, setSeedPrompt } = useAi();
  const [problem, setProblem] = useState(
    "某电商仓向 12 个社区配送点送货，车辆有容量限制与时间窗，最小化总行驶距离。",
  );
  const [proj, setProj] = useState<CompState | null>(null);
  const [diag, setDiag] = useState<DiagnoseResult | null>(null);
  const [select, setSelect] = useState<SelectResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPage("competition");
  }, [setPage]);

  async function create() {
    setBusy(true);
    try {
      const p = await api.createComp({ title: "Demo 配送赛题", problem_text: problem });
      setProj(p);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    const r = await api.diagnose(file);
    setDiag(r);
    if (proj) {
      await api.updateStage(proj.id, "data_doctor", { summary: r });
      const refreshed = await api.getComp(proj.id);
      setProj(refreshed);
    }
  }

  async function runSelect() {
    const r = await api.modelSelect({
      goal: problem,
      problem_type: "optimization",
      linear: false,
      integer_vars: true,
      need_explainability: true,
      n_rows: diag?.n_rows || 0,
    });
    setSelect(r);
    if (proj) {
      await api.updateStage(proj.id, "model_selector", { selection: r });
      // mastery bridge demo
      setSeedPrompt("系统推荐了路径优化方向。若掌握度不足，应先快速学习还是边做边学？");
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl">Competition Workbench</h1>
      <p className="muted mt-2">支持题面与 CSV/Excel。阶段进度可视化；选模强调 Baseline / Main / Alternative。</p>

      <div className="panel mt-6">
        <label className="text-sm muted">题面</label>
        <textarea
          className="mt-2 w-full border border-[var(--line)] bg-white/80 p-3 text-sm min-h-28"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <button className="btn mt-3" type="button" disabled={busy} onClick={create}>
          创建比赛项目
        </button>
      </div>

      {proj && (
        <div className="mt-6">
          <div className="text-sm muted">项目 {proj.id}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.keys(STAGE_LABELS).map((s) => {
              const st = proj.stages[s]?.status || "pending";
              return (
                <span
                  key={s}
                  className={`chip ${st === "done" ? "!bg-[var(--accent-2)] !text-white !border-transparent" : st === "active" ? "!border-[var(--accent)]" : ""}`}
                >
                  {STAGE_LABELS[s]}
                </span>
              );
            })}
          </div>
          <div className="panel mt-4">
            <h3 className="brand text-xl">问题拆解</h3>
            <pre className="mt-2 text-xs whitespace-pre-wrap">
              {JSON.stringify(proj.stages.decomposition?.data || {}, null, 2)}
            </pre>
          </div>
          <div className="panel mt-4">
            <h3 className="brand text-xl">Data Doctor</h3>
            <p className="text-sm muted mt-1">上传 demo/data/customers.csv 可演示缺失与量纲问题。</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="mt-3 text-sm"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
            {diag?.error && <p className="text-[var(--accent)] mt-2">{diag.error}</p>}
            {diag && !diag.error && (
              <div className="mt-3 text-sm space-y-2">
                <p>
                  {diag.n_rows} 行 · 问题 {diag.issues?.length || 0} 条
                </p>
                <ul className="list-disc pl-5">
                  {diag.issues?.map((i, idx) => (
                    <li key={idx}>{i.message}</li>
                  ))}
                </ul>
                <h4 className="font-medium mt-3">特征建议（Feature Cards）</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {diag.feature_suggestions?.map((f) => (
                    <div key={f.feature_name} className="border border-[var(--line)] p-2">
                      <div className="font-medium">{f.feature_name}</div>
                      <div className="muted text-xs">{f.formula}</div>
                      <div className="text-xs mt-1">{f.why_it_may_matter}</div>
                      <div className="text-xs text-[var(--accent)] mt-1">泄漏风险：{f.possible_leakage}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="panel mt-4">
            <h3 className="brand text-xl">Model Selector</h3>
            <button className="btn mt-3" type="button" onClick={runSelect}>
              生成 Baseline / Main / Alternative
            </button>
            {select && (
              <div className="mt-3 space-y-2 text-sm">
                <p><b>Baseline</b> {select.baseline.id} — {select.baseline.why}</p>
                <p><b>Main</b> {select.main_model.id} — {select.main_model.why}</p>
                <p><b>Alternative</b> {select.alternative.id} — {select.alternative.why}</p>
                {select.warnings.map((w) => (
                  <p key={w} className="text-[var(--accent)]">{w}</p>
                ))}
                <Link href="/profile" className="btn ghost inline-block mt-2">
                  查看掌握度桥接
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
