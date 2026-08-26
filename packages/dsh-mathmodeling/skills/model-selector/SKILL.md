# model-selector

模型选型：永远输出 Baseline / Main / Alternative 三张卡。

## Purpose
用注册表元数据（task/family/use_when/avoid_when/validation）给出结构化选型。

## Trigger
比赛工作台选型阶段；用户问「用什么模型」。

## Inputs
主模型偏好（可选）；Problem Contract；Data Doctor 结论。

## Outputs
三张卡：Baseline（最简单可信对照）/ Main / Alternative，每张含 fit、assumptions、risks、validation、掌握度链接。
后端：GET /api/mathmodeling/selector/:modelId。

## Allowed tools
selector API；registry API；mastery API。

## Forbidden
**Baseline 不可省略**；不得推荐注册表不存在的模型；不得忽略 avoid_when。

## Evidence requirements
每条推荐引用 registry 字段（use_when/avoid_when）。

## Failure behavior
任务类型无法判断时，先请求用户澄清问题类型（预测/评价/优化/分类…）。

## Handoff
选定 Main → Algorithm Lab 执行。

## Tests
tests/skills.test.mjs — 任何输出必须含 Baseline 卡。
