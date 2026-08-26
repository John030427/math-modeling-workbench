/**
 * Generate 10 reference-quality deep lessons → registry/lessons/{id}.json
 * Content grounded in provider executable examples (real params) + standard modeling theory.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIR = join(ROOT, 'registry', 'lessons')
mkdirSync(DIR, { recursive: true })

const lessons = []
function L(id, title, data) {
  lessons.push({ id, title, ...data })
}

L('kmeans', 'K-Means 聚类', {
  provider_example: { provider: 'local', algorithm: 'kmeans', parameters: { points: [[1, 1], [1.2, 0.9], [5, 5], [5.4, 4.8], [9, 9], [9.2, 8.7]], k: 2, seeds: [1, 2, 3, 4, 5] } },
  intuition: '把「相似」的样本分到同一组：每个簇有一个质心，样本归最近的质心，质心再移到组员平均位置，反复直到稳定。',
  scenario: '商场会员分群：按消费金额与频次把会员分成「高价值低频」「低价值高频」等可解释群体，用于差异化营销。',
  math: '目标：min SSE = Σᵢ Σ_{x∈Cᵢ} ‖x − μᵢ‖²。其中 μᵢ 为簇 Cᵢ 的质心。交替执行「分配」（固定质心把样本归最近质心）与「更新」（重算质心为组内均值）两步，单调收敛到局部最优。',
  flow: ['kmeans++ 选初始质心（比纯随机更稳）', '分配：每个样本归最近质心', '更新：质心 = 簇内均值', '重复 2-3 直到质心不再变化', '多种子运行取 SSE 稳定解'],
  params: [{ name: 'k', meaning: '簇数', how: '肘部法（SSE-K 曲线拐点）+ 轮廓系数联合确定' }, { name: 'seeds', meaning: '随机种子列表', how: '随机算法必须多 seed，报告 SSE mean/std/median/IQR' }, { name: 'max_iter', meaning: '最大迭代次数', how: '默认 100 足够；不收敛说明 k 或预处理有问题' }],
  use_avoid: { use: ['簇近似球形、大小相近', '特征已标准化', '需要可解释质心'], avoid: ['非凸/密度差异簇（用 DBSCAN）', '未处理离群点（质心被拉偏）', '需要隶属度（用模糊 C 均值）'] },
  baseline_comparison: '与「按某单变量等分」的朴素分组对比 SSE 与业务可解释性；任何 K-Means 结果都应优于随机分组。',
  failure_cases: ['未标准化：金额（万级）主导距离，其他特征失效', '离群点单独成簇或拉偏质心', 'K 选错导致把一个自然簇劈成两半'],
  validation: ['肘部法 + 轮廓系数', '多种子标签稳定性（ARI）', '质心业务画像可解释性'],
  quiz: [
    { q: 'K-Means 的目标函数最小化的是？', options: ['簇内平方误差和 SSE', '簇间距离', '信息熵', '轮廓系数'], answer: 'A', explanation: 'SSE = 各样本到其质心距离平方和。' },
    { q: '为什么使用前必须标准化？', options: ['加快收敛', '消除量纲对欧氏距离的支配', '减少簇数', '美观'], answer: 'B', explanation: '量纲大的特征会主导距离计算。' },
  ],
  paper_case: { title: '客户分群营销（教学案例）', note: '见 Gym 1 与案例库评价类案例中的分群应用。' },
  provider_note: 'Algorithm Lab 选择 local kmeans，输入 points/k/seeds 即真实执行。',
})

L('dbscan', 'DBSCAN 密度聚类', {
  provider_example: { provider: 'czy', algorithm: 'czy-fuzzy-cmeans', note: '上游暂无 DBSCAN 执行；本课为概念课，执行可暂用 fuzzy-cmeans 对照软划分。' },
  intuition: '不需要指定簇数：密度相连的样本成一簇，密度稀疏的点是噪声。核心思想是「密度可达」。',
  scenario: '地理定位数据找热点区域：门店选址分析中把客流密度高的区域自动聚出，同时把零星点击识别为噪声。',
  math: '给定 ε（邻域半径）与 MinPts：核心点 = ε 内至少 MinPts 个邻居；从核心点出发密度可达的点连成簇；不可达者为噪声。',
  flow: ['对每点数 ε 邻居数', '标记核心点', '核心点间密度可达连成簇', '边界点划入可达簇', '剩余为噪声'],
  params: [{ name: 'eps (ε)', meaning: '邻域半径', how: 'k-距离图（k=MinPts）的肘部' }, { name: 'min_samples', meaning: '核心点阈值', how: '经验 ≥ 维度+1，通常 4-10' }],
  use_avoid: { use: ['任意形状簇', '需要识别噪声', '密度差异明显的空间数据'], avoid: ['密度差异大的多簇数据（单一 ε 失效）', '高维稀疏数据（距离度量失效）'] },
  baseline_comparison: '与 K-Means 对比：K-Means 会把噪声强行分进簇、把非凸簇劈开——DBSCAN 在这些场景是修正。',
  failure_cases: ['ε 过小：全是噪声', 'ε 过大：所有点连成一簇', '簇密度差异大时单一 ε 无法兼顾'],
  validation: ['噪声比例合理性', '簇数对 ε 的敏感性曲线', '业务可解释性'],
  quiz: [
    { q: 'DBSCAN 相比 K-Means 的最大优势是？', options: ['速度更快', '可识别任意形状簇与噪声', '不需要任何参数', '一定全局最优'], answer: 'B', explanation: '密度可达不假设簇形状，且能标出噪声。' },
    { q: 'k-距离图用于选什么参数？', options: ['簇数 k', 'ε 邻域半径', '迭代次数', '维度'], answer: 'B', explanation: 'k-距离曲线肘部提示 ε。' },
  ],
  paper_case: { title: '与 K-Means 对比见知识单元 kmeans-vs-dbscan', note: 'Atlas 关联知识单元已覆盖。' },
  provider_note: '上游 czy 库暂无 DBSCAN 执行入口；概念课 + fuzzy-cmeans 软聚类对照。',
})

L('topsis', 'TOPSIS 逼近理想解', {
  provider_example: { provider: 'czy', algorithm: 'czy-topsis', parameters: { data: [[9, 0.9], [1, 0.5], [5, 0.7]], weights: [0.6, 0.4], positive_indicators: [true, true] } },
  intuition: '最好的方案应该离「正理想解」最近、离「负理想解」最远——用两个距离的比值给方案排序。',
  scenario: '城市宜居性排名：8 项指标标准化后加权，算每城与最优/最差虚拟城市的距离，得贴近度排序。',
  math: '向量归一化 → 加权 → 正理想 x⁺ 与负理想 x⁻ → D⁺/D⁻ 欧氏距离 → 贴近度 C = D⁻/(D⁺+D⁻)，越大越好。',
  flow: ['正向化处理负向指标', '向量归一化', '乘权重', '确定正/负理想解', '算距离与贴近度', '排序'],
  params: [{ name: 'weights', meaning: '指标权重', how: '熵权（客观）/AHP（主观）/组合赋权' }, { name: 'positive_indicators', meaning: '是否正向指标', how: '成本型指标设 false' }],
  use_avoid: { use: ['多方案多指标排序', '权重来源明确'], avoid: ['指标强相关（重复计权）', '方案间无可比性'] },
  baseline_comparison: '与等权重 TOPSIS 对比：若排名差异大，必须做权重敏感性分析并解释。',
  failure_cases: ['忘记正向化负向指标', '指标强相关导致某维度重复计权', '权重来源无依据'],
  validation: ['权重扰动 ±10% 排名稳定性', '与熵权法/RSR 结果对照', 'Spearman 秩相关检查'],
  quiz: [
    { q: 'TOPSIS 的贴近度 C 的范围是？', options: ['[0,1]', '[-1,1]', '(0,∞)', '[0,100]'], answer: 'A', explanation: 'C = D⁻/(D⁺+D⁻) ∈ [0,1]。' },
    { q: '成本型指标应该？', options: ['当作正向处理', '正向化或标记 positive=false', '直接删除', '乘 -1 后不用管'], answer: 'B', explanation: '必须告知算法该指标越小越好。' },
  ],
  paper_case: { title: '城市宜居性评价（见案例库 评价/决策 案例）', note: '组合赋权 + 敏感性分析是加分点。' },
  provider_note: 'czy-topsis 传 data/weights/positive_indicators 真实执行，返回 scores 与 ranking。',
})

L('ahp', 'AHP 层次分析法', {
  provider_example: { provider: 'czy', algorithm: 'czy-ahp-weight', parameters: { A: [[1, 3, 5], [0.3333, 1, 3], [0.2, 0.3333, 1]] } },
  intuition: '把复杂决策拆成层次结构，专家对同层因素两两比较「重要几倍」，数学上把比较矩阵转成权重。',
  scenario: '选址决策：目标层（选最优城市）→ 准则层（经济/环境/交通）→ 方案层（候选城市），逐层两两比较。',
  math: '判断矩阵 A（正互反矩阵）→ 求最大特征值 λmax 与特征向量 → 归一化即权重 → 一致性检验 CR = (λmax−n)/((n−1)·RI) < 0.1。',
  flow: ['建层次结构', '两两比较构造判断矩阵', '求特征向量权重', '一致性检验 CR<0.1', '逐层合成综合权重'],
  params: [{ name: 'A', meaning: '判断矩阵', how: '1-9 标度；对角线为 1；a_ji = 1/a_ij' }, { name: 'CR', meaning: '一致性比率', how: '≥0.1 必须调整矩阵直到通过' }],
  use_avoid: { use: ['需要融入专家主观经验', '层次结构清晰的决策'], avoid: ['准则过多（>9 阶一致性难保证）', '有充分客观样本时单独使用'], },
  baseline_comparison: '与熵权法客观权重对照：两套排名差异大时必须讨论原因（主观 vs 数据驱动）。',
  failure_cases: ['判断矩阵不一致（CR>0.1）仍强行使用', '准则之间强相关', '专家比较前后矛盾'],
  validation: ['CR<0.1', '与客观权重组合后的敏感性', '多专家判断的几何平均一致性'],
  quiz: [
    { q: 'CR 的合格线是？', options: ['<0.1', '<0.5', '<1', '=0'], answer: 'A', explanation: 'CR<0.1 视为一致性可接受。' },
    { q: '判断矩阵 a_ij=3 则 a_ji=?', options: ['3', '1/3', '-3', '9'], answer: 'B', explanation: '正互反矩阵性质。' },
  ],
  paper_case: { title: '组合赋权（AHP 30% + 熵权 70%）见评价类案例', note: '' },
  provider_note: 'czy-ahp-weight 返回权重向量、λmax、CR 与是否通过一致性检验。',
})

L('entropy-weight', '熵权法', {
  provider_example: { provider: 'czy', algorithm: 'czy-entropy-weight', parameters: { data: [[9, 0.9], [1, 0.5], [5, 0.7]], positive_indicators: [true, true] } },
  intuition: '一个指标各方案差异越大、信息量越大，就越该占高权重——用信息熵度量「差异度」。',
  scenario: '20 个城市 8 项指标的宜居性评价：哪些指标真正区分了城市？熵权给出客观答案。',
  math: '标准化 → p_ij = x_ij/Σx_ij → e_j = −(1/ln n)Σ p_ij ln p_ij → 权重 w_j = (1−e_j)/Σ(1−e_k)。',
  flow: ['正向化+标准化', '计算各指标信息熵', '求差异系数 1−e_j', '归一化为权重'],
  params: [{ name: 'data', meaning: '标准化后数据矩阵', how: '先正向化处理负向指标' }],
  use_avoid: { use: ['需要客观权重', '样本间差异真实的指标'], avoid: ['指标值全相同（熵权无意义）', '小样本极端值主导'], },
  baseline_comparison: '与等权重对比：熵权排名变化大的指标就是「区分度来源」，需业务解释。',
  failure_cases: ['指标全为常数', '未正向化导致熵计算方向错误', '极端值未处理'],
  validation: ['权重和为 1', '与主观权重组合敏感性', '剔除单指标看排名稳定性'],
  quiz: [
    { q: '熵权大的指标意味着？', options: ['各方案差异大', '专家更重视', '更不重要', '数值更大'], answer: 'A', explanation: '差异大→信息量大→权重高。' },
    { q: '熵权法属于？', options: ['主观赋权', '客观赋权', '组合赋权', '随机赋权'], answer: 'B', explanation: '完全由数据驱动。' },
  ],
  paper_case: { title: '评价类案例（组合赋权 70% 熵权）', note: '' },
  provider_note: 'czy-entropy-weight 输入数据矩阵即可，返回各指标权重。',
})

L('linear-regression', '多元线性回归', {
  provider_example: { provider: 'local', algorithm: 'linear-regression', parameters: { X: [[50, 0], [50, 1], [52, 0], [49, 1], [55, 0]], y: [1180, 1330, 1290, 1510, 880] } },
  intuition: '找一组系数使「特征的加权和」最贴近目标——最小二乘就是让残差平方和最小。',
  scenario: '销量 ~ 价格+促销：量化促销带来多少销量提升、价格弹性多大，用于定价决策（CUMCM 2023 C 核心）。',
  math: 'y = Xβ + ε，β̂ = (XᵀX)⁻¹Xᵀy。评估 R²、残差正态性/异方差、系数显著性。',
  flow: ['特征矩阵（含截距）', '正规方程或梯度下降求 β̂', '残差分析', 'R²/调整R²/显著性检验', '外推预测（特征范围内）'],
  params: [{ name: 'X', meaning: '特征矩阵', how: '每行一样本；分类变量先哑变量化' }, { name: 'add_intercept', meaning: '是否截距', how: '一般 true' }],
  use_avoid: { use: ['关系近似线性、需要可解释系数', '作为任何复杂模型的 baseline'], avoid: ['强非线性（多项式/树模型）', '严重共线不加处理（用岭回归）', '外推超出特征范围'], },
  baseline_comparison: '任何回归改进模型（多项式/岭/树）必须先跑 OLS baseline 并解释改进来源。',
  failure_cases: ['共线导致系数爆炸（用岭回归）', '残差异方差（结论不可信）', '时间序列直接 OLS 忽略自相关'],
  validation: ['R²/调整 R²', '残差 vs 拟合值图', '留出集外推验证', '系数符号业务合理性'],
  quiz: [
    { q: 'R²=0.85 表示？', options: ['85% 方差被模型解释', '预测误差 15%', '85% 准确率', '相关系数 0.85'], answer: 'A', explanation: 'R² = 1 − SS_res/SS_tot。' },
    { q: '特征强共线时首选？', options: ['岭回归', '删除所有相关特征', '提高学习率', '增加多项式阶数'], answer: 'A', explanation: 'L2 正则稳定共线系数。' },
  ],
  paper_case: { title: 'CUMCM 2023 C 销量-价格-促销关系建模', note: '见案例库预测类案例。' },
  provider_note: 'local linear-regression 与 czy-linreg 都可执行，返回系数/R²/残差。',
})

L('czy-grey-auto-predict', '灰色预测 GM(1,1) 与自动选型', {
  provider_example: { provider: 'czy', algorithm: 'czy-grey-auto-predict', parameters: { x0: [15, 17, 19, 23, 27], predict_n: 3 } },
  intuition: '数据少（4-10 个点）又近似指数规律时，累加生成让规律显出来，用一阶微分方程拟合再还原——这就是 GM(1,1)。',
  scenario: '只有 5 年的地区用电量数据要预测未来 3 年：样本太少不能用神经网络/ARIMA 定阶，灰色预测是标准选择。',
  math: 'AGO 累加 → x⁽¹⁾ 满足 dx⁽¹⁾/dt + a·x⁽¹⁾ = b → 解出时间响应式 → 累减还原。级比检验与后验差 C、P 检验定精度等级。',
  flow: ['级比检验（λ∈(e^{-2/(n+1)}, e^{2/(n+1)})）', 'AGO 累加生成', '最小二乘估计 a,b', '时间响应式还原预测', '后验差检验定级'],
  params: [{ name: 'x0', meaning: '原始小样本序列', how: '≥4 个点；级比不合格先做平移变换' }, { name: 'predict_n', meaning: '预测步数', how: '不宜超过样本数太多' }],
  use_avoid: { use: ['小样本近似指数序列', '数据少到统计模型失效'], avoid: ['明显振荡序列（用 Verhulst/GM(2,1)）', '大样本（用 ARIMA）'], },
  baseline_comparison: '与移动平均/指数平滑对比 MAPE；grey_auto_predict 自动在 GM(1,1)/GM(2,1)/Verhulst 间按误差选优。',
  failure_cases: ['级比检验不过（需平移变换）', '序列有拐点（GM(1,1) 单调假设失效）', '预测步数过多指数发散'],
  validation: ['相对误差均值 <5% 优', '后验差 C<0.35 且 P>0.95 为一级', '关联度检验'],
  quiz: [
    { q: 'GM(1,1) 建模前对数据做什么？', options: ['累加生成 AGO', '差分', '归一化到 [0,1]', '取对数'], answer: 'A', explanation: '累加生成弱化随机性。' },
    { q: '后验差比值 C 越小表示？', options: ['模型精度越高', '数据越多', '预测越远', '残差越大'], answer: 'A', explanation: 'C = S_e/S_x，小为优。' },
  ],
  paper_case: { title: '小样本预测类赛题标准方法（大量 CUMCM 小问使用）', note: '' },
  provider_note: 'czy-grey-auto-predict 自动在三种灰色模型中按误差选优，返回完整检验指标。',
})

L('czy-lp', '线性规划 LP', {
  provider_example: { provider: 'czy', algorithm: 'czy-lp', parameters: { c: [-3, -5], A_ub: [[1, 0], [0, 2], [3, 2]], b_ub: [4, 12, 18], bounds: [[0, null], [0, null]] } },
  intuition: '在线性目标与线性约束下找最优决策——可行域是凸多面体，最优解必在顶点上。',
  scenario: '生产计划：两种产品、有限工时与原料，最大化利润（CUMCM 2021 C 订购运输问题的核心子问题）。',
  math: 'min cᵀx s.t. Ax ≤ b, x ≥ 0。对偶理论提供影子价格（资源边际价值）。',
  flow: ['定义决策变量', '写目标函数与约束', '选择求解器（单纯形/内点）', '检查可行性与最优性', '影子价格解读'],
  params: [{ name: 'c', meaning: '目标系数', how: '最大化问题取负号转最小化' }, { name: 'A_ub/b_ub', meaning: '不等式约束', how: '统一成 ≤ 形式' }, { name: 'bounds', meaning: '变量界限', how: '非负默认 x≥0' }],
  use_avoid: { use: ['线性目标+线性约束', '需要最优性保证与影子价格'], avoid: ['非线性目标（NLP）', '整数变量（IP/MILP）', '大规模组合结构（启发式）'], },
  baseline_comparison: 'LP 解是任何启发式优化（GA/PSO）的「最优性参照」——启发式结果不应显著差于 LP。',
  failure_cases: ['约束写错方向（≤ vs ≥）', '无可行域（约束矛盾）', '无界（漏了变量界限）'],
  validation: ['可行性核查（代回约束）', '对偶变量/影子价格合理性', '目标系数扰动灵敏度'],
  quiz: [
    { q: 'LP 最优解出现在哪里？', options: ['可行域顶点', '可行域中心', '任意内点', '约束交点必在边界外'], answer: 'A', explanation: '线性目标在凸多面体顶点取最优。' },
    { q: '影子价格表示？', options: ['资源增加一单位的目标改进量', '市场价格', '最优解', '约束个数'], answer: 'A', explanation: '对偶变量 = 资源边际价值。' },
  ],
  paper_case: { title: 'CUMCM 2021 C 订购运输案例（见案例库优化类）', note: '' },
  provider_note: 'czy-lp 传 c/A_ub/b_ub/A_eq/b_eq/bounds 真实求解（scipy.linprog）。',
})

L('czy-pso', '粒子群优化 PSO', {
  provider_example: { provider: 'local', algorithm: 'pso', parameters: { objective: 'rastrigin', dims: 2, seeds: [1, 2, 3], particles: 24, iterations: 80 } },
  intuition: '一群粒子在解空间飞行：每只记住自己的历史最优，也被群体最优吸引——「个体经验+社会共享」的平衡搜索。',
  scenario: '非线性目标（如光学效率关于布局参数的复杂函数）找不到梯度时的全局寻优。',
  math: 'v ← w·v + c₁r₁(pbest−x) + c₂r₂(gbest−x)；x ← x+v。w 惯性、c₁ 认知、c₂ 社会。',
  flow: ['初始化粒子群（随机位置速度）', '评价适应度', '更新个体最优与全局最优', '按速度公式飞行', '重复直到收敛'],
  params: [{ name: 'objective', meaning: '目标函数 preset', how: 'sphere/rastrigin/rosenbrock 或自定义表达式' }, { name: 'seeds', meaning: '多种子', how: '随机算法必须多 seed 报分布' }, { name: 'particles/iterations', meaning: '群规模/迭代', how: '越大越稳越慢' }],
  use_avoid: { use: ['非线性不可导/黑盒目标', '有较好初值分布知识'], avoid: ['LP 等可精确求解问题', '超高维（维度灾难）'], },
  baseline_comparison: '与随机搜索/贪心对比；与 LP/NLP 在可解问题上对照最优性 gap。',
  failure_cases: ['早熟收敛（w 太小或多样性丢失）', '只报告最好 seed', 'bounds 未设置导致飞出有意义区域'],
  validation: ['多 seed best 的 mean/std/median/IQR', '收敛曲线是否平稳', '与 NLP 结果对照 gap'],
  quiz: [
    { q: 'PSO 的 gbest 表示？', options: ['全局历史最优', '当前粒子位置', '初始位置', '平均位置'], answer: 'A', explanation: '群体共享的社会信息。' },
    { q: '为什么随机优化必须多 seed？', options: ['结果依赖随机性', '加快速度', '减少内存', '法规要求'], answer: 'A', explanation: '单次运行可能是运气，分布才代表算法表现。' },
  ],
  paper_case: { title: '配送路径优化案例（见案例库优化类 PSO 用法）', note: '' },
  provider_note: 'local pso 返回收敛曲线 artifact，可直接画收敛图。',
})

L('czy-dijkstra', 'Dijkstra 最短路', {
  provider_example: { provider: 'czy', algorithm: 'czy-dijkstra', parameters: { graph: [[0, 2, 99], [2, 0, 1], [99, 1, 0]], source: 0 } },
  intuition: '从起点出发，每次「锁定」当前最近的未访问点，用它松弛邻居——贪心地扩展最短路树。',
  scenario: '配送中心到各网点的最短运输距离/时间；应急救灾的资源到达时间评估。',
  math: '非负权图 G(V,E)，维护 dist[]，每次取未确定集合中 dist 最小的点 u 松弛其邻边：dist[v] = min(dist[v], dist[u]+w(u,v))。',
  flow: ['构建邻接矩阵/表（非负权）', '初始化 dist[source]=0', '贪心锁定最近点并松弛邻居', '重复直到全部确定', '回溯前驱得路径'],
  params: [{ name: 'graph', meaning: '邻接矩阵', how: '无边的用大数（如 99/INF）表示，对角线 0' }, { name: 'source', meaning: '源点索引', how: '0-based' }],
  use_avoid: { use: ['非负权单源最短路'], avoid: ['负权边（用 Bellman-Ford 类）', '需要全源（用 Floyd）'], },
  baseline_comparison: '与 BFS（无权图）/Floyd（全源）对照；结果必须满足三角不等式。',
  failure_cases: ['负权边导致贪心失效', '邻接矩阵不对称（有向图按无向用错）', '大数表示 INF 参与加法溢出'],
  validation: ['小图手工验证', '与 Floyd 单行交叉核对', '路径回溯的连续性检查'],
  quiz: [
    { q: 'Dijkstra 能处理负权边吗？', options: ['能', '不能', '只对小图能', '只对有向图能'], answer: 'B', explanation: '贪心性质依赖非负权。' },
    { q: '需要所有点对最短路时用？', options: ['Floyd', 'Dijkstra 一次', 'Prim', '最大流'], answer: 'A', explanation: 'Floyd 动态规划求全源。' },
  ],
  paper_case: { title: '配送/管网/应急类赛题的标准组件', note: '' },
  provider_note: 'czy-dijkstra 返回距离数组与前驱数组（可回溯路径）。',
})

L('czy-mc-integration', '蒙特卡洛方法', {
  provider_example: { provider: 'czy', algorithm: 'czy-mc-integration', parameters: { objective: 'x[0]*x[1]', a: [0, 0], b: [2, 1], n_samples: 200000, seed: 42 } },
  intuition: '用随机采样估计确定量：样本越多，估计的误差按 1/√N 下降——「以随机对抗维度灾难」。',
  scenario: '高维积分（如光学效率期望）、排队系统等待时间分布、可靠性估计——解析解不可得时的标准武器。',
  math: '∫f(x)dx ≈ V·(1/N)Σf(xᵢ)，xᵢ 均匀采样；标准误 = V·σ_f/√N。置信区间 ±1.96σ/√N。',
  flow: ['定义采样区域与目标函数', '均匀/按分布采样 N 点', '计算函数值均值', '给出估计与标准误'],
  params: [{ name: 'objective', meaning: '被积函数表达式', how: 'x[i] 表示第 i 维变量' }, { name: 'a/b', meaning: '积分上下界向量', how: '每维一对' }, { name: 'n_samples/seed', meaning: '样本数/种子', how: '误差 ∝ 1/√N；seed 保证可复现' }],
  use_avoid: { use: ['高维积分/期望估计', '复杂随机系统仿真'], avoid: ['低维光滑积分（数值积分更快更准）', '需要精确解'], },
  baseline_comparison: '与解析解（若存在）或确定性数值积分对比验证正确性。',
  failure_cases: ['样本太少误差巨大', '方差无穷大（重尾函数）导致不收敛', '忘记报告标准误'],
  validation: ['标准误随 N 的 1/√N 收缩', '不同 seed 结果一致性', '与解析/数值解对照'],
  quiz: [
    { q: 'MC 估计误差随样本数如何变化？', options: ['∝1/√N', '∝1/N', '∝N', '不变'], answer: 'A', explanation: '中心极限定理。' },
    { q: 'MC 积分对哪类问题最有优势？', options: ['高维', '一维', '光滑低维', '解析可积'], answer: 'A', explanation: '维度灾难下确定性方法失效。' },
  ],
  paper_case: { title: '排队系统/可靠性/高维期望类赛题', note: '' },
  provider_note: 'czy-mc-integration / mc-optimization / queuing-mmsk / random-walk 全部真实仿真，支持 seed。',
})

for (const l of lessons) {
  writeFileSync(join(DIR, `${l.id}.json`), JSON.stringify(l, null, 2), 'utf8')
}
console.log(`[lessons] wrote ${lessons.length} deep lessons → ${DIR}`)
