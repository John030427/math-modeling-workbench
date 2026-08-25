import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * MathModel Shell — presentation-only product chrome.
 *
 * PRODUCT_UI_GATE alignment (MATHMODEL_PROFILE_PHASE3_PLAN.md P4):
 * - U1 single sidebar: MathModel nav ONLY; official ui-sidebar declared but not rendered.
 * - U2 workbench dominance: 232px | flexible | FIXED 400px Agent (never half screen).
 * - U3 IA per PRD §7 (概览/学习/训练/竞赛/论文/个人).
 * - U4 marks the dedicated-shell host so dsh-mathmodeling skips compat registrations
 *   (no duplicate「数模工作台」conversation tab). Flag is set at module evaluation time;
 *   suite patch orders this entry BEFORE dsh-mathmodeling.
 * - U5 no permanent fourth column (details stays non-rendered; Agent collapses to a
 *   drawer under 1180px instead of shrinking the workbench).
 * - U6 product dashboard (task-oriented, not a raw algorithm list).
 * - U7 Model Atlas: task-grouped, searchable, K-Means lesson link.
 */

const API = '/api/mathmodeling'
const NAV_KEY = 'mm-shell.section'

/* shell-host marker: evaluated at module load, before dsh-mathmodeling apply */
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__MM_SHELL_HOST__ = true
  document.documentElement.dataset.mmShellHost = '1'
}

type SectionId =
  | 'dashboard'
  | 'atlas'
  | 'lesson'
  | 'review'
  | 'gym'
  | 'competition'
  | 'problems'
  | 'cases'
  | 'lab'
  | 'paper'
  | 'reviewer'
  | 'profile'

type NavItem = { id: SectionId; label: string; icon: string }
type NavGroup = { group: string; items: NavItem[] }

const NAV: NavGroup[] = [
  { group: '概览', items: [{ id: 'dashboard', label: 'Dashboard', icon: '🏠' }] },
  {
    group: '学习',
    items: [
      { id: 'atlas', label: '模型地图', icon: '🗺️' },
      { id: 'review', label: '今日复习', icon: '🔁' },
    ],
  },
  { group: '训练', items: [{ id: 'gym', label: '专项训练', icon: '🏋️' }] },
  {
    group: '竞赛',
    items: [
      { id: 'competition', label: '比赛工作台', icon: '🏆' },
      { id: 'problems', label: '题库 / 真题', icon: '📝' },
      { id: 'cases', label: '优秀案例', icon: '📚' },
      { id: 'lab', label: 'Algorithm Lab', icon: '🧮' },
    ],
  },
  {
    group: '论文',
    items: [
      { id: 'paper', label: 'Paper Lab', icon: '✍️' },
      { id: 'reviewer', label: '论文评审', icon: '🔍' },
    ],
  },
  { group: '个人', items: [{ id: 'profile', label: '能力画像', icon: '👤' }] },
]

const ALL_ITEMS: NavItem[] = NAV.flatMap((g) => g.items)

const SECTION_META: Record<SectionId, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: '今天最值得继续什么？' },
  atlas: { title: '模型地图', sub: 'Task × Family × Algorithm · 搜索与掌握度' },
  lesson: { title: '课程', sub: '参考课：K-Means · 交互 Demo · Quiz · 掌握度' },
  review: { title: '今日复习', sub: '薄弱知识单元驱动' },
  gym: { title: '专项训练 Modeling Gym', sub: '拆题 → 提案 → 反馈' },
  competition: { title: '比赛工作台', sub: '读题 → 拆解 → Data Doctor → 选型 → 验证' },
  problems: { title: '题库 / 真题', sub: '按赛题类型组织' },
  cases: { title: '优秀案例', sub: '获奖论文的结构化蒸馏' },
  lab: { title: 'Algorithm Lab', sub: '实验记录：参数 · 种子 · 指标 · 产物' },
  paper: { title: 'Paper Lab', sub: '论文写作与模板' },
  reviewer: { title: '论文评审', sub: '训练用评分 Rubric · 差距分析' },
  profile: { title: '能力画像', sub: '维度掌握度与训练建议' },
}

