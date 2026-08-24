/** Unified modeling context — always session-scoped (never global currentModel). */
export type ModelingModule = 'mathmodeling' | string

export interface ModelingContext {
  module: ModelingModule
  page: string
  model_id: string | null
  knowledge_unit: string | null
  lesson_step: number | null
  problem_id: string | null
  case_id: string | null
  project_id: string | null
  dataset_id: string | null
  experiment_id: string | null
  session_id: string
  user_id: string
  route: string
  seed_prompt: string | null
  updated_at: number
}

export function createEmptyContext(sessionId: string, userId = 'demo'): ModelingContext {
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
  }
}

export function mergeContext(
  prev: ModelingContext,
  patch: Partial<ModelingContext>,
): ModelingContext {
  return {
    ...prev,
    ...patch,
    module: patch.module ?? prev.module,
    session_id: prev.session_id,
    user_id: patch.user_id ?? prev.user_id,
    updated_at: Date.now(),
  }
}
