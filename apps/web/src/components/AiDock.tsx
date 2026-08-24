"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, type AiMode, type ChatReply } from "@/lib/api";
import { useAi } from "@/components/AiContext";

type Msg = { role: "user" | "assistant"; content: string; meta?: string };

export function AiDock() {
  const { mode, setMode, page, modelId, knowledgeUnit, seedPrompt, setSeedPrompt } = useAi();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content: "我是贯穿全站的助手。打开 K-Means 课程后问「为什么要标准化？」试试。",
      meta: "router",
    },
  ]);

  useEffect(() => {
    if (seedPrompt) {
      setInput(seedPrompt);
      setSeedPrompt(undefined);
    }
  }, [seedPrompt, setSeedPrompt]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim() || busy) return;
    const message = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: message }]);
    setBusy(true);
    try {
      const reply: ChatReply = await api.chat({
        message,
        mode,
        page,
        model_id: modelId,
        knowledge_unit: knowledgeUnit,
      });
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: reply.answer,
          meta: `${reply.skill || "ai"}${reply.offline ? " · offline" : ""}`,
        },
      ]);
    } catch (err) {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: `请求失败：${(err as Error).message}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="ai-dock">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="brand text-lg">AI Assistant</div>
          <p className="muted text-xs mt-1">
            {page}
            {modelId ? ` · ${modelId}` : ""}
            {knowledgeUnit ? ` · ${knowledgeUnit}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {(["coach", "copilot", "agent"] as AiMode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`chip cursor-pointer ${mode === m ? "!bg-[var(--ink)] !text-white !border-[var(--ink)]" : ""}`}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`text-sm leading-relaxed ${
              m.role === "user" ? "text-[var(--accent)]" : "text-[var(--ink)]"
            }`}
          >
            {m.meta && <div className="text-[10px] uppercase tracking-wide muted mb-1">{m.meta}</div>}
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {busy && <div className="text-xs muted">思考中…</div>}
      </div>
      <form onSubmit={send} className="mt-3 flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder={mode === "coach" ? "教练模式：我会反问引导…" : "问点什么…"}
          className="w-full border border-[var(--line)] bg-white/80 p-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button className="btn" type="submit" disabled={busy}>
          发送
        </button>
      </form>
    </aside>
  );
}