function loadSection(): SectionId {
  try {
    const v = sessionStorage.getItem(NAV_KEY) as SectionId | null
    if (v && ALL_ITEMS.some((n) => n.id === v)) return v
  } catch {
    /* ignore */
  }
  return 'dashboard'
}

/* ---------- theme palette (proven in shell-v2) ---------- */

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
  if (hex.length >= 6)
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
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
    const obs = new MutationObserver(() => setPal(derivePalette()))
    obs.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
    return () => obs.disconnect()
  }, [])
  return pal
}

/* ---------- registry / atlas ---------- */

type RegistryModel = {
  id: string
  name: string
  name_zh?: string
  difficulty?: string
  summary?: string
}

/** Derived Task grouping until registry gains task/family fields (documented heuristic). */
const TASK_GROUPS: { task: string; match: RegExp }[] = [
  { task: '聚类', match: /kmeans|dbscan|hierarchical/i },
  { task: '预测 / 时序', match: /arima|forecast|time.?series/i },
  { task: '评价 / 决策', match: /ahp|topsis|entropy/i },
  { task: '优化', match: /\blp\b|milp|pso|optim/i },
  { task: '机器学习', match: /regression|forest|xgboost|boost/i },
]

function taskOf(id: string): string {
  for (const g of TASK_GROUPS) if (g.match.test(id)) return g.task
  return '其他'
}

const DIFF_COLOR: Record<string, string> = {
  beginner: '#2e9e5b',
  intermediate: '#c77c1d',
  advanced: '#cc4b4b',
}

function useRegistry() {
  const [models, setModels] = useState<RegistryModel[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    fetch(`${API}/registry`)
      .then((r) => r.json())
      .then((d) => alive && setModels(d.models ?? []))
      .catch((e) => alive && setError(String(e)))
    return () => {
      alive = false
    }
  }, [])
  return { models, error }
}

/* ---------- dashboard (U6) ---------- */

