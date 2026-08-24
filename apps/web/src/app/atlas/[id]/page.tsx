"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { KMeansCanvas } from "@/components/KMeansCanvas";
import { useAi } from "@/components/AiContext";
import { api, type Model, type QuizQ, type QuizResult } from "@/lib/api";

export default function ModelLessonPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { setPage, setModelId, setKnowledgeUnit, setSeedPrompt, mode } = useAi();
  const [model, setModel] = useState<Model | null>(null);
  const [step, setStep] = useState(1);
  const [quizzes, setQuizzes] = useState<QuizQ[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, QuizResult>>({});

  useEffect(() => {
    setPage(`lesson/${id}`);
    setModelId(id);
    api.model(id).then(setModel).catch(() => setModel(null));
    if (id === "kmeans") {
      api.quizzes("kmeans").then((r) => setQuizzes(r.questions)).catch(() => setQuizzes([]));
    }
  }, [id, setPage, setModelId]);

  if (!model) {
    return <p className="muted">加载模型…</p>;
  }

  const isKmeans = id === "kmeans";

  return (
    <div className="max-w-4xl">
      <Link href="/atlas" className="text-sm muted">← Atlas</Link>
      <h1 className="text-4xl mt-2">{model.name_zh || model.name}</h1>
      <p className="muted mt-2">{model.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button key={n} type="button" className={`chip cursor-pointer ${step === n ? "!bg-[var(--ink)] !text-white" : ""}`} onClick={() => setStep(n)}>
            Step {n}
          </button>
        ))}
      </div>

      <div className="mt-6 panel fade-up">
        {step === 1 && (
          <div>
            <h2 className="brand text-2xl">30 秒直觉</h2>
            <p className="mt-3 leading-relaxed">它解决什么问题？把「相似」的样本分到同一组，使组内更紧、组间更分离——用到簇中心的距离来衡量。</p>
            <button className="btn mt-4" type="button" onClick={() => setSeedPrompt("它到底解决什么问题？再简单一点。")}>问 AI：再简单一点</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="brand text-2xl">现实案例</h2>
            <p className="mt-3">零售客户分群、企业信用分层、问卷受访者画像。先问：分群后运营动作是什么？否则 K 只是数字游戏。</p>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="brand text-2xl">交互动画</h2>
            <p className="muted text-sm mb-3">随机中心 → 分配 → 更新 → 收敛。可改 K、自动运行。</p>
            {isKmeans ? <KMeansCanvas /> : <p className="muted">完整动画目前聚焦 K-Means 演示。</p>}
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="brand text-2xl">数学原理</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              <li>距离：常用欧氏距离 ‖x − c‖</li>
              <li>质心：簇内样本均值</li>
              <li>目标：最小化 SSE = Σ ‖xi − c_zi‖²</li>
              <li>迭代至分配不再变化或位移很小</li>
            </ul>
            <button className="btn ghost mt-4" type="button" onClick={() => { setKnowledgeUnit("sse"); setSeedPrompt("SSE 是怎么来的？"); }}>问 AI：SSE 怎么来的？</button>
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="brand text-2xl">代码</h2>
            <pre className="mt-3 overflow-x-auto bg-[var(--ink)] text-[#f3efe6] p-4 text-xs leading-relaxed">{`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(raw_features)
km = KMeans(n_clusters=3, n_init=10, random_state=0)
labels = km.fit_predict(X)`}</pre>
          </div>
        )}
        {step === 6 && (
          <div>
            <h2 className="brand text-2xl">什么时候适合</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1">{(model.use_when || []).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        )}
        {step === 7 && (
          <div>
            <h2 className="brand text-2xl">什么时候不适合</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1">{(model.avoid_when || []).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        )}
        {step === 8 && (
          <div>
            <h2 className="brand text-2xl">常见错误</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1">{(model.common_mistakes || []).map((x) => <li key={x}>{x}</li>)}</ul>
            <button className="btn mt-4" type="button" onClick={() => { setKnowledgeUnit("feature-scaling"); setSeedPrompt("为什么要标准化？"); }}>演示提问：为什么要标准化？</button>
          </div>
        )}
        {step === 9 && (
          <div>
            <h2 className="brand text-2xl">模型比较</h2>
            <p className="mt-3">备选：{(model.alternatives || []).join(", ") || "—"}</p>
            <button className="btn ghost mt-4" type="button" onClick={() => { setKnowledgeUnit("kmeans-vs-dbscan"); setSeedPrompt("那 DBSCAN 呢？"); }}>问 AI：那 DBSCAN 呢？</button>
          </div>
        )}
        {step === 10 && (
          <div>
            <h2 className="brand text-2xl">Mini Quiz</h2>
            <p className="muted text-sm mt-1">当前模式：{mode}（不影响判分，但右侧 AI 会按模式回答）</p>
            <div className="mt-4 space-y-6">
              {quizzes.map((q) => (
                <div key={q.id} className="border-t border-[var(--line)] pt-4">
                  <div className="chip mb-2">L{q.level} · {q.knowledge_unit}</div>
                  <p className="font-medium">{q.prompt}</p>
                  <div className="mt-2 grid gap-2">
                    {Object.entries(q.options).map(([k, v]) => (
                      <label key={k} className="flex gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          checked={selected[q.id] === k}
                          onChange={() => setSelected((s) => ({ ...s, [q.id]: k }))}
                        />
                        <span><b>{k}.</b> {v}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="btn ghost mt-2"
                    type="button"
                    disabled={!selected[q.id]}
                    onClick={async () => {
                      setKnowledgeUnit(q.knowledge_unit);
                      const r = await api.submitQuiz({
                        quiz_id: `kmeans:${q.id}`,
                        selected: selected[q.id],
                        item_type: "ku",
                        item_id: q.knowledge_unit,
                      });
                      setResults((old) => ({ ...old, [q.id]: r }));
                    }}
                  >
                    提交
                  </button>
                  {results[q.id] && (
                    <p className={`mt-2 text-sm ${results[q.id].correct ? "text-[var(--accent-2)]" : "text-[var(--accent)]"}`}>
                      {results[q.id].correct ? "正确" : `不对。答案 ${results[q.id].answer}`}
                      {" — "}
                      {results[q.id].explanation}
                      {" · mastery "}
                      {results[q.id].mastery.toFixed(1)}
                    </p>
                  )}
                </div>
              ))}
              {!quizzes.length && <p className="muted">该模型暂无题库（K-Means 有完整 Quiz）。</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
