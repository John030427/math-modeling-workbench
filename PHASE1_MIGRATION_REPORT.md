# Phase 1 Migration Report — DSH Plugin Vertical Slice

**Date:** 2026-08-25  
**Gate:** P1 vertical slice (Atlas → K-Means → Canvas → Context → Tutor → Quiz → Mastery)

---

## Delivered

### Shared packages (single source of truth)

| Package | Role |
|---------|------|
| `packages/core` | ModelingContext types, SRS, mastery/quiz grading, tutor routing + offline fallback |
| `packages/ui` | `KMeansCanvas`, `KMeansLesson`, `AtlasView`, `ModelingWorkbench` |
| `packages/dsh-mathmodeling` | DSH bundle v0.2.0 — host APIs + `conversation.view` client |

### DSH plugin UX (official contracts — 2026-08-25 correction)

- **Primary:** `sidebar.footer.action` → `conversation.view` tab「数模工作台」
- **Session tabs:** `[对话] [数模工作台] [轨迹]` (trajectory = other plugin)
- **Workbench internal nav:** Dashboard · 模型地图 · K-Means · Gym · 比赛 · 题库 · 案例 · 论文评审 · 能力画像
- **Fallback:** `shell.overlay` drawer (same `ModelingWorkbench` component)
- **Tutor:** DSH Chat + `/modeling-tutor` — no fourth chat column
- **Do not:** patch DSH Core; assume global page / sidebar primary nav / right plugin panel

See `research/DSH_UI_CAPABILITY_MATRIX.md`.

### ModelingContext (session-scoped)

Fields: `module, page, model_id, knowledge_unit, lesson_step, problem_id, case_id, project_id, dataset_id, experiment_id, session_id, user_id, route, seed_prompt`

- API: `GET/POST /api/mathmodeling/context?session_id=...`
- **No** global `currentModel` — Session A/B isolated (smoke tested)

### K-Means lesson (10 steps)

30秒直觉 · 现实案例 · 交互动画 · 数学原理 · 代码 · 适用/不适用 · 常见错误 · 模型比较 · Mini Quiz

「问 Tutor」按钮 → updates context → seeds `/modeling-tutor …` in composer

### Mastery + Quiz

- `GET /api/mathmodeling/quizzes/{modelId}`
- `POST /api/mathmodeling/quiz/submit`
- `GET /api/mathmodeling/mastery`
- Persistence: `~/.dsh/plugins/mathmodeling/learning-state.json`
- `GET /api/mathmodeling/tutor/offline` for skill/agent offline path

### modeling-tutor skill

Runtime registration + updated `skills/modeling-tutor/SKILL.md` (session_id workflow)

### apps/web (no duplicate UI)

- `apps/web` consumes `@math-modeling/ui` for Atlas + K-Means lesson
- Removed `apps/web/src/components/KMeansCanvas.tsx`
- Web still uses `AiDock` for chat (MVP); plugin uses DSH session only

---

## Tests

| Suite | Result |
|-------|--------|
| `packages/core/tests/tutor.test.mjs` | 2 pass |
| `packages/dsh-mathmodeling/tests/host.test.mjs` | 4 pass |
| `tests/dsh-plugin-smoke.ps1` | pass (session isolation, quiz, mastery, tutor) |

---

## Manual verification checklist

1. Refresh DSH → session tabs `[对话] [数模工作台] [轨迹]` — workbench tab visible
2. Footer 📐 → switches to「数模工作台」view (overlay only if `setView` unavailable)
2. Atlas → open K-Means → Canvas interactive
3. Step 8「为什么要标准化？」→ composer shows `/modeling-tutor …`
4. `/modeling-tutor` in session with context → scaling answer
5. Quiz submit → mastery increases; file `learning-state.json` updated
6. Second session → different context
7. `scripts/dsh-uninstall.ps1` → APIs 404, DSH stable

---

## Next (P2+ per PHASE2_PLAN)

MathMN-lite → Algorithm Provider → Problem Library → Case Registry (no re-confirmation required)
