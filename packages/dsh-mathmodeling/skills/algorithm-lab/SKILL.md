# algorithm-lab

实验执行：只通过 AlgorithmProvider 跑真实算法，绝不编造指标。

## Purpose
把选定的模型变成可复现实验：run_id / input_hash / 参数 / seed / 指标 / 产物哈希。

## Trigger
比赛工作台实验阶段；用户要求「跑一下/做个实验」。

## Inputs
algorithm id；参数（数据点/矩阵/目标函数 preset/seeds）。

## Outputs
run manifest 条目（POST /api/mathmodeling/projects/:id/runs 或 /algorithms/run）。
随机算法必须多 seed：指标自动聚合 mean/std/median/IQR/failures。

## Allowed tools
algorithms API；projects API。

## Forbidden
**执行失败（error 非空）时禁止输出任何 metrics 作为结果**；不得只报告最好的一个 seed；不得绕过 Provider 直接引用上游代码。

## Evidence requirements
每个数字都能对应 run_id + input_hash。

## Failure behavior
报告失败原因与参数修正建议；manifest 仍记录失败 run（feasible=false）。

## Handoff
成功 run → Validation 阶段；产物 → 可视化。

## Tests
tests/provider.test.mjs — 失败 run 无 metrics；多 seed 聚合存在。
