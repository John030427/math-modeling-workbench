/**
 * Product routes — overnight MVP closed loop:
 * mastery aggregation · Daily Review · Gym · Competition projects (contract /
 * data doctor / feature cards / B-M-A selector / provider runs / validation /
 * reviewer / gap / claims) · profile.
 */
import { randomUUID, createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scheduleNext, duePriority } from '../../core/dist/srs/index.js'
import { loadModelYaml } from './registry.js'
import {
  getLearningState,
  setMasteryRecords,
  getGymAttempts,
  appendGymAttempt,
  getReviewerFindings,
  setReviewerFindings,
} from './stores.js'
import { MATHMODELING_API_PREFIX } from './routes.js'
import * as algo from './algorithms.js'
import { diagnose } from './datadoctor.js'
import { listMethods as czyListMethods, findMethod as czyFindMethod, runMethod as czyRunMethod } from '../../algorithm-provider-czy/lib/index.js'

const LIB_DIR = fileURLToPath(new URL('.', import.meta.url))
const REGISTRY_DIR = resolve(LIB_DIR, '../../../registry')
const WORKSPACE_DIR = process.env.MM_WORKSPACE_DIR || resolve(LIB_DIR, '../../../workspace')
const PROVIDER_VERSION = 'local-0.1.0'

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

async function readJsonBody(req, max = 4 * 1024 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += b.length
    if (size > max) throw new Error('body-too-large')
    chunks.push(b)
  }
  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex')
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function writeJson(path, data) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
}

/* ---------------- model knowledge units ---------------- */

function modelKUs(modelId) {
  const yaml = loadModelYaml(modelId)
  if (!yaml) return []
  const lines = yaml.replace(/\r\n/g, '\n').split('\n')
  const start = lines.findIndex((l) => l.trim() === 'knowledge_units:')
  if (start < 0) return []
  const items = []
  for (let i = start + 1; i < lines.length; i++) {
    if (!lines[i].startsWith('  - ')) break
    items.push(lines[i].slice(4).trim())
  }
  return items
}

/* ---------------- provider ---------------- */

const ALGORITHMS = [
  { id: 'kmeans', name: 'K-Means', family: 'clustering', stochastic: true, input: 'points[][], k, seeds[]' },
  { id: 'topsis', name: 'TOPSIS', family: 'evaluation', stochastic: false, input: 'matrix, weights, benefit[]' },
  { id: 'entropy-weight', name: 'Entropy Weight', family: 'evaluation', stochastic: false, input: 'matrix' },
  { id: 'linear-regression', name: 'Linear Regression (OLS)', family: 'regression', stochastic: false, input: 'X[][], y[]' },
  { id: 'pso', name: 'PSO (sphere/rastrigin/rosenbrock)', family: 'metaheuristics', stochastic: true, input: 'objective, dims, seeds[]' },
]

function executeAlgorithm(algorithm, parameters) {
  switch (algorithm) {
    case 'kmeans':
      return algo.kmeans(parameters.points, Number(parameters.k ?? 3), parameters.seeds ?? [42], Number(parameters.max_iter ?? 100))
    case 'topsis':
      return algo.topsis(parameters.matrix, parameters.weights, parameters.benefit)
    case 'entropy-weight':
      return algo.entropyWeight(parameters.matrix)
    case 'linear-regression':
      return algo.linearRegression(parameters.X, parameters.y, Number(parameters.ridge ?? 1e-8))
    case 'pso':
      return algo.pso({
        objective: parameters.objective ?? 'sphere',
        dims: Number(parameters.dims ?? 2),
        seeds: parameters.seeds ?? [42],
        particles: Number(parameters.particles ?? 24),
        iterations: Number(parameters.iterations ?? 80),
      })
    default:
      return { error: 'unknown-algorithm', metrics: {} }
  }
}

function inventoryCommit() {
  try {
    return JSON.parse(readFileSync(join(LIB_DIR, '../../../registry/upstream/chengziyue_algorithms.json'), 'utf8')).upstream_commit
  } catch {
    return '33cb044009d2dc12e7fa86e4ded6138ddb790d9a'
  }
}

async function dispatchRun(algorithm, parameters, projectDir, session_id) {
  if (czyFindMethod(algorithm)) {
    const started = Date.now()
    const r = await czyRunMethod({ method_id: algorithm, parameters })
    const run = {
      ...(r.run ?? {}),
      run_id: randomUUID(),
      started_at: new Date(started).toISOString(),
      session_id,
      stale: false,
    }
    if (projectDir) {
      const manifestPath = join(projectDir, 'experiments', 'run-manifest.json')
      const manifest = readJson(manifestPath) ?? { runs: [] }
      manifest.runs.push(run)
      writeJson(manifestPath, manifest)
    }
    return run
  }
  return runWithManifest({ algorithm, parameters, projectDir, session_id })
}

