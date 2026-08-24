/** Simple spaced-repetition scheduler (ported from apps/api/app/services/srs.py). */

export function scheduleNext(
  mastery: number,
  correct: boolean,
  wrongCount: number,
  difficulty: number,
): { mastery: number; difficulty: number; nextReview: string } {
  const now = new Date()
  let nextDays = 1
  if (correct) {
    mastery = Math.min(100, mastery + Math.max(3, 12 * (1 - mastery / 100)))
    difficulty = Math.max(0.1, difficulty - 0.02)
    nextDays = 1 + Math.floor(mastery / 20) + (wrongCount > 3 ? 0 : 1)
  } else {
    mastery = Math.max(0, mastery - 8 - difficulty * 10)
    difficulty = Math.min(0.9, difficulty + 0.05)
    nextDays = mastery < 40 ? 0 : 1
  }
  const next = new Date(now.getTime() + nextDays * 86400000)
  return { mastery, difficulty, nextReview: next.toISOString() }
}

export function duePriority(
  score: number,
  nextReview: string | null | undefined,
  wrongCount: number,
): number {
  let overdue = 0
  if (nextReview) {
    const nr = new Date(nextReview)
    if (!Number.isNaN(nr.getTime())) {
      overdue = Math.max(0, (Date.now() - nr.getTime()) / 86400000)
    } else overdue = 1
  }
  const weakness = (100 - score) / 100
  return overdue * 2 + weakness * 3 + wrongCount * 0.5
}
