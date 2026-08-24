# DSH Web Client — UI Capability Matrix (Third-Party Plugins)

**Date:** 2026-08-25  
**Scope:** `@math-modeling/dsh-mathmodeling` UI integration  
**Rule:** Do **not** patch DSH Core or assume undocumented navigation APIs.

Sources: DSH official slot contracts (`@deepseek-ai/dsh-client-ui-*`, `@deepseek-ai/dsh-cordis-client-runner`), shipped plugins (`dsh-thinking-counter`, `ui-trajectory`, `dshmarket`), P0/P1 integration testing on web profile.

---

## Summary (plugin path)

| Capability | Official API today | Third-party use |
|------------|-------------------|-----------------|
| Sidebar footer action | ✅ `sidebar.footer.action` (list, root) | **Primary entry** — 📐 数模工作台 |
| Session body tab | ✅ `conversation.view` (list, **session**) | **Primary workbench surface** |
| Session details panel | ✅ `details` (single, session) | Read-only context / future inspector |
| Global floating layer | ✅ `shell.overlay` (list, root) | **Fallback drawer** only |
| Settings page | ✅ `settings.section` | Plugin config (not workbench) |
| Composer dock | ✅ `conversation.composer.dock` | Status chips, not main UI |
| **Root-scoped third-party global page** | ❌ No formal API | **Do not implement** |
| **Sidebar primary nav slot** (between New Session & Workspace) | ❌ No formal additive API | **Do not implement** |
| **Additive right-side plugin panel** | ❌ No formal API | **Do not implement** |
| **Fourth AI chat column** | ❌ Not in contract | **Do not implement** — use Chat + `/modeling-tutor` |

## Full matrix (audit)

| Capability | Public API | Internal API | Feasible | Risk | Decision |
|------------|:---:|:---:|:---:|:---:|---|
| footer action | ✅ | — | ✅ | Low | **Use** — primary entry |
| shell overlay | ✅ | — | ✅ | Low | **Fallback only** |
| conversation view | ✅ | — | ✅ | Low | **Primary workbench** |
| custom root layout | ⚠️ patch disable+replace | `root` registrant | ✅ spike | **High** | **Experiment only** — `harness-spike` |
| replace sidebar | ❌ additive | `sidebar` occupied | ⚠️ | High | **No** — custom `mathmodel.nav` in harness |
| reuse conversation | ✅ | ConversationRoot | ✅ | Med | **Yes** — declare `conversation` child |
| session state | ✅ hooks | session store | ✅ | Low | **Use** session-scoped APIs |
| custom events | — | DOM events | ✅ | Med | Overlay fallback only |
| tool registration | ✅ host | tool core | ✅ | Low | Future P3 |
| skill registration | ✅ host | agent loop | ✅ | Low | **modeling-tutor** |
| python runtime | ✅ code-runtime | worker thread | ✅ | Med | Algorithm provider later |

See `research/DSH_HARNESS_SOURCE_AUDIT.md`.

---

## Available extension points (use these)

### `sidebar.footer.action`

- **Kind:** list · **Scope:** root  
- **Use:** Footer button「📐 数模工作台」  
- **Behavior:** Associate with **current session** → `actions.setView('mathmodeling')`  
- **Do not:** Replace DSH sidebar primary navigation or inject items above Workspace list

### `conversation.view`

- **Kind:** list · **Scope:** session  
- **Use:** Tab alongside built-in views, e.g. `[对话] [数模工作台] [轨迹]`  
- **Registration:** `id: 'mathmodeling'`, `order: 50`, `label: () => '数模工作台'`  
- **Inject:** `(sessionId) => ({ sessionId, setDraft, setView, … })`  
- **Content:** Full workbench IA (Dashboard, Atlas, K-Means, …) — **inside this view only**

### `details`

- **Kind:** single · **Scope:** session  
- **Use:** Optional future context inspector (not P1 primary)

### `shell.overlay`

- **Kind:** list · **Scope:** root · click-through until entry opts in  
- **Use:** **Fallback** compact drawer when session tab path unavailable (no active session, `setView` failure)  
- **Do not:** Replace `conversation.view` as primary workbench

### `settings.section` / `web-ui.plugin.item`

- **Use:** Install metadata, plugin settings — not product workbench

---

## Not available (do not assume)

| Assumption | Status |
|------------|--------|
| Third-party **global page** replacing main content | ❌ No `root` occupant besides ui-layout AppFrame |
| New item in sidebar between「新会话」and Workspace list | ❌ No additive primary-nav slot |
| Permanent **right rail** plugin panel | ❌ No `details`-style root panel for plugins |
| Plugin-owned **global left nav** section | ❌ Would shadow shipped sidebar |
| Standalone **AI Tutor column** in workbench | ❌ Use DSH Chat + `modeling-tutor` skill |

**Policy:** Only adopt new layout extension points after they appear in official DSH slot contracts / release notes — never via Core patches.

---

## Math Modeling Workbench — approved UI flow

```text
sidebar.footer.action 「📐 数模工作台」
  → bind to current (or dedicated math-modeling) Session
  → conversation.view tab「数模工作台」
  → Session header: [对话] [数模工作台] [轨迹]

conversation.view「数模工作台」internal nav:
  Dashboard · Model Atlas · K-Means Lesson · Gym · Competition
  · Problem Library · Case Library · Paper Reviewer · Profile
  (P1: Dashboard + Atlas + K-Means live; others placeholder until P4–P8)

AI Tutor:
  Plugin updates ModelingContext (session-scoped)
  → User uses DSH Chat with /modeling-tutor
  → No plugin-embedded LLM chat UI

Fallback:
  shell.overlay drawer (same workbench component, degraded path)
```

---

## Anti-patterns (explicitly rejected)

1. Full-screen overlay **as primary** UI (P0 drawer) — superseded by `conversation.view`  
2. Duplicating **AiDock** / fourth chat column inside plugin  
3. Patching `cordis.patch.yml` of DSH base to add nav slots  
4. Treating `apps/web` AppShell as reference for DSH layout  
5. Assuming `GET /api/mathmodeling/context` without `session_id` (global context)

---

## References

| Artifact | Path |
|----------|------|
| Architecture | `ARCHITECTURE.md` |
| Phase 2 plan | `PHASE2_PLAN.md` |
| P1 review | `REVIEW/P1_PLUGIN_REVIEW.md` |
| Plugin client | `packages/dsh-mathmodeling/src/client/index.tsx` |
| Shared UI | `packages/ui/src/ModelingWorkbench.tsx` |
