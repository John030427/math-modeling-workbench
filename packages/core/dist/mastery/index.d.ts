export interface MasteryRecord {
    user_id: string;
    item_type: string;
    item_id: string;
    score: number;
    last_review: string | null;
    next_review: string | null;
    wrong_count: number;
    correct_count: number;
    difficulty: number;
}
export interface QuizQuestion {
    id: string;
    level: number;
    knowledge_unit: string;
    prompt: string;
    options: Record<string, string>;
    answer: string;
    explanation?: string;
}
export interface QuizBank {
    model_id: string;
    questions: QuizQuestion[];
}
export declare const SEED_MODEL_MASTERY: Record<string, number>;
export declare const SEED_KU_MASTERY: Record<string, number>;
export declare function seedMasteryRecords(userId?: string): MasteryRecord[];
export declare function gradeQuizSubmission(question: QuizQuestion, selected: string, existing: MasteryRecord | null, userId: string, itemType: string, itemId: string): {
    correct: boolean;
    mastery: number;
    record: MasteryRecord;
    explanation?: string;
    answer?: string;
};
export declare function findMastery(records: MasteryRecord[], userId: string, itemType: string, itemId: string): MasteryRecord | null;
export declare function upsertMastery(records: MasteryRecord[], record: MasteryRecord): MasteryRecord[];
