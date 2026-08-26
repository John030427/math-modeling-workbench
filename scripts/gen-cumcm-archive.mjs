/**
 * Fetch yushugulao/CUMCM-Archive manifest.csv → registry/resources/cumcm-archive.json
 * Records: year, problem, kind(赛题|优秀论文), title, source_path, source_url (GitHub blob), availability.
 * Source policy: index/link only (Tier C) — no PDF vendoring.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'registry', 'resources', 'cumcm-archive.json')
const CSV_URL = 'https://raw.githubusercontent.com/yushugulao/CUMCM-Archive/main/manifest.csv'
const REPO = 'yushugulao/CUMCM-Archive'
const BRANCH = 'main'

async function fetchWithRetry(url, attempts = 4) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url)
      if (!r.ok) throw new Error(`http ${r.status}`)
      return r
    } catch (e) {
      lastErr = e
      await new Promise((s) => setTimeout(s, 1500 * (i + 1)))
    }
  }
  throw lastErr
}

const localCsv = process.argv[2] ?? null
const res = localCsv
  ? { ok: true, text: readFileSync(localCsv, 'utf8') }
  : await fetchWithRetry(CSV_URL)
const csv = (localCsv ? res.text : await res.text()).replace(/^\uFEFF/, '')
const lines = csv.split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim())

const [header, ...rows] = lines
if (!header.startsWith('year,problem,kind')) throw new Error('unexpected manifest header')

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let inQ = false
  for (const ch of line) {
    if (ch === '"') inQ = !inQ
    else if (ch === ',' && !inQ) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

const records = []
for (const line of rows) {
  const [year, problem, kind, path, source, bytes, method] = parseCsvLine(line)
  if (!year || !path) continue
  const fileName = path.split('/').pop() ?? path
  records.push({
    id: `cumcm-${year}-${problem}-${records.length}`,
    contest: 'CUMCM',
    year: Number(year),
    problem,
    kind,
    title: fileName.replace(/\.pdf$/i, ''),
    source_repo: REPO,
    source_path: path,
    source_url: `https://github.com/${REPO}/blob/${BRANCH}/${encodeURI(path)}`,
    availability: 'GitHub 可获取（PDF）',
    license_note: '版权归 CUMCM 组委会与原作者 — 仅索引外链',
    bytes: Number(bytes) || 0,
  })
}

const out = {
  generated_at: new Date().toISOString(),
  source_repo: REPO,
  source_note: 'manifest.csv @ main — 重新运行本脚本可刷新',
  counts: {
    total: records.length,
    problems: records.filter((r) => r.kind === '赛题').length,
    excellent_papers: records.filter((r) => r.kind === '优秀论文').length,
    years: new Set(records.map((r) => r.year)).size,
  },
  records,
}
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(out, null, 1), 'utf8')
console.log(`[cumcm-archive] ${records.length} records → ${OUT}`)
