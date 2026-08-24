# Architecture

**Last updated:** 2026-08-25 (DSH UI capability correction)

## Target delivery shape

The product ships as a **DSH Profile Bundle plugin**, not a standalone web app.

## UI principles (DSH-native — official contracts only)

See **`research/DSH_UI_CAPABILITY_MATRIX.md`** for what is / is not supported.

```text
sidebar.footer.action 「📐 数模工作台」
  → current / dedicated math-modeling Session
  → conversation.view tab「数模工作台」
  → Session tabs: [对话] [数模工作台] [轨迹]

conversation.view 内部导航:
  Dashboard · 模型地图 · K-Means · Gym · 比赛工作台 · 题库 · 案例 · 论文评审 · 能力画像

shell.overlay: fallback drawer（非主路径）
Tutor: DSH Chat + /modeling-tutor — 无第四栏 Chat
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
  dsh-mathmodeling/     # DSH bundle (delivery)
  core/                 # shared TS logic (extracted from apps/api)
apps/                   # MVP prototype (frozen feature expansion)
registry/               # YAML models, quizzes (→ migrate to core)
skills/                 # skill contracts (mirror in plugin bundle)
research/               # GitHub benchmark docs
scripts/                # dsh-install, dsh-uninstall, dev helpers
```

## Install / uninstall

- Install: `scripts/dsh-install.ps1` → `dev_install_package` (super-injector), link in `~/.dsh/profiles/web/package.json`.
- Uninstall: `scripts/dsh-uninstall.ps1` → `dev_uninject_plugin`.
- Must not break DSH when plugin absent.

## References

- Benchmark: `research/GITHUB_BENCHMARK.md`
- Phase plan: `PHASE2_PLAN.md`
- Decisions: `research/INTEGRATION_DECISIONS.md`, `DECISIONS.md`
