import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_ROOT = fileURLToPath(new URL('.', import.meta.url))

/** @typedef {{ id: string, name: string, name_zh: string, difficulty: string, demo_priority: number, summary: string }} ModelSummary */

/** Load bundled registry snapshot (generated from ../../registry/models). */
export function loadRegistrySnapshot() {
  const path = join(PACKAGE_ROOT, 'registry-data.json')
  if (!existsSync(path)) {
    return { generatedAt: null, models: [] }
  }
  const parsed = JSON.parse(readFileSync(path, 'utf8'))
  return {
    generatedAt: parsed.generatedAt ?? null,
    models: Array.isArray(parsed.models) ? parsed.models : [],
  }
}

/** @param {string} id */
export function getModelById(id) {
  const { models } = loadRegistrySnapshot()
  return models.find(m => m.id === id) ?? null
}

/** Load full YAML body when monorepo registry is reachable (P1 enrichment). */
export function loadModelYaml(id) {
  const yamlPath = join(PACKAGE_ROOT, '../../../registry/models', `${id}.yaml`)
  if (!existsSync(yamlPath)) return null
  return readFileSync(yamlPath, 'utf8')
}
