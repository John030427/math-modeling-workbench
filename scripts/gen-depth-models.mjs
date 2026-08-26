/**
 * Depth Atlas expansion — generate YAML entries for czy-provider methods.
 * Metadata distilled from upstream docstrings (math-model-agent @ 33cb0440, MIT) + standard modeling knowledge.
 * Existing 13 models are updated with execution_supported instead of duplicated.
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIR = join(ROOT, 'registry/models')
const UPSTREAM = JSON.parse(readFileSync(join(ROOT, 'registry/upstream/chengziyue_algorithms.json'), 'utf8'))

// models that already exist in registry/models — link execution, do not duplicate
const EXISTING_LINK = {
  topsis: 'czy-topsis',
  'entropy-weight': 'czy-entropy-weight',
  ahp: 'czy-ahp-weight',
  'linear-regression': 'czy-linreg',
  lp: 'czy-lp',
  pso: 'czy-pso',
}

const M = []
function m(entry) {
  M.push(entry)
}

/* ---------- 评价 / 决策 ---------- */
m({ id: 'czy-ahp-topsis', name: 'AHP-TOPSIS Combined Weighting', name_zh: 'AHP+熵权组合赋权 TOPSIS', task: 'evaluation', family: 'evaluation', difficulty: 'beginner', kus: ['topsis', 'ahp', 'entropy-weight', 'combined-weighting'], use_when: ['既想要专家经验又想要客观信息的组合权重', '指标较多且量纲不一'], avoid_when: ['指标间强相关导致权重重复计算'], summary: '主观 AHP 权重与客观熵权按比例融合后做 TOPSIS 排序，兼顾经验与数据。' })
m({ id: 'czy-dea', name: 'DEA (CCR)', name_zh: '数据包络分析 CCR', task: 'evaluation', family: 'evaluation', difficulty: 'intermediate', kus: ['dea', 'efficiency-frontier', 'decision-making-unit'], use_when: ['多投入多产出的相对效率评价（学校/医院/城市）'], avoid_when: ['投入产出边界不清晰', '决策单元过少（<投入产出数两倍）'], summary: '以线性规划构造生产前沿，评价同类型决策单元的相对有效性与规模报酬。' })
m({ id: 'czy-pca', name: 'PCA', name_zh: '主成分分析', task: 'dimension-reduction', family: 'evaluation', difficulty: 'beginner', kus: ['pca', 'eigenvalue', 'variance-explained', 'loading'], use_when: ['高维相关指标降维', '构造综合评价主成分得分'], avoid_when: ['指标都需要保留原始业务含义', '样本量远小于指标数'], summary: '正交变换把相关指标压缩为少数主成分，按方差贡献率保留信息。' })
m({ id: 'czy-rsr', name: 'RSR', name_zh: '秩和比综合评价', task: 'evaluation', family: 'evaluation', difficulty: 'beginner', kus: ['rsr', 'rank-based', 'probit'], use_when: ['多指标分档排序（医院质量、地区评价）'], avoid_when: ['指标极少或需要精确数值差距'], summary: '按秩次计算秩和比并分档，配合 Probit 回归做分档排序。' })
m({ id: 'czy-fahp', name: 'FAHP', name_zh: '模糊层次分析法', task: 'evaluation', family: 'evaluation', difficulty: 'intermediate', kus: ['fahp', 'fuzzy-consistency'], use_when: ['专家两两比较难以精确给出比例标度时'], avoid_when: ['可精确构造 1-9 标度判断矩阵'], summary: '用模糊一致矩阵替代严格判断矩阵，降低一致性调整成本。' })
m({ id: 'czy-combined-weight', name: 'Combined Weighting', name_zh: '主客观组合赋权', task: 'evaluation', family: 'evaluation', difficulty: 'beginner', kus: ['combined-weighting', 'subjective-objective'], use_when: ['已有两套权重希望融合'], avoid_when: ['两套权重严重冲突且无法解释'], summary: '乘法/加法合成主观与客观权重，alpha 控制倾向。' })
m({ id: 'czy-grey-relational', name: 'Grey Relational Analysis', name_zh: '灰色关联分析', task: 'evaluation', family: 'grey', difficulty: 'beginner', kus: ['grey-correlation', 'reference-sequence'], use_when: ['小样本序列与参考序列的关联程度排序'], avoid_when: ['大样本且分布已知时可用相关系数'], summary: '计算各比较序列与参考序列的关联系数与关联度，用于因素分析和方案排序。' })

