# MathModel Harness — Product Depth Rebuild Plan

> **Status:** Authoritative implementation plan for the next product phase  
> **Target repo:** `John030427/math-modeling-workbench`  
> **Target branch:** `experiment/mathmodel-harness`  
> **Goal:** Stop expanding a shallow demo. Turn the existing DSH-based shell into a **deep, real, reusable mathematical-modeling workbench** by integrating mature GitHub algorithms, skills, competition resources, excellent papers, learning loops, evidence-backed competition workflows, and AI research capabilities.

---

# 0. Why This Plan Exists

The current product has a useful shell and some correct architectural decisions, but it is still too close to:

```text
many product pages
+ a few demo algorithms
+ a few seed resources
+ some prompt-like skills
```

The intended product is:

```text
a persistent modeling workspace
+ a deep knowledge/method system
+ real executable tools
+ real competition resources
+ real excellent-paper cases
+ an AI agent that can work through the whole modeling lifecycle
+ a learning system that remembers weaknesses and retrains them
```

The previous implementation over-optimized for:

- architecture stability;
- UI gates;
- one vertical slice;
- minimal placeholder-safe MVP.

This phase deliberately changes the priority:

> **Architecture is now frozen enough. 70–80% of effort must go into capability depth, resource depth, executable algorithms, learning content, and real end-to-end workflows.**

Do not start another shell redesign unless a concrete blocker proves the current shell impossible.

---

# 1. Non-Negotiable Product Definition

## 1.1 Product statement

**MathModel Harness** is a DSH-based mathematical-modeling learning + competition workspace.

It must help a student:

```text
Learn a method
→ understand when/why to use it
→ practice it
→ solve a real modeling problem
→ search prior literature / methods
→ inspect data
→ engineer features
→ compare models
→ execute real algorithms
→ validate results
→ create figures
→ write and review a paper
→ identify weaknesses
→ return those weaknesses to future learning
```

Core closed loop:

```text
Learn
→ Practice
→ Solve
→ Research
→ Validate
→ Review
→ Diagnose
→ Retrain
→ Learn
```

## 1.2 The product is NOT

- a generic AI chat with some buttons;
- a list of algorithm names;
- a static resources directory;
- a “generate full paper” machine;
- a collection of cards with mock data;
- a second chat system beside DSH;
- a replacement for the normal DSH `web` profile.

---

# 2. Freeze Existing Architecture

Keep the dedicated DSH profile architecture:

```text
dsh --profile web
    → stock / normal DSH

dsh --profile mathmodel
    → MathModel Harness
        ├── MathModel Shell
        ├── native DSH Agent
        ├── native DSH Session
        ├── native DSH Tools
        ├── native model providers
        └── mathmodel domain packages
```

Keep:

- one MathModel navigation;
- dominant Workbench center;
- native DSH Agent on the right / responsive drawer;
- DSH session and model infrastructure;
- project/session persistence;
- profile isolation.

Do not:

- create another chat backend;
- re-add full official DSH sidebar inside MathModel;
- fork DSH Core;
- merge into `master`;
- spend this phase polishing shell spacing while the actual content is thin.

---

# 3. New Definition of “Done”

A module is **not done** because:

- a nav item exists;
- a card exists;
- a mock endpoint exists;
- one example exists;
- the page renders;
- a Markdown prompt exists;
- a test only asserts HTTP 200;
- AI returns plausible text.

A module is done only if it has:

```text
real data / real capability
+ persistence where required
+ DSH Agent integration
+ user interaction
+ failure handling
+ tests
+ at least one real end-to-end scenario
```

## 3.1 Anti-shallow hard gates

Before final PASS, the product must satisfy at least:

```text
Model/Method Atlas:
  >= 50 structured methods/models

Reference-quality lessons:
  >= 10

Executable user-facing algorithms:
  >= 30
  >= 8 method families

Core executable modeling Skills:
  >= 10

Resource Library:
  CUMCM years indexed at scale from real sources
  + MCM/ICM source entries
  + supplemental GitHub/cloud-drive resources

Featured deep Cases:
  >= 5
  including 1 reference-quality flagship case

Competition vertical slices:
  >= 2 real problem types

Paper/Reviewer:
  real evidence chain, not fixed template

Learning loop:
  quiz/mistake/reviewer/gym weaknesses actually feed mastery/profile/review queue
```

If these counts are not reached, report them honestly instead of declaring Product MVP PASS.

---

# 4. GitHub Reuse Strategy — Integration First

Existing GitHub research must now become implementation.

Do not repeat broad GitHub research unless a source is missing.

## 4.1 Algorithm / modeling execution sources

