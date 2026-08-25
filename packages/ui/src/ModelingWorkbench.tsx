import { useEffect, useState } from 'react'
import { AtlasView } from './AtlasView'
import { KMeansLesson } from './KMeansLesson'
import type { AskTutorPayload, ModelingApi, ModelSummary } from './types'

/** Workbench sections — rendered inside conversation.view only (not global nav). */
export type WorkbenchSection =
  | 'dashboard'
  | 'atlas'
  | 'lesson'
  | 'gym'
  | 'competition'
  | 'problem-library'
  | 'case-library'
  | 'paper-reviewer'
  | 'profile'

const NAV: { id: WorkbenchSection; label: string; phase: string }[] = [
  { id: 'dashboard', label: 'Dashboard', phase: 'P1' },
  { id: 'atlas', label: '模型地图', phase: 'P1' },
  { id: 'lesson', label: 'K-Means 课程', phase: 'P1' },
  { id: 'gym', label: '专项训练', phase: 'P2+' },
  { id: 'competition', label: '比赛工作台', phase: 'P6' },
  { id: 'problem-library', label: '题库/真题', phase: 'P4' },
  { id: 'case-library', label: '优秀案例', phase: 'P5' },
  { id: 'paper-reviewer', label: '论文评审', phase: 'P7' },
  { id: 'profile', label: '能力画像', phase: 'P8' },
]

function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="mm-panel">
      <h3 className="mm-title">{title}</h3>
      <p className="mm-muted">迁移至 conversation.view 内导航 · {phase}</p>
    </div>
  )
}

export function ModelingWorkbench({
  api,
  sessionId,
  onAskTutor,
  initialSection = 'atlas',
}: {
  api: ModelingApi
  sessionId: string
  onAskTutor: (payload: AskTutorPayload) => void
  initialSection?: WorkbenchSection
}) {
  const [section, setSection] = useState<WorkbenchSection>(initialSection)
  const [models, setModels] = useState<ModelSummary[]>([])
  const [lessonModel, setLessonModel] = useState<ModelSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.fetchRegistry()
      .then((r) => setModels(r.models))
      .catch(() => setModels([]))
      .finally(() => setLoading(false))
  }, [api])

  // Deep-link support: landing directly on the lesson (dedicated shell) must
  // hydrate the reference lesson model instead of showing an empty pane.
  useEffect(() => {
    if (initialSection === 'lesson') {
      api.fetchModel('kmeans')
        .then((m) => setLessonModel(m))
        .catch(() => setLessonModel(null))
    }
    // run once on mount; openModel() handles later transitions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const pageMap: Record<string, string> = {
      dashboard: 'dashboard',
      atlas: 'atlas',
      lesson: 'lesson/kmeans',
      gym: 'gym',
      competition: 'competition',
      'problem-library': 'problem-library',
      'case-library': 'case-library',
      'paper-reviewer': 'paper-reviewer',
      profile: 'profile',
    }
    void api.patchContext({
      page: pageMap[section] ?? section,
      model_id: section === 'lesson' ? 'kmeans' : null,
      lesson_step: section === 'lesson' ? 1 : null,
      route: `/mathmodeling/${section}`,
      session_id: sessionId,
    })
  }, [section, sessionId, api])

  async function openModel(id: string) {
    if (id === 'kmeans') {
      const m = await api.fetchModel(id)
      setLessonModel(m)
      setSection('lesson')
    } else {
      void api.patchContext({ page: 'atlas', model_id: id, session_id: sessionId })
    }
  }

  if (loading) return <p className="mm-muted">加载中…</p>

  return (
    <div className="mm-root" style={{ padding: '16px 20px', height: '100%', overflow: 'auto' }}>
      <p className="mm-muted" style={{ marginBottom: 12 }}>
        会话内工作台 · Tutor 请用下方 DSH 对话 + <code>/modeling-tutor</code>
      </p>
      <nav className="mm-steps" style={{ marginBottom: 16 }}>
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`mm-chip ${section === item.id ? 'active' : ''}`}
            style={{ cursor: 'pointer', border: 'none' }}
            onClick={() => {
              setSection(item.id)
              if (item.id !== 'lesson') setLessonModel(null)
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {section === 'dashboard' && (
        <div>
          <h2 className="mm-title">数模工作台</h2>
          <p className="mm-muted">
            通过会话标签「数模工作台」访问（非全局页面）。与「对话」「轨迹」并列。
          </p>
          <div className="mm-grid" style={{ marginTop: 16 }}>
            <div className="mm-panel">
              <h3 className="mm-title">模型地图</h3>
              <p className="mm-muted">{models.length} 个模型</p>
            </div>
          </div>
        </div>
      )}

      {section === 'atlas' && (
        <AtlasView models={models} onSelectModel={(id) => void openModel(id)} />
      )}

      {section === 'lesson' && lessonModel && (
        <KMeansLesson
          model={lessonModel}
          api={api}
          sessionId={sessionId}
          onBack={() => {
            setSection('atlas')
            setLessonModel(null)
          }}
          onAskTutor={onAskTutor}
        />
      )}

      {section === 'lesson' && !lessonModel && (
        <p className="mm-muted">请从模型地图打开 K-Means 课程。</p>
      )}

      {section === 'gym' && <Placeholder title="专项训练 (Gym)" phase="P2+" />}
      {section === 'competition' && <Placeholder title="比赛工作台" phase="P6" />}
      {section === 'problem-library' && <Placeholder title="题库/真题" phase="P4" />}
      {section === 'case-library' && <Placeholder title="优秀案例" phase="P5" />}
      {section === 'paper-reviewer' && <Placeholder title="论文评审" phase="P7" />}
      {section === 'profile' && <Placeholder title="能力画像" phase="P8" />}
    </div>
  )
}
