# MathModel Harness — Overnight Full Product MVP Autonomous Plan

**Date:** 2026-08-26  
**Branch:** `experiment/mathmodel-harness`  
**Execution style:** autonomous long-running development + live testing + review + regression + checkpoint commits  
**Primary product:** dedicated DeepSeek Harness `mathmodel` profile  
**Normal DSH:** `web` profile must remain stock and usable

---

# 0. Tonight's Goal

Turn the current **Architecture MVP + Product Shell MVP + Learning P1** into a coherent **MathModel Product MVP**.

The target is not “add as many pages and algorithms as possible”. The target is one complete, evidence-backed product loop:

```text
Learn
→ Practice
→ Solve
→ Review
→ Diagnose
→ Retrain
→ Learn
```

A target user should be able to:

```text
open MathModel Harness
→ continue a lesson
→ ask contextual Tutor questions
→ take a Quiz and update mastery
→ receive Daily Review
→ practice one Modeling Gym case
→ open/import a competition problem
→ create a Problem Contract
→ run Data Doctor
→ create Feature Cards
→ compare Baseline / Main / Alternative models
→ execute at least one real algorithm experiment
→ inspect validation / figures / evidence
→ draft/review a paper section
→ receive Reviewer findings
→ see Gap Analysis update Modeling Profile
→ have weak knowledge units enter future Daily Review
```

This is the overnight definition of **Product MVP**.

Do not claim “complete product” if the loop above cannot run end-to-end.

---

# 1. Current Architecture — DO NOT REOPEN

Keep these decisions stable:

```text
DeepSeek Harness installation
│
├── profile: web
│     └── normal DSH, untouched
│
└── profile: mathmodel
      ├── @deepseek-ai/dsh-base
      ├── @deepseek-ai/dsh-web-app
      └── @math-modeling/mathmodel-suite
            ├── mathmodel-shell
            ├── dsh-mathmodeling
            ├── modeling skills
            ├── modeling tools
            └── domain / registry providers
```

Keep native DSH Agent, Session, Tool pipeline, model providers, approvals, dedicated `mathmodel` profile, single MathModel sidebar, dominant center Workbench and narrow/native right Agent surface.

Do not return to ordinary-web-profile embedding, build a second chat backend, fork DSH Core, merge to `master`, or reintroduce duplicate sidebar/details columns.

---

# 2. Existing GitHub Research Is Authoritative — Reuse It

Read first:

```text
PRODUCT_PRD.md
ARCHITECTURE.md
MATHMODEL_PROFILE_PHASE3_PLAN.md
PHASE3_FINAL_REPORT.md
REVIEW/PRODUCT_UI_REVIEW.md
research/GITHUB_BENCHMARK.md
research/SKILL_COMPARISON.md
research/MODEL_COVERAGE.md
research/RESOURCE_COMPARISON.md
research/INTEGRATION_DECISIONS.md
research/MATHMODEL_DSH_COMPATIBILITY.md
THIRD_PARTY.md
```

Do not redo broad GitHub research from zero.

## Source policy

### `chengziyue1222/math-model-agent` — EXECUTION SOURCE

Primary use: algorithm implementations, skill-engineering patterns, run manifest, reproducibility, benchmark metadata/rubrics.

Verified candidate at plan-writing time:

```text
Repo: https://github.com/chengziyue1222/math-model-agent
License: MIT
Candidate pin: 33cb044009d2dc12e7fa86e4ded6138ddb790d9a
```

Before first integration re-check the commit and update:

```text
THIRD_PARTY.md
packages/dsh-mathmodeling/THIRD_PARTY_NOTICES.md
research/UPSTREAM_SOURCE_LOCK.md
```

All execution goes through our `AlgorithmProvider`. No UI/routes may import upstream internals directly.

### `ShuoSachiko/MathMN` — PATTERN SOURCE ONLY

Use concepts: Problem Contract/ReqID, stage gates, STALE propagation, run manifest ideas, claim ledger, human checkpoints, multi-seed aggregation, verification mindset.

License is PolyForm Noncommercial. Therefore:

```text
DO NOT COPY MathMN CODE OR ASSETS INTO PRODUCT.
```

Reimplement ideas independently from our own spec/tests.

### `Barson0588/math-modeling-assistant`

Use Problems IA, model-catalog organization, Guide/Role ideas. Do not adopt Generator-first UX.

### `zhanwen/MathModel`

Use as excellent-paper/past-problem/template discovery source. Do not vendor the repo or mass-copy PDFs.

Build:

```text
Resource Registry = external source metadata
Case Registry = our own distilled educational analysis
```

