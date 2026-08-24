# Model Coverage

Algorithm & method coverage across benchmark repos vs **math-modeling-workbench** (`registry/models/*.yaml`).

**Integrate?** legend: **Yes** = wrap/import executable · **Registry** = YAML metadata only · **Later** = roadmap · **No** = redundant or out of scope · **Have** = already in our registry

---

## Summary counts

| Source | Declared algorithms/methods | Executable Python modules | Our registry |
|--------|----------------------------|---------------------------|--------------|
| **Ours** | 13 | 0 (selector rules only) | 13 |
| **chengziyue1222/math-model-agent** | 144 exports / 25 files | 25 | — |
| **Barson math-modeling-assistant** | 33 (UI catalog) | snippets in models_data | — |
| **xwangshuo/math-model-agent** | ~10 (knowledge base) | subprocess exec | — |
| **MathMN algorithm-lab registry** | JSON registry in skill assets | PSO runner + experiment runner | — |
| **zhanwen/MathModel** | 十类算法 + folders | MATLAB/docs | — |

---

## Coverage table

| Category | Algorithm / Method | Source Repo | Existing in Ours | Integrate? |
|----------|-------------------|-------------|------------------|------------|
| **Preprocessing** | Missing value handling | czy `data_diagnostics.py` | ⚠️ Data Doctor heuristics | **Yes** — import diagnostics API |
| **Preprocessing** | Outlier detection | czy `data_diagnostics.py` | ⚠️ IQR in Data Doctor | **Yes** |
| **Preprocessing** | Scaling / Normalization | czy + ours Tutor | ✅ K-Means lesson KU | **Have** (lesson); **Yes** exec helpers |
| **Preprocessing** | Encoding | czy diagnostics | ❌ | **Later** |
| **Feature eng.** | Ratio / interaction / lag / rolling | ours Feature cards | ⚠️ rule-based cards | **Yes** — czy `modeling_contracts` patterns |
| **Feature eng.** | PCA | czy `evaluation.py` | ❌ registry | **Registry** |
| **Evaluation** | AHP | czy `ahp.py`, Barson | ✅ `ahp.yaml` | **Yes** — call czy implementation |
| **Evaluation** | Entropy weight | czy `evaluation.py`, Barson | ✅ `entropy-weight.yaml` | **Yes** |
| **Evaluation** | CRITIC | czy `evaluation.py` | ❌ | **Registry** |
| **Evaluation** | TOPSIS | czy `evaluation.py`, Barson | ✅ `topsis.yaml` | **Yes** |
| **Evaluation** | DEA | czy `evaluation.py` | ❌ | **Registry** + **Yes** |
| **Evaluation** | PCA (eval) | czy `evaluation.py` | ❌ | **Registry** |
| **Evaluation** | RSR / FAHP | czy `fuzzy_math.py`, `evaluation.py` | ❌ | **Later** |
| **Evaluation** | Fuzzy comprehensive | czy `fuzzy_math.py` | ❌ | **Later** |
| **Clustering** | K-Means | czy (via sklearn patterns), Barson | ✅ + lesson | **Have**; **Yes** sklearn runner |
| **Clustering** | DBSCAN | Barson, xwangshuo | ✅ `dbscan.yaml` | **Registry** + **Yes** runner |
| **Clustering** | Hierarchical | czy docs, Barson | ✅ stub yaml | **Yes** |
| **Clustering** | GMM | Barson | ❌ | **Registry** |
| **Clustering** | Fuzzy C-means | czy `fuzzy_math.py` | ❌ | **Later** |
| **Classification** | Logistic Regression | czy `regression.py`, Barson | ❌ | **Registry** + **Yes** |
| **Classification** | SVM | Barson | ❌ | **Registry** |
| **Classification** | Random Forest | czy via sklearn, Barson | ✅ `random-forest.yaml` | **Yes** |
| **Classification** | XGBoost | czy, ours yaml | ✅ `xgboost.yaml` | **Yes** |
| **Regression** | Linear Regression | czy `regression.py`, Barson | ✅ `linear-regression.yaml` | **Yes** |
| **Regression** | Polynomial | czy `regression.py` | ❌ | **Registry** |
| **Regression** | Ridge / Lasso | czy `regression.py` | ❌ | **Later** |
| **Time series** | ARIMA | czy `time_series.py`, Barson | ✅ `arima.yaml` | **Yes** |
| **Time series** | GM(1,1) | czy `grey_system.py`, Barson, xwangshuo | ❌ | **Registry** + **Yes** |
| **Time series** | Grey relational | czy `grey_system.py` | ❌ | **Later** |
| **Time series** | Moving avg / smoothing | czy `time_series.py` | ❌ | **Registry** |
| **Time series** | Gompertz / Logistic growth | czy `time_series.py` | ❌ | **Later** |
| **Optimization** | LP | czy `math_programming.py`, MathMN | ✅ `lp.yaml` | **Yes** |
| **Optimization** | MILP | czy `math_programming.py` | ✅ `milp.yaml` | **Yes** |
| **Optimization** | NLP / Goal programming | czy `math_programming.py` | ❌ | **Registry** |
| **Optimization** | Dynamic Programming | czy graph/opt docs | ❌ | **Later** |
| **Metaheuristic** | GA | czy `metaheuristic.py` | ❌ | **Registry** + **Yes** |
| **Metaheuristic** | PSO | czy, MathMN lab, ours | ✅ `pso.yaml` | **Yes** — prefer czy + MathMN aggregate pattern |
| **Metaheuristic** | SA | czy `metaheuristic.py` | ❌ | **Registry** |
| **Metaheuristic** | Differential Evolution | czy, MathMN | ❌ | **Yes** |
| **Metaheuristic** | Ant colony / Fish school | czy `metaheuristic.py` | ❌ | **Later** |
| **Graph** | Dijkstra | czy `graph_theory.py` | ❌ | **Registry** + **Yes** |
| **Graph** | Floyd | czy `graph_theory.py` | ❌ | **Registry** |
| **Graph** | MST | czy `graph_theory.py` | ❌ | **Registry** |
| **Graph** | Max flow / Min cost flow | czy `graph_theory.py` | ❌ | **Later** |
| **Graph** | TSP / VRP | czy, MathMN routing cases | ⚠️ Gym delivery case | **Yes** — Gym + solver |
| **Graph** | Hungarian matching | czy `graph_theory.py` | ❌ | **Later** |
| **Simulation** | Monte Carlo | czy `monte_carlo.py` | ❌ | **Registry** + **Yes** |
| **Simulation** | Queue M/M/c | czy `monte_carlo.py` | ❌ | **Later** |
| **Simulation** | Cellular automata | czy `cellular_automata.py` | ❌ | **Later** |
| **ML deep** | BP / RBF / SOM | czy `neural_network.py` | ❌ | **Later** (not MVP priority) |
| **Spatial** | Spatial contract | MathMN `mathmodel-spatial` | ❌ | **Adapt** for geo problems |
| **Image** | Edge / segmentation | czy `image_processing.py` | ❌ | **No** (niche for undergrad core) |
| **Interpolation** | Spline / Lagrange | czy `interpolation.py` | ❌ | **Registry** |
| **Forecast process** | czy `process_forecasting.py` | ❌ | **Later** |

