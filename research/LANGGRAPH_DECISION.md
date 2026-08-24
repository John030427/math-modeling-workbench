# LangGraph — Integration Decision

**Date:** 2026-08-25  
**Decision:** **DO NOT INTEGRATE YET**

---

## Comparison

| Dimension | DSH Session | LangGraph |
|-----------|-------------|-----------|
| Event log | Session projection + trajectory UI | Checkpoint / thread state |
| Human checkpoint | Plan mode, ask-user tool, coach skill | Native interrupt nodes |
| Parallel branches | Subagents, workflows (limited) | DAG parallel branches |
| Replay / fork | Session export, compaction | Checkpoint replay |

---

## Current product needs

| Need | Required now? | DSH sufficient? |
|------|---------------|-----------------|
| Competition multi-stage workflow | Partial (P6) | Likely yes with skills + tools |
| Human review gates | Yes (coach, reviewer) | Yes |
| Parallel algorithm sweeps | No (P3 provider batch later) | Mock/local first |
| Replay for grading | Nice-to-have | Session log export |

---

## Verdict

Competition workflows are **not yet** complex enough to mandate LangGraph.  
Re-evaluate when Competition Workbench needs explicit DAG (branching judges, parallel model runs with merge) **and** DSH workflow tools prove insufficient.

```text
STATUS = DO NOT INTEGRATE YET
```
