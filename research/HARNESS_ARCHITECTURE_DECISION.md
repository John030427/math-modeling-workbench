# Harness Architecture Decision

**Date:** 2026-08-25 (updated after **Harness Live Gate PASS**)  
**Live Gate:** see `HARNESS_LIVE_GATE_REPORT.md`  
**Spike:** `packages/harness-spike`

---

## Option comparison

| Option | Stability | UI Freedom | DSH Upgrade Risk | Migration Cost | Ship to others | Long-term fit |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| **A. DSH Plugin** (`conversation.view` + footer) | **High** | Med | **Low** | **Low** | **High** | Strong incremental |
| **B. DSH Core + MathModel Shell** (harness L1) | Med | **High** | Med–High | Med | Med | Strong if layout seam stabilizes |
| **C. Thin Fork** (`ui-layout` only) | Med | High | **High** | High | Low | Maintenance burden |
| **D. Full Fork** | Low | High | High | Very high | Low | Only if upstream blocks product |

---

## Live Gate evidence (H1–H4)

```text
H1 Agent        = PASS
H2 Session      = PASS
H3 Custom Shell = PASS
H4 Skill/Tool   = PASS
HARNESS_LIVE_GATE = PASS
```

Custom MathModel shell **works** on current DSH: native Agent, session restore/isolation, `/modeling-tutor` + ModelingContext, disable/re-enable round-trip.

---

## Decision criteria (not “lowest engineering cost”)

| Criterion | Plugin (A) | Harness Shell (B) |
|-----------|------------|-------------------|
| **Final product UX** | Feels like “DSH + 数模 tab” — strong Agent, weaker dedicated learning chrome | Feels like **MathModel product** with Agent as first-class column — better IA for learn → practice → compete |
| **UI freedom** | Bound to conversation/footer/overlay contracts | Full three-column shell; still must honor slot children |
| **Modeling workflow fit** | Atlas/lesson inside a session tab; chat context-switching required | Nav + workbench + chat simultaneous — matches target IA |
| **DSH upgrade / maintenance** | Official slots only; low breakage | Must track `root` children, `ctx.layout`, sidebar child seats; peer plugins without `inject` can abort boot |
| **Stable release to other users** | Install plugin bundle — predictable | Requires profile patch (disable `ui-layout`, sometimes disable racing plugins) — higher support cost |

---

## Recommendation

```text
PRIMARY  = DSH Plugin
FALLBACK = MathModel Harness Shell (harness-spike / future product profile)
```

### Why PRIMARY stays DSH Plugin after Live Gate PASS

Live Gate proved Harness is **technically viable**, not that it is the best **default distribution**.

1. **Ship risk:** Harness needs profile-level `ui-layout` disable and currently must quarantine plugins that register footer seats without `slots.inject` (e.g. `dsh-thinking-counter`). That is fragile for “install and go” users.  
2. **Upgrade surface:** Plugin path only uses documented seats. Harness owns `root` — every DSH layout/sidebar contract change is a break risk.  
3. **Learning loop already works on Plugin:** session-scoped ModelingContext, `/modeling-tutor`, Atlas/K-Means shared UI, mastery — without replacing the shell.  
4. **UX gap is real but staged:** The product *wants* MathModel chrome; deliver it as an **opt-in profile / Phase H\*** after Plugin is the stable default, not as the only path.

### Why FALLBACK is Harness (not discard)

- Live Gate PASS means L1 composition is a credible product trajectory when you control the profile (lab machines, course image, power users).  
- Best UX for simultaneous workbench + Agent.  
- Keep spike maintained; promote to PRIMARY only when: (a) official layout replacement API or stable documented seam, (b) no need to disable third-party plugins, (c) upgrade checklist automatable.

---

## Primary / Fallback contracts

| | PRIMARY — DSH Plugin | FALLBACK — MathModel Harness |
|--|----------------------|------------------------------|
| Entry | `sidebar.footer.action` → `conversation.view` | Custom `root` + `mathmodel.workbench` |
| Chat | Native conversation | Native conversation (right column) |
| Tutor | `/modeling-tutor` + context API | Same |
| Domain | `packages/core` + `packages/ui` | Same shared packages |
| Install | Plugin bundle only | Bundle + profile patch |

---

## Next (only after this decision)

1. Keep Plugin as default on `master` / releases  
2. Maintain `experiment/mathmodel-harness` + enable/disable scripts  
3. Resume P2 GitHub Integration on **Plugin primary** (MathMN-lite, etc.)  
4. Revisit PRIMARY promotion when layout seam is official or packaging isolates peer-plugin races  

---

## Spike artifacts

| Item | Path |
|------|------|
| Layout plugin | `packages/harness-spike/` |
| Enable / disable | `scripts/harness-spike-enable.ps1`, `harness-spike-disable.ps1` |
| Live Gate report | `HARNESS_LIVE_GATE_REPORT.md` |
| Source audit | `research/DSH_HARNESS_SOURCE_AUDIT.md` |
