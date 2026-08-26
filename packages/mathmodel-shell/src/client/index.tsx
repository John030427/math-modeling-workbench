import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * MathModel Shell — presentation-only product chrome (overnight MVP).
 *
 * P0.2 session switcher · P1 real registry/mastery · P4 competition stages ·
 * P5 daily review / gym / profile · P7 paper lab + reviewer + claims.
 * Layout: 232px | flexible | 400px (U2); single MathModel sidebar (U1);
 * compat-gated domain (U4); responsive drawer (U7).
 */

const API = '/api/mathmodeling'
const NAV_KEY = 'mm-shell.section'

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
  | 'literature'
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
      { id: 'literature', label: '文献研究', icon: '📖' },
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
  review: { title: '今日复习', sub: '薄弱知识单元 · 到期队列 · 错题' },
  gym: { title: '专项训练 Modeling Gym', sub: '提案 → 教练提示 → 维度反馈' },
  competition: { title: '比赛工作台', sub: '契约 → 数据诊断 → 特征 → 选型 → 实验 → 验证' },
  problems: { title: '题库 / 真题', sub: '资源注册表（外链 + 元数据）' },
  cases: { title: '优秀案例', sub: '结构化蒸馏案例' },
  lab: { title: 'Algorithm Lab', sub: '独立算法实验台' },
  paper: { title: 'Paper Lab', sub: '提纲 · 证据声明（claim → run 链）' },
  literature: { title: '文献研究', sub: '真实文献检索 · 截止日隔离 · 方法族综合' },
  reviewer: { title: '论文评审', sub: '12 维 Rubric → 发现 → 差距分析' },
  profile: { title: '能力画像', sub: '掌握度 · 错题 · 评审弱点 · 训练记录' },
}

/* ---------------- theme palette ---------------- */

type Palette = {
  bg: string
  fg: string
  border: string
  cardBg: string
  muted: string
  accent: string
  accentSoft: string
  danger: string
  warn: string
  ok: string
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
    cardBg: light ? 'rgba(255,255,255,0.85)' : rgba(fgC, 0.05),
    muted: rgba(fgC, 0.58),
    accent: light ? '#3f66f0' : '#7c9cff',
    accentSoft: rgba(light ? [63, 102, 240] : [124, 156, 255], 0.14),
    danger: '#cc4b4b',
    warn: '#c77c1d',
    ok: '#2e9e5b',
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

/* ---------------- api helpers ---------------- */

async function jget(url: string) {
  const r = await fetch(url)
  return r.json()
}
async function jsend(method: string, url: string, body: unknown) {
  const r = await fetch(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  return r.json()
}

type RegistryModel = {
  id: string
  name: string
  name_zh?: string
  task?: string
  family?: string
  difficulty?: string
  knowledge_units?: string[]
  summary?: string
}

type MasteryRow = { item_type: string; item_id: string; score: number; next_review?: string | null }
type ReviewItem = { item_type: string; item_id: string; score: number | null; reasons: string[]; priority: number }
type ProjectSummary = { project_id: string; name: string; stage: string; updated_at: string }

function useRegistry() {
  const [models, setModels] = useState<RegistryModel[] | null>(null)
  useEffect(() => {
    let alive = true
    jget(`${API}/registry`).then((d) => alive && setModels(d.models ?? []))
    return () => {
      alive = false
    }
  }, [])
  return models
}

function useMasteryMap() {
  const [rows, setRows] = useState<MasteryRow[] | null>(null)
  const refresh = () => jget(`${API}/mastery?user_id=demo`).then((d) => setRows(d.mastery ?? []))
  useEffect(() => {
    refresh()
  }, [])
  return { rows, refresh }
}

function masteryForModel(rows: MasteryRow[] | null, m: RegistryModel): number | null {
  if (!rows || !m.knowledge_units || m.knowledge_units.length === 0) return null
  const byId = new Map(rows.filter((r) => r.item_type === 'ku').map((r) => [r.item_id, r.score]))
  const scores = m.knowledge_units.map((ku) => byId.get(ku)).filter((s) => typeof s === 'number') as number[]
  if (scores.length === 0) return null
  return Math.round((scores.reduce((s, x) => s + x, 0) / scores.length) * 10) / 10
}

/* ---------------- shared UI bits ---------------- */

function Card(props: { pal: Palette; children: ReactNode; onClick?: () => void; style?: CSSProperties; 'data-mm-atlas-card'?: string }) {
  const { pal } = props
  return (
    <div
      onClick={props.onClick}
      data-mm-atlas-card={props['data-mm-atlas-card']}
      style={{
        border: `1px solid ${pal.border}`,
        borderRadius: 10,
        background: pal.cardBg,
        padding: '12px 14px',
        ...(props.onClick ? { cursor: 'pointer' } : {}),
        ...props.style,
      }}
      onMouseEnter={(e) => props.onClick && (e.currentTarget.style.borderColor = pal.accent)}
      onMouseLeave={(e) => props.onClick && (e.currentTarget.style.borderColor = pal.border)}
    >
      {props.children}
    </div>
  )
}

function Btn(props: { pal: Palette; children: ReactNode; onClick?: () => void; primary?: boolean; disabled?: boolean }) {
  const { pal } = props
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      style={{
        padding: '6px 14px',
        fontSize: 12.5,
        borderRadius: 8,
        cursor: props.disabled ? 'default' : 'pointer',
        border: `1px solid ${props.primary ? pal.accent : pal.border}`,
        background: props.primary ? pal.accent : 'transparent',
        color: props.primary ? '#fff' : pal.fg,
        opacity: props.disabled ? 0.5 : 1,
      }}
    >
      {props.children}
    </button>
  )
}

function Field(props: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 12, marginBottom: 10 }}>
      <div style={{ color: 'inherit', opacity: 0.7, marginBottom: 4 }}>{props.label}</div>
      {props.children}
    </label>
  )
}

const inputStyle = (pal: Palette): CSSProperties => ({
  width: '100%',
  padding: '7px 10px',
  fontSize: 12.5,
  borderRadius: 8,
  border: `1px solid ${pal.border}`,
  background: 'transparent',
  color: pal.fg,
  outline: 'none',
  boxSizing: 'border-box',
})

function MasteryChip({ pal, value }: { pal: Palette; value: number | null }) {
  if (value === null)
    return <span style={{ fontSize: 11, color: pal.muted }}>掌握度：未测验</span>
  const color = value >= 70 ? pal.ok : value >= 45 ? pal.warn : pal.danger
  return (
    <span style={{ fontSize: 11, color }}>
      掌握度 <strong>{value}%</strong>
    </span>
  )
}

/* ---------------- dashboard (real state) ---------------- */

