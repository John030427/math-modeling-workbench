"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { KMeansLesson } from "@math-modeling/ui";
import { useAi } from "@/components/AiContext";
import { api, type Model } from "@/lib/api";
import { createWebModelingApi } from "@/lib/modelingApi";

export default function ModelLessonPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { setPage, setModelId, setKnowledgeUnit, setSeedPrompt } = useAi();
  const [model, setModel] = useState<Model | null>(null);
  const webApi = createWebModelingApi();

  useEffect(() => {
    setPage(`lesson/${id}`);
    setModelId(id);
    api.model(id).then(setModel).catch(() => setModel(null));
  }, [id, setPage, setModelId]);

  if (!model) return <p className="muted">加载模型…</p>;
  if (id !== "kmeans") {
    return (
      <div>
        <Link href="/atlas" className="text-sm muted">← Atlas</Link>
        <h1 className="text-4xl mt-2">{model.name_zh || model.name}</h1>
        <p className="muted mt-2">完整互动课程目前聚焦 K-Means。</p>
      </div>
    );
  }

  return (
    <div className="mm-root max-w-4xl">
      <KMeansLesson
        model={model}
        api={webApi}
        onBack={() => { window.location.href = "/atlas"; }}
        onAskTutor={({ seedPrompt, knowledgeUnit }) => {
          if (knowledgeUnit) setKnowledgeUnit(knowledgeUnit);
          setSeedPrompt(seedPrompt);
        }}
      />
    </div>
  );
}
