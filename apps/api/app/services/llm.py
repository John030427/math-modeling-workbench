from __future__ import annotations

import json
from typing import Any

import httpx

from app.config import OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL
from app.services.offline_ai import offline_reply, route_skill
from app.services.registry_loader import get_model


async def chat(payload: dict[str, Any]) -> dict[str, Any]:
    mode = payload.get("mode") or "copilot"
    page = payload.get("page")
    message = payload.get("message") or ""
    model_id = payload.get("model_id")
    knowledge_unit = payload.get("knowledge_unit")
    skill = payload.get("skill") or route_skill(page, message, model_id)

    # Coach mode always uses constrained offline coach unless agent explicitly requested
    if mode == "coach":
        return offline_reply(
            skill="11-modeling-coach",
            mode=mode,
            message=message,
            model_id=model_id,
            knowledge_unit=knowledge_unit,
            page=page,
        )

    if not OPENAI_API_KEY:
        return offline_reply(
            skill=skill,
            mode=mode,
            message=message,
            model_id=model_id,
            knowledge_unit=knowledge_unit,
            page=page,
        )

    model = get_model(model_id) if model_id else None
    system = _system_prompt(skill, mode, model, page, knowledge_unit)
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            r = await client.post(
                f"{OPENAI_BASE_URL.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": message},
                    ],
                    "temperature": 0.4,
                },
            )
            r.raise_for_status()
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            return {
                "skill": skill,
                "mode": mode,
                "answer": content,
                "offline": False,
                "model": OPENAI_MODEL,
            }
    except Exception as exc:  # noqa: BLE001 — demo must not crash
        fallback = offline_reply(
            skill=skill,
            mode=mode,
            message=message,
            model_id=model_id,
            knowledge_unit=knowledge_unit,
            page=page,
        )
        fallback["llm_error"] = str(exc)[:200]
        fallback["answer"] = f"（LLM 暂不可用，已切换离线导师）\n\n{fallback['answer']}"
        return fallback


def _system_prompt(
    skill: str,
    mode: str,
    model: dict[str, Any] | None,
    page: str | None,
    ku: str | None,
) -> str:
    registry_ctx = json.dumps(
        {
            "id": model.get("id"),
            "summary": model.get("summary"),
            "use_when": model.get("use_when"),
            "avoid_when": model.get("avoid_when"),
            "common_mistakes": model.get("common_mistakes"),
        },
        ensure_ascii=False,
    ) if model else "{}"
    return (
        f"You are the Math Modeling Workbench assistant. Skill={skill}. Mode={mode}.\n"
        f"Page={page}. KnowledgeUnit={ku}.\n"
        f"ModelRegistryContext={registry_ctx}\n"
        "Rules: Do not fabricate experiment metrics. Prefer why over answers. "
        "In coach mode never give full solutions. Cite assumptions. "
        "Warn against advanced-algorithm worship; prefer baselines and validation."
    )
