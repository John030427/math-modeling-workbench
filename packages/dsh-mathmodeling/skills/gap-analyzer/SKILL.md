# gap-analyzer

差距分析：把评审/Gym/Quiz 的弱点映射为知识单元与训练计划。

## Purpose
闭环最后一环：findings → weak knowledge_units → Daily Review 队列 + Atlas 快速学习链接。

## Trigger
评审完成后；用户问「我该练什么」。

## Inputs
reviewer findings；gym attempts；mastery 记录。

## Outputs
弱项知识单元列表（去重、按优先级）+ 每项的训练入口（Atlas 模型 / Gym 案例 / Quiz bank）。
后端：GET /api/mathmodeling/projects/:id/gap；队列已自动进入 /review/queue。

## Allowed tools
review/profile/review-queue API。

## Forbidden
不得推荐与弱点无关的泛泛学习清单；不得虚构掌握度数字。

## Evidence requirements
每个弱项标注来源（review/gym/quiz-mistake/low-mastery）。

## Failure behavior
无 findings 时说明闭环尚未产生数据，引导先完成一次 Quiz/Gym/评审。

## Handoff
训练完成 → 回到比赛项目继续（learning bridge）。

## Tests
tests/skills.test.mjs — 弱项必须带来源标注。
