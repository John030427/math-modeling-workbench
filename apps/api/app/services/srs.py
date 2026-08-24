from __future__ import annotations

from datetime import datetime, timedelta, timezone


def schedule_next(
    mastery: float,
    correct: bool,
    wrong_count: int,
    difficulty: float,
) -> tuple[float, float, datetime]:
    """Simple spaced-repetition scheduler (pre-FSRS)."""
    now = datetime.now(timezone.utc)
    if correct:
        mastery = min(100.0, mastery + max(3.0, 12.0 * (1.0 - mastery / 100.0)))
        difficulty = max(0.1, difficulty - 0.02)
        days = 1 + int(mastery / 20) + (0 if wrong_count > 3 else 1)
    else:
        mastery = max(0.0, mastery - 8.0 - difficulty * 10)
        difficulty = min(0.9, difficulty + 0.05)
        days = 0 if mastery < 40 else 1
    next_review = now + timedelta(days=days)
    return mastery, difficulty, next_review


def due_priority(score: float, next_review: str | None, wrong_count: int) -> float:
    now = datetime.now(timezone.utc)
    overdue = 0.0
    if next_review:
        try:
            nr = datetime.fromisoformat(next_review)
            overdue = max(0.0, (now - nr).total_seconds() / 86400.0)
        except ValueError:
            overdue = 1.0
    weakness = (100.0 - score) / 100.0
    return overdue * 2 + weakness * 3 + wrong_count * 0.5