### Primary algorithm source

`chengziyue1222/math-model-agent`

Current upstream capabilities should be re-checked at integration time. As of the current public README it exposes a large algorithm/tool surface across:

- AHP / decision evaluation;
- fuzzy math;
- TOPSIS / entropy / DEA / PCA / RSR;
- grey systems;
- regression;
- interpolation;
- time series;
- metaheuristics;
- mathematical programming;
- graph theory;
- Monte Carlo / queues;
- neural-network methods;
- cellular automata;
- image processing;
- scientific figures;
- diagram generation;
- paper checking.

**Policy:**

```text
Do not reimplement these algorithms from scratch unless:
1. upstream implementation is wrong/incompatible;
2. license blocks use;
3. provider boundary requires a small wrapper.
```

Required work:

1. lock exact upstream commit;
2. verify license;
3. create `UPSTREAM_SOURCE_LOCK.md`;
4. inventory every public user-relevant export;
5. classify it into our model/method taxonomy;
6. wrap via `AlgorithmProvider`;
7. test real execution;
8. expose eligible methods to Atlas and Algorithm Lab.

### Additional skill/workflow references

Review and selectively adapt ideas from:

- `ShuoSachiko/MathMN`
  - problem contract;
  - evidence / claim ledger;
  - STALE propagation;
  - multi-seed / reproducibility;
  - verification workflow.
  - **pattern/reference only where license requires; do not blindly copy.**

- `handsomeZR-netizen/mathmodel-skill`
  - stage-based competition workflow;
  - persistent decision log;
  - harness-agnostic state;
  - user decision points;
  - multi-stage critique.

- `XiaoMaColtAI/math-modeling-skill`
  - modeling skill organization;
  - algorithm resources;
  - coding / writing workflow ideas.

- `Lupynow/math-modeling-skills`
  - end-to-end competition skill structure where useful.

Do not import three overlapping skill systems wholesale. Distill the best behaviors into our DSH-native tools/skills.

---

# 5. P0 — Audit Current Product Before Adding Anything

First run a truth audit of current branch.

Create:

```text
PRODUCT_DEPTH_AUDIT.md
```

For every module:

```text
Dashboard
Atlas
Lesson
Quiz
Daily Review
Gym
Competition
Problem Library
Resource Library
Case Library
Algorithm Lab
Literature Research
Paper Lab
Reviewer
Profile
Agent
Skills
Provider
```

record:

```text
UI exists?
real backend?
real data?
persistence?
DSH context?
tool execution?
tests?
mock/placeholder?
keep/rebuild/delete?
```

Search repository for:

```text
TODO
FIXME
placeholder
mock
fake
demo
sample
hardcoded
offline
static
stub
```

Do not delete useful demo fixtures, but mark fixtures explicitly as fixtures.

## P0 Acceptance

- truth table committed;
- each current feature classified as Real / Partial / Demo / Placeholder;
- no feature is declared complete from docs only.

---

# 6. P1 — Model & Method Atlas: Make It a Real Knowledge System

The current Atlas must become a serious modeling-method map.

## 6.1 Taxonomy

Use:

```text
Task
→ Method Family
→ Method / Algorithm
→ Knowledge Units
```

Top task families should include at least:

1. 综合评价 / 决策
2. 聚类
3. 分类
4. 回归
5. 时间序列 / 预测
6. 优化 / 数学规划
7. 智能优化 / 元启发式
8. 图论 / 网络优化
9. 插值 / 拟合
10. 仿真 / 蒙特卡洛 / 排队
11. 灰色系统
12. 模糊数学
13. 特征降维 / PCA
14. 机器学习
15. 深度学习（核心概念与适用场景，非盲目推荐）
16. 元胞自动机 / 动态系统
17. 空间 / 地理建模
18. 图像类问题（可作为扩展）

## 6.2 Structured Method Schema

Every method/model must have:

```yaml
id:
name:
name_zh:
task:
family:
difficulty:
maturity:
execution_supported:
provider:
prerequisites:
knowledge_units:
canonical_problem:
core_idea:
mathematical_form:
assumptions:
required_data:
important_parameters:
use_when:
avoid_when:
strengths:
weaknesses:
failure_modes:
validation:
sensitivity:
comparisons:
common_competition_uses:
related_cases:
related_papers:
related_gym:
```

## 6.3 Minimum depth

Atlas must contain **>= 50 methods/models** from real sources.

Do not hand-write all 50 from scratch. Import/distill metadata from upstream algorithm/skill/model libraries, then review.

## 6.4 Reference-quality lessons

At least **10** must receive deep lesson pages.

