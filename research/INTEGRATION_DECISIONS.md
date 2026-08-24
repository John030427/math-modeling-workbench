# Integration Decisions — Phase 2 (Revised)

**Status:** Benchmark confirmed · **DSH-native plugin pivot active**  
**Date:** 2026-08-24

---

## Confirmed from GitHub Benchmark

1. **MathMN** — integrity gates, ReqID contract, claim ledger, multi-seed algorithm lab → adopt **patterns** (not wholesale copy; PolyForm NC).
2. **chengziyue1222/math-model-agent** — algorithm library + benchmarks + run-manifest → adopt via **Algorithm Provider adapter**, not direct API coupling.
3. **Barson** — Problems IA → Problem Library (dual entry), not Generator-first UX.
4. **zhanwen/MathModel** — Resource Registry with external links only.
5. **MCM-AI-Starter-Kit** — figure rules + templates for Visualization/Paper Lab.
6. **Our differentiator** — learning loop (Atlas lesson, SRS, Coach, Profile) remains primary.

---

## NEW — D-P2-00: DSH plugin as final delivery (supersedes standalone expansion)

**Decision:** Phase 2+ deliverable = **`@math-modeling/dsh-mathmodeling` Profile Bundle**.

| Item | Policy |
|------|--------|
| `apps/web + apps/api` | MVP prototype; **freeze feature expansion**; extract to `packages/core` |
| UI | DSH official slots only — see `research/DSH_UI_CAPABILITY_MATRIX.md` |
| Primary entry | `sidebar.footer.action` → `conversation.view`「数模工作台」 |
| Fallback | `shell.overlay` drawer (not primary) |
| Agent | DSH session + `modeling-tutor` skill + `/api/mathmodeling/context` |
| Install | `dev_install_package` / `scripts/dsh-install.ps1` |
| Uninstall | Must leave DSH healthy |

**Gate:** Vertical slice (install → dashboard → atlas/kmeans → context → skill → uninstall) **before** GitHub Integration P0.

---

## REVISED — D-P2-01: Algorithm execution via Provider abstraction

**Supersedes:** direct FastAPI → czy import.

```text
Math Modeling Core
  → AlgorithmProvider interface
  → local-provider | czy-provider (pinned) | future-provider
```

- Pin commit + license in `THIRD_PARTY.md`.
- czy-provider wraps **public** `algorithms` exports only.
- Competition / Algorithm Lab call interface — never `from algorithms import …` in routes.

---

## D-P2-02 — Integrity lite (unchanged intent, deferred to plugin P2)

Adopt MathMN subset **inside plugin workspace** (`~/.dsh/plugins/mathmodeling/` or project workspace):

- `PROBLEM_CONTRACT.json` lite
- `run-manifest.json`
- `claim_ledger.json` lite
- STALE stage propagation

---

## D-P2-03 — Resource + Case Registry (unchanged, plugin P5)

`registry/resources/`, `registry/cases/` — external-reference-only.

---

## D-P2-04 — Problem Library (unchanged, plugin P4)

Dual entry: Atlas/Plugin Problem Library + Competition import.

---

## Execution order (authoritative)

See **`PHASE2_PLAN.md`**:

```text
P0 DSH plugin skeleton
P1 Atlas + Tutor slice
P2 MathMN-lite integrity
P3 Algorithm Provider
P4 Problem Library
P5 Resource/Case Registry
P6 Competition migration
P7 Reviewer V2
P8 Daily/Profile
P9 UI polish
P10 Regression
→ then GitHub integration backlog
```

---

## Explicitly NOT doing

- Completing standalone Next/FastAPI product before plugin slice passes
- Direct czy internal API in core routes
- Copying MathMN codebase
- Barson Generator as primary flow
- New Atlas lessons before P1 slice

---

## Document index

| File | Role |
|------|------|
| [DSH_UI_CAPABILITY_MATRIX.md](./DSH_UI_CAPABILITY_MATRIX.md) | Official vs unavailable DSH UI slots |
| [PHASE2_PLAN.md](../PHASE2_PLAN.md) | Sprint order + acceptance |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | DSH + core layout |
| [THIRD_PARTY.md](../THIRD_PARTY.md) | Pinned deps + licenses |
| [GITHUB_BENCHMARK.md](./GITHUB_BENCHMARK.md) | Research |
| [MODEL_COVERAGE.md](./MODEL_COVERAGE.md) | Algorithm table |
