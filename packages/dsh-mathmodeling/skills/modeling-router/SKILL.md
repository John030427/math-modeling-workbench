# modeling-router

技能路由器：判断用户意图并指到正确的建模技能，自己不执行具体任务。

## Purpose
把用户请求映射到 10-problem-reader / 11-modeling-coach / 12-data-doctor / 13-feature-engineering / 20-model-selector / 21-algorithm-lab / 30-visualization / 40-paper-writer / 41-paper-reviewer / 42-gap-analyzer / 01-tutor 之一。

## Trigger
用户意图不明确或跨多个技能时；或用户直接问「我该用哪个技能」。

## Inputs
用户消息；当前 ModelingContext（GET /api/mathmodeling/context?session_id=…）。

## Outputs
一段路由说明：选中技能 + 理由 + 需要用户补充的输入。

## Allowed tools
context/registry 查询 API。

## Forbidden
不代替目标技能执行任务；不编造技能能力。

## Failure behavior
无法判断时列出 2 个候选技能并向用户提问确认。

## Tests
tests/skills.test.mjs — router 提及目标技能名且不输出完整解题。
