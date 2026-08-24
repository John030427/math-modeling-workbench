# Architecture

## Overview

Monorepo：Next.js 前端 + FastAPI 后端 + YAML Registry + Skill contracts + SQLite learning state。

```text
Browser
  └─ apps/web (App Router)
       ├─ AppShell + AI Dock (context: page/model/ku/mode)
       └─ /api/* rewrite → FastAPI :8000
            ├─ registry_loader
            ├─ offline_ai + optional LLM
            ├─ data_doctor / model_selector / reviewer / srs
            └─ SQLite (mastery, quiz, ledger, profile)
```

## Key boundaries

| Concern | Location |
|---------|----------|
| Model knowledge | `registry/models` (not UI hardcode) |
| Skill policy | `skills/*/SKILL.md` + `services/offline_ai.py` |
| Learning state | SQLite via `db.py` |
| Competition artifacts | `workspace/<id>/...` |
| Demo fixtures | `demo/` |

## AI routing

`route_skill(page, message, model_id)` → skill id → offline template or LLM with system constraints.

Modes: coach (force coach skill), copilot, agent (same backend for MVP; agent may call workflow endpoints later).

## Integrity

Reviewer is evidence-term grounded training rubric. Paper claims should eventually chain to experiment files (workspace layout prepared; full chain is post-MVP).
