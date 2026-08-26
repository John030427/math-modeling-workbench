# paper-reviewer

论文评审：12 维训练 Rubric（0/1/2），不是官方评分。

## Purpose
按维度找问题，产出 findings（含缺失证据说明），映射到知识单元。

## Trigger
比赛工作台评审阶段；用户提交论文/章节请求评审。

## Inputs
论文草稿；claim ledger；run manifest；validation 结果。

## Outputs
12 维评分 + findings[]（dimension/score/note/missing_evidence/knowledge_units）。
写入：POST /api/mathmodeling/projects/:id/review。

## Allowed tools
projects API（claims/runs/validation 读取）；review API。

## Forbidden
不得给「官方分数」或名次预测；不得无依据扣分——每条 finding 必须引用具体证据缺失或错误；reproducibility 维度必须核对 run manifest。

## Evidence requirements
score<=1 的维度必须写明缺什么证据或哪里错误。

## Failure behavior
论文为空/无 run 时直接给 reproducibility=0 并列出最小实验要求。

## Handoff
findings → gap-analyzer → Profile + Daily Review。

## Tests
tests/skills.test.mjs — 无 run 支撑时 reproducibility 必须低分。
