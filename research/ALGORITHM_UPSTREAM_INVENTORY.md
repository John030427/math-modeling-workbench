# Algorithm Upstream Inventory — chengziyue1222/math-model-agent

**Pin:** `33cb044009d2dc12e7fa86e4ded6138ddb790d9a` · **License:** MIT · **Local clone:** `~/.dsh/upstream/math-model-agent/code`
**Machine-readable inventory:** `registry/upstream/chengziyue_algorithms.json`（44 个用户可执行方法）
**Bridge:** `packages/algorithm-provider-czy/`（Node → `runner/czy_runner.py` → 上游 Python）

## Module → methods map（用户可执行面）

| Upstream module | Methods integrated | Task family |
|---|---|---|
| evaluation.py | topsis · entropy_weight · ahp_topsis · dea · pca · rsr · fahp · combined_weight · grey_relational | 评价/决策 |
| ahp.py | ahp_weight · hierarchical_ahp | 评价/决策 |
| fuzzy_math.py | fuzzy_comprehensive_evaluation · fuzzy_cmeans | 评价 / 聚类 |
| graph_theory.py | dijkstra · floyd · prim_mst · max_flow · critical_path · min_cost_flow · hungarian_matching | 图论/网络 |
| grey_system.py | grey_correlation · verhulst_predict · grey_auto_predict | 灰色系统 |
| interpolation.py | lagrange_interp · newton_interp · cubic_spline_interp | 插值 |
| math_programming.py | linear_programming · integer_programming · goal_programming · nonlinear_programming | 优化/规划 |
| metaheuristic.py | genetic_algorithm · particle_swarm · simulated_annealing · ant_colony_tsp | 元启发式 |
| monte_carlo.py | monte_carlo_integration · monte_carlo_optimization · queuing_mmsk · random_walk | 仿真 |
| regression.py | linear_regression · ridge_regression · polynomial_regression · logistic_regression | 回归/分类 |
| time_series.py | simple_moving_average · single_exponential_smoothing · triple_exponential_smoothing · gompertz_curve | 时间序列 |
| neural_network.py / image_processing.py / cellular_automata.py | （未集成 — 依赖较重或场景特殊，inventory 留位） | ML/图像/CA |

**合计 46 个集成方法**（含 4 个 callable-spec 方法：nlp/ga/pso/sa 通过 `__preset__`/`__expr__` 受限目标函数）。

## Bridge contract

```json
stdin:  {"module":"evaluation","function":"topsis","params":{...}}
stdout: (上游打印…) "\n===CZY_RESULT===\n" {"ok":true,"result":{...}}
```

- numpy/dataclass/namedtuple → JSON 转换（`convert()`）
- callable 参数：`{"__preset__":"sphere|rastrigin|rosenbrock"}` 或 `{"__expr__":"x[0]**2"}`（受限字符白名单）
- 超时/失败：Node 侧 timeout + `{ok:false,error}`，manifest 记录 `feasible:false`

## Execution verification (live, 2026-08-26)

czy-topsis ✓ · czy-ahp-weight ✓ · czy-dijkstra ✓ · czy-grey-auto-predict ✓ · czy-linreg（项目路径）✓ · czy-dijkstra（项目路径）✓ — 全部经 :3100 API 真实执行。
