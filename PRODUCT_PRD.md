# MathModel Harness — Product PRD & MVP

**Version:** 0.3 draft  
**Date:** 2026-08-25  
**Product:** MathModel Harness — AI 数学建模学习与竞赛工作台  
**Platform:** Dedicated DeepSeek Harness `mathmodel` Profile

## 1. Product statement

MathModel Harness is an AI-native mathematical-modeling learning and competition environment for students who know scattered algorithms but do not yet have a reliable modeling process.

It does not optimize for:

> 一键把比赛答案生成出来。

It optimizes for:

> 学会为什么这样建模，并在真实比赛中把学习、实验、验证、写作和复盘连成一个闭环。

Core loop:

```text
Learn
→ Practice
→ Solve
→ Review
→ Diagnose
→ Retrain
→ Learn
```

## 2. Primary user

Primary persona:

> 参加过 0–2 次数学建模比赛的本科生。

Typical state:

- knows names such as AHP, TOPSIS, K-Means, ARIMA, PSO
- lacks a stable problem-decomposition framework
- weak at data diagnosis and feature engineering
- chooses models by familiarity instead of assumptions
- often lacks baseline, validation and robustness checks
- can write code but cannot explain method fit
- paper writing is disconnected from experiments
- does not know what weakness to train next

## 3. Core jobs

### Learn

“I know the model name but not why it works or when it fails.”

### Practice

“Give me real data/problems and let me practice decomposition, preprocessing, features, model selection and validation.”

### Compete

“Help organize competition work without fabricating experiments.”

### Review

“Tell me exactly where my scheme is weak.”

### Improve

“Turn competition/reviewer weaknesses into targeted future training.”

## 4. Product differentiation

Most existing math-modeling AI products are strongest at:

```text
Problem
→ Model
→ Code
→ Paper
```

MathModel adds:

```text
Knowledge
→ Guided Practice
→ Competition
→ Evidence Review
→ Ability Diagnosis
→ Personalized Retraining
```

The differentiator is the learning ↔ competition feedback loop.

## 5. Product principles

1. Teach why before automating how.
2. Evidence before claims.
3. Baseline before complicated models.
4. Data assumptions before algorithm recommendation.
5. Feature engineering is first-class.
6. Validation is mandatory.
7. AI autonomy is explicit.
8. Competition mistakes become learning tasks.
9. Excellent papers are distilled, not copied.
10. Reuse DSH Agent/Session/Tools instead of recreating them.

## 6. Agent modes

### Coach Mode

- Socratic questioning
- hints before complete answers
- trains variables/assumptions/reasoning

### Copilot Mode

- collaborative suggestions
- partial code
- alternatives
- user confirms key decisions

### Agent Mode

- executes confirmed workflow
- records parameters/seeds/results
- no fabricated experimental output
- human confirmation at important gates

## 7. Product IA

```text
MathModel Harness

概览
└── Dashboard

学习
├── 模型地图 Model Atlas
└── 今日复习 Daily Review

训练
└── 专项训练 Modeling Gym

竞赛
├── 比赛工作台 Competition Workbench
├── 题库 / 真题 Problems
├── 优秀案例 Cases
└── Algorithm Lab

论文
├── Paper Lab
└── Reviewer

个人
└── Modeling Profile

右侧
└── Native DSH Modeling Agent
```

Workbench is the dominant center surface.

## 8. Dashboard

The first screen should answer:

> 今天最值得继续什么？

MVP dashboard:

```text
继续学习
今日复习
继续比赛项目

模型地图
专项训练
比赛工作台

题库 / 真题
优秀案例
论文评审

能力画像 / 当前薄弱项
```

Do not open with a raw list of algorithms.

## 9. Model Atlas

Taxonomy:

```text
Task × Method Family × Algorithm
```

Tasks:

- preprocessing
- feature engineering
- evaluation
- clustering
- classification
- regression
- forecasting/time series
- optimization
- graph/network
- simulation
- spatial

Families:

- statistics
- operations research
- machine learning
- deep learning
- metaheuristics
- numerical methods

MVP Atlas:

- search
- task grouping
- model nodes/cards
- mastery indicator
- prerequisites
- comparison links

K-Means is the reference-quality lesson.

## 10. Interactive lesson standard

```text
30 秒直觉
现实案例
交互 Demo
数学原理
代码
适用条件
不适用条件
常见误区
模型比较
Mini Quiz
真实数据实验
```

MVP only requires one fully polished reference lesson: K-Means.

## 11. AI Tutor context

Tutor understands:

```text
module
page
model_id
knowledge_unit
lesson_step
problem_id
case_id
project_id
dataset_id
experiment_id
```

Example:

```text
module=atlas
model_id=kmeans
knowledge_unit=feature-scaling
```

User: “为什么要标准化？”

Tutor must answer specifically for K-Means.

## 12. Daily Review

Train modeling ability, not only definitions.

Question types:

- remember
- understand
- apply
- modeling judgment
- modeling error diagnosis
- leakage diagnosis
- validation choice
- feature reasoning

