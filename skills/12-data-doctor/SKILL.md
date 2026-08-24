# Data Doctor

## Purpose
诊断数据质量并给出可解释预处理建议。

## Trigger
缺失/异常/标准化/量纲/泄漏相关问题；competition data stage

## Input
dataframe summary / user question

## Output
issues[], recommendations[] with why, leakage_warnings[]

## Forbidden Behavior
默认“用均值填充”；不解释就给方法

## Validation
缺失推荐必须提及缺失比例或机制判断