Recommended first pack:

1. K-Means
2. DBSCAN
3. TOPSIS
4. AHP
5. Entropy Weight
6. Linear Regression
7. ARIMA / time-series baseline
8. GM(1,1)
9. Linear / Integer Programming
10. PSO or GA
11. Dijkstra / shortest path
12. Monte Carlo

Each reference lesson:

```text
30-second intuition
real modeling scenario
visual explanation
math formulation
algorithm flow
code / executable example
parameter explanation
use / avoid
baseline comparison
failure cases
validation
mini quiz
real paper/case example
free AI Q&A
```

## 6.5 Contextual Tutor

Clicking any method, formula, parameter, evidence, or case should update ModelingContext:

```text
model_id
knowledge_unit_id
case_id (optional)
project_id (optional)
paper_id (optional)
```

Right DSH Agent must answer using this context.

Do not make “Ask AI” open a separate generic chat.

## P1 Acceptance

```text
>=50 method entries
>=10 deep lessons
no regex-derived task classification
context-aware Tutor verified
Atlas search/filter/task map works
real mastery shown
```

---

# 7. P2 — AlgorithmProvider: Use the Upstream Library at Scale

This is a key correction from previous work.

The goal is not “prove one provider call works”.

The goal is:

> **make the upstream algorithm library genuinely useful inside MathModel Harness.**

## 7.1 Provider boundary

All business code uses:

```text
AlgorithmProvider
```

No random direct imports in UI/routes.

Suggested interface:

```text
list_methods()
describe_method()
validate_input()
run()
run_many()
get_run()
get_artifacts()
```

## 7.2 Upstream inventory

Create machine-readable inventory:

```text
registry/upstream/chengziyue_algorithms.json
```

For every public export record:

```text
module
export name
category
user-facing? yes/no
method_id
dependencies
input type
output type
deterministic?
seed support?
status
test fixture
```

The inventory should include the whole upstream surface, not only 7 cherry-picked algorithms.

## 7.3 User-facing executable target

Expose at least **30 real executable algorithms/methods** across >=8 families.

Suggested first real pack:

### Evaluation
- AHP
- TOPSIS
- entropy weight
- DEA
- PCA / evaluation PCA
- RSR if upstream supports it

### Regression / prediction
- linear regression
- ridge
- Lasso
- Logistic
- moving average
- exponential smoothing
- grey GM(1,1)

### Clustering
- K-Means
- hierarchical clustering
- DBSCAN
- fuzzy C-means if reliable

### Optimization
- LP
- integer programming
- goal programming
- nonlinear programming
- GA
- PSO
- SA
- ACO

### Graph
- Dijkstra
- Floyd
- MST
- max flow
- min-cost flow
- Hungarian matching

### Simulation
- Monte Carlo integration
- Monte Carlo optimization
- queue model(s)
- random walk

### Interpolation
- Lagrange
- Newton
- spline

### ML / other
- selected RF/XGBoost/sklearn runners if already supported cleanly
- selected neural-network methods only if reliable and testable

Do not expose a helper function as a “model” just to inflate counts.

## 7.4 Real execution contract

Every run must produce:

```json
{
  "run_id": "...",
  "method_id": "...",
  "provider": "...",
  "provider_version": "...",
  "upstream_commit": "...",
  "input_hash": "...",
  "config": {},
  "seed": null,
  "status": "success|failed",
  "runtime_ms": 0,
  "metrics": {},
  "warnings": [],
  "artifacts": [],
  "output_hashes": {},
  "error": null
}
```

## 7.5 Multi-seed

For stochastic methods:

```text
seed list
individual runs
mean/std
median/IQR
failure count
best result with explicit label
```

Do not report only a best seed.

## 7.6 Algorithm Lab UX

The Lab should support:

```text
select method
→ load/choose dataset
→ configure inputs
→ run
→ inspect logs
→ metrics
→ artifacts
→ compare runs
→ send run to paper/reviewer
```

It should not be a “Run demo” page.

## P2 Acceptance

```text
>=30 real executable user-facing methods
>=8 families
provider errors surface honestly
run manifest saved
seed / multi-seed tested
upstream commit locked
provider fixtures pass
```

---

# 8. P3 — Skills: Turn Prompt Shells into Executable Modeling Workflows

Core MathModel skills:

```text
00-router
01-tutor
10-problem-reader
11-modeling-coach
12-data-doctor
13-feature-engineering
14-literature-research
20-model-selector
21-algorithm-lab
22-validation
30-visualization
40-paper-writer
41-paper-reviewer
42-gap-analyzer
```

## 8.1 Every Skill contract

