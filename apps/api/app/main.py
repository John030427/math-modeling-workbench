"""Math Modeling Workbench API."""
from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import init_db
from app.routers import (
    ai,
    competition,
    data,
    gym,
    learning,
    profile,
    registry,
    review,
)

ROOT = Path(__file__).resolve().parents[3]

app = FastAPI(title="Math Modeling Workbench API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(registry.router, prefix="/api/registry", tags=["registry"])
app.include_router(learning.router, prefix="/api/learning", tags=["learning"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(gym.router, prefix="/api/gym", tags=["gym"])
app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(competition.router, prefix="/api/competition", tags=["competition"])
app.include_router(review.router, prefix="/api/review", tags=["review"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])


@app.on_event("startup")
def _startup() -> None:
    init_db()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "math-modeling-workbench"}
