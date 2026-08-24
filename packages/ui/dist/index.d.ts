//#region src/KMeansCanvas.d.ts
declare function KMeansCanvas(): import("react").JSX.Element;
//#endregion
//#region src/types.d.ts
type ModelSummary = {
  id: string;
  name: string;
  name_zh?: string;
  difficulty?: string;
  demo_priority?: number;
  summary?: string;
  category?: {
    task?: string[];
  };
  family?: string[];
  use_when?: string[];
  avoid_when?: string[];
  common_mistakes?: string[];
  alternatives?: string[];
};
type QuizQuestion = {
  id: string;
  level: number;
  knowledge_unit: string;
  prompt: string;
  options: Record<string, string>;
};
type QuizResult = {
  correct: boolean;
  explanation?: string;
  mastery: number;
  answer?: string;
};
type ContextPatch = {
  page?: string;
  model_id?: string | null;
  knowledge_unit?: string | null;
  lesson_step?: number | null;
  route?: string;
  seed_prompt?: string | null;
};
type AskTutorPayload = {
  seedPrompt: string;
  knowledgeUnit?: string | null;
  lessonStep?: number;
};
type ModelingApi = {
  fetchRegistry: () => Promise<{
    models: ModelSummary[];
  }>;
  fetchModel: (id: string) => Promise<ModelSummary>;
  fetchQuizzes: (modelId: string) => Promise<{
    questions: QuizQuestion[];
  }>;
  submitQuiz: (body: {
    quiz_id: string;
    selected: string;
    item_type: string;
    item_id: string;
    user_id?: string;
    session_id?: string;
  }) => Promise<QuizResult>;
  patchContext: (patch: ContextPatch & {
    session_id?: string;
  }) => Promise<void>;
};
//#endregion
//#region src/AtlasView.d.ts
declare function AtlasView({ models, onSelectModel }: {
  models: ModelSummary[];
  onSelectModel: (id: string) => void;
}): import("react").JSX.Element;
//#endregion
//#region src/KMeansLesson.d.ts
declare function KMeansLesson({ model, api, onBack, onAskTutor, sessionId }: {
  model: ModelSummary;
  api: {
    fetchQuizzes: (id: string) => Promise<{
      questions: QuizQuestion[];
    }>;
    submitQuiz: (body: {
      quiz_id: string;
      selected: string;
      item_type: string;
      item_id: string;
      session_id?: string;
    }) => Promise<QuizResult>;
    patchContext: (patch: Record<string, unknown>) => Promise<void>;
  };
  onBack: () => void;
  onAskTutor: (payload: AskTutorPayload) => void;
  sessionId?: string;
}): import("react").JSX.Element;
//#endregion
//#region src/ModelingWorkbench.d.ts
/** Workbench sections — rendered inside conversation.view only (not global nav). */
type WorkbenchSection = 'dashboard' | 'atlas' | 'lesson' | 'gym' | 'competition' | 'problem-library' | 'case-library' | 'paper-reviewer' | 'profile';
declare function ModelingWorkbench({ api, sessionId, onAskTutor, initialSection }: {
  api: ModelingApi;
  sessionId: string;
  onAskTutor: (payload: AskTutorPayload) => void;
  initialSection?: WorkbenchSection;
}): import("react").JSX.Element;
//#endregion
export { type AskTutorPayload, AtlasView, type ContextPatch, KMeansCanvas, KMeansLesson, type ModelSummary, type ModelingApi, ModelingWorkbench, type QuizQuestion, type QuizResult };