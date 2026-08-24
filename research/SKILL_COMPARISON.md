# Skill Comparison

How benchmark projects structure AI Skills / Agents vs our `skills/` contracts.

---

## Architecture overview

```text
OURS (MVP)
  AiDock → POST /api/ai/chat → route_skill() → offline_ai | LLM
  skills/*.md = policy docs (partially duplicated in Python)

MathMN
  $1start-mathmodel → numbered skills → reports/*.json gates → scripts/*.py verify
  _references/modeling_integrity.md = shared law

chengziyue1222/math-model-agent
  $run-modeling-project → 7 task skills → scripts/execute_skill.py + schemas
  legacy/56 commands archived

jihe520/MathModelAgent
  ModelerAgent → CoderAgent → WriterAgent (sequential multi-agent)

Barson math-modeling-assistant
  Monolithic prompts in src/prompts.py (no skill files)
```

---

## Skill inventory matrix

| Skill / Agent role | Ours | MathMN | czy math-model-agent | MathModelAgent | Barson |
|--------------------|------|--------|----------------------|----------------|--------|
| Router / orchestrator | `00-router` | `1start`, `mathmodel-orchestrator` | `run-modeling-project` | task orchestration | app routes |
| Tutor / teach | `01-tutor` | (embedded in stages) | — | — | Guide tab |
| Problem reader | — | `1start` manifest | in analyze-data | ModelerAgent | Generator input |
| Modeling coach | `11-modeling-coach` | human-supervised Q&A | select-model (partial) | ModelerAgent | — |
| Literature research | — | `mathmodel-literature-research` | `research-model-literature` | RAG plugin | — |
| Analysis + contract | — | `2analysis-modeling` | analyze + select | ModelerAgent | Generator |
| Data doctor | `12-data-doctor` | in analysis | `analyze-model-data` | — | — |
| Feature engineering | `13-feature-engineering` | in reports | in modeling_contracts | — | — |
| Model selector | `20-model-selector` | `mathmodel-algorithm-lab` selector | `select-model` | ModelerAgent | Models tab |
| Algorithm lab / solve | — | `mathmodel-algorithm-lab` | `solve-model` | CoderAgent | code gen |
| Visualization | — | `3coding-visual`, `mathmodel-figure-templates` | `make-model-figures` | CoderAgent | — |
| Drawio / diagrams | — | `4drawio` | `diagram.py` | — | — |
| Paper writer | — | `5writing` | `write-model-paper` | WriterAgent | Generator/Paper |
| Paper reviewer | `41-paper-reviewer` | `mathmodel-review-polish` | `review-model-paper` | — | dedup/citation |
| Final verify | — | `6verity` | in review + paper_check | — | — |
| Gap analyzer | `42-gap-analyzer` | `7benchmark-mathmodel` | learning-reports | — | — |
| Learning record | SQLite mastery | — | — | — | — |
| Daily review | SRS API | — | — | — | — |
| Spatial | — | `mathmodel-spatial` | — | — | — |
| Doctor / env check | — | `doctor` | — | — | — |

---

## Skill contract quality comparison

| Criterion | Ours | MathMN | czy |
|-----------|------|--------|-----|
| Purpose / Trigger / I/O | ⚠️ partial MD | ✅ full SKILL.md | ✅ + JSON schema |
| Forbidden behavior | ✅ in MD | ✅ explicit | ✅ in SKILL + guards |
| Validation scripts | ❌ | ✅ per skill | ✅ execute_skill + pytest |
| Machine-readable handoff | ❌ | ✅ JSON reports | ✅ run-manifest |
| Human checkpoint | ❌ | ✅ HUMAN_REVIEW.json | ⚠️ audit profile |
| Offline deterministic fallback | ✅ | ⚠️ needs Python/MATLAB | ⚠️ needs pip install |
| DSH/Codex install story | ❌ | ✅ preset + setup-codex | ✅ install_skills.py |

---

## Handoff pattern comparison

### MathMN (strongest for Competition)

```text
PROBLEM_MANIFEST (hash) → PROBLEM_CONTRACT (FROZEN)
  → ANALYSIS_MODELING_REPORT → ALGORITHM_CANDIDATES
  → code/results (run_manifest) → claim_ledger
  → paper → VERIFY_REPORT
```

**STALE rule:** upstream hash change invalidates downstream without re-run.

### chengziyue1222 (strongest for engineering)

```text
run-manifest.json ← every skill execution
  inputs: file SHA-256, seeds, git, deps
  outputs: artifact hashes
skill_contracts registry → execute_skill.py preflight
```

### Ours (strongest for learning)

```text
Quiz → mastery (SQLite) → daily_review priority
  ↔ profile bridge_tips ↔ atlas lesson
Competition state_json (stages) — no hash chain yet
```

**Gap:** learning state and competition artifacts are not yet linked via evidence IDs.

---

## MathMN — five questions (Skill-focused)

| Question | Answer |
|----------|--------|
| Skill organization | Numbered pipeline + satellites; shared `_references`; each skill has scripts + tests |
| Handoff | JSON in `reports/` + `HANDOFF.md`; hash-gated |
| Anti-fabrication | claim_ledger + integrity_check + human checkpoints + UNVERIFIED cap |
| Paper numbers traceable | claim_ledger ↔ result files ↔ run_manifest; 6verity ReqID gate |
| Migrate to Competition | Stage gates, contract lite, algorithm candidates, aggregate experiments |

---

## Recommended skill merge map (Phase 2+)

| Our skill | Absorb from | Action |
|-----------|-------------|--------|
| `00-router` | MathMN `1start`, czy `run-modeling-project` | Add stage-aware routing table |
| `01-tutor` | — | Keep; enrich from registry |
| `11-modeling-coach` | MathMN `2analysis` ReqID questions | Add ReqID checklist output |
| `12-data-doctor` | czy `data_diagnostics.py` | Call library; keep “why not mean fill” policy |
| `13-feature-engineering` | czy modeling_contracts | Feature Card schema align |
| `20-model-selector` | MathMN algorithm-lab selector JSON | Same B/M/A + candidate file |
| **NEW** `21-algorithm-lab` | MathMN lab + czy solve-model | Multi-seed runner adapter |
| **NEW** `30-visualization` | MCM kit + czy sci_figures + MathMN templates | Figure caption skill |
| `40-paper-writer` | czy write-model-paper | Evidence-only writes |
| `41-paper-reviewer` | MathMN 6verity lite + czy paper_check | ReqID + ledger checks |
| `42-gap-analyzer` | czy benchmarks learning-reports | Link to Daily/Gym |
| **NEW** `10-problem-reader` | MCM PDF extract + MathMN manifest | PDF → contract draft |

---

## Skill anti-patterns observed

| Pattern | Where | Our stance |
|---------|-------|------------|
| Giant monolithic prompt | Barson Generator | Split into contracted skills |
| Agent self-approval | weak agents | Never; use ai_ledger + human flag |
| Skill = “you are expert” | many forks | Keep forbidden lists + validation |
| 56 legacy commands | czy legacy/ | Single entry: run-modeling-project |
| Skills without tests | Barson, xwangshuo | Every new skill needs pytest or script gate |

---

## DSH integration note

| Repo | DSH story |
|------|-----------|
| MathMN | `dsh/preset-mathmodel/` manual copy; plugin bundle pending |
| czy | Codex `$skill` via `install_skills.py` |
| Ours | Independent FastAPI; skills are documentation + router hints |

**Phase 2 decision:** stabilize skill contracts in repo first; optional DSH bundle mirrors MathMN preset pattern later (see INTEGRATION_DECISIONS.md).
