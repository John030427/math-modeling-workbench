/** Skill routing — ported from apps/api/app/services/offline_ai.py route_skill */
export function routeSkill(page, message, modelId) {
    const msg = (message || '').toLowerCase();
    const pg = page || '';
    const onLesson = pg.startsWith('lesson') || pg.startsWith('atlas') || Boolean(modelId);
    const conceptual = [
        '为什么', '什么', '区别', '例子', '简单', '公式', '适用', '不适合', 'dbscan', '直觉',
    ].some((k) => message.includes(k));
    if (onLesson && conceptual)
        return '01-tutor';
    if (['缺失', '异常', '预处理', 'outlier', 'missing'].some((k) => msg.includes(k)) ||
        (['标准化', '量纲', '填充'].some((k) => message.includes(k)) && !onLesson)) {
        return '12-data-doctor';
    }
    if (['特征', 'feature', 'lag', '比率'].some((k) => msg.includes(k)))
        return '13-feature-engineering';
    if (['选模型', '用什么模型', 'model select', '该用'].some((k) => msg.includes(k)))
        return '20-model-selector';
    if (['论文', '摘要', '写作', 'paper'].some((k) => msg.includes(k)))
        return '40-paper-writer';
    if (['评分', '评审', 'review', '扣分'].some((k) => msg.includes(k)))
        return '41-paper-reviewer';
    if (['差距', '薄弱', '不会', 'gap'].some((k) => msg.includes(k)))
        return '42-gap-analyzer';
    if (pg.includes('gym') || ['变量', '约束', '目标函数', '决策'].some((k) => msg.includes(k))) {
        return '11-modeling-coach';
    }
    if (onLesson)
        return '01-tutor';
    return '00-router';
}
/** Build system prompt fragment for LLM path. */
export function buildTutorPrompt(ctx) {
    const parts = [
        'You are modeling-tutor for the Math Modeling Workbench (数模工作台).',
        'Explain concepts with why-first pedagogy; cite use_when/avoid_when/common_mistakes when available.',
        `Mode: ${ctx.mode}. Page: ${ctx.page ?? 'unknown'}. Model: ${ctx.model_id ?? 'none'}.`,
        `Knowledge unit: ${ctx.knowledge_unit ?? 'none'}.`,
    ];
    if (ctx.model?.use_when?.length)
        parts.push(`use_when: ${ctx.model.use_when.join('; ')}`);
    if (ctx.model?.avoid_when?.length)
        parts.push(`avoid_when: ${ctx.model.avoid_when.join('; ')}`);
    if (ctx.model?.common_mistakes?.length) {
        parts.push(`common_mistakes: ${ctx.model.common_mistakes.join('; ')}`);
    }
    return parts.join('\n');
}
export function offlineReply(ctx) {
    const mode = ctx.mode || 'copilot';
    const skill = ctx.skill;
    if (skill === '11-modeling-coach' || mode === 'coach') {
        return coachReply(ctx.message, mode);
    }
    if (skill === '12-data-doctor') {
        return {
            skill,
            mode,
            answer: '处理缺失前请按链路思考：缺失比例 → 变量类型 → 是否时间/空间结构 → MCAR/MAR/MNAR → 是否携带信息 → 再选 Mean/Median/插值/KNN/MICE/Indicator/Drop。不要默认均值填充。',
            hints: ['先报告每列缺失比例', '画出缺失模式', '说明为什么选该方法'],
            offline: true,
        };
    }
    if (skill === '20-model-selector') {
        return {
            skill,
            mode,
            answer: '模型选择顺序：先判定任务类型与约束结构，再给 Baseline / Main / Alternative，并解释线性可解时为何不要默认 PSO。',
            offline: true,
        };
    }
    if (ctx.model && ctx.model_id === 'kmeans') {
        return kmeansTutor(ctx.message, mode, ctx.knowledge_unit);
    }
    if (ctx.model) {
        return {
            skill: '01-tutor',
            mode,
            answer: genericModelTutor(ctx.model, ctx.message, mode),
            context: {
                model_id: ctx.model_id,
                page: ctx.page,
                knowledge_unit: ctx.knowledge_unit,
            },
            offline: true,
        };
    }
    return {
        skill,
        mode,
        answer: '我是工作台助手。可以结合当前页面帮你学算法、拆题、做数据诊断或论文评审。请告诉我你在哪个模块，或打开具体模型课程。',
        offline: true,
    };
}
function kmeansTutor(message, mode, ku) {
    const msg = message.toLowerCase();
    if (['标准化', '归一化', 'scaling', 'scale', '量纲'].some((k) => message.includes(k))) {
        let answer = '因为 K-Means 用欧氏距离。若收入是 3000–100000、年龄是 18–65，收入会主导距离，年龄几乎不起作用。标准化让各维可比。DBSCAN 同样基于距离/密度，通常也需要先处理量纲。';
        if (mode === 'coach') {
            answer =
                '先别急着听结论：如果两个特征的数值范围差了几个数量级，欧氏距离会更听谁的？试着举一个你数据里的例子。';
        }
        return {
            skill: '01-tutor',
            mode,
            answer,
            related_ku: ['feature-scaling', 'distance'],
            offline: true,
        };
    }
    if (msg.includes('dbscan')) {
        return {
            skill: '01-tutor',
            mode,
            answer: 'K-Means 假设簇大致球形并需指定 K；DBSCAN 基于密度，可找不规则簇并标记噪声，但不保证每个点都有簇标签，且对 eps/min_samples 敏感。',
            related_ku: ['kmeans-vs-dbscan'],
            offline: true,
        };
    }
    if (['sse', '平方误差'].some((k) => message.toLowerCase().includes(k)) || ku === 'sse') {
        return {
            skill: '01-tutor',
            mode,
            answer: 'SSE（簇内平方误差）= Σ‖xi − c_zi‖²：每个样本到其簇中心的欧氏距离平方之和。K-Means 迭代就是在最小化 SSE。',
            related_ku: ['sse', 'centroid'],
            offline: true,
        };
    }
    if (['为什么', '直觉', '干什么'].some((k) => message.includes(k))) {
        let base = 'K-Means 解决的是：把相似样本分到同一组，使组内更紧、组间更分离（以到中心距离衡量）。';
        if (mode === 'coach') {
            base = '如果老板让你把客户分成几类以便运营，你直觉上会怎么定义『像一类』？';
        }
        return { skill: '01-tutor', mode, answer: base, offline: true };
    }
    return {
        skill: '01-tutor',
        mode,
        answer: `当前上下文：K-Means${ku ? ` / 知识点 ${ku}` : ''}。你可以问：为什么要标准化？SSE 怎么来的？和 DBSCAN 区别？常见错误有哪些？`,
        offline: true,
    };
}
function genericModelTutor(model, message, mode) {
    const name = model.name_zh || model.name || model.id || '模型';
    if (mode === 'coach') {
        return `我们在看 ${name}。先问你：它主要解决哪类问题？适用条件你能说一条吗？`;
    }
    const use = (model.use_when || []).slice(0, 2).join('；');
    const avoid = (model.avoid_when || []).slice(0, 2).join('；');
    return `【${name}】${model.summary || ''}\n适用：${use}\n慎用：${avoid}\n针对你的问题：「${message}」——请结合适用/慎用条件判断，不要只记算法名字。`;
}
function coachReply(message, mode) {
    const steps = [
        '这句话里，什么是你能控制的决策变量？',
        '优化或预测的目标是什么（最小化/最大化/拟合什么）？',
        '有哪些硬约束（容量、时间窗、预算）？',
        '数据是截面、时间序列还是网络结构？',
        '这更像评价 / 聚类 / 预测 / 优化中的哪一类？',
    ];
    return {
        skill: '11-modeling-coach',
        mode: 'coach',
        answer: `教练模式：我不会直接给完整答案。我们一步步结构化问题。\n就你说的「${message}」，先回答：决策变量、目标、约束分别可能是什么？`,
        guided_questions: steps,
        offline: true,
    };
}
/** Construct tutor input from modeling context + user message. */
export function buildTutorContext(modeling, message, model, mode = 'copilot') {
    const page = modeling.lesson_step != null
        ? `lesson/${modeling.model_id ?? 'unknown'}/step-${modeling.lesson_step}`
        : modeling.page;
    const skill = routeSkill(page, message, modeling.model_id);
    return {
        skill,
        mode,
        message,
        model_id: modeling.model_id,
        knowledge_unit: modeling.knowledge_unit,
        page,
        model,
    };
}
