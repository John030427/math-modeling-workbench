# MathModel Profile — Phase 3 Execution Plan

**Date:** 2026-08-25
**Status:** ACTIVE — supersedes `PHASE3_HARNESS_MIGRATION_PLAN.md` H0/H6 scope (that file remains as the long-horizon H1–H6 roadmap).
**Direction (decided):** 普通 `web` profile 保持原版 DSH；产品迁移为独立 **`mathmodel` profile** + 标准 DSH bundles。
**Research basis:** `research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md` · **PRD:** `PRODUCT_PRD.md`

---

## P3-0 Docs (this round)

- [x] `research/DSH_PROFILE_DISTRIBUTION_RESEARCH.md`
- [x] `PRODUCT_PRD.md`
- [x] this plan

## P3-1 Independent profile

- [ ] `scripts/mathmodel-profile-install.ps1` — create/refresh `~/.dsh/profiles/mathmodel`:
  - `package.json` bundles: `@deepseek-ai/dsh-base`, `@deepseek-ai/dsh-web-app`, `@math-modeling/dsh-mathmodeling`, `@math-modeling/shell-v2`
  - dependencies: `link:` → repo `packages/dsh-mathmodeling`, `packages/shell-v2`
  - `cordis.patch.yml`: disable `ui-layout`（Shell V2 拥有 root；产品 bundles 无 thinking-counter，无页脚竞态）
  - install deps (idempotent)
- [ ] Build both product packages before install.

## P3-2 Launch

- [ ] `scripts/mathmodel-profile-start.ps1` — `bin.js --profile mathmodel web --port 3100 --no-open` (background-capable)
- [ ] Boot verify: HTTP 200 on `/`, shell-v2 + mathmodeling health endpoints OK on 3100.

## P3-3 PRODUCT_UI_GATE (blocking)

Per `PRODUCT_PRD.md` §5: G1–G6 live-checked on **3100** with playwright + screenshots into `REVIEW/profile-gate/`; **G7** = 3080 remains stock. Report: `PRODUCT_UI_GATE_REPORT.md`.

## P3-4 Web profile restore to stock (after gate)

- [ ] Uninject `shell-v2` + `dsh-mathmodeling` from `web` profile (hot) and remove their bundles/deps entries
- [ ] Restore `ui-layout` (+ `dsh-thinking-counter`) — remove tombstones, heal links, reload
- [ ] Verify 3080 stock (h5-stock equivalent) — product lives only in `mathmodel` profile from now on

## P3-5 Docs sync

- [ ] `ARCHITECTURE.md` — distribution shape: dual-profile (web stock / mathmodel product), Shell V2 as product chrome
- [ ] `PRODUCT.md` — distribution + run instructions

## Loop protocol

实现 → 构建 → 实机测试（3100）→ 截图 Review → 修复 → 回归 → commit → **push** → 下一轮。

## Deferred (hard-blocked until PRODUCT_UI_GATE PASS)

MathMN-lite · czy-provider · 题库 · 案例库 · 论文评审 V2（GitHub Integration 系列）。

## Risks

| Risk | Mitigation |
|---|---|
| New profile first-boot composition unknown | Try minimal files (package.json + patch); if composition fails, fall back to derived cordis.yml from web profile minus community entries |
| Port conflict | 3100; start script checks listener first |
| Web profile restore breaks agent session | super-injector stays installed in web profile; restore order: product gate first, then uninject product entries; ui-layout reload verified by h5-stock check |
| Sessions/storage shared across profiles | Accepted (same user data); product isolation is at plugin-stack level, not data level |