Must define:

```text
Purpose
Trigger
Inputs
Outputs
State read/write
Allowed tools
Required evidence
Forbidden behavior
Failure behavior
Handoff artifact
Tests
```

## 8.2 A Skill is not “implemented” if it is only Markdown

Each core Skill must call at least one of:

```text
domain API
provider tool
resource connector
project state
evidence store
review/memory store
```

where appropriate.

Examples:

### Data Doctor

Must actually inspect uploaded/imported data:

- shape;
- types;
- missing values;
- duplicates;
- outliers;
- scale;
- target leakage;
- temporal leakage;
- spatial/group leakage;
- suspicious identifiers.

Output structured findings.

### Model Selector

Must read:

```text
problem contract
data profile
features
constraints
```

and output:

```text
Baseline
Main
Alternative
```

with assumptions and validation plan.

### Paper Reviewer

Must read actual paper/project artifacts and evidence, not return a static rubric.

### Gap Analyzer

Must write real weak knowledge units / training tasks.

## 8.3 Persistent decision state

Borrow the good pattern from stage-based modeling skills:

```text
project decision log
```

Key decisions must be stored, not hidden only in conversation memory.

Example:

```text
selected problem
assumptions
accepted features
rejected features
selected baseline
selected main model
why alternatives rejected
validation choice
AI-assisted decisions
```

## P3 Acceptance

```text
>=10 core skills actually execute tools/state
no core skill accepted as prompt-only
each has tests
decision log persists across sessions
```

---

# 9. P4 — Resource Library: Real Large-Scale Competition Resources

This module is for **finding and opening materials**, not deep analysis.

Product name:

**Resources & Cases Hub**

Tabs:

```text
Resources
Featured Cases
Excellent Papers
Templates / Tools
```

## 9.1 CUMCM primary resource source

Use `yushugulao/CUMCM-Archive` as an important source.

It currently provides a structured archive including:

```text
year
problem
problem statements
excellent papers
manifest
PDF text mirror
```

Do NOT copy the entire multi-GB repository into our repo.

Build connector/index metadata.

Suggested local record:

```yaml
id:
contest:
year:
problem:
resource_type:
title:
source_repo:
source_path:
source_url:
pdf_url:
text_mirror_url:
availability:
license_note:
tags:
```

## 9.2 Source tiers

### Tier A — directly readable / indexable

- GitHub text/Markdown mirrors;
- explicitly open files;
- user-uploaded files.

### Tier B — public PDF source

- show source;
- render through source or user-requested import where permitted;
- preserve copyright/source note.

### Tier C — GitHub resource directory / release

- show structured external link.

### Tier D — Baidu Netdisk / Weiyun / other cloud drive

Use as supplementary resource links.

Display:

```text
source
resource description
cloud drive
extraction code if publicly supplied
last verified date
```

Do not pretend MathModel hosts the file.

## 9.3 Supplemental sources

Index/link where appropriate:

- `zhanwen/MathModel`
  - historical resources;
  - templates;
  - paper/resource cloud-drive links.

- MCM/ICM paper collections such as `dick20/MCM-ICM`
  - use after verifying source/license/link policy.

- official CUMCM / COMAP pages.

## 9.4 Resource UX

Let DSH design the final UI, but requirements:

- academic, clean, high-information-density;
- not a file manager;
- not 100 identical cards;
- filter by contest/year/problem/type/method;
- visible availability status:
  - 在线可读
  - GitHub 可获取
  - PDF
  - 百度网盘补充
  - 仅外链
- original source always visible;
- actions:
  - view source;
  - read;
  - import to project;
  - AI analyze;
  - add to Case Library.

## P4 Acceptance

- real resource records from real sources;
- CUMCM archive indexed at useful scale;
- source links work;
- external cloud-drive supplement supported;
- no bulk binary vendoring;
- no fake resource cards.

---

# 10. P5 — Excellent Papers & Featured Cases: Make Papers Learnable

The Resource Library finds things.

The Case Library teaches from them.

## 10.1 Flagship case

First reference-quality case:

`linggm3/2023_CUMCM_National-First-Prize`

This repository contains:

- CUMCM 2023 A problem;
- first-prize paper;
- code/data;
- figures;
- defense PPT.

Treat it as the **reference implementation of a Case**, not merely a link.

## 10.2 Case schema

Each deep case must contain:

```text
Case Overview
Problem Decomposition
Data / Inputs
Assumptions
Method Map
Method Cards
Mathematical Model
Decision Variables
Objective
Constraints
Algorithms / Solver
Code Mapping
Experiment / Results
Validation
Sensitivity / Robustness
Figures
Paper Structure
Writing Patterns
Innovation
Strengths
Weaknesses
Transferable Lessons
Evidence
Related Atlas Units
Related Gym Drills
```

