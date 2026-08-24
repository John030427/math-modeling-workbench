# Decisions

## D1 — Greenfield monorepo (2026-08-22)

No existing workbench found. Created `Projects/math-modeling-workbench`.

## D2 — Next.js App Router + FastAPI + SQLite

Matches prompt; keeps UI and AI/data logic separable. Web proxies `/api/*` to FastAPI in dev.

## D3 — Offline-first AI

LLM optional (`OPENCODE_GO_API_KEY` / `OPENAI_API_KEY`). Every skill has a deterministic fallback so live demos never fail on network/model errors.

## D4 — Skills as contracts, not chat personalities

Each skill under `skills/<id>/SKILL.md` defines Purpose, Trigger, I/O, Forbidden, Validation. Router picks skill by page + intent heuristics.

## D5 — K-Means is the showcase lesson

Other registry models get summary pages; only K-Means gets full interactive animation for MVP demo A.

## D6 — No DSH process coupling in MVP

App runs independently. Skill contracts mirror MathMN ideas (integrity, evidence, registry) without copying MathMN repos. Future optional DSH bundle left for roadmap.

## D7 — Algorithm Lab: sandbox stub

MVP runs clustering / simple sklearn-style logic inside FastAPI with size limits; no arbitrary user code execution.

## D8 — Single local user

SQLite user `demo` with seed mastery state; “Reset Demo” restores seed.
