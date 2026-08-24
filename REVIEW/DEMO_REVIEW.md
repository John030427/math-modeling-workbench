# DEMO_REVIEW

Date: 2026-08-22

## Environment
- API `127.0.0.1:8000` health OK
- Web `127.0.0.1:3000` after clean `.next`
- Tests: 9 passed
- `next build` OK

## Script results

| Demo | Result | Notes |
|------|--------|-------|
| A K-Means | PASS | Animation page 200; Tutor scaling answer correct skill; Quiz API works |
| B Gym | PASS | Coach endpoints return guided prompts |
| C Competition | PASS | CSV diagnose detects missing+scale; selector returns triad |
| D Reviewer | PASS | Weak paper ~50s with gap plan |

## Issues found during demo
1. Initial Tutor mis-route — **fixed**
2. `/` 500 from corrupted `.next` — **fixed** by clean restart
3. Google Fonts timeout during build — **fixed** by local font stack

## Remaining demo risks
- Must start API before Web for Atlas data
- Avoid running `next build` while `next dev` shares `.next`
