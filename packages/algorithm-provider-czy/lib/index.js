/**
 * CzyProvider — AlgorithmProvider over the pinned math-model-agent library.
 *
 * Execution bridge: spawn `python czy_runner.py` with a JSON request; the
 * runner imports the upstream module from the local pinned clone and returns
 * JSON after a sentinel (upstream functions pollute stdout).
 *
 * Source lock: research/UPSTREAM_SOURCE_LOCK.md
 * Pin: 33cb044009d2dc12e7fa86e4ded6138ddb790d9a (MIT)
 */
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LIB_DIR = fileURLToPath(new URL('.', import.meta.url))
const PKG_ROOT = join(LIB_DIR, '..')
const RUNNER = join(PKG_ROOT, 'runner', 'czy_runner.py')
const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url))
const INVENTORY_PATH = join(REPO_ROOT, 'registry', 'upstream', 'chengziyue_algorithms.json')
const UPSTREAM_COMMIT = '33cb044009d2dc12e7fa86e4ded6138ddb790d9a'
const PROVIDER_VERSION = 'czy-0.1.0'
const SENTINEL = '===CZY_RESULT==='

function upstreamPath() {
  const env = process.env.MM_UPSTREAM_PATH
  if (env && existsSync(env)) return env
  return join(homedir(), '.dsh', 'upstream', 'math-model-agent', 'code')
}

let inventoryCache = null
export function inventory() {
  if (!inventoryCache) inventoryCache = JSON.parse(readFileSync(INVENTORY_PATH, 'utf8'))
  return inventoryCache
}

export function listMethods() {
  return inventory().methods
}

export function findMethod(methodId) {
  return listMethods().find((m) => m.method_id === methodId) ?? null
}

export function upstreamCommit() {
  return UPSTREAM_COMMIT
}

function runPython(req, timeoutMs) {
  return new Promise((resolvePromise) => {
    const proc = spawn('python', [RUNNER], { windowsHide: true })
    let out = ''
    let err = ''
    let done = false
    const timer = setTimeout(() => {
      if (!done) {
        done = true
        proc.kill()
        resolvePromise({ ok: false, error: `timeout after ${timeoutMs}ms` })
      }
    }, timeoutMs)
    proc.stdout.on('data', (d) => (out += d))
    proc.stderr.on('data', (d) => (err += d))
    proc.on('error', (e) => {
      if (!done) {
        done = true
        clearTimeout(timer)
        resolvePromise({ ok: false, error: `python-spawn: ${e.message}` })
      }
    })
    proc.on('close', () => {
      if (done) return
      done = true
      clearTimeout(timer)
      const idx = out.indexOf(SENTINEL)
      if (idx < 0) {
        resolvePromise({ ok: false, error: `no result sentinel; stderr=${err.slice(0, 300)}` })
        return
      }
      try {
        resolvePromise(JSON.parse(out.slice(idx + SENTINEL.length)))
      } catch (e) {
        resolvePromise({ ok: false, error: `bad runner json: ${e.message}` })
      }
    })
    proc.stdin.write(JSON.stringify(req))
    proc.stdin.end()
  })
}

/**
 * Execute a czy method.
 * @param {{method_id: string, parameters: object, timeout_ms?: number}} input
 */
export async function runMethod({ method_id, parameters = {}, timeout_ms = 60000 }) {
  const entry = findMethod(method_id)
  if (!entry) return { ok: false, error: `unknown czy method: ${method_id}` }
  if (!existsSync(RUNNER)) return { ok: false, error: 'runner missing' }
  if (!existsSync(upstreamPath())) return { ok: false, error: 'upstream clone missing (run research lock procedure)' }
  const started = Date.now()
  const inputHash = createHash('sha256').update(JSON.stringify({ method_id, parameters })).digest('hex')
  const res = await runPython({ module: entry.module, function: entry.function, params: parameters }, timeout_ms)
  const runtime = Date.now() - started
  if (!res.ok) {
    return {
      ok: false,
      run: {
        algorithm: method_id,
        provider: 'czy',
        source_version: PROVIDER_VERSION,
        upstream_commit: UPSTREAM_COMMIT,
        input_hash: inputHash,
        parameters,
        seed: parameters.seed ?? null,
        runtime_ms: runtime,
        metrics: {},
        warnings: [res.error],
        artifacts: {},
        output_hashes: {},
        error: res.error,
        feasible: false,
      },
    }
  }
  const result = res.result ?? {}
  // metrics: numeric scalar fields of dict results; artifacts keep the full payload
  const metrics = {}
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    for (const [k, v] of Object.entries(result)) {
      if (typeof v === 'number') metrics[k] = v
    }
  }
  return {
    ok: true,
    run: {
      algorithm: method_id,
      provider: 'czy',
      source_version: PROVIDER_VERSION,
      upstream_commit: UPSTREAM_COMMIT,
      input_hash: inputHash,
      parameters,
      seed: parameters.seed ?? null,
      runtime_ms: runtime,
      metrics,
      warnings: [],
      artifacts: { result: JSON.stringify(result) },
      output_hashes: {},
      error: null,
      feasible: true,
    },
  }
}
