from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Iterator

from app.config import DB_PATH

SEED_MASTERY = {
    "kmeans": 62,
    "dbscan": 12,
    "ahp": 78,
    "topsis": 70,
    "linear-regression": 55,
    "random-forest": 40,
    "arima": 28,
    "pso": 18,
}

SEED_KU = {
    "clustering-basic": 70,
    "distance": 65,
    "feature-scaling": 45,
    "centroid": 60,
    "iteration": 55,
    "k-selection": 35,
    "sse": 50,
    "silhouette": 30,
    "initialization": 40,
    "local-optimum": 25,
    "outlier-sensitivity": 40,
    "kmeans-vs-dbscan": 20,
    "validation": 35,
    "feature-engineering": 40,
}


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db() -> Iterator[sqlite3.Connection]:
    conn = _connect()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with get_db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id TEXT PRIMARY KEY,
              display_name TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS mastery (
              user_id TEXT NOT NULL,
              item_type TEXT NOT NULL,
              item_id TEXT NOT NULL,
              score REAL NOT NULL DEFAULT 0,
              last_review TEXT,
              next_review TEXT,
              wrong_count INTEGER DEFAULT 0,
              correct_count INTEGER DEFAULT 0,
              difficulty REAL DEFAULT 0.3,
              PRIMARY KEY (user_id, item_type, item_id)
            );
            CREATE TABLE IF NOT EXISTS quiz_attempts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id TEXT NOT NULL,
              quiz_id TEXT NOT NULL,
              correct INTEGER NOT NULL,
              selected TEXT,
              created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS chat_messages (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id TEXT NOT NULL,
              skill TEXT,
              mode TEXT,
              page TEXT,
              role TEXT NOT NULL,
              content TEXT NOT NULL,
              created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS competitions (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              state_json TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS ai_ledger (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              competition_id TEXT,
              tool TEXT,
              task TEXT,
              user_decision TEXT,
              human_verified INTEGER DEFAULT 0,
              modification TEXT,
              result TEXT,
              created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS profile_dims (
              user_id TEXT NOT NULL,
              dim TEXT NOT NULL,
              score REAL NOT NULL,
              PRIMARY KEY (user_id, dim)
            );
            """
        )
        row = conn.execute("SELECT id FROM users WHERE id=?", ("demo",)).fetchone()
        if not row:
            seed_demo_user(conn)


def seed_demo_user(conn: sqlite3.Connection | None = None) -> None:
    own = conn is None
    if own:
        conn = _connect()
    assert conn is not None
    now = datetime.now(timezone.utc).isoformat()
    conn.execute(
        "INSERT OR REPLACE INTO users (id, display_name) VALUES (?, ?)",
        ("demo", "Demo Student"),
    )
    for mid, score in SEED_MASTERY.items():
        conn.execute(
            """
            INSERT OR REPLACE INTO mastery
            (user_id, item_type, item_id, score, last_review, next_review, wrong_count, correct_count, difficulty)
            VALUES (?, 'model', ?, ?, ?, ?, 1, 3, 0.3)
            """,
            ("demo", mid, score, now, now),
        )
    for kid, score in SEED_KU.items():
        conn.execute(
            """
            INSERT OR REPLACE INTO mastery
            (user_id, item_type, item_id, score, last_review, next_review, wrong_count, correct_count, difficulty)
            VALUES (?, 'ku', ?, ?, ?, ?, 2, 2, 0.4)
            """,
            ("demo", kid, score, now, now),
        )
    dims = {
        "Problem Analysis": 78,
        "Data Understanding": 72,
        "Preprocessing": 65,
        "Feature Engineering": 48,
        "Evaluation": 70,
        "Clustering": 58,
        "Prediction": 55,
        "Optimization": 35,
        "Validation": 38,
        "Visualization": 74,
        "Writing": 80,
    }
    for dim, score in dims.items():
        conn.execute(
            "INSERT OR REPLACE INTO profile_dims (user_id, dim, score) VALUES (?, ?, ?)",
            ("demo", dim, score),
        )
    if own:
        conn.commit()
        conn.close()


def rows_to_dicts(rows: list[sqlite3.Row]) -> list[dict[str, Any]]:
    return [dict(r) for r in rows]