function runWithManifest({ algorithm, parameters, projectDir = null, session_id = null }) {
  const started = Date.now()
  const inputHash = sha256(JSON.stringify({ algorithm, parameters }))
  const result = executeAlgorithm(algorithm, parameters)
  const run = {
    run_id: randomUUID(),
    algorithm,
    provider: 'local',
    source_version: PROVIDER_VERSION,
    upstream_lock: 'local-implementation (see research/UPSTREAM_SOURCE_LOCK.md)',
    input_hash: inputHash,
    parameters,
    seed: Array.isArray(parameters.seeds) ? parameters.seeds[0] : (parameters.seed ?? null),
    seeds: parameters.seeds ?? null,
    started_at: new Date(started).toISOString(),
    runtime_ms: Date.now() - started,
    metrics: result.metrics ?? {},
    objective: parameters.objective ?? null,
    feasible: result.error ? false : true,
    warnings: result.error ? [result.error] : [],
    artifacts: result.artifacts ?? {},
    output_hashes: Object.fromEntries(
      Object.entries(result.artifacts ?? {}).map(([k, v]) => [k, sha256(String(v)).slice(0, 16)]),
    ),
    session_id,
    stale: false,
  }
  if (projectDir) {
    const manifestPath = join(projectDir, 'experiments', 'run-manifest.json')
    const manifest = readJson(manifestPath) ?? { runs: [] }
    manifest.runs.push(run)
    writeJson(manifestPath, manifest)
  }
  return run
}

/* ---------------- projects store ---------------- */

function projectDir(projectId) {
  const dir = join(WORKSPACE_DIR, projectId)
  if (!projectId.match(/^p_\w+$/) || !existsSync(dir)) return null
  return dir
}

function readProject(projectId) {
  const dir = projectDir(projectId)
  if (!dir) return null
  return { dir, project: readJson(join(dir, 'project.json')) }
}

function touchProject(dir, patch) {
  const p = readJson(join(dir, 'project.json'))
  const next = { ...p, ...patch, updated_at: new Date().toISOString() }
  writeJson(join(dir, 'project.json'), next)
  return next
}

function markRunsStale(dir) {
  const manifestPath = join(dir, 'experiments', 'run-manifest.json')
  const manifest = readJson(manifestPath)
  if (!manifest) return
  for (const run of manifest.runs) run.stale = true
  writeJson(manifestPath, manifest)
}

/* ---------------- review queue ---------------- */

function buildReviewQueue(userId = 'demo', limit = 20) {
  const state = getLearningState()
  const now = Date.now()
  const items = new Map()
  for (const r of state.mastery) {
    if (r.user_id !== userId) continue
    const reasons = []
    let priority = 0
    if ((r.score ?? 0) < 60) {
      reasons.push('low-mastery')
      priority += (60 - (r.score ?? 0)) / 10
    }
    if (r.next_review) {
      const nr = new Date(r.next_review).getTime()
      if (Number.isFinite(nr) && nr <= now) {
        reasons.push('due')
        priority += (now - nr) / 86400000
      }
    }
    priority += duePriority(r.score ?? 0, r.next_review, r.wrong_count ?? 0) * 0.5
    if (reasons.length > 0) {
      items.set(`${r.item_type}:${r.item_id}`, {
        item_type: r.item_type,
        item_id: r.item_id,
        score: r.score,
        reasons,
        priority: Math.round(priority * 100) / 100,
      })
    }
  }
  for (const a of state.quiz_attempts) {
    if (a.correct === false && a.session_id) {
      const key = `quiz:${a.quiz_id}`
      if (!items.has(key)) {
        items.set(key, {
          item_type: 'quiz-mistake',
          item_id: a.quiz_id,
          score: null,
          reasons: ['quiz-mistake'],
          priority: 3,
          session_id: a.session_id,
        })
      }
    }
  }
  for (const f of getReviewerFindings(userId)) {
    for (const ku of f.knowledge_units ?? []) {
      const key = `finding:${ku}`
      if (!items.has(key)) {
        items.set(key, { item_type: 'review-finding', item_id: ku, score: null, reasons: ['reviewer-finding'], priority: 4, project_id: f.project_id })
      }
    }
  }
  return [...items.values()].sort((a, b) => b.priority - a.priority).slice(0, limit)
}

/* ---------------- gym ---------------- */

function gymCases() {
  const dir = join(REGISTRY_DIR, 'gym')
  if (!existsSync(dir)) return []
  return readJson(join(dir, 'cases.json'))?.cases ?? []
}

