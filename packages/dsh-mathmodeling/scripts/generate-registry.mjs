/**
 * Build-time snapshot of registry/models/*.yaml → lib/registry-data.json
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const MODELS_DIR = join(ROOT, '../../registry/models')
const OUT = join(ROOT, 'lib/registry-data.json')

function line(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!m) return undefined
  return m[1].replace(/^["']|["']$/g, '').trim()
}

/** Collect `- item` list entries under a `key:` line (any indent, first occurrence). */
function listUnder(text, key) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((l) => new RegExp(`^\\s*${key}:\\s*$`).test(l))
  if (start === -1) return []
  const items = []
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i]
    if (/^\s*-\s+/.test(l)) {
      items.push(l.replace(/^\s*-\s+/, '').replace(/^["']|["']$/g, '').trim())
    } else if (l.trim() === '') {
      continue
    } else {
      break
    }
  }
  return items
}

/** Flow style list: `key: [a, b]` (first occurrence). */
function flowList(text, key) {
  const m = text.match(new RegExp(`^\\s*${key}:\\s*\\[([^\\]]*)\\]`, 'm'))
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

function listAny(text, key) {
  const flow = flowList(text, key)
  return flow.length > 0 ? flow : listUnder(text, key)
}

/** Inline map style: `category: { task: [a, b], ... }` */
function inlineCategoryTask(text) {
  const m = text.match(/^category:\s*\{\s*task:\s*\[([^\]]*)\]/m)
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseYaml(text) {
  const id = line(text, 'id')
  if (!id) return null
  const difficulty = line(text, 'difficulty')
  const demoPriority = line(text, 'demo_priority')
  const tasks = listAny(text, 'task').length > 0 ? listAny(text, 'task') : inlineCategoryTask(text)
  const family = listAny(text, 'family')
  return {
    id,
    name: line(text, 'name') ?? id,
    name_zh: line(text, 'name_zh') ?? line(text, 'name') ?? id,
    task: tasks[0] ?? 'other',
    tasks,
    family: family[0] ?? 'other',
    difficulty: difficulty ?? 'unknown',
    demo_priority: demoPriority ? Number(demoPriority) : 99,
    knowledge_units: listAny(text, 'knowledge_units'),
    prerequisites: listAny(text, 'prerequisites'),
    use_when: listUnder(text, 'use_when'),
    avoid_when: listUnder(text, 'avoid_when'),
    summary: line(text, 'summary') ?? '',
  }
}

let models = []
try {
  const files = readdirSync(MODELS_DIR).filter(f => f.endsWith('.yaml')).sort()
  models = files.map(f => parseYaml(readFileSync(join(MODELS_DIR, f), 'utf8'))).filter(Boolean)
} catch {
  models = [
    {
      id: 'kmeans',
      name: 'K-Means',
      name_zh: 'K-Means 聚类',
      difficulty: 'beginner',
      demo_priority: 1,
      summary: '通过迭代更新簇中心划分样本，最小化 SSE。',
    },
  ]
}

models.sort((a, b) => a.demo_priority - b.demo_priority || a.id.localeCompare(b.id))
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), models }, null, 2), 'utf8')
console.log(`[dsh-mathmodeling] wrote ${models.length} models → lib/registry-data.json`)
