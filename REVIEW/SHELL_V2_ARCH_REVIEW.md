# Shell V2 Architecture Review — Round 1

**Date:** 2026-08-25
**Scope:** `packages/shell-v2` vs Live-Gate constraints, slot contract hygiene, runtime assembly path.

---

## Contract compliance (Live-Gate lessons → V2 code)

| Constraint (from HARNESS_LIVE_GATE_REPORT) | V2 handling | Verdict |
|---|---|---|
| Replacing `root` must re-declare official children | `apply()` registers root with `sidebar/conversation/details/shell.overlay` + own `mathmodel.workbench` | ✅ |
| `ctx.layout` stub before ui-sidebar inject | `reflect.provide('layout', stub)` before register, disposed in `ctx.effect` | ✅ |
| Footer-seat peers must use `slots.inject` | `dsh-mathmodeling` uses inject (verified in its client); `dsh-thinking-counter` quarantined via profile patch by enable script | ✅ |
| WebRoute shape `kind:'exact'` + `(req,res)` | host `lib/index.js` health route | ✅ (probed 200) |
| No BOM in profile package.json writes | enable/disable scripts use `UTF8Encoding($false)` | ✅ |
| Single root owner | enable script defensively strips stale `@math-modeling/harness-spike` from bundles; profile patch disables `ui-layout` while V2 owns root | ✅ |

## Runtime assembly (this machine, no restart)

Sequence used and verified:
1. `dev_install_package(packages/dsh-mathmodeling)` → hot load, client ✓
2. `dev_uninject_plugin('dsh-client-ui-layout')` → fiber disposed, patch tombstone written
3. `dev_uninject_plugin('dsh-thinking-counter')` → fiber disposed, junction removed, tombstone written
4. `dev_install_package(packages/shell-v2)` → hot load, client ✓
5. `dev_reload_package('shell-v2')` per iteration → deterministic rebuild (used 3×, all clean)

Risk noted: steps 2–3 mutate the shared web profile. `scripts/shell-v2-disable.ps1` + H5 rollback gate restore `ui-layout`; `dsh-thinking-counter` stays quarantined only while V2 owns root (disable script removes its marker too).

## Code quality observations

| # | Severity | Observation | Action |
|---|----------|-------------|--------|
| A1 | Low | `styles(pal)` rebuilt per render per card (Dashboard calls `styles(pal).card` in map) — negligible at 13 cards; memoize if registry grows past ~100 | defer |
| A2 | Medium | Theme palette derived from `document.body` computed style; if DSH theme lives on a nested container (skin-center overrides), palette may diverge. MutationObserver covers class/style flips on body/html only | verify in dark-theme spot check (U6) |
| A3 | Low | `readCurrentSessionId` reads `sessions.list` snapshot at click time — correct lazy pattern; no stale-session bug | none |
| A4 | Info | Panes kept mounted (display:none) to preserve ModelingWorkbench state across nav switches — intentional; cost is hidden DOM | document in plan §4 ✓ (already) |
| A5 | Low | `sessionStorage` nav persistence is per-browser-tab — matches DSH session semantics, no cross-session leak (nav is UI state, not ModelingContext) | none |

## Verdict

R1 architecture gate: **pass** — all Live-Gate constraints encoded; hot-assembly loop is deterministic; dispose hygiene verified across 3 reload cycles with zero page errors.
