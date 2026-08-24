# GitHub Benchmark — Math Modeling Workbench Phase 2

**Date:** 2026-08-24  
**Our repo:** https://github.com/John030427/math-modeling-workbench  
**Scope:** Study mature open-source math-modeling projects; benchmark capabilities; extract reusable patterns; **no implementation in this round**.

---

## Methodology

1. Read README, top-level structure, skills/algorithms via GitHub API and primary docs.
2. Map each repo to our MVP modules (Atlas, Gym, Competition, Daily, Paper, Profile, AI).
3. Score **reuse potential** as: Adopt / Adapt / Reference / Reject.
4. Prefer **evidence chains, registries, benchmarks** over “one-click paper” pipelines.

---

## Repos Studied

| ID | Repo | Stars (approx) | Primary Value | Risk if Copied |
|----|------|----------------|---------------|----------------|
| A | [ShuoSachiko/MathMN](https://github.com/ShuoSachiko/MathMN) | — | Integrity gate, skill chain, DSH preset, algorithm lab | Heavy; PolyForm NC license |
| B | [chengziyue1222/math-model-agent](https://github.com/chengziyue1222/math-model-agent) | — | 144 algo exports, 8 Codex skills, benchmarks, run-manifest | Algorithm lib is gold; don't duplicate |
| C | [Barson0588/math-modeling-assistant](https://github.com/Barson0588/math-modeling-assistant) | — | Problems/Models IA, Generator UX, 33-model速查 | MIT; good IA reference |
| D | [zhanwen/MathModel](https://github.com/zhanwen/MathModel) | — | 历年赛题/论文/模板/算法资料 | Content-only; link not copy |
| E | [Gunp-666/MCM-AI-Starter-Kit](https://github.com/Gunp-666/MCM-AI-Starter-Kit) | — | Figure rules, viz snippets, PDF extract | Small kit; rules portable |
| F | [jihe520/MathModelAgent](https://github.com/jihe520/MathModelAgent) | ~3.7k | Multi-agent, E2B/local interpreter, RAG, HIL | Upstream of MathMN; experimental |
| G | [xwangshuo/math-model-agent](https://github.com/xwangshuo/math-model-agent) | — | Gradio agent + subprocess sandbox | Simpler; overlap with ours |
| H | [Jaxon1216/MathModelHub](https://github.com/Jaxon1216/MathModelHub) | — | Past problems, notebooks, templates | Resource org pattern |
| I | [liuziyang337121/mathmodel-pro](https://github.com/liuziyang337121/mathmodel-pro) | — | Six-stage workflow skill, Word pipeline | Methodology reference |

---

## Executive Findings

### What the ecosystem already does well

| Theme | Best-in-class | Our gap |
|-------|---------------|---------|
| **Anti-hallucination / evidence** | MathMN `6verity`, `modeling_integrity.md`, claim ledger | We have training rubric only; no claim→result hash chain |
| **Executable algorithms** | chengziyue1222 `code/algorithms/` (25 modules, 144 exports) | 13 YAML registry entries; no runnable lib |
| **Historical benchmarks** | chengziyue1222 `benchmarks/` (CUMCM 2020–2023, 12 cases) | None |
| **Problems center** | Barson `Problems` tab (2000–2024 MCM/ICM + CUMCM) | Missing |
| **Figure quality** | MathMN `mathmodel-figure-templates`, MCM kit `font_standard.md` | No Visualization Lab |
| **Skill orchestration** | MathMN numbered chain + HANDOFF; chengziyue `run-modeling-project` | Single router + offline templates |
| **Content corpus** | zhanwen/MathModel (years of papers/problems) | No Resource/Case Registry |

### What our workbench already leads on (keep)

- **Learning loop:** K-Means lesson, Quiz, SRS Daily Review, mastery profile — none of the competition agents prioritize this.
- **Coach Mode:** Socratic Gym — most repos optimize for “generate answer/paper”.
- **Unified dashboard:** Learn ↔ Practice ↔ Solve ↔ Review closed loop in one UI.
- **Offline AI fallback:** Demo-stable Tutor without API key.

### Anti-patterns to avoid importing

- “Upload → full paper” as primary UX (Barson Generator, MathModelAgent default narrative).
- Algorithm count without validation / baseline discipline.
- Copying entire content repos (MathModel) into git.
- MathMN wholesale copy (license + complexity).

---

## MathMN — Deep Answers (Section A)

### 1. How are Skills organized?

- **Numbered pipeline:** `1start-mathmodel` → `2analysis-modeling` → `3coding-visual` → `4drawio` → `5writing` → `6verity`.
- **Satellite skills:** `mathmodel-literature-research`, `mathmodel-algorithm-lab`, `mathmodel-figure-templates`, `mathmodel-review-polish`, `mathmodel-orchestrator`, `7benchmark-mathmodel`, `doctor`.
- **Shared contract:** `skills/_references/modeling_integrity.md` + per-skill `SKILL.md` with Purpose, inputs, outputs, forbidden behavior, shell-verifiable scripts.

### 2. How do Skills hand off artifacts?

Structured files under `reports/` and `workspace/`:

| Artifact | Producer | Consumer |
|----------|----------|----------|
| `PROBLEM_MANIFEST.json` (input whitelist + SHA-256) | 1start | All stages |
| `PROBLEM_CONTRACT.json` (FROZEN ReqID table) | 2analysis | 3coding, 5writing, 6verity |
| `STAGE_GATES.json` | Each stage | Downstream; STALE on hash change |
| `HANDOFF.json` | Each stage | Next agent/session |
| `HUMAN_REVIEW.json` | Human checkpoints | Blocks PASS without sign-off |
| `ALGORITHM_CANDIDATES.json` | algorithm-lab | 3coding experiments |
| `experiment_manifest.json` + aggregate | algorithm-lab | 6verity |
| `claim_ledger.json` | results phase | 5writing, 6verity |
| `VERIFY_REPORT.md` | 6verity | Final |

**Key mechanism:** Input hash change → downstream marked `STALE`; no silent overwrite of frozen contract.

### 3. How to prevent fabricated experiment results?

- **Human-supervised** mode: 7 checkpoints; AI cannot self-approve.
- **Claim ledger:** Every paper claim maps to evidence path + cognitive level (`heuristic` vs `proved`).
- **Independent numerical chain:** Same code output ≠ validation; requires cross-checks, multi-seed aggregates.
- **Algorithm lab:** `aggregate_experiments.py` — report median/IQR/failure rate, not best seed only.
- **Integrity script:** `integrity_check.py` FAIL = hard stop.
- **Simulation waiver:** Autonomous runs max `UNVERIFIED`, never “submission ready”.

### 4. How to ensure paper numbers trace to real results?

- `results/run_manifest.json` with file SHA-256.
- `claim_ledger.json` with `contract_refs`, evidence paths, validation records.
- `reference_map.csv` for citations.
- `6verity` Step 0: ReqID semantic gate before numeric consistency checks.
- Writing stage reads verified artifacts only; verity re-checks paper against ledger.

### 5. What to migrate into our Competition Workbench?

| Mechanism | Priority | Adaptation |
|-----------|----------|------------|
| Stage gates + STALE propagation | P0 | Map to our `competitions.state_json` stages |
| ReqID problem contract (lite) | P0 | JSON schema in `workspace/<id>/problem/` |
| Baseline / Main / Alternative + multi-seed | P1 | Extend Model Selector + Algorithm Lab stub |
| Claim ledger (lite) | P1 | Link Paper Lab claims to `results/` files |
| Human checkpoint flags | P2 | UI confirm buttons + `ai_ledger` |
| Full 6verity nine-check | P3 | Too heavy for MVP; take rubric items incrementally |
| DSH preset bundle | P3 | After skill contracts stabilize |

---

## chengziyue1222/math-model-agent — Highlights

- **Three profiles:** `rapid` / `competition` / `audit`.
- **8 standard skills** with `agents/openai.yaml` + `scripts/execute_skill.py` contracts.
- **`run-manifest.json` schema:** inputs SHA-256, seeds, git state, artifact hashes — aligns with MathMN.
- **`benchmarks/`:** 12 CUMCM cases, external-reference-only, 4 hard gates + 100-point rubric.
- **Algorithm library:** 9 categories, 25 Python modules — see `MODEL_COVERAGE.md`.

---

## Barson0588/math-modeling-assistant — IA Takeaway

Six tabs: **Generator | Paper | Models | Problems | Guide | Roles**.

**Our gap:** no **Problems / 真题中心**. Recommendation: add secondary module under Competition or Atlas — “Problem Library” with metadata + link to Gym/Workbench, not a new top-level chat generator.

---

## zhanwen/MathModel — Resource Pattern

Content organized by **year × (试题 | 论文 | 模板 | 算法)**. Not code.

**Design:** `Resource Registry` / `Case Registry` with external links + distilled fields (problem type, decomposition, transferable lessons) — same spirit as prompt Section 28 Case Registry.

---

## MCM-AI-Starter-Kit

- `Rules/font_standard.md` — Times New Roman, 22pt, inward ticks.
- `Viz_Templates/` — Nature-style 3D, radar, etc.
- `Tools/extract_pdf.py` — PDF → text for problem reader.

**Use:** Paper Lab figure rules + Visualization Lab templates; Problem Reader PDF ingest.

---

## jihe520/MathModelAgent & xwangshuo/math-model-agent

| Aspect | jihe520 | xwangshuo |
|--------|---------|-----------|
| Architecture | FastAPI + Vue, multi-agent | Gradio monolith |
| Code exec | Local Jupyter / E2B cloud | subprocess 30s timeout |
| Focus | End-to-end paper | Q&A + recommend + code |
| Reuse for us | HIL decision types, task_id workspace | Sandbox pattern for Algorithm Lab |

---

## Benchmark Conclusion

**Phase 2 should integrate patterns, not pages:**

1. **Integrity & evidence** from MathMN (lite gates + ledger).
2. **Algorithm execution** by depending on or wrapping chengziyue1222's library — not reimplementing TOPSIS/GA/etc.
3. **Problem & case registry** inspired by Barson + zhanwen + chengziyue benchmarks.
4. **Figure/paper standards** from MCM kit + MathMN figure-templates.
5. **Keep our learning-first UX** — this is our differentiator vs all competition-centric repos.

See sibling files for matrices and integration decisions.
