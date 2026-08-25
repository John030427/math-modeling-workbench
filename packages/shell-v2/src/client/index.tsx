import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * MathModel Shell V2 — production three-column frame.
 *
 * Live-Gate lessons encoded here:
 * - replacing `root` must re-declare official children (sidebar/conversation/
 *   details/shell.overlay) or the client boot aborts;
 * - ctx.layout stub must exist before ui-sidebar resolves its inject;
 * - footer-seat plugins race unless they use slots.inject (quarantine list is
 *   managed by scripts/shell-v2-enable.ps1, not here).
 */

const API = '/api/mathmodeling'
const NAV_KEY = 'mm-shell-v2.section'

type SectionId =
  | 'dashboard'
  | 'workbench'
  | 'training'
  | 'competition'
  | 'problems'
  | 'cases'
  | 'paper'
  | 'profile'

const NAV: { id: SectionId; label: string; icon: string; hint?: string }[] = [
  { id: 'dashboard', label: '仪表盘', icon: '📊' },
  { id: 'workbench', label: '建模工作台', icon: '🧪' },
  { id: 'training', label: '训练', icon: '🎯' },
  { id: 'competition', label: '竞赛', icon: '🏆' },
  { id: 'problems', label: '习题', icon: '📝' },
  { id: 'cases', label: '案例', icon: '📚' },
  { id: 'paper', label: '论文', icon: '📄' },
  { id: 'profile', label: '画像', icon: '👤' },
]

const SECTION_META: Record<SectionId, { title: string; sub: string }> = {
  dashboard: { title: '仪表盘', sub: '模型注册表总览 · 点击卡片进入工作台' },
  workbench: { title: '建模工作台', sub: 'Atlas · 课程 · 测验 · 掌握度' },
  training: { title: '训练', sub: '每日复习与刻意练习' },
  competition: { title: '竞赛', sub: '赛程 · 真题 · 论文写作' },
  problems: { title: '习题', sub: '按知识点组织的小题' },
  cases: { title: '案例', sub: '完整建模案例走读' },
  paper: { title: '论文', sub: '论文精读与差距分析' },
  profile: { title: '画像', sub: '个人掌握度画像' },
}

/* ---------- styles ---------- */

const S = {
  frame: {
    display: 'grid',
    gridTemplateColumns: '236px minmax(0, 1.15fr) minmax(380px, 1fr)',
    height: '100%',
    width: '100%',
    background: 'var(--dsh-bg, #141414)',
    color: 'inherit',
    overflow: 'hidden',
  } as React.CSSProperties,
  nav: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    borderRight: '1px solid rgba(128,128,128,0.25)',
    overflow: 'hidden',
  } as React.CSSProperties,
  brand: {
    padding: '14px 16px 12px',
    borderBottom: '1px solid rgba(128,128,128,0.22)',
  } as React.CSSProperties,
  brandTitle: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 0.2,
  } as React.CSSProperties,
  brandSub: {
    fontSize: 11,
    opacity: 0.55,
    marginTop: 3,
  } as React.CSSProperties,
  navList: {
    padding: '8px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  } as React.CSSProperties,
  navItem: (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '7px 10px',
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
    userSelect: 'none',
    background: active ? 'rgba(91,140,255,0.16)' : 'transparent',
    boxShadow: active ? 'inset 2px 0 0 var(--mm-accent, #5b8cff)' : 'none',
    opacity: active ? 1 : 0.78,
    transition: 'background 120ms ease, opacity 120ms ease',
  }),
  navSeat: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    borderTop: '1px solid rgba(128,128,128,0.18)',
  } as React.CSSProperties,
  main: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(128,128,128,0.25)',
    overflow: 'hidden',
  } as React.CSSProperties,
  mainHeader: {
    padding: '10px 16px',
    borderBottom: '1px solid rgba(128,128,128,0.2)',
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  } as React.CSSProperties,
  mainTitle: { fontSize: 14, fontWeight: 600 } as React.CSSProperties,
  mainSub: { fontSize: 12, opacity: 0.55 } as React.CSSProperties,
  mainBody: { flex: 1, minHeight: 0, position: 'relative' } as React.CSSProperties,
  sectionPane: (visible: boolean): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    overflow: 'auto',
    display: visible ? 'block' : 'none',
  }),
  chat: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  } as React.CSSProperties,
  chatHeader: {
    padding: '9px 14px',
    borderBottom: '1px solid rgba(128,128,128,0.2)',
    fontSize: 12,
    opacity: 0.65,
    display: 'flex',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  chatBody: { flex: 1, minHeight: 0 } as React.CSSProperties,
}

