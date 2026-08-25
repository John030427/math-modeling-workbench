# Shell V2 Gate Report

**Date:** 2026-08-25
**Branch:** `experiment/mathmodel-harness`
**Shell:** `@math-modeling/shell-v2` 0.1.0 (`packages/shell-v2`)
**Method:** hot assembly via super-injector (no DSH restart) + playwright-core/system-Edge live checks (`scripts/shell-v2-live.mjs`, `scripts/shell-v2-h5.mjs`)
**Plan:** `MATHMODEL_HARNESS_SHELL_V2_PLAN.md`

---

## Gate Results

| Gate | Result | Evidence |
|------|--------|----------|
| **H1 Agent** | **PASS** | Composer send → agent replied `OK-H1` (token-count wait, no self-pollution). `REVIEW/live/h1-reply.png`, `h1-report.json` |
| **H2 Session** | **PASS** | ModelingContext isolation `gateA=kmeans` vs `gateB=topsis` (API); reload restored shell UI. `REVIEW/live/h2-after-reload.png`, `h2-report.json` |
| **H3 Custom Shell** | **PASS** | `[data-mm-shell="v2"]` mounts, 8 nav tabs, dashboard cards → card click POSTs context + auto-switches to workbench, 3-column grid asserted, **zero console/page errors** across all runs. `h3-dashboard.png`, `h3-workbench.png`, `h3-card-to-workbench.png` |
| **H4 Skill/Tool** | **PASS** | `/modeling-tutor` dispatched via native composer; reply contains K-Means pedagogy (簇/质心/标准化). Offline tutor: feature-scaling answer + `related_ku`. `h4-tutor-reply.png`, `h4-report.json` |
| **H5 Rollback** | **PASS** | Round trip: uninject shell-v2 → restore ui-layout (+ thinking-counter junction via heal) → stock UI verified (`h5-stock-restored.png`, shell=0, sidebar+composer ✓) → re-inject → shell returns with 8 tabs (`h5-shell-reenabled.png`). Zero errors both directions |

```text
SHELL_V2_GATE = PASS
```

## API smoke (tests/shell-v2-smoke.ps1)

`shell-v2/health` ✓ · `mathmodeling/health` ✓ (v0.2.0) · registry 13 models ✓ · tutor offline ✓

## Theme adaptation (UX R1 critical fix)

- R1 defect: hardcoded dark surface on light theme (historical「黑色区域」).
- Fix: runtime palette derived from computed body colors + MutationObserver.
- Verified: light theme screenshots + forced-dark body override → frame followed (`scripts/dark-check.mjs`, `adapted: true`).

## Fixes required during gating

| Issue | Fix |
|-------|-----|
| Dark-on-dark unreadable shell (U1) | Theme-adaptive palette (see above) |
| Chat header collided with native top-right controls (U2) | `paddingRight: 96` on chat header |
| H1/H4 self-polluting waits (user bubble contains token) | Token-count ≥2 / reply-only regex |
| `/`-command composer: Enter swallowed by command palette; slash bubbles render as chips (no text echo) | Escape→Enter + geometric send-button fallback; judge H4 by reply content |
| h5 stock selector missed composer (role=textbox) | Broadened selector |

## Runtime assembly ledger (hot path, this machine)

1. `install dsh-mathmodeling` → live ✓
2. `uninject dsh-client-ui-layout` → tombstone written
3. `uninject dsh-thinking-counter` → tombstone + junction removed
4. `install shell-v2` → live ✓
5. 3× `reload shell-v2` (R1 fix, U2 fix, final) — all deterministic
6. H5 round trip: `uninject shell-v2` → heal-links → `reload ui-layout` → stock ✓ → `uninject ui-layout` → `install shell-v2` → shell ✓

Restart-based reproducible path: `scripts/shell-v2-enable.ps1` → restart DSH → `tests/shell-v2-smoke.ps1` → `scripts/shell-v2-disable.ps1` → restart.

## Deferred until now unblocked (plan §3)

MathMN-lite · czy-provider · 题库 · 案例库 — may start in follow-up work; not started in this loop, per plan.
