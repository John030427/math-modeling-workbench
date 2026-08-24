from __future__ import annotations

import io
from typing import Any

import pandas as pd
from fastapi import APIRouter, File, Form, UploadFile
from pydantic import BaseModel

from app.services.data_doctor import diagnose_dataframe, suggest_features
from app.services.model_selector import select_models

router = APIRouter()


class SelectIn(BaseModel):
    goal: str = ""
    problem_type: str = ""
    supervised: bool = False
    temporal: bool = False
    integer_vars: bool = False
    linear: bool = False
    convex: bool = False
    need_explainability: bool = True
    n_rows: int = 0


@router.post("/diagnose")
async def diagnose(file: UploadFile = File(...)) -> dict[str, Any]:
    raw = await file.read()
    if len(raw) > 5_000_000:
        return {"error": "file too large (max 5MB)"}
    name = (file.filename or "").lower()
    try:
        if name.endswith(".xlsx") or name.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(raw))
        else:
            df = pd.read_csv(io.BytesIO(raw))
    except Exception as exc:  # noqa: BLE001
        return {"error": f"无法解析文件: {exc}"}
    if len(df) > 50_000:
        df = df.head(50_000)
    result = diagnose_dataframe(df)
    result["preview"] = df.head(8).fillna("").astype(str).to_dict(orient="records")
    result["feature_suggestions"] = suggest_features(list(map(str, df.columns)))
    return result


@router.post("/features/suggest")
def features(columns: list[str], domain_hint: str = "") -> dict:
    return {"features": suggest_features(columns, domain_hint)}


@router.post("/model-select")
def model_select(body: SelectIn) -> dict:
    return select_models(body.model_dump())
