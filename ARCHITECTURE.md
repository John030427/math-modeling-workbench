# Architecture

**Last updated:** 2026-08-25 (Phase 3 — dedicated mathmodel profile distribution)

## Target delivery shape

The product ships as a **dedicated DSH profile** (`mathmodel`) assembled from standard bundles — the user's normal `web` profile stays **stock DSH**, untouched.

```text
~/.dsh/profiles/web       → stock DSH + user's own plugins (product never injects here)
~/.dsh/profiles/mathmodel → dsh-base + dsh-web-app
                            + @math-modeling/dsh-mathmodeling
                            + @math-modeling/shell-v2   (owns root; ui-layout patched off)
run: dsh --profile mathmodel --port 3100 --no-open
```

Mechanism + CLI evidence: `research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md`.
Gate: `PRODUCT_UI_GATE_REPORT.md` (G1–G7 PASS).

## UI principles (Shell V2 — product chrome)

```text
mathmodel profile boots Shell V2 (three columns):
  nav (仪表盘 · 建模工作台 · 训练 · 竞赛 · 习题 · 案例 · 论文 · 画像 + official sidebar seat)
  │ workbench (Dashboard cards → ModelingWorkbench via mathmodel.workbench slot)
  │ native Agent conversation (right column, /modeling-tutor)
theme-adaptive palette; placeholders for not-yet-built sections; no dead clicks.
```

Legacy plugin-path UI (still shipped inside dsh-mathmodeling, used when running under stock web profile):

```text
sidebar.footer.action 「📐 数模工作台」
  → conversation.view tab「数模工作台」
shell.overlay: fallback drawer
```

**Do not:** patch DSH Core; assume global page / sidebar primary nav / right plugin panel APIs.

```text
DeepSeek Harness (DSH GUI + Agent Session)
│
├── DSH native chrome (unchanged — no third-party global page)
│
└── @math-modeling/dsh-mathmodeling
      ├── Host (Cordis)
      │     ├── GET/POST /api/mathmodeling/*
      │     ├── Session-scoped ModelingContext
      │     ├── Mastery / Quiz APIs
      │     └── modeling-tutor skill
      │
      ├── Client
      │     ├── sidebar.footer.action → setView('mathmodeling')
      │     ├── conversation.view → workbench (primary)
      │     └── shell.overlay → drawer (fallback)
      │
      └── skills/modeling-tutor/

Math Modeling Core (packages/core)
      ├── registry/
      ├── tutor/ (offline + context rules)
      ├── algorithm-provider/  (interface)
      │     ├── local-provider
      │     └── czy-provider (adapter, pinned commit)
      └── integrity/ (future: contract, manifest, ledger)

MVP prototype (legacy — extract only)
      apps/web   Next.js
      apps/api   FastAPI
```

## UI principles (DSH-native)

- **Primary:** `sidebar.footer.action` → `conversation.view` tab「数模工作台」（session-scoped）
- **Fallback:** `shell.overlay` drawer — not primary UI
- **No** third-party global page, sidebar primary nav injection, or right plugin panel (see capability matrix)
- **No** plugin-embedded AI chat — DSH session + `modeling-tutor`
- Workbench internal IA only inside `conversation.view`

## Context flow (Agent integration)

```text
User navigates plugin UI (Atlas / K-Means / …)
  → client POST /api/mathmodeling/context { page, model_id, knowledge_unit }
  → host stores per-workspace or global context
  → modeling-tutor SKILL.md instructs agent to read context + registry
  → User asks in DSH chat; agent responds with page-aware tutor behavior
```

## Algorithm Provider abstraction

```typescript
// packages/core/algorithm-provider/types.ts (conceptual)

interface AlgorithmProvider {
  id: 'local' | 'czy' | string
  run(request: AlgorithmRunRequest): Promise<AlgorithmRunResult>
  listMethods(): MethodDescriptor[]
}

// UI / Competition / Algorithm Lab depend ONLY on this interface.
// czy-provider wraps pinned third-party code — never import czy paths from routes.
```

See `THIRD_PARTY.md` for pinned commits and licenses.

## Integrity (Phase 2+ — after plugin slice)

Lite MathMN patterns under `workspace/<projectId>/`:

- `problem/PROBLEM_CONTRACT.json`
- `experiments/run-manifest.json`
- `reviews/claim_ledger.json`
- Stage STALE when input hashes change

## Repository layout

```text
packages/
  dsh-mathmodeling/     # DSH bundle (domain: APIs, skill, workbench provider)
  shell-v2/             # MathModel Shell V2 (product chrome, owns root in mathmodel profile)
  harness-spike/        # frozen Live-Gate prototype (reference only)
  core/                 # shared TS logic (extracted from apps/api)
  ui/                   # ModelingWorkbench shared UI
apps/                   # MVP prototype (frozen feature expansion)
registry/               # YAML models, quizzes (→ migrate to core)
skills/                 # skill contracts (mirror in plugin bundle)
research/               # DSH profile/UI research, GitHub benchmark docs
scripts/                # profile install/start, dsh-install/uninstall, gate drivers
```

## Install / run / remove (product)

```powershell
scripts/mathmodel-profile-install.ps1   # create/refresh mathmodel profile (idempotent)
scripts/mathmodel-profile-start.ps1     # launch on :3100 (auto-finds dsh bin)
# remove product entirely: delete ~/.dsh/profiles/mathmodel (web profile never touched)
```

Plugin dev iteration (legacy path, web profile): `scripts/dsh-install.ps1` → `dev_install_package`; uninstall via `scripts/dsh-uninstall.ps1`. Must not break DSH when plugin absent.

## References

- Benchmark: `research/GITHUB_BENCHMARK.md`
- Phase plan: `PHASE2_PLAN.md`
- Decisions: `research/INTEGRATION_DECISIONS.md`, `DECISIONS.md`