function Dashboard({
  pal,
  onNavigate,
}: {
  pal: Palette
  onNavigate: (id: SectionId) => void
}) {
  const S = styles(pal)
  const primary: { title: string; desc: string; target: SectionId; cta: string }[] = [
    { title: '继续学习', desc: 'K-Means 参考课 · feature-scaling', target: 'lesson', cta: '进入课程' },
    { title: '今日复习', desc: '薄弱知识单元 · 到期队列', target: 'review', cta: '开始复习' },
    { title: '继续比赛项目', desc: '暂无进行中项目', target: 'competition', cta: '查看工作台' },
  ]
  const modules: { title: string; desc: string; target: SectionId; icon: string }[] = [
    { title: '模型地图', desc: 'Task × Family × Algorithm', target: 'atlas', icon: '🗺️' },
    { title: '专项训练', desc: 'Modeling Gym 拆题训练', target: 'gym', icon: '🏋️' },
    { title: '比赛工作台', desc: 'Data Doctor · 选型 · 验证', target: 'competition', icon: '🏆' },
    { title: '题库 / 真题', desc: '按赛题类型组织', target: 'problems', icon: '📝' },
    { title: '优秀案例', desc: '获奖论文结构化蒸馏', target: 'cases', icon: '📚' },
    { title: '论文评审', desc: 'Rubric 评分 · 差距分析', target: 'reviewer', icon: '🔍' },
  ]
  return (
    <div style={{ padding: '22px 26px', overflow: 'auto', height: '100%' }}>
      <h1 style={{ fontSize: 18, margin: '0 0 4px' }}>今天最值得继续什么？</h1>
      <p style={{ fontSize: 12.5, color: pal.muted, margin: '0 0 18px' }}>
        学习 → 训练 → 实战 → 评审 → 诊断 → 再训练
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {primary.map((c) => (
          <div
            key={c.title}
            style={{ ...S.card, padding: '16px 18px', borderColor: rgba(parseRgb(pal.accent.startsWith('#') ? pal.accent : '#3f66f0'), 0.35), cursor: 'pointer' }}
            onClick={() => onNavigate(c.target)}
          >
            <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: pal.muted, marginTop: 5 }}>{c.desc}</div>
            <div style={{ fontSize: 12, color: pal.accent, marginTop: 10, fontWeight: 600 }}>{c.cta} →</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>模块入口</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
        {modules.map((m) => (
          <div key={m.title} style={{ ...S.card, padding: '12px 14px', cursor: 'pointer' }} onClick={() => onNavigate(m.target)}>
            <div style={{ fontSize: 18 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{m.title}</div>
            <div style={{ fontSize: 11, color: pal.muted, marginTop: 3 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div
        style={{ ...S.card, marginTop: 20, padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => onNavigate('profile')}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>当前薄弱项</div>
          <div style={{ fontSize: 12, color: pal.muted, marginTop: 3 }}>
            完成 Quiz 与评审后，这里会给出最值得训练的知识单元
          </div>
        </div>
        <div style={{ fontSize: 12, color: pal.accent, fontWeight: 600 }}>能力画像 →</div>
      </div>
    </div>
  )
}

/* ---------- atlas (U7) ---------- */

function Atlas({
  pal,
  onSelect,
}: {
  pal: Palette
  onSelect: (modelId: string) => void
}) {
  const S = styles(pal)
  const { models, error } = useRegistry()
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    if (!models) return []
    const q = query.trim().toLowerCase()
    const filtered = models.filter(
      (m) =>
        !q ||
        m.id.toLowerCase().includes(q) ||
        (m.name ?? '').toLowerCase().includes(q) ||
        (m.name_zh ?? '').includes(q),
    )
    const byTask = new Map<string, RegistryModel[]>()
    for (const m of filtered) {
      const t = taskOf(m.id)
      if (!byTask.has(t)) byTask.set(t, [])
      byTask.get(t)!.push(m)
    }
    return [...byTask.entries()]
  }, [models, query])

  if (error)
    return (
      <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>注册表加载失败：{error}</div>
    )
  if (!models) return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载注册表…</div>

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索算法（如 kmeans / 聚类 / TOPSIS）"
        style={{
          width: 'min(420px, 100%)',
          padding: '8px 12px',
          fontSize: 13,
          borderRadius: 8,
          border: `1px solid ${pal.border}`,
          background: pal.cardBg,
          color: pal.fg,
          outline: 'none',
          marginBottom: 16,
        }}
      />
      {grouped.map(([task, list]) => (
        <div key={task} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: pal.muted, marginBottom: 8, letterSpacing: 0.4 }}>
            {task.toUpperCase()} · {list.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
            {list.map((m) => (
              <div
                key={m.id}
                data-mm-atlas-card={m.id}
                style={{ ...S.card, padding: '12px 14px', cursor: 'pointer' }}
                onClick={() => onSelect(m.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = pal.accent
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = pal.border
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 13 }}>{m.name_zh || m.name}</strong>
                  <span style={S.badge(DIFF_COLOR[m.difficulty ?? ''] ?? pal.muted)}>{m.difficulty ?? '—'}</span>
                </div>
                <div style={{ fontSize: 11, color: pal.muted, marginTop: 2 }}>{m.name}</div>
                <p style={{ fontSize: 12, opacity: 0.8, margin: '7px 0 0', lineHeight: 1.5 }}>{m.summary}</p>
                <div style={{ fontSize: 11, color: pal.muted, marginTop: 8, display: 'flex', gap: 10 }}>
                  <span>掌握度：未测验</span>
                  {m.id === 'kmeans' && <span style={{ color: pal.accent, fontWeight: 600 }}>参考课 →</span>}
                </div>
              </div>
            ))}
          </div>
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
      <div style={{ fontSize: 34 }}>{ALL_ITEMS.find((n) => n.id === section)?.icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>{meta.title}</div>
      <p style={{ fontSize: 12, color: pal.muted, marginTop: 6 }}>
        规划中 — 将在 PRODUCT_UI_GATE 通过后按 Phase 3 P7 路线交付
      </p>
    </div>
  )
}

/* ---------- styles ---------- */

function styles(pal: Palette) {
  const bordered: CSSProperties = {
    border: `1px solid ${pal.border}`,
    borderRadius: 10,
    background: pal.cardBg,
  }
  return {
    frame: {
      display: 'grid',
      gridTemplateColumns: '232px minmax(0, 1fr) 400px',
      height: '100%',
      width: '100%',
      background: pal.bg,
      color: pal.fg,
      overflow: 'hidden',
    } as CSSProperties,
    frameNarrow: {
      display: 'grid',
      gridTemplateColumns: '220px minmax(0, 1fr)',
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
    brand: { padding: '14px 16px 12px', borderBottom: `1px solid ${pal.border}` } as CSSProperties,
    brandTitle: { fontWeight: 700, fontSize: 15 } as CSSProperties,
    brandSub: { fontSize: 11, color: pal.muted, marginTop: 3 } as CSSProperties,
    navList: { padding: '6px 8px 12px', flex: 1, overflow: 'auto' } as CSSProperties,
    navGroup: {
      fontSize: 10.5,
      fontWeight: 700,
      color: pal.muted,
      letterSpacing: 0.8,
      padding: '10px 10px 4px',
    } as CSSProperties,
    navItem: (active: boolean): CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '6px 10px',
      borderRadius: 8,
      fontSize: 13,
      cursor: 'pointer',
      userSelect: 'none',
      color: active ? pal.accent : pal.fg,
      background: active ? pal.accentSoft : 'transparent',
      fontWeight: active ? 600 : 400,
      opacity: active ? 1 : 0.82,
    }),
    main: {
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
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
    pane: (visible: boolean): CSSProperties => ({
      position: 'absolute',
      inset: 0,
      overflow: 'auto',
      display: visible ? 'block' : 'none',
    }),
    chatCol: {
      minWidth: 0,
      borderLeft: `1px solid ${pal.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    } as CSSProperties,
    chatHeader: {
      padding: '8px 14px',
      borderBottom: `1px solid ${pal.border}`,
      fontSize: 12,
      color: pal.muted,
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: 16,
    } as CSSProperties,
    chatBody: { flex: 1, minHeight: 0 } as CSSProperties,
    fab: {
      position: 'fixed',
      right: 18,
      bottom: 18,
      zIndex: 60,
      borderRadius: 999,
      border: `1px solid ${pal.border}`,
      background: pal.cardBg,
      color: pal.fg,
      padding: '9px 16px',
      fontSize: 13,
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    } as CSSProperties,
    card: { ...bordered, transition: 'border-color 120ms ease' } as CSSProperties,
    badge: (color: string): CSSProperties => ({
      fontSize: 10,
      padding: '2px 8px',
      borderRadius: 999,
      color: '#fff',
      background: color,
      whiteSpace: 'nowrap',
    }),
    placeholder: {
      margin: 24,
      border: `1px dashed ${rgba(parseRgb(pal.fg), 0.3)}`,
      borderRadius: 12,
      padding: '44px 30px',
      textAlign: 'center',
    } as CSSProperties,
  }
}

/* ---------- frame ---------- */

type FrameProps = {
  renderSlot: (key: string, owner: Record<string, unknown>) => ReactNode
}

function ShellFrame({ renderSlot }: FrameProps) {
  const pal = useThemePalette()
  const S = styles(pal)
  const [active, setActive] = useState<SectionId>(loadSection)
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 1180 : false,
  )
  const [agentOpen, setAgentOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 1180 : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1180px)')
    const onChange = () => {
      setNarrow(mq.matches)
      if (!mq.matches) setAgentOpen(true)
      else setAgentOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const navigate = (id: SectionId) => {
    setActive(id)
    try {
      sessionStorage.setItem(NAV_KEY, id)
    } catch {
      /* ignore */
    }
  }

  const selectModel = (modelId: string) => {
    const sid = readCurrentSessionId()
    void fetch(`${API}/context`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: 'atlas', model_id: modelId, ...(sid ? { session_id: sid } : {}) }),
    }).catch(() => {})
    navigate('lesson')
  }

  const agentStyle: CSSProperties = narrow
    ? {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(400px, 92vw)',
        zIndex: 70,
        background: pal.bg,
        display: agentOpen ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '-8px 0 28px rgba(0,0,0,0.22)',
      }
    : { ...S.chatCol, display: 'flex' }

  return (
    <div data-mm-shell="v3" style={narrow ? S.frameNarrow : S.frame}>
      {/* ── left: THE single MathModel sidebar ── */}
      <aside style={S.nav} data-mm-nav="single">
        <div style={S.brand}>
          <div style={S.brandTitle}>📐 MathModel Harness</div>
          <div style={S.brandSub}>learn → practice → solve → review</div>
        </div>
        <nav style={S.navList} data-mm-navlist>
          {NAV.map((g) => (
            <div key={g.group}>
              <div style={S.navGroup}>{g.group}</div>
              {g.items.map((n) => (
                <div
                  key={n.id}
                  style={S.navItem(active === n.id)}
                  onClick={() => navigate(n.id)}
                  role="tab"
                  aria-selected={active === n.id}
                >
                  <span style={{ fontSize: 14 }}>{n.icon}</span>
                  <span>{n.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── center: dominant workbench ── */}
      <main style={S.main} data-mm-main>
        <div style={S.mainHeader}>
          <span style={S.mainTitle} data-mm-title>
            {SECTION_META[active].title}
          </span>
          <span style={S.mainSub}>{SECTION_META[active].sub}</span>
        </div>
        <div style={S.mainBody}>
          <div style={S.pane(active === 'dashboard')} data-mm-section="dashboard">
            <Dashboard pal={pal} onNavigate={navigate} />
          </div>
          <div style={S.pane(active === 'atlas')} data-mm-section="atlas">
            <Atlas pal={pal} onSelect={selectModel} />
          </div>
          <div style={S.pane(active === 'lesson')} data-mm-section="lesson">
            {renderSlot('mathmodel.workbench', {})}
          </div>
          {(['review', 'gym', 'competition', 'problems', 'cases', 'lab', 'paper', 'reviewer', 'profile'] as SectionId[]).map(
            (id) => (
              <div key={id} style={S.pane(active === id)} data-mm-section={id}>
                <Placeholder pal={pal} section={id} />
              </div>
            ),
          )}
        </div>
      </main>

      {/* ── right: native Agent — single mount, drawer when narrow ── */}
      <section style={agentStyle} data-mm-agent data-mm-agent-open={agentOpen ? '1' : '0'}>
        <div style={S.chatHeader}>
          <span>Modeling Agent（原生）</span>
          <span>
            {narrow && (
              <button
                type="button"
                onClick={() => setAgentOpen(false)}
                style={{ border: 'none', background: 'none', color: pal.fg, cursor: 'pointer', fontSize: 12 }}
              >
                收起 ✕
              </button>
            )}
          </span>
        </div>
        <div style={S.chatBody}>{renderSlot('conversation', {})}</div>
      </section>
      {narrow && !agentOpen && (
        <button type="button" style={S.fab} onClick={() => setAgentOpen(true)} data-mm-agent-fab>
          💬 Agent
        </button>
      )}

      {/* official seats declared for boot-safety:
          - sidebar intentionally NOT rendered (U1 single MathModel sidebar)
          - details stays non-rendered (U5 no permanent fourth column)
          - shell.overlay stays VISIBLE (official floating layers mount here) */}
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

let currentCtx: ClientContext | undefined

function readCurrentSessionId(): string | undefined {
  try {
    return currentCtx?.sessions?.list?.getSnapshot?.()?.current
  } catch {
    return undefined
  }
}

export const inject = ['slots', 'sessions']

export function apply(ctx: ClientContext): void {
  currentCtx = ctx

  // layout stub kept: ui-sidebar (still bundled) resolves its inject against it
  const disposeLayout = (
    ctx as unknown as { reflect: { provide: (n: string, v: unknown) => () => void } }
  ).reflect.provide('layout', { toggleSidebar() {}, openDetails() {}, closeDetails() {} })

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
    'mathmodel-shell: dispose',
  )
}
