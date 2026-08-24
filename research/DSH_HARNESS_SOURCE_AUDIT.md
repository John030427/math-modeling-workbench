# DSH Harness Source Audit (0.1.1-rc.2)

**Date:** 2026-08-25  
**Sources:** `~/.dsh/profiles/node_modules/@deepseek-ai/*`, `dsh-client-runtime/lib/types/client/slots.d.ts`, `dsh-cordis-client-runner` slot catalog, `dsh-web-app/cordis.patch.yml`, live profile `web`.

---

## Executive answers

| # | Question | Answer |
|---|----------|--------|
| 1 | Can `ui-layout` be replaced? | **Yes** — profile patch `disabled: true` on `ui-layout` + insert alternate `root` registrant. Not additive; must disable shipped layout. |
| 2 | Who registers `root`? | **`@deepseek-ai/dsh-client-ui-layout`** — `AppFrame` via `ctx.slots.register({ name: 'root', children: … })`. |
| 3 | Custom layout without forking whole DSH repo? | **Yes (Level 1)** — custom bundle patch disables `ui-layout`, inserts `@math-modeling/harness-spike`. No DSH Core source edit. |
| 4 | Reuse official sidebar / conversation in custom shell? | **Conversation: yes** — declare `conversation` child under custom `root`; `ui-conversation` injects into declared slot. **Sidebar: no as primary nav** — `sidebar` is child of shipped layout only; custom nav needs new slot (e.g. `mathmodel.nav`). |
| 5 | Client plugin dependency boundary | `peerDependencies`: `cordis`, `dsh-client-runtime`, slot UI packages. Browser half: **no `fetch`/`require`** — use `host.call` / ctx services. |
| 6 | Custom layout breaks session/chat? | **Risk if `conversation` slot not declared** under custom `root` — conversation UI vanishes. Spike declares `conversation` + `session-maybe` scope. |
| 7 | Bundle disable/replace UI plugin? | **Yes** — `cordis.patch.yml` `disabled: true` on row id (e.g. `ui-layout`). Profile layer applied after bundles. |
| 8 | Undocumented stable seams? | `shell.overlay`, `conversation.view`, footer actions — documented in slot catalog. `root` registration is documented but **explicitly forbids third-party use**. |
| 9 | Public vs internal | **Public:** slot catalog entries, `dsh-client-runtime` README, package `exports`. **Internal:** `AppFrame` internals, layout store, concession solver — not exported from `ui-layout/client`. |
| 10 | Upgrade risk | Layout fork must track `ui-layout` child slot names + scopes; `conversation` single-slot replace risk if `ui-conversation` changes contract. |

---

## Architecture (shipped web)

```text
dsh-web-app cordis.patch
  → ui-layout registers root + children: sidebar, conversation, details, shell.overlay
  → ui-sidebar → sidebar slot
  → ui-conversation → conversation slot (ConversationRoot)
  → plugins → conversation.view, sidebar.footer.action, shell.overlay, …
```

Custom harness:

```text
disable ui-layout
  → harness-spike registers root + children: mathmodel.nav, mathmodel.workbench, conversation, shell.overlay
  → ui-conversation still mounts conversation (unchanged)
  → dsh-mathmodeling → mathmodel.workbench + modeling-tutor skill
```

---

## Level assessment for MathModel Harness

| Level | Feasibility | Evidence |
|-------|-------------|----------|
| **L1 Composition** | ✅ Proven in spike | `packages/harness-spike/cordis.patch.yml` |
| **L2 Thin fork** | Likely if L1 insufficient | Fork `ui-layout` AppFrame only — `packages/client/ui-layout` in deepseek-harness repo |
| **L3 Full fork** | Not required for spike | No evidence yet |

---

## Spike implementation

| Artifact | Path |
|----------|------|
| Layout plugin | `packages/harness-spike/` |
| Enable script | `scripts/harness-spike-enable.ps1` |
| Disable script | `scripts/harness-spike-disable.ps1` |
| Smoke | `tests/harness-spike-smoke.ps1` |

**Experiment branch:** work on `experiment/mathmodel-harness` after baseline checkpoint.
