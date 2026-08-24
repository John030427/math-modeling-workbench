# Nightly Current State

**Captured:** 2026-08-25  
**Branch:** `master` (uncommitted P1 + architecture correction work)  
**Base commit:** `8fd6451` — Initial commit: math modeling MVP

---

## Git / build

| Item | Status |
|------|--------|
| Uncommitted changes | Yes — `packages/`, `research/`, docs, `apps/web` shared UI migration |
| Remote | `origin/master` synced at base commit |
| `packages/core` build | ✅ `npm run build` |
| `packages/ui` build | ✅ |
| `packages/dsh-mathmodeling` build | ✅ `lib/client.js` |
| Unit tests | ✅ core tutor 2/2, host 4/4 |

**DSH profile note:** `~/.dsh/profiles/web/cordis.patch.yml` has `dsh-mathmodeling` **disabled** — reinstall must re-enable for live smoke.

---

## Completed

| Area | Status | Location |
|------|--------|----------|
| DSH plugin host (registry, context, quiz, mastery, tutor offline) | ✅ | `packages/dsh-mathmodeling/lib/` |
| Session-scoped ModelingContext | ✅ | `packages/core/context/types.ts`, `lib/stores.js` |
| Shared UI (Atlas, KMeans, Workbench) | ✅ | `packages/ui/src/` |
| apps/web uses shared UI (no KMeansCanvas duplicate) | ✅ | `apps/web` imports `@math-modeling/ui` |
| `conversation.view` primary + `shell.overlay` fallback | ✅ | `packages/dsh-mathmodeling/src/client/index.tsx` |
| `modeling-tutor` skill + SKILL.md | ✅ | `lib/skill.js`, `skills/modeling-tutor/` |
| Mastery persistence JSON | ✅ | `~/.dsh/plugins/mathmodeling/learning-state.json` |
| DSH UI capability matrix | ✅ | `research/DSH_UI_CAPABILITY_MATRIX.md` |
| Install scripts | ✅ | `scripts/dsh-install.ps1`, `dsh-uninstall.ps1` |
| API smoke script | ✅ | `tests/dsh-plugin-smoke.ps1` |

---

## Partial

| Area | Gap |
|------|-----|
| P1 Gate live UI | Needs DSH refresh + plugin re-enabled in profile |
| Module enum in ModelingContext | Uses `mathmodeling` + page strings; prompt suggested dashboard/atlas enum — functional via `page` |
| Harness spike | Not yet built (this nightly iteration) |
| GitHub Integration P2+ | Planned only |

---

## Not started

| Area | Notes |
|------|-------|
| MathMN-lite | P2 per PHASE2_PLAN |
| Algorithm Provider implementation | Interface only this night |
| Problem/Case libraries | P4–P5 |
| Full MathModel Harness migration | Spike only |

---

## Key implementation map

```text
footer action     → packages/dsh-mathmodeling/src/client/index.tsx (MathModelingFooter)
conversation.view → id mathmodeling, ModelingWorkbench
overlay fallback  → shell.overlay + OverlayHost
Context API       → lib/learning-routes.js, lib/stores.js
Tutor core        → packages/core/tutor/index.ts (from offline_ai.py)
Mastery           → packages/core/mastery/index.ts + learning-routes
Registry YAML     → registry/models/, packages/dsh-mathmodeling/lib/registry-data.json
MVP FastAPI tutor → apps/api/app/services/offline_ai.py (prototype; core TS is source for plugin)
```

---

## DSH environment

| Item | Value |
|------|-------|
| DSH version | `@deepseek-ai/dsh` **0.1.1-rc.2** |
| Profile | `~/.dsh/profiles/web` |
| Super-injector | `http://127.0.0.1:3080/super-injector/api/inject` |
| DSH packages source | `~/.dsh/profiles/node_modules/@deepseek-ai/` |
