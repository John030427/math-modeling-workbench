export function createEmptyContext(sessionId, userId = 'demo') {
    return {
        module: 'mathmodeling',
        page: 'dashboard',
        model_id: null,
        knowledge_unit: null,
        lesson_step: null,
        problem_id: null,
        case_id: null,
        project_id: null,
        dataset_id: null,
        experiment_id: null,
        session_id: sessionId,
        user_id: userId,
        route: '/mathmodeling',
        seed_prompt: null,
        updated_at: Date.now(),
    };
}
export function mergeContext(prev, patch) {
    return {
        ...prev,
        ...patch,
        module: patch.module ?? prev.module,
        session_id: prev.session_id,
        user_id: patch.user_id ?? prev.user_id,
        updated_at: Date.now(),
    };
}
