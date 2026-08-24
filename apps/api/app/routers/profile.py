from __future__ import annotations

from fastapi import APIRouter

from app.db import get_db, rows_to_dicts

router = APIRouter()


@router.get("/")
def get_profile(user_id: str = "demo") -> dict:
    with get_db() as conn:
        dims = rows_to_dicts(
            conn.execute(
                "SELECT dim, score FROM profile_dims WHERE user_id=? ORDER BY dim",
                (user_id,),
            ).fetchall()
        )
        models = rows_to_dicts(
            conn.execute(
                "SELECT item_id, score FROM mastery WHERE user_id=? AND item_type='model' ORDER BY score DESC",
                (user_id,),
            ).fetchall()
        )
        kus = rows_to_dicts(
            conn.execute(
                "SELECT item_id, score FROM mastery WHERE user_id=? AND item_type='ku' ORDER BY score ASC",
                (user_id,),
            ).fetchall()
        )
    return {
        "user_id": user_id,
        "dimensions": dims,
        "models": models,
        "weak_knowledge_units": kus[:8],
        "bridge_tips": _bridge(models),
    }


def _bridge(models: list[dict]) -> list[dict]:
    tips = []
    for m in models:
        if float(m["score"]) < 40:
            tips.append(
                {
                    "model_id": m["item_id"],
                    "mastery": m["score"],
                    "message": f"你尚未较好掌握 {m['item_id']}（{m['score']}）。可先 5 分钟速学，再返回比赛。",
                    "actions": ["quick_learn", "compare", "learn_while_using"],
                }
            )
    return tips
