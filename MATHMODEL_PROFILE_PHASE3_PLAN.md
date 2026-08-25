# MathModel Dedicated Profile — Phase 3 Autonomous Implementation Plan

**Date:** 2026-08-25  
**Branch:** `experiment/mathmodel-harness`  
**Primary architecture:** dedicated `mathmodel` DSH Profile + MathModel bundle composition

## 0. Mission

The Shell V2 technical spike has proven custom shell, native Agent, Session, `/modeling-tutor`, ModelingContext and rollback.

Do not spend another cycle proving the same thing inside the ordinary `web` profile.

Now convert the experiment into the actual product architecture:

```text
profile:web
→ untouched normal DSH

profile:mathmodel
→ dedicated MathModel Harness
```

Goal: independently bootable, reproducible and removable MathModel product composition.

## 1. Read first

Read:

```text
research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md
PRODUCT_PRD.md
ARCHITECTURE.md
research/DSH_HARNESS_SOURCE_AUDIT.md
research/HARNESS_ARCHITECTURE_DECISION.md
MATHMODEL_HARNESS_SHELL_V2_PLAN.md
SHELL_V2_GATE_REPORT.md
```

Inspect actual repository/runtime too.

## 2. Autonomous loop

Continue:

```text
Inspect
→ Decide
→ Implement
→ Build
→ Verify
→ Live Test
→ Review
→ Fix
→ Regression
→ Commit
→ Next iteration
```

Do not stop after a plan, successful build, first render or first screenshot.

## 3. Safety

The ordinary:

```text
web
```

profile must remain untouched.

Do not install product shell into `web`.

If old experimental injections still exist in `web`, restore stock `web` first.

Continue on:

```text
experiment/mathmodel-harness
```

No force push/reset-hard/clean.

## 4. P0 — Freeze experiments

Treat:

```text
packages/harness-spike
packages/shell-v2
```

as historical technical proofs.

Do not delete yet and do not continue product development inside them unless extracting a proven reusable piece.

## 5. P1 — Product package boundaries

Target:

```text
packages/
  mathmodel-suite/
  mathmodel-shell/
  dsh-mathmodeling/
  core/
  ui/
  learning/
  algorithm-provider/
```

### `mathmodel-suite`

User-facing distributable DSH bundle.

Declare `dsh.bundle`.

Responsibilities:

- compose MathModel shell
- mount domain integration
- mount Skills/Tools
- mount registry providers
- patch/disable conflicting UI only inside `mathmodel`

### `mathmodel-shell`

Presentation only:

- MathModel nav
- center Workbench
- right native Conversation
- responsive behavior

Do not own mastery/session/chat truth.

## 6. P2 — Dedicated profile bootstrap

Create:

```text
profiles/mathmodel-template/
scripts/mathmodel-profile-init.ps1
scripts/mathmodel-profile-verify.ps1
scripts/mathmodel-start.ps1
scripts/mathmodel-remove.ps1
```

Bootstrap must:

1. detect DSH installation
2. detect actual version
3. create/update only `$DSH_HOME/profiles/mathmodel`
4. ensure final ordered composition contains installation-owned:
   - `@deepseek-ai/dsh-base`
   - `@deepseek-ai/dsh-web-app`
5. install/link MathModel suite
6. never install a mismatched duplicate DSH just to get web-app
7. verify:

```bash
dsh --profile mathmodel --dump-config
```

8. refuse success if composition is wrong

Because custom profiles normally initialize from base, inspect installed CLI mechanics and choose the least fragile method. Document in:

```text
research/MATHMODEL_PROFILE_BOOTSTRAP.md
```

## 7. P3 — Profile isolation

Hard test:

```text
dsh --profile web
```

boots stock DSH.

Separately:

```text
dsh --profile mathmodel
```

boots MathModel.

Verify:

- MathModel changes do not affect `web`
- removing `mathmodel` does not damage `web`
- ordinary sessions/workspaces remain safe

## 8. P4 — Product UI Alignment

The current Shell V2 passed a technical gate, not the real product gate.

Desktop:

```text
220–240px | Workbench flexible | 380–420px
```

### U1 Single Sidebar

Remove the current pattern:

```text
MathModel navigation
+
renderSlot('sidebar')
```

Only MathModel sidebar remains.

### U2 Workbench Dominance

Right Agent must not grow to half the screen.

Do not use a right column like:

```text
minmax(380px, 1fr)
```

Use roughly fixed/responsive 380–420px.

### U3 Correct IA

```text
概览
  Dashboard

学习
  模型地图
  今日复习

训练
  专项训练

竞赛
  比赛工作台
  题库 / 真题
  优秀案例
  Algorithm Lab

论文
  Paper Lab
  论文评审

个人
  能力画像
```

### U4 No duplicate Workbench tab

Dedicated Harness mode must not also register a Conversation tab named “数模工作台”.

Compatibility plugin mode may keep it.

### U5 No permanent fourth column

Details/Files becomes drawer/panel/tab when needed.

### U6 Product Dashboard

Initial page shows:

```text
继续学习
今日复习
继续比赛项目
模型地图
专项训练
比赛工作台
题库
优秀案例
论文评审
当前薄弱项
```

Not a raw algorithm list.

### U7 Atlas quality

Raw algorithm cards belong in Model Atlas.

At minimum:

- group by task
- search
- mastery indicator
- K-Means lesson link
- start `Task × Family × Algorithm`

## 9. P5 — Preserve learning vertical slice

Must continue to pass:

```text
Atlas
→ K-Means
→ Canvas
→ ModelingContext
→ /modeling-tutor
→ Quiz
→ Mastery
```

Test context isolation, persistence and Tutor knowledge unit.

## 10. P6 — Product UI Gate

Rename historical result conceptually:

