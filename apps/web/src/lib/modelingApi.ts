import { api } from './api'
import type { ModelingApi } from '@math-modeling/ui'

/** Web MVP adapter — same contract as DSH plugin (no duplicate lesson UI). */
export function createWebModelingApi(): ModelingApi {
  return {
    fetchRegistry: async () => {
      const r = await api.models()
      return {
        models: r.models.map((m) => ({
          id: m.id,
          name: m.name,
          name_zh: m.name_zh,
          difficulty: m.difficulty,
          summary: m.summary,
          category: m.category,
          family: m.family,
        })),
      }
    },
    fetchModel: (id) => api.model(id),
    fetchQuizzes: (modelId) => api.quizzes(modelId),
    submitQuiz: (body) =>
      api.submitQuiz({
        quiz_id: body.quiz_id,
        selected: body.selected,
        item_type: body.item_type,
        item_id: body.item_id,
      }),
    patchContext: async () => {
      /* web uses AiContext instead of plugin context API */
    },
  }
}
