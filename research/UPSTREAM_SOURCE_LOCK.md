# Upstream Source Lock

**Policy:** all third-party execution code is consumed only through `AlgorithmProvider` adapters, pinned by commit, with license verified. This file is the authoritative lock record. Update procedure at the bottom.

---

## EXECUTION SOURCE — chengziyue1222/math-model-agent

| Field | Value |
|---|---|
| Repo | https://github.com/chengziyue1222/math-model-agent |
| License at plan time | MIT |
| Candidate pin | `33cb044009d2dc12e7fa86e4ded6138ddb790d9a` |
| Role | algorithm implementations, run-manifest/reproducibility patterns, benchmark metadata/rubrics |
| Copy status | **NOT vendored tonight.** Tonight's executions run on `local` provider (`packages/dsh-mathmodeling/lib/algorithms.js`) — our own dependency-free implementations. The czy adapter slot is reserved at `packages/algorithm-provider-czy/` and must re-verify the commit + LICENSE before first enable. |
| Re-verify command | `git ls-remote https://github.com/chengziyue1222/math-model-agent 33cb044009d2dc12e7fa86e4ded6138ddb790d9a` (must resolve) then read `LICENSE` at that commit |

## PATTERN-ONLY — ShuoSachiko/MathMN

PolyForm Noncommercial — **code/assets must NOT be copied into this repo**. Patterns used (independently reimplemented): Problem Contract/ReqID, stage STALE propagation, run manifest fields, claim ledger, human checkpoints, multi-seed aggregation.

## PATTERN-ONLY — Barson0588/math-modeling-assistant

Problems IA / model-catalog organization / Guide-Role ideas. No generator-first UX. No code copied.

## INDEX-ONLY — zhanwen/MathModel

Excellent-paper/problem discovery via external links (`registry/resources/resources.json`). No PDFs vendored.

## PATTERN-ONLY — Gunp-666/MCM-AI-Starter-Kit

Figure standards / output conventions / writing rules referenced by the visualization + paper skills. No code copied tonight.

---

## Update procedure

1. Re-verify commit resolves and LICENSE is still MIT (or compatible).
2. Update the pin row above + `THIRD_PARTY.md` + `packages/dsh-mathmodeling/THIRD_PARTY_NOTICES.md` in the same commit.
3. Vendor only into the adapter package cache; never scatter files into business packages.
4. Run provider fixture tests (`packages/dsh-mathmodeling/tests/provider.test.mjs`).
