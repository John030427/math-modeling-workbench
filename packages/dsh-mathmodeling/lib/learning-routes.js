import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gradeQuizSubmission, findMastery, upsertMastery } from '../../core/dist/mastery/index.js'
import { stripAnswers, findQuestion } from '../../core/dist/quiz/index.js'
import { buildTutorContext, offlineReply } from '../../core/dist/tutor/index.js'
import { getModelById, loadModelYaml } from './registry.js'
import {
  getSessionContext,
  setSessionContext,
  getLearningState,
  setMasteryRecords,
  appendQuizAttempt,
} from './stores.js'
import { MATHMODELING_API_PREFIX } from './routes.js'

const QUIZ_DIR = fileURLToPath(new URL('../../../registry/quizzes', import.meta.url))

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

async function readJsonBody(req, max = 32 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > max) throw new Error('body-too-large')
    chunks.push(buffer)
  }
  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function yamlListBlock(text, key) {
  const normalized = text.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const start = lines.findIndex((l) => l.trim() === `${key}:`)
  if (start < 0) return []
  const items = []
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.startsWith('  - ')) break
    items.push(line.slice(4).trim())
  }
  return items
}

function modelDetail(id) {
  const summary = getModelById(id)
  if (!summary) return null
  const yaml = loadModelYaml(id)
  if (!yaml) return summary
  return {
    ...summary,
    use_when: yamlListBlock(yaml, 'use_when'),
    avoid_when: yamlListBlock(yaml, 'avoid_when'),
    common_mistakes: yamlListBlock(yaml, 'common_mistakes'),
    alternatives: yamlListBlock(yaml, 'alternatives'),
  }
}

function loadQuizBank(modelId) {
  const path = join(QUIZ_DIR, `${modelId}.json`)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

function sessionIdFrom(req, body) {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const q = url.searchParams.get('session_id')
  if (q) return q
  if (body && typeof body.session_id === 'string') return body.session_id
  return null
}

/** Extended routes for P1 learning + tutor preview. */
export function makeLearningRoutes() {
  return [
    {
      kind: 'prefix',
      path: `${MATHMODELING_API_PREFIX}/quizzes`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const modelId = decodeURIComponent(pathname.split('/').pop() || '')
        const bank = loadQuizBank(modelId)
        if (!bank) {
          json(res, 404, { ok: false, error: 'quiz-bank-not-found' })
          return
        }
        json(res, 200, { ok: true, ...stripAnswers(bank) })
      },
    },
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/quiz/submit`,
      handler: (req, res) => {
        if (req.method !== 'POST') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        void (async () => {
          try {
            const body = await readJsonBody(req)
            const userId = body.user_id || 'demo'
            const modelId = String(body.quiz_id || '').split(':')[0]
            const bank = loadQuizBank(modelId)
            if (!bank) {
              json(res, 404, { ok: false, error: 'quiz-not-found' })
              return
            }
            const question = findQuestion(bank, body.quiz_id)
            if (!question) {
              json(res, 404, { ok: false, error: 'question-not-found' })
              return
            }
            const state = getLearningState()
            const existing = findMastery(
              state.mastery,
              userId,
              body.item_type || 'ku',
              body.item_id || question.knowledge_unit,
            )
            const graded = gradeQuizSubmission(
              question,
              body.selected,
              existing,
              userId,
              body.item_type || 'ku',
              body.item_id || question.knowledge_unit,
            )
            const records = upsertMastery(state.mastery, graded.record)
            setMasteryRecords(records)
            appendQuizAttempt({
              user_id: userId,
              quiz_id: body.quiz_id,
              correct: graded.correct,
              selected: body.selected,
              session_id: body.session_id ?? null,
              created_at: new Date().toISOString(),
            })
            json(res, 200, {
              ok: true,
              correct: graded.correct,
              explanation: graded.explanation,
              mastery: graded.mastery,
              answer: graded.answer,
            })
          } catch (e) {
            json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
          }
        })()
      },
    },
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/mastery`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        const userId = url.searchParams.get('user_id') || 'demo'
        const itemType = url.searchParams.get('item_type')
        const itemId = url.searchParams.get('item_id')
        const state = getLearningState()
        let rows = state.mastery.filter((r) => r.user_id === userId)
        if (itemType) rows = rows.filter((r) => r.item_type === itemType)
        if (itemId) rows = rows.filter((r) => r.item_id === itemId)
        json(res, 200, { ok: true, mastery: rows })
      },
    },
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/tutor/offline`,
      handler: (req, res) => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        const sessionId = url.searchParams.get('session_id')
        const message = url.searchParams.get('message') || ''
        const mode = url.searchParams.get('mode') || 'copilot'
        if (!sessionId) {
          json(res, 400, { ok: false, error: 'session_id-required' })
          return
        }
        const ctx = getSessionContext(sessionId)
        if (!ctx) {
          json(res, 404, { ok: false, error: 'session-not-found' })
          return
        }
        const model = ctx.model_id ? modelDetail(ctx.model_id) : null
        const tutorCtx = buildTutorContext(ctx, message, model, mode)
        const reply = offlineReply(tutorCtx)
        json(res, 200, { ok: true, context: ctx, reply })
      },
    },
  ]
}

/** Session-scoped context routes (replace global pageContext in index.js). */
export function makeContextRoutes() {
  return [
    {
      kind: 'exact',
      path: `${MATHMODELING_API_PREFIX}/context`,
      handler: (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (req.method === 'GET') {
          const sessionId = url.searchParams.get('session_id')
          if (!sessionId) {
            json(res, 400, { ok: false, error: 'session_id-required' })
            return
          }
          const ctx = getSessionContext(sessionId)
          json(res, 200, { ok: true, context: ctx })
          return
        }
        if (req.method === 'POST') {
          void (async () => {
            try {
              const body = await readJsonBody(req)
              const sessionId = sessionIdFrom(req, body)
              if (!sessionId) {
                json(res, 400, { ok: false, error: 'session_id-required' })
                return
              }
              const next = setSessionContext(sessionId, body)
              json(res, 200, { ok: true, context: next })
            } catch (e) {
              json(res, 400, { ok: false, error: String(e instanceof Error ? e.message : e) })
            }
          })()
          return
        }
        json(res, 405, { ok: false, error: 'method-not-allowed' })
      },
    },
  ]
}
