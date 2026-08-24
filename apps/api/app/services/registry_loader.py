from __future__ import annotations

from typing import Any

import yaml

from app.config import REGISTRY_DIR


def load_all_models() -> list[dict[str, Any]]:
    models: list[dict[str, Any]] = []
    if not REGISTRY_DIR.exists():
        return models
    for path in sorted(REGISTRY_DIR.glob("*.yaml")):
        with path.open(encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        data["_path"] = str(path)
        models.append(data)
    models.sort(key=lambda m: m.get("demo_priority", 99))
    return models


def get_model(model_id: str) -> dict[str, Any] | None:
    for m in load_all_models():
        if m.get("id") == model_id:
            return m
    return None


def filter_models(
    task: str | None = None,
    family: str | None = None,
    q: str | None = None,
) -> list[dict[str, Any]]:
    out = []
    for m in load_all_models():
        tasks = m.get("category", {}).get("task", []) or []
        families = m.get("family", []) or []
        if task and task not in tasks:
            continue
        if family and family not in families:
            continue
        if q:
            blob = json_blob(m).lower()
            if q.lower() not in blob:
                continue
        out.append(public_model(m))
    return out


def public_model(m: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in m.items() if not k.startswith("_")}


def json_blob(m: dict[str, Any]) -> str:
    parts = [
        str(m.get("id", "")),
        str(m.get("name", "")),
        str(m.get("name_zh", "")),
        str(m.get("summary", "")),
    ]
    return " ".join(parts)


def taxonomy() -> dict[str, list[str]]:
    tasks: set[str] = set()
    families: set[str] = set()
    for m in load_all_models():
        tasks.update(m.get("category", {}).get("task", []) or [])
        families.update(m.get("family", []) or [])
    return {
        "tasks": sorted(tasks),
        "families": sorted(families),
    }
