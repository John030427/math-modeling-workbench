from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.services.registry_loader import filter_models, get_model, public_model, taxonomy

router = APIRouter()


@router.get("/models")
def list_models(
    task: str | None = None,
    family: str | None = None,
    q: str | None = None,
) -> dict:
    return {"models": filter_models(task=task, family=family, q=q), "taxonomy": taxonomy()}


@router.get("/models/{model_id}")
def model_detail(model_id: str) -> dict:
    m = get_model(model_id)
    if not m:
        raise HTTPException(404, f"model {model_id} not found")
    return public_model(m)


@router.get("/taxonomy")
def get_taxonomy() -> dict:
    return taxonomy()
