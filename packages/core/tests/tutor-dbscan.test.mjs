import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildTutorContext, offlineReply } from '../dist/tutor/index.js'

test('dbscan comparison uses kmeans context', () => {
  const ctx = buildTutorContext(
    {
      page: 'lesson/kmeans',
      model_id: 'kmeans',
      knowledge_unit: 'kmeans-vs-dbscan',
      lesson_step: 9,
    },
    '那 DBSCAN 呢？',
    { id: 'kmeans', use_when: ['球形簇'], avoid_when: ['噪声多'] },
    'copilot',
  )
  const reply = offlineReply(ctx)
  assert.ok(reply.answer.includes('DBSCAN'))
  assert.ok(reply.answer.includes('K-Means') || reply.answer.includes('密度'))
})
