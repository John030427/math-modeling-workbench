# PRODUCT_UI_REVIEW (Phase 3 — dedicated mathmodel profile)

**Date:** 2026-08-25
**Gate driver:** `scripts/product-ui-gate.mjs` · screenshots `REVIEW/product-ui-gate/`
**Method:** automated U1–U7 checks at 1920/1680/1440/1024 + human visual inspection of every screenshot (plan P6 requirement).

---

## Gap review vs Shell V2 technical build (c4119c9 → this round)

| Old defect (Shell V2) | New build | Status |
|---|---|---|
| 双 Sidebar：官方 ui-sidebar 嵌在 MathModel 导航下方 | U1: sidebar seat 声明但不渲染，仅剩 MathModel 侧栏 | **FIXED** |
| 右侧 Agent 占半屏（`minmax(380px,1fr)`） | U2: 固定 400px；≤1180px 收为抽屉 + FAB | **FIXED** |
| 重复「数模工作台」Tab（compat 注册 + shell 并存） | U4: `window.__MM_SHELL_HOST__` + suite patch 插入顺序；dsh-mathmodeling 跳过 conversation.view/footer/overlay | **FIXED** |
| Dashboard 是裸算法卡片列表 | U6: 任务导向 Dashboard（继续学习/今日复习/继续比赛项目/模块入口/薄弱项） | **FIXED** |
| Atlas 缺任务分组/搜索/掌握度 | U7: Task 分组（派生启发式，registry 无 task/family 字段，已文档化）+ 搜索 + 难度/掌握度 chip + K-Means 参考课链接 | **FIXED** |
| 课程深链落在 workbench 内部「模型地图」 | ModelingWorkbench `initialSection` + lesson 深链自动拉取 kmeans 模型 | **FIXED** |

## Visual inspection notes (per screenshot)

- `1920x1080-dashboard.png` — 单侧栏、六组 IA、主视觉 Dashboard、Agent 400px ✓
- `1680x900-atlas.png` — 聚类/评价决策/机器学习/预测时序/优化 五组、搜索框、参考课标记 ✓
- `1440x900-lesson.png` — K-Means 课程直达（30秒直觉 + 10 步 chips + 问 Tutor）✓
- `1024x768-dashboard.png` — 两栏布局，Agent 收成 FAB，内容自适应 ✓

## Known gaps (non-blocking, logged for P7)

| # | Severity | Note |
|---|---|---|
| R1 | Low | Atlas「掌握度」无 per-model 数据源（无 mastery GET endpoint），诚实显示「未测验」；待 mastery 查询 API |
| R2 | Low | Agent 列无会话切换 UI（官方 sidebar 移除后）；依赖 DSH 会话默认行为，P7 可加会话抽屉 |
| R3 | Info | ModelingWorkbench 内部 chips 与 Shell 导航并存（课程内步进器，非重复 IA） |

## Verdict

**PRODUCT_UI_GATE = PASS**（U1–U7 + zeroErrors 全绿；四视口人工目检通过；Critical=0，demo-blocking High=0）