### `Gunp-666/MCM-AI-Starter-Kit`

Use verified/compatible figure standards, output conventions, writing rules and PDF-ingest patterns.

Other benchmark repos are secondary only unless they solve an active blocker.

---

# 3. Overnight Autonomous Protocol

Run continuously:

```text
Inspect
→ Implement
→ Build
→ Unit Test
→ Start mathmodel profile
→ Live E2E Test
→ Screenshot / Artifact Review
→ Architecture Review
→ Product Review
→ Fix
→ Regression
→ Commit
→ Push
→ Continue
```

Do not stop after compilation, one unit test, one screenshot, placeholders, reports, or one Agent answer.

Stop only when exit gates are evaluated or a genuine external blocker prevents all independent work.

If one task blocks, record it and continue other tasks.

Do not ask the user for ordinary implementation decisions. Ask only for unavailable credentials, destructive actions outside repo/mathmodel profile, ambiguous third-party redistribution, or irreversible publish/merge actions.

---

# 4. P0 — Correct Current Gate and Architecture Debt

## P0.1 One authoritative PRODUCT_UI_GATE

Unify Plan/test/report naming:

```text
U1 Single Shell / Single Sidebar
U2 Workbench Dominance
U3 IA Alignment
U4 No Duplicate Product Surfaces
U5 Agent Context UX
U6 Atlas + Dashboard Product Quality
U7 Responsive / Visual Consistency
```

Update:

```text
MATHMODEL_PROFILE_PHASE3_PLAN.md
scripts/product-ui-gate.mjs
REVIEW/PRODUCT_UI_REVIEW.md
PHASE3_FINAL_REPORT.md
```

`U5` must test a real context-aware Tutor flow, not only presence of an Agent column.

Example:

```text
set ModelingContext(model_id=kmeans, knowledge_unit=feature-scaling)
→ send /modeling-tutor 为什么这里需要标准化？
→ assert reply references K-Means / distance-scale context
```

## P0.2 Session / Project Switcher

Add MathModel-specific session/project management without restoring full DSH sidebar.

Target header:

```text
数模 Agent
[当前：项目 / 会话名称 ▾]   [+ 新会话]
context: K-Means · Feature Scaling
```

Minimum: show current session/project, create new modeling session, list recent modeling sessions, switch session, preserve session-scoped ModelingContext, test no leakage.

Reuse DSH session services; no second session store.

## P0.3 Thin Shell boundary

Refactor safely toward:

```text
mathmodel-shell
  layout
  nav
  agent-frame
  surface-router
  responsive/theme

packages/ui or feature packages
  dashboard
  atlas
  lesson
  daily-review
  gym
  competition
  paper
  profile
```

Shell decides where a surface renders, not all product logic.

## P0.4 Runtime mode

Prefer explicit `mode = dedicated | compatibility` over a fragile `window.__MM_SHELL_HOST__` ordering flag.

If replacing it tonight risks regression, isolate/document/test it instead of forcing a rewrite.

---

# 5. P1 — Registry + Learning State

## Registry schema

Add explicit model metadata:

```yaml
id:
name:
name_zh:
task:
family:
difficulty:
prerequisites:
knowledge_units:
use_when:
avoid_when:
comparisons:
execution_provider:
```

Migrate current 13 models and stop using regex as source of truth.

## Mastery GET API

Add:

```text
GET /api/mathmodeling/mastery
GET /api/mathmodeling/mastery/:modelId
```

Quiz writes must appear after refresh. “未测验” remains honest when absent.

## Knowledge-unit mapping

Support:

```text
model → knowledge_units
mistake → knowledge_unit
review finding → knowledge_unit
gym feedback → knowledge_unit
```

This feeds Daily Review.

---

# 6. P2 — Full Modeling Skill Set

Implement contracted skills:

```text
00-router
01-tutor
10-problem-reader
11-modeling-coach
12-data-doctor
13-feature-engineering
20-model-selector
21-algorithm-lab
30-visualization
40-paper-writer
41-paper-reviewer
42-gap-analyzer
```

Optional after core passes:

```text
50-literature-research
60-spatial-modeling
```

Every Skill must declare:

```text
Purpose
Trigger
Inputs
Outputs
Allowed tools
Forbidden behavior
Evidence requirements
Failure behavior
Handoff artifact
Tests
```

Rules:

