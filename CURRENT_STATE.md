# Current State

**Scan date:** 2026-08-22  
**Project path:** `C:\Users\Administrator\Projects\math-modeling-workbench`  
**Status:** Greenfield — no prior application code in this repo.

## Environment

| Item | Value |
|------|--------|
| OS | Windows 10 (build 26200) |
| Node | v24.15.0 |
| npm | 11.12.1 |
| Python | 3.11.15 |
| Git | Initialized (empty) |

## DSH (DeepSeek Harness)

| Item | Value |
|------|--------|
| Harness home | `C:\Users\Administrator\.dsh` |
| Web profile | `~\.dsh\profiles\web` |
| Default model | `deepseek-v4-flash` via `vision-toolkit-opencode-go` |
| API key env | `OPENCODE_GO_API_KEY` |
| Active bundles | dsh-base, dsh-web-app, super-injector, dshmarket, web-ui-all, memory, vision-toolkit, thinking-counter, live-stats, gitbash-preset |

**Not found:** MathMN plugin, mathmodel-* skills, or an existing modeling workbench app in this profile.

**Implication:** Integrate as an **external app** that:
1. Ships its own Skill contracts under `skills/`
2. Calls OpenAI-compatible LLM (same env as DSH when available)
3. Provides deterministic offline fallbacks so demos never depend on live LLM
4. Optionally expose a future DSH bundle — **not** MVP-critical

## Current directory

```text
math-modeling-workbench/
  .git/
  CURRENT_STATE.md   (this file)
```

## Reusable assets

| Source | Reuse |
|--------|--------|
| DSH LLM provider config | Same OpenAI-compatible endpoint + key for Tutor |
| dsh-plugin-install skill | Recipe for later optional DSH plugin packaging |
| MathMN (external knowledge) | Architecture ideas only — orchestrator / integrity / algorithm registry patterns; **no wholesale copy** |

## Technical debt

None in-repo yet. Risks to watch:
- Greenfield schedule pressure vs. demo polish
- LLM flakiness → must have offline AI fallbacks
- Code execution sandbox for Algorithm Lab (MVP: simulated / constrained)

## Gap vs target architecture

| Target | Gap |
|--------|-----|
| Dashboard workbench | Missing |
| Model Registry (Task×Family×Algorithm) | Missing |
| K-Means interactive lesson | Missing |
| AI Tutor + Skill router + 3 modes | Missing |
| Daily Review / spaced repetition | Missing |
| Modeling Gym | Missing |
| Competition Workbench | Missing |
| Paper Reviewer + Gap Analyzer | Missing |
| Modeling Profile | Missing |
| SQLite learning persistence | Missing |
| Demo datasets + scripts | Missing |
| Review docs loop | Missing |

## Decision for bootstrap

Create monorepo:

```text
apps/web   → Next.js + TypeScript (App Router)
apps/api   → FastAPI + SQLite
registry/  → YAML model + knowledge units
skills/    → Skill contracts (Markdown + JSON schemas)
demo/      → Demo data & scripts
REVIEW/    → Review artifacts
```
