from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import DEMO_DIR
from app.services.offline_ai import offline_reply

router = APIRouter()


class GymStepIn(BaseModel):
    case_id: str = "delivery-vrp"
    message: str
    mode: str = "coach"
    step: str | None = None


@router.get("/cases")
def list_cases() -> dict:
    path = DEMO_DIR / "gym" / "cases.json"
    if not path.exists():
        return {"cases": []}
    return json.loads(path.read_text(encoding="utf-8"))


@router.get("/cases/{case_id}")
def get_case(case_id: str) -> dict:
    path = DEMO_DIR / "gym" / "cases.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    case = next((c for c in data["cases"] if c["id"] == case_id), None)
    if not case:
        raise HTTPException(404, "case not found")
    # hide full solution key for coach
    public = {k: v for k, v in case.items() if k != "solution"}
    return public


@router.post("/coach")
def gym_coach(body: GymStepIn) -> dict:
    case_path = DEMO_DIR / "gym" / "cases.json"
    case = None
    if case_path.exists():
        data = json.loads(case_path.read_text(encoding="utf-8"))
        case = next((c for c in data["cases"] if c["id"] == body.case_id), None)
    reply = offline_reply(
        skill="11-modeling-coach",
        mode="coach",
        message=body.message,
        model_id=None,
        knowledge_unit=None,
        page="gym",
    )
    if case and body.step:
        guide = case.get("coach_steps", {}).get(body.step)
        if guide:
            reply["answer"] = guide
            reply["step"] = body.step
    reply["case_id"] = body.case_id
    return reply