/* ---------- AHP ---------- */
m({ id: 'czy-hierarchical-ahp', name: 'Hierarchical AHP', name_zh: '多层次 AHP', task: 'evaluation', family: 'evaluation', difficulty: 'intermediate', kus: ['hierarchical-ahp', 'criteria-layer', 'composite-weight'], use_when: ['目标-准则-方案多层结构综合权重'], avoid_when: ['层次结构不清晰'], summary: '自上而下合成各层判断矩阵权重，得到方案层综合权重。' })

/* ---------- 模糊 ---------- */
m({ id: 'czy-fuzzy-comprehensive', name: 'Fuzzy Comprehensive Evaluation', name_zh: '模糊综合评价', task: 'evaluation', family: 'fuzzy', difficulty: 'intermediate', kus: ['fuzzy-evaluation', 'membership-degree', 'comment-set'], use_when: ['评语有模糊边界（好/中/差）的综合评价'], avoid_when: ['指标可精确量化且评语清晰'], summary: '隶属度矩阵 + 权重合成，得到对各评语等级的隶属分布。' })
m({ id: 'czy-fuzzy-cmeans', name: 'Fuzzy C-Means', name_zh: '模糊 C 均值聚类', task: 'clustering', family: 'fuzzy', difficulty: 'intermediate', kus: ['fuzzy-cmeans', 'membership-matrix', 'fuzzifier'], use_when: ['样本边界模糊、需要隶属度而非硬归属'], avoid_when: ['需要硬划分或簇形状强非凸'], summary: '软聚类：每个样本以隶属度属于各簇，迭代最小化加权误差。' })

/* ---------- 图论 ---------- */
m({ id: 'czy-dijkstra', name: 'Dijkstra', name_zh: 'Dijkstra 最短路', task: 'graph', family: 'graph', difficulty: 'beginner', kus: ['dijkstra', 'shortest-path', 'greedy'], use_when: ['非负权单源最短路（配送、管网）'], avoid_when: ['存在负权边'], summary: '贪心扩展的单源最短路算法，给出源点到各点最短距离与路径。' })
m({ id: 'czy-floyd', name: 'Floyd', name_zh: 'Floyd 全源最短路', task: 'graph', family: 'graph', difficulty: 'beginner', kus: ['floyd', 'dynamic-programming', 'all-pairs'], use_when: ['需要所有点对最短路（选址、可达性）'], avoid_when: ['大规模稀疏图（用 Dijkstra 多源）'], summary: '动态规划三重循环求全源最短路，可回溯路径。' })
m({ id: 'czy-prim-mst', name: 'Prim MST', name_zh: 'Prim 最小生成树', task: 'graph', family: 'graph', difficulty: 'beginner', kus: ['mst', 'prim', 'greedy'], use_when: ['最小成本连通（管网/电网铺设）'], avoid_when: ['需要次优或约束树形'], summary: '贪心扩张构造最小总权连通树。' })
m({ id: 'czy-max-flow', name: 'Max Flow', name_zh: '最大流', task: 'graph', family: 'graph', difficulty: 'intermediate', kus: ['max-flow', 'capacity-network', 'augmenting-path'], use_when: ['网络容量上限问题（运输/调度瓶颈）'], avoid_when: ['无容量约束的网络'], summary: '在容量网络中求源到汇的最大流量。' })
m({ id: 'czy-critical-path', name: 'Critical Path (CPM)', name_zh: '关键路径法', task: 'graph', family: 'graph', difficulty: 'beginner', kus: ['cpm', 'aoe-network', 'slack'], use_when: ['工程工期与工序调度'], avoid_when: ['工序可任意并行的柔性项目'], summary: 'AOE 网上求最长路径，识别决定总工期的关键工序。' })
m({ id: 'czy-min-cost-flow', name: 'Min-Cost Flow', name_zh: '最小费用流', task: 'graph', family: 'graph', difficulty: 'intermediate', kus: ['min-cost-flow', 'successive-shortest-path'], use_when: ['满足流量需求同时最小化费用'], avoid_when: ['只关心容量不关心成本'], summary: '在容量与费用网络中求最小费用最大流。' })
m({ id: 'czy-hungarian', name: 'Hungarian Matching', name_zh: '匈牙利指派法', task: 'graph', family: 'graph', difficulty: 'intermediate', kus: ['hungarian', 'assignment-problem'], use_when: ['人-任务一一指派最小化总成本'], avoid_when: ['多人多任务非一一匹配'], summary: '多项式时间求解指派问题的最优匹配。' })