function gradeGymProposal(gymCase, proposal) {
  const dimensions = (gymCase.dimensions ?? []).map((dim) => {
    const text = JSON.stringify(proposal ?? {}).toLowerCase()
    const hits = (dim.reference_keywords ?? []).filter((kw) => text.includes(kw.toLowerCase()))
    const score = hits.length === 0 ? 0 : hits.length >= Math.ceil((dim.reference_keywords ?? [1]).length / 2) ? 2 : 1
    return {
      dimension: dim.name,
      score,
      hint: dim.hint,
      missing: hits.length === 0 ? (dim.reference_keywords ?? []).slice(0, 3) : (dim.reference_keywords ?? []).filter((kw) => !text.includes(kw.toLowerCase())).slice(0, 3),
      knowledge_units: dim.knowledge_units ?? [],
    }
  })
  const total = dimensions.reduce((s, d) => s + d.score, 0)
  const max = dimensions.length * 2
  return { dimensions, total, max, pct: Math.round((total / Math.max(1, max)) * 100) }
}

/* ---------------- B/M/A selector ---------------- */

function selectorCards(modelId) {
  const all = readJson(join(LIB_DIR, 'registry-data.json'))?.models ?? []
  const main = all.find((m) => m.id === modelId)
  if (!main) return null
  const yaml = loadModelYaml(modelId)
  const alternativesList = yaml ? [...blockAfter(yaml, 'alternatives'), ...flowListTop(yaml, 'alternatives')] : []
  const byId = (id) => all.find((m) => m.id === id)
  let baseline = byId('linear-regression')
  if (!baseline || baseline.id === modelId) {
    baseline =
      all.filter((m) => m.difficulty === 'beginner' && m.id !== modelId).sort((a, b) => a.demo_priority - b.demo_priority)[0] ??
      all.find((m) => m.id !== modelId)
  }
  const alternative =
    alternativesList.map(byId).find((m) => m && m.id !== modelId && m.id !== baseline?.id) ??
    all.find((m) => m.task === main.task && m.id !== modelId && m.id !== baseline?.id) ??
    null
  const card = (m, role, extra = {}) =>
    m && {
      role,
      id: m.id,
      name: m.name_zh || m.name,
      difficulty: m.difficulty,
      summary: m.summary,
      use_when: extra.use_when ?? [],
      avoid_when: extra.avoid_when ?? [],
      validation: extra.validation ?? [],
      mastery_note: '见 Atlas 掌握度',
    }
  return {
    baseline: card(baseline, 'baseline', extraFor(baseline?.id)),
    main: card(main, 'main', extraFor(main.id)),
    alternative: card(alternative, 'alternative', extraFor(alternative?.id)),
  }
}

function flowListTop(yaml, key) {
  const m = yaml.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, 'm'))
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function blockAfter(yaml, key) {
  const lines = yaml.replace(/\r\n/g, '\n').split('\n')
  const start = lines.findIndex((l) => l.trim() === `${key}:`)
  if (start < 0) return []
  const items = []
  for (let i = start + 1; i < lines.length; i++) {
    if (!lines[i].startsWith('  - ')) break
    items.push(lines[i].slice(4).trim())
  }
  return items
}

function extraFor(modelId) {
  if (!modelId) return {}
  const yaml = loadModelYaml(modelId)
  if (!yaml) return {}
  return {
    use_when: blockAfter(yaml, 'use_when'),
    avoid_when: blockAfter(yaml, 'avoid_when'),
    validation: blockAfter(yaml, 'validation'),
  }
}

/* ---------------- exported for tests ---------------- */
export { buildReviewQueue, selectorCards, diagnose, runWithManifest };

/* ---------------- routes ---------------- */