```text
SHELL_V2_TECHNICAL_GATE = PASS
```

Add real:

```text
PRODUCT_UI_GATE
```

Evaluate:

```text
U1 Single Shell
U2 Workbench Dominance
U3 IA Alignment
U4 Atlas Quality
U5 Agent Context UX
U6 Visual Consistency
U7 Responsive Usability
```

All must PASS.

Screenshots:

```text
1920x1080
1680x900
1440x900
~1024px
```

Actually inspect them, not only selectors.

## 11. P7 — Demo MVP content

Only after profile + UI gate:

### Learning
- Dashboard
- Model Atlas
- K-Means lesson
- Tutor
- Quiz/mastery
- basic Daily Review

### Training
- one real Gym case
- answer → hint → submit → feedback

### Competition
- one project
- Data Doctor
- Feature Cards
- Baseline/Main/Alternative selector
- no raw JSON primary UI

### Paper
- Reviewer
- Gap Analysis

### Profile
- dimensions
- model mastery
- learning bridge

Do not expand algorithm count yet.

## 12. P8 — GitHub ecosystem integrations

After shell is stable:

### MathMN-lite
Adapt:
- problem contract/ReqID
- run manifest
- claim ledger
- verify patterns

### chengziyue1222/math-model-agent
Use behind `AlgorithmProvider`; pin version/commit and document license.

### Barson
Adapt Problems IA, not one-click generator.

### zhanwen/MathModel
Use as indexed/distilled resource source, do not redistribute copyrighted papers by default.

### MCM-AI-Starter-Kit
Adapt scientific visualization/writing patterns where license permits.

## 13. P9 — First content registry

Create:

```text
registry/problems/
registry/cases/
registry/figures/
```

First target:

```text
Problems: 5–10
Cases: 3
```

Cases:

- evaluation
- forecasting
- optimization

## 14. P10 — Algorithm execution MVP

Stable interface first:

```ts
interface AlgorithmProvider {
  listAlgorithms(): Promise<AlgorithmDescriptor[]>
  runAlgorithm(input: AlgorithmRunInput): Promise<ExperimentResult>
}
```

First provider: local or czy adapter.

Record:

```text
algorithm
parameters
seed
runtime
metrics
artifacts
```

No fabricated results.

## 15. P11 — Integrity MVP

Create MathMN-inspired lite artifacts:

```text
workspace/<project>/
  problem/problem-contract.json
  experiments/run-manifest.json
  review/claim-ledger.json
```

Minimum evidence:

```text
Paper Claim
→ Result/Figure
→ Experiment
→ Algorithm
→ Dataset
```

## 16. Review loop

After each major phase:

```text
Architecture Review
DSH Compatibility Review
Product UX Review
Education Review
Modeling Review
Code Review
Regression
```

Gate:

```text
Critical = 0
demo-blocking High = 0
```

Review docs without fixes do not count.

## 17. DSH version policy

Create:

```text
research/MATHMODEL_DSH_COMPATIBILITY.md
```

If internal DSH APIs are unavoidable, isolate them:

```text
packages/mathmodel-shell/src/dsh-compat/
```

Document purpose, upstream path, tested version, fallback and risk.

## 18. Required docs

Update/create:

```text
ARCHITECTURE.md
PRODUCT.md
research/MATHMODEL_PROFILE_BOOTSTRAP.md
research/MATHMODEL_DSH_COMPATIBILITY.md
REVIEW/PRODUCT_UI_REVIEW.md
PHASE3_PROGRESS.md
PHASE3_FINAL_REPORT.md
```

`ARCHITECTURE.md` must change primary delivery from “plugin inside web profile” to “dedicated mathmodel profile + standard bundles”.

## 19. Commit strategy

Use small stable commits:

```text
docs: adopt dedicated mathmodel profile architecture
feat: add mathmodel suite bundle
feat: add mathmodel profile bootstrap
test: verify profile isolation
feat: align mathmodel product shell
refactor: remove duplicate workbench view in harness mode
feat: add product dashboard and atlas IA
test: pass product ui gate
...
```

Push stable checkpoints to:

```text
experiment/mathmodel-harness
```

## 20. Stop conditions

Architecture section only succeeds when:

```text
[ ] stock web verified unchanged
[ ] mathmodel profile independently boots
[ ] --dump-config verified
[ ] one coherent MathModel shell
[ ] no embedded ordinary DSH sidebar
[ ] no permanent fourth column
[ ] native Agent works
[ ] modeling-tutor context works
[ ] P1 learning slice works
[ ] PRODUCT_UI_GATE evaluated
[ ] remove/rollback verified
[ ] docs updated
[ ] regression passes
```

If blocked, document exact reason, try one alternative composition route, then continue independent work.

## 21. Final report

`PHASE3_FINAL_REPORT.md`:

```text
Architecture:
PRIMARY = ?

Profile:
web = PASS/FAIL
mathmodel = PASS/FAIL

Product UI:
U1–U7

Learning Slice:
PASS/FAIL

Agent/Session:
PASS/FAIL

Compatibility Risk:
Low/Medium/High

Next 5 Tasks:
...
```

## 22. Product principle

Never lose:

```text
Learn
→ Practice
→ Solve
→ Review
→ Diagnose
→ Retrain
```

MathModel is a specialized AI environment built on DSH, not a generic DSH skin and not a one-click competition-answer generator.

## 23. Start

```text
git status
→ restore/check stock web
→ detect DSH version
→ inspect profile/bundle mechanics
→ create dedicated mathmodel
→ dump config
→ boot
→ implement product-aligned shell
→ live test
→ review/fix/regression loop
```

Do not start MathMN/czy/Problems/Cases expansion before the dedicated profile and PRODUCT_UI_GATE are stable.
