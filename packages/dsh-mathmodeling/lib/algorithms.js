/**
 * Local algorithm implementations — real, seeded, dependency-free.
 * Contract: every function returns metrics; stochastic ones support multi-seed
 * aggregation (mean/std/median/IQR/failures) — never report a lucky best seed alone.
 */

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stats(values) {
  const v = [...values].sort((a, b) => a - b)
  const n = v.length
  const mean = v.reduce((s, x) => s + x, 0) / n
  const std = Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, n - 1))
  const median = n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2
  const q1 = v[Math.floor((n - 1) * 0.25)]
  const q3 = v[Math.floor((n - 1) * 0.75)]
  return { mean, std, median, iqr: q3 - q1, min: v[0], max: v[n - 1] }
}

/* ---------------- K-Means (kmeans++ init, Lloyd iterations) ---------------- */

function kmeansOnce(points, k, seed, maxIter = 100) {
  const rng = mulberry32(seed)
  const n = points.length
  const dim = points[0].length
  // kmeans++ init
  const centroids = [points[Math.floor(rng() * n)].slice()]
  while (centroids.length < k) {
    const d2 = points.map((p) => {
      let best = Infinity
      for (const c of centroids) {
        let s = 0
        for (let d = 0; d < dim; d++) s += (p[d] - c[d]) ** 2
        if (s < best) best = s
      }
      return best
    })
    const total = d2.reduce((s, x) => s + x, 0)
    if (total === 0) {
      centroids.push(points[Math.floor(rng() * n)].slice())
      continue
    }
    let r = rng() * total
    let idx = 0
    while (r > d2[idx] && idx < n - 1) {
      r -= d2[idx]
      idx++
    }
    centroids.push(points[idx].slice())
  }
  let labels = new Array(n).fill(0)
  let sse = 0
  let iterations = 0
  for (let it = 0; it < maxIter; it++) {
    iterations = it + 1
    let moved = false
    sse = 0
    for (let i = 0; i < n; i++) {
      let best = -1
      let bestD = Infinity
      for (let c = 0; c < k; c++) {
        let s = 0
        for (let d = 0; d < dim; d++) s += (points[i][d] - centroids[c][d]) ** 2
        if (s < bestD) {
          bestD = s
          best = c
        }
      }
      if (labels[i] !== best) moved = true
      labels[i] = best
      sse += bestD
    }
    const next = centroids.map(() => new Array(dim).fill(0))
    const counts = new Array(k).fill(0)
    for (let i = 0; i < n; i++) {
      counts[labels[i]]++
      for (let d = 0; d < dim; d++) next[labels[i]][d] += points[i][d]
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) {
        for (let d = 0; d < dim; d++) next[c][d] = centroids[c][d]
      } else {
        for (let d = 0; d < dim; d++) next[c][d] /= counts[c]
      }
      centroids[c] = next[c]
    }
    if (!moved) break
  }
  return { labels, centroids, sse, iterations }
}

export function kmeans(points, k, seeds = [42], maxIter = 100) {
  if (!Array.isArray(points) || points.length < k || k < 1) {
    return { error: 'invalid-input', metrics: {} }
  }
  const runs = []
  let failures = 0
  for (const seed of seeds) {
    try {
      runs.push({ seed, ...kmeansOnce(points, k, seed, maxIter) })
    } catch {
      failures++
    }
  }
  if (runs.length === 0) return { error: 'all-seeds-failed', metrics: { failures } }
  const sses = runs.map((r) => r.sse)
  const s = stats(sses)
  const best = runs.reduce((a, b) => (a.sse <= b.sse ? a : b))
  return {
    metrics: {
      sse_mean: round(s.mean),
      sse_std: round(s.std),
      sse_median: round(s.median),
      sse_iqr: round(s.iqr),
      sse_best: round(s.min),
      sse_worst: round(s.max),
      iterations_best: best.iterations,
      seeds_run: runs.length,
      failures,
    },
    artifacts: {
      labels: JSON.stringify(best.labels),
      centroids: JSON.stringify(best.centroids.map((c) => c.map(round))),
      per_seed_sse: JSON.stringify(runs.map((r) => ({ seed: r.seed, sse: round(r.sse) }))),
    },
  }
}

