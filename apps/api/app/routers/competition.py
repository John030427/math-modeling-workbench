from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import WORKSPACE_DIR
from app.db import get_db
from app.services.model_selector import select_models

router = APIRouter()

STAGES = [
    "problem_reader",
    "decomposition",
    "data_doctor",
    "eda",
    "feature_engineering",
    "model_selector",
    "algorithm_lab",
    "validation",
    "visualization",
    "paper_writing",
    "reviewer",
]


class CreateComp(BaseModel):
    title: str = "Demo Competition"
    problem_text: str = ""


class UpdateStage(BaseModel):
    stage: str
    payload: dict = Field(default_factory=dict)


class LedgerIn(BaseModel):
    tool: str
    task: str
    user_decision: str = ""
    human_verified: bool = False
    modification: str = ""
    result: str = ""


@router.post("/projects")
def create_project(body: CreateComp) -> dict:
    cid = str(uuid.uuid4())[:8]
    now = datetime.now(timezone.utc).isoformat()
    state = {
        "id": cid,
        "title": body.title,
        "problem_text": body.problem_text,
        "stages": {s: {"status": "pending", "data": {}} for s in STAGES},
        "current_stage": "problem_reader",
    }
    state["stages"]["problem_reader"] = {
        "status": "done",
        "data": {"text": body.problem_text},
    }
    # naive decomposition hints
    state["stages"]["decomposition"] = {
        "status": "active",
        "data": _decompose(body.problem_text),
    }
    ws = WORKSPACE_DIR / cid
    for sub in [
        "input",
        "problem",
        "data",
        "features",
        "models",
        "experiments",
        "results",
        "figures",
        "paper",
        "reviews",
        "learning",
    ]:
        (ws / sub).mkdir(parents=True, exist_ok=True)
    (ws / "problem" / "problem.txt").write_text(body.problem_text, encoding="utf-8")
    with get_db() as conn:
        conn.execute(
            "INSERT INTO competitions (id, title, state_json, updated_at) VALUES (?,?,?,?)",
            (cid, body.title, json.dumps(state, ensure_ascii=False), now),
        )
    return state


@router.get("/projects")
def list_projects() -> dict:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, title, updated_at FROM competitions ORDER BY updated_at DESC"
        ).fetchall()
    return {"projects": [dict(r) for r in rows]}


@router.get("/projects/{cid}")
def get_project(cid: str) -> dict:
    with get_db() as conn:
        row = conn.execute("SELECT state_json FROM competitions WHERE id=?", (cid,)).fetchone()
    if not row:
        raise HTTPException(404, "project not found")
    return json.loads(row["state_json"])


@router.post("/projects/{cid}/stage")
def update_stage(cid: str, body: UpdateStage) -> dict:
    with get_db() as conn:
        row = conn.execute("SELECT state_json FROM competitions WHERE id=?", (cid,)).fetchone()
        if not row:
            raise HTTPException(404, "project not found")
        state = json.loads(row["state_json"])
        if body.stage not in state["stages"]:
            raise HTTPException(400, "unknown stage")
        state["stages"][body.stage] = {
            "status": "done",
            "data": body.payload,
        }
        state["current_stage"] = body.stage
        if body.stage == "model_selector" and "selection" not in body.payload:
            sel = select_models(body.payload)
            state["stages"][body.stage]["data"]["selection"] = sel
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "UPDATE competitions SET state_json=?, updated_at=? WHERE id=?",
            (json.dumps(state, ensure_ascii=False), now, cid),
        )
    return state


@router.post("/projects/{cid}/ledger")
def add_ledger(cid: str, body: LedgerIn) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO ai_ledger
            (competition_id, tool, task, user_decision, human_verified, modification, result, created_at)
            VALUES (?,?,?,?,?,?,?,?)
            """,
            (
                cid,
                body.tool,
                body.task,
                body.user_decision,
                int(body.human_verified),
                body.modification,
                body.result,
                now,
            ),
        )
    return {"ok": True}


@router.get("/projects/{cid}/ledger")
def get_ledger(cid: str) -> dict:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM ai_ledger WHERE competition_id=? ORDER BY id",
            (cid,),
        ).fetchall()
    return {"ledger": [dict(r) for r in rows]}


def _decompose(text: str) -> dict:
    t = text or ""
    hints = {
        "possible_variables": [],
        "possible_objectives": [],
        "possible_constraints": [],
        "possible_type": "unknown",
    }
    if any(k in t for k in ["配送", "路径", "车辆", "VRP", "最短路"]):
        hints["possible_type"] = "optimization / routing"
        hints["possible_variables"] = ["车辆路径", "访问顺序", "是否服务某点"]
        hints["possible_objectives"] = ["最小化总路程/时间/成本"]
        hints["possible_constraints"] = ["容量", "时间窗", "车辆数"]
    elif any(k in t for k in ["聚类", "分群", "客户细分"]):
        hints["possible_type"] = "clustering"
    elif any(k in t for k in ["预测", "销量", "游客"]):
        hints["possible_type"] = "prediction / time-series"
    return hints