- Problem Reader never invents missing data.
- Coach asks before giving complete solutions.
- Data Doctor checks leakage, temporal/spatial order and missingness before recommending transforms.
- Feature Engineering outputs Feature Cards: formula, meaning, reason, risk, leakage risk, validation.
- Model Selector always returns Baseline/Main/Alternative with assumptions and validation.
- Algorithm Lab executes via provider only and never invents metrics.
- Paper Writer uses evidence-backed artifacts only.
- Reviewer checks contracts/validation/evidence.
- Gap Analyzer maps findings to knowledge units/training.

Avoid duplicated Skill text. If DSH requires mirrored copies, create a sync/build step and equality test.

---

# 7. P3 — AlgorithmProvider: Reuse Existing GitHub Algorithms

Create `research/UPSTREAM_SOURCE_LOCK.md` with repo, commit, license, role, copy/reference status and update procedure.

Update `THIRD_PARTY.md` from TBD to verified MIT pin for chengziyue.

Business code depends only on:

```ts
interface AlgorithmProvider {
  id: string
  listAlgorithms(): Promise<AlgorithmDescriptor[]>
  runAlgorithm(input: AlgorithmRunInput): Promise<ExperimentResult>
}
```

Create a real adapter package such as:

```text
packages/algorithm-provider-czy/
```

Inspect upstream packaging/exports/tests before choosing dependency strategy. Prefer a pinned dependency/cache/adapter; do not scatter copied files.

First executable pack:

```text
K-Means
TOPSIS
AHP or Entropy Weight
Linear Regression
ARIMA or GM(1,1)
LP
PSO
```

Stretch:

```text
Random Forest
DBSCAN
MILP
Dijkstra
Monte Carlo
```

Every run records:

```json
{
  "run_id": "...",
  "algorithm": "...",
  "provider": "...",
  "source_version": "...",
  "input_hash": "...",
  "parameters": {},
  "seed": 0,
  "started_at": "...",
  "runtime_ms": 0,
  "metrics": {},
  "objective": null,
  "feasible": null,
  "warnings": [],
  "artifacts": [],
  "output_hashes": {}
}
```

Stochastic algorithms: support multiple seeds and mean/std/median/IQR/failure count. Never report only a lucky best seed as representative.

---

# 8. P4 — Competition Workbench End-to-End

Build real stages:

```text
Problem
→ Decompose
→ Data Doctor
→ Feature Lab
→ Model Selector
→ Algorithm Lab
→ Validation
→ Visualization
→ Paper
→ Reviewer
```

Project model should include:

```text
project_id
session_id
problem_ref
mode
stage
artifacts
findings
learning_links
```

Project survives refresh.

## Problem Contract Lite

Create:

```text
workspace/<project_id>/problem/problem-contract.json
```

Fields:

```text
ReqID
question
objective
inputs
outputs
constraints
assumptions
status
```

Explicit freeze/confirm action. Mark downstream artifacts STALE when upstream inputs change where practical.

## Data Doctor

Use real demo data. Show schema/types, missingness, scale, outliers, temporal/spatial ordering, leakage warnings, recommended actions and risks. No raw JSON as main UI.

## Feature Lab

Student can propose features first. AI suggestions become Feature Cards. Track accepted/rejected/edited.

## Model Selector

Visual:

```text
Baseline | Main | Alternative
```

Each card: fit, assumptions, requirements, risks, validation and current mastery/quick-learn link.

## Algorithm Lab

Connect real Provider execution. Run at least one successful deterministic and one stochastic/parameterized model in live E2E.

## Validation

At minimum: baseline comparison, train/test or CV where appropriate, residual/error checks for prediction, sensitivity for evaluation/optimization, multi-seed for stochastic models.

---

# 9. P5 — Daily Review + Gym + Profile

## Daily Review

Queue sources:

```text
quiz mistakes
low mastery
competition mistakes
reviewer findings
manual weak points
```

Question types:

```text
remember
understand
apply
modeling judgment
find the error
leakage diagnosis
validation choice
feature reasoning
```

No full FSRS required tonight, but persistence and due/recent logic are required.

## Modeling Gym

Implement at least one high-quality case:

```text
problem only
→ student proposal
→ Coach hint
→ submit
→ dimension feedback
→ compare against reference reasoning
→ training recommendations
```

Do not reveal full reference answer first.

## Modeling Profile

Real data for dimensions, model mastery, knowledge-unit mastery, recent mistakes, reviewer weaknesses and completed training.

Learning bridge:

```text
Competition recommends DBSCAN
→ mastery low
→ quick learn / Atlas
→ return to Competition
```

---

# 10. P6 — Problem Library + Excellent Case Library

## Resource Registry

Create:

```text
registry/resources/
```

Fields:

```text
id
type: problem | paper | template | tutorial
title
year
contest
source_url or mirror_repo/path
tags
license_note
distilled
```

