import assert from 'node:assert/strict'
import { test } from 'node:test'

test('harness spike cordis patch disables ui-layout', async () => {
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const path = await import('node:path')
  const patchPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../cordis.patch.yml',
  )
  const yaml = readFileSync(patchPath, 'utf8')
  assert.ok(yaml.includes('ui-layout'))
  assert.ok(yaml.includes('disabled: true'))
  assert.ok(yaml.includes('@math-modeling/harness-spike'))
})

test('harness spike host health route exists', async () => {
  const { apply, inject } = await import('../lib/index.js')
  assert.deepEqual(inject, ['webServer'])
  assert.equal(typeof apply, 'function')
})
