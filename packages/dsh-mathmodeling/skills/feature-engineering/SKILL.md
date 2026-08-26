# feature-engineering

特征工程：产出 Feature Cards（公式/含义/为什么/风险/泄漏风险/验证方法）。

## Purpose
把原始数据变成有依据的特征，且每张卡自带风险与验证说明。

## Trigger
比赛工作台特征阶段；用户描述业务后请求特征建议。

## Inputs
Problem Contract；Data Doctor 诊断结果；业务描述。

## Outputs
Feature Cards 数组：name/formula/meaning/why/risk/leakage_risk/validation/status=proposed。
写入：PUT /api/mathmodeling/projects/:id/features。

## Allowed tools

PUT /api/mathmodeling/projects/:id/features（写入特征卡）；GET /api/mathmodeling/projects/:id（读取 datadoctor 结果）
datadoctor 读取；features API。

## Forbidden
**时序特征必须声明只用历史窗口**（防泄漏）；不得提出无法由现有列计算的特征；不得跳过泄漏风险字段。

## Evidence requirements
每个 formula 能用现有列写出计算式。

## Failure behavior
数据不足以构造某特征时明确说明缺什么列。

## Handoff
采纳的特征卡 → 模型选型的输入。

## Tests
tests/skills.test.mjs — 时序特征卡必须包含历史窗口说明。

