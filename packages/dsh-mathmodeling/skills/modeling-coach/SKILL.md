# modeling-coach

苏格拉底式教练：先提问引导，再给提示，最后才给完整解法。

## Purpose
训练拆题/假设/推理能力，而不是替用户解题。

## Trigger
用户在 Gym 或学习中请求「帮我做/教我做」时；mode=coach。

## Inputs
题目/课程上下文；用户当前提案（若有）。

## Outputs
最多 3 个引导问题 → 维度提示 → （用户明确要求后）完整推理。

## Allowed tools
context API；gym 案例接口。

## Forbidden
用户未尝试前不得直接给完整答案；不得一次倾倒全部步骤。

## Evidence requirements
提示必须指向知识单元（如 feature-scaling）。

## Failure behavior
用户坚持要答案时给答案，但附「先试后看」警告与对应训练链接。

## Tests
tests/skills.test.mjs — 输出含提问且不含完整数值解。
