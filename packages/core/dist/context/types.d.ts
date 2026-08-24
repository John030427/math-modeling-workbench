/** Unified modeling context — always session-scoped (never global currentModel). */
export type ModelingModule = 'mathmodeling' | string;
export interface ModelingContext {
    module: ModelingModule;
    page: string;
    model_id: string | null;
    knowledge_unit: string | null;
    lesson_step: number | null;
    problem_id: string | null;
    case_id: string | null;
    project_id: string | null;
    dataset_id: string | null;
    experiment_id: string | null;
    session_id: string;
    user_id: string;
    route: string;
    seed_prompt: string | null;
    updated_at: number;
}
export declare function createEmptyContext(sessionId: string, userId?: string): ModelingContext;
export declare function mergeContext(prev: ModelingContext, patch: Partial<ModelingContext>): ModelingContext;
