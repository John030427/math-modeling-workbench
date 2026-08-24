/** Skill routing — ported from apps/api/app/services/offline_ai.py route_skill */
export declare function routeSkill(page: string | null | undefined, message: string, modelId: string | null | undefined): string;
export interface ModelDetail {
    id?: string;
    name?: string;
    name_zh?: string;
    summary?: string;
    use_when?: string[];
    avoid_when?: string[];
    common_mistakes?: string[];
}
export interface TutorReply {
    skill: string;
    mode: string;
    answer: string;
    related_ku?: string[];
    guided_questions?: string[];
    hints?: string[];
    context?: Record<string, unknown>;
    offline: boolean;
}
export interface TutorContext {
    skill: string;
    mode: string;
    message: string;
    model_id: string | null;
    knowledge_unit: string | null;
    page: string | null;
    model?: ModelDetail | null;
}
/** Build system prompt fragment for LLM path. */
export declare function buildTutorPrompt(ctx: TutorContext): string;
export declare function offlineReply(ctx: TutorContext): TutorReply;
/** Construct tutor input from modeling context + user message. */
export declare function buildTutorContext(modeling: {
    page: string;
    model_id: string | null;
    knowledge_unit: string | null;
    lesson_step: number | null;
}, message: string, model?: ModelDetail | null, mode?: string): TutorContext;
