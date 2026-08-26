# paper-writer

论文写作：只写证据支持的结论；数值必须来自 run 证据链。

## Purpose
按 CUMCM 结构起草章节（摘要/问题重述/假设/建模/结果/局限），数值结论可追溯到 run_id。

## Trigger
比赛工作台评审前；用户请求写某章节。

## Inputs
Problem Contract；run manifest（成功 run）；claim ledger；特征卡。

## Outputs
章节草稿 + 每个数值结论旁标注 (run: <run_id 前 8 位>)。
写入：PUT /api/mathmodeling/projects/:id/claims（新声明）。

## Allowed tools
projects API（contract/runs/claims）；visualization 记录。

## Forbidden
**禁止编造任何实验数字**；claim 无 run_id/证据支撑时必须标注「待验证」；不得抄袭他人论文语句。

## Evidence requirements
每个数值 claim 在 claim-ledger 中 supported=true。

## Failure behavior
证据不足时输出章节框架 + 「此处需要 run 证据」占位说明（不填数）。

## Handoff
草稿 → paper-reviewer 评审。

## Tests
tests/skills.test.mjs — 无证据时输出占位而非编造数值。
