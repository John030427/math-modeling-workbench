from __future__ import annotations

from typing import Any


def select_models(context: dict[str, Any]) -> dict[str, Any]:
    """Evidence-based model selection — never 'see optimization → PSO'."""
    goal = (context.get("goal") or "").lower()
    problem_type = (context.get("problem_type") or "").lower()
    supervised = bool(context.get("supervised", False))
    temporal = bool(context.get("temporal", False))
    integer = bool(context.get("integer_vars", False))
    linear = bool(context.get("linear", False))
    convex = bool(context.get("convex", False))
    need_explain = bool(context.get("need_explainability", True))
    n_rows = int(context.get("n_rows") or 0)

    baseline: dict[str, Any]
    main: dict[str, Any]
    alternative: dict[str, Any]
    warnings: list[str] = []

    if "cluster" in problem_type or "分群" in goal or "聚类" in goal:
        baseline = _pick("kmeans", "球形簇假设下的强基线；先标准化再试肘部法则。")
        main = _pick("dbscan", "若簇形状不规则或存在噪声，密度聚类更合适。")
        alternative = _pick("hierarchical-clustering", "样本不大时可用层次聚类做结构探索。")
        warnings.append("聚类前必须处理量纲；不要在未验证适用性时死守 K-Means。")
    elif temporal or "时间" in goal or "序列" in problem_type:
        baseline = _pick("arima", "单变量平稳序列的经典基线。")
        main = _pick("arima", "先做平稳性与残差白噪声检验。")
        alternative = _pick("random-forest", "有强外生特征时可用表格模型+滞后特征（注意时间切分）。")
    elif "optim" in problem_type or "优化" in goal or "规划" in goal:
        if linear and not integer:
            baseline = _pick("lp", "线性连续优化应优先线性规划，而非元启发式。")
            main = baseline
            alternative = _pick("milp", "若后续出现整数约束再升级。")
        elif linear and integer:
            baseline = _pick("milp", "线性+整数约束用混合整数规划。")
            main = baseline
            alternative = _pick("ga", "仅当规模导致精确求解不可行时再考虑启发式。")
            warnings.append("能精确求解时不要默认 PSO/GA。")
        elif convex:
            baseline = _pick("nlp", "凸非线性可用成熟求解器。")
            main = baseline
            alternative = _pick("pso", "非凸黑箱时再考虑粒子群，并多随机种子。")
        else:
            baseline = _pick("sa", "非凸时可先模拟退火做对照。")
            main = _pick("pso", "黑箱非凸搜索候选；必须多 seed 与敏感性分析。")
            alternative = _pick("differential-evolution", "另一常用元启发式对照。")
            warnings.append("元启发式无最优保证；报告必须包含多 seed。")
    elif "评价" in goal or "综合" in problem_type or "ranking" in problem_type:
        baseline = _pick("topsis", "多指标排序常用几何方法，需正确处理效益/成本型。")
        main = _pick("ahp", "有专家两两比较时可用 AHP 定权，务必做一致性检验。")
        alternative = _pick("entropy-weight", "客观赋权对照，避免单一主观权重。")
    elif supervised or "预测" in goal or "回归" in problem_type or "分类" in problem_type:
        baseline = _pick("linear-regression", "永远先建立可解释基线并做残差诊断。")
        if n_rows and n_rows < 80:
            main = baseline
            alternative = _pick("random-forest", "小样本慎用复杂模型，先证明必要。")
            warnings.append("小样本优先简单模型与交叉验证。")
        else:
            main = _pick(
                "random-forest" if not need_explain else "linear-regression",
                "需要非线性拟合时用森林；若解释性优先可保持线性并做特征工程。",
            )
            alternative = _pick("xgboost", "作为进阶对照，而非无基线直接上。")
    else:
        baseline = _pick("linear-regression", "默认从可解释基线与问题结构化开始。")
        main = _pick("topsis", "若实质是多方案评价，考虑综合评价族。")
        alternative = _pick("kmeans", "若实质是分群探索，先验证任务类型。")
        warnings.append("问题类型尚不清晰：先完成 Problem Decomposition。")

    return {
        "baseline": baseline,
        "main_model": main,
        "alternative": alternative,
        "warnings": warnings,
        "rationale_summary": "选择依据：目标类型、监督信号、时间结构、线性/整数/凸性、可解释性与样本规模。",
    }


def _pick(model_id: str, why: str) -> dict[str, Any]:
    return {"id": model_id, "why": why}
