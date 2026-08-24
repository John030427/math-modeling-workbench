import type { QuizBank, QuizQuestion } from '../mastery/index.js';
export declare function stripAnswers(bank: QuizBank): {
    model_id: string;
    questions: Omit<QuizQuestion, 'answer'>[];
};
export declare function findQuestion(bank: QuizBank, quizId: string): QuizQuestion | null;
