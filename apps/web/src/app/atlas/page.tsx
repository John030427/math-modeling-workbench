"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AtlasView } from "@math-modeling/ui";
import { createWebModelingApi } from "@/lib/modelingApi";
import { useAi } from "@/components/AiContext";

export default function AtlasPage() {
  const { setPage, setModelId } = useAi();
  const [models, setModels] = useState<Awaited<ReturnType<typeof createWebModelingApi>["fetchRegistry"]>["models"]>([]);

  useEffect(() => {
    setPage("atlas");
    setModelId(undefined);
    createWebModelingApi()
      .fetchRegistry()
      .then((r) => setModels(r.models))
      .catch(() => setModels([]));
  }, [setPage, setModelId]);

  return (
    <div>
      <h1 className="text-4xl">Model Atlas</h1>
      <p className="muted mt-2 max-w-2xl">按问题类型与方法体系浏览（UI 来自 @math-modeling/ui）。</p>
      <div className="mt-6 mm-root">
        <AtlasView
          models={models}
          onSelectModel={(id) => {
            setModelId(id);
            window.location.href = `/atlas/${id}`;
          }}
        />
      </div>
      <p className="muted mt-4 text-sm">
        <Link href="/">← Dashboard</Link>
      </p>
    </div>
  );
}
