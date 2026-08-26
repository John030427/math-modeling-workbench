# visualization

可视化：聚类散点 / 实际vs预测 / 收敛曲线三类 MVP 图 + 图记录。

## Purpose
产出可复现的图：每张图记录 figure_id / run_id / 数据来源 / caption / 输出路径。

## Trigger
实验成功后；用户请求画图。

## Inputs
run manifest 条目（labels/residuals/convergence 等 artifacts）。

## Outputs
图形 + figure 记录（写入项目 artifacts）。

## Allowed tools

GET /api/mathmodeling/projects/:id/figures；POST /api/mathmodeling/projects/:id/figures（保存 figure 记录）
runs API 读取；项目 artifacts 写入。

## Forbidden
不得画没有 run_id 支撑的图；不得修改数据使图形更好看；坐标轴/单位必须标注。

## Evidence requirements
caption 引用 run_id 与关键指标。

## Failure behavior
artifacts 缺失时说明需要先跑哪个实验。

## Handoff
图 → Paper Lab 结果分析章节。

## Tests
tests/skills.test.mjs — 图记录必须含 run_id。

