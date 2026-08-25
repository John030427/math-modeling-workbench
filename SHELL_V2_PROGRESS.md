# Shell V2 Progress Log

| Round | Action | Outcome |
|-------|--------|---------|
| R0 | Plan doc absent → reconstructed `MATHMODEL_HARNESS_SHELL_V2_PLAN.md` from directive + Live-Gate evidence; committed pending Live-Gate work (8c3b3f3) | plan authoritative |
| R1 | Scaffold `packages/shell-v2` (host health, ShellFrame, build, unit tests 4/4) + enable/disable/smoke scripts; commit 590dc4f | built |
| R1 | Hot assembly: install mathmodeling → uninject ui-layout/thinking-counter → install shell-v2 | live, no restart |
| R1 | H3 attempt 1: frame mounts, 8 tabs, 0 errors; test selector miss | driver fixed (data-mm-title/section hooks) |
| R1 | H3 PASS; visual review → **U1 critical: dark-on-dark theme mismatch** | UX review written |
| R1 | H1 attempt: send-button selector miss | driver: Enter-first send |
| R1 | Theme probe: body is LIGHT, `--dsh-bg` undefined → root cause confirmed | — |
| R2 | Theme-adaptive palette (derive from body + MutationObserver); rebuild + hot reload | H3 re-run PASS, screenshots clean |
| R2 | H2 PASS (ctx isolation A/B + reload restore; assert helper fixed) | — |
| R2 | H1 PASS (token-count wait) | — |
| R2 | H4: offline tutor ✓; composer `/`-palette ate Enter → Escape→Enter + geometric fallback; chip rendering → reply-based wait | H4 PASS |
| R2 | U2 fixed (header padding); commits 793dd70 | — |
| R3 | H5 round trip: uninject shell-v2 → heal-links → reload ui-layout → stock PASS → re-inject → shell PASS | rollback safe |
| R3 | enable script: clears stale shell-v2 disabled marker (restart path) | — |
| R3 | Full regression h1–h4 + API smoke + dark-theme adaptation check | ALL PASS |
| R3 | Gate report + reviews finalized | SHELL_V2_GATE = PASS |
