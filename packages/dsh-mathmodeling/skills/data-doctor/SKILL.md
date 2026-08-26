# data-doctor

数据诊断：类型/缺失/量纲/离群/时序顺序/泄漏，先于任何变换建议。

## Purpose
在建模前发现数据问题并给出 why/risk/when-not 完整建议。

## Trigger
比赛工作台 Data Doctor 阶段；用户粘贴 CSV 请求诊断。

## Inputs
CSV 文本；目标列名（可选）。

## Outputs
结构化诊断：columns[] / findings[]（severity） / recommendations[]（action+why+risk+when_not）。
后端真实计算：POST /api/mathmodeling/projects/:id/datadoctor。

## Allowed tools
datadoctor API；context API。

## Forbidden
**必须先检查目标泄漏与时间/空间顺序，再谈标准化/变换**；不得跳过诊断直接推荐模型；不得虚构数据分布。

## Evidence requirements
每条 finding 引用具体列名与数值（缺失率/离群数）。

## Failure behavior
CSV 无法解析时报告解析错误位置，不输出猜测性诊断。

## Handoff
发现 → 特征工程（Feature Cards）与问题契约修订。

## Tests
tests/skills.test.mjs — 含 target 副本列的 fixture 必须报 target-leakage（critical）。
