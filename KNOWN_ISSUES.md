# KNOWN_ISSUES

## KI-1 Concurrent Next build/dev corrupts `.next`
- **Cause:** `next build` and `next dev` sharing `.next`
- **Impact:** Dashboard 500 / missing chunk modules
- **Workaround:** Stop dev → `Remove-Item -Recurse apps/web/.next` → start one of build or dev
- **Later:** Separate dist dir or CI-only build

## KI-2 Agent mode is mostly Copilot
- **Cause:** MVP timebox
- **Impact:** No auto EDA→train→paper pipeline
- **Workaround:** Use Competition stage buttons manually
- **Later:** Orchestrator skill with confirmation gates

## KI-3 Selector IDs without Atlas pages
- **Status:** Partially mitigated — added stub YAML for lp, milp, hierarchical-clustering, entropy-weight, xgboost
- **Remaining:** nlp/ga/sa/critic/gm11 etc. still recommendation-only
- **Later:** Continue stub pages + lessons

## KI-4 Optional LLM
- **Cause:** Key/network may be absent on stage machine
- **Impact:** Offline answers only
- **Workaround:** Built-in offline Tutor/Coach/Doctor — preferred for demo reliability
- **Later:** Explicit UI badge already shows `offline`
