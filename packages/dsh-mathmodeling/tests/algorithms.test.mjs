import assert from 'node:assert/strict'
import { test } from 'node:test'
import { kmeans, topsis, entropyWeight, linearRegression, pso } from '../lib/algorithms.js'

test('kmeans multi-seed aggregation present (no lucky-seed-only reporting)', () => {
  const r = kmeans([[0, 0], [0.1, 0], [5, 5], [5.2, 5.1], [9, 9]], 2, [1, 2, 3, 4, 5])
  assert.ok(r.metrics.sse_mean !== undefined)
  assert.ok(r.metrics.sse_std !== undefined)
  assert.ok(r.metrics.sse_median !== undefined)
  assert.ok(r.metrics.sse_iqr !== undefined)
  assert.equal(r.metrics.seeds_run, 5)
  assert.equal(r.metrics.failures, 0)
})

test('kmeans rejects invalid input without metrics', () => {
  const r = kmeans([[1, 2]], 3, [1])
  assert.equal(r.error, 'invalid-input')
  assert.deepEqual(r.metrics, {})
})

test('topsis ranks known 2x2 case correctly', () => {
  // two alternatives; alt1 better on the single benefit criterion
  const r = topsis([[9], [1]], [1], [true])
  const ranking = JSON.parse(r.artifacts.ranking)
  assert.equal(ranking[0].alternative, 0)
  assert.ok(ranking[0].closeness > ranking[1].closeness)
})

test('entropy weights sum to 1', () => {
  const r = entropyWeight([[1, 2, 3], [3, 2, 1], [2, 2, 2]])
  const w = JSON.parse(r.artifacts.weights)
  assert.equal(w.length, 3)
  const sum = w.reduce((s, x) => s + x, 0)
  assert.ok(Math.abs(sum - 1) < 1e-6)
})

test('linear regression recovers known line with r2=1', () => {
  const X = [[1], [2], [3], [4]]
  const y = [3, 5, 7, 9] // y = 2x + 1
  const r = linearRegression(X, y)
  assert.equal(r.metrics.r2, 1)
  const w = JSON.parse(r.artifacts.coefficients)
  assert.ok(Math.abs(w[0] - 1) < 1e-6)
  assert.ok(Math.abs(w[1] - 2) < 1e-6)
})

test('pso converges on sphere and records curve', () => {
  const r = pso({ objective: 'sphere', dims: 2, seeds: [1, 2], particles: 16, iterations: 40 })
  assert.ok(r.metrics.best_overall < 0.5)
  const curve = JSON.parse(r.artifacts.convergence_best_seed)
  assert.equal(curve.length, 40)
  assert.ok(curve[39] <= curve[0])
})
