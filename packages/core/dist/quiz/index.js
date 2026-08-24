export function stripAnswers(bank) {
    return {
        model_id: bank.model_id,
        questions: bank.questions.map((q) => {
            const { answer: _a, ...rest } = q;
            return rest;
        }),
    };
}
export function findQuestion(bank, quizId) {
    const [, qid] = quizId.includes(':') ? quizId.split(':') : [bank.model_id, quizId];
    return bank.questions.find((q) => q.id === qid || q.id === quizId) ?? null;
}
