from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.db import get_db
from app.services.llm import chat

router = APIRouter()


class ChatIn(BaseModel):
    message: str
    mode: str = Field(default="copilot", pattern="^(coach|copilot|agent)$")
    page: str | None = None
    model_id: str | None = None
    knowledge_unit: str | None = None
    skill: str | None = None
    user_id: str = "demo"


@router.post("/chat")
async def ai_chat(body: ChatIn) -> dict:
    result = await chat(body.model_dump())
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO chat_messages (user_id, skill, mode, page, role, content, created_at) VALUES (?,?,?,?,?,?,?)",
            (body.user_id, result.get("skill"), body.mode, body.page, "user", body.message, now),
        )
        conn.execute(
            "INSERT INTO chat_messages (user_id, skill, mode, page, role, content, created_at) VALUES (?,?,?,?,?,?,?)",
            (
                body.user_id,
                result.get("skill"),
                body.mode,
                body.page,
                "assistant",
                result.get("answer", ""),
                now,
            ),
        )
    return result