Initial target: 5–10 problems.

Use chengziyue benchmark metadata, official pages, Barson IA patterns, zhanwen external paths/links. Do not copy full statements when source policy/license is unclear.

## Case Registry

Create:

```text
registry/cases/
```

Initial target: 3 distilled cases covering:

```text
evaluation/decision
forecasting/data
optimization/routing
```

Each case is OUR distillation:

```text
problem_ref
problem_type
subproblem decomposition
data processing
feature engineering
baseline
main model
alternatives
algorithm
validation
robustness
visualization
paper structure
innovation
strengths
weaknesses
transferable lessons
knowledge_units
gym_drills
```

Do not reproduce full excellent papers.

## Reverse Case Training

Minimal flow:

```text
show problem
→ hide distilled solution
→ user proposes plan
→ compare by dimensions
→ gap analysis
→ training links
```

---

# 11. P7 — Paper Lab + Reviewer + Evidence

Create independently implemented lite evidence files:

```text
workspace/<project_id>/
  problem/problem-contract.json
  experiments/run-manifest.json
  review/claim-ledger.json
```

Minimum chain:

```text
Paper Claim
→ Figure / Table / Result
→ Experiment run_id
→ Algorithm / Provider
→ Dataset input_hash
```

Paper Lab MVP supports abstract outline, problem restatement, assumptions, model formulation, result explanation and limitations. Numeric claims must come from evidence.

Reviewer dimensions:

```text
problem understanding
data handling
feature engineering
model reasonableness
mathematical rigor
algorithm / solution
validation
result interpretation
innovation
visualization
writing
reproducibility
```

Reviewer is a training rubric, not official contest scoring. Findings map to evidence/missing evidence, then to Gap Analyzer, Profile and Daily Review.

---

# 12. P8 — Visualization

MVP reusable path:

- clustering/scatter
- actual-vs-predicted
- optimization convergence
- clean caption/export metadata

Every figure records:

```text
figure_id
run_id
data source
caption
output path
```

Do not spend the night making dozens of decorative templates.

---

# 13. P9 — Product UI Rules

Keep:

```text
232px | flexible Workbench | 400px Agent
```

Narrow widths may use Agent drawer and collapsible nav.

Avoid raw JSON as main UX, developer migration labels, blank placeholders for “implemented” modules, duplicate Agent navigation and generic unstructured card walls.

Dashboard should reflect real state: continue lesson, review due, continue project, weak points.

---

# 14. P10 — Tests Are Product Work

Unit tests for mastery, Daily Review, registry schema, skill routing, Feature Cards, B/M/A selector, manifest, claim ledger and Gap mapping.

Provider tests for known fixture, valid output, invalid input, timeout/failure, manifest creation and “no fabricated success on failure”.

Skill tests: happy path + forbidden/failure path. Examples:

```text
Paper Writer must not invent missing metric
Data Doctor must flag target leakage
Model Selector must include Baseline
Algorithm Lab must not report metrics on execution failure
```

Session tests:

```text
Session A context != Session B context
project switch does not leak context
refresh persists state
new session clean where expected
```

Profile isolation regression:

```text
web = stock DSH
mathmodel = product
```

Product E2E:

```text
Dashboard
→ Atlas
→ K-Means
→ Tutor
→ Quiz
→ Daily Review
→ Gym
→ Competition
→ Data Doctor
→ Model Selector
→ Algorithm Run
→ Reviewer
→ Profile
```

Visual screenshots and actual inspection at:

```text
1920x1080
1680x900
1440x900
1024x768
```

Capture Dashboard, Atlas, Lesson, Daily Review, Gym, Competition, Algorithm Lab, Reviewer and Profile.

---

# 15. P11 — GitHub Actions / CI

Add deterministic CI without private model credentials:

```text
lint/typecheck
core/unit tests
bundle/package tests
registry/schema validation
skill contract tests
provider fixture tests without network
static profile composition tests where possible
```

Live browser E2E may remain a local release gate if GitHub Actions environment is unreliable. Document honestly.

---

# 16. P12 — Docs / Demo

Update/create:

```text
README.md
DEMO.md
PRODUCT.md
ARCHITECTURE.md
THIRD_PARTY.md
research/UPSTREAM_SOURCE_LOCK.md
OVERNIGHT_PROGRESS.md
OVERNIGHT_FINAL_REPORT.md
```

Start flow:

```powershell
scripts/mathmodel-profile-init.ps1
scripts/mathmodel-profile-verify.ps1
scripts/mathmodel-start.ps1
```

Document Windows-first limitations honestly.

---

# 17. Priority If Time Is Limited

