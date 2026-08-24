import type { ModelSummary } from './types'

export function AtlasView({
  models,
  onSelectModel,
}: {
  models: ModelSummary[]
  onSelectModel: (id: string) => void
}) {
  return (
    <div>
      <h2 className="mm-title">模型地图</h2>
      <p className="mm-muted">按 Registry 浏览算法模型。K-Means 为完整互动课程示范。</p>
      <div className="mm-grid" style={{ marginTop: 16 }}>
        {models.map((m) => (
          <div key={m.id} className="mm-card" onClick={() => onSelectModel(m.id)}>
            <div>
              {(m.category?.task || []).map((t) => (
                <span key={t} className="mm-chip">{t}</span>
              ))}
            </div>
            <div className="mm-title" style={{ fontSize: '1.1rem' }}>{m.name_zh || m.name}</div>
            <p className="mm-muted">{m.summary}</p>
            {m.id === 'kmeans' && (
              <div className="mm-muted" style={{ marginTop: 8, color: 'var(--mm-accent)' }}>
                ★ 演示重点：互动课程
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
