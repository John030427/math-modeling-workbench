# SKILL_REVIEW

## Verdict
Skills are contract-based; offline fallbacks keep demos alive.

## Findings

### Critical
- None.

### High
1. **Resolved** — Trigger conflict: `标准化` → Data Doctor overshadowed Tutor. Lesson conceptual routing now wins.
2. Coach mode forced in `llm.chat` for mode=coach — good; Gym also forces coach.

### Medium
- Agent mode largely shares Copilot backend (no full autonomous pipeline yet).
- Feature Engineering / Paper Writer skills are thin stubs vs Tutor/Reviewer.

### Low
- Prompt duplication between SKILL.md and offline templates — acceptable for MVP; keep SKILL.md as source of policy.

## Validation checks
- Tutor scaling answer mentions 量纲/欧氏/收入 ✓
- Coach refuses full dump ✓
- Reviewer requires evidence terms / penalizes missing validation ✓
- Selector prefers LP over PSO when linear ✓
