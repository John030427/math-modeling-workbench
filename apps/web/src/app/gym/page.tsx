"use client";

import { useEffect, useState } from "react";
import { useAi } from "@/components/AiContext";
import { api, type GymCase } from "@/lib/api";

const STEPS = ["variables", "objective", "constraints", "problem_type", "model_candidates"] as const;

export default function GymPage() {
  const { setPage, setMode } = useAi();
  const [cases, setCases] = useState<GymCase[]>([]);
  const [active, setActive] = useState<GymCase | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setPage("gym");
    setMode("coach");
    api.gymCases().then((r) => {
      setCases(r.cases);
      if (r.cases[0]) {
        api.gymCase(r.cases[0].id).then(setActive);
      }
    });
  }, [setPage, setMode]);

  async function askCoach() {
    if (!active) return;
    const step = STEPS[stepIdx];
    const r = await api.gymCoach({
      case_id: active.id,
      message: `请引导我完成：${step}`,
      step,
    });
    setLog((l) => [...l, r.answer]);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl">Modeling Gym</h1>
      <p className="muted mt-2">重点训练 Problem → Structure Recognition。已自动切换 Coach Mode。</p>
      {active && (
        <div className="panel mt-6">
          <div className="chip">case · {active.id}</div>
          <h2 className="brand text-2xl mt-2">{active.title}</h2>
          <p className="mt-3 leading-relaxed">{active.scenario}</p>
          <p className="mt-3 text-sm muted">原始字段：{active.raw_fields?.join(" · ")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                className={`chip cursor-pointer ${i === stepIdx ? "!bg-[var(--ink)] !text-white" : ""}`}
                onClick={() => setStepIdx(i)}
              >
                {i + 1}. {s}
              </button>
            ))}
          </div>
          <button className="btn mt-4" type="button" onClick={askCoach}>
            教练引导这一步
          </button>
          <div className="mt-4 space-y-3">
            {log.map((t, i) => (
              <div key={i} className="text-sm leading-relaxed border-l-2 border-[var(--accent)] pl-3 whitespace-pre-wrap">
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
      {!cases.length && <p className="muted mt-6">暂无训练案例。</p>}
    </div>
  );
}
