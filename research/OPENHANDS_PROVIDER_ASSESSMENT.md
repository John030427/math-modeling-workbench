# OpenHands — Provider Assessment (Architecture Only)

**Date:** 2026-08-25  
**Scope:** Whether OpenHands fits math-modeling execution / agent stack  
**Action:** **No dependency added this cycle**

---

## Questions

| # | Question | Assessment |
|---|----------|------------|
| 1 | Workspace for algorithm experiments? | **Partial fit** — OpenHands workspace + bash suits ad-hoc runs; weaker for structured experiment registry / claim ledger. |
| 2 | Docker isolation for contest code? | **Good** — sandboxed execution aligns with untrusted student scripts; ops cost vs DSH `dsh-bash-sandbox`. |
| 3 | Persistent workspace? | **Yes** — workspace dirs persist; need policy for per-user / per-competition isolation. |
| 4 | Primary agent core? | **No** — overlaps DSH agent loop, skills, sessions; would duplicate harness value. |
| 5 | Execution backend only? | **Optional** — `AlgorithmProvider` adapter `provider-openhands` for heavy/offline runs. |
| 6 | Overlap with DSH tool runtime? | **High** — bash, fs, subagent tools already in DSH; OpenHands adds browser/UI automation we do not need for core learning loop. |

---

## Default stance

```text
OpenHands = optional execution provider (AlgorithmProvider adapter)
NOT primary agent core
```

Integrate only when Algorithm Lab (P6+) needs isolated multi-file contest runs beyond DSH sandbox limits.

---

## Interface hook

`packages/core/algorithm-provider/types.ts` — future `provider-openhands` implements `AlgorithmProvider.runAlgorithm`.
