# Architecture

**Last updated:** 2026-08-25 (Phase 3 — dedicated mathmodel profile distribution)

## Target delivery shape

The product ships as a **dedicated DSH profile** (`mathmodel`) assembled from standard bundles — the user's normal `web` profile stays **stock DSH**, untouched.

```text
~/.dsh/profiles/web       → stock DSH + user's own plugins (product never injects here)
~/.dsh/profiles/mathmodel → dsh-base + dsh-web-app
                            + @math-modeling/mathmodel-suite   ← single product bundle
                                (composes mathmodel-shell + dsh-mathmodeling;
                                 bundle patch: ui-layout off, shell owns root)
run: dsh --profile mathmodel --port 3100 --no-open
```

Mechanism + CLI evidence: `research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md`, `research/MATHMODEL_PROFILE_BOOTSTRAP.md`.
Gates: `SHELL_V2_GATE_REPORT.md` = technical (historical) → `REVIEW/PRODUCT_UI_REVIEW.md` = product UI gate (authoritative).

## UI principles (MathModel Shell — product chrome)

```text
mathmodel profile boots MathModel Shell (232px | flexible | 400px):
  single MathModel sidebar (概览/学习/训练/竞赛/论文/个人 — no official sidebar embedded)
  │ dominant workbench (产品 Dashboard · 模型地图 Task×Family×Algorithm · K-Means 课程)
  │ narrow native Agent column (≤1180px collapses to drawer + FAB)
theme-adaptive palette; honest placeholders; no duplicate 数模工作台 tab (compat-gated).
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
  mathmodel-suite/      # THE product bundle (composition: shell + domain; patch owns ui-layout off)
  mathmodel-shell/      # presentation-only product chrome (nav | workbench | narrow Agent)
  dsh-mathmodeling/     # domain: APIs, modeling-tutor skill, workbench provider (compat-gated client)
  shell-v2/             # FROZEN technical proof (historical)
  harness-spike/        # FROZEN Live-Gate prototype (historical)
  core/                 # shared TS logic (extracted from apps/api)
  ui/                   # ModelingWorkbench shared UI
apps/                   # MVP prototype (frozen feature expansion)
profiles/mathmodel-template/  # profile bootstrap template (init materializes from here)
registry/               # YAML models, quizzes (→ migrate to core)
skills/                 # skill contracts (mirror in plugin bundle)
research/               # DSH profile/UI research, GitHub benchmark docs
scripts/                # profile init/verify/start/remove, gate drivers
```

## Install / run / verify / remove (product)

```powershell
scripts/mathmodel-profile-init.ps1      # create/refresh mathmodel profile from template (idempotent)
scripts/mathmodel-start.ps1             # launch on :3100 (auto-finds dsh bin)
scripts/mathmodel-profile-verify.ps1    # dump-config composition + optional live health (-LivePort 3100)
scripts/mathmodel-remove.ps1            # stop instance + delete profile dir (web untouched)
```

Plugin dev iteration (legacy path, web profile): `scripts/dsh-install.ps1` → `dev_install_package`; uninstall via `scripts/dsh-uninstall.ps1`. Must not break DSH when plugin absent.

## References

- Benchmark: `research/GITHUB_BENCHMARK.md`
- Phase plan: `PHASE2_PLAN.md`
- Decisions: `research/INTEGRATION_DECISIONS.md`, `DECISIONS.md`
