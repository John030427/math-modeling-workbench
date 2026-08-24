import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_ROOT = fileURLToPath(new URL('.', import.meta.url))
const SKILL_PATH = join(PACKAGE_ROOT, '../skills/modeling-tutor/SKILL.md')

function loadSkillMarkdown() {
  try {
    return readFileSync(SKILL_PATH, 'utf8').replace(/^#\s+modeling-tutor\s*\n/i, '').trim()
  } catch {
    return 'Math modeling tutor skill — read /api/mathmodeling/context and registry before answering.'
  }
}

/** @type {import('@deepseek-ai/dsh-skill').SkillRegistration} */
export const MODELING_TUTOR_SKILL = {
  name: 'modeling-tutor',
  description: 'Explain math-modeling algorithms and concepts using current page/model context from the 数模工作台 plugin.',
  whenToUse: 'User asks about definitions, why/how, comparisons, or mistakes while using Model Atlas, K-Means lesson, or related plugin pages.',
  source: 'runtime',
  provider: 'dsh-mathmodeling',
  content: loadSkillMarkdown(),
}