/* ---------- 灰色 ---------- */
m({ id: 'czy-grey-correlation-rank', name: 'Grey Relational Ranking', name_zh: '灰色关联排序', task: 'grey', family: 'grey', difficulty: 'beginner', kus: ['grey-correlation', 'ranking'], use_when: ['小样本方案与理想序列的贴近排序'], avoid_when: ['大样本统计显著性问题'], summary: '以关联度大小对方案/因素排序，是灰色关联分析的排序应用。' })
m({ id: 'czy-verhulst', name: 'Verhulst Prediction', name_zh: 'Verhulst 饱和预测', task: 'grey', family: 'grey', difficulty: 'beginner', kus: ['verhulst', 's-curve', 'saturation'], use_when: ['具有饱和/S 形态的小样本序列（生长、普及率）'], avoid_when: ['持续指数增长无饱和迹象'], summary: '灰色 Verhulst 模型拟合 S 形饱和过程并外推。' })
m({ id: 'czy-grey-auto-predict', name: 'Grey Auto Predict', name_zh: '灰色预测自动选型', task: 'grey', family: 'grey', difficulty: 'beginner', kus: ['gm11', 'gm21', 'verhulst', 'model-selection'], use_when: ['不确定哪种灰色模型合适，让程序按误差自动选'], avoid_when: ['需要指定单一模型做论文公式推导'], summary: '自动拟合 GM(1,1)/GM(2,1)/Verhulst，按平均相对误差择优并给出检验指标。' })

/* ---------- 插值 ---------- */
m({ id: 'czy-lagrange', name: 'Lagrange Interpolation', name_zh: '拉格朗日插值', task: 'interpolation', family: 'interpolation', difficulty: 'beginner', kus: ['lagrange', 'interpolation-polynomial'], use_when: ['少节点精确插值'], avoid_when: ['节点多（龙格现象）'], summary: '构造过所有节点的多项式插值。' })
m({ id: 'czy-newton-interp', name: 'Newton Interpolation', name_zh: '牛顿插值', task: 'interpolation', family: 'interpolation', difficulty: 'beginner', kus: ['newton-divided-difference'], use_when: ['节点递增式添加的插值'], avoid_when: ['高阶振荡'], summary: '差商表构造的插值多项式，便于增量计算。' })
m({ id: 'czy-cubic-spline', name: 'Cubic Spline', name_zh: '三次样条插值', task: 'interpolation', family: 'interpolation', difficulty: 'beginner', kus: ['cubic-spline', 'smoothness'], use_when: ['需要光滑曲线（大量节点也稳定）'], avoid_when: ['只需要端点外推'], summary: '分段三次多项式保证二阶光滑，是数据补全的默认选择。' })

/* ---------- 规划 ---------- */
m({ id: 'czy-ip', name: 'Integer Programming', name_zh: '整数规划', task: 'optimization', family: 'programming', difficulty: 'intermediate', kus: ['integer-variables', 'branch-and-bound'], use_when: ['决策变量必须整数（选点/指派/开闭）'], avoid_when: ['变量连续即可'], summary: '带整数约束的线性优化，分支定界求解。' })
m({ id: 'czy-goal-programming', name: 'Goal Programming', name_zh: '目标规划', task: 'optimization', family: 'programming', difficulty: 'intermediate', kus: ['goal-programming', 'priority', 'deviation-variables'], use_when: ['多个目标无法同时满足需按优先级折中'], avoid_when: ['单一目标清晰'], summary: '引入偏差变量与优先级，软约束逐级满足。' })
m({ id: 'czy-nlp', 'name': 'Nonlinear Programming', name_zh: '非线性规划', task: 'optimization', family: 'programming', difficulty: 'intermediate', kus: ['nlp', 'slsqp', 'local-optimum'], use_when: ['目标或约束非线性且光滑'], avoid_when: ['目标不连续/不可导（用元启发式）'], summary: 'SLSQP 等方法求解带约束非线性规划，注意局部最优。' })