## MUST P0
Gate definitions aligned; session/project switcher; web regression; architecture tests.

## MUST P1
Registry task/family; mastery GET; Daily Review real data; Profile real data.

## MUST P2
Core Skills; Competition basic workflow; Data Doctor; Feature Cards; Baseline/Main/Alternative.

## MUST P3
At least one real AlgorithmProvider execution; run manifest; no fabricated results.

## MUST P4
Reviewer → Gap → Profile → Daily Review loop.

## SHOULD
5–10 problem metadata; 3 distilled cases; reverse training; claim ledger; visualization records.

## STRETCH
More algorithms/cases/lessons; spatial/literature; cross-platform installer polish.

Never sacrifice correctness/evidence tests for Stretch.

---

# 18. Git Discipline

Stay on:

```text
experiment/mathmodel-harness
```

Do not merge master.

No `git reset --hard`, `git clean -fdx`, or force push.

Use small checkpoint commits and push continuously. Do not leave hours of work only in working tree.

Suggested commits:

```text
fix: align product ui gate definitions
feat: add mathmodel session switcher
refactor: extract product surfaces from shell
feat: add model metadata and mastery query
feat: add daily review and modeling profile loop
feat: add contracted modeling skills
feat: add pinned czy algorithm provider
feat: build competition workbench vertical slice
feat: add problem and case registries
feat: add evidence reviewer and gap feedback
ci: add deterministic product checks
test: pass overnight product mvp regression
```

---

# 19. Exit Gates

At end report exact PASS/FAIL/PARTIAL.

## G0 Architecture
web stock; mathmodel profile; native Agent; Session persistence.

## G1 Product Shell
single sidebar; workbench dominance; Agent usable; session/project switcher; responsive.

## G2 Learning
Atlas metadata; K-Means; Tutor; Quiz→mastery; Daily Review; Gym; Profile.

## G3 Competition
project persistence; Problem Contract; Data Doctor; Feature Cards; B/M/A; algorithm execution; validation.

## G4 Evidence/Paper
run manifest; claim/evidence link; Reviewer; Gap Analyzer; anti-fabrication test.

## G5 Resources
Problem Registry >=5; Case Registry >=3; external-link/license policy respected.

## G6 Testing
unit; skill; provider; session/context; profile isolation; product E2E; four-viewport visual review.

## G7 Repo Health
clean/documented tree; stable commits pushed; CI reported; README/DEMO/docs updated.

---

# 20. Final Report Required

Create `OVERNIGHT_FINAL_REPORT.md`:

```text
Start commit:
End commit:
Commits pushed:

Architecture: PASS/FAIL
Product Shell: PASS/FAIL
Learning Loop: PASS/FAIL
Competition Loop: PASS/FAIL
Algorithm Execution: PASS/FAIL
Reviewer/Evidence: PASS/FAIL
Problem/Case Library: PASS/FAIL
Tests: PASS/FAIL
CI: PASS/FAIL/PARTIAL
Public Distribution: PASS/FAIL/PARTIAL

Implemented tonight:
...

Upstream code actually integrated:
repo / commit / license / exact role

Reference-only sources used:
...

Known blockers:
...

Critical issues: N
Demo-blocking High issues: N

Screenshots/artifacts inspected:
...

Next 5 highest-value tasks:
...
```

A placeholder does not count as implementation.

---

# 21. Final Product Test Scenario

Before `PRODUCT_MVP = PASS`, live-test:

```text
1. Dashboard.
2. Open K-Means lesson.
3. Set feature-scaling context.
4. Ask Tutor why standardization matters.
5. Submit Quiz; verify mastery changes after refresh.
6. Daily Review reflects learning state.
7. Submit one Gym modeling proposal; receive feedback.
8. Create/open one competition project.
9. Decompose problem into contract.
10. Run Data Doctor on fixture CSV.
11. Accept/edit one Feature Card.
12. Select Baseline/Main/Alternative.
13. Execute a real provider algorithm.
14. Inspect run manifest.
15. Run validation and produce one figure/artifact.
16. Run Reviewer on evidence-backed content.
17. Gap Analyzer creates weak knowledge units.
18. Profile shows weaknesses.
19. At least one weakness enters Daily Review.
20. Refresh; project/session persists.
21. Open normal web DSH; verify stock/unaffected.
```

Only then:

```text
PRODUCT_MVP = PASS
```

---

# 22. Start Now

```text
git status
git rev-parse HEAD
git pull --ff-only
read authoritative docs
verify mathmodel + web profiles
fix P0 debt
then P1 → P12
```

Build the closed loop first, then expand.
