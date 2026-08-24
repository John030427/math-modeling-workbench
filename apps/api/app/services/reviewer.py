from __future__ import annotations

import re
from typing import Any


RUBRIC = [
    ("问题理解", 10, ["问题", "重述", "目标", "约束", "假设"]),
    ("数据处理", 10, ["缺失", "异常", "预处理", "标准化", "清洗"]),
    ("特征工程", 10, ["特征", "构造", "比率", "滞后", "交互"]),
    ("模型合理性", 15, ["模型", "选择", "适用", "假设", "baseline", "基线"]),
    ("数学严谨性", 10, ["公式", "符号", "推导", "定义"]),
    ("算法与求解", 10, ["算法", "求解", "实现", "复杂度"]),
    ("模型验证", 10, ["验证", "交叉", "敏感性", "稳健", "残差", "误差"]),
    ("结果解释", 10, ["结果", "解释", "含义", "分析"]),
    ("创新性", 5, ["创新", "改进", "新"]),
    ("图表表达", 5, ["图", "表", "可视化", "Figure"]),
    ("论文写作", 5, ["摘要", "结构", "参考文献", "结论"]),
]


def review_paper(text: str, title: str = "untitled") -> dict[str, Any]:
    """Evidence-grounded training rubric (not official contest scoring)."""
    text_n = text or ""
    lower = text_n.lower()
    scores: list[dict[str, Any]] = []
    evidence: list[dict[str, Any]] = []
    total = 0

    for name, max_score, keys in RUBRIC:
        hits = [k for k in keys if k.lower() in lower or k in text_n]
        density = len(hits) / max(len(keys), 1)
        # length prior: very short sections score lower
        length_factor = min(1.0, len(text_n) / 2500)
        raw = max_score * (0.35 + 0.5 * density + 0.15 * length_factor)
        # penalties
        if name == "模型验证" and not any(k in lower for k in ["验证", "敏感性", "交叉", "稳健", "validation"]):
            raw *= 0.45
            evidence.append(
                {
                    "dimension": name,
                    "finding": "未发现明确的模型验证/敏感性/交叉验证表述",
                    "severity": "validation_missing",
                }
            )
        if name == "特征工程" and not any(k in text_n for k in ["特征", "构造", "比率", "滞后"]):
            raw *= 0.5
            evidence.append(
                {
                    "dimension": name,
                    "finding": "缺少特征构造相关证据",
                    "severity": "feature_engineering_thin",
                }
            )
        if name == "模型合理性" and "pso" in lower and "线性规划" not in text_n and "lp" not in lower:
            if "优化" in text_n:
                evidence.append(
                    {
                        "dimension": name,
                        "finding": "出现启发式优化但未见与精确方法/基线对照的讨论",
                        "severity": "heuristic_without_baseline",
                    }
                )
                raw *= 0.85
        score = round(min(max_score, max(0.0, raw)), 1)
        total += score
        snippet = _snippet(text_n, hits[0]) if hits else None
        scores.append(
            {
                "dimension": name,
                "score": score,
                "max": max_score,
                "evidence_terms": hits[:5],
                "snippet": snippet,
            }
        )

    total = round(total, 1)
    gaps = sorted(scores, key=lambda s: s["score"] / s["max"])[:3]
    return {
        "title": title,
        "rubric": "Modeling Training Rubric",
        "disclaimer": "训练型评分，非官方竞赛评分。",
        "total": total,
        "max_total": 100,
        "dimensions": scores,
        "evidence": evidence,
        "gaps": [
            {
                "dimension": g["dimension"],
                "score": g["score"],
                "max": g["max"],
                "ratio": round(g["score"] / g["max"], 2),
            }
            for g in gaps
        ],
    }


def gap_to_training(review: dict[str, Any]) -> list[dict[str, Any]]:
    mapping = {
        "特征工程": ("Feature Engineering", 3, "gym"),
        "模型验证": ("Model Validation", 2, "daily-review"),
        "数据处理": ("Data Preprocessing", 2, "data-doctor"),
        "模型合理性": ("Model Selection", 2, "atlas"),
        "算法与求解": ("Algorithm Practice", 2, "gym"),
        "数学严谨性": ("Math Rigor", 1, "atlas"),
        "图表表达": ("Visualization", 1, "paper-lab"),
        "论文写作": ("Paper Writing", 1, "paper-lab"),
        "问题理解": ("Problem Decomposition", 2, "gym"),
        "结果解释": ("Result Interpretation", 1, "gym"),
        "创新性": ("Case Study Transfer", 1, "gym"),
    }
    plan = []
    for g in review.get("gaps", []):
        dim = g["dimension"]
        name, count, module = mapping.get(dim, ("General Modeling", 1, "gym"))
        plan.append(
            {
                "focus": name,
                "dimension": dim,
                "recommended_drills": count,
                "module": module,
                "reason": f"{dim} 仅 {g['score']}/{g['max']}，优先补强。",
            }
        )
    return plan


def _snippet(text: str, key: str, radius: int = 60) -> str | None:
    m = re.search(re.escape(key), text, flags=re.IGNORECASE)
    if not m:
        return None
    a = max(0, m.start() - radius)
    b = min(len(text), m.end() + radius)
    return text[a:b].replace("\n", " ")