function loadNav(): SectionId {
  try {
    const v = sessionStorage.getItem(NAV_KEY) as SectionId | null
    if (v && NAV.some((n) => n.id === v)) return v
  } catch {
    /* storage unavailable */
  }
  return 'dashboard'
}

function saveNav(id: SectionId) {
  try {
    sessionStorage.setItem(NAV_KEY, id)
  } catch {
    /* ignore */
  }
}

/* ---------- dashboard ---------- */

type RegistryModel = {
  id: string
  name: string
  name_zh?: string
  difficulty?: string
  summary?: string
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#3fb26f',
  intermediate: '#d9913b',
  advanced: '#e05656',
}

function Dashboard({ onSelect }: { onSelect: (modelId: string) => void }) {
  const [models, setModels] = useState<RegistryModel[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`${API}/registry`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setModels(d.models ?? [])
      })
      .catch((e) => {
        if (alive) setError(String(e))
      })
    return () => {
      alive = false
    }
  }, [])

  if (error)
    return (
      <div style={{ padding: 24, fontSize: 13, opacity: 0.7 }}>
        注册表加载失败：{error}
        <button className="mm-btn ghost" style={{ marginLeft: 12 }} onClick={() => location.reload()}>
          重试
        </button>
      </div>
    )
  if (!models)
    return <div style={{ padding: 24, fontSize: 13, opacity: 0.55 }}>加载注册表…</div>

  return (
    <div
      style={{
        padding: '18px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
        alignContent: 'start',
      }}
    >
      {models.map((m) => (
        <div
          key={m.id}
          onClick={() => onSelect(m.id)}
          title="点击进入建模工作台"
          style={{
            border: '1px solid rgba(128,128,128,0.28)',
            borderRadius: 10,
            padding: '14px 16px',
            cursor: 'pointer',
            background: 'rgba(128,128,128,0.06)',
            transition: 'border-color 120ms ease, background 120ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--mm-accent, #5b8cff)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(128,128,128,0.28)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: 14 }}>{m.name_zh || m.name}</strong>
            <span
              style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 999,
                color: '#fff',
                background: DIFFICULTY_COLOR[m.difficulty ?? ''] ?? 'rgba(128,128,128,0.6)',
              }}
            >
              {m.difficulty ?? '—'}
            </span>
          </div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{m.name}</div>
          <p style={{ fontSize: 12, opacity: 0.75, marginTop: 8, lineHeight: 1.5 }}>
            {m.summary ?? ''}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ---------- placeholder ---------- */

function Placeholder({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div
      style={{
        margin: 24,
        border: '1px dashed rgba(128,128,128,0.35)',
        borderRadius: 12,
        padding: '48px 32px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 34 }}>{NAV.find((n) => n.id === section)?.icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>{meta.title}</div>
      <p style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
        规划中 — 将在 Shell V2 门禁 H1–H5 全部通过后启动
        <br />
        （见 MATHMODEL_HARNESS_SHELL_V2_PLAN.md §3）
      </p>
    </div>
  )
}

/* ---------- frame ---------- */

type FrameProps = {
  renderSlot: (key: string, owner: Record<string, unknown>) => ReactNode
}

function ShellFrame({ renderSlot }: FrameProps) {
  const [active, setActive] = useState<SectionId>(loadNav)

  const navigate = (id: SectionId) => {
    setActive(id)
    saveNav(id)
  }

  const selectModel = (modelId: string) => {
    const sid = readCurrentSessionId()
    void fetch(`${API}/context`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: 'atlas', model_id: modelId, ...(sid ? { session_id: sid } : {}) }),
    }).catch(() => {
      /* context patch best-effort */
    })
    navigate('workbench')
  }

  return (
    <div data-mm-shell="v2" style={S.frame}>
      {/* ── left: nav + official sidebar seat ── */}
      <aside style={S.nav}>
        <div style={S.brand}>
          <div style={S.brandTitle}>📐 MathModel 工作台</div>
          <div style={S.brandSub}>Shell V2 · learn → practice → compete</div>
        </div>
        <nav style={S.navList}>
          {NAV.map((n) => (
            <div
              key={n.id}
              style={S.navItem(active === n.id)}
              onClick={() => navigate(n.id)}
              role="tab"
              aria-selected={active === n.id}
            >
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </nav>
        {/* Official ui-sidebar fills this seat (declares footer.action children) */}
        <div style={S.navSeat}>{renderSlot('sidebar', { collapsed: false, width: 236 })}</div>
      </aside>

      {/* ── center: workbench panes (kept mounted to preserve state) ── */}
      <main style={S.main}>
        <div style={S.mainHeader}>
          <span style={S.mainTitle}>{SECTION_META[active].title}</span>
          <span style={S.mainSub}>{SECTION_META[active].sub}</span>
        </div>
        <div style={S.mainBody}>
          <div style={S.sectionPane(active === 'dashboard')}>
            <Dashboard onSelect={selectModel} />
          </div>
          <div style={S.sectionPane(active === 'workbench')}>{renderSlot('mathmodel.workbench', {})}</div>
          {(['training', 'competition', 'problems', 'cases', 'paper', 'profile'] as SectionId[]).map(
            (id) => (
              <div key={id} style={S.sectionPane(active === id)}>
                <Placeholder section={id} />
              </div>
            ),
          )}
        </div>
      </main>

      {/* ── right: native conversation ── */}
      <section style={S.chat}>
        <div style={S.chatHeader}>
          <span>Agent 对话（原生）</span>
          <span>/modeling-tutor 可用</span>
        </div>
        <div style={S.chatBody}>{renderSlot('conversation', {})}</div>
      </section>

      <div style={{ display: 'none' }} aria-hidden>
        {renderSlot('details', {})}
      </div>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }} data-shell-overlay>
        {renderSlot('shell.overlay', {})}
      </div>
    </div>
  )
}

/* ---------- wiring ---------- */

function createLayoutStub() {
  return {
    toggleSidebar() {},
    openDetails() {},
    closeDetails() {},
  }
}

function readCurrentSessionId(): string | undefined {
  try {
    return currentCtx?.sessions?.list?.getSnapshot?.()?.current
  } catch {
    return undefined
  }
}

let currentCtx: ClientContext | undefined

export const inject = ['slots', 'sessions']

export function apply(ctx: ClientContext): void {
  currentCtx = ctx

  const disposeLayout = (
    ctx as unknown as { reflect: { provide: (n: string, v: unknown) => () => void } }
  ).reflect.provide('layout', createLayoutStub())

  const disposeRoot = ctx.slots.register(
    {
      name: 'root',
      children: {
        sidebar: { kind: 'single', scope: 'root' },
        conversation: { kind: 'single', scope: 'session-maybe' },
        details: { kind: 'single', scope: 'session' },
        'shell.overlay': { kind: 'list', scope: 'root' },
        'mathmodel.workbench': { kind: 'single', scope: 'session' },
      },
      inject: () => ({}),
    },
    ShellFrame,
  )

  ctx.effect(
    () => () => {
      disposeRoot()
      disposeLayout()
      if (currentCtx === ctx) currentCtx = undefined
    },
    'shell-v2: dispose',
  )
}