## 10.3 Evidence

Every extracted claim should have source provenance:

```text
source
paper/README/code
page/section/file
excerpt locator
extracted_at
```

Do not show AI statements as facts without a source location.

## 10.4 Code ↔ Paper mapping

Where the case includes code:

```text
paper method
↔ code file/function
↔ result artifact
↔ figure
```

This is one of the flagship differentiators.

## 10.5 Paper learning UI

Do not reduce an excellent paper to “summary”.

Allow students to inspect:

- how abstract is structured;
- how the problem is restated;
- how assumptions are introduced;
- how formulas are motivated;
- why each figure exists;
- how validation is written;
- what is strong / weak.

## 10.6 Reverse training

Button:

**用这篇论文训练我**

Flow:

```text
hide solution
→ show original problem
→ student proposes:
   - decomposition
   - data plan
   - features
   - models
   - validation
→ AI compares against the case
→ dimension gaps
→ missing knowledge units
→ Gym / Atlas / Daily Review
```

## 10.7 Quantity target

Before final product PASS:

```text
>=5 deep cases
```

Recommended variety:

1. 2023 CUMCM A — optimization / physical modeling — flagship
2. one evaluation/decision paper
3. one prediction/data paper
4. one graph/routing/optimization paper
5. one MCM/ICM O/strong paper

The flagship case must be much deeper than the other four.

## P5 Acceptance

```text
>=5 deep cases
1 reference-quality flagship
real sources
evidence locators
Method Cards
reverse training
Atlas/Gym/Review links
```

---

# 11. P6 — Literature Research: AI Search Before Modeling

This is a new major capability.

It should answer:

> “Before this competition problem was released, how did researchers solve similar problems?”

This is not a generic paper search box.

## 11.1 Entry points

From:

- a competition problem;
- a project;
- a Problem Contract;
- a subproblem;
- a method question.

Button:

**研究相关文献**

## 11.2 Workflow

```text
Problem Intake
→ Problem Decomposition
→ Research Questions
→ Query Expansion
→ Search
→ Candidate Papers
→ Date Cutoff Guard
→ Evidence Reading
→ Literature Synthesis
→ Method Cards
→ Method Comparison
→ Modeling Hypotheses
→ Learning Queue
→ Export to Competition Workbench
```

## 11.3 Date Cutoff

The competition/problem release time is a hard cutoff.

Store:

```text
cutoff_at
cutoff_source
cutoff_mode
```

Any source after cutoff:

```text
Quarantined
```

and excluded from pre-competition synthesis.

Allow separate:

```text
Post-competition Review Mode
```

for comparing later winning solutions.

## 11.4 Research outputs

Not only a list of papers.

Output:

```text
research question
paper timeline
method families
classic baselines
later pre-cutoff improvements
assumptions
data requirements
tradeoffs
validation methods
3–5 modeling hypotheses
learning prerequisites
```

## 11.5 Evidence

Each literature claim stores:

```text
paper id
version/date
DOI/source
abstract/fulltext status
page/section/span when available
extraction timestamp
```

## 11.6 Connector strategy

MVP can start from:

- web search;
- Crossref / OpenAlex / Semantic Scholar metadata where practical;
- arXiv for open preprints;
- user-uploaded PDF;
- public source URLs.

Do not implement brittle unauthorized scraping of Google Scholar / CNKI as the product foundation.

## 11.7 Integration to learning

If literature recommends a method the student does not know:

```text
Method Card
→ Model Atlas
→ mini lesson
→ Daily Review
→ return to Competition
```

## P6 Acceptance

At least one real competition problem demo must:

```text
decompose question
→ search
→ enforce cutoff
→ cite real papers
→ synthesize methods
→ create Method Cards
→ export modeling hypotheses
```

No fabricated citation accepted.

---

# 12. P7 — Modeling Gym: Practice Real Modeling Thinking

Gym should no longer be a single demo exercise.

## 12.1 Drill types

At least:

```text
problem decomposition
data diagnosis
feature engineering
model choice
algorithm choice
validation design
error diagnosis
paper interpretation
excellent-paper reverse training
```

## 12.2 Coach behavior

Default:

```text
student first
→ Coach hints
→ student revises
→ submit
→ feedback
```

Do not reveal full answer at the beginning.

## 12.3 Feedback dimensions

```text
problem understanding
assumptions
data
features
model selection
algorithm
validation
interpretation
communication
```

## 12.4 Case-generated Gym

