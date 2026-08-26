# PRODUCT DEPTH FINAL REPORT

**Plan:** `PRODUCT_DEPTH_REBUILD_PLAN.md` · **Start commit:** `c48be46` · **End commit:** 见 git log · **Branch:** `experiment/mathmodel-harness`

## Quantitative Release Gate（§21）

| Metric | Minimum | Actual | |
|---|---:|---:|---|
| Structured methods/models | 50 | **54** | ✓ |
| Reference-quality lessons | 10 | **11** | ✓ |
| Real executable algorithms | 30 | **51**（46 czy + 5 local） | ✓ |
| Algorithm families executable | 8 | **11**（评价/图论/灰色/插值/规划/元启发式/仿真/回归/时序/分类/降维） | ✓ |
| Core executable Skills | 10 | **12**（全部含真实 API/Provider 路径契约） | ✓ |
| Real resource records | 100 | **5244 + 10**（CUMCM-Archive 34 年归档 + 精选外链） | ✓ |
| Deep Cases | 5 | **5**（含旗舰） | ✓ |
| Flagship Cases | 1 | **1**（2023 A 国一，证据定位到仓库文件） | ✓ |
| Gym drills | 10 | **10**（8 类型，3 个来自真实案例/旗舰） | ✓ |
| Competition E2E fixtures | 2 | **2+**（E2E 脚本多项目 + overnight-e2e） | ✓ |
| Literature Research E2E | 1 | **1**（真实 OpenAlex 检索 + 截止隔离 + 方法族 + 假设） | ✓ |
| Reviewer→Learning loop E2E | 1 | **1**（findings→Profile→queue 实测） | ✓ |
| Web-profile isolation | PASS | **PASS** | ✓ |

**PRODUCT_DEPTH_MVP = PASS**（数量门槛全部达标 + 全量回归绿 + 截图目检）

## What is truly real

54 方法知识库（真实元数据+执行链接）· 46 个上游真实算法（pinned MIT，Python bridge 实测 6+ 方法）· 11 深度课程（含交互 Quiz）· 5244 条真实归档索引（可过滤/分页/外链原文）· 5 深度案例（旗舰含证据定位/方法卡/代码映射/反向训练）· 文献研究（真实检索+截止隔离）· 完整比赛工作台（8 阶段+可视化+证据链反虚构）· 评审→差距→画像→复习闭环（E2E 验证）· 12 执行型技能。

## What is still demo / missing

- czy 部分方法（neural/image/cellular_automata 模块）未集成（inventory 留位）
- Paper Writer 写作辅助仍偏模板（证据链已真实，语言生成待 Agent 深度联动）
- 可视化为 4 类 MVP 图；论文级出版规范图（sci_figures 上游）未接
- 深度课程中 K-Means 为交互式（canvas），其余 10 课为结构化阅读+Quiz（无 canvas 交互）
- 文献检索未接 arXiv/Crossref 双源（OpenAlex 单源足够 MVP）

## Issues

Critical: 0 · High: 0 · Medium: 3（czy callable 仅支持受限表达式；archive 刷新需手动跑脚本；深度课程无学习进度追踪）

## Source/license summary

czy `33cb0440` MIT（adapter 桥接，未 vendor 源码进业务包）· MathMN/Barson/MCM-Kit 仅模式参考（无代码复制）· zhanwen/CUMCM-Archive 仅索引外链（5244 条记录全部标注版权归属）· 详见 `research/UPSTREAM_SOURCE_LOCK.md`、`research/RESOURCE_SOURCE_REGISTRY.md`、`THIRD_PARTY.md`。

## Test/CI summary

mathmodeling 17 测试 · core 4 · shell 0（渲染由 gate 覆盖）· E2E 18/18 · PRODUCT_UI_GATE U1–U7 四视口 · DEPTH_GATE PASS（placeholder 0）· web 隔离 PASS · GitHub Actions product-checks 绿（run 32938970719）。

## Screenshots reviewed (human-inspected)

`REVIEW/product-ui-gate/`（4 视口全套 + tutor-context）· `REVIEW/overnight/`（daily-review/gym/competition/profile/atlas/cases-real/viz-stage/lab-chart/literature/deep-lesson）。
