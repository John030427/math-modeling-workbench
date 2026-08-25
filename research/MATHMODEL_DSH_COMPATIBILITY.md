# MathModel × DSH Compatibility Notes

**Tested DSH version:** 0.1.1-rc.2
**Isolation layer:** `packages/mathmodel-shell` (client) — all DSH-facing assumptions live here; domain packages stay DSH-agnostic below the slot/API contracts.

---

## Internal seams relied upon (with risk)

| Seam | Purpose | Tested | Risk | Fallback |
|---|---|---|---|---|
| `ctx.slots.register('root', …)` + children declaration (`sidebar/conversation/details/shell.overlay`) | replace layout | Live Gate H3 + PRODUCT_UI_GATE | Medium — replacing root must re-declare official children or boot aborts | keep declaration list in sync; upgrade guard task (P-H0) |
| `ctx.reflect.provide('layout', stub)` | ui-sidebar inject resolves even when seat is not rendered | Live Gate | Low | none needed while ui-sidebar stays bundled |
| `window.__MM_SHELL_HOST__` set at shell module evaluation | dsh-mathmodeling skips compat registrations (U4) | PRODUCT_UI_GATE U4 | Medium — relies on suite patch insert ORDER (shell before dsh-mathmodeling) | if order ever breaks: duplicate tab reappears (visible in gate), fix = reorder insert block |
| WebRoute `{kind:'exact', handler:(req,res)}` | health endpoints | Live Gate | Low | — |
| `dsh.client.immediately = true` | shell boots before late plugins | Live Gate | Low | — |
| `dsh --profile <name> --port N` pass-through args | product instance | P2/P3 | Low | — |

## Deliberately NOT used

- Patching DSH core packages, forking ui-layout, global page APIs, second LLM backend.
- `sidebar.footer.action` in dedicated mode (compat mode only, web profile).

## Upgrade checklist (on DSH version bump)

1. `scripts/mathmodel-profile-verify.ps1` (dump-config composition)
2. `node scripts/product-ui-gate.mjs` (U1–U7 + 4 viewports)
3. `scripts/shell-v2-live.mjs h1/h2/h4` against `:3100`
4. web profile stock spot-check (`shell-v2-h5.mjs stock` on :3080)
