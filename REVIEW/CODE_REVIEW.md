# CODE_REVIEW

## Verdict
Core paths typed; upload size limits present; no arbitrary code execution.

## Findings

### High
1. **Resolved** — JSX `{zᵢ}` parsed as expression in lesson page — escaped/rewritten.
2. Upload capped (5MB data, 2MB paper). Path traversal avoided (no user paths for reads beyond upload bytes).

### Medium
- SQLite `check_same_thread=False` with short-lived connections — OK for MVP single user.
- `on_event("startup")` deprecated in newer FastAPI — still works on pinned stack.
- Windows console encoding can garble Chinese in PowerShell smoke logs (app UTF-8 OK).

### Low
- Unused imports cleaned opportunistically; test suite 9 passed.

## Security notes
- No shelling out user code
- CORS `*` OK for local demo only
