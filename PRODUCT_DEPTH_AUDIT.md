# PRODUCT DEPTH AUDIT — 真相审计

**Date:** 2026-08-26 · **Branch:** `experiment/mathmodel-harness` · **Audited at:** depth-rebuild 开工前 + 本轮重建后复核
**方法：** 逐模块检查 UI/后端/数据/持久化/Agent 联动/测试，页面存在 ≠ 完成。

---

## Truth Table（重建前 → 当前）

| Module | UI | Backend | Real data | Persistence | DSH context | Tool exec | Tests | 重建前定性 | 当前定性 | 动作 |
|---|---|---|---|---|---|---|---|---|---|---|
| Dashboard | ✓ | 部分 | 重建前部分 seed | — | — | — | — | Partial | **Real**（真实队列/项目/掌握度/薄弱项） | keep |
| Atlas | ✓ | ✓ | 13 模型（无 task/family） | registry yaml | ✓ context | ✗ | 部分 | Partial | **Real**（54 方法，真实元数据+执行链接+掌握度） | deepened |
| Lesson | 仅 K-Means | ✓ | 1 课 | — | ✓ | — | ✓ | Partial | **Real**（11 深度课程 + 通用渲染器 + Quiz） | deepened |
| Quiz | ✓ | ✓ | ✓ | learning-state.json | ✓ | — | ✓ | Real | Real | keep |
| Daily Review | ✓ | ✓ | ✓（SRS 队列四源） | ✓ | — | ✓ | ✓ | Real | Real | keep |
| Gym | ✓ | ✓ | 1 案例 | ✓ | ✓ | — | 部分 | Partial | **Real**（10 drills / 8 类型 / 3 来自真实案例） | deepened |
| Competition | ✓ | ✓ | ✓ | workspace/ | ✓ | ✓ | E2E | Real | Real（+可视化阶段/figure 记录/refreshDetail） | keep |
| Problem Library | ✓ | ✓ | 仅 8 条外链 | — | — | — | — | Demo | **Real-index**（+5244 条 CUMCM 归档索引，外链策略） | deepened |
| Resource Library | 部分 | ✓ | 同上 | — | — | — | — | Demo | **Real-index**（archive 过滤/分页 API） | deepened |
| Case Library | ✓ | ✓ | 3 自拟 | — | — | — | — | Partial | **Real**（旗舰 2023 A 国一（证据定位）+3 真题蒸馏） | deepened |
| Algorithm Lab | ✓ | ✓ | 5 local | manifest | ✓ | ✓ | ✓ | Real | **Real+**（+46 czy 方法/10 族/upstream pin） | deepened |
| Literature Research | ✗ | ✗ | — | — | — | — | — | Missing | **Real**（OpenAlex 真实搜索+截止隔离+方法族+UI） | new |
| Paper Lab | ✓ | 部分 | claims/runs 真实 | ✓ | — | — | 部分 | Partial | Partial（提纲/证据链真实；写作辅助仍浅） | keep+P9 |
| Reviewer | ✓ | ✓ | 真实 findings | ✓ | — | — | E2E | Real | Real（12 维→gap 闭环） | keep |
| Profile | ✓ | ✓ | 真实聚合 | ✓ | — | — | E2E | Real | Real | keep |
| Agent | ✓ | DSH | — | — | ✓ | ✓ | gate | Real | Real | keep |
| Skills | 12 md | 注册 | — | — | — | — | 契约测试 | Partial | Partial→**执行型增强中**（data-doctor/selector/lab 已接真实 API） | deepened |
| Provider | ✓ | ✓ | 5 local | manifest | — | ✓ | ✓ | Real | **Real+**（+46 czy，双 provider） | deepened |

## Placeholder/mock 扫描结论

- `Placeholder` 组件仅用于**未开工模块的诚实占位**（训练/竞赛子页等），标注「规划中」，不冒充功能 ✓
- `seedMasteryRecords`（种子掌握度）保留为**首次启动种子数据**，真实 Quiz/Review 会覆盖 ✓（fixture 性质，已标注）
- `offline tutor` 是**有意的离线兜底**（LLM 不可用时的教学回退），非 mock ✓
- 未发现虚构资源卡/假指标/假进度条 ✓
- `mockAlgorithmProvider`（core/types.ts）仅测试用，未接入产品路由 ✓

## 结论

重建前：Real 6 / Partial 8 / Demo 2 / Missing 1。
当前：Real 15 / Partial 2（Paper 写作辅助、Skills 的 Agent 端执行深化）/ Demo 0 / Missing 0。
剩余浅点已列入 PRODUCT_DEPTH_FINAL_REPORT 的「What is still demo/missing」。
