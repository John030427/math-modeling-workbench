import { scheduleNext } from '../srs/index.js';
export const SEED_MODEL_MASTERY = {
    kmeans: 62,
    dbscan: 12,
    ahp: 78,
    topsis: 70,
    'linear-regression': 55,
    'random-forest': 40,
    arima: 28,
    pso: 18,
};
export const SEED_KU_MASTERY = {
    'clustering-basic': 70,
    distance: 65,
    'feature-scaling': 45,
    centroid: 60,
    iteration: 55,
    'k-selection': 35,
    sse: 50,
    silhouette: 30,
    initialization: 40,
    'local-optimum': 25,
    'outlier-sensitivity': 40,
    'kmeans-vs-dbscan': 20,
    validation: 35,
    'feature-engineering': 40,
};
export function seedMasteryRecords(userId = 'demo') {
    const now = new Date().toISOString();
    const rows = [];
    for (const [id, score] of Object.entries(SEED_MODEL_MASTERY)) {
        rows.push({
            user_id: userId,
            item_type: 'model',
            item_id: id,
            score,
            last_review: now,
            next_review: null,
            wrong_count: 0,
            correct_count: 0,
            difficulty: 0.3,
        });
    }
    for (const [id, score] of Object.entries(SEED_KU_MASTERY)) {
        rows.push({
            user_id: userId,
            item_type: 'ku',
            item_id: id,
            score,
            last_review: now,
            next_review: null,
            wrong_count: 0,
            correct_count: 0,
            difficulty: 0.3,
        });
    }
    return rows;
}
export function gradeQuizSubmission(question, selected, existing, userId, itemType, itemId) {
    const correct = selected === question.answer;
    const base = existing ?? {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        score: 40,
        last_review: null,
        next_review: null,
        wrong_count: 0,
        correct_count: 0,
        difficulty: 0.3,
    };
    const wrong = correct ? base.wrong_count : base.wrong_count + 1;
    const right = correct ? base.correct_count + 1 : base.correct_count;
    const scheduled = scheduleNext(base.score, correct, wrong, base.difficulty);
    const now = new Date().toISOString();
    const record = {
        ...base,
        score: scheduled.mastery,
        difficulty: scheduled.difficulty,
        last_review: now,
        next_review: scheduled.nextReview,
        wrong_count: wrong,
        correct_count: right,
    };
    return {
        correct,
        mastery: scheduled.mastery,
        record,
        explanation: question.explanation,
        answer: correct ? undefined : question.answer,
    };
}
export function findMastery(records, userId, itemType, itemId) {
    return records.find((r) => r.user_id === userId && r.item_type === itemType && r.item_id === itemId) ?? null;
}
export function upsertMastery(records, record) {
    const idx = records.findIndex((r) => r.user_id === record.user_id &&
        r.item_type === record.item_type &&
        r.item_id === record.item_id);
    if (idx < 0)
        return [...records, record];
    const next = [...records];
    next[idx] = record;
    return next;
}
