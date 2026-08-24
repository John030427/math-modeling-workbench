# ARCHITECTURE_REVIEW

## Verdict
Clear boundaries: Registry YAML, FastAPI services, Next UI, SQLite learning state.

## Findings

### High
- None blocking demo.

### Medium
1. Skill markdown not yet machine-parsed — logic duplicated in `offline_ai.py`.
2. Competition workspace folders created but Algorithm Lab / evidence chain incomplete.
3. DSH not process-coupled (intentional); future bundle packaging not started.

### Low
- `apps/web` rewrites `/api` to `:8000` — fine for local demo; needs env for deploy.

## Strengths
- Model Registry independent of UI
- Learning mastery shared across Quiz / Daily / Profile
- Offline AI gate for resilience