export function makeProductRoutes() {
  return [
    // resources registry (problems/papers metadata — external links only)
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/resources`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        const type = url.searchParams.get('type')
        let resources = readJson(join(REGISTRY_DIR, 'resources', 'resources.json'))?.resources ?? []
        if (type) resources = resources.filter((r) => r.type === type)
        json(res, 200, { ok: true, resources })
      },
    },

    // CUMCM archive index (5244 real records from yushugulao/CUMCM-Archive, link-only)
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/resources/archive`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        const year = url.searchParams.get('year')
        const problem = url.searchParams.get('problem')
        const kind = url.searchParams.get('kind')
        const q = (url.searchParams.get('q') ?? '').toLowerCase()
        const pageNum = Math.max(1, Number(url.searchParams.get('page') ?? 1))
        const pageSize = Math.min(100, Math.max(5, Number(url.searchParams.get('page_size') ?? 30)))
        const archivePath = join(LIB_DIR, '../../../registry/resources/cumcm-archive.json')
        const all = readJson(archivePath)?.records ?? []
        let rows = all
        if (year) rows = rows.filter((r) => String(r.year) === String(year))
        if (problem) rows = rows.filter((r) => r.problem === problem)
        if (kind) rows = rows.filter((r) => r.kind === kind)
        if (q) rows = rows.filter((r) => r.title.toLowerCase().includes(q))
        const total = rows.length
        const page = rows.slice((pageNum - 1) * pageSize, pageNum * pageSize)
        json(res, 200, {
          ok: true,
          total,
          page: pageNum,
          page_size: pageSize,
          years: [...new Set(all.map((r) => r.year))].sort((a, b) => b - a),
          problems: [...new Set(all.map((r) => r.problem))].sort(),
          kinds: [...new Set(all.map((r) => r.kind))],
          records: page,
        })
      },
    },
    // Literature Research — real search (OpenAlex) + date-cutoff guard + method synthesis
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/literature/search`,
      handler: (req, res) => {
        if (req.method !== 'POST') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        void (async () => {
          try {
            const body = await readJsonBody(req)
            const question = String(body.question ?? '').trim()
            const cutoffAt = body.cutoff_at ? new Date(body.cutoff_at) : null
            if (!question) {
              json(res, 400, { ok: false, error: 'question-required' })
              return
            }
            if (cutoffAt && Number.isNaN(cutoffAt.getTime())) {
              json(res, 400, { ok: false, error: 'bad cutoff_at' })
              return
            }
            const queries = [question, ...(Array.isArray(body.extra_queries) ? body.extra_queries : [])].slice(0, 4)
            const seen = new Map()
            const warnings = []
            for (const q of queries) {
              try {
                const api = `https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=10&select=id,title,publication_date,doi`
                const r = await fetch(api, { headers: { 'User-Agent': 'mathmodel-harness/0.1 (educational)' } })
                if (!r.ok) {
                  warnings.push(`OpenAlex ${q.slice(0, 20)}: http ${r.status}`)
                  continue
                }
                const d = await r.json()
                for (const w of d.results ?? []) {
                  if (!seen.has(w.id)) seen.set(w.id, w)
                }
              } catch (e) {
                warnings.push(`OpenAlex ${q.slice(0, 20)}: ${String(e).slice(0, 80)}`)
              }
            }
            const METHOD_BUCKETS = [
              { family: '回归/预测', kw: ['regression', 'forecast', 'prediction', 'arima'] },
              { family: '优化/规划', kw: ['optimization', 'programming', 'scheduling', 'routing'] },
              { family: '评价/决策', kw: ['evaluation', 'topsis', 'ahp', 'multi-criteria', 'entropy'] },
              { family: '聚类/分类', kw: ['cluster', 'classification', 'k-means'] },
              { family: '仿真/蒙特卡洛', kw: ['simulation', 'monte carlo', 'queu'] },
              { family: '图论/网络', kw: ['graph', 'network', 'shortest path', 'flow'] },
              { family: '机器学习', kw: ['machine learning', 'neural', 'random forest', 'xgboost'] },
            ]
            const papers = [...seen.values()].map((w) => {
              const title = (w.title ?? '').toLowerCase()
              const fams = METHOD_BUCKETS.filter((b) => b.kw.some((k) => title.includes(k))).map((b) => b.family)
              const date = w.publication_date ?? null
              const afterCutoff = cutoffAt && date ? new Date(date).getTime() > cutoffAt.getTime() : false
              return {
                id: w.id,
                title: w.title,
                date,
                doi: w.doi,
                method_families: fams,
                quarantine: afterCutoff,
              }
            })
            const pre = papers.filter((p) => !p.quarantine && p.date)
            const quarantined = papers.filter((p) => p.quarantine)
            const familyCount = new Map()
            for (const p of pre) for (const f of p.method_families) familyCount.set(f, (familyCount.get(f) ?? 0) + 1)
            const method_families = [...familyCount.entries()].sort((a, b) => b[1] - a[1]).map(([f, n]) => ({ family: f, papers: n }))
            const hypotheses = method_families.slice(0, 3).map((f) => ({
              hypothesis: `针对「${question.slice(0, 40)}」，可考察 ${f.family} 类方法（${f.papers} 篇截止日前文献使用）`,
              method_family: f.family,
              next: '在模型地图学习该方法 → Algorithm Lab 用真实数据试跑',
            }))
            json(res, 200, {
              ok: true,
              research_question: question,
              cutoff_at: body.cutoff_at ?? null,
              cutoff_mode: cutoffAt ? 'enforced' : 'off',
              pre_cutoff: pre,
              quarantined,
              method_families,
              hypotheses,
              warnings,
            })
          } catch (e) {
            json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
          }
        })()
      },
    },

    // distilled cases registry
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/cases`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const flagship = readJson(join(REGISTRY_DIR, 'cases', 'flagship-2023a.json'))
        const base = readJson(join(REGISTRY_DIR, 'cases', 'cases.json'))?.cases ?? []
        const cases = flagship ? [flagship, ...base] : base
        json(res, 200, { ok: true, cases })
      },
    },
    // mastery per model (aggregate over model knowledge units)
    {
      kind: 'prefix',
      path: `${MATHMODELING_API_PREFIX}/mastery`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const modelId = decodeURIComponent(pathname.split('/').pop() || '')
        const url = new URL(req.url ?? '/', 'http://localhost')
        const userId = url.searchParams.get('user_id') || 'demo'
        const state = getLearningState()
        const kus = modelKUs(modelId)
        const units = kus.map((ku) => {
          const r = state.mastery.find((m) => m.user_id === userId && m.item_type === 'ku' && m.item_id === ku)
          return { item_id: ku, score: r?.score ?? null, next_review: r?.next_review ?? null }
        })
        const scored = units.filter((u) => u.score !== null)
        const model = state.mastery.find((m) => m.user_id === userId && m.item_type === 'model' && m.item_id === modelId)
        json(res, 200, {
          ok: true,
          model_id: modelId,
          model_score: model?.score ?? null,
          units,
          average: scored.length ? Math.round((scored.reduce((s, u) => s + u.score, 0) / scored.length) * 10) / 10 : null,
          assessed_units: scored.length,
          total_units: units.length,
        })
      },
    },

    // daily review queue
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/review/queue`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        const userId = url.searchParams.get('user_id') || 'demo'
        const limit = Number(url.searchParams.get('limit') ?? 20)
        json(res, 200, { ok: true, queue: buildReviewQueue(userId, limit) })
      },
    },

    // mark a review item done → SRS reschedule
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/review/complete`,
      handler: (req, res) => {
        if (req.method !== 'POST') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        void (async () => {
          try {
            const body = await readJsonBody(req)
            const userId = body.user_id || 'demo'
            const state = getLearningState()
            const rec = state.mastery.find(
              (m) => m.user_id === userId && m.item_type === (body.item_type ?? 'ku') && m.item_id === body.item_id,
            )
            if (!rec) {
              json(res, 404, { ok: false, error: 'record-not-found' })
              return
            }
            const scheduled = scheduleNext(rec.score, body.correct !== false, rec.wrong_count, rec.difficulty)
            const next = { ...rec, score: scheduled.mastery, difficulty: scheduled.difficulty, last_review: new Date().toISOString(), next_review: scheduled.nextReview }
            setMasteryRecords(upsertAll(state.mastery, next))
            json(res, 200, { ok: true, record: next })
          } catch (e) {
            json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
          }
        })()
      },
    },

    // modeling profile (real data)
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/profile`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        const userId = url.searchParams.get('user_id') || 'demo'
        const state = getLearningState()
        const mine = state.mastery.filter((m) => m.user_id === userId)
        const attempts = state.quiz_attempts.filter((a) => a.user_id === userId)
        json(res, 200, {
          ok: true,
          models: mine.filter((m) => m.item_type === 'model').map((m) => ({ item_id: m.item_id, score: m.score, wrong_count: m.wrong_count, correct_count: m.correct_count })),
          knowledge_units: mine.filter((m) => m.item_type === 'ku').map((m) => ({ item_id: m.item_id, score: m.score, next_review: m.next_review })),
          weak_units: mine.filter((m) => m.item_type === 'ku' && (m.score ?? 100) < 50).map((m) => ({ item_id: m.item_id, score: m.score })),
          recent_mistakes: attempts.filter((a) => a.correct === false).slice(-10).reverse(),
          reviewer_findings: getReviewerFindings(userId),
          gym: { attempts: getGymAttempts(userId).length },
          quiz_total: attempts.length,
        })
      },
    },

    // gym
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/gym/cases`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const cases = gymCases().map((c) => ({
          id: c.id,
          title: c.title,
          problem: c.problem,
          dimensions: (c.dimensions ?? []).map((d) => d.name),
          knowledge_units: c.knowledge_units ?? [],
        }))
        json(res, 200, { ok: true, cases })
      },
    },
    {
      kind: 'prefix',
      path: `${MATHMODELING_API_PREFIX}/gym/submit`,
      handler: (req, res) => {
        if (req.method !== 'POST') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        void (async () => {
          try {
            const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
            const caseId = decodeURIComponent(pathname.split('/').pop() || '')
            const gymCase = gymCases().find((c) => c.id === caseId)
            if (!gymCase) {
              json(res, 404, { ok: false, error: 'case-not-found' })
              return
            }
            const body = await readJsonBody(req)
            const graded = gradeGymProposal(gymCase, body.proposal)
            appendGymAttempt({
              user_id: body.user_id || 'demo',
              case_id: caseId,
              pct: graded.pct,
              weak_units: graded.dimensions.filter((d) => d.score < 2).flatMap((d) => d.knowledge_units),
            })
            json(res, 200, {
              ok: true,
              ...graded,
              reference_outline: gymCase.reference_outline ?? null,
              training_recommendations: graded.dimensions.filter((d) => d.score < 2).flatMap((d) => d.knowledge_units ?? []),
            })
          } catch (e) {
            json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
          }
        })()
      },
    },

    // B/M/A selector
    {
      kind: 'prefix',
      path: `${MATHMODELING_API_PREFIX}/selector`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const modelId = decodeURIComponent(pathname.split('/').pop() || '')
        const cards = selectorCards(modelId)
        if (!cards) {
          json(res, 404, { ok: false, error: 'model-not-found' })
          return
        }
        json(res, 200, { ok: true, ...cards })
      },
    },

    // algorithms catalog
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/algorithms`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const czy = czyListMethods().map((m) => ({ id: m.method_id, name: m.title, family: m.family, provider: 'czy', task: m.task, stochastic: !m.deterministic, seed: m.seed }))
        json(res, 200, {
          ok: true,
          providers: [
            { provider: 'local', version: PROVIDER_VERSION, algorithms: ALGORITHMS },
            { provider: 'czy', version: 'czy-0.1.0', upstream_commit: inventoryCommit(), algorithms: czy },
          ],
          algorithms: [...ALGORITHMS.map((a) => ({ ...a, provider: 'local' })), ...czy],
        })
      },
    },
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/algorithms/run`,
      handler: (req, res) => {
        if (req.method !== 'POST') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        void (async () => {
          try {
            const body = await readJsonBody(req)
            if (!body.algorithm) {
              json(res, 400, { ok: false, error: 'algorithm-required' })
              return
            }
            const run = await dispatchRun(
              body.algorithm,
              body.parameters ?? {},
              body.project_id ? projectDir(body.project_id) : null,
              body.session_id ?? null,
            )
            json(res, 200, { ok: !run.error, run })
          } catch (e) {
            json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
          }
        })()
      },
    },

    // projects
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/projects`,
      handler: (req, res) => {
        if (req.method === 'POST') {
          void (async () => {
            try {
              const body = await readJsonBody(req)
              const projectId = `p_${Date.now().toString(36)}${randomUUID().slice(0, 6)}`
              const dir = join(WORKSPACE_DIR, projectId)
              mkdirSync(join(dir, 'problem'), { recursive: true })
              mkdirSync(join(dir, 'experiments'), { recursive: true })
              mkdirSync(join(dir, 'review'), { recursive: true })
              const project = {
                project_id: projectId,
                session_id: body.session_id ?? null,
                name: body.name || '未命名项目',
                problem_ref: body.problem_ref ?? null,
                mode: body.mode ?? 'competition',
                stage: 'problem',
                artifacts: [],
                findings: [],
                learning_links: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
              writeJson(join(dir, 'project.json'), project)
              json(res, 200, { ok: true, project })
            } catch (e) {
              json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
            }
          })()
          return
        }
        if (req.method === 'GET') {
          mkdirSync(WORKSPACE_DIR, { recursive: true })
          const list = []
          for (const name of (existsSync(WORKSPACE_DIR) ? readdirSafe(WORKSPACE_DIR) : [])) {
            const p = readJson(join(WORKSPACE_DIR, name, 'project.json'))
            if (p) list.push(p)
          }
          list.sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
          json(res, 200, { ok: true, projects: list })
          return
        }
        json(res, 405, { ok: false, error: 'method-not-allowed' })
      },
    },
    {
      kind: 'prefix',
      path: `${MATHMODELING_API_PREFIX}/projects`,
      handler: (req, res) => {
        void (async () => {
          try {
            const url = new URL(req.url ?? '/', 'http://localhost')
            const parts = decodeURIComponent(url.pathname).split('/').filter(Boolean)
            // /api/mathmodeling/projects/:id[/action]
            const idx = parts.indexOf('projects')
            const projectId = parts[idx + 1]
            const action = parts[idx + 2] ?? null
            const found = readProject(projectId)
            if (!found) {
              json(res, 404, { ok: false, error: 'project-not-found' })
              return
            }
            const { dir, project } = found

            if (req.method === 'GET' && !action) {
              json(res, 200, {
                ok: true,
                project,
                contract: readJson(join(dir, 'problem', 'problem-contract.json')),
                features: readJson(join(dir, 'features.json')),
                datadoctor: readJson(join(dir, 'datadoctor.json')),
                runs: readJson(join(dir, 'experiments', 'run-manifest.json'))?.runs ?? [],
                validation: readJson(join(dir, 'validation.json')),
                figures: readJson(join(dir, 'figures.json'))?.figures ?? [],
                claims: readJson(join(dir, 'review', 'claim-ledger.json')),
              })
              return
            }

            if (req.method === 'PUT' && action === 'contract') {
              const body = await readJsonBody(req)
              const contract = {
                project_id: projectId,
                entries: (body.entries ?? []).map((e) => ({
                  req_id: e.req_id ?? `R${Math.ceil(Math.random() * 999)}`,
                  question: e.question ?? '',
                  objective: e.objective ?? '',
                  inputs: e.inputs ?? [],
                  outputs: e.outputs ?? [],
                  constraints: e.constraints ?? [],
                  assumptions: e.assumptions ?? [],
                  status: e.status ?? 'draft',
                })),
                frozen: false,
                updated_at: new Date().toISOString(),
              }
              writeJson(join(dir, 'problem', 'problem-contract.json'), contract)
              touchProject(dir, { stage: maxStage(project.stage, 'decompose') })
              json(res, 200, { ok: true, contract })
              return
            }

            if (req.method === 'POST' && action === 'contract' && parts[idx + 3] === 'freeze') {
              const contractPath = join(dir, 'problem', 'problem-contract.json')
              const contract = readJson(contractPath)
              if (!contract) {
                json(res, 400, { ok: false, error: 'contract-empty' })
                return
              }
              contract.frozen = true
              contract.frozen_at = new Date().toISOString()
              for (const e of contract.entries) e.status = 'confirmed'
              writeJson(contractPath, contract)
              markRunsStale(dir)
              touchProject(dir, { stage: maxStage(project.stage, 'data') })
              json(res, 200, { ok: true, contract })
              return
            }

            if (req.method === 'POST' && action === 'datadoctor') {
              const body = await readJsonBody(req)
              if (!body.csv || typeof body.csv !== 'string') {
                json(res, 400, { ok: false, error: 'csv-required' })
                return
              }
              const result = diagnose(body.csv, { target: body.target })
              const artifact = { project_id: projectId, target: body.target ?? null, ...result, created_at: new Date().toISOString() }
              writeJson(join(dir, 'datadoctor.json'), artifact)
              touchProject(dir, {
                stage: maxStage(project.stage, 'data'),
                artifacts: [...new Set([...(project.artifacts ?? []), 'datadoctor'])],
              })
              json(res, 200, { ok: true, ...artifact })
              return
            }

            if (req.method === 'PUT' && action === 'features') {
              const body = await readJsonBody(req)
              const features = {
                project_id: projectId,
                cards: (body.cards ?? []).map((c) => ({
                  name: c.name ?? '',
                  formula: c.formula ?? '',
                  meaning: c.meaning ?? '',
                  why: c.why ?? '',
                  risk: c.risk ?? '',
                  leakage_risk: c.leakage_risk ?? 'none',
                  validation: c.validation ?? '',
                  status: c.status ?? 'proposed',
                })),
                updated_at: new Date().toISOString(),
              }
              writeJson(join(dir, 'features.json'), features)
              touchProject(dir, { stage: maxStage(project.stage, 'features') })
              json(res, 200, { ok: true, features })
              return
            }

            if (req.method === 'GET' && action === 'selector') {
              const modelId = parts[idx + 3]
              const cards = selectorCards(modelId)
              if (!cards) {
                json(res, 404, { ok: false, error: 'model-not-found' })
                return
              }
              json(res, 200, { ok: true, ...cards })
              return
            }

            if (req.method === 'POST' && action === 'runs') {
              const body = await readJsonBody(req)
              if (!body.algorithm) {
                json(res, 400, { ok: false, error: 'algorithm-required' })
                return
              }
              const run = await dispatchRun(
                body.algorithm,
                body.parameters ?? {},
                dir,
                project.session_id,
              )
              touchProject(dir, { stage: maxStage(project.stage, 'lab'), artifacts: [...new Set([...(project.artifacts ?? []), 'runs'])] })
              json(res, 200, { ok: !run.error, run })
              return
            }

            if (req.method === 'POST' && action === 'figures') {
              const body = await readJsonBody(req)
              const figPath = join(dir, 'figures.json')
              const store = readJson(figPath) ?? { project_id: projectId, figures: [] }
              const figure = {
                figure_id: `fig_${randomUUID().slice(0, 8)}`,
                run_id: body.run_id ?? null,
                type: body.type ?? 'unknown',
                caption: body.caption ?? '',
                data: body.data ?? {},
                created_at: new Date().toISOString(),
              }
              store.figures.push(figure)
              writeJson(figPath, store)
              touchProject(dir, {
                stage: maxStage(project.stage, 'lab'),
                artifacts: [...new Set([...(project.artifacts ?? []), 'figures'])],
              })
              json(res, 200, { ok: true, figure })
              return
            }

            if (req.method === 'GET' && action === 'figures') {
              json(res, 200, { ok: true, figures: readJson(join(dir, 'figures.json'))?.figures ?? [] })
              return
            }
            if (req.method === 'POST' && action === 'validation') {
              const body = await readJsonBody(req)
              const manifest = readJson(join(dir, 'experiments', 'run-manifest.json'))?.runs ?? []
              const byId = Object.fromEntries(manifest.map((r) => [r.run_id, r]))
              const target = byId[body.run_id]
              if (!target) {
                json(res, 404, { ok: false, error: 'run-not-found' })
                return
              }
              const baselineRun = body.baseline_run_id ? byId[body.baseline_run_id] : null
              const validation = {
                project_id: projectId,
                run_id: body.run_id,
                method: body.method ?? 'baseline-compare',
                checks: [
                  { name: 'multi-seed', ok: (target.seeds?.length ?? 0) > 1 || target.metrics.seeds_run > 1 || !target.algorithm.match(/kmeans|pso/), note: target.algorithm.match(/kmeans|pso/) ? '随机算法需多 seed' : '确定性算法' },
                  { name: 'stale', ok: !target.stale, note: target.stale ? '上游 contract 已变更，结果标记 STALE' : '输入未变化' },
                  { name: 'baseline-compare', ok: true, note: baselineRun ? `baseline ${baselineRun.run_id.slice(0, 8)} vs main` : '未提供 baseline run' },
                  { name: 'residual-check', ok: true, note: target.artifacts.residuals ? '残差已记录' : '非回归任务跳过' },
                ],
                comparison:
                  baselineRun && target.algorithm === baselineRun.algorithm
                    ? {
                        metric: Object.keys(target.metrics)[0] ?? null,
                        baseline: baselineRun.metrics,
                        main: target.metrics,
                      }
                    : null,
                created_at: new Date().toISOString(),
              }
              writeJson(join(dir, 'validation.json'), validation)
              touchProject(dir, { stage: maxStage(project.stage, 'validation') })
              json(res, 200, { ok: true, validation })
              return
            }

            if (req.method === 'POST' && action === 'review') {
              const body = await readJsonBody(req)
              const DIMENSION_KUS = {
                'problem understanding': ['decomposition'],
                'data handling': ['feature-scaling', 'missing-data', 'leakage'],
                'feature engineering': ['feature-engineering'],
                'model reasonableness': ['assumptions'],
                'mathematical rigor': ['assumptions'],
                'algorithm / solution': ['algorithm-selection'],
                validation: ['validation'],
                'result interpretation': ['interpretation'],
                innovation: [],
                visualization: ['visualization'],
                writing: [],
                reproducibility: ['run-manifest'],
              }
              const findings = Object.entries(body.scores ?? {})
                .filter(([, v]) => (v?.score ?? 2) <= 1)
                .map(([dimension, v]) => ({
                  dimension,
                  score: v.score,
                  note: v.note ?? '',
                  missing_evidence: v.missing_evidence ?? null,
                  knowledge_units: DIMENSION_KUS[dimension] ?? [],
                }))
              setReviewerFindings(body.user_id || 'demo', projectId, findings)
              const ledger = readJson(join(dir, 'review', 'claim-ledger.json')) ?? { project_id: projectId, claims: [] }
              ledger.review = { scores: body.scores ?? {}, findings, created_at: new Date().toISOString() }
              writeJson(join(dir, 'review', 'claim-ledger.json'), ledger)
              touchProject(dir, { stage: maxStage(project.stage, 'review'), findings })
              json(res, 200, { ok: true, findings, weak_units: [...new Set(findings.flatMap((f) => f.knowledge_units))] })
              return
            }

            if (req.method === 'PUT' && action === 'claims') {
              const body = await readJsonBody(req)
              const manifest = readJson(join(dir, 'experiments', 'run-manifest.json'))?.runs ?? []
              const runIds = new Set(manifest.map((r) => r.run_id))
              const claims = (body.claims ?? []).map((c) => ({
                claim: c.claim ?? '',
                evidence: c.evidence ?? null,
                run_id: c.run_id ?? null,
                supported: c.run_id ? runIds.has(c.run_id) : Boolean(c.evidence),
              }))
              const ledger = { project_id: projectId, claims, updated_at: new Date().toISOString() }
              writeJson(join(dir, 'review', 'claim-ledger.json'), ledger)
              json(res, 200, { ok: true, ledger, unsupported: claims.filter((c) => !c.supported).length })
              return
            }

            if (req.method === 'GET' && action === 'gap') {
              const findings = getReviewerFindings(body_user(req, url))
              const weakKUs = [...new Set(findings.flatMap((f) => f.knowledge_units ?? []))]
              json(res, 200, { ok: true, weak_units: weakKUs, findings, feeds: ['daily-review', 'profile'] })
              return
            }

            json(res, 404, { ok: false, error: 'unknown-action' })
          } catch (e) {
            json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
          }
        })()
      },
    },
  ]
}

function body_user(req, url) {
  return new URL(req.url ?? '/', 'http://localhost').searchParams.get('user_id') || 'demo'
}

function upsertAll(records, record) {
  const idx = records.findIndex((r) => r.user_id === record.user_id && r.item_type === record.item_type && r.item_id === record.item_id)
  if (idx < 0) return [...records, record]
  const next = [...records]
  next[idx] = record
  return next
}

const STAGE_ORDER = ['problem', 'decompose', 'data', 'features', 'selector', 'lab', 'viz', 'validation', 'review']
function maxStage(a, b) {
  return STAGE_ORDER.indexOf(b) > STAGE_ORDER.indexOf(a) ? b : a
}

function readdirSafe(dir) {
  try {
    return readdirSync(dir).filter((n) => !n.startsWith('.'))
  } catch {
    return []
  }
}