/* ---------- 元启发式 ---------- */
m({ id: 'czy-ga', name: 'Genetic Algorithm', name_zh: '遗传算法', task: 'metaheuristic', family: 'metaheuristic', difficulty: 'intermediate', kus: ['ga', 'crossover', 'mutation', 'selection'], use_when: ['复杂/离散/黑盒优化'], avoid_when: ['问题可精确求解（LP）时'], summary: '种群选择-交叉-变异迭代搜索，参数敏感需多跑。' })
m({ id: 'czy-pso', name: 'Particle Swarm (upstream)', name_zh: '粒子群（上游实现）', task: 'metaheuristic', family: 'metaheuristic', difficulty: 'intermediate', kus: ['pso', 'swarm', 'inertia-weight'], use_when: ['连续优化与本地 PSO 交叉验证'], avoid_when: ['确定性算法足够'], summary: '上游粒子群实现，可与本地 PSO 互为对照。' })
m({ id: 'czy-sa', name: 'Simulated Annealing', name_zh: '模拟退火', task: 'metaheuristic', family: 'metaheuristic', difficulty: 'intermediate', kus: ['sa', 'temperature', 'acceptance'], use_when: ['避免局部最优的组合/连续优化'], avoid_when: ['时间预算极低'], summary: '以温度调度控制接受劣解概率，逐步收敛。' })
m({ id: 'czy-aco-tsp', name: 'Ant Colony TSP', name_zh: '蚁群算法 TSP', task: 'metaheuristic', family: 'metaheuristic', difficulty: 'intermediate', kus: ['aco', 'pheromone', 'tsp'], use_when: ['路径类组合优化（TSP/VRP 原型）'], avoid_when: ['节点数极大且时间受限'], summary: '信息素+启发式构造路径，正反馈收敛于较优回路。' })

/* ---------- 仿真 ---------- */
m({ id: 'czy-mc-integration', name: 'Monte Carlo Integration', name_zh: '蒙特卡洛积分', task: 'simulation', family: 'simulation', difficulty: 'beginner', kus: ['monte-carlo', 'integration'], use_when: ['高维难解析积分'], avoid_when: ['低维可解析'], summary: '随机采样估计积分值，误差随样本数平方根下降。' })
m({ id: 'czy-mc-optimization', name: 'Monte Carlo Optimization', name_zh: '蒙特卡洛优化', task: 'simulation', family: 'simulation', difficulty: 'beginner', kus: ['random-search', 'sampling'], use_when: ['可行域内随机搜索粗定位'], avoid_when: ['需要精确最优'], summary: '随机采样目标函数取最优，常作为启发式初值。' })
m({ id: 'czy-queuing-mmsk', name: 'M/M/s/k Queue Simulation', name_zh: 'M/M/s/k 排队仿真', task: 'simulation', family: 'simulation', difficulty: 'intermediate', kus: ['queuing', 'mmk', 'service-level'], use_when: ['窗口/床位/通道等排队系统评估'], avoid_when: ['解析公式可精确计算的简单 M/M/1'], summary: '事件驱动仿真估计等待/队长/服务水平指标。' })
m({ id: 'czy-random-walk', name: 'Random Walk', name_zh: '随机游走', task: 'simulation', family: 'simulation', difficulty: 'beginner', kus: ['random-walk', 'stochastic-process'], use_when: ['随机过程演示/价格与扩散原型'], avoid_when: ['需要真实动力学模型'], summary: '多游走者多步随机游走轨迹与统计。' })

/* ---------- 回归 ---------- */
m({ id: 'czy-ridge', name: 'Ridge Regression', name_zh: '岭回归', task: 'regression', family: 'regression', difficulty: 'beginner', kus: ['ridge', 'regularization', 'multicollinearity'], use_when: ['特征共线严重或 n<p'], avoid_when: ['需要稀疏变量选择（用 Lasso 类）'], summary: 'L2 正则化最小二乘，稳定共线系数。' })
m({ id: 'czy-poly-reg', name: 'Polynomial Regression', name_zh: '多项式回归', task: 'regression', family: 'regression', difficulty: 'beginner', kus: ['polynomial', 'curve-fitting'], use_when: ['单变量明显非线性且光滑'], avoid_when: ['高阶易过拟合外推'], summary: '多项式基最小二乘拟合，注意阶数选择。' })
m({ id: 'czy-logistic', name: 'Logistic Regression', name_zh: '逻辑回归', task: 'classification', family: 'regression', difficulty: 'beginner', kus: ['logistic', 'sigmoid', 'classification'], use_when: ['二分类概率建模'], avoid_when: ['多分类非线性强边界'], summary: '梯度上升极大似然的线性分类器，输出概率。' })

