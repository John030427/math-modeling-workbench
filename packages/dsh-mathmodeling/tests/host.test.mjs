#!/usr/bin/env node
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadRegistrySnapshot, getModelById } from '../lib/registry.js'
import { makeMathModelingRoutes, MATHMODELING_API_PREFIX } from '../lib/routes.js'
import { MODELING_TUTOR_SKILL } from '../lib/skill.js'
import { getSessionContext, setSessionContext } from '../lib/stores.js'

test('registry snapshot loads models', () => {
  const { models } = loadRegistrySnapshot()
  assert.ok(models.length >= 1)
  assert.ok(getModelById('kmeans'))
})

test('modeling-tutor skill registered', () => {
  assert.equal(MODELING_TUTOR_SKILL.name, 'modeling-tutor')
})

test('session context isolation', () => {
  setSessionContext('session-a', { page: 'atlas', model_id: 'kmeans' })
  setSessionContext('session-b', { page: 'dashboard', model_id: null })
  const a = getSessionContext('session-a')
  const b = getSessionContext('session-b')
  assert.equal(a?.model_id, 'kmeans')
  assert.equal(b?.model_id, null)
})

test('health route returns 200', () => {
  const routes = makeMathModelingRoutes({ version: '0.2.0' })
  const health = routes.find((r) => r.path === `${MATHMODELING_API_PREFIX}/health`)
  assert.ok(health)
  let status = 0
  let body = ''
  health.handler({ method: 'GET', url: `${MATHMODELING_API_PREFIX}/health` }, {
    writeHead(code) { status = code },
    end(payload) { body = payload },
  })
  assert.equal(status, 200)
  assert.equal(JSON.parse(body).plugin, 'dsh-mathmodeling')
})
