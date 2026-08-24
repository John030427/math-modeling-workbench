# Phase 3 — Harness Migration Plan (if spike GO)

**Status:** Draft — spike proves L1 composition; full migration **not** started  
**Date:** 2026-08-25

---

## Phase H0 — Shell (spike → product)

- [x] Spike: disable `ui-layout`, custom `root` with nav | workbench | conversation
- [ ] Harden layout: resize handles, theme tokens, mobile collapse
- [ ] Session switcher in `mathmodel.nav` (DSH session list hook)
- [ ] Upgrade guard: diff slot catalog on DSH version bump

## Phase H1 — Learning

- Migrate P1 vertical slice to `mathmodel.workbench` as default surface
- Retire `conversation.view` tab when harness is primary
- Daily Review + Profile consume mastery API

## Phase H2 — Competition

- Competition workbench in center column
- Problem / case metadata (read-only registry)

## Phase H3 — Algorithm execution

- `AlgorithmProvider` adapters (local → czy)
- Experiment registry + run manifest (MathMN-lite patterns)

## Phase H4 — Problems / cases

- Problem Library IA (Barson-style dual entry)
- Case registry (zhanwen-style external links)

## Phase H5 — Evidence / reviewer

- Reviewer V2 with claim ledger
- Paper Lab templates (MCM starter kit patterns)

## Phase H6 — Distribution

- Profile bundle packaging
- Optional standalone harness profile vs plugin profile

---

**Gate:** Each phase requires harness regression (H1–H4) + plugin fallback path intact.