/* ---------------- TOPSIS ---------------- */

export function topsis(matrix, weights, benefit) {
  const n = matrix.length
  const m = matrix[0]?.length ?? 0
  if (!n || !m || weights.length !== m || benefit.length !== m) {
    return { error: 'invalid-input', metrics: {} }
  }
  // vector normalization
  const norm = Array.from({ length: m }, (_, j) =>
    Math.sqrt(matrix.reduce((s, row) => s + row[j] ** 2, 0)),
  )
  const weighted = matrix.map((row) => row.map((v, j) => (v / norm[j]) * weights[j]))
  const ideal = Array.from({ length: m }, (_, j) =>
    benefit[j] ? Math.max(...weighted.map((r) => r[j])) : Math.min(...weighted.map((r) => r[j])),
  )
  const anti = Array.from({ length: m }, (_, j) =>
    benefit[j] ? Math.min(...weighted.map((r) => r[j])) : Math.max(...weighted.map((r) => r[j])),
  )
  const closeness = weighted.map((row) => {
    const dp = Math.sqrt(row.reduce((s, v, j) => s + (v - ideal[j]) ** 2, 0))
    const dn = Math.sqrt(row.reduce((s, v, j) => s + (v - anti[j]) ** 2, 0))
    return round(dn / (dp + dn))
  })
  const ranking = closeness.map((c, i) => ({ alternative: i, closeness: c })).sort((a, b) => b.closeness - a.closeness)
  return { metrics: { alternatives: n, criteria: m, best_closeness: ranking[0]?.closeness ?? 0 }, artifacts: { closeness: JSON.stringify(closeness), ranking: JSON.stringify(ranking) } }
}

/* ---------------- Entropy Weight ---------------- */

export function entropyWeight(matrix) {
  const n = matrix.length
  const m = matrix[0]?.length ?? 0
  if (!n || !m) return { error: 'invalid-input', metrics: {} }
  const colMin = Array.from({ length: m }, (_, j) => Math.min(...matrix.map((r) => r[j])))
  const colMax = Array.from({ length: m }, (_, j) => Math.max(...matrix.map((r) => r[j])))
  const P = matrix.map((row) =>
    row.map((v, j) => {
      const span = colMax[j] - colMin[j]
      return span === 0 ? 1 / n : (v - colMin[j]) / span + 1e-12
    }),
  )
  const weights = []
  for (let j = 0; j < m; j++) {
    let e = 0
    for (let i = 0; i < n; i++) {
      const p = P[i][j] / P.reduce((s, r) => s + r[j], 0)
      e -= (p / Math.log(n)) * Math.log(p + 1e-12)
    }
    weights.push(1 - e)
  }
  const total = weights.reduce((s, w) => s + w, 0)
  const normalized = weights.map((w) => round(w / total))
  return { metrics: { criteria: m, samples: n }, artifacts: { weights: JSON.stringify(normalized) } }
}

/* ---------------- Ordinary Least Squares (simple + multivariate via normal equations + ridge fallback) ---------------- */

