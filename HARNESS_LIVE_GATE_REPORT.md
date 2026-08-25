# Harness Live Gate Report

**Date:** 2026-08-25  
**DSH:** web profile `@deepseek-ai/dsh` (local npx cache)  
**Branch:** `experiment/mathmodel-harness`  
**Artifacts:** `REVIEW/harness-live-*.png`

---

## Gate Results

| Gate | Result | Evidence |
|------|--------|----------|
| **H1 Agent** | **PASS** | Native composer sent message; agent replied `OK-H1` (34s). Screenshot: `REVIEW/harness-live-h1.png` |
| **H2 Session** | **PASS** | Reload restored same `sessionId` + harness UI; session A=`kmeans/feature-scaling`, B=`arima/stationarity` isolated after UI switch. `REVIEW/harness-live-h2-refresh.png` |
| **H3 Custom Shell** | **PASS** | Three-column MathModel Harness visible: nav \| workbench \| native conversation. No plugin boot failure after fixes. `REVIEW/harness-live-h3-v3.png`, `harness-live-reenabled-v3.png` |
| **H4 Skill/Tool** | **PASS** | `/modeling-tutor` answered with `model_id=kmeans`, Euclidean-distance + scaling pedagogy; offline tutor also returned feature-scaling answer. `REVIEW/harness-live-h4.png` |

```text
HARNESS_LIVE_GATE = PASS
```

---

## Procedure executed

1. Restarted DSH web profile  
2. Enabled `harness-spike` (`scripts/harness-spike-enable.ps1`)  
3. Ran `tests/harness-spike-smoke.ps1` → API PASS  
4. Opened real browser (Playwright headed) — verified MathModel Harness UI  
5. Sent native Agent message → `OK-H1`  
6. Ran `/modeling-tutor` with K-Means ModelingContext  
7. Reloaded browser — session restored  
8. Switched sessions — ModelingContext did not cross-contaminate  
9. Disabled harness — stock DSH UI + `数模工作台` footer restored (`REVIEW/harness-live-disabled-stock.png`)  
10. Re-enabled harness — three-column UI returned with 0 console errors  

---

## Fixes required during Live Gate

| Issue | Fix |
|-------|-----|
| Client not in `__DSH_BOOT__` | Add `exports["./package.json"]`; ModuleLoader-wrap `lib/client.js` |
| Host health hang / wrong route API | Use `kind:'exact'` + `(req,res)` WebRoute |
| Profile `package.json` BOM | Write UTF-8 without BOM |
| Duplicate loader id | Profile disables `ui-layout` only; package patch inserts self |
| Missing `ctx.layout` | Harness provides layout stub so `ui-sidebar` injects |
| Boot abort: `thinking-counter` races `sidebar.footer.action` | Disable `dsh-thinking-counter` while harness enabled; document in enable/disable scripts |
| Footer race in mathmodeling | Register `sidebar.footer.action` via `slots.inject` |

---

## Constraints observed (for architecture)

- Replacing `root` **must** re-declare official children (`sidebar`, `conversation`, `details`, `shell.overlay`) or the client boot fails.
- Third-party plugins that `register` into `sidebar.footer.action` **without** `slots.inject` will abort the entire GUI if they race the sidebar parent.
- Custom shell is feasible (L1) but couples to slot contracts + layout service + peer plugin hygiene.
- Stock Plugin path (`conversation.view` + footer) needs none of the above.

---

## Smoke commands (reproducible)

```powershell
powershell -File scripts/harness-spike-enable.ps1
# restart: dsh web --no-open
powershell -File tests/harness-spike-smoke.ps1
powershell -File scripts/harness-spike-disable.ps1
# restart again for stock UI
```
