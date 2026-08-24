# Feature Matrix

Comparison: **Our Workbench (MVP)** vs benchmark repos.

Legend: ✅ Strong · ⚠️ Partial · ❌ Missing · 🔗 External/deps · 📚 Content-only

| Feature | Ours | MathMN | math-model-agent (czy) | math-modeling-assistant | MathModel | MCM-Starter-Kit | MathModelAgent |
|---------|------|--------|------------------------|-------------------------|-----------|-----------------|----------------|
| **Dashboard workbench** | ✅ | ⚠️ legacy WebUI | ❌ CLI/skills | ✅ 6-tab SPA | ❌ | ❌ | ✅ Vue app |
| **Model Atlas / registry** | ✅ YAML 13 | ⚠️ in skills | ✅ 144 exports | ✅ 33 models UI | 📚 markdown | ❌ | ⚠️ via agents |
| **Interactive lesson** | ✅ K-Means | ❌ | ❌ | ❌ | 📚 | ❌ | ❌ |
| **Daily Review / SRS** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Modeling Gym (structure)** | ✅ 1 case | ⚠️ in analysis skill | ⚠️ in select-model | ⚠️ in Generator | ❌ | ❌ | ⚠️ |
| **Coach / Socratic mode** | ✅ | ⚠️ human-supervised | ⚠️ in workflow text | ❌ | ❌ | ❌ | ⚠️ HIL |
| **Competition workbench stages** | ✅ UI chips | ✅ full pipeline | ✅ run-manifest | ⚠️ Generator only | ❌ | ❌ | ✅ task flow |
| **Data Doctor** | ✅ heuristics | ⚠️ in analysis | ✅ data_diagnostics.py | ⚠️ in prompts | 📚 | ❌ | ⚠️ |
| **Feature engineering cards** | ✅ basic | ⚠️ in reports | ✅ modeling_contracts | ❌ | ❌ | ❌ | ⚠️ |
| **Model selector B/M/A** | ✅ rules | ✅ algorithm-lab | ✅ select-model skill | ⚠️ in Generator | ❌ | ❌ | ✅ ModelerAgent |
| **Algorithm Lab execution** | ❌ stub | ✅ multi-seed | ✅ solve-model + lib | ⚠️ code in Generator | 📚 | ❌ | ✅ Jupyter/E2B |
| **Multi-seed / aggregate stats** | ❌ | ✅ | ✅ production_guards | ❌ | ❌ | ❌ | ⚠️ |
| **Visualization Lab** | ❌ | ✅ figure-templates | ✅ sci_figures.py | ❌ | 📚 | ✅ templates | ⚠️ |
| **Paper Lab** | ✅ MD review | ✅ Typst/LaTeX 34 tpl | ✅ template/ + write skill | ✅ LaTeX preview | 📚 templates | ✅ writing rules | ✅ WriterAgent |
| **Paper Reviewer (evidence)** | ⚠️ term-based | ✅ 6verity + review-polish | ✅ review-model-paper | ✅ dedup/citation | ❌ | ❌ | ⚠️ |
| **Gap → training plan** | ✅ | ⚠️ benchmark learning | ✅ learning-reports | ❌ | ❌ | ❌ | ❌ |
| **Modeling Profile** | ✅ SQLite | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Problems / 真题库** | ❌ | ⚠️ workspaces | ✅ benchmarks meta | ✅ 2000–2024 | 📚 large corpus | ❌ | ⚠️ |
| **Case / paper distillation** | ❌ | ⚠️ 7benchmark | ✅ case yaml | ❌ | 📚 | ❌ | ❌ |
| **Resource Registry** | ❌ | ⚠️ manifest | ✅ external refs | ⚠️ problems_data | ✅ best source | ❌ | ⚠️ RAG |
| **Skill contracts** | ⚠️ 8 MD | ✅ 16 + scripts | ✅ 8 + schemas | ❌ prompts | ❌ | ⚠️ rules | ✅ many |
| **Integrity / claim ledger** | ❌ | ✅ full | ✅ run-manifest | ❌ | ❌ | ❌ | ⚠️ |
| **DSH integration** | ⚠️ optional | ✅ preset | ⚠️ Codex skills | ❌ | ❌ | ⚠️ Trae/Cursor | ⚠️ skill mode |
| **Offline / demo stable** | ✅ | ⚠️ needs toolchain | ⚠️ pip install | ❌ needs API | 📚 | ✅ | ❌ |
| **Tests** | ✅ 9 pytest | ✅ 15+ skill tests | ✅ algo tests + coverage | ❌ | ❌ | ❌ | ⚠️ |
| **License friendliness** | ours | PolyForm NC | Check LICENSE | MIT | Content | Check | Apache? |

---

## Feature Gaps Ranked (for Phase 2)

| Rank | Gap | Best source | User impact |
|------|-----|-------------|-------------|
| 1 | Evidence chain (claim → result file) | MathMN + czy run-manifest | Trust in Paper/Competition |
| 2 | Runnable algorithm library | czy `code/algorithms` | Algorithm Lab real execution |
| 3 | Problems / 真题中心 | Barson + czy benchmarks + MathModel links | Learn & Gym case supply |
| 4 | Multi-seed experiment aggregate | MathMN algorithm-lab | Modeling review credibility |
| 5 | Figure templates + caption rules | MCM kit + czy sci_figures | Paper Lab upgrade |
| 6 | Case Registry (distilled papers) | czy benchmark cases + MathModel | Gap analysis & Gym |
| 7 | PDF problem ingest | MCM kit extract_pdf | Competition intake |
| 8 | Full verity pipeline | MathMN 6verity | Long-term; not Phase 2 blocker |

---

## Features We Should NOT Import As-Is

| Feature | Source | Why not |
|---------|--------|---------|
| One-click full paper Generator | Barson, MathModelAgent | Conflicts with “AI不替代建模思考” |
| 33-model flat list without validation | Barson Models tab | We have Task×Family×Algorithm registry |
| Entire MathModel repo | zhanwen | Size, licensing, maintenance |
| MathMN full 16-skill chain in repo | MathMN | NC license + toolchain weight |
| E2B cloud interpreter default | MathModelAgent | Cost, complexity, demo fragility |

---

## Differentiation Matrix (pitch for share/demo)

| Dimension | Competition agents | Our workbench |
|-----------|-------------------|---------------|
| Primary user moment | 比赛 72h | 赛前学习 + 赛中辅助 |
| Success metric | PDF submitted | Mastery ↑ + rubric ↑ |
| AI default | Copilot/Agent | Coach in Gym/Lesson |
| Error → next step | Manual | Daily Review + Gap plan |
| Algorithm knowledge | Black box functions | Atlas lesson + Quiz |
