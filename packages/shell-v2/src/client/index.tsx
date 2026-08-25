import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
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
 *
 * UX Review R1 lesson: the shell must FOLLOW the official body theme (light or
 * dark) — never hardcode a dark surface. Palette is derived from computed body
 * colors and refreshed via MutationObserver.
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

const NAV: { id: SectionId; label: string; icon: string }[] = [
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

/* ---------- theme palette ---------- */

type Palette = {
  bg: string
  fg: string
  border: string
  subtle: string
  cardBg: string
  muted: string
  accent: string
  accentSoft: string
}

function parseRgb(color: string): [number, number, number] {
  const m = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])]
  const hex = color.replace('#', '')
  if (hex.length >= 6) return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
  return [255, 255, 255]
}

const lum = ([r, g, b]: [number, number, number]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255
const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r},${g},${b},${a})`

function derivePalette(): Palette {
  const cs = getComputedStyle(document.body)
  const bg = cs.backgroundColor || 'rgb(255,255,255)'
  const fg = cs.color || 'rgb(15,17,21)'
  const bgC = parseRgb(bg)
  const fgC = parseRgb(fg)
  const light = lum(bgC) > 0.5
  return {
    bg,
    fg,
    border: rgba(fgC, light ? 0.14 : 0.16),
    subtle: rgba(fgC, light ? 0.05 : 0.06),
    cardBg: light ? 'rgba(255,255,255,0.85)' : rgba(fgC, 0.05),
    muted: rgba(fgC, 0.58),
    accent: light ? '#3f66f0' : '#7c9cff',
    accentSoft: rgba(light ? [63, 102, 240] : [124, 156, 255], 0.14),
  }
}

function useThemePalette(): Palette {
  const [pal, setPal] = useState<Palette>(derivePalette)
  useEffect(() => {
    const recompute = () => setPal(derivePalette())
    const obs = new MutationObserver(recompute)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
    return () => obs.disconnect()
  }, [])
  return pal
}

/* ---------- styles (palette-driven) ---------- */

function styles(pal: Palette) {
  return {
    frame: {
      display: 'grid',
      gridTemplateColumns: '236px minmax(0, 1.15fr) minmax(380px, 1fr)',
      height: '100%',
      width: '100%',
      background: pal.bg,
      color: pal.fg,
      overflow: 'hidden',
    } as CSSProperties,
    nav: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      borderRight: `1px solid ${pal.border}`,
      overflow: 'hidden',
    } as CSSProperties,
    brand: {
      padding: '14px 16px 12px',
      borderBottom: `1px solid ${pal.border}`,
    } as CSSProperties,
    brandTitle: { fontWeight: 700, fontSize: 15, letterSpacing: 0.2 } as CSSProperties,
    brandSub: { fontSize: 11, color: pal.muted, marginTop: 3 } as CSSProperties,
    navList: { padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 } as CSSProperties,
    navItem: (active: boolean): CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '7px 10px',
      borderRadius: 8,
      fontSize: 13,
      cursor: 'pointer',
      userSelect: 'none',
      color: active ? pal.accent : pal.fg,
      background: active ? pal.accentSoft : 'transparent',
      fontWeight: active ? 600 : 400,
      opacity: active ? 1 : 0.82,
      transition: 'background 120ms ease, opacity 120ms ease',
    }),
    navSeat: {
      flex: 1,
      minHeight: 0,
      overflow: 'auto',
      borderTop: `1px solid ${pal.border}`,
    } as CSSProperties,
    main: {
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${pal.border}`,
      overflow: 'hidden',
    } as CSSProperties,
    mainHeader: {
      padding: '10px 16px',
      borderBottom: `1px solid ${pal.border}`,
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
    } as CSSProperties,
    mainTitle: { fontSize: 14, fontWeight: 600 } as CSSProperties,
    mainSub: { fontSize: 12, color: pal.muted } as CSSProperties,
    mainBody: { flex: 1, minHeight: 0, position: 'relative' } as CSSProperties,
    sectionPane: (visible: boolean): CSSProperties => ({
      position: 'absolute',
      inset: 0,
      overflow: 'auto',
      display: visible ? 'block' : 'none',
    }),
    chat: { minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } as CSSProperties,
    chatHeader: {
      padding: '9px 14px',
      paddingRight: 96,
      borderBottom: `1px solid ${pal.border}`,
      fontSize: 12,
      color: pal.muted,
      display: 'flex',
      justifyContent: 'space-between',
    } as CSSProperties,
    chatBody: { flex: 1, minHeight: 0 } as CSSProperties,
    card: {
      border: `1px solid ${pal.border}`,
      borderRadius: 10,
      padding: '14px 16px',
      cursor: 'pointer',
      background: pal.cardBg,
      transition: 'border-color 120ms ease, transform 120ms ease',
    } as CSSProperties,
    badge: (color: string): CSSProperties => ({
      fontSize: 10,
      padding: '2px 8px',
      borderRadius: 999,
      color: '#fff',
      background: color,
    }),
    placeholder: {
      margin: 24,
      border: `1px dashed ${rgba(parseRgb(pal.fg), 0.3)}`,
      borderRadius: 12,
      padding: '48px 32px',
      textAlign: 'center',
    } as CSSProperties,
  }
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
  beginner: '#2e9e5b',
  intermediate: '#c77c1d',
  advanced: '#cc4b4b',
}

function Dashboard({ pal, onSelect }: { pal: Palette; onSelect: (modelId: string) => void }) {
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
      <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>
        注册表加载失败：{error}
        <button
          type="button"
          style={{ marginLeft: 12, cursor: 'pointer', color: pal.accent, border: 'none', background: 'none' }}
          onClick={() => location.reload()}
        >
          重试
        </button>
      </div>
    )
  if (!models)
    return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载注册表…</div>

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
          data-mm-card={m.id}
          onClick={() => onSelect(m.id)}
          title="点击进入建模工作台"
          style={styles(pal).card}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = pal.accent
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = pal.border
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{m.name_zh || m.name}</strong>
            <span style={styles(pal).badge(DIFFICULTY_COLOR[m.difficulty ?? ''] ?? pal.muted)}>
              {m.difficulty ?? '—'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: pal.muted, marginTop: 2 }}>{m.name}</div>
          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8, lineHeight: 1.55 }}>{m.summary ?? ''}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- placeholder ---------- */

function Placeholder({ pal, section }: { pal: Palette; section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div style={styles(pal).placeholder}>
      <div style={{ fontSize: 34 }}>{NAV.find((n) => n.id === section)?.icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>{meta.title}</div>
      <p style={{ fontSize: 12, color: pal.muted, marginTop: 6 }}>
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
  const pal = useThemePalette()
  const S = styles(pal)
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
          <span style={S.mainTitle} data-mm-title>
            {SECTION_META[active].title}
          </span>
          <span style={S.mainSub}>{SECTION_META[active].sub}</span>
        </div>
        <div style={S.mainBody}>
          <div style={S.sectionPane(active === 'dashboard')} data-mm-section="dashboard">
            <Dashboard pal={pal} onSelect={selectModel} />
          </div>
          <div style={S.sectionPane(active === 'workbench')} data-mm-section="workbench">
            {renderSlot('mathmodel.workbench', {})}
          </div>
          {(['training', 'competition', 'problems', 'cases', 'paper', 'profile'] as SectionId[]).map(
            (id) => (
              <div key={id} style={S.sectionPane(active === id)} data-mm-section={id}>
                <Placeholder pal={pal} section={id} />
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
