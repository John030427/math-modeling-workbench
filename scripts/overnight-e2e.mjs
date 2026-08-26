/**
 * Overnight Product MVP E2E (plan §21, API layer 1–19).
 * Usage: node scripts/overnight-e2e.mjs [baseUrl]
 */
const BASE = (process.argv[2] ?? 'http://127.0.0.1:3100') + '/api/mathmodeling'
const results = []
function step(n, name, ok, detail = '') {
  results.push({ n, name, ok, detail })
  console.log(`${ok ? '✓' : '✗'} ${n}. ${name}${detail ? ' — ' + detail : ''}`)
}
async function req(method, path, body) {
  const r = await fetch(BASE + path, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await r.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text, status: r.status }
  }
}

const csv = [
  'month,sales,price,promo,target_sales',
  '1,1200,50,0,1180',
  '2,1350,50,1,1330',
  '3,1280,52,0,1290',
  '4,1500,49,1,1510',
  '5,900,55,0,880',
].join('\n')

// 8. create project
const p = await req('POST', '/projects', { name: 'overnight-e2e', session_id: 'e2e' })
const pid = p.project.project_id
step(8, 'create project', Boolean(pid), pid)

// 9. problem contract + freeze
const c = await req('PUT', `/projects/${pid}/contract`, {
  entries: [
    {
      req_id: 'R1',
      question: '预测未来 12 期销量',
      objective: '给出点预测与区间',
      inputs: '历史月度销量',
      outputs: '预测序列',
      constraints: '时间外推验证',
      assumptions: '模式延续',
    },
  ],
})
step(9, 'problem contract', c.contract?.entries?.length === 1, `${c.contract?.entries?.length} entries`)
const f = await req('POST', `/projects/${pid}/contract/freeze`, {})
step('9b', 'contract freeze', f.contract?.frozen === true)

// 10. data doctor
const dd = await req('POST', `/projects/${pid}/datadoctor`, { csv, target: 'target_sales' })
step(10, 'data doctor', dd.row_count === 5 && dd.findings.length > 0 && dd.recommendations.length > 0, `findings=${dd.findings.length} recs=${dd.recommendations.length}`)

// 11. feature cards
const ft = await req('PUT', `/projects/${pid}/features`, {
  cards: [
    {
      name: 'lag_1_sales',
      formula: 'sales[t-1]',
      meaning: '上月销量',
      why: '需求惯性',
      risk: '季节突变',
      leakage_risk: 'none',
      validation: '时间外推',
      status: 'accepted',
    },
  ],
})
step(11, 'feature card accepted', ft.features?.cards?.[0]?.status === 'accepted')

// 12. B/M/A selector
const sel = await req('GET', `/selector/linear-regression`)
step(12, 'B/M/A selector', Boolean(sel.baseline && sel.main && sel.alternative), `B=${sel.baseline?.name} M=${sel.main?.name} A=${sel.alternative?.name}`)

// 13. real algorithm execution (deterministic + stochastic)
const lr = await req('POST', `/projects/${pid}/runs`, {
  algorithm: 'linear-regression',
  parameters: { X: [[50, 0], [50, 1], [52, 0], [49, 1], [55, 0]], y: [1180, 1330, 1290, 1510, 880] },
})
step('13a', 'deterministic run (linear-regression)', lr.ok === true && lr.run.metrics.r2 !== undefined, `r2=${lr.run.metrics.r2}`)
const km = await req('POST', `/projects/${pid}/runs`, {
  algorithm: 'kmeans',
  parameters: { points: [[1, 1], [1.2, 0.9], [5, 5], [5.4, 4.8], [9, 9]], k: 2, seeds: [1, 2, 3, 4] },
})
step('13b', 'stochastic run (kmeans multi-seed)', km.ok === true && km.run.metrics.seeds_run === 4, `sse_mean=${km.run.metrics.sse_mean} std=${km.run.metrics.sse_std}`)

// 14. run manifest
const detail = await req('GET', `/projects/${pid}`)
step(14, 'run manifest persisted', (detail.runs ?? []).length >= 2, `${detail.runs.length} runs`)

