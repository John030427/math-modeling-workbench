/** Load all contracted skills from the skills directories and build registrations. */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILLS_DIR = join(fileURLToPath(new URL('.', import.meta.url)), '../skills')

const META = {
  'modeling-router': { description: 'Route modeling requests to the right MathModel skill.', whenToUse: 'Intent unclear or spanning multiple modeling tasks.' },
  'modeling-tutor': { description: 'Explain math-modeling algorithms and concepts using current page/model context.', whenToUse: 'User asks definitions/why-how/comparisons while using Atlas or lessons.' },
  'problem-reader': { description: 'Decompose a contest problem into a Problem Contract (ReqID entries); never invents missing data.', whenToUse: 'User pastes a problem text or asks to decompose the problem.' },
  'modeling-coach': { description: 'Socratic modeling coach: questions first, hints second, full solution last.', whenToUse: 'User asks for help solving while in coach mode or Gym practice.' },
  'data-doctor': { description: 'Diagnose CSV data: types, missingness, scale, outliers, temporal order, leakage — before any transform advice.', whenToUse: 'User pastes CSV or asks to check data quality.' },
  'feature-engineering': { description: 'Produce Feature Cards with formula/meaning/why/risk/leakage-risk/validation.', whenToUse: 'User asks for feature suggestions after Data Doctor.' },
  'model-selector': { description: 'Always return Baseline/Main/Alternative model cards from registry metadata.', whenToUse: 'User asks which model to use.' },
  'algorithm-lab': { description: 'Execute real algorithms via AlgorithmProvider with run manifests; never fabricate metrics.', whenToUse: 'User wants to run an experiment.' },
  visualization: { description: 'Produce figures with figure records (run_id, caption, source).', whenToUse: 'User asks to plot results of a run.' },
  'paper-writer': { description: 'Draft paper sections with evidence-backed numeric claims only.', whenToUse: 'User asks to draft abstract/restatement/results sections.' },
  'paper-reviewer': { description: '12-dimension training rubric review; findings map to knowledge units.', whenToUse: 'User submits a draft for review.' },
  'gap-analyzer': { description: 'Map review/gym/quiz weaknesses to knowledge units and training links.', whenToUse: 'User asks what to train next, or after a review completes.' },
}

export function loadSkills() {
  const registrations = []
  let dirs = []
  try {
    dirs = readdirSync(SKILLS_DIR).filter((d) => !d.startsWith('.'))
  } catch {
    return registrations
  }
  for (const dir of dirs) {
    const path = join(SKILLS_DIR, dir, 'SKILL.md')
    const meta = META[dir]
    if (!meta) continue
    let content = ''
    try {
      content = readFileSync(path, 'utf8').replace(/^#\s+\S+\s*\n/i, '').trim()
    } catch {
      continue
    }
    registrations.push({
      name: dir,
      description: meta.description,
      whenToUse: meta.whenToUse,
      source: 'runtime',
      provider: 'dsh-mathmodeling',
      content,
    })
  }
  return registrations
}
