# Phase 2 Plan

**Confirmed:** GitHub Benchmark + integration direction (see `research/`).  
**Pivot (2026-08-24):** Final delivery = **DSH native plugin**, not standalone `apps/web + apps/api` product.

---

## Architecture constraint (highest priority)

```text
DSH (DeepSeek Harness)
  └── @math-modeling/dsh-mathmodeling  (Profile Bundle plugin)
        ├── Host: /api/mathmodeling/*, registry, context, skills
        ├── Client: 数模工作台 UI (DSH slots, no duplicate AI chat)
        └── Skills: modeling-tutor (+ future pipeline skills)

apps/web + apps/api  →  MVP prototype / migration source only
packages/core        →  Math Modeling Core (shared logic)
packages/dsh-mathmodeling →  DSH bundle (delivery)
```

**Vertical slice gate (must pass before GitHub Integration P0):**

```text
Install plugin → sidebar「数模工作台」→ Dashboard → Atlas/K-Means
→ Session context visible → modeling-tutor skill → Uninstall clean
```

---

## Execution order (revised)

| Phase | Epic | Acceptance |
|-------|------|------------|
| **P0** | DSH Plugin skeleton + install/uninstall test | ✅ Sidebar + health API + clean uninstall |
| **P1** | Migrate Model Atlas + Tutor vertical slice | ✅ `packages/ui` + session context + quiz/mastery + `conversation.view` |
| **P2** | MathMN-lite contract / manifest / claim ledger | workspace artifacts + STALE gates |
| **P3** | Algorithm Provider + first executable algorithms | Interface + local-provider; no direct czy API coupling |
| **P4** | Problem Library | Browse + import (metadata, external links) |
| **P5** | Resource Registry + Case Registry | YAML registries + distilled cases |
| **P6** | Competition Workbench plugin migration | Stages in plugin UI, DSH session context |
| **P7** | Reviewer V2 / Evidence Chain | claim ledger enforced |
| **P8** | Daily Review / Profile integration | SQLite/mastery in plugin host |
| **P9** | UI polish matching DSH native style | Slots, typography, empty states |
| **P10** | Full regression review | Demo + uninstall + tests |

**GitHub Integration items** (old P0–P2) start **after** plugin vertical slice passes.

---

## Algorithm integration (revised)

```text
Math Modeling Core
  └── AlgorithmProvider (interface)
        ├── local-provider     (stdlib/sklearn/numpy — ours)
        ├── czy-provider       (pinned commit, license-checked, adapter only)
        └── future-provider
```

- **No** direct import of chengziyue1222 internal module paths from UI or routes.
- Pin version/commit in `THIRD_PARTY.md` when czy-provider is enabled.

---

## Migration principle

Do **not** rewrite working MVP logic. **Extract → core → plugin host/client.**

| MVP source | Target |
|------------|--------|
| `registry/` | `packages/core/registry` + plugin host loader |
| `apps/api/services/offline_ai.py` | `packages/core/tutor` (TS port) + modeling-tutor skill |
| `apps/web/src/app/atlas/*` | plugin client pages |
| `apps/web/src/components/KMeansCanvas.tsx` | plugin client component |
| `skills/` | `packages/dsh-mathmodeling/skills/` + repo `skills/` symlink |

---

## P0 deliverables (this sprint)

- [x] `packages/dsh-mathmodeling/` bundle (host + client + cordis.patch.yml)
- [x] `scripts/dsh-install.ps1` / `scripts/dsh-uninstall.ps1`
- [x] `skills/modeling-tutor/SKILL.md` (bundled)
- [x] `THIRD_PARTY.md` (stub + czy pin placeholder)
- [x] `tests/dsh-plugin-smoke.ps1` or `.mjs`
- [x] Docs updated: ARCHITECTURE, INTEGRATION_DECISIONS, this file

---

## Success criteria

1. `dev_install_package` → refresh DSH →「数模工作台」visible.
2. `GET /api/mathmodeling/health` → 200.
3. Dashboard + placeholder Atlas/K-Means navigable inside plugin UI.
4. `modeling-tutor` appears in skill catalog when plugin enabled.
5. `dev_uninject_plugin` → entry gone, APIs 404, DSH stable.