export function linearRegression(X, y, ridge = 1e-8) {
  const n = X.length
  const dim = X[0]?.length ?? 0
  if (!n || !dim || y.length !== n) return { error: 'invalid-input', metrics: {} }
  // augment with intercept
  const A = X.map((row) => [1, ...row])
  const d = dim + 1
  // normal equations (A^T A + λI) w = A^T y — Gaussian elimination
  const ata = Array.from({ length: d }, () => new Array(d).fill(0))
  const aty = new Array(d).fill(0)
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < d; a++) {
      aty[a] += A[i][a] * y[i]
      for (let b = 0; b < d; b++) ata[a][b] += A[i][a] * A[i][b]
    }
  }
  for (let a = 0; a < d; a++) ata[a][a] += ridge
  // gaussian elimination
  const M = ata.map((row, i) => [...row, aty[i]])
  for (let col = 0; col < d; col++) {
    let piv = col
    for (let r = col + 1; r < d; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    ;[M[col], M[piv]] = [M[piv], M[col]]
    if (Math.abs(M[col][col]) < 1e-12) return { error: 'singular-matrix', metrics: {} }
    for (let r = col + 1; r < d; r++) {
      const f = M[r][col] / M[col][col]
      for (let c = col; c <= d; c++) M[r][c] -= f * M[col][c]
    }
  }
  const w = new Array(d).fill(0)
  for (let r = d - 1; r >= 0; r--) {
    let s = M[r][d]
    for (let c = r + 1; c < d; c++) s -= M[r][c] * w[c]
    w[r] = s / M[r][r]
  }
  // metrics
  const yMean = y.reduce((s, v) => s + v, 0) / n
  let ssTot = 0
  let ssRes = 0
  const residuals = []
  for (let i = 0; i < n; i++) {
    let pred = w[0]
    for (let j = 1; j < d; j++) pred += w[j] * X[i][j - 1]
    const e = y[i] - pred
    residuals.push(round(e))
    ssTot += (y[i] - yMean) ** 2
    ssRes += e ** 2
  }
  const r2 = ssTot === 0 ? 1 : round(1 - ssRes / ssTot)
  const resStats = stats(residuals)
  return {
    metrics: {
      r2,
      n,
      features: dim,
      residual_mean: round(resStats.mean),
      residual_std: round(resStats.std),
      sse: round(ssRes),
    },
    artifacts: {
      coefficients: JSON.stringify(w.map(round)),
      residuals: JSON.stringify(residuals),
    },
  }
}

/* ---------------- PSO (preset objectives; seeded; convergence curve) ---------------- */

export const PSO_OBJECTIVES = {
  sphere: (v) => v.reduce((s, x) => s + x * x, 0),
  rastrigin: (v) => v.reduce((s, x) => s + (x * x - 10 * Math.cos(2 * Math.PI * x) + 10), 0),
  rosenbrock: (v) => {
    let s = 0
    for (let i = 0; i < v.length - 1; i++) s += 100 * (v[i + 1] - v[i] ** 2) ** 2 + (1 - v[i]) ** 2
    return s
  },
}

export function pso({ objective = 'sphere', dims = 2, seeds = [42], particles = 24, iterations = 80 }) {
  const fn = PSO_OBJECTIVES[objective]
  if (!fn) return { error: 'unknown-objective', metrics: {} }
  const runs = []
  for (const seed of seeds) {
    const rng = mulberry32(seed)
    let gBest = null
    let gVal = Infinity
    const curve = []
    const swarm = Array.from({ length: particles }, () => ({
      x: Array.from({ length: dims }, () => rng() * 10 - 5),
      v: Array.from({ length: dims }, () => rng() * 2 - 1),
      p: null,
      pVal: Infinity,
    }))
    for (const p of swarm) {
      p.pVal = fn(p.x)
      p.p = p.x.slice()
      if (p.pVal < gVal) {
        gVal = p.pVal
        gBest = p.x.slice()
      }
    }
    for (let it = 0; it < iterations; it++) {
      for (const p of swarm) {
        for (let d = 0; d < dims; d++) {
          const r1 = rng()
          const r2 = rng()
          p.v[d] = 0.7 * p.v[d] + 1.4 * r1 * (p.p[d] - p.x[d]) + 1.4 * r2 * (gBest[d] - p.x[d])
          p.x[d] += p.v[d]
        }
        const val = fn(p.x)
        if (val < p.pVal) {
          p.pVal = val
          p.p = p.x.slice()
          if (val < gVal) {
            gVal = val
            gBest = p.x.slice()
          }
        }
      }
      curve.push(round(gVal))
    }
    runs.push({ seed, best: gVal, curve })
  }
  const vals = runs.map((r) => r.best)
  const s = stats(vals)
  return {
    metrics: {
      best_mean: round(s.mean),
      best_std: round(s.std),
      best_median: round(s.median),
      best_iqr: round(s.iqr),
      best_overall: round(s.min),
      seeds_run: runs.length,
      iterations,
      particles,
      dims,
    },
    artifacts: {
      convergence_best_seed: JSON.stringify(runs.reduce((a, b) => (a.best <= b.best ? a : b)).curve),
      per_seed_best: JSON.stringify(runs.map((r) => ({ seed: r.seed, best: round(r.best) }))),
      solution: JSON.stringify([]),
    },
  }
}

function round(x) {
  return Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x
}
