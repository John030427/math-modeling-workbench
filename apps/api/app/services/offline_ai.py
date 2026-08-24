from __future__ import annotations

from typing import Any

from app.services.registry_loader import get_model


def route_skill(page: str | None, message: str, model_id: str | None = None) -> str:
    msg = (message or "").lower()
    page = page or ""

    # Learning pages: conceptual questions stay with Tutor (incl. scaling why)
    on_lesson = page.startswith("lesson") or page.startswith("atlas") or bool(model_id)
    conceptual = any(
        k in message
        for k in ["为什么", "什么", "区别", "例子", "简单", "公式", "适用", "不适合", "dbscan", "直觉"]
    )
    if on_lesson and conceptual:
        return "01-tutor"

    if any(k in msg for k in ["缺失", "异常", "预处理", "outlier", "missing"]) or (
        any(k in message for k in ["标准化", "量纲", "填充"]) and not on_lesson
    ):
        return "12-data-doctor"
    if any(k in msg for k in ["特征", "feature", "lag", "比率"]):
        return "13-feature-engineering"
    if any(k in msg for k in ["选模型", "用什么模型", "model select", "该用"]):
        return "20-model-selector"
    if any(k in msg for k in ["论文", "摘要", "写作", "paper"]):
        return "40-paper-writer"
    if any(k in msg for k in ["评分", "评审", "review", "扣分"]):
        return "41-paper-reviewer"
    if any(k in msg for k in ["差距", "薄弱", "不会", "gap"]):
        return "42-gap-analyzer"
    if "gym" in page or any(k in msg for k in ["变量", "约束", "目标函数", "决策"]):
        return "11-modeling-coach"
    if on_lesson:
        return "01-tutor"
    return "00-router"


def offline_reply(
    *,
    skill: str,
    mode: str,
    message: str,
    model_id: str | None,
    knowledge_unit: str | None,
    page: str | None,
) -> dict[str, Any]:
    model = get_model(model_id) if model_id else None
    mode = mode or "copilot"

    if skill == "11-modeling-coach" or mode == "coach":
        return _coach(message, mode)

    if skill == "12-data-doctor":
        return {
            "skill": skill,
            "mode": mode,
            "answer": (
                "处理缺失前请按链路思考：缺失比例 → 变量类型 → 是否时间/空间结构 → "
                "MCAR/MAR/MNAR → 是否携带信息 → 再选 Mean/Median/插值/KNN/MICE/Indicator/Drop。"
                "不要默认均值填充。"
            ),
            "hints": ["先报告每列缺失比例", "画出缺失模式", "说明为什么选该方法"],
            "offline": True,
        }

    if skill == "20-model-selector":
        return {
            "skill": skill,
            "mode": mode,
            "answer": (
                "模型选择顺序：先判定任务类型与约束结构，再给 Baseline / Main / Alternative，"
                "并解释线性可解时为何不要默认 PSO。"
            ),
            "offline": True,
        }

    # Tutor default — context aware
    if model and model_id == "kmeans":
        return _kmeans_tutor(message, mode, knowledge_unit)

    if model:
        return {
            "skill": "01-tutor",
            "mode": mode,
            "answer": _generic_model_tutor(model, message, mode),
            "context": {"model_id": model_id, "page": page, "knowledge_unit": knowledge_unit},
            "offline": True,
        }

    return {
        "skill": skill,
        "mode": mode,
        "answer": (
            "我是工作台助手。可以结合当前页面帮你学算法、拆题、做数据诊断或论文评审。"
            "请告诉我你在哪个模块，或打开具体模型课程。"
        ),
        "offline": True,
    }


def _kmeans_tutor(message: str, mode: str, ku: str | None) -> dict[str, Any]:
    msg = message.lower()
    if any(k in message for k in ["标准化", "归一化", "scaling", "scale", "量纲"]):
        answer = (
            "因为 K-Means 用欧氏距离。若收入是 3000–100000、年龄是 18–65，"
            "收入会主导距离，年龄几乎不起作用。标准化让各维可比。"
            "DBSCAN 同样基于距离/密度，通常也需要先处理量纲。"
        )
        if mode == "coach":
            answer = (
                "先别急着听结论：如果两个特征的数值范围差了几个数量级，"
                "欧氏距离会更听谁的？试着举一个你数据里的例子。"
            )
        return {
            "skill": "01-tutor",
            "mode": mode,
            "answer": answer,
            "related_ku": ["feature-scaling", "distance"],
            "offline": True,
        }
    if "dbscan" in msg:
        return {
            "skill": "01-tutor",
            "mode": mode,
            "answer": (
                "K-Means 假设簇大致球形并需指定 K；DBSCAN 基于密度，可找不规则簇并标记噪声，"
                "但不保证每个点都有簇标签，且对 eps/min_samples 敏感。"
            ),
            "related_ku": ["kmeans-vs-dbscan"],
            "offline": True,
        }
    if any(k in message for k in ["为什么", "直觉", "干什么"]):
        base = "K-Means 解决的是：把相似样本分到同一组，使组内更紧、组间更分离（以到中心距离衡量）。"
        if mode == "coach":
            base = "如果老板让你把客户分成几类以便运营，你直觉上会怎么定义『像一类』？"
        return {"skill": "01-tutor", "mode": mode, "answer": base, "offline": True}

    return {
        "skill": "01-tutor",
        "mode": mode,
        "answer": (
            f"当前上下文：K-Means"
            + (f" / 知识点 {ku}" if ku else "")
            + "。你可以问：为什么要标准化？如何选 K？和 DBSCAN 区别？常见错误有哪些？"
        ),
        "offline": True,
    }


def _generic_model_tutor(model: dict[str, Any], message: str, mode: str) -> str:
    name = model.get("name_zh") or model.get("name")
    if mode == "coach":
        return f"我们在看 {name}。先问你：它主要解决哪类问题？适用条件你能说一条吗？"
    use = "；".join((model.get("use_when") or [])[:2])
    avoid = "；".join((model.get("avoid_when") or [])[:2])
    return (
        f"【{name}】{model.get('summary', '')}\n"
        f"适用：{use}\n慎用：{avoid}\n"
        f"针对你的问题：「{message}」——请结合适用/慎用条件判断，不要只记算法名字。"
    )


def _coach(message: str, mode: str) -> dict[str, Any]:
    steps = [
        "这句话里，什么是你能控制的决策变量？",
        "优化或预测的目标是什么（最小化/最大化/拟合什么）？",
        "有哪些硬约束（容量、时间窗、预算）？",
        "数据是截面、时间序列还是网络结构？",
        "这更像评价 / 聚类 / 预测 / 优化中的哪一类？",
    ]
    return {
        "skill": "11-modeling-coach",
        "mode": "coach",
        "answer": (
            "教练模式：我不会直接给完整答案。我们一步步结构化问题。\n"
            f"就你说的「{message}」，先回答：决策变量、目标、约束分别可能是什么？"
        ),
        "guided_questions": steps,
        "hints_available": True,
        "offline": True,
    }
