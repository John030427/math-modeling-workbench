import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { loadSkills } from '../lib/skills.js'
import { selectorCards } from '../lib/product-routes.js'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const REQUIRED_SECTIONS = ['Purpose', 'Trigger', 'Inputs', 'Outputs', 'Forbidden', 'Failure']
const EXPECTED_SKILLS = [
  'modeling-router',
  'modeling-tutor',
  'problem-reader',
  'modeling-coach',
  'data-doctor',
  'feature-engineering',
  'model-selector',
  'algorithm-lab',
  'visualization',
  'paper-writer',
  'paper-reviewer',
  'gap-analyzer',
]

test('all 12 contracted skills exist with required sections', () => {
  const dirs = readdirSync(join(ROOT, 'skills')).filter((d) => !d.startsWith('.'))
  for (const name of EXPECTED_SKILLS) {
    assert.ok(dirs.includes(name), `missing skill dir: ${name}`)
    const path = join(ROOT, 'skills', name, 'SKILL.md')
    assert.ok(existsSync(path), `missing SKILL.md: ${name}`)
    const text = readFileSync(path, 'utf8')
    for (const section of REQUIRED_SECTIONS) {
      assert.ok(text.includes(section), `${name} missing section ${section}`)
    }
  }
  assert.equal(dirs.length, 12)
})

test('skill loader returns 12 registrations with content', () => {
  const skills = loadSkills()
  assert.equal(skills.length, 12)
  for (const s of skills) {
    assert.ok(s.name && s.description && s.whenToUse && s.content.length > 100, `incomplete registration: ${s.name}`)
  }
})

test('model selector always returns a Baseline distinct from Main', () => {
  for (const modelId of ['kmeans', 'linear-regression', 'topsis', 'arima']) {
    const cards = selectorCards(modelId)
    assert.ok(cards.baseline, `${modelId}: baseline missing`)
    assert.ok(cards.main, `${modelId}: main missing`)
    assert.notEqual(cards.baseline.id, cards.main.id, `${modelId}: baseline must differ from main`)
  }
})
