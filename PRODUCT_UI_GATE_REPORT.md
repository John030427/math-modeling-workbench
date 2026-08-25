# PRODUCT_UI_GATE Report

**Date:** 2026-08-25
**Plan:** `MATHMODEL_PROFILE_PHASE3_PLAN.md` (P3-1 → P3-4)
**Product instance:** `~/.dsh/profiles/mathmodel` @ `http://127.0.0.1:3100`（pid 见 start 脚本输出）
**Web instance:** `~/.dsh/profiles/web` @ `http://127.0.0.1:3080`（原版，未动）

---

## Gate Results — ALL PASS

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| G1 | mathmodel profile 启动；Shell V2 三栏渲染；8 导航项；零 console error | **PASS** | `profile-gate/h3-dashboard.png`，`h3-workbench.png`；runner 报告 0 errors |
| G2 | Dashboard 卡片可见、点击进入工作台（context POST 发生） | **PASS** | `h3-card-to-workbench.png`；`contextPost: true` |
| G3 | 工作台 API：registry(13) / quizzes / quiz-submit(mastery) / context / tutor-offline | **PASS** | `tests/shell-v2-smoke.ps1 -BaseUrl :3100` → PASS |
| G4 | 原生 Agent 会话收发 | **PASS** | `h1-reply.png`（agent replied OK-H1 on 3100） |
| G5 | `/modeling-tutor` 上下文相关回答 | **PASS** | `h4-tutor-reply.png`（簇/质心/标准化 pedagogy on 3100） |
| G6 | 刷新恢复会话与 Shell；上下文隔离 A/B | **PASS** | `h2-after-reload.png`；`ctxA=kmeans / ctxB=topsis` |
| G7 | web profile (3080) 原版 DSH：无 Shell、无产品注入、sidebar/composer 正常 | **PASS** | `h5-stock-restored.png`（shellMounted=false, 0 errors）；boot payload 无 math-modeling 条目 |

```text
PRODUCT_UI_GATE = PASS
```

## What changed on this machine

| Surface | State |
|---|---|
| `~/.dsh/profiles/mathmodel/` | **新增** — bundles: dsh-base + dsh-web-app + dsh-mathmodeling + shell-v2；patch 关闭 ui-layout；pnpm 安装完成 |
| `http://127.0.0.1:3100` | 产品实例运行中（`--profile mathmodel --port 3100 --no-open`） |
| `~/.dsh/profiles/web/` | **已还原原版** — shell-v2 / dsh-mathmodeling 已卸载并写墓碑；ui-layout / thinking-counter 已热重载恢复；package.json 无 math-modeling 引用 |
| `http://127.0.0.1:3080` | 原版 DSH（用户社区插件全部保留） |

## Fixes during gate

| Issue | Fix |
|-------|-----|
| `dsh --profile X web …` 报 "web takes none of parent --profile" | 正确形式：`dsh --profile X --port P --no-open`（web app 由 profile bundles 决定，参数透传）— 已修入 start 脚本 |

## Scripts delivered

- `scripts/mathmodel-profile-install.ps1` — 创建/刷新 mathmodel profile（幂等）
- `scripts/mathmodel-profile-start.ps1` — 启动 3100 实例（自动探测 dsh bin、端口等待）

## Unblocked (per plan §Deferred)

GitHub Integration 系列：MathMN-lite · czy-provider · 题库 · 案例库 · 论文评审 V2。
