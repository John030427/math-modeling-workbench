export type ModelSummary = {
  id: string
  name: string
  name_zh?: string
  difficulty?: string
  demo_priority?: number
  summary?: string
  category?: { task?: string[] }
  family?: string[]
  use_when?: string[]
  avoid_when?: string[]
  common_mistakes?: string[]
  alternatives?: string[]
}

export type QuizQuestion = {
  id: string
  level: number
  knowledge_unit: string
  prompt: string
  options: Record<string, string>
}

export type QuizResult = {
  correct: boolean
  explanation?: string
  mastery: number
  answer?: string
}

export type ContextPatch = {
  page?: string
  model_id?: string | null
  knowledge_unit?: string | null
  lesson_step?: number | null
  route?: string
  seed_prompt?: string | null
}

export type AskTutorPayload = {
  seedPrompt: string
  knowledgeUnit?: string | null
  lessonStep?: number
}

export type ModelingApi = {
  fetchRegistry: () => Promise<{ models: ModelSummary[] }>
  fetchModel: (id: string) => Promise<ModelSummary>
  fetchQuizzes: (modelId: string) => Promise<{ questions: QuizQuestion[] }>
  submitQuiz: (body: {
    quiz_id: string
    selected: string
    item_type: string
    item_id: string
    user_id?: string
    session_id?: string
  }) => Promise<QuizResult>
  patchContext: (patch: ContextPatch & { session_id?: string }) => Promise<void>
}
