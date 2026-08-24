import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getModelById, loadRegistrySnapshot, loadModelYaml } from './registry.js'

/** @typedef {import('@deepseek-ai/dsh-host-webserver').WebRoute} WebRoute */

export const MATHMODELING_API_PREFIX = '/api/mathmodeling'

const MAX_BODY_BYTES = 32 * 1024

/** @param {import('node:http').ServerResponse} res @param {number} status @param {unknown} body */
function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

/** @param {import('node:http').IncomingMessage} req */
async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new Error('body-too-large')
    chunks.push(buffer)
  }
  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

/** Minimal YAML field extractor for registry detail route. */
function yamlField(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '').trim() : undefined
}

function yamlListBlock(text, key) {
  const normalized = text.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const start = lines.findIndex(l => l.trim() === `${key}:`)
  if (start < 0) return []
  const items = []
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.startsWith('  - ')) break
    items.push(line.slice(4).trim())
  }
  return items
}

/**
 * @param {{ version: string }} deps
 * @returns {WebRoute[]}
 */
export function makeMathModelingRoutes(deps) {
  const { version } = deps

  return [
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/health`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        json(res, 200, {
          ok: true,
          plugin: 'dsh-mathmodeling',
          version,
          timestamp: Date.now(),
        })
      },
    },
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/registry`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const snapshot = loadRegistrySnapshot()
        json(res, 200, { ok: true, ...snapshot })
      },
    },
    {
      kind: 'prefix',
      path: `${MATHMODELING_API_PREFIX}/registry`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const prefix = `${MATHMODELING_API_PREFIX}/registry/`
        if (!pathname.startsWith(prefix)) {
          json(res, 404, { ok: false, error: 'not-found' })
          return
        }
        const id = decodeURIComponent(pathname.slice(prefix.length).split('/')[0])
        if (!id) {
          json(res, 400, { ok: false, error: 'model-id-required' })
          return
        }
        const summary = getModelById(id)
        if (!summary) {
          json(res, 404, { ok: false, error: 'model-not-found', id })
          return
        }
        const yaml = loadModelYaml(id)
        const detail = yaml
          ? {
              ...summary,
              use_when: yamlListBlock(yaml, 'use_when'),
              avoid_when: yamlListBlock(yaml, 'avoid_when'),
              common_mistakes: yamlListBlock(yaml, 'common_mistakes'),
              summary: yamlField(yaml, 'summary') ?? summary.summary,
            }
          : summary
        json(res, 200, { ok: true, model: detail })
      },
    },
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/assets/ui.css`,
      handler: (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const cssPath = fileURLToPath(new URL('../assets/ui.css', import.meta.url))
        try {
          const body = readFileSync(cssPath, 'utf8')
          res.writeHead(200, { 'content-type': 'text/css; charset=utf-8' })
          if (req.method === 'HEAD') res.end()
          else res.end(body)
        } catch {
          json(res, 404, { ok: false, error: 'asset-not-found' })
        }
      },
    },
  ]
}
