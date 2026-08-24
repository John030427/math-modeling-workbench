# MVP Plan

> **Note (Phase 2):** MVP delivered via `apps/web + apps/api` for demo/share.  
> **Final product shape** = DSH plugin — see `PHASE2_PLAN.md`. Do not expand standalone apps; extract & migrate.

Goal: Stable live-demo workbench for a math-modeling experience talk.

## Vertical slices

| ID | Task | Priority | Depends | Acceptance criteria |
|----|------|----------|---------|---------------------|
| T0 | Scaffold monorepo + docs skeleton | P0 | — | `npm run dev` + `uvicorn` start; README stub |
| T1 | Dashboard with 6 module cards + AI dock | P0 | T0 | Routes exist; empty states OK |
| T2 | Model Registry (8+ models YAML) | P0 | T0 | API list/filter by task & family; Atlas UI |
| T3 | K-Means interactive lesson | P0 | T2 | Intuition→animation→math→quiz; step controls |
| T4 | AI Tutor + router + Coach/Copilot/Agent | P0 | T2 | Context-aware replies; offline fallback |
| T5 | Quiz + Learning Record (SQLite) | P0 | T3 | Score persisted; mastery updates |
| T6 | Daily Review (SRS) | P1 | T5 | Due cards; 5-level quiz types |
| T7 | Modeling Gym (1 delivery case) | P1 | T4 | Coach Mode guides variables/goals/constraints |
| T8 | Data Doctor + Feature cards | P1 | T0 | CSV upload; missing/scale diagnostics |
| T9 | Competition Workbench workflow | P1 | T8,T2 | Stages + model recommendations |
| T10 | Paper Reviewer + Gap Analyzer | P1 | T5 | Rubric score + training recommendations |
| T11 | Modeling Profile | P2 | T5,T10 | Skill bars + model mastery |
| T12 | Demo data + DEMO.md script | P0 | T3–T10 | Demo A–D runnable offline |
| T13 | Core tests | P0 | T2–T10 | Registry, SRS, Data Doctor, Reviewer tests |
| T14 | Review loop docs + fixes | P0 | T12,T13 | REVIEW/* + Round 2; no Critical |

## Non-goals (MVP)

- Full 30-model interactive lessons (only K-Means polished)
- Deep learning models
- Real MATLAB / unrestricted code execution
- Multi-user / teacher portal
- Shipping as DSH GUI bundle (skills prepared for later)

## Demo script mapping

| Demo | Slice |
|------|-------|
| A Atlas → K-Means → Tutor → Quiz | T2–T5 |
| B Gym Coach Mode | T7 |
| C Workbench CSV → Doctor → Selector | T8–T9 |
| D Paper Reviewer → Gap | T10 |
