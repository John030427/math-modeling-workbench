# Nightly Decisions

**Date:** 2026-08-25

| ID | Decision |
|----|----------|
| ND-01 | **PRIMARY delivery = DSH Plugin** (`conversation.view`); harness layout = FALLBACK experiment |
| ND-02 | Harness spike via **L1 composition** (disable `ui-layout` bundle row, insert `harness-spike`) — no DSH Core patch |
| ND-03 | Custom nav uses **`mathmodel.nav`** slot; do not inject into shipped `sidebar` primary list |
| ND-04 | **OpenHands** = optional future `AlgorithmProvider` only |
| ND-05 | **LangGraph** = DO NOT INTEGRATE YET |
| ND-06 | `AlgorithmProvider` interface + mock provider in core; no czy wiring this cycle |
| ND-07 | Profile `cordis.patch.yml` auto-fix removes `dsh-mathmodeling disabled` on install |
