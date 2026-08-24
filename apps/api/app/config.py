from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
REGISTRY_DIR = ROOT / "registry" / "models"
QUIZ_DIR = ROOT / "registry" / "quizzes"
SKILLS_DIR = ROOT / "skills"
DEMO_DIR = ROOT / "demo"
DATA_DIR = ROOT / "apps" / "api" / "data"
DB_PATH = DATA_DIR / "workbench.db"
WORKSPACE_DIR = ROOT / "workspace"

OPENAI_BASE_URL = os.getenv(
    "OPENAI_BASE_URL",
    os.getenv("DSH_OPENAI_BASE_URL", "https://opencode.ai/zen/go/v1"),
)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("OPENCODE_GO_API_KEY") or ""
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "deepseek-v4-flash")

DATA_DIR.mkdir(parents=True, exist_ok=True)
WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
