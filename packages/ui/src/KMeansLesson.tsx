import { useEffect, useState } from 'react'
import { KMeansCanvas } from './KMeansCanvas'
import type { AskTutorPayload, ModelSummary, QuizQuestion, QuizResult } from './types'

const STEPS = [
  '30秒直觉',
  '现实案例',
  '交互动画',
  '数学原理',
  '代码',
  '适用条件',
  '不适用条件',
  '常见错误',
  '模型比较',
  'Mini Quiz',
]

export function KMeansLesson({
  model,
  api,
  onBack,
  onAskTutor,
  sessionId,
}: {
  model: ModelSummary
  api: {
    fetchQuizzes: (id: string) => Promise<{ questions: QuizQuestion[] }>
    submitQuiz: (body: {
      quiz_id: string
      selected: string
      item_type: string
      item_id: string
      session_id?: string
    }) => Promise<QuizResult>
    patchContext: (patch: Record<string, unknown>) => Promise<void>
  }
  onBack: () => void
  onAskTutor: (payload: AskTutorPayload) => void
  sessionId?: string
}) {
  const [step, setStep] = useState(1)
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([])
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, QuizResult>>({})

  useEffect(() => {
    void api.patchContext({
      page: 'lesson/kmeans',
      model_id: 'kmeans',
      lesson_step: step,
      route: `/mathmodeling/atlas/kmeans`,
      session_id: sessionId,
    })
  }, [step, sessionId, api])

  useEffect(() => {
    api.fetchQuizzes('kmeans').then((r) => setQuizzes(r.questions)).catch(() => setQuizzes([]))
  }, [api])

  function goStep(n: number) {
    setStep(n)
    void api.patchContext({
      page: 'lesson/kmeans',
      model_id: 'kmeans',
      lesson_step: n,
      session_id: sessionId,
    })
  }

  function ask(seedPrompt: string, knowledgeUnit?: string | null) {
    void api.patchContext({
      page: 'lesson/kmeans',
      model_id: 'kmeans',
      knowledge_unit: knowledgeUnit ?? null,
      lesson_step: step,
      seed_prompt: seedPrompt,
      session_id: sessionId,
    })
    onAskTutor({ seedPrompt, knowledgeUnit, lessonStep: step })
  }

  return (
    <div>
      <button type="button" className="mm-btn ghost" onClick={onBack}>← 模型地图</button>
      <h2 className="mm-title" style={{ marginTop: 12 }}>{model.name_zh || model.name}</h2>
      <p className="mm-muted">{model.summary}</p>
      <div className="mm-steps">
        {STEPS.map((label, i) => {
          const n = i + 1
          return (
            <button
              key={n}
              type="button"
              className={`mm-chip ${step === n ? 'active' : ''}`}
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => goStep(n)}
            >
              {n}. {label}
            </button>
          )
        })}
      </div>
      <div className="mm-panel">
        {step === 1 && (
          <div>
            <h3 className="mm-title">30 秒直觉</h3>
            <p style={{ marginTop: 12, lineHeight: 1.6 }}>
              它解决什么问题？把「相似」的样本分到同一组，使组内更紧、组间更分离——用到簇中心的距离来衡量。
            </p>
            <button className="mm-btn" type="button" style={{ marginTop: 12 }} onClick={() => ask('它到底解决什么问题？再简单一点。')}>
              问 Tutor：再简单一点
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="mm-title">现实案例</h3>
            <p style={{ marginTop: 12 }}>
              零售客户分群、企业信用分层、问卷受访者画像。先问：分群后运营动作是什么？否则 K 只是数字游戏。
            </p>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="mm-title">交互动画</h3>
            <p className="mm-muted">随机中心 → 分配 → 更新 → 收敛。可改 K、自动运行。</p>
            <KMeansCanvas />
          </div>
        )}
        {step === 4 && (
          <div>
            <h3 className="mm-title">数学原理</h3>
            <ul style={{ marginTop: 12, lineHeight: 1.6, fontSize: '0.875rem' }}>
              <li>距离：常用欧氏距离 ‖x − c‖</li>
              <li>质心：簇内样本均值</li>
              <li>目标：最小化 SSE = Σ ‖xi − c_zi‖²</li>
              <li>迭代至分配不再变化或位移很小</li>
            </ul>
            <button className="mm-btn ghost" type="button" style={{ marginTop: 12 }} onClick={() => ask('SSE 是怎么来的？', 'sse')}>
              问 Tutor：SSE 怎么来的？
            </button>
          </div>
        )}
        {step === 5 && (
          <div>
            <h3 className="mm-title">代码</h3>
            <pre className="mm-code">{`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(raw_features)
km = KMeans(n_clusters=3, n_init=10, random_state=0)
labels = km.fit_predict(X)`}</pre>
          </div>
        )}
        {step === 6 && (
          <div>
            <h3 className="mm-title">什么时候适合</h3>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              {(model.use_when || []).map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        )}
        {step === 7 && (
          <div>
            <h3 className="mm-title">什么时候不适合</h3>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              {(model.avoid_when || []).map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        )}
        {step === 8 && (
          <div>
            <h3 className="mm-title">常见错误</h3>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              {(model.common_mistakes || []).map((x) => <li key={x}>{x}</li>)}
            </ul>
            <button className="mm-btn" type="button" style={{ marginTop: 12 }} onClick={() => ask('为什么要标准化？', 'feature-scaling')}>
              问 Tutor：为什么要标准化？
            </button>
          </div>
        )}
        {step === 9 && (
          <div>
            <h3 className="mm-title">模型比较</h3>
            <p style={{ marginTop: 12 }}>备选：{(model.alternatives || []).join(', ') || '—'}</p>
            <button className="mm-btn ghost" type="button" style={{ marginTop: 12 }} onClick={() => ask('那 DBSCAN 呢？', 'kmeans-vs-dbscan')}>
              问 Tutor：那 DBSCAN 呢？
            </button>
          </div>
        )}
        {step === 10 && (
          <div>
            <h3 className="mm-title">Mini Quiz</h3>
            <p className="mm-muted">提交后更新 knowledge-unit mastery 并持久化。</p>
            <div style={{ marginTop: 16 }}>
              {quizzes.map((q) => (
                <div key={q.id} style={{ borderTop: '1px solid var(--mm-line)', paddingTop: 16, marginTop: 16 }}>
                  <span className="mm-chip">L{q.level} · {q.knowledge_unit}</span>
                  <p style={{ fontWeight: 500, marginTop: 8 }}>{q.prompt}</p>
                  <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                    {Object.entries(q.options).map(([k, v]) => (
                      <label key={k} style={{ display: 'flex', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
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
                    className="mm-btn ghost"
                    type="button"
                    style={{ marginTop: 8 }}
                    disabled={!selected[q.id]}
                    onClick={async () => {
                      const r = await api.submitQuiz({
                        quiz_id: `kmeans:${q.id}`,
                        selected: selected[q.id],
                        item_type: 'ku',
                        item_id: q.knowledge_unit,
                        session_id: sessionId,
                      })
                      setResults((old) => ({ ...old, [q.id]: r }))
                    }}
                  >
                    提交
                  </button>
                  {results[q.id] && (
                    <p
                      className="mm-muted"
                      style={{
                        marginTop: 8,
                        color: results[q.id].correct ? 'var(--mm-accent-2)' : 'var(--mm-accent)',
                      }}
                    >
                      {results[q.id].correct ? '正确' : `不对。答案 ${results[q.id].answer}`}
                      {' — '}
                      {results[q.id].explanation}
                      {' · mastery '}
                      {results[q.id].mastery.toFixed(1)}
                    </p>
                  )}
                </div>
              ))}
              {!quizzes.length && <p className="mm-muted">题库加载中…</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
