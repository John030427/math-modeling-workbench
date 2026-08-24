export type AiMode = "coach" | "copilot" | "agent";

const API_BASE = "";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => req<{ status: string }>("/api/health"),
  models: (params?: { task?: string; family?: string; q?: string }) => {
    const sp = new URLSearchParams();
    if (params?.task) sp.set("task", params.task);
    if (params?.family) sp.set("family", params.family);
    if (params?.q) sp.set("q", params.q);
    const q = sp.toString();
    return req<{ models: Model[]; taxonomy: Taxonomy }>(`/api/registry/models${q ? `?${q}` : ""}`);
  },
  model: (id: string) => req<Model>(`/api/registry/models/${id}`),
  chat: (body: ChatBody) =>
    req<ChatReply>("/api/ai/chat", { method: "POST", body: JSON.stringify(body) }),
  quizzes: (modelId: string) =>
    req<{ questions: QuizQ[] }>(`/api/learning/quizzes/${modelId}`),
  submitQuiz: (body: QuizSubmit) =>
    req<QuizResult>("/api/learning/quiz/submit", { method: "POST", body: JSON.stringify(body) }),
  dailyReview: () => req<DailyReview>("/api/learning/daily-review"),
  resetDemo: () => req<{ ok: boolean }>("/api/learning/reset-demo", { method: "POST", body: "{}" }),
  gymCases: () => req<{ cases: GymCase[] }>("/api/gym/cases"),
  gymCase: (id: string) => req<GymCase>(`/api/gym/cases/${id}`),
  gymCoach: (body: { case_id: string; message: string; step?: string }) =>
    req<ChatReply>("/api/gym/coach", { method: "POST", body: JSON.stringify(body) }),
  diagnose: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<DiagnoseResult>("/api/data/diagnose", { method: "POST", body: fd });
  },
  modelSelect: (body: Record<string, unknown>) =>
    req<SelectResult>("/api/data/model-select", { method: "POST", body: JSON.stringify(body) }),
  createComp: (body: { title: string; problem_text: string }) =>
    req<CompState>("/api/competition/projects", { method: "POST", body: JSON.stringify(body) }),
  getComp: (id: string) => req<CompState>(`/api/competition/projects/${id}`),
  updateStage: (id: string, stage: string, payload: Record<string, unknown>) =>
    req<CompState>(`/api/competition/projects/${id}/stage`, {
      method: "POST",
      body: JSON.stringify({ stage, payload }),
    }),
  reviewText: (title: string, text: string) =>
    req<ReviewResult>("/api/review/paper/text", {
      method: "POST",
      body: JSON.stringify({ title, text }),
    }),
  reviewFile: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<ReviewResult>("/api/review/paper", { method: "POST", body: fd });
  },
  profile: () => req<Profile>("/api/profile/"),
};

export type Model = {
  id: string;
  name: string;
  name_zh?: string;
  summary?: string;
  category?: { task?: string[] };
  family?: string[];
  difficulty?: string;
  use_when?: string[];
  avoid_when?: string[];
  common_mistakes?: string[];
  knowledge_units?: string[];
  alternatives?: string[];
};

export type Taxonomy = { tasks: string[]; families: string[] };

export type ChatBody = {
  message: string;
  mode: AiMode;
  page?: string;
  model_id?: string;
  knowledge_unit?: string;
};

export type ChatReply = {
  answer: string;
  skill?: string;
  mode?: string;
  offline?: boolean;
  guided_questions?: string[];
  related_ku?: string[];
};

export type QuizQ = {
  id: string;
  level: number;
  knowledge_unit: string;
  prompt: string;
  options: Record<string, string>;
};

export type QuizSubmit = {
  quiz_id: string;
  selected: string;
  item_type: string;
  item_id: string;
};

export type QuizResult = {
  correct: boolean;
  explanation?: string;
  mastery: number;
  answer?: string;
};

export type DailyReview = {
  estimated_minutes: number;
  due: Array<{ item_type: string; item_id: string; score: number }>;
  weak_count: number;
  message: string;
};

export type GymCase = {
  id: string;
  title: string;
  scenario: string;
  raw_fields: string[];
  levels: Array<{ level: number; task: string }>;
  coach_steps?: Record<string, string>;
};

export type DiagnoseResult = {
  error?: string;
  n_rows?: number;
  issues?: Array<{ type: string; message: string }>;
  recommendations?: Array<Record<string, unknown>>;
  preview?: Record<string, string>[];
  feature_suggestions?: Array<Record<string, string>>;
  leakage_warnings?: string[];
};

export type SelectResult = {
  baseline: { id: string; why: string };
  main_model: { id: string; why: string };
  alternative: { id: string; why: string };
  warnings: string[];
};

export type CompState = {
  id: string;
  title: string;
  problem_text: string;
  current_stage: string;
  stages: Record<string, { status: string; data: Record<string, unknown> }>;
};

export type ReviewResult = {
  total: number;
  max_total: number;
  dimensions: Array<{ dimension: string; score: number; max: number }>;
  gaps: Array<{ dimension: string; score: number; max: number }>;
  training_plan: Array<{ focus: string; recommended_drills: number; reason: string; module: string }>;
  evidence: Array<{ dimension: string; finding: string }>;
  disclaimer?: string;
};

export type Profile = {
  dimensions: Array<{ dim: string; score: number }>;
  models: Array<{ item_id: string; score: number }>;
  weak_knowledge_units: Array<{ item_id: string; score: number }>;
  bridge_tips: Array<{ model_id: string; mastery: number; message: string }>;
};
