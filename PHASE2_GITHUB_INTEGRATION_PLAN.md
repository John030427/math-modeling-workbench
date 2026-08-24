# Phase 2 — GitHub Integration Plan (Post-P1 / Post-Spike)

**Date:** 2026-08-25  
**Prerequisite:** P1 Gate PASS · Harness spike decision recorded

---

## Order (default)

| Step | Track | Deliverable |
|------|-------|-------------|
| 1 | MathMN-lite | Problem contract, run manifest, claim ledger skeleton in `packages/core` |
| 2 | czy-provider | `AlgorithmProvider` adapter, pinned commit in `THIRD_PARTY.md` |
| 3 | Barson-style | Problem Library IA + dual entry (Atlas + Problems) |
| 4 | zhanwen | Resource / case registry (external links only) |
| 5 | MCM AI Starter Kit | Figure rules + paper templates |
| 6 | Reviewer V2 | Evidence-grounded multi-review |

---

## Shared core rule

```text
DSH Plugin  ─┐
             ├→ packages/core (modeling-core)
MathModel Harness ─┘
```

No duplicate business logic in `apps/web` or plugin host.

---

## Interface stubs (ready)

| Interface | Path |
|-----------|------|
| AlgorithmProvider | `packages/core/algorithm-provider/types.ts` |
| ModelingContext | `packages/core/context/types.ts` |
| Mastery / quiz | `packages/core/mastery/`, `quiz/` |

---

## Not in next sprint

- Mass algorithm import (30+ models)
- Hundreds of exam questions bulk download
- OpenHands / LangGraph integration (see research decisions)
