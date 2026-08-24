from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import QUIZ_DIR
from app.db import get_db, rows_to_dicts, seed_demo_user
from app.services.srs import due_priority, schedule_next

router = APIRouter()


class QuizSubmit(BaseModel):
    user_id: str = "demo"
    quiz_id: str
    selected: str
    item_type: str = "ku"
    item_id: str = "feature-scaling"


class ReviewUpdate(BaseModel):
    user_id: str = "demo"
    item_type: str
    item_id: str
    correct: bool


@router.get("/quizzes/{model_id}")
def quizzes_for_model(model_id: str) -> dict:
    path = QUIZ_DIR / f"{model_id}.json"
    if not path.exists():
        raise HTTPException(404, "quiz bank not found")
    data = json.loads(path.read_text(encoding="utf-8"))
    # hide answers in list mode? keep for MVP client grading via submit API
    safe = []
    for q in data.get("questions", []):
        safe.append({k: v for k, v in q.items() if k != "answer"})
    return {"model_id": model_id, "questions": safe}


@router.post("/quiz/submit")
def submit_quiz(body: QuizSubmit) -> dict:
    path = QUIZ_DIR / f"{body.quiz_id.split(':')[0]}.json"
    # quiz_id format: modelId:questionId or just lookup in kmeans
    model_id, _, qid = body.quiz_id.partition(":")
    if not path.exists():
        path = QUIZ_DIR / f"{model_id}.json"
    if not path.exists():
        raise HTTPException(404, "quiz not found")
    bank = json.loads(path.read_text(encoding="utf-8"))
    question = next((q for q in bank["questions"] if q["id"] == (qid or body.quiz_id)), None)
    if not question:
        # try full id match
        question = next((q for q in bank["questions"] if q["id"] == body.quiz_id), None)
    if not question:
        raise HTTPException(404, "question not found")
    correct = body.selected == question["answer"]
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO quiz_attempts (user_id, quiz_id, correct, selected, created_at) VALUES (?,?,?,?,?)",
            (body.user_id, body.quiz_id, int(correct), body.selected, now),
        )
        row = conn.execute(
            "SELECT * FROM mastery WHERE user_id=? AND item_type=? AND item_id=?",
            (body.user_id, body.item_type, body.item_id),
        ).fetchone()
        mastery = float(row["score"]) if row else 40.0
        wrong = int(row["wrong_count"]) if row else 0
        right = int(row["correct_count"]) if row else 0
        diff = float(row["difficulty"]) if row else 0.3
        if correct:
            right += 1
        else:
            wrong += 1
        mastery, diff, nxt = schedule_next(mastery, correct, wrong, diff)
        conn.execute(
            """
            INSERT OR REPLACE INTO mastery
            (user_id, item_type, item_id, score, last_review, next_review, wrong_count, correct_count, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                body.user_id,
                body.item_type,
                body.item_id,
                mastery,
                now,
                nxt.isoformat(),
                wrong,
                right,
                diff,
            ),
        )
    return {
        "correct": correct,
        "explanation": question.get("explanation"),
        "mastery": mastery,
        "answer": question["answer"] if not correct else None,
    }


@router.get("/daily-review")
def daily_review(user_id: str = "demo", limit: int = 10) -> dict:
    with get_db() as conn:
        rows = rows_to_dicts(
            conn.execute(
                "SELECT * FROM mastery WHERE user_id=?",
                (user_id,),
            ).fetchall()
        )
    ranked = sorted(
        rows,
        key=lambda r: due_priority(float(r["score"]), r.get("next_review"), int(r["wrong_count"])),
        reverse=True,
    )[:limit]
    weak = [r for r in rows if float(r["score"]) < 50]
    return {
        "estimated_minutes": max(4, len(ranked)),
        "due": ranked,
        "weak_count": len(weak),
        "new_count": 2,
        "message": f"今日复习：到期/优先 {len(ranked)}，薄弱 {len(weak)}",
    }


@router.post("/reset-demo")
def reset_demo() -> dict:
    with get_db() as conn:
        for table in [
            "mastery",
            "quiz_attempts",
            "chat_messages",
            "competitions",
            "ai_ledger",
            "profile_dims",
            "users",
        ]:
            conn.execute(f"DELETE FROM {table}")
        seed_demo_user(conn)
    return {"ok": True, "user": "demo"}
