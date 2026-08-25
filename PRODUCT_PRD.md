# MathModel Workbench — Product PRD

**Date:** 2026-08-25
**Status:** Authoritative product requirements (consolidates `PRODUCT.md`, P1 plugin slice, Shell V2 gate evidence, Phase 3 direction)
**Companion docs:** `ARCHITECTURE.md`, `MATHMODEL_PROFILE_PHASE3_PLAN.md`, `research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md`

---

## 1. Positioning

AI 学习与竞赛工作台：教「为什么」与建模结构，而不是替代思考。
Target user: 参加 0–2 次数模赛的本科生 — 知道部分算法名，但拆题 / 数据 / 特征 / 验证薄弱。

## 2. Core loop

学习 → 训练 → 实战 → 评审 → 找差距 → 专项训练 → 再实战

## 3. Product surface (Shell V2 — verified by SHELL_V2_GATE PASS)

Three-column shell in a **dedicated DSH profile**:

```text
┌────────────┬──────────────────────────┬───────────────────┐
│ nav        │ workbench (center)       │ native Agent chat │
│ 仪表盘     │ Dashboard / 工作台 /     │ /modeling-tutor   │
│ 建模工作台 │ 训练 / 竞赛 / 习题 /     │ session-scoped    │
│ 训练…画像  │ 案例 / 论文 / 画像       │ ModelingContext   │
│ + official │                          │                   │
│   sidebar  │                          │                   │
└────────────┴──────────────────────────┴───────────────────┘
```

- Agent 对话为第一等公民（右栏原生会话），`/modeling-tutor` 读取 ModelingContext + Registry。
- 工作台能力（P1 已交付，保持不破坏）：Model Atlas（13 模型注册表）、K-Means 交互课程、Quiz、Mastery、modeling-tutor skill。
- 占位模块（训练/竞赛/习题/案例/论文/画像）显示规划卡片，不空屏。

## 4. Distribution (decided)

| Surface | Content |
|---|---|
| `web` profile | **原版 DSH** — 用户自己的插件生态，产品不注入、不修改 |
| `mathmodel` profile | 产品专用：`dsh-base` + `dsh-web-app` + `@math-modeling/dsh-mathmodeling` + `@math-modeling/shell-v2`；patch 关闭 `ui-layout`（Shell V2 拥有 root） |
| 端口 | 产品实例 3100（web 3080 不变） |

Install/run/remove 见 `scripts/mathmodel-profile-*.ps1`；机制依据 `research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md`。

## 5. Acceptance — PRODUCT_UI_GATE (blocking for GitHub Integration phases)

| # | Criterion |
|---|---|
| G1 | `mathmodel` profile 实例启动，Shell V2 三栏渲染，8 导航项，零 console error |
| G2 | Dashboard 注册表卡片可见并可点击进入工作台（context POST 发生） |
| G3 | 工作台 API 健康：registry / quizzes / quiz-submit(mastery) / context |
| G4 | 原生 Agent 会话可收发（H1 等效） |
| G5 | `/modeling-tutor` 返回模型上下文相关教学回答（H4 等效） |
| G6 | 刷新恢复会话与 Shell（H2 等效） |
| G7 | `web` profile (3080) 为原版 DSH：无 Shell V2、无数模注入残留，sidebar/composer 正常 |

## 6. Non-goals (until gate passes)

MathMN-lite · czy-provider · 题库 · 案例库 · 论文评审 V2 — 见 Phase 3 plan §Deferred。

## 7. MVP success (unchanged from PRODUCT.md)

现场可稳定跑通 DEMO.md A–D；无 Critical；刷新不丢 demo 用户数据。