Excellent Cases should generate drills.

Example:

```text
2023 A flagship
→ “只做问题二建模方案”
→ “比较三种优化策略”
→ “指出论文验证不足”
```

## P7 Acceptance

```text
>=10 drills
>=4 drill types
at least 3 derived from real cases
feedback writes gaps to learning state
```

---

# 13. P8 — Competition Workbench: One Persistent Modeling Project

This is the center of the product.

A user should not feel they are jumping among unrelated pages.

## 13.1 Project lifecycle

```text
Project
├── Problem
├── Research
├── Data
├── Features
├── Models
├── Experiments
├── Validation
├── Figures
├── Paper
├── Review
└── Learning Gaps
```

## 13.2 Problem Reader / Contract

Read/import problem text or PDF.

Generate editable:

```text
Problem Contract
```

with:

```text
ReqID
subproblem
objective
inputs
outputs
constraints
assumptions
unknowns
required deliverables
```

User confirms/fixes before downstream work.

## 13.3 Research

Literature Research attaches to project/subproblem.

## 13.4 Data Doctor

Real diagnostics.

## 13.5 Feature Lab

Feature Card:

```text
name
formula
meaning
reason
source
leakage risk
expected effect
validation
accepted/rejected
```

## 13.6 Model Selector

For each subproblem:

```text
Baseline
Main
Alternative
```

Show:

- why;
- assumptions;
- data fit;
- difficulty;
- mastery;
- validation;
- real executable availability.

## 13.7 Algorithm Lab

Run real Provider algorithms.

## 13.8 Validation

Validation should depend on task:

### prediction
- holdout / CV;
- error metrics;
- residuals;
- leakage checks.

### optimization
- feasibility;
- baseline;
- sensitivity;
- convergence;
- multi-seed.

### evaluation
- weight sensitivity;
- rank stability;
- alternative methods.

### clustering
- internal metrics;
- stability;
- domain interpretation.

## 13.9 Visualization

Figures are generated from real data/run artifacts.

Save:

```text
figure_id
run_id
data source
config
caption
path
```

## 13.10 Persistence

Refresh, session switch, or app restart must not destroy project state.

## P8 Acceptance

At least **2 real end-to-end project fixtures**, from different problem families, must pass:

```text
problem
→ contract
→ data
→ features
→ B/M/A
→ execution
→ validation
→ figure
→ review
```

---

# 14. P9 — Paper Lab, Evidence, Reviewer

## 14.1 Evidence chain

Every meaningful result should be traceable:

```text
claim
→ figure/table/result
→ run_id
→ method/provider
→ dataset hash
```

Maintain:

```text
run-manifest
claim-ledger
decision-log
```

## 14.2 Paper Writer

Can help:

- structure;
- paragraph logic;
- formula explanation;
- caption;
- abstract;
- rewrite.

Cannot invent missing metrics.

If a result does not exist:

```text
mark unresolved
```

## 14.3 Reviewer

Reviewer dimensions:

```text
problem understanding
data
features
model reasonableness
math rigor
algorithm
validation
interpretation
innovation
visualization
writing
reproducibility
evidence integrity
```

Reviewer findings must be concrete:

```text
finding
severity
evidence
why it matters
suggested fix
knowledge unit
```

## 14.4 Gap feedback

Reviewer:

```text
finding
→ Gap Analyzer
→ Profile
→ Daily Review
→ Gym
```

## P9 Acceptance

- paper claim fabrication test;
- real run evidence referenced;
- reviewer reads real project artifacts;
- reviewer gaps reappear in learning state.

---

# 15. P10 — Learning State: Make the Closed Loop Real

One learning state, not separate module-local fake state.

## 15.1 Entities

Suggested:

```text
KnowledgeUnit
Mastery
Attempt
Mistake
ReviewItem
GymAttempt
ReviewerFinding
CaseTrainingResult
ProjectGap
```

## 15.2 Mastery inputs

Mastery may be updated by:

```text
quiz
daily review
gym
competition
case reverse training
reviewer findings
manual confidence
```

Use transparent rules.

## 15.3 Daily Review

Queue priority:

```text
due items
recent mistakes
low mastery
reviewer gaps
competition gaps
case-training gaps
```

## 15.4 Modeling Profile

Show:

```text
task-family strength
method mastery
knowledge-unit mastery
recent mistakes
competition gaps
reviewer gaps
training history
```

Avoid arbitrary radar-chart numbers with no underlying evidence.

## P10 Acceptance

Live chain:

```text
Reviewer finding
→ knowledge unit gap
→ Profile changes
→ Daily Review queue changes
→ correct review improves mastery
```

