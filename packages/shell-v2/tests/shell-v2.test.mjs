import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { test } from 'node:test'

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

test('package.json exposes client + package.json exports', () => {
  const pkg = JSON.parse(readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'))
  assert.equal(pkg.name, '@math-modeling/shell-v2')
  assert.ok(pkg.exports['./client'])
  assert.ok(pkg.exports['./package.json'])
  assert.equal(pkg.dsh.client.immediately, true)
})

test('package patch inserts exactly one loader entry', () => {
  const yaml = readFileSync(path.join(pkgRoot, 'cordis.patch.yml'), 'utf8')
  assert.match(yaml, /id: mathmodel-shell-v2/)
  assert.match(yaml, /name: '@math-modeling\/shell-v2'/)
})

test('built client wraps ModuleLoader and declares root children', () => {
  const client = readFileSync(path.join(pkgRoot, 'lib/client.js'), 'utf8')
  assert.match(client, /__ModuleLoader__/)
  assert.match(client, /@math-modeling\/shell-v2/)
  assert.match(client, /mathmodel\.workbench/)
  assert.match(client, /shell\.overlay/)
})

test('host registers exact health route', () => {
  const host = readFileSync(path.join(pkgRoot, 'lib/index.js'), 'utf8')
  assert.match(host, /\/api\/mathmodeling\/shell-v2\/health/)
  assert.match(host, /kind: 'exact'/)
})
