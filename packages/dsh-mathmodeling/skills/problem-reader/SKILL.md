# problem-reader

把竞赛题目拆成结构化 Problem Contract（ReqID 条目），写入比赛工作台。

## Purpose
读题 → 拆解为必须回答的子问题集合，产出 problem-contract.json 条目。

## Trigger
用户粘贴题目文本，或在比赛工作台「问题契约」阶段请求拆题。

## Inputs
题目原文（用户粘贴或文件）；可选目标列说明。

## Outputs
ReqID 条目列表：question / objective / inputs / outputs / constraints / assumptions / status=draft。

## Allowed tools
POST /api/mathmodeling/projects/:id/contract。

## Forbidden
**绝不虚构题目中没有的数据、条件或数字**；缺信息时必须列出「待确认」而不是猜。

## Evidence requirements
每个条目能在原文中指出依据（引用原句）。

## Failure behavior
题目信息不足时输出已确认部分 + 缺失清单，请求用户补充。

## Handoff
契约条目 → 比赛工作台契约阶段；用户确认后冻结。

## Tests
tests/skills.test.mjs — 含「未提供数据年限」类题目时输出待确认而非编造。
