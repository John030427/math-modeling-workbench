import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildTutorContext, offlineReply } from '../dist/tutor/index.js'

test('kmeans scaling tutor offline', () => {
  const ctx = buildTutorContext(
    { page: 'lesson/kmeans', model_id: 'kmeans', knowledge_unit: 'feature-scaling', lesson_step: 8 },
    '为什么要标准化？',
    { id: 'kmeans', use_when: ['球形簇'], avoid_when: ['噪声'], common_mistakes: ['not_scaling'] },
    'copilot',
  )
  const reply = offlineReply(ctx)
  assert.ok(reply.answer.includes('欧氏距离'))
})

test('session-scoped sse question', () => {
  const ctx = buildTutorContext(
    { page: 'lesson/kmeans', model_id: 'kmeans', knowledge_unit: 'sse', lesson_step: 4 },
    'SSE 怎么来的？',
    { id: 'kmeans' },
    'copilot',
  )
  const reply = offlineReply(ctx)
  assert.ok(reply.answer.includes('SSE'))
})