/* ---------- 时间序列 ---------- */
m({ id: 'czy-sma', name: 'Simple Moving Average', name_zh: '简单移动平均', task: 'time-series', family: 'time-series', difficulty: 'beginner', kus: ['moving-average', 'smoothing'], use_when: ['去噪与短期平滑'], avoid_when: ['强趋势/季节序列单独使用'], summary: '窗口均值平滑，是最朴素的预测 baseline。' })
m({ id: 'czy-ses', name: 'Single Exponential Smoothing', name_zh: '一次指数平滑', task: 'time-series', family: 'time-series', difficulty: 'beginner', kus: ['exponential-smoothing', 'alpha'], use_when: ['无趋势无季节的平稳序列'], avoid_when: ['有明显趋势（用二次/三次）'], summary: '加权平均历史值，alpha 控制记忆长度。' })
m({ id: 'czy-holt-winters', name: 'Holt-Winters', name_zh: 'Holt-Winters 三次指数平滑', task: 'time-series', family: 'time-series', difficulty: 'intermediate', kus: ['holt-winters', 'seasonality', 'trend'], use_when: ['带趋势+季节的序列预测'], avoid_when: ['序列太短不足以估计季节'], summary: '水平/趋势/季节三组分平滑，支持加法与乘法。' })
m({ id: 'czy-gompertz', name: 'Gompertz Curve', name_zh: 'Gompertz 成长曲线', task: 'time-series', family: 'time-series', difficulty: 'intermediate', kus: ['gompertz', 'growth-curve'], use_when: ['产品普及/生物生长等非对称 S 增长'], avoid_when: ['对称 S 形（用 Logistic/Verhulst）'], summary: '双指数形态的成长曲线拟合与预测。' })

/* ---------- 写出 ---------- */
let created = 0
let linked = 0
for (const e of M) {
  const path = join(DIR, `${e.id}.yaml`)
  if (existsSync(path)) continue
  const method = UPSTREAM.methods.find((x) => x.method_id === e.id)
  const lines = [
    `id: ${e.id}`,
    `name: ${e.name}`,
    `name_zh: ${e.name_zh}`,
    `category: { task: [${e.task}] }`,
    `family: [${e.family}]`,
    `difficulty: ${e.difficulty}`,
    `maturity: production`,
    `execution_supported: czy`,
    `provider: czy`,
    `prerequisites: [${(e.kus ?? []).slice(0, 2).join(', ')}]`,
    `knowledge_units: [${(e.kus ?? []).join(', ')}]`,
    `use_when:`,
    ...(e.use_when ?? []).map((u) => `  - ${u}`),
    `avoid_when:`,
    ...(e.avoid_when ?? []).map((u) => `  - ${u}`),
    `summary: ${e.summary}`,
    `demo_priority: 50`,
    `execution: { provider: czy, method_id: ${e.id}, upstream_commit: ${UPSTREAM.upstream_commit.slice(0, 8)} }`,
  ]
  writeFileSync(path, lines.join('\n') + '\n', 'utf8')
  created++
}
// link existing models to czy execution
for (const [modelId, methodId] of Object.entries(EXISTING_LINK)) {
  const path = join(DIR, `${modelId}.yaml`)
  if (!existsSync(path)) continue
  let text = readFileSync(path, 'utf8')
  if (text.includes('execution_supported')) continue
  text = text.replace(/\nsummary:/, `\nexecution_supported: czy\nprovider: czy\nexecution: { provider: czy, method_id: ${methodId} }\nsummary:`)
  writeFileSync(path, text, 'utf8')
  linked++
}
console.log(`[depth-atlas] created ${created} new method entries, linked ${linked} existing → czy execution`)

