import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createEmptyContext, mergeContext } from '../dist/context/types.js'

test('session A and B contexts do not share state', () => {
  const a = createEmptyContext('session-a')
  const b = createEmptyContext('session-b')
  const a2 = mergeContext(a, {
    model_id: 'kmeans',
    knowledge_unit: 'feature-scaling',
    page: 'lesson/kmeans',
    lesson_step: 8,
  })
  assert.equal(a2.session_id, 'session-a')
  assert.equal(a2.model_id, 'kmeans')
  assert.equal(b.model_id, null)
  assert.notEqual(a2.session_id, b.session_id)
})