---

## Priority integration pack (avoid reinventing wheels)

Phase 2 **minimum executable set** (dependency on `chengziyue1222/math-model-agent` as git submodule or pip package — decision in INTEGRATION_DECISIONS.md):

| Pack | Algorithms | Why |
|------|------------|-----|
| **P0 Eval** | TOPSIS, AHP, entropy weight | Match our Atlas MVP models |
| **P0 Cluster** | K-Means, hierarchical (sklearn) | K-Means lesson + Data Doctor CSV demo |
| **P0 Regress** | Linear, RF, ARIMA, GM11 | Prediction baseline discipline |
| **P0 Opt** | LP, MILP, PSO, DE | Gym delivery + anti-PSO-default story |
| **P1 Graph** | Dijkstra, MST | Extend Gym routing case |
| **P1 MC** | monte_carlo_integration | Validation demos |

**Do not duplicate:** implement thin FastAPI adapters that call `from algorithms import ...` with run-manifest logging.

---

## Barson 33 models — mapping note

Barson catalog covers roughly: 线性/多元回归, ARIMA, GM11, BP神经网络, 灰色关联, AHP, TOPSIS, 熵权, 模糊评价, K-means, 层次聚类, Logistic, SVM, RF, 线性/整数/多目标规划, 微分方程, PCA, 蒙特卡洛, 马尔可夫, etc.

~**24/33** overlap with czy library or our registry direction; **9** are prompt-only without czy module (e.g. some DE variants) → **Registry + Later**.

---

## Coverage policy insight (from czy)

`coverage-policy.json` requires **≥80% test coverage** on critical modules (graph, metaheuristic, math_programming, monte_carlo, image_processing). When we integrate, **run their test suite** rather than rewriting algorithms.

---

## Gap statement for share/demo

> 我们 Registry 先覆盖数模高频 **13** 个模型的**知识与教学**；执行层将对接 **math-model-agent** 的 **25** 模块而非重写 TOPSIS/PSO/LP。这是 Benchmark 后的明确决策。
