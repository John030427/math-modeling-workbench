# Harness Architecture Decision

**Date:** 2026-08-25  
**Context:** Spike `packages/harness-spike` — disable `ui-layout`, custom 3-column shell

---

## Option comparison

| Option | Stability | UI Freedom | DSH Upgrade Risk | Migration Cost | Long-term |
|--------|:---:|:---:|:---:|:---:|:---:|
| DSH Plugin (`conversation.view`) | **High** | Med | **Low** | **Low** | Strong for incremental features |
| DSH Core + MathModel Shell (L1 patch) | Med | **High** | Med | Med | Strong if layout seam stable |
| Thin Fork (`ui-layout` only) | Med | High | **High** | High | Maintenance burden |
| Full Fork deepseek-harness | Low | High | High | **Very high** | Only if upstream blocks product |

---

## Recommendation

```text
PRIMARY   = DSH Plugin (conversation.view + shared packages/core + packages/ui)
FALLBACK  = DSH Core + MathModel Shell (harness-spike layout patch)
```

**Reason:** Plugin path satisfies official contracts, zero layout fork risk, and ships today. Harness spike **proves** custom shell is technically possible (L1 composition) for future dedicated product skin — but upgrade coupling on `root` + child slot contracts makes it **FALLBACK**, not default.

**Risk:** Custom layout must re-declare `conversation` child; missing declaration silently removes chat. Mitigation: spike tests + slot catalog diff on DSH upgrades.

---

## Spike artifacts

| Item | Path |
|------|------|
| Layout plugin | `packages/harness-spike/` |
| Enable / disable | `scripts/harness-spike-enable.ps1`, `harness-spike-disable.ps1` |
| Audit | `research/DSH_HARNESS_SOURCE_AUDIT.md` |
