# Resource Comparison

Problems, papers, templates, cases — how benchmark repos handle **content** vs our need for **Resource / Case Registry**.

---

## Resource types compared

| Resource type | Ours (MVP) | MathMN | czy | Barson | zhanwen/MathModel | MathModelHub | MCM kit |
|---------------|------------|--------|-----|--------|-------------------|--------------|---------|
| 历年赛题 | ❌ | workspaces (local) | benchmarks/ 12 meta | 2000–2024 UI | 国赛/美赛 folders | 2020–2025 C | ❌ |
| 优秀论文 | demo weak md | exercise reports | case metadata | ❌ | 大量 PDF/md | O奖 samples | ❌ |
| 论文模板 | ❌ | 34 Typst/LaTeX | CUMCM tex | LaTeX in Generator | LaTeX/Word | mcmthesis | ❌ |
| 算法教程 | Atlas YAML | skill refs | algorithms code | Models tab text | 算法 folder | notebooks | ❌ |
| 思维导图 | ❌ | ❌ | ❌ | ❌ | Mind/ | ❌ | ❌ |
| 训练案例 | 1 gym JSON | 3 exercise snapshots | 12 benchmark yaml | ❌ | ❌ | per-year workspace | ❌ |
| 真题→生成器 | ❌ | ❌ | ❌ | ✅ click fill | ❌ | ❌ | ❌ |
| External links only | ❌ | ⚠️ | ✅ policy | ⚠️ | ⚠️ mixed | ⚠️ | ❌ |

---

## Barson — Problems IA (best UX reference)

**Structure:**

- `src/problems_data.py` — structured list: year, contest (MCM/ICM/CUMCM), problem letter, title snippet, tags
- UI: filter by year/contest → **one click fill Generator**

**What to adopt (IA only, not UI clone):**

```text
Problem Library (二级模块)
├── Browse: year × contest × type tag
├── Detail: statement excerpt + official link + difficulty
├── Actions:
│   ├── Open in Modeling Gym (Coach)
│   ├── Open in Competition Workbench
│   └── Compare with Case Registry (优秀方案 distill)
```

**Do not adopt:** Generator as primary entry (conflicts with learning loop).

---

## chengziyue1222 — Benchmark cases (best machine-readable)

**Location:** `benchmarks/cases/cumcm-2020-a.yaml` … `2023-c.yaml`

**Policy (`catalog.yaml`):**

- `statement_policy: external-reference-only` — no copied full statements in repo
- Linked rubric: `rubric.yaml` with hard gates:
  - source_traceability
  - reproducible_result
  - answers_all_subproblems
  - no_fabricated_evidence

**Case YAML fields (typical):**

- problem id, year, track
- model families expected
- minimum baselines
- validation targets
- common failure modes

**Adopt:** Same schema for our `registry/cases/` + link from Gym and Daily Review.

---

## zhanwen/MathModel — Content corpus (best volume)

**Organization:**

```text
国赛试题/  美赛论文/  数学建模算法/  数学建模Latex模版/
2021年数模悉知论文模版/  …  Mind/  Matlab入门教程/
```

**Characteristics:**

- Thousands of files; Chinese undergraduate focus
- Not API-friendly; MD5 checksum docs
- **Cannot vendor into our repo**

**Adopt — Resource Registry pattern:**

```yaml
# registry/resources/cumcm-2023-c.yaml (example shape)
id: cumcm-2023-c
type: problem
title: "2023 CUMCM C题"
source: external
url: "https://..."
mirror_repo: "zhanwen/MathModel"
mirror_path: "国赛试题/2023/..."
tags: [prediction, classification]
companion_cases: []
distilled: false   # true when Case Registry entry exists
```

---

## MathMN — Exercise / audit resources

- `workspaces/EXERCISE_SUMMARY.md` — 2024-A, 2025-A/B end-to-end reports
- `7benchmark-mathmodel` — sealed benchmark protocol
- Distilled **process** not bulk PDFs

**Adopt:** 2–3 **Case Registry** entries distilled from public exercise summaries (problem type, decomposition, validation gaps) — not full papers.

---

## MathModelHub — Workspace organization

```text
past_problems/     # README index
competitions/2026/ # year workspace
templates/         # latex/word
data_analysis/     # visualization notebooks
```

**Adopt:** Align our `workspace/<competition_id>/` layout (already similar) with **past_problems index** doc generated from Resource Registry.

---

## MCM-AI-Starter-Kit — Figure & writing resources

| Asset | Path | Use |
|-------|------|-----|
| Font/plot rules | `Rules/font_standard.md` | Visualization Lab defaults |
| Academic tone | `Rules/xueshu.md` | Paper Writer skill ref |
| Output layout | `Rules/output.md` | workspace figures/ naming |
| Viz scripts | `Viz_Templates/*.py` | Template IDs like MathMN figure-templates |
| PDF extract | `Tools/extract_pdf.py` | Problem Reader |

---

## Proposed unified registries (our repo)

### 1. Resource Registry (`registry/resources/`)

**Purpose:** Index external problems, papers, templates, links.

| Field | Required |
|-------|----------|
| id, type (problem/paper/template/tutorial) | yes |
| title, year, contest | yes |
| source_url or mirror_repo/path | yes |
| tags (task types) | yes |
| license_note | yes |

### 2. Case Registry (`registry/cases/`)

**Purpose:** Distilled learning cases (NOT full paper copy).

| Field | Required |
|-------|----------|
| problem_ref → Resource Registry | yes |
| problem_type, decomposition | yes |
| data_processing, feature_engineering | yes |
| model_choice, algorithm_choice | yes |
| validation, innovation | yes |
| strength, weakness, transferable_lessons | yes |
| gym_drill_ids | optional |

### 3. Relationship to existing modules

```text
Resource Registry ──→ Problem Library UI (new secondary)
        │
        ├──→ Modeling Gym (case variants)
        ├──→ Competition Workbench (import problem)
        └──→ Case Registry ──→ Gap Analysis (compare user vs case)
```

---

## Content we already have (seed)

| Asset | Path | Upgrade |
|-------|------|---------|
| customers.csv | demo/data | Link to cumcm-style clustering case |
| weak_kmeans_paper.md | demo/papers | Case Registry negative example |
| delivery-vrp | demo/gym/cases.json | Add resource_ref + benchmark rubric |
| kmeans quiz | registry/quizzes | Tie to Case Registry KU |

---

## Resource comparison verdict

| Need | Best primary source | Integration style |
|------|---------------------|-------------------|
| 真题 metadata | Barson IA + czy benchmark schema | Build `registry/resources` + UI browse |
| 真题 full text | Official sites + MathModel links | **Never copy**; link + PDF upload |
| 优秀论文学习 | zhanwen + Case distill | Case Registry only |
| 模板 | czy template/ + MathModelHub | Submodule or download script |
| 图表模板 | MCM kit + czy sci_figures | Skill + template IDs |
| 训练评分 Rubric | czy rubric.yaml + ours | Merge hard gates into Reviewer |

---

## Problems center — should we add a module?

**Recommendation: Yes — as secondary under Competition + Atlas, not top-level Dashboard #7.**

| Option | Pros | Cons |
|--------|------|------|
| A. Top-level “真题中心” | High visibility | Dashboard crowded |
| B. Tab inside Competition | Natural workflow | Less visible for learners |
| **C. Dual entry: Atlas “Problems” + Competition “Import from library”** | Learn + compete paths | Slightly more nav |

**Chosen in INTEGRATION_DECISIONS:** Option C.
