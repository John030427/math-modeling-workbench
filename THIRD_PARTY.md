# Third-Party Dependencies

Pinned third-party code used by MathModel Harness.
**Rule:** Application code must not import third-party internal paths directly — only through `AlgorithmProvider` adapters.

---

## chengziyue1222/math-model-agent (execution source — adapter reserved)

| Field | Value |
|-------|--------|
| Repository | https://github.com/chengziyue1222/math-model-agent |
| Purpose | Optional algorithm execution adapter (`czy-provider`) |
| Pin | `33cb044009d2dc12e7fa86e4ded6138ddb790d9a` (re-verify before enable — see `research/UPSTREAM_SOURCE_LOCK.md`) |
| License | MIT (verify again at pinned commit before first enable) |
| Integration | `packages/algorithm-provider-czy/` wraps public `algorithms` exports only |
| Status | **Reserved, not vendored.** Tonight's executions use the `local` provider (our own dependency-free implementations in `packages/dsh-mathmodeling/lib/algorithms.js`). |

## ShuoSachiko/MathMN — pattern source ONLY

PolyForm Noncommercial. **No code or assets copied into this repo.** Independently reimplemented patterns: Problem Contract/ReqID, stage STALE propagation, run manifest fields, claim ledger, human checkpoints, multi-seed aggregation.

## Barson0588/math-modeling-assistant — pattern source ONLY

Problems IA / model-catalog organization / Guide-Role ideas adopted as design references. No code copied. No generator-first UX.

## zhanwen/MathModel — index only

Excellent-paper/problem discovery via external links in `registry/resources/resources.json`. No PDFs redistributed.

## Gunp-666/MCM-AI-Starter-Kit — pattern source ONLY

Figure standards / output conventions / writing rules referenced by the visualization + paper skills. No code copied tonight.
