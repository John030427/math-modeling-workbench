"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { AiMode } from "@/lib/api";

type AiCtx = {
  mode: AiMode;
  setMode: (m: AiMode) => void;
  page: string;
  setPage: (p: string) => void;
  modelId?: string;
  setModelId: (id?: string) => void;
  knowledgeUnit?: string;
  setKnowledgeUnit: (k?: string) => void;
  seedPrompt?: string;
  setSeedPrompt: (s?: string) => void;
};

const Ctx = createContext<AiCtx | null>(null);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AiMode>("copilot");
  const [page, setPage] = useState("dashboard");
  const [modelId, setModelId] = useState<string | undefined>();
  const [knowledgeUnit, setKnowledgeUnit] = useState<string | undefined>();
  const [seedPrompt, setSeedPrompt] = useState<string | undefined>();
  const value = useMemo(
    () => ({
      mode,
      setMode,
      page,
      setPage,
      modelId,
      setModelId,
      knowledgeUnit,
      setKnowledgeUnit,
      seedPrompt,
      setSeedPrompt,
    }),
    [mode, page, modelId, knowledgeUnit, seedPrompt],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAi() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AiProvider missing");
  return v;
}
