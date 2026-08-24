/** Simple spaced-repetition scheduler (ported from apps/api/app/services/srs.py). */
export declare function scheduleNext(mastery: number, correct: boolean, wrongCount: number, difficulty: number): {
    mastery: number;
    difficulty: number;
    nextReview: string;
};
export declare function duePriority(score: number, nextReview: string | null | undefined, wrongCount: number): number;
