# MathModel Harness Shell V2 Plan

**Date:** 2026-08-25
**Branch:** `experiment/mathmodel-harness`
**Status:** ACTIVE — reconstructed plan. The original `MATHMODEL_HARNESS_SHELL_V2_PLAN.md` was not present in the repo or remote; this document rebuilds it from (a) the product directive, (b) `HARNESS_LIVE_GATE_REPORT.md` (H1–H4 PASS on spike), (c) `research/HARNESS_ARCHITECTURE_DECISION.md`, and (d) Live-Gate constraint notes. It is the authoritative plan going forward.

---

## 1. Goal

Build **MathModel Shell V2** — a production-quality custom three-column shell (nav | workbench | native conversation) as a **new package**, replacing the throwaway `harness-spike` prototype. Spike code stays frozen as reference; no further fixes go into it.

## 2. Preserved (must not break — reuse as-is)

| Capability | Lives in | Notes |
|---|---|---|
| Native Agent (H1) | DSH core (`agent`, `conversation`) | right column, untouched |
| Session restore/isolation (H2) | DSH core (`session`) + `ctx.sessions` binding | ModelingContext keyed by sessionId |
| `/modeling-tutor` skill (H4) | `packages/dsh-mathmodeling/lib/skill.js` | reads context + registry APIs |
| ModelingContext | `packages/dsh-mathmodeling` host routes `/api/mathmodeling/context` | per-session |
| Registry + Quiz + Mastery | `packages/dsh-mathmodeling` (`/registry*`, `/quizzes/*`, `/quiz/submit`) | mastery updates on quiz |
| Workbench UI (Atlas/K-Means lesson…) | `packages/ui` (`ModelingWorkbench`) | consumed via `mathmodel.workbench` slot |

`packages/core`, `packages/ui`, `packages/dsh-mathmodeling` are **dependencies of V2, not rewrite targets**.

## 3. Deferred (hard-blocked until H1–H5 all have explicit PASS/FAIL)

MathMN-lite · czy-provider · 题库 (question bank) · 案例库 (case library). Starting any of these before gates conclude is a plan violation.

## 4. Architecture — `packages/shell-v2` (`@math-modeling/shell-v2`, loader id `mathmodel-shell-v2`)

### Host (`lib/index.js`)
- WebRoute `{kind:'exact'}` `GET /api/mathmodeling/shell-v2/health` → `{ok,shell:'shell-v2',version}` (Live-Gate lesson: exact + `(req,res)` shape).

### Client (`src/client/index.tsx` → esbuild → `lib/client.js`)
- `dsh.client.immediately = true`; injects `slots` (+ runtime types only).
- Provides `ctx.layout` stub via `reflect.provide` so `ui-sidebar` inject resolves (Live-Gate lesson).
- Registers `root` **re-declaring all official children**: `sidebar`, `conversation`, `details`, `shell.overlay` + own `mathmodel.workbench` (Live-Gate lesson: replacing root must re-declare official children or boot aborts).
- `ShellFrame`: three columns — left nav (functional, selectable sections), center workbench, right native conversation. Official theme variables (`var(--dsh-bg)`), no hardcoded black prototype look.
- **Functional nav**: Dashboard (shell-owned registry summary cards from `/api/mathmodeling/registry`; card click → select model → switch to 工作台) · 工作台 (renders `mathmodel.workbench` slot filled by `dsh-mathmodeling`) · remaining IA sections (Training / Competition / Problems / Cases / Paper / Profile) render clean「规划中」placeholder cards, never blank.
- Nav state persisted in `sessionStorage`.
- Dispose: unregister root + layout stub via `ctx.effect`.

### Coexistence rules (from Live Gate)
- `ui-layout` must be **disabled** while V2 owns root (profile patch `- id: ui-layout / disabled: true`).
- `dsh-thinking-counter` quarantined (registers `sidebar.footer.action` without `slots.inject` → boot abort race).
- `dsh-mathmodeling` must be **enabled** (workbench/tutor/footer provider) — its footer registers via `slots.inject`, safe under custom root.

### Enable / Disable (reproducible, restart-based path)
- `scripts/shell-v2-enable.ps1` — build, link into web profile, bundles entry, patch: disable `ui-layout`+`dsh-thinking-counter`, re-enable `dsh-mathmodeling`, keep old spike/mathmodeling tombstones harmless.
- `scripts/shell-v2-disable.ps1` — reverse; restores stock UI.
- Iteration loop on this machine additionally uses the super-injector hot path (install/reload/uninject, no host restart) — scripts remain the canonical reproducible path.

## 5. Loop protocol

实现 → 构建 (`npm run build`) → 装配/热注入 → 实机检查 (playwright-core + system Edge against `http://127.0.0.1:3080`) → UX/架构 Review → 修复 → 回归 → 再检查。
Artifacts: screenshots `REVIEW/shell-v2-*.png`, console logs captured per run, findings into review docs, small commits per stable step.

## 6. Exit gates (each requires explicit PASS/FAIL + evidence)

| Gate | Definition | Evidence |
|---|---|---|
| **H1 Agent** | Message sent in right-column native composer gets an agent reply | screenshot + reply text |
| **H2 Session** | Reload restores same sessionId + shell UI; session switch isolates ModelingContext | screenshots (refresh/switch) |
| **H3 Custom Shell** | Three columns render; nav switches center content incl. Dashboard→工作台; zero console errors | screenshots + console log |
| **H4 Skill/Tool** | `/modeling-tutor` replies with correct `model_id` pedagogy; offline tutor path OK | screenshot + API probe |
| **H5 Rollback** | Disable V2 → stock DSH UI fully restored (sidebar/conversation/files intact) → re-enable → shell returns | screenshots both directions |

`SHELL_V2_GATE = PASS` only when H1–H5 all PASS. Any FAIL → fix → re-run gate. After conclusion (and only then) the deferred items in §3 may start.

## 7. Documentation & commits

- `REVIEW/SHELL_V2_UX_REVIEW.md` — per-round UX findings (layout, density, wording, states).
- `REVIEW/SHELL_V2_ARCH_REVIEW.md — coupling, slot contracts, dispose hygiene, upgrade risk vs spike.
- `SHELL_V2_GATE_REPORT.md` — gate table + evidence links (final).
- `SHELL_V2_PROGRESS.md` — running log per loop round.
- Commits: small, per stable step, on `experiment/mathmodel-harness`. No force-push, no reset of `4f0fd3c`.

## 8. Risks / mitigations

| Risk | Mitigation |
|---|---|
| Runtime uninject of official `ui-layout` unsupported | Prefer profile-patch semantics; verify injector behavior early in R1; worst case gate the single restart on explicit user action |
| Slot double-register races | V2 boots `immediately=true`; register root only after ui-layout absent; dispose-safe ordering |
| Peer plugins (footer seat) race | Keep thinking-counter quarantine; document in enable script comments |
| LLM flakiness during H1/H4 | Offline tutor fallback already exists; retry once before FAIL verdict |