function Dashboard({
  pal,
  onNavigate,
}: {
  pal: Palette
  onNavigate: (id: SectionId) => void
}) {
  const [queue, setQueue] = useState<ReviewItem[]>([])
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [profile, setProfile] = useState<any>(null)
  const models = useRegistry()
  const mastery = useMasteryMap()

  useEffect(() => {
    jget(`${API}/review/queue?limit=5`).then((d) => setQueue(d.queue ?? []))
    jget(`${API}/projects`).then((d) => setProjects(d.projects ?? []))
    jget(`${API}/profile?user_id=demo`).then((d) => setProfile(d))
  }, [])

  const weakest = (profile?.weak_units ?? []).slice(0, 3)
  const kmeans = models?.find((m) => m.id === 'kmeans')
  const kmeansMastery = kmeans ? masteryForModel(mastery.rows, kmeans) : null

  const primary = [
    { title: '继续学习', desc: `K-Means 参考课 · 掌握度 ${kmeansMastery ?? '—'}%`, target: 'lesson' as SectionId, cta: '进入课程' },
    {
      title: '今日复习',
      desc: queue.length > 0 ? `${queue.length} 项待复习：${queue[0].item_id}` : '队列为空 — 完成 Quiz 生成复习项',
      target: 'review' as SectionId,
      cta: '开始复习',
    },
    {
      title: '继续比赛项目',
      desc: projects[0] ? `${projects[0].name} · 阶段 ${projects[0].stage}` : '暂无项目 — 在比赛工作台创建',
      target: 'competition' as SectionId,
      cta: projects[0] ? '继续项目' : '创建项目',
    },
  ]

  return (
    <div style={{ padding: '22px 26px', overflow: 'auto', height: '100%' }}>
      <h1 style={{ fontSize: 18, margin: '0 0 4px' }}>今天最值得继续什么？</h1>
      <p style={{ fontSize: 12.5, color: pal.muted, margin: '0 0 18px' }}>
        学习 → 训练 → 实战 → 评审 → 诊断 → 再训练
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {primary.map((c) => (
          <Card key={c.title} pal={pal} onClick={() => onNavigate(c.target)} style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: pal.muted, marginTop: 5 }}>{c.desc}</div>
            <div style={{ fontSize: 12, color: pal.accent, marginTop: 10, fontWeight: 600 }}>{c.cta} →</div>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>模块入口</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
        {[
          { title: '模型地图', desc: 'Task × Family × Algorithm', target: 'atlas', icon: '🗺️' },
          { title: '专项训练', desc: 'Gym 拆题训练', target: 'gym', icon: '🏋️' },
          { title: '比赛工作台', desc: '契约 → 实验 → 验证', target: 'competition', icon: '🏆' },
          { title: '题库 / 真题', desc: '资源注册表', target: 'problems', icon: '📝' },
          { title: '优秀案例', desc: '结构化蒸馏', target: 'cases', icon: '📚' },
          { title: '论文评审', desc: 'Rubric → 差距', target: 'reviewer', icon: '🔍' },
        ].map((m) => (
          <Card key={m.title} pal={pal} onClick={() => onNavigate(m.target as SectionId)} style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 18 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{m.title}</div>
            <div style={{ fontSize: 11, color: pal.muted, marginTop: 3 }}>{m.desc}</div>
          </Card>
        ))}
      </div>

      <Card pal={pal} style={{ marginTop: 20, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>当前薄弱项</div>
          <div style={{ fontSize: 12, color: pal.muted, marginTop: 4 }}>
            {weakest.length > 0
              ? weakest.map((w: any) => `${w.item_id} (${w.score}%)`).join(' · ')
              : '完成 Quiz 与评审后，这里会给出最值得训练的知识单元'}
          </div>
        </div>
        <Btn pal={pal} onClick={() => onNavigate('profile')}>
          能力画像 →
        </Btn>
      </Card>
    </div>
  )
}

/* ---------------- atlas (real task/family + mastery) ---------------- */

const TASK_LABEL: Record<string, string> = {
  clustering: '聚类',
  evaluation: '评价 / 决策',
  'time-series': '预测 / 时序',
  prediction: '预测',
  optimization: '优化',
  regression: '回归 / 预测',
  classification: '分类',
  simulation: '仿真',
  graph: '图 / 网络',
  spatial: '空间',
  preprocessing: '预处理',
  'feature-engineering': '特征工程',
  other: '其他',
}

function Atlas({ pal, onSelect }: { pal: Palette; onSelect: (modelId: string) => void }) {
  const S = styles(pal)
  const models = useRegistry()
  const mastery = useMasteryMap()
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    if (!models) return []
    const q = query.trim().toLowerCase()
    const filtered = models.filter(
      (m) =>
        !q ||
        m.id.toLowerCase().includes(q) ||
        (m.name ?? '').toLowerCase().includes(q) ||
        (m.name_zh ?? '').includes(q) ||
        (m.task ?? '').includes(q),
    )
    const byTask = new Map<string, RegistryModel[]>()
    for (const m of filtered) {
      const t = TASK_LABEL[m.task ?? 'other'] ?? m.task ?? '其他'
      if (!byTask.has(t)) byTask.set(t, [])
      byTask.get(t)!.push(m)
    }
    return [...byTask.entries()]
  }, [models, query])

  if (!models) return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载注册表…</div>

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索算法（如 kmeans / 聚类 / TOPSIS / 优化）"
        style={{ ...inputStyle(pal), width: 'min(420px, 100%)', marginBottom: 16 }}
      />
      {grouped.map(([task, list]) => (
        <div key={task} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: pal.muted, marginBottom: 8, letterSpacing: 0.4 }}>
            {task.toUpperCase()} · {list.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {list.map((m) => (
              <Card key={m.id} pal={pal} onClick={() => onSelect(m.id)} data-mm-atlas-card={m.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 13 }}>{m.name_zh || m.name}</strong>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, color: '#fff', background: m.difficulty === 'beginner' ? pal.ok : m.difficulty === 'advanced' ? pal.danger : pal.warn }}>
                    {m.difficulty ?? '—'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: pal.muted, marginTop: 2 }}>
                  {m.name} · {m.family ?? '—'}
                </div>
                <p style={{ fontSize: 12, opacity: 0.8, margin: '7px 0 0', lineHeight: 1.5 }}>{m.summary}</p>
                <div style={{ fontSize: 11, marginTop: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <MasteryChip pal={pal} value={masteryForModel(mastery.rows, m)} />
                  {m.id === 'kmeans' && (
                    <span style={{ color: pal.accent, fontWeight: 600 }}>参考课 →</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- daily review ---------------- */

function DailyReview({ pal }: { pal: Palette }) {
  const [queue, setQueue] = useState<ReviewItem[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  const load = () => jget(`${API}/review/queue?limit=30`).then((d) => setQueue(d.queue ?? []))
  useEffect(() => {
    load()
  }, [])

  const complete = async (item: ReviewItem, correct: boolean) => {
    setBusy(item.item_id)
    await jsend('POST', `${API}/review/complete`, { item_type: item.item_type === 'model' ? 'model' : 'ku', item_id: item.item_id, correct })
    await load()
    setBusy(null)
  }

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <p style={{ fontSize: 12.5, color: pal.muted, marginTop: 0 }}>
        队列来源：低掌握度 · 到期（SRS）· Quiz 错题 · 评审发现。完成后按记忆曲线重排。
      </p>
      {queue.length === 0 && (
        <Card pal={pal}>
          <div style={{ fontSize: 13 }}>队列为空 — 去 Atlas 完成 Quiz，或提交 Gym/评审生成薄弱项。</div>
        </Card>
      )}
      <div style={{ display: 'grid', gap: 10 }}>
        {queue.map((item) => (
          <Card key={`${item.item_type}:${item.item_id}`} pal={pal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {item.item_id}{' '}
                  <span style={{ fontSize: 11, color: pal.muted, fontWeight: 400 }}>
                    ({item.item_type === 'model' ? '模型' : item.item_type === 'ku' ? '知识单元' : item.item_type})
                  </span>
                </div>
                <div style={{ fontSize: 11, color: pal.muted, marginTop: 3 }}>
                  {item.score !== null && <span>掌握度 {item.score}% · </span>}
                  {item.reasons.join(' · ')} · 优先级 {item.priority}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn pal={pal} disabled={busy === item.item_id} onClick={() => complete(item, true)}>
                  记住了
                </Btn>
                <Btn pal={pal} disabled={busy === item.item_id} onClick={() => complete(item, false)}>
                  还不会
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------------- gym ---------------- */

type GymCase = { id: string; title: string; problem: string; dimensions: string[] }

function Gym({ pal }: { pal: Palette }) {
  const [cases, setCases] = useState<GymCase[]>([])
  const [active, setActive] = useState<GymCase | null>(null)
  const [sections, setSections] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    jget(`${API}/gym/cases`).then((d) => {
      setCases(d.cases ?? [])
      if ((d.cases ?? []).length > 0) setActive(d.cases[0])
    })
  }, [])

  const pick = (c: GymCase) => {
    setActive(c)
    setResult(null)
    setSections(Object.fromEntries((c.dimensions ?? []).map((d) => [d, ''])))
  }

  const submit = async () => {
    if (!active) return
    const proposal = Object.fromEntries((active.dimensions ?? []).map((d) => [d, sections[d] ?? '']))
    const r = await jsend('POST', `${API}/gym/submit/${active.id}`, { user_id: 'demo', proposal })
    setResult(r)
  }

  if (!active) return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载 Gym 案例…</div>

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {cases.map((c) => (
          <Btn key={c.id} pal={pal} primary={active.id === c.id} onClick={() => pick(c)}>
            {c.title}
          </Btn>
        ))}
      </div>

      <Card pal={pal} style={{ padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>题目</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{active.problem}</div>
      </Card>

      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>你的提案（按维度作答）</div>
      {(active.dimensions ?? []).map((d) => (
        <Field key={d} label={`【${d}】`}>
          <textarea
            rows={3}
            style={inputStyle(pal)}
            value={sections[d] ?? ''}
            onChange={(e) => setSections({ ...sections, [d]: e.target.value })}
          />
        </Field>
      ))}
      <Btn pal={pal} primary onClick={submit}>
        提交提案（先自评，参考答案在反馈后揭示）
      </Btn>

      {result && (
        <div style={{ marginTop: 18 }}>
          <Card pal={pal} style={{ padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              维度反馈 · 总分 {result.total}/{result.max}（{result.pct}%）
            </div>
          </Card>
          {result.dimensions.map((d: any) => (
            <Card key={d.dimension} pal={pal} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                {d.dimension} —{' '}
                <span style={{ color: d.score === 2 ? pal.ok : d.score === 1 ? pal.warn : pal.danger }}>
                  {d.score === 2 ? '覆盖良好' : d.score === 1 ? '部分覆盖' : '未覆盖'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: pal.muted, marginTop: 4 }}>💡 {d.hint}</div>
              {d.missing?.length > 0 && (
                <div style={{ fontSize: 11.5, color: pal.muted, marginTop: 3 }}>
                  建议补充关键词：{d.missing.join('、')}
                </div>
              )}
            </Card>
          ))}
          {result.reference_outline && (
            <Card pal={pal} style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>参考思路（已揭示）</div>
              {Object.entries(result.reference_outline).map(([k, v]) => (
                <div key={k} style={{ fontSize: 12, marginBottom: 5, lineHeight: 1.6 }}>
                  <strong>{k}：</strong>
                  {v as string}
                </div>
              ))}
              {result.training_recommendations?.length > 0 && (
                <div style={{ fontSize: 12, color: pal.accent, marginTop: 8 }}>
                  训练建议知识单元：{result.training_recommendations.join('、')}（已进入今日复习队列）
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------- SVG charts (dependency-free) ---------------- */

const CLUSTER_COLORS = ['#3f66f0', '#2e9e5b', '#c77c1d', '#8e44ad', '#e05656', '#16a085']

function FigureFrame({
  pal,
  caption,
  children,
  onSave,
}: {
  pal: Palette
  caption: string
  children: ReactNode
  onSave?: () => void
}) {
  return (
    <Card pal={pal} style={{ padding: '12px 14px', marginBottom: 12 }}>
      <svg viewBox="0 0 420 260" style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto', background: 'rgba(128,128,128,0.04)', borderRadius: 6 }}>
        {children}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8 }}>
        <div style={{ fontSize: 11.5, color: pal.muted, lineHeight: 1.5 }}>{caption}</div>
        {onSave && (
          <Btn pal={pal} onClick={onSave}>
            保存图表记录
          </Btn>
        )}
      </div>
    </Card>
  )
}

function axes(pal: Palette) {
  return (
    <g stroke={pal.border} strokeWidth={1}>
      <line x1={40} y1={220} x2={400} y2={220} />
      <line x1={40} y1={10} x2={40} y2={220} />
    </g>
  )
}

function ScatterClusters({
  pal,
  points,
  labels,
  centroids,
}: {
  pal: Palette
  points: number[][]
  labels: number[]
  centroids: number[][]
}) {
  const all = [...points, ...centroids]
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const sx = (v: number) => 50 + ((v - x0) / Math.max(1e-9, x1 - x0)) * 340
  const sy = (v: number) => 215 - ((v - y0) / Math.max(1e-9, y1 - y0)) * 195
  return (
    <g>
      {axes(pal)}
      {points.map((p, i) => (
        <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={4} fill={CLUSTER_COLORS[labels[i] % CLUSTER_COLORS.length]} opacity={0.85} />
      ))}
      {centroids.map((c, i) => (
        <g key={`c${i}`}>
          <line x1={sx(c[0]) - 7} y1={sy(c[1]) - 7} x2={sx(c[0]) + 7} y2={sy(c[1]) + 7} stroke={CLUSTER_COLORS[i % CLUSTER_COLORS.length]} strokeWidth={2.5} />
          <line x1={sx(c[0]) - 7} y1={sy(c[1]) + 7} x2={sx(c[0]) + 7} y2={sy(c[1]) - 7} stroke={CLUSTER_COLORS[i % CLUSTER_COLORS.length]} strokeWidth={2.5} />
        </g>
      ))}
      <text x={220} y={248} fontSize={11} fill={pal.muted} textAnchor="middle">
        特征空间散点（颜色 = 簇，× = 质心）
      </text>
    </g>
  )
}

function PredictedVsActual({
  pal,
  actual,
  predicted,
}: {
  pal: Palette
  actual: number[]
  predicted: number[]
}) {
  const all = [...actual, ...predicted, 0]
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const s = (v: number) => 50 + ((v - lo) / Math.max(1e-9, hi - lo)) * 340
  const sy = (v: number) => 215 - ((v - lo) / Math.max(1e-9, hi - lo)) * 195
  return (
    <g>
      {axes(pal)}
      <line x1={s(lo)} y1={sy(lo)} x2={s(hi)} y2={sy(hi)} stroke={pal.muted} strokeDasharray="4 3" />
      {actual.map((a, i) => (
        <circle key={i} cx={s(a)} cy={sy(predicted[i])} r={4.5} fill={pal.accent} opacity={0.9} />
      ))}
      <text x={230} y={248} fontSize={11} fill={pal.muted} textAnchor="middle">
        实际值（x）vs 预测值（y）· 虚线 = 完美预测
      </text>
    </g>
  )
}

function ConvergenceCurve({ pal, curve, seed }: { pal: Palette; curve: number[]; seed: number }) {
  const lo = Math.min(...curve)
  const hi = Math.max(...curve)
  const sx = (i: number) => 50 + (i / Math.max(1, curve.length - 1)) * 340
  const sy = (v: number) => 215 - ((v - lo) / Math.max(1e-9, hi - lo || 1)) * 195
  const path = curve.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i)},${sy(v)}`).join(' ')
  return (
    <g>
      {axes(pal)}
      <path d={path} fill="none" stroke={pal.accent} strokeWidth={2} />
      <circle cx={sx(curve.length - 1)} cy={sy(curve[curve.length - 1])} r={4} fill={pal.ok} />
      <text x={230} y={248} fontSize={11} fill={pal.muted} textAnchor="middle">
        收敛曲线（seed {seed}）· 迭代 → 最优目标值
      </text>
    </g>
  )
}

function BarList({ pal, items }: { pal: Palette; items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1e-9)
  return (
    <g>
      {items.map((it, i) => {
        const w = (it.value / max) * 300
        const y = 18 + i * ((200 / Math.max(1, items.length)))
        return (
          <g key={i}>
            <text x={38} y={y + 12} fontSize={10.5} fill={pal.muted} textAnchor="end">
              {it.label.length > 10 ? it.label.slice(0, 10) : it.label}
            </text>
            <rect x={44} y={y} width={Math.max(2, w)} height={16} fill={pal.accent} opacity={0.85} rx={3} />
            <text x={44 + Math.max(2, w) + 6} y={y + 12} fontSize={10.5} fill={pal.fg}>
              {it.value}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/** Derive a figure (type + data + caption) from a run. */
function figureFromRun(run: any) {
  const a = run.artifacts ?? {}
  const p = run.parameters ?? {}
  if (run.algorithm === 'kmeans' && a.labels && a.centroids) {
    return {
      type: 'scatter-clusters',
      caption: `K-Means 聚类散点（k=${p.k}，seeds=${(p.seeds ?? []).join('/')}，SSE 均值 ${run.metrics.sse_mean}）`,
      data: { points: p.points ?? [], labels: JSON.parse(a.labels), centroids: JSON.parse(a.centroids) },
    }
  }
  if (run.algorithm === 'linear-regression' && a.coefficients && a.residuals) {
    const w = JSON.parse(a.coefficients)
    const X = p.X ?? []
    const actual = p.y ?? []
    const predicted = X.map((row: number[]) => row.reduce((s, v, j) => s + v * w[j + 1], w[0]))
    return {
      type: 'predicted-vs-actual',
      caption: `线性回归 实际 vs 预测（R²=${run.metrics.r2}，n=${run.metrics.n}）`,
      data: { actual, predicted },
    }
  }
  if (run.algorithm === 'pso' && a.convergence_best_seed) {
    return {
      type: 'convergence',
      caption: `PSO 收敛曲线（${p.objective}，dims=${p.dims}，最优 ${run.metrics.best_overall}）`,
      data: { curve: JSON.parse(a.convergence_best_seed), seed: run.seed },
    }
  }
  if (run.algorithm === 'topsis' && a.closeness) {
    const closeness = JSON.parse(a.closeness)
    return {
      type: 'bars',
      caption: `TOPSIS 贴近度（${run.metrics.alternatives} 个方案）`,
      data: { items: closeness.map((c: number, i: number) => ({ label: `方案${i + 1}`, value: c })) },
    }
  }
  if (run.algorithm === 'entropy-weight' && a.weights) {
    const weights = JSON.parse(a.weights)
    return {
      type: 'bars',
      caption: '熵权法权重分布',
      data: { items: weights.map((w: number, i: number) => ({ label: `指标${i + 1}`, value: w })) },
    }
  }
  return null
}

function RunFigure({ pal, run, onSave }: { pal: Palette; run: any; onSave?: (fig: any) => void }) {
  const fig = useMemo(() => figureFromRun(run), [run])
  if (!fig)
    return (
      <Card pal={pal} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: pal.muted }}>
          该 run 无可绘制产物（{run.algorithm}）— 图表类型：散点聚类 / 实际vs预测 / 收敛曲线 / 权重条形。
        </div>
      </Card>
    )
  return (
    <FigureFrame
      pal={pal}
      caption={`${fig.caption} · run ${run.run_id.slice(0, 8)}…`}
      onSave={onSave ? () => onSave({ ...fig, run_id: run.run_id }) : undefined}
    >
      {fig.type === 'scatter-clusters' && (
        <ScatterClusters pal={pal} points={fig.data.points} labels={fig.data.labels} centroids={fig.data.centroids} />
      )}
      {fig.type === 'predicted-vs-actual' && <PredictedVsActual pal={pal} actual={fig.data.actual} predicted={fig.data.predicted} />}
      {fig.type === 'convergence' && <ConvergenceCurve pal={pal} curve={fig.data.curve} seed={fig.data.seed} />}
      {fig.type === 'bars' && <BarList pal={pal} items={fig.data.items} />}
    </FigureFrame>
  )
}

/* ---------------- deep lesson renderer ---------------- */

function DeepLesson({ pal, modelId }: { pal: Palette; modelId: string }) {
  const [lesson, setLesson] = useState<any>(null)
  const [missing, setMissing] = useState(false)
  const [picked, setPicked] = useState<Record<number, string>>({})
  useEffect(() => {
    setLesson(null)
    setMissing(false)
    setPicked({})
    jget(`${API}/lessons/${modelId}`).then((d) => {
      if (d.ok) setLesson(d.lesson)
      else setMissing(true)
    })
  }, [modelId])
  if (missing)
    return (
      <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
        <Card pal={pal}>
          <div style={{ fontSize: 13 }}>
            该模型暂无深度课程页 — 可在 Algorithm Lab 直接执行实验，或使用下方工作台。
          </div>
        </Card>
      </div>
    )
  if (!lesson) return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载课程…</div>
  const q = lesson.quiz ?? []
  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <h2 style={{ fontSize: 17, margin: '0 0 12px' }}>{lesson.title}</h2>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>⏱ 30 秒直觉</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>{lesson.intuition}</div>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>📌 真实建模场景</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>{lesson.scenario}</div>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>🧮 数学形式</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.8, fontFamily: 'Georgia, serif' }}>{lesson.math}</div>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>🔀 算法流程</div>
        <ol style={{ fontSize: 12.5, margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
          {(lesson.flow ?? []).map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>⚙️ 参数怎么设</div>
        {(lesson.params ?? []).map((p: any) => (
          <div key={p.name} style={{ fontSize: 12.5, marginBottom: 6, lineHeight: 1.6 }}>
            <strong>{p.name}</strong>：{p.meaning} — <span style={{ color: pal.muted }}>{p.how}</span>
          </div>
        ))}
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>✅ 适用 / ❌ 不适用</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.8 }}>
          {(lesson.use_avoid?.use ?? []).map((u: string) => (
            <div key={u}>✅ {u}</div>
          ))}
          {(lesson.use_avoid?.avoid ?? []).map((u: string) => (
            <div key={u} style={{ color: pal.warn }}>
              ❌ {u}
            </div>
          ))}
        </div>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>⚖️ Baseline 对照</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>{lesson.baseline_comparison}</div>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>💥 常见失败</div>
        <ul style={{ fontSize: 12.5, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {(lesson.failure_cases ?? []).map((f: string) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Card>
      <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>🔬 验证方法</div>
        <ul style={{ fontSize: 12.5, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          {(lesson.validation ?? []).map((v: string) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </Card>
      {(lesson.quiz ?? []).length > 0 && (
        <Card pal={pal} style={{ marginBottom: 10, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📝 Mini Quiz</div>
          {q.map((item: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 5 }}>
                {i + 1}. {item.q}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(item.options).map(([k, v]) => (
                  <Btn key={k} pal={pal} primary={picked[i] === k} onClick={() => setPicked({ ...picked, [i]: k })}>
                    {k}. {v as string}
                  </Btn>
                ))}
              </div>
              {picked[i] && (
                <div style={{ fontSize: 12, marginTop: 6, color: picked[i] === item.answer ? pal.ok : pal.danger }}>
                  {picked[i] === item.answer ? '✓ 正确 — ' : `✗ 正确答案 ${item.answer} — `}
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
      <Card pal={pal} style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>📄 真实论文/案例</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
          {lesson.paper_case?.title}
          <span style={{ color: pal.muted }}> — {lesson.paper_case?.note}</span>
        </div>
        <div style={{ fontSize: 12, color: pal.accent, marginTop: 8 }}>💡 {lesson.provider_note}</div>
      </Card>
      <div style={{ height: 20 }} />
    </div>
  )
}

/* ---------------- competition workbench ---------------- */

const STAGES = ['problem', 'decompose', 'data', 'features', 'selector', 'lab', 'viz', 'validation', 'review'] as const
const STAGE_LABEL: Record<string, string> = {
  problem: '题目',
  decompose: '问题契约',
  data: 'Data Doctor',
  features: '特征卡',
  selector: '选型 B/M/A',
  lab: '实验',
  viz: '可视化',
  validation: '验证',
  review: '评审',
}

function Competition({ pal, onNavigate }: { pal: Palette; onNavigate: (id: SectionId) => void }) {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [detail, setDetail] = useState<any>(null)
  const [stage, setStage] = useState<string>('decompose')
  const [notice, setNotice] = useState<string | null>(null)

  const loadProjects = () =>
    jget(`${API}/projects`).then((d) => {
      setProjects(d.projects ?? [])
      return d.projects ?? []
    })

  const openProject = (id: string) => {
    setActiveId(id)
    jget(`${API}/projects/${id}`).then((d) => {
      setDetail(d)
      setStage(d.project?.stage && STAGES.includes(d.project.stage) ? d.project.stage : 'decompose')
    })
  }

  // same-project refresh: update data WITHOUT clobbering the user's current stage
  const refreshDetail = () => {
    if (!activeId) return
    jget(`${API}/projects/${activeId}`).then(setDetail)
  }

  useEffect(() => {
    loadProjects().then((list) => {
      if (list.length > 0) openProject(list[0].project_id)
    })
  }, [])

  const createProject = async () => {
    const name = prompt('项目名称：', '新比赛项目')
    if (!name) return
    const d = await jsend('POST', `${API}/projects`, { name, session_id: 'competition' })
    await loadProjects()
    openProject(d.project.project_id)
  }

  const say = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(null), 4000)
  }

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <select
          value={activeId ?? ''}
          onChange={(e) => openProject(e.target.value)}
          style={{ ...inputStyle(pal), width: 260 }}
        >
          {projects.length === 0 && <option value="">（暂无项目）</option>}
          {projects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.name} · {p.stage}
            </option>
          ))}
        </select>
        <Btn pal={pal} onClick={createProject}>
          + 新建项目
        </Btn>
        {detail && (
          <span style={{ fontSize: 11.5, color: pal.muted }}>
            阶段：{STAGES.map((s) => (s === detail.project.stage ? `【${STAGE_LABEL[s]}】` : STAGE_LABEL[s])).join(' → ')}
          </span>
        )}
      </div>

      {notice && (
        <div style={{ fontSize: 12, color: pal.ok, marginBottom: 10 }}>{notice}</div>
      )}

      {!detail ? (
        <Card pal={pal}>
          <div style={{ fontSize: 13 }}>创建或选择一个项目开始。项目数据持久化在 workspace/ 下，刷新不丢。</div>
        </Card>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {STAGES.map((s) => (
              <Btn key={s} pal={pal} primary={stage === s} onClick={() => setStage(s)}>
                {STAGE_LABEL[s]}
              </Btn>
            ))}
          </div>

          {stage === 'decompose' && <ContractStage pal={pal} detail={detail} onDone={refreshDetail} say={say} />}
          {stage === 'data' && <DataStage pal={pal} detail={detail} onDone={refreshDetail} say={say} />}
          {stage === 'features' && <FeatureStage pal={pal} detail={detail} onDone={refreshDetail} say={say} />}
          {stage === 'selector' && <SelectorStage pal={pal} detail={detail} />}
          {stage === 'lab' && <LabStage pal={pal} detail={detail} onDone={refreshDetail} say={say} />}
          {stage === 'viz' && <VizStage pal={pal} detail={detail} say={say} />}
          {stage === 'validation' && <ValidationStage pal={pal} detail={detail} onDone={refreshDetail} say={say} />}
          {stage === 'review' && (
            <ReviewStage
              pal={pal}
              detail={detail}
              onDone={refreshDetail}
              say={say}
              onNavigate={onNavigate}
            />
          )}
          {stage === 'problem' && (
            <Card pal={pal}>
              <div style={{ fontSize: 13 }}>
                粘贴/导入题目文本后，进入「问题契约」拆解为 ReqID 条目。可让 Agent 使用 /problem-reader 技能辅助拆题。
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function ContractStage({ pal, detail, onDone, say }: any) {
  const contract = detail.contract
  const [rows, setRows] = useState<any[]>(
    contract?.entries ?? [{ req_id: 'R1', question: '', objective: '', inputs: '', outputs: '', constraints: '', assumptions: '' }],
  )
  const save = async (freeze = false) => {
    const entries = rows.map((r, i) => ({ ...r, req_id: r.req_id || `R${i + 1}` }))
    if (freeze) {
      await jsend('POST', `${API}/projects/${detail.project.project_id}/contract/freeze`, {})
      say('契约已冻结 — 下游已有实验标记 STALE')
    } else {
      await jsend('PUT', `${API}/projects/${detail.project.project_id}/contract`, { entries })
      say('契约已保存')
    }
    onDone()
  }
  return (
    <div>
      <p style={{ fontSize: 12, color: pal.muted, marginTop: 0 }}>
        Problem Contract Lite：每条 ReqID = 一个必须回答的子问题。冻结后修改会触发下游实验 STALE。
        {contract?.frozen && <strong style={{ color: pal.warn }}>（已冻结 {contract.frozen_at?.slice(0, 10)}）</strong>}
      </p>
      {rows.map((r, i) => (
        <Card key={i} pal={pal} style={{ marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input style={inputStyle(pal)} value={r.req_id} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, req_id: e.target.value } : x)))} placeholder="ReqID" />
            <input style={inputStyle(pal)} value={r.question} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} placeholder="子问题" />
            <input style={inputStyle(pal)} value={r.objective} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, objective: e.target.value } : x)))} placeholder="目标 / 产出" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <input style={inputStyle(pal)} value={r.inputs} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, inputs: e.target.value } : x)))} placeholder="输入（数据/字段）" />
            <input style={inputStyle(pal)} value={r.constraints} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, constraints: e.target.value } : x)))} placeholder="约束" />
            <input style={inputStyle(pal)} value={r.assumptions} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, assumptions: e.target.value } : x)))} placeholder="假设" />
          </div>
        </Card>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn pal={pal} onClick={() => setRows([...rows, { req_id: `R${rows.length + 1}`, question: '', objective: '', inputs: '', outputs: '', constraints: '', assumptions: '' }])}>
          + 条目
        </Btn>
        <Btn pal={pal} primary onClick={() => save(false)}>
          保存契约
        </Btn>
        <Btn pal={pal} onClick={() => save(true)} disabled={contract?.frozen}>
          冻结确认
        </Btn>
      </div>
    </div>
  )
}

function DataStage({ pal, detail, onDone, say }: any) {
  const [csv, setCsv] = useState(
    'month,sales,price,promo,target_sales\n1,1200,50,0,1180\n2,1350,50,1,1330\n3,1280,52,0,1290\n4,1500,49,1,1510\n5,900,55,0,880',
  )
  const [target, setTarget] = useState('target_sales')
  const [result, setResult] = useState<any>(detail.datadoctor)

  const run = async () => {
    const r = await jsend('POST', `${API}/projects/${detail.project.project_id}/datadoctor`, { csv, target })
    setResult(r)
    say('Data Doctor 诊断完成')
    onDone()
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 10 }}>
        <Field label="目标列（可选，用于泄漏检测）">
          <input style={{ ...inputStyle(pal), width: 200 }} value={target} onChange={(e) => setTarget(e.target.value)} />
        </Field>
        <Btn pal={pal} primary onClick={run}>
          运行 Data Doctor
        </Btn>
      </div>
      <Field label="CSV 数据（粘贴或导入）">
        <textarea rows={6} style={{ ...inputStyle(pal), fontFamily: 'monospace' }} value={csv} onChange={(e) => setCsv(e.target.value)} />
      </Field>

      {result && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            诊断结果 · {result.row_count} 行 × {result.columns.length} 列
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8, marginBottom: 12 }}>
            {result.columns.map((c: any) => (
              <Card key={c.name} pal={pal} style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                  {c.name} <span style={{ fontSize: 10.5, color: pal.muted }}>({c.type})</span>
                </div>
                <div style={{ fontSize: 11, color: pal.muted, marginTop: 4, lineHeight: 1.6 }}>
                  缺失 {c.missing}（{c.missing_pct}%）· 唯一 {c.unique}
                  {c.type === 'numeric' && (
                    <>
                      <br />
                      min {c.min} / max {c.max} · 离群 {c.outliers ?? 0}
                    </>
                  )}
                  {c.temporal_ordered !== undefined && (
                    <>
                      <br />
                      时间序：{c.temporal_ordered ? '单调递增' : '非单调'}
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {result.findings.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>发现</div>
              <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
                {result.findings.map((f: any, i: number) => (
                  <Card key={i} pal={pal} style={{ padding: '9px 12px', borderLeft: `3px solid ${f.severity === 'critical' ? pal.danger : f.severity === 'high' ? pal.danger : f.severity === 'medium' ? pal.warn : pal.border}` }}>
                    <span style={{ fontSize: 12 }}>
                      <strong>[{f.severity}]</strong> {f.column}：{f.detail}
                    </span>
                  </Card>
                ))}
              </div>
            </>
          )}
          {result.recommendations.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>建议动作（why / risk / 何时不用）</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {result.recommendations.map((r: any, i: number) => (
                  <Card key={i} pal={pal} style={{ padding: '9px 12px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{r.action}</div>
                    <div style={{ fontSize: 11, color: pal.muted, marginTop: 3, lineHeight: 1.6 }}>
                      为什么：{r.why} · 风险：{r.risk} · 何时不用：{r.when_not}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function FeatureStage({ pal, detail, onDone, say }: any) {
  const [cards, setCards] = useState<any[]>(detail.features?.cards ?? [])
  const save = async () => {
    await jsend('PUT', `${API}/projects/${detail.project.project_id}/features`, { cards })
    say('特征卡已保存')
    onDone()
  }
  return (
    <div>
      <p style={{ fontSize: 12, color: pal.muted, marginTop: 0 }}>
        先自己提出特征，再让 AI 建议（/feature-engineering 技能）。每张卡必须回答：公式/含义/为什么/风险/泄漏风险/如何验证。
      </p>
      {cards.map((c, i) => (
        <Card key={i} pal={pal} style={{ marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
            <input style={inputStyle(pal)} placeholder="特征名" value={c.name} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
            <input style={inputStyle(pal)} placeholder="公式" value={c.formula} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, formula: e.target.value } : x)))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
            <input style={inputStyle(pal)} placeholder="含义" value={c.meaning} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, meaning: e.target.value } : x)))} />
            <input style={inputStyle(pal)} placeholder="为什么可能有用" value={c.why} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 130px', gap: 8 }}>
            <input style={inputStyle(pal)} placeholder="风险" value={c.risk} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, risk: e.target.value } : x)))} />
            <input style={inputStyle(pal)} placeholder="泄漏风险" value={c.leakage_risk} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, leakage_risk: e.target.value } : x)))} />
            <select style={inputStyle(pal)} value={c.status} onChange={(e) => setCards(cards.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)))}>
              <option value="proposed">提议</option>
              <option value="accepted">采纳</option>
              <option value="rejected">拒绝</option>
            </select>
          </div>
        </Card>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn pal={pal} onClick={() => setCards([...cards, { name: '', formula: '', meaning: '', why: '', risk: '', leakage_risk: 'none', validation: '', status: 'proposed' }])}>
          + 特征卡
        </Btn>
        <Btn pal={pal} primary onClick={save}>
          保存特征卡
        </Btn>
      </div>
    </div>
  )
}

function SelectorStage({ pal, detail }: any) {
  const [modelId, setModelId] = useState('kmeans')
  const [cards, setCards] = useState<any>(null)
  const models = useRegistry()

  const load = (id: string) => {
    setModelId(id)
    jget(`${API}/selector/${id}`).then((d) => setCards(d))
  }
  useEffect(() => {
    load(modelId)
  }, [])

  const roleCard = (c: any, title: string, color: string) =>
    c && (
      <Card pal={pal} style={{ borderTop: `3px solid ${color}` }}>
        <div style={{ fontSize: 11, color: pal.muted, letterSpacing: 0.5 }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3 }}>{c.name}</div>
        <div style={{ fontSize: 11.5, color: pal.muted, marginTop: 4 }}>{c.summary}</div>
        {c.use_when?.length > 0 && (
          <div style={{ fontSize: 11.5, marginTop: 7, lineHeight: 1.6 }}>
            <strong>适用：</strong>
            {c.use_when.join('；')}
          </div>
        )}
        {c.avoid_when?.length > 0 && (
          <div style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.6, color: pal.warn }}>
            <strong>不适用：</strong>
            {c.avoid_when.join('；')}
          </div>
        )}
        {c.validation?.length > 0 && (
          <div style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.6, color: pal.ok }}>
            <strong>验证：</strong>
            {c.validation.join('、')}
          </div>
        )}
      </Card>
    )

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        <Field label="主模型（Main）">
          <select style={{ ...inputStyle(pal), width: 240 }} value={modelId} onChange={(e) => load(e.target.value)}>
            {(models ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name_zh || m.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {cards ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10 }}>
          {roleCard(cards.baseline, 'BASELINE 基线', pal.muted)}
          {roleCard(cards.main, 'MAIN 主模型', pal.accent)}
          {roleCard(cards.alternative, 'ALTERNATIVE 备选', pal.warn)}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: pal.muted }}>加载选型…</div>
      )}
    </div>
  )
}

const DEMO_POINTS = '[[1,1],[1.2,0.9],[5,5],[5.4,4.8],[9,9],[9.2,8.7]]'

function LabStage({ pal, detail, onDone, say }: any) {
  const [algorithm, setAlgorithm] = useState('kmeans')
  const [paramsText, setParamsText] = useState(`{\n  "points": ${DEMO_POINTS},\n  "k": 2,\n  "seeds": [1,2,3,4,5]\n}`)
  const [lastRun, setLastRun] = useState<any>(null)
  const runs = detail.runs ?? []

  const runIt = async () => {
    let parameters
    try {
      parameters = JSON.parse(paramsText)
    } catch {
      say('参数 JSON 解析失败')
      return
    }
    const r = await jsend('POST', `${API}/projects/${detail.project.project_id}/runs`, { algorithm, parameters })
    if (r.ok) {
      setLastRun(r.run)
      say(`实验完成：run_id ${r.run.run_id.slice(0, 8)}…（已写入 run-manifest）`)
      onDone()
    } else {
      say(`执行失败：${r.run?.warnings?.[0] ?? r.error}`)
      setLastRun(r.run)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 10 }}>
        <Field label="算法（本地 Provider，真实执行）">
          <select style={{ ...inputStyle(pal), width: 260 }} value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            {['kmeans', 'topsis', 'entropy-weight', 'linear-regression', 'pso'].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <Btn pal={pal} primary onClick={runIt}>
          执行实验
        </Btn>
      </div>
      <Field label="参数（JSON）— 随机算法请给多个 seeds，指标自动聚合 mean/std/median/IQR">
        <textarea rows={6} style={{ ...inputStyle(pal), fontFamily: 'monospace' }} value={paramsText} onChange={(e) => setParamsText(e.target.value)} />
      </Field>

      {lastRun && (
        <>
          <Card pal={pal} style={{ marginBottom: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>
              run {lastRun.run_id.slice(0, 8)}… · {lastRun.runtime_ms}ms · input_hash {lastRun.input_hash.slice(0, 10)}…
              {lastRun.stale && <span style={{ color: pal.warn }}>（STALE）</span>}
            </div>
            <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.7 }}>
              {Object.entries(lastRun.metrics).map(([k, v]) => (
                <span key={k} style={{ marginRight: 14 }}>
                  {k} = <strong>{String(v)}</strong>
                </span>
              ))}
            </div>
            {lastRun.warnings?.length > 0 && <div style={{ fontSize: 12, color: pal.danger, marginTop: 6 }}>⚠ {lastRun.warnings.join('；')}</div>}
          </Card>
          {!lastRun.error && (
            <RunFigure
              pal={pal}
              run={lastRun}
              onSave={async (fig) => {
                await jsend('POST', `${API}/projects/${detail.project.project_id}/figures`, fig)
                say(`图表记录已保存（${fig.type}，run ${lastRun.run_id.slice(0, 8)}…）`)
                onDone()
              }}
            />
          )}
        </>
      )}

      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Run Manifest（{runs.length}）</div>
      {runs.length === 0 && <div style={{ fontSize: 12, color: pal.muted }}>尚无实验记录。</div>}
      {runs.map((r: any) => (
        <Card key={r.run_id} pal={pal} style={{ marginBottom: 6, padding: '9px 12px' }}>
          <div style={{ fontSize: 12 }}>
            <strong>{r.algorithm}</strong> · {r.run_id.slice(0, 8)}… · {r.runtime_ms}ms · seed {String(r.seed)} ·{' '}
            {r.stale ? <span style={{ color: pal.warn }}>STALE</span> : 'fresh'}
            {r.error ? <span style={{ color: pal.danger }}> · 失败: {r.error}</span> : null}
          </div>
          <div style={{ fontSize: 11, color: pal.muted, marginTop: 3 }}>
            {Object.entries(r.metrics).slice(0, 5).map(([k, v]) => `${k}=${String(v)}`).join(' · ')}
          </div>
        </Card>
      ))}
    </div>
  )
}

function VizStage({ pal, detail, say }: any) {
  const runs = (detail.runs ?? []).filter((r: any) => !r.error)
  const [runId, setRunId] = useState(runs[0]?.run_id ?? '')
  const [caption, setCaption] = useState('')
  const run = runs.find((r: any) => r.run_id === runId)
  const saved = detail.figures ?? []

  const save = async (fig: any) => {
    await jsend('POST', `${API}/projects/${detail.project.project_id}/figures`, { ...fig, caption: caption || fig.caption })
    say(`图表记录已保存（${fig.type}）`)
  }

  if (runs.length === 0)
    return <div style={{ fontSize: 13, color: pal.muted }}>先在「实验」阶段完成至少一次成功运行，再来生成图表。</div>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 12, flexWrap: 'wrap' }}>
        <Field label="选择 run">
          <select style={{ ...inputStyle(pal), width: 320 }} value={runId} onChange={(e) => setRunId(e.target.value)}>
            {runs.map((r: any) => (
              <option key={r.run_id} value={r.run_id}>
                {r.algorithm} · {r.run_id.slice(0, 8)}… · seed {String(r.seed)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="图表说明（caption）">
          <input style={{ ...inputStyle(pal), width: 320 }} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="留空则自动生成" />
        </Field>
      </div>

      {run && <RunFigure pal={pal} run={run} onSave={save} />}

      {saved.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, margin: '10px 0 8px' }}>已保存图表记录（{saved.length}）</div>
          {saved.map((f: any) => (
            <Card key={f.figure_id} pal={pal} style={{ marginBottom: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 12 }}>
                <strong>{f.figure_id}</strong> · {f.type} · run {f.run_id?.slice(0, 8) ?? '—'} · {f.caption}
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

function ValidationStage({ pal, detail, onDone, say }: any) {
  const runs = detail.runs ?? []
  const [runId, setRunId] = useState(runs[0]?.run_id ?? '')
  const [baselineId, setBaselineId] = useState('')
  const [result, setResult] = useState<any>(detail.validation)

  const runIt = async () => {
    const r = await jsend('POST', `${API}/projects/${detail.project.project_id}/validation`, { run_id: runId, baseline_run_id: baselineId || null, method: 'baseline-compare' })
    setResult(r.validation)
    say('验证检查完成')
    onDone()
  }

  if (runs.length === 0)
    return <div style={{ fontSize: 13, color: pal.muted }}>先在「实验」阶段执行至少一个算法，再做验证。</div>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 12, flexWrap: 'wrap' }}>
        <Field label="目标 run">
          <select style={{ ...inputStyle(pal), width: 280 }} value={runId} onChange={(e) => setRunId(e.target.value)}>
            {runs.map((r: any) => (
              <option key={r.run_id} value={r.run_id}>
                {r.algorithm} · {r.run_id.slice(0, 8)}…
              </option>
            ))}
          </select>
        </Field>
        <Field label="Baseline run（可选）">
          <select style={{ ...inputStyle(pal), width: 280 }} value={baselineId} onChange={(e) => setBaselineId(e.target.value)}>
            <option value="">（无）</option>
            {runs.filter((r: any) => r.run_id !== runId).map((r: any) => (
              <option key={r.run_id} value={r.run_id}>
                {r.algorithm} · {r.run_id.slice(0, 8)}…
              </option>
            ))}
          </select>
        </Field>
        <Btn pal={pal} primary onClick={runIt}>
          运行验证检查
        </Btn>
      </div>

      {result && (
        <div>
          {result.checks.map((c: any) => (
            <Card key={c.name} pal={pal} style={{ marginBottom: 6, padding: '9px 12px', borderLeft: `3px solid ${c.ok ? pal.ok : pal.warn}` }}>
              <span style={{ fontSize: 12.5 }}>
                <strong>{c.ok ? '✓' : '⚠'}</strong> {c.name}：{c.note}
              </span>
            </Card>
          ))}
          {result.comparison && (
            <Card pal={pal} style={{ marginTop: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Baseline vs Main（{result.comparison.metric}）</div>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                {Object.entries(result.comparison.main).map(([k, v]) => (
                  <div key={k}>
                    {k}: baseline {String((result.comparison.baseline as any)[k] ?? '—')} → main <strong>{String(v)}</strong>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

const REVIEW_DIMENSIONS = [
  'problem understanding',
  'data handling',
  'feature engineering',
  'model reasonableness',
  'mathematical rigor',
  'algorithm / solution',
  'validation',
  'result interpretation',
  'innovation',
  'visualization',
  'writing',
  'reproducibility',
]

function ReviewStage({ pal, detail, onDone, say, onNavigate }: any) {
  const [scores, setScores] = useState<Record<string, { score: number; note: string }>>(
    Object.fromEntries(REVIEW_DIMENSIONS.map((d) => [d, { score: 2, note: '' }])),
  )
  const [claimsText, setClaimsText] = useState('')
  const [runId, setRunId] = useState(detail.runs?.[0]?.run_id ?? '')
  const [result, setResult] = useState<any>(null)

  const submitReview = async () => {
    const r = await jsend('POST', `${API}/projects/${detail.project.project_id}/review`, { user_id: 'demo', scores })
    setResult({ type: 'review', ...r })
    say('评审完成 — 弱项已进入 Profile 与今日复习')
    onDone()
  }

  const submitClaims = async () => {
    const claims = claimsText
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => {
        const [claim, rid] = l.split('|').map((s) => s.trim())
        return { claim, run_id: rid || null }
      })
    const r = await jsend('PUT', `${API}/projects/${detail.project.project_id}/claims`, { claims })
    setResult({ type: 'claims', unsupported: r.unsupported, claims: r.ledger.claims })
    say(`证据链保存：${r.unsupported > 0 ? `${r.unsupported} 条声明缺少实验支撑` : '全部声明有支撑'}`)
  }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Rubric 评分（0=差 1=需改进 2=达标）— 训练用，非官方评分</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8, marginBottom: 12 }}>
        {REVIEW_DIMENSIONS.map((d) => (
          <Card key={d} pal={pal} style={{ padding: '9px 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>{d}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map((s) => (
                <Btn key={s} pal={pal} primary={scores[d].score === s} onClick={() => setScores({ ...scores, [d]: { ...scores[d], score: s } })}>
                  {s}
                </Btn>
              ))}
              <input style={{ ...inputStyle(pal), flex: 1 }} placeholder="备注" value={scores[d].note} onChange={(e) => setScores({ ...scores, [d]: { ...scores[d], note: e.target.value } })} />
            </div>
          </Card>
        ))}
      </div>
      <Btn pal={pal} primary onClick={submitReview}>
        提交评审 → 生成差距分析
      </Btn>

      <div style={{ fontSize: 13, fontWeight: 700, margin: '18px 0 8px' }}>证据声明链（claim | run_id）— 无 run 支撑的声明会被标记</div>
      <Field label="每行一条：声明内容 | run_id（来自实验清单）">
        <textarea rows={3} style={{ ...inputStyle(pal), fontFamily: 'monospace' }} value={claimsText} onChange={(e) => setClaimsText(e.target.value)} placeholder={'K-Means 在 k=2 时 SSE 均值 31.0 | <粘贴 run_id>'} />
      </Field>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Btn pal={pal} onClick={submitClaims}>
          保存证据链
        </Btn>
        {detail.runs?.length > 0 && (
          <span style={{ fontSize: 11, color: pal.muted }}>可用 run：{detail.runs.map((r: any) => r.run_id.slice(0, 8)).join(', ')}</span>
        )}
      </div>

      {result?.type === 'review' && (
        <Card pal={pal} style={{ marginTop: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>差距分析</div>
          {result.findings.length === 0 ? (
            <div style={{ fontSize: 12.5, color: pal.ok }}>所有维度达标 — 无薄弱项。</div>
          ) : (
            <>
              {result.findings.map((f: any) => (
                <div key={f.dimension} style={{ fontSize: 12.5, marginBottom: 6, lineHeight: 1.6 }}>
                  <strong style={{ color: pal.warn }}>{f.dimension}（{f.score}）</strong> {f.note}
                  {f.knowledge_units.length > 0 && <span style={{ color: pal.muted }}> → 知识单元：{f.knowledge_units.join('、')}</span>}
                </div>
              ))}
              <div style={{ fontSize: 12, color: pal.accent, marginTop: 8 }}>
                弱项知识单元 {result.weak_units.join('、')} 已写入能力画像并进入今日复习队列。
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <Btn pal={pal} onClick={() => onNavigate('review')}>
                  去今日复习 →
                </Btn>
                <Btn pal={pal} onClick={() => onNavigate('profile')}>
                  查看能力画像 →
                </Btn>
              </div>
            </>
          )}
        </Card>
      )}
      {result?.type === 'claims' && (
        <Card pal={pal} style={{ marginTop: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>证据链状态</div>
          {result.claims.map((c: any, i: number) => (
            <div key={i} style={{ fontSize: 12.5, marginBottom: 4 }}>
              {c.supported ? '✅' : '❌'} {c.claim} {c.run_id && <span style={{ color: pal.muted }}>（run {c.run_id.slice(0, 8)}…）</span>}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}

/* ---------------- paper lab ---------------- */

function PaperLab({ pal }: { pal: Palette }) {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [activeId, setActiveId] = useState('')
  const [detail, setDetail] = useState<any>(null)
  const [outline, setOutline] = useState<string>('')

  useEffect(() => {
    jget(`${API}/projects`).then((d) => {
      setProjects(d.projects ?? [])
      if ((d.projects ?? []).length > 0) setActiveId(d.projects[0].project_id)
    })
  }, [])
  useEffect(() => {
    if (activeId) jget(`${API}/projects/${activeId}`).then(setDetail)
  }, [activeId])

  const contract = detail?.contract
  const outlineSections = contract?.entries?.length
    ? contract.entries.map((e: any) => `## ${e.req_id} ${e.question}\n目标：${e.objective}\n输入：${e.inputs}\n假设：${e.assumptions}`)
    : ['## 摘要', '## 问题重述', '## 模型假设', '## 模型建立', '## 结果分析', '## 模型评价与局限']

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <select style={{ ...inputStyle(pal), width: 280 }} value={activeId} onChange={(e) => setActiveId(e.target.value)}>
          <option value="">（选择项目）</option>
          {projects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.name}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 11.5, color: pal.muted }}>数值结论必须来自 run 证据（claim → run_id），Paper Writer 不得编造指标。</span>
      </div>

      {detail && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>论文提纲（由 Problem Contract 自动生成骨架）</div>
          <Card pal={pal} style={{ marginBottom: 12 }}>
            {outlineSections.map((s: string) => (
              <div key={s} style={{ fontSize: 12.5, padding: '4px 0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {s}
              </div>
            ))}
          </Card>

          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>证据声明（来自评审阶段）</div>
          {detail.claims?.claims?.length ? (
            detail.claims.claims.map((c: any, i: number) => (
              <div key={i} style={{ fontSize: 12.5, marginBottom: 4 }}>
                {c.supported ? '✅' : '❌'} {c.claim}
              </div>
            ))
          ) : (
            <div style={{ fontSize: 12, color: pal.muted }}>尚无声明 — 在比赛工作台「评审」阶段添加 claim → run 链。</div>
          )}

          <Field label="结果分析草稿（仅允许引用上方 ✅ 声明中的数值）">
            <textarea rows={5} style={inputStyle(pal)} value={outline} onChange={(e) => setOutline(e.target.value)} placeholder="例如：由 run xxx，k=2 时 SSE 均值 31.0（3 seeds，std 0）…" />
          </Field>
        </>
      )}
    </div>
  )
}

/* ---------------- reviewer standalone ---------------- */

function Reviewer({ pal }: { pal: Palette }) {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [activeId, setActiveId] = useState('')
  const [scores, setScores] = useState<Record<string, { score: number; note: string }>>(
    Object.fromEntries(REVIEW_DIMENSIONS.map((d) => [d, { score: 2, note: '' }])),
  )
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    jget(`${API}/projects`).then((d) => {
      setProjects(d.projects ?? [])
      if ((d.projects ?? []).length > 0) setActiveId(d.projects[0].project_id)
    })
  }, [])

  const submit = async () => {
    if (!activeId) return
    const r = await jsend('POST', `${API}/projects/${activeId}/review`, { user_id: 'demo', scores })
    setResult(r)
  }

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <select style={{ ...inputStyle(pal), width: 280, marginBottom: 12 }} value={activeId} onChange={(e) => setActiveId(e.target.value)}>
        <option value="">（选择项目）</option>
        {projects.map((p) => (
          <option key={p.project_id} value={p.project_id}>
            {p.name}
          </option>
        ))}
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8, marginBottom: 12 }}>
        {REVIEW_DIMENSIONS.map((d) => (
          <Card key={d} pal={pal} style={{ padding: '9px 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>{d}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((s) => (
                <Btn key={s} pal={pal} primary={scores[d].score === s} onClick={() => setScores({ ...scores, [d]: { ...scores[d], score: s } })}>
                  {s}
                </Btn>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Btn pal={pal} primary onClick={submit} disabled={!activeId}>
        提交评审
      </Btn>
      {result && (
        <Card pal={pal} style={{ marginTop: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            {result.findings.length === 0 ? '全部达标' : `${result.findings.length} 个待改进维度`} → 弱项知识单元：
            {result.weak_units.length > 0 ? result.weak_units.join('、') : '（无）'}
          </div>
          <div style={{ fontSize: 12, color: pal.muted }}>发现已同步到能力画像与今日复习队列。</div>
        </Card>
      )}
    </div>
  )
}


/* ---------------- literature research ---------------- */

function LiteratureResearch({ pal }: { pal: Palette }) {
  const [question, setQuestion] = useState('')
  const [cutoff, setCutoff] = useState('')
  const [extra, setExtra] = useState('')
  const [result, setResult] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  const search = async () => {
    if (!question.trim()) return
    setBusy(true)
    const r = await jsend('POST', `${API}/literature/search`, {
      question,
      cutoff_at: cutoff || null,
      extra_queries: extra.split('\n').map((s) => s.trim()).filter(Boolean),
    })
    setResult(r)
    setBusy(false)
  }

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <p style={{ fontSize: 12.5, color: pal.muted, marginTop: 0 }}>
        赛题发布时间是硬截止：截止日后的文献被隔离（仅供赛后复盘对照）。数据源：OpenAlex 真实文献元数据。
      </p>
      <Field label="研究问题（英文检索效果更佳，可中文）">
        <input style={inputStyle(pal)} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="heliostat field layout optimization solar thermal power" />
      </Field>
      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 10, flexWrap: 'wrap' }}>
        <Field label="截止日（赛题发布日）">
          <input type="date" style={inputStyle(pal)} value={cutoff} onChange={(e) => setCutoff(e.target.value)} />
        </Field>
        <Btn pal={pal} primary onClick={search} disabled={busy}>
          {busy ? '检索中…' : '研究相关文献'}
        </Btn>
      </div>
      <Field label="扩展检索词（每行一个，可选）">
        <textarea rows={2} style={inputStyle(pal)} value={extra} onChange={(e) => setExtra(e.target.value)} />
      </Field>

      {result && (
        <div>
          <div style={{ fontSize: 12.5, marginBottom: 10 }}>
            截止模式：<strong>{result.cutoff_mode}</strong> · 截止日前文献 <strong>{result.pre_cutoff.length}</strong> 篇 ·
            已隔离 <strong style={{ color: pal.warn }}>{result.quarantined.length}</strong> 篇
            {result.warnings?.length > 0 && <span style={{ color: pal.warn }}>（{result.warnings.length} 条检索警告）</span>}
          </div>

          {result.method_families.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, margin: '10px 0 6px' }}>方法族（截止日前文献）</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {result.method_families.map((f: any) => (
                  <span key={f.family} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: pal.accentSoft, color: pal.accent }}>
                    {f.family} · {f.papers} 篇
                  </span>
                ))}
              </div>
            </>
          )}

          <div style={{ fontSize: 13, fontWeight: 700, margin: '10px 0 6px' }}>截止日前文献时间线</div>
          {[...result.pre_cutoff].sort((a: any, b: any) => (a.date ?? '').localeCompare(b.date ?? '')).map((p: any) => (
            <Card key={p.id} pal={pal} style={{ marginBottom: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 12.5 }}>
                <span style={{ color: pal.muted }}>[{p.date}]</span> {p.title}
                {p.method_families.length > 0 && <span style={{ fontSize: 11, color: pal.accent }}> · {p.method_families.join('/')}</span>}
              </div>
              {p.doi && (
                <a href={p.doi} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: pal.accent }}>
                  {p.doi}
                </a>
              )}
            </Card>
          ))}

          {result.quarantined.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, margin: '12px 0 6px', color: pal.warn }}>
                已隔离（截止日后 — 仅赛后复盘可用）
              </div>
              {result.quarantined.map((p: any) => (
                <Card key={p.id} pal={pal} style={{ marginBottom: 6, padding: '8px 12px', opacity: 0.65 }}>
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: pal.warn }}>[{p.date}]</span> {p.title}
                  </div>
                </Card>
              ))}
            </>
          )}

          {result.hypotheses.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, margin: '12px 0 6px' }}>建模假设（由真实文献方法族生成）</div>
              {result.hypotheses.map((h: any, i: number) => (
                <Card key={i} pal={pal} style={{ marginBottom: 6, padding: '9px 12px' }}>
                  <div style={{ fontSize: 12.5 }}>{h.hypothesis}</div>
                  <div style={{ fontSize: 11, color: pal.muted, marginTop: 3 }}>{h.next}</div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
/* ---------------- profile ---------------- */

function Profile({ pal }: { pal: Palette }) {
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    jget(`${API}/profile?user_id=demo`).then(setData)
  }, [])
  if (!data) return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载画像…</div>

  const models = (data.models ?? []).slice().sort((a: any, b: any) => a.score - b.score)
  const weak = data.weak_units ?? []

  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card pal={pal} style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>模型掌握度（升序）</div>
          {models.map((m: any) => (
            <div key={m.item_id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{m.item_id}</span>
                <span style={{ color: m.score < 40 ? pal.danger : m.score < 60 ? pal.warn : pal.ok }}>{m.score}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: pal.border, marginTop: 3 }}>
                <div style={{ width: `${m.score}%`, height: '100%', borderRadius: 3, background: m.score < 40 ? pal.danger : m.score < 60 ? pal.warn : pal.ok }} />
              </div>
            </div>
          ))}
        </Card>

        <div>
          <Card pal={pal} style={{ padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>薄弱知识单元（&lt;50%）</div>
            {weak.length === 0 && <div style={{ fontSize: 12, color: pal.muted }}>暂无</div>}
            {weak.map((w: any) => (
              <div key={w.item_id} style={{ fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ color: pal.danger }}>{w.item_id}</span> · {w.score}%
              </div>
            ))}
          </Card>
          <Card pal={pal} style={{ padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>近期错题（{data.quiz_total} 次测验）</div>
            {(data.recent_mistakes ?? []).length === 0 && <div style={{ fontSize: 12, color: pal.muted }}>暂无</div>}
            {(data.recent_mistakes ?? []).map((a: any, i: number) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>
                {a.quiz_id} · {a.created_at?.slice(0, 16).replace('T', ' ')}
              </div>
            ))}
          </Card>
          <Card pal={pal} style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>评审弱点（来自项目）</div>
            {(data.reviewer_findings ?? []).length === 0 && <div style={{ fontSize: 12, color: pal.muted }}>暂无 — 完成一次项目评审后显示</div>}
            {(data.reviewer_findings ?? []).map((f: any, i: number) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 5 }}>
                <strong>{f.dimension}</strong>（{f.score}）{f.note} <span style={{ color: pal.muted }}>→ {f.knowledge_units?.join('、')}</span>
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: pal.muted, marginTop: 6 }}>Gym 训练：{data.gym?.attempts ?? 0} 次</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ---------------- problems + cases registries ---------------- */

function Problems({ pal }: { pal: Palette }) {
  const [resources, setResources] = useState<any[]>([])
  useEffect(() => {
    jget(`${API}/resources`).then((d) => setResources(d.resources ?? []))
  }, [])
  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <p style={{ fontSize: 12.5, color: pal.muted, marginTop: 0 }}>
        资源注册表：外链 + 元数据（不复制受版权保护的题目全文）。来源：chengziyue benchmark 元数据 / 官方页面 / zhanwen 索引。
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {resources.map((r) => (
          <Card key={r.id} pal={pal}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {r.title} <span style={{ fontSize: 11, color: pal.muted, fontWeight: 400 }}>{r.contest} {r.year}</span>
            </div>
            <div style={{ fontSize: 11.5, color: pal.muted, marginTop: 4 }}>
              类型 {r.type} · 标签 {(r.tags ?? []).join('、')} · 许可：{r.license_note}
            </div>
            {r.source_url && (
              <a href={r.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: pal.accent }}>
                打开来源 ↗
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

function Cases({ pal }: { pal: Palette }) {
  const [cases, setCases] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  useEffect(() => {
    jget(`${API}/cases`).then((d) => {
      setCases(d.cases ?? [])
      if ((d.cases ?? []).length > 0) setActive(d.cases[0])
    })
  }, [])
  if (!active) return <div style={{ padding: 24, fontSize: 13, color: pal.muted }}>加载案例…</div>
  const ref = active.problem_ref ?? {}
  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {cases.map((c) => (
          <Btn key={c.id} pal={pal} primary={active.id === c.id} onClick={() => setActive(c)}>
            {c.title}
          </Btn>
        ))}
      </div>
      <Card pal={pal} style={{ padding: '12px 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>真题来源：{ref.contest}「{ref.title}」</div>
        <div style={{ fontSize: 12, marginTop: 6, display: 'flex', gap: 16 }}>
          {ref.official_link && (
            <a href={ref.official_link} target="_blank" rel="noreferrer" style={{ color: pal.accent }}>
              官方赛题入口 ↗
            </a>
          )}
          {ref.paper_discovery && (
            <a href={ref.paper_discovery} target="_blank" rel="noreferrer" style={{ color: pal.accent }}>
              获奖论文发现（获奖名单目录）↗
            </a>
          )}
        </div>
        <div style={{ fontSize: 11, color: pal.muted, marginTop: 6 }}>
          本案例为我们对公开真题的教学蒸馏，非官方评分，也不代表任何一篇具体获奖论文。
        </div>
      </Card>
      <Card pal={pal} style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
          {active.title} <span style={{ fontSize: 11.5, color: pal.muted, fontWeight: 400 }}>{active.problem_type}</span>
        </div>
        {Object.entries(active.distillation ?? {}).map(([k, v]) => (
          <div key={k} style={{ fontSize: 12.5, marginBottom: 8, lineHeight: 1.7 }}>
            <strong>{k}：</strong>
            {Array.isArray(v) ? (v as string[]).join('；') : String(v)}
          </div>
        ))}
        {active.knowledge_units?.length > 0 && (
          <div style={{ fontSize: 12, color: pal.accent, marginTop: 8 }}>关联知识单元：{active.knowledge_units.join('、')}</div>
        )}
      </Card>
    </div>
  )
}

/* ---------------- lab (standalone) ---------------- */

function Lab({ pal }: { pal: Palette }) {
  return (
    <div style={{ padding: '18px 22px', height: '100%', overflow: 'auto' }}>
      <p style={{ fontSize: 12.5, color: pal.muted, marginTop: 0 }}>
        独立实验台与比赛工作台「实验」阶段共用同一 Provider。建议在项目内使用以获得 manifest 与证据链。
      </p>
      <Card pal={pal}>
        <div style={{ fontSize: 13 }}>
          可用算法：kmeans（多 seed 聚类）· topsis · entropy-weight · linear-regression（OLS + 残差）· pso（sphere/rastrigin/rosenbrock，
          收敛曲线）。每次运行记录 run_id / input_hash / 参数 / seed / 指标 / 产物哈希 — 不虚构结果。
        </div>
      </Card>
    </div>
  )
}

/* ---------------- styles ---------------- */

function styles(pal: Palette) {
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
      alignItems: 'center',
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
  }
}

/* ---------------- frame ---------------- */

let currentCtx: ClientContext | undefined

function readCurrentSessionId(): string | undefined {
  try {
    return currentCtx?.sessions?.list?.getSnapshot?.()?.current
  } catch {
    return undefined
  }
}

type FrameProps = {
  renderSlot: (key: string, owner: Record<string, unknown>) => ReactNode
}

function SessionSwitcher({ pal }: { pal: Palette }) {
  const [current, setCurrent] = useState<string | null>(null)
  const [sessions, setSessions] = useState<{ id: string; title: string }[]>([])
  const [open, setOpen] = useState(false)

  const refresh = () => {
    try {
      const snap: any = currentCtx?.sessions?.list?.getSnapshot?.() ?? {}
      setCurrent(snap.current ?? null)
      const ids: string[] = snap.ids ?? Object.keys(snap.byId ?? {})
      setSessions(
        ids.slice(0, 12).map((id) => ({
          id,
          title: snap.byId?.[id]?.title || `${id.slice(0, 8)}…`,
        })),
      )
    } catch {
      /* sessions unavailable */
    }
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 3000)
    return () => clearInterval(t)
  }, [])

  const newSession = async () => {
    try {
      const mgr: any = currentCtx?.sessions
      if (typeof mgr?.create === 'function') {
        await mgr.create({})
      } else if (typeof mgr?.newSession === 'function') {
        await mgr.newSession()
      }
      setTimeout(refresh, 600)
    } catch {
      /* creation unavailable */
    }
  }

  const switchTo = async (id: string) => {
    try {
      const mgr: any = currentCtx?.sessions
      if (typeof mgr?.open === 'function') await mgr.open(id)
    } catch {
      /* switch unavailable */
    }
    setOpen(false)
    setTimeout(refresh, 600)
  }

  const currentTitle = sessions.find((s) => s.id === current)?.title ?? current?.slice(0, 8) ?? '…'
  const [contextLine, setContextLine] = useState('')

  useEffect(() => {
    if (!current) return
    jget(`${API}/context?session_id=${current}`).then((d) => {
      const c = d.context
      if (c && (c.model_id || c.knowledge_unit)) {
        setContextLine(`context: ${c.model_id ?? '—'}${c.knowledge_unit ? ` · ${c.knowledge_unit}` : ''}`)
      } else setContextLine('')
    })
  }, [current])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
        <strong>数模 Agent</strong>
        <button
          type="button"
          onClick={() => {
            refresh()
            setOpen(!open)
          }}
          style={{ border: 'none', background: 'none', color: pal.muted, cursor: 'pointer', fontSize: 11.5, padding: 0 }}
        >
          当前：{currentTitle} ▾
        </button>
        <button
          type="button"
          onClick={newSession}
          title="新建会话"
          style={{ border: 'none', background: 'none', color: pal.accent, cursor: 'pointer', fontSize: 11.5, padding: 0 }}
        >
          + 新会话
        </button>
      </div>
      {contextLine && (
        <div style={{ fontSize: 10.5, color: pal.muted, marginTop: 2 }}>{contextLine}</div>
      )}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 80,
            minWidth: 220,
            maxHeight: 260,
            overflow: 'auto',
            background: pal.cardBg,
            border: `1px solid ${pal.border}`,
            borderRadius: 8,
            boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            padding: 4,
          }}
        >
          {sessions.length === 0 && <div style={{ fontSize: 12, color: pal.muted, padding: 6 }}>暂无会话记录</div>}
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => switchTo(s.id)}
              style={{
                fontSize: 12,
                padding: '6px 8px',
                borderRadius: 6,
                cursor: 'pointer',
                background: s.id === current ? pal.accentSoft : 'transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {s.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ShellFrame({ renderSlot }: FrameProps) {
  const pal = useThemePalette()
  const S = styles(pal)
  const [active, setActive] = useState<SectionId>(loadSection)
  const [lessonModel, setLessonModel] = useState<string | null>('kmeans')
  const [narrow, setNarrow] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 1180 : false))
  const [agentOpen, setAgentOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 1180 : true))

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1180px)')
    const onChange = () => {
      setNarrow(mq.matches)
      setAgentOpen(!mq.matches)
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
      body: JSON.stringify({ page: 'lesson', module: 'atlas', model_id: modelId, ...(sid ? { session_id: sid } : {}) }),
    }).catch(() => {})
    setLessonModel(modelId)
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
            {lessonModel === 'kmeans' ? renderSlot('mathmodel.workbench', {}) : <DeepLesson pal={pal} modelId={lessonModel ?? ''} />}
          </div>
          <div style={S.pane(active === 'review')} data-mm-section="review">
            <DailyReview pal={pal} />
          </div>
          <div style={S.pane(active === 'gym')} data-mm-section="gym">
            <Gym pal={pal} />
          </div>
          <div style={S.pane(active === 'competition')} data-mm-section="competition">
            <Competition pal={pal} onNavigate={navigate} />
          </div>
          <div style={S.pane(active === 'problems')} data-mm-section="problems">
            <Problems pal={pal} />
          </div>
          <div style={S.pane(active === 'cases')} data-mm-section="cases">
            <Cases pal={pal} />
          </div>
          <div style={S.pane(active === 'lab')} data-mm-section="lab">
            <Lab pal={pal} />
          </div>
          <div style={S.pane(active === 'paper')} data-mm-section="paper">
            <PaperLab pal={pal} />
          </div>
          <div style={S.pane(active === 'literature')} data-mm-section="literature">
            <LiteratureResearch pal={pal} />
          </div>
          <div style={S.pane(active === 'reviewer')} data-mm-section="reviewer">
            <Reviewer pal={pal} />
          </div>
          <div style={S.pane(active === 'profile')} data-mm-section="profile">
            <Profile pal={pal} />
          </div>
        </div>
      </main>

      <section style={agentStyle} data-mm-agent data-mm-agent-open={agentOpen ? '1' : '0'}>
        <div style={S.chatHeader}>
          <SessionSwitcher pal={pal} />
          {narrow && (
            <button
              type="button"
              onClick={() => setAgentOpen(false)}
              style={{ border: 'none', background: 'none', color: pal.fg, cursor: 'pointer', fontSize: 12 }}
            >
              ✕
            </button>
          )}
        </div>
        <div style={S.chatBody}>{renderSlot('conversation', {})}</div>
      </section>
      {narrow && !agentOpen && (
        <button type="button" style={S.fab} onClick={() => setAgentOpen(true)} data-mm-agent-fab>
          💬 Agent
        </button>
      )}

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

function loadSection(): SectionId {
  try {
    const v = sessionStorage.getItem(NAV_KEY) as SectionId | null
    if (v && ALL_ITEMS.some((n) => n.id === v)) return v
  } catch {
    /* ignore */
  }
  return 'dashboard'
}

function saveSection(id: SectionId) {
  try {
    sessionStorage.setItem(NAV_KEY, id)
  } catch {
    /* ignore */
  }
}

export const inject = ['slots', 'sessions']

export function apply(ctx: ClientContext): void {
  currentCtx = ctx

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