must be tested.

---

# 16. P11 — Dashboard: Real Work, Not Marketing Cards

Dashboard answers:

```text
What should I continue?
What am I weak at?
What project am I solving?
What should I review today?
What new case/resource might help?
```

Use real state:

- current project;
- recent session;
- due review count;
- weak knowledge units;
- current lesson;
- active research;
- featured case.

No fake “70% progress” values.

---

# 17. P12 — UI/UX Rebuild Rules

DSH can design the UI itself.

Do not prescribe every pixel.

But require:

## 17.1 Overall

- academic / technical;
- high information density;
- calm;
- strong hierarchy;
- not SaaS marketing style;
- not a card wall;
- not a file manager.

## 17.2 Workbench-first

Prefer UI patterns:

- split pane;
- document reader;
- timeline;
- tree;
- graph/map;
- comparison matrix;
- evidence side panel;
- staged workbench;
- progressive disclosure.

## 17.3 Resources & Cases

Featured Cases can be visually rich.

Resource Library should be browse/search oriented.

Case reader can use:

```text
navigation / outline
+ main analysis/read pane
+ evidence/agent context
```

but adapt it to current DSH shell.

## 17.4 Self-review

For major surfaces:

```text
design
→ implement
→ live screenshot
→ product UX review
→ fix
```

At least 3 review rounds for:

- Atlas;
- Resources & Cases;
- flagship Case;
- Competition;
- Algorithm Lab.

---

# 18. P13 — Testing: Prove Depth, Not Only Rendering

## 18.1 Unit

- registry validation;
- mastery;
- review queue;
- project state;
- method cards;
- evidence;
- cutoff;
- provider.

## 18.2 Provider

For every exposed executable method:

```text
known fixture
invalid input
successful result
failure path
manifest
```

At least representative family coverage in CI; full provider suite locally/release.

## 18.3 Skill tests

Every core Skill:

- happy path;
- forbidden/failure path;
- state/evidence output.

## 18.4 Resource tests

- source records validate;
- links formatted;
- no fake source;
- external availability state works.

## 18.5 Case tests

- evidence locators valid;
- Method Cards linked;
- reverse training works.

## 18.6 Learning loop E2E

```text
lesson
→ quiz
→ mastery
→ review
```

and:

```text
reviewer gap
→ profile
→ review queue
```

## 18.7 Competition E2E

Two fixture projects.

## 18.8 Profile isolation

Always verify:

```text
web profile unaffected
mathmodel profile works
```

## 18.9 Anti-shallow script

Create a release gate that reports:

```text
method registry count
deep lesson count
executable method count
skill executable count
resource count
case count
deep case count
gym count
placeholder/mock hits
```

No final PASS without this report.

---

# 19. Development Order

Do not implement in random page order.

## Stage 0 — Truth audit

- current module truth table;
- freeze architecture;
- remove misleading “done” labels.

## Stage 1 — Upstream source lock & inventory

- chengziyue inventory;
- skill references;
- resource connectors;
- license/source notes.

## Stage 2 — Method/Algorithm foundation

- 50+ Atlas entries;
- 30+ executable algorithms;
- Provider tests;
- 10 deep lessons.

## Stage 3 — Resources & Cases

- real CUMCM resource indexing;
- Baidu/Weiyun supplement support;
- flagship 2023 A Case;
- 4 more deep Cases.

## Stage 4 — Skills

- convert core skills from prompt shells into tool/state workflows.

## Stage 5 — Learning

- mastery;
- Daily Review;
- Gym;
- Profile;
- real closed loop.

## Stage 6 — Competition

- persistent project;
- Problem Contract;
- Data Doctor;
- Feature Lab;
- B/M/A;
- real execution;
- validation;
- figures.

## Stage 7 — Literature Research

- query expansion;
- cutoff;
- evidence;
- methods;
- export.

## Stage 8 — Paper & Reviewer

- evidence chain;
- paper assistance;
- reviewer;
- gaps.

## Stage 9 — UX consolidation

- unify project navigation;
- remove duplicate/shallow surfaces;
- screenshot review.

## Stage 10 — Tests / docs / CI

- depth gate;
- E2E;
- profile regression;
- docs;
- final report.

---

# 20. Keep / Rebuild / Remove

## KEEP

- dedicated `mathmodel` profile;
- MathModel shell concept;
- native DSH Agent;
- native DSH session/model/tool infrastructure;
- existing working K-Means vertical slice;
- useful registry/API foundations;
- provider abstraction if clean;
- real tests;
- existing GitHub benchmark documents.

## REBUILD / DEEPEN

