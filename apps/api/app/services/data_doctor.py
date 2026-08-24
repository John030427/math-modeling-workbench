from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd


def diagnose_dataframe(df: pd.DataFrame) -> dict[str, Any]:
    n = len(df)
    cols: list[dict[str, Any]] = []
    issues: list[dict[str, Any]] = []
    recommendations: list[dict[str, Any]] = []

    for col in df.columns:
        s = df[col]
        missing = int(s.isna().sum())
        missing_ratio = missing / n if n else 0.0
        dtype = str(s.dtype)
        numeric = pd.api.types.is_numeric_dtype(s)
        info: dict[str, Any] = {
            "name": str(col),
            "dtype": dtype,
            "numeric": bool(numeric),
            "missing": missing,
            "missing_ratio": round(missing_ratio, 4),
            "nunique": int(s.nunique(dropna=True)),
        }
        if numeric and s.notna().any():
            vals = s.dropna().astype(float)
            info.update(
                {
                    "min": float(vals.min()),
                    "max": float(vals.max()),
                    "mean": float(vals.mean()),
                    "std": float(vals.std(ddof=0)) if len(vals) else 0.0,
                }
            )
            # outlier via IQR
            q1, q3 = np.percentile(vals, [25, 75])
            iqr = q3 - q1
            if iqr > 0:
                mask = (vals < q1 - 1.5 * iqr) | (vals > q3 + 1.5 * iqr)
                info["outlier_count"] = int(mask.sum())
            else:
                info["outlier_count"] = 0
        cols.append(info)

        if missing_ratio > 0:
            issues.append(
                {
                    "type": "missing",
                    "column": str(col),
                    "severity": missing_ratio,
                    "message": f"{col} 缺失 {missing}/{n} ({missing_ratio:.1%})",
                }
            )
            recommendations.append(_missing_recommendation(str(col), missing_ratio, numeric))

    numeric_cols = [c for c in cols if c["numeric"] and c.get("std", 0) is not None]
    if len(numeric_cols) >= 2:
        ranges = [(c["name"], c.get("max", 0) - c.get("min", 0)) for c in numeric_cols]
        ranges = [(n, r) for n, r in ranges if r and r > 0]
        if ranges:
            max_r = max(r for _, r in ranges)
            min_r = min(r for _, r in ranges)
            if max_r / max(min_r, 1e-9) > 50:
                issues.append(
                    {
                        "type": "scale",
                        "message": "数值特征量纲差异很大，欧氏距离类算法（如 K-Means）前建议标准化。",
                        "columns": [n for n, _ in ranges],
                    }
                )
                recommendations.append(
                    {
                        "action": "standardize",
                        "why": "量纲差异会导致大范围特征主导距离计算，聚类/近邻结果失真。",
                        "methods": ["StandardScaler", "MinMaxScaler", "RobustScaler"],
                    }
                )

    dup = int(df.duplicated().sum())
    if dup:
        issues.append({"type": "duplicate", "count": dup, "message": f"发现 {dup} 行完全重复"})

    return {
        "n_rows": n,
        "n_cols": len(df.columns),
        "columns": cols,
        "issues": issues,
        "recommendations": recommendations,
        "leakage_warnings": _leakage_heuristics(df),
    }


def _missing_recommendation(col: str, ratio: float, numeric: bool) -> dict[str, Any]:
    if ratio > 0.4:
        return {
            "column": col,
            "action": "consider_drop_or_indicator",
            "why": "缺失比例过高，直接均值填充可能引入严重偏差；先判断是否 MNAR，并考虑缺失指示变量或删除。",
            "candidates": ["Drop", "Missing Indicator", "KNN Imputer", "MICE"],
        }
    if numeric:
        return {
            "column": col,
            "action": "diagnose_then_impute",
            "why": "需先判断缺失机制（MCAR/MAR/MNAR）与分布偏态，再选择均值/中位数/插值/模型填充。",
            "candidates": ["Median", "Mean", "Linear interpolation", "KNN Imputer", "MICE"],
        }
    return {
        "column": col,
        "action": "mode_or_separate_category",
        "why": "类别缺失常用众数或单独『缺失』类，避免把缺失 silently 当成多数类。",
        "candidates": ["Mode", "Missing category", "Drop"],
    }


def _leakage_heuristics(df: pd.DataFrame) -> list[str]:
    warnings: list[str] = []
    lower = [str(c).lower() for c in df.columns]
    suspects = ["label", "target", "y_", "future", "answer", "score_final", "result"]
    for c in lower:
        if any(s in c for s in suspects):
            warnings.append(f"列 `{c}` 名称可疑，建模前确认是否为目标或未来信息泄漏。")
    return warnings


def suggest_features(columns: list[str], domain_hint: str = "") -> list[dict[str, Any]]:
    cols_l = [c.lower() for c in columns]
    cards: list[dict[str, Any]] = []

    def has(*keys: str) -> bool:
        return any(any(k in c for k in keys) for c in cols_l)

    if has("pop", "人口") and has("gdp", "产值"):
        cards.append(
            _card(
                "gdp_per_capita",
                "GDP / 人口",
                "人均产出强度",
                "消除规模效应，便于跨区域比较",
                "人口口径不一致会导致偏误",
                "确认人口与 GDP 同期",
                "与目标相关性 / 稳定性检查",
            )
        )
    if has("date", "日期", "time", "时间"):
        cards.append(
            _card(
                "weekday",
                "weekday(date)",
                "星期效应",
                "人类活动常有周周期",
                "节假日与周末混淆",
                "勿用未来日期特征",
                "按 weekday 分组残差",
            )
        )
        cards.append(
            _card(
                "lag_1",
                "y_{t-1}",
                "昨日/上期水平",
                "时间序列强自相关时常有效",
                "预测场景必须严格按时间切分",
                "高：若用同期 y 则泄漏",
                "滚动回测",
            )
        )
        cards.append(
            _card(
                "rolling_7_mean",
                "mean(y_{t-7:t-1})",
                "近一周平均水平",
                "平滑噪声、捕捉短期趋势",
                "窗口穿越训练/测试边界",
                "窗口计算不可含当期标签",
                "滚动预测 MAE",
            )
        )
    if has("temp", "温度") and has("humid", "湿度", "rain", "降雨"):
        cards.append(
            _card(
                "temp_x_humidity",
                "温度 × 湿度",
                "体感/舒适度交互",
                "非线性交互可能影响出行/需求",
                "共线性与过拟合",
                "低",
                "加入前后 CV 对比",
            )
        )
    if not cards:
        cards.append(
            _card(
                "ratio_or_density",
                "关键规模变量之比",
                "相对强度",
                domain_hint or "原始绝对值常被规模主导，比率更具建模意义",
                "分母接近 0",
                "确保分母非目标未来量",
                "业务合理性审查 + CV",
            )
        )
    return cards


def _card(
    name: str,
    formula: str,
    meaning: str,
    why: str,
    risk: str,
    leakage: str,
    validation: str,
) -> dict[str, Any]:
    return {
        "feature_name": name,
        "formula": formula,
        "real_world_meaning": meaning,
        "why_it_may_matter": why,
        "potential_risk": risk,
        "possible_leakage": leakage,
        "validation_method": validation,
    }