Sources:

```text
weak knowledge units
competition mistakes
reviewer findings
due concepts
```

MVP:

```text
quiz attempt
→ mastery
→ due queue
```

## 13. Modeling Gym

MVP flow:

```text
problem
→ student proposes variables/objective/constraints/preprocessing/features/models
→ Coach hint
→ submit
→ dimension feedback
→ recommended training
```

One excellent case is better than many shallow cases.

## 14. Competition Workbench

Stages:

```text
Read Problem
→ Decompose
→ Data Doctor
→ EDA
→ Feature Engineering
→ Model Selection
→ Algorithm Lab
→ Validation
→ Visualization
→ Paper
→ Reviewer
```

Each stage produces an artifact.

No raw developer JSON as the primary UI.

## 15. Data Doctor

Diagnose:

- missingness
- data type
- temporal/spatial order
- leakage
- scale
- outliers
- target availability
- informative missingness

Every recommendation explains why/risk/when-not-to-use.

## 16. Feature Engineering

Every feature gets a Feature Card:

```text
name
formula
meaning
why it may matter
risk
possible leakage
how to validate
```

## 17. Model Selector

Default output:

```text
Baseline
Main
Alternative
```

Each recommendation includes fit, assumptions, strengths, risks and validation plan.

## 18. Algorithm Lab

Experiment record:

```text
algorithm
parameters
seed
runtime
metrics
objective
feasibility
artifacts
```

No fabricated run.

## 19. Problem Library

MVP:

- 5–10 curated benchmark problems
- metadata/links where copyright limits redistribution
- competition/year/type/tags
- common failure modes
- validation targets

Not a one-click answer generator.

## 20. Case Library

Excellent papers are distilled into structured cases.

Schema:

```text
problem structure
subproblems
data processing
feature engineering
baseline
main model
alternatives
algorithm
validation
robustness
figures
writing structure
innovation
strengths
weaknesses
transferable lessons
```

MVP: 3 cases covering evaluation, forecasting, optimization.

## 21. Reverse Case Training

```text
Problem
→ hide excellent solution
→ student proposes plan
→ compare against distilled case
→ gap analysis
→ recommended training
```

## 22. Paper Reviewer

Training rubric, not official competition score.

Dimensions:

- problem understanding
- data handling
- feature engineering
- model reasonableness
- mathematical rigor
- algorithm/solution
- validation
- interpretation
- innovation
- visualization
- writing
- reproducibility

Findings feed Profile/Daily Review.

## 23. Modeling Profile

Track:

- modeling dimensions
- model mastery
- knowledge-unit mastery
- recent mistakes
- reviewer weaknesses
- competition history

Competition learning bridge:

```text
recommended DBSCAN
→ mastery 20%
→ 5-minute quick lesson
→ return to project
```

## 24. MVP levels

### Demo MVP

1. dedicated `mathmodel` profile boots
2. coherent MathModel shell
3. Dashboard
4. Model Atlas
5. polished K-Means + Canvas
6. contextual `/modeling-tutor`
7. Quiz → mastery
8. one Gym case
9. Competition demo: problem → Data Doctor → Model Selector
10. Paper Reviewer → Gap
11. Profile reflects learning feedback

### Product MVP

Adds:

1. profile installer/bootstrap
2. 5–10 Problems
3. 3 distilled Cases
4. baseline/main/alternative experiments
5. first real Algorithm Provider executions
6. persistent project artifacts
7. contract/manifest/claim-ledger lite
8. basic scientific visualization templates
9. stable remove/rollback
10. documented supported DSH version

## 25. Non-goals

Not required for MVP:

- 30 polished lessons
- full deep learning catalog
- automatic award-paper generation
- teacher/admin multi-user system
- full FSRS
- unrestricted code execution
- full LangGraph orchestration
- OpenHands as primary core
- full historical archive
- redistribution of copyrighted paper PDFs

## 26. Success criteria

A user can complete:

```text
open MathModel
→ learn K-Means
→ ask why
→ quiz
→ mastery changes
→ training case
→ Coach feedback
→ competition project
→ diagnose data
→ compare models
→ review paper
→ weakness enters Profile
```

Architecture success:

- `web` profile untouched
- `mathmodel` independently boots
- no second LLM chat backend
- context isolation passes
- one sidebar
- Workbench dominates screen
- removal has no effect on normal DSH

Quality:

```text
Critical = 0
demo-blocking High = 0
```

## 27. UX target

Desktop:

```text
220px | flexible Workbench | 380–420px Agent
```

Do not repeat current Shell V2 mistake of embedding the full official DSH sidebar below MathModel navigation.

## 28. Positioning summary

> MathModel Harness 是一个基于 DeepSeek Harness 的数学建模专用 AI 工作台，把模型学习、专项训练、比赛执行、论文评审和个人能力诊断连成一个闭环。

> 不是“AI 帮你交一篇答案”，而是“AI 帮你逐渐真正学会建模，并在比赛里可靠地使用这些能力”。