- Atlas;
- Algorithm Lab;
- Skills;
- Daily Review;
- Gym;
- Competition;
- Resource/Case Library;
- Paper Reviewer;
- Profile.

## REMOVE / DOWNGRADE

- placeholder pages presented as features;
- hardcoded mastery/progress;
- fake resource cards;
- fake metrics;
- mock algorithm results used in normal product mode;
- generic AI summaries without evidence;
- duplicate product navigation;
- unused developer-only chips/status noise.

Fixtures may remain under explicit demo/test paths.

---

# 21. Quantitative Release Gate

Before calling the next release “deep product MVP”, report:

| Metric | Minimum |
|---|---:|
| Structured methods/models | 50 |
| Reference-quality lessons | 10 |
| Real executable algorithms | 30 |
| Algorithm families executable | 8 |
| Core executable Skills | 10 |
| Real Resource records | 100+ initial, ideally much higher from archive indexing |
| Deep Cases | 5 |
| Flagship Cases | 1 |
| Gym drills | 10 |
| Real competition E2E fixtures | 2 |
| Literature Research E2E cases | 1 |
| Reviewer→Learning closed-loop E2E | 1 |
| Web-profile isolation regression | PASS |

Counts alone are not sufficient, but falling below them means the product is still too thin.

---

# 22. Flagship Demo

The final live demo should show product depth, not navigation breadth.

## Demo A — Learn from an excellent paper

```text
Resources & Cases
→ 2023 CUMCM A National First Prize
→ inspect original source
→ problem decomposition
→ Method Map
→ click one Method Card
→ evidence location
→ open Model Atlas
→ ask DSH Agent
→ create a reverse-training drill
```

## Demo B — Solve a modeling problem

```text
create project
→ import problem
→ Problem Contract
→ Literature Research
→ Data Doctor
→ Feature Cards
→ Baseline / Main / Alternative
→ run real algorithm
→ validation
→ figure
→ reviewer
→ gap
→ Daily Review
```

If this cannot be demonstrated live, the product is not ready.

---

# 23. Required Documents

Create/update:

```text
PRODUCT_DEPTH_AUDIT.md
PRODUCT_DEPTH_REBUILD_PLAN.md
research/UPSTREAM_SOURCE_LOCK.md
research/RESOURCE_SOURCE_REGISTRY.md
research/ALGORITHM_UPSTREAM_INVENTORY.md
docs/RESOURCES_CASES_ARCHITECTURE.md
docs/LITERATURE_RESEARCH_ARCHITECTURE.md
docs/LEARNING_STATE.md
docs/COMPETITION_PROJECT_STATE.md
PRODUCT_DEPTH_PROGRESS.md
PRODUCT_DEPTH_FINAL_REPORT.md
```

Update stale/contradictory architecture docs.

---

# 24. Final Report

`PRODUCT_DEPTH_FINAL_REPORT.md` must contain:

```text
Start commit
End commit
Commits

Architecture stability
DSH web isolation
Methods count
Deep lessons count
Executable algorithms count
Provider families
Executable skill count
Resource record count
Deep Case count
Gym count
Competition E2E
Literature Research E2E
Reviewer/Learning loop E2E
Test summary
CI summary

What is truly real
What is still demo
What is still missing

Critical issues
High issues
Medium issues

Source/license summary
Screenshots reviewed

PRODUCT_DEPTH_MVP = PASS / FAIL
```

No “mostly pass”.

---

# 25. Autonomous Work Protocol

During implementation:

```text
inspect
→ implement
→ test
→ run
→ screenshot/review
→ fix
→ regression
→ commit
→ push
→ continue
```

Commit stable checkpoints continuously.

Do not wait until the end to push.

Stay on:

```text
experiment/mathmodel-harness
```

Do not merge to master.

Do not use destructive Git commands.

If one source is unavailable, mark it and continue with other work.

Do not ask the user about ordinary product/UI implementation details. Use judgement and verify by live testing.

---

# 26. Immediate First Actions

Start now with:

```text
1. git status / pull / record HEAD
2. read current authoritative docs
3. create PRODUCT_DEPTH_AUDIT.md
4. inventory current real vs shallow features
5. lock upstream sources
6. build complete upstream algorithm inventory
7. expand Atlas + Provider first
8. then Resource/Case ingestion
9. then flagship 2023 A case
10. then Skills / Learning / Competition / Literature Research / Reviewer
```

Do not begin with another landing page redesign.

The next phase succeeds only if the user can feel:

> “This product actually contains modeling knowledge, real algorithms, real resources, real papers, real workflows, and an AI Agent that connects them.”

