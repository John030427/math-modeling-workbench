# Shell V2 UX Review — Round 1

**Date:** 2026-08-25
**Reviewer:** agent loop (automated live checks + visual inspection of `REVIEW/live/*.png`)
**Build under review:** shell-v2 0.1.0 (post theme-fix rebuild)

---

## What was reviewed

- `REVIEW/live/h3-dashboard.png` / `h3-workbench.png` / `h3-card-to-workbench.png`
- H3 automated run (nav flow, card click, grid assertion, console capture)
- Theme probe (`scripts/theme-probe.mjs`)

## Findings

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| U1 | **Critical** | R1 initial build hardcoded dark surface (`var(--dsh-bg,#141414)`) while official body theme is light → dark-on-dark unreadable text in nav + dashboard (the historical「黑色区域」complaint) | **FIXED** — palette now derived from computed body colors, MutationObserver re-derives on theme change |
| U2 | Minor | Chat header right label「/modeling-tutor 可用」collides with the native conversation column's floating top-right controls | OPEN — fix in R2 (padding-right / drop the label) |
| U3 | Info | Dashboard card grid is 2-col with generous whitespace at 1680px — acceptable; revisit density when >13 models | OPEN (low) |
| U4 | Info | Placeholder sections show plan reference text — good affordance, no dead clicks | OK |
| U5 | Info | Nav active state (accent + soft bg + 600 weight) clearly readable in light theme | OK |
| U6 | Minor | Difficulty badge colors fixed palette (green/orange/red) — verify contrast in dark theme when user switches | OPEN (low, verify in dark) |

## Verdict

R1 UX gate: **conditional pass** — U1 resolved; U2 must be fixed before final gate report. Layout, information architecture (nav | workbench | chat) and theme integration match the product direction in `research/HARNESS_ARCHITECTURE_DECISION.md` (Option B, staged).

## Next round actions

1. Fix U2 (header collision).
2. Dark-theme spot check (toggle theme, re-screenshot).
3. Workbench column content check with ModelingWorkbench visible (screenshot `h3-workbench.png` review after U2 fix).
