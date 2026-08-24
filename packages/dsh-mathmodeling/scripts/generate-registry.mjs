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

function parseYaml(text) {
  const id = line(text, 'id')
  if (!id) return null
  const difficulty = line(text, 'difficulty')
  const demoPriority = line(text, 'demo_priority')
  return {
    id,
    name: line(text, 'name') ?? id,
    name_zh: line(text, 'name_zh') ?? line(text, 'name') ?? id,
    difficulty: difficulty ?? 'unknown',
    demo_priority: demoPriority ? Number(demoPriority) : 99,
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