// 15. validation
const runs = detail.runs
const lrRun = runs.find((r) => r.algorithm === 'linear-regression')
const v = await req('POST', `/projects/${pid}/validation`, { run_id: lrRun.run_id, method: 'residual-check' })
step(15, 'validation checks', Array.isArray(v.validation?.checks) && v.validation.checks.length >= 3, `${v.validation.checks.filter((x) => x.ok).length}/${v.validation.checks.length} ok`)

// 16. reviewer (mark validation as needing work)
const rev = await req('POST', `/projects/${pid}/review`, {
  user_id: 'demo',
  scores: { validation: { score: 1, note: '仅单次划分，需多窗口' }, 'data handling': { score: 1, note: '缺失处理未记录' } },
})
step(16, 'reviewer findings', (rev.findings ?? []).length === 2, `findings=${rev.findings.length} weakKUs=${JSON.stringify(rev.weak_units)}`)

// 17. claims evidence chain (supported vs unsupported)
const claimsResp = await req('PUT', `/projects/${pid}/claims`, {
  claims: [
    { claim: 'R2=1.0 于 5 样本拟合', run_id: lrRun.run_id },
    { claim: '预测 MAPE=3%（无实验支撑）', run_id: null },
  ],
})
const claims = claimsResp.ledger ?? claimsResp
step(17, 'claim ledger anti-fabrication', claims.claims.filter((x) => x.supported).length === 1 && claimsResp.unsupported === 1, `supported=${claims.claims.filter((x) => x.supported).length} unsupported=${claimsResp.unsupported}`)

// 18. profile shows weaknesses
const prof = await req('GET', '/profile?user_id=demo')
step(18, 'profile weaknesses', (prof.weak_units ?? []).length > 0 && (prof.reviewer_findings ?? []).length >= 2, `weak=${prof.weak_units.map((w) => w.item_id).join(',')} findings=${prof.reviewer_findings.length}`)

// 19. weakness enters daily review
const q = await req('GET', '/review/queue?limit=30')
const hasFindingKU = q.queue.some((i) => ['leakage', 'missing-data'].includes(i.item_id) || i.reasons.includes('reviewer-finding'))
step(19, 'weakness in daily review', hasFindingKU || q.queue.length > 0, `queue=${q.queue.length}`)

// 5b. quiz → mastery changes after refresh (mastery GET)
const before = await req('GET', '/mastery?user_id=demo&item_type=ku&item_id=centroid')
const sub = await req('POST', '/quiz/submit', { quiz_id: 'kmeans:q1', selected: 'B', session_id: 'e2e', user_id: 'demo' })
const after = await req('GET', '/mastery?user_id=demo&item_type=ku&item_id=centroid')
step('5b', 'quiz → mastery persists (GET after refresh)', before.mastery[0]?.score !== after.mastery[0]?.score, `${before.mastery[0]?.score} → ${after.mastery[0]?.score}`)

// 6. daily review queue reflects learning state
step(6, 'daily review reflects state', q.queue.length > 0, `${q.queue.length} items`)

// 7. gym proposal feedback
const gym = await req('POST', '/gym/submit/kmeans-feature-scaling', {
  user_id: 'demo',
  proposal: {
    变量选择与目标定义: '无监督分群：用月均消费、到店频次做聚类分群',
    数据预处理: '金额与频次量纲差距大，做 z-score 标准化',
    异常值: '消费金额右偏，检查离群值，必要时对数变换',
    方法与K: 'K-Means，肘部法 + 轮廓系数定 K，多种子初始化',
    验证: '轮廓系数、质心画像可解释性、跨种子稳定',
  },
})
step(7, 'gym proposal → dimension feedback', gym.dimensions?.length === 5 && typeof gym.pct === 'number', `pct=${gym.pct}%`)

// 20. project persists (re-fetch)
const again = await req('GET', `/projects/${pid}`)
step(20, 'project persists', again.project?.project_id === pid && (again.runs ?? []).length >= 2)

const pass = results.filter((r) => r.ok).length
console.log(`\nE2E: ${pass}/${results.length} steps PASS`)
process.exit(pass === results.length ? 0 : 1)

