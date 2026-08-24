from __future__ import annotations

from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel

from app.services.reviewer import gap_to_training, review_paper

router = APIRouter()


class ReviewTextIn(BaseModel):
    title: str = "untitled"
    text: str


@router.post("/paper")
async def review_upload(
    file: UploadFile | None = File(None),
    title: str = "untitled",
) -> dict:
    if file is None:
        return {"error": "file required"}
    raw = await file.read()
    if len(raw) > 2_000_000:
        return {"error": "file too large"}
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("gbk", errors="ignore")
    result = review_paper(text, title=file.filename or title)
    result["training_plan"] = gap_to_training(result)
    return result


@router.post("/paper/text")
def review_text(body: ReviewTextIn) -> dict:
    result = review_paper(body.text, title=body.title)
    result["training_plan"] = gap_to_training(result)
    return result
