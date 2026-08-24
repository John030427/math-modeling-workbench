from app.services.data_doctor import diagnose_dataframe, suggest_features
from app.services.model_selector import select_models
from app.services.offline_ai import offline_reply, route_skill
from app.services.registry_loader import filter_models, get_model
from app.services.reviewer import gap_to_training, review_paper
from app.services.srs import schedule_next
import pandas as pd


def test_registry_has_mvp_models():
    ids = {m["id"] for m in filter_models()}
    for need in ["kmeans", "dbscan", "ahp", "topsis", "linear-regression", "random-forest", "arima", "pso"]:
        assert need in ids


def test_kmeans_scaling_tutor():
    r = offline_reply(
        skill="01-tutor",
        mode="copilot",
        message="为什么要标准化？",
        model_id="kmeans",
        knowledge_unit="feature-scaling",
        page="lesson/kmeans",
    )
    assert "量纲" in r["answer"] or "距离" in r["answer"]


def test_coach_does_not_dump_solution():
    r = offline_reply(
        skill="11-modeling-coach",
        mode="coach",
        message="这题答案是什么",
        model_id=None,
        knowledge_unit=None,
        page="gym",
    )
    assert "教练" in r["answer"] or "决策变量" in r["answer"]
    assert "完整答案" in r["answer"] or "guided_questions" in r


def test_data_doctor_scale_issue():
    df = pd.DataFrame({"age": [18, 30, 60], "income": [3000, 50000, 100000]})
    out = diagnose_dataframe(df)
    assert any(i["type"] == "scale" for i in out["issues"])


def test_model_selector_prefers_lp_over_pso():
    out = select_models({"goal": "最小化成本", "problem_type": "optimization", "linear": True, "integer_vars": False})
    assert out["baseline"]["id"] == "lp"


def test_reviewer_penalizes_missing_validation():
    paper = "# 摘要\n用了K-Means。\n## 结果分析\n效果很好。"
    rev = review_paper(paper, "t")
    val = next(d for d in rev["dimensions"] if d["dimension"] == "模型验证")
    assert val["score"] < val["max"] * 0.7
    plan = gap_to_training(rev)
    assert plan


def test_srs_wrong_lowers_mastery():
    m, d, nxt = schedule_next(80, False, 3, 0.3)
    assert m < 80
    assert nxt is not None


def test_route_skill():
    assert route_skill("lesson/kmeans", "为什么要标准化？", "kmeans") == "01-tutor"
    assert route_skill("gym", "决策变量是什么") == "11-modeling-coach"
    assert route_skill("competition", "这里有很多缺失值怎么处理") == "12-data-doctor"


def test_feature_cards():
    cards = suggest_features(["date", "temperature", "humidity", "visitors"])
    assert any(c["feature_name"] == "weekday" for c in cards)
