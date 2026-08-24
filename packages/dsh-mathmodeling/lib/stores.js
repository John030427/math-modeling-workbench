import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createEmptyContext, mergeContext } from '../../core/dist/context/types.js'
import { seedMasteryRecords } from '../../core/dist/mastery/index.js'

const PLUGIN_DIR = join(homedir(), '.dsh', 'plugins', 'mathmodeling')
const LEARNING_PATH = join(PLUGIN_DIR, 'learning-state.json')

/** @type {Map<string, import('@math-modeling/core/context').ModelingContext>} */
const sessionContexts = new Map()

/** @type {{ mastery: import('@math-modeling/core/mastery').MasteryRecord[], quiz_attempts: Array<Record<string, unknown>> }} */
let learningState = { mastery: [], quiz_attempts: [] }

function ensureDir() {
  mkdirSync(PLUGIN_DIR, { recursive: true })
}

function loadLearningState() {
  try {
    if (!existsSync(LEARNING_PATH)) {
      learningState = { mastery: seedMasteryRecords('demo'), quiz_attempts: [] }
      persistLearningState()
      return
    }
    const parsed = JSON.parse(readFileSync(LEARNING_PATH, 'utf8'))
    learningState = {
      mastery: Array.isArray(parsed.mastery) ? parsed.mastery : seedMasteryRecords('demo'),
      quiz_attempts: Array.isArray(parsed.quiz_attempts) ? parsed.quiz_attempts : [],
    }
  } catch {
    learningState = { mastery: seedMasteryRecords('demo'), quiz_attempts: [] }
  }
}

function persistLearningState() {
  ensureDir()
  const tmp = `${LEARNING_PATH}.tmp`
  writeFileSync(tmp, JSON.stringify(learningState, null, 2), 'utf8')
  renameSync(tmp, LEARNING_PATH)
}

loadLearningState()

export function getSessionContext(sessionId) {
  if (!sessionId) return null
  if (!sessionContexts.has(sessionId)) {
    sessionContexts.set(sessionId, createEmptyContext(sessionId, 'demo'))
  }
  return sessionContexts.get(sessionId)
}

export function setSessionContext(sessionId, patch) {
  const prev = getSessionContext(sessionId)
  if (!prev) return null
  const next = mergeContext(prev, { ...patch, session_id: sessionId })
  sessionContexts.set(sessionId, next)
  return next
}

export function getLearningState() {
  return learningState
}

export function setMasteryRecords(records) {
  learningState.mastery = records
  persistLearningState()
}

export function appendQuizAttempt(attempt) {
  learningState.quiz_attempts.push(attempt)
  persistLearningState()
}

export function resetDemoLearning() {
  learningState = { mastery: seedMasteryRecords('demo'), quiz_attempts: [] }
  persistLearningState()
}
