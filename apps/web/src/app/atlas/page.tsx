"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Model, type Taxonomy } from "@/lib/api";
import { useAi } from "@/components/AiContext";

export default function AtlasPage() {
  const { setPage, setModelId } = useAi();
  const [models, setModels] = useState<Model[]>([]);
  const [tax, setTax] = useState<Taxonomy>({ tasks: [], families: [] });
  const [task, setTask] = useState("");
  const [family, setFamily] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setPage("atlas");
    setModelId(undefined);
  }, [setPage, setModelId]);

  useEffect(() => {
    api
      .models({ task: task || undefined, family: family || undefined })
      .then((r) => {
        setModels(r.models);
        setTax(r.taxonomy);
      })
      .catch((e) => setErr(String(e.message || e)));
  }, [task, family]);

  return (
    <div>
      <h1 className="text-4xl">Model Atlas</h1>
      <p className="muted mt-2 max-w-2xl">按问题类型与方法体系浏览。聚类 ≠ 机器学习——Registry 支持 Task × Family × Algorithm。</p>
      {err && <p className="mt-3 text-[var(--accent)] text-sm">加载失败：{err}（请确认 API 已启动）</p>}
      <div className="mt-6 flex flex-wrap gap-2">
        <select className="border border-[var(--line)] bg-white/80 px-2 py-1 text-sm" value={task} onChange={(e) => setTask(e.target.value)}>
          <option value="">全部任务</option>
          {tax.tasks.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-white/80 px-2 py-1 text-sm" value={family} onChange={(e) => setFamily(e.target.value)}>
          <option value="">全部方法族</option>
          {tax.families.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid-modules mt-6">
        {models.map((m) => (
          <Link key={m.id} href={`/atlas/${m.id}`} className="card-link" onClick={() => setModelId(m.id)}>
            <div className="flex gap-2 flex-wrap">
              {(m.category?.task || []).map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
            <div className="brand text-2xl mt-2">{m.name_zh || m.name}</div>
            <p className="text-sm muted mt-2 leading-relaxed">{m.summary}</p>
            {m.id === "kmeans" && <div className="mt-3 text-xs text-[var(--accent)]">★ 演示重点：互动课程</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
