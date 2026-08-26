import assert from 'node:assert/strict'
import { test } from 'node:test'
import { diagnose } from '../lib/product-routes.js'

test('data doctor flags exact target copy as critical leakage', () => {
  const csv = ['a,b,target', '1,5,10', '2,6,20', '3,7,30'].join('\n')
  const r = diagnose(csv.replace('b', 'target_copy').replace('5,10', '10,10').replace('6,20', '20,20').replace('7,30', '30,30'), { target: 'target' })
  const leak = r.findings.find((f) => f.code === 'target-leakage')
  assert.ok(leak, 'target-leakage finding missing')
  assert.equal(leak.severity, 'critical')
  const rec = r.recommendations.find((x) => x.action.includes('删除'))
  assert.ok(rec, 'deletion recommendation missing')
})

test('data doctor reports missingness with recommendation', () => {
  const csv = ['x,y', '1,', '2,5', ',7', '4,8'].join('\n')
  const r = diagnose(csv)
  const x = r.columns.find((c) => c.name === 'x')
  assert.equal(x.missing, 1)
  assert.ok(r.recommendations.some((rec) => rec.action.includes('x')))
})

test('data doctor infers numeric type and outliers', () => {
  const csv = ['v', '1', '2', '3', '2', '1000'].join('\n')
  const r = diagnose(csv)
  const v = r.columns.find((c) => c.name === 'v')
  assert.equal(v.type, 'numeric')
  assert.ok(v.outliers >= 1)
})

test('data doctor detects unordered time column', () => {
  const csv = ['date,v', '2024-03-01,1', '2024-01-01,2', '2024-02-01,3'].join('\n')
  const r = diagnose(csv)
  const f = r.findings.find((x) => x.code === 'temporal-unordered')
  assert.ok(f, 'unordered time finding missing')
})
