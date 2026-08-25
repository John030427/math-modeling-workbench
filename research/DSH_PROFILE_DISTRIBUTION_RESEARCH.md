# DSH Profile / Bundle Distribution Research

**Date:** 2026-08-25  
**Target repository:** `John030427/math-modeling-workbench`  
**Target branch:** `experiment/mathmodel-harness`

## Executive Decision

Recommended architecture:

# **MathModel Harness = dedicated `mathmodel` DSH Profile + standard MathModel Bundles**

Do not make the user's ordinary `web` profile the primary product target, and do not maintain a full fork of DeepSeek Harness unless a future hard API limitation makes composition impossible.

```text
DeepSeek Harness installation
│
├── profile: web
│     └── normal DSH, untouched
│
└── profile: mathmodel
      ├── @deepseek-ai/dsh-base
      ├── @deepseek-ai/dsh-web-app
      ├── @math-modeling/mathmodel-suite
      │     ├── MathModel Shell
      │     ├── Modeling Core
      │     ├── Modeling Skills
      │     ├── Modeling Tools
      │     ├── Learning State
      │     └── Registry
      └── profile-local user overrides
```

Normal DSH and MathModel Harness become two different compositions of the same upstream runtime.

## 1. What upstream DSH explicitly supports

DeepSeek Harness states that every major part of the product is a Cordis plugin, including model adapters, tools, session log, agent loop and UI layers.

Official concepts:

```text
Bundle = what the author distributes
Profile = what the user boots
```

A bundle declares `dsh.bundle` and contributes a `cordis.patch.yml`. A profile declares the ordered `dsh.profile.bundles` list.

The final composition can be inspected with:

```bash
dsh --profile <name> --dump-config
```

Official references:

- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/README.md

## 2. Why a dedicated `mathmodel` Profile is better than modifying `web`

The current Shell V2 experiment proved that a custom shell can run on top of DSH Core, but injecting it into the ordinary `web` profile creates avoidable product problems:

- normal DSH usage is affected by MathModel experiments
- layout failures affect daily DSH work
- root/sidebar slot conflicts become user-facing
- coding/general-agent and mathematical-modeling IA are different products
- rollback becomes part of normal usage

A dedicated profile isolates them:

```text
dsh --profile web
→ normal DSH

dsh --profile mathmodel
→ MathModel Harness
```

## 3. Why not fork DSH now

A full fork gives maximum control but creates unnecessary maintenance debt:

- upstream is evolving quickly
- UI/session/tool changes create merge conflicts
- private APIs become accidental dependencies
- distribution becomes heavier
- compatibility with community plugins decreases

Before any future full fork, require `research/FULL_FORK_JUSTIFICATION.md` with exact blockers and attempted composition solutions.

## 4. Community evidence

### DSH Desktop

`anywhere-labs/dsh-desktop` is the strongest reference. It pins upstream DeepSeek Harness, runs upstream unchanged, and composes desktop shell/window/tray/profile management through DSH plugins.

References:

- https://github.com/anywhere-labs/dsh-desktop
- https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/plugin-development.md

### AKS1st/dock

`AKS1st/dock` shows that a DSH plugin can be a complete Workbench foundation with activity bar, sidebar, editor area, panels, status bar and an open `ctx.workbench` registry.

Reference:

- https://github.com/AKS1st/dock

### Awesome DSH Plugin ecosystem

The community convention is installable bundle packages using `dsh.bundle` and `dsh plugin add`.

Reference:

- https://github.com/awesome-dsh-plugin/awesome-dsh-plugin

## 5. Recommended product layers

### Layer A — Upstream DSH

Owns:

- Agent Loop
- Session event log
- LLM/model providers
- Tool execution framework
- Skills
- approvals
- credentials/settings
- sandbox/subprocess seams
- native Conversation

MathModel should reuse these.

### Layer B — MathModel Suite bundle

Suggested package:

```text
@math-modeling/mathmodel-suite
```

Responsibilities:

- mount MathModel shell
- mount MathModel domain integration
- register Skills and Tools
- mount registry services
- patch only UI rows needed by the dedicated profile

### Layer C — reusable domain libraries

```text
@math-modeling/core
@math-modeling/ui
@math-modeling/learning
@math-modeling/algorithm-provider
```

### Layer D — dedicated profile

Conceptual composition:

```text
@deepseek-ai/dsh-base
@deepseek-ai/dsh-web-app
@math-modeling/mathmodel-suite
```

The bootstrap must verify the actual installed DSH version and use installation-owned base/web bundles rather than installing a mismatched duplicate DSH copy.

Final verification:

```bash
dsh --profile mathmodel --dump-config
```

## 6. Recommended repository structure

```text
math-modeling-workbench/
├── packages/
│   ├── mathmodel-suite/
│   ├── mathmodel-shell/
│   ├── dsh-mathmodeling/
│   ├── core/
│   ├── ui/
│   ├── learning/
│   ├── algorithm-provider/
│   └── providers/
├── registry/
│   ├── models/
│   ├── problems/
│   ├── cases/
│   ├── quizzes/
│   └── figures/
├── profiles/
│   └── mathmodel-template/
└── scripts/
    ├── mathmodel-profile-init.ps1
    ├── mathmodel-start.ps1
    ├── mathmodel-verify.ps1
    └── mathmodel-remove.ps1
```

## 7. Shell consequence

Because MathModel runs in its own profile, it no longer needs to preserve the ordinary DSH sidebar inside the MathModel shell.

Target:

```text
MathModel Navigation | Modeling Workbench | Native DSH Conversation
```

Recommended desktop width:

```text
220px | minmax(0, 1fr) | 380–420px
```

Hard rules:

- exactly one sidebar
- Workbench visually dominant
- no embedded second DSH sidebar
- no permanent fourth Details column
- no duplicate `conversation.view` named “数模工作台”
- native DSH Conversation remains Agent surface
- project files use drawer/panel/tab when needed
- use DSH theme behavior
- shell owns presentation state only
- domain state remains in Session / ModelingContext / learning persistence

## 8. Compatibility strategy

Required:

- record installed DSH version during profile bootstrap
- document supported DSH version range
- isolate unavoidable internal UI dependencies under `dsh-compat/`
- test profile composition for every supported version
- keep `web` untouched as a recovery path
- verify rollback/removal

Prefer public services/events/slots.

## 9. Installation UX target

Development:

```powershell
./scripts/mathmodel-profile-init.ps1
./scripts/mathmodel-start.ps1
```

Public beta should have a single bootstrap flow that detects DSH, checks version compatibility, creates/updates only `mathmodel`, installs/pins MathModel bundle, validates `--dump-config`, and boots MathModel.

Normal DSH:

```bash
dsh --profile web
```

MathModel:

```bash
dsh --profile mathmodel
```

## 10. Architecture score

| Option | UI freedom | Upstream compatibility | User isolation | Distribution | Maintenance | Decision |
|---|---:|---:|---:|---:|---:|---|
| small plugin inside `web` | 5 | 9 | 3 | 9 | 8 | fallback |
| replace shell inside `web` | 9 | 7 | 2 | 7 | 6 | dev only |
| **dedicated `mathmodel` profile** | **9** | **8** | **10** | **9** | **8** | **PRIMARY** |
| thin DSH UI fork | 10 | 5 | 10 | 6 | 4 | emergency |
| full DSH fork | 10 | 2 | 10 | 4 | 2 | reject now |

# Final Decision

```text
PRIMARY = Dedicated MathModel DSH Profile + standard DSH Bundles
FALLBACK = ordinary DSH plugin / conversation.view compatibility mode
EMERGENCY = thin UI fork after documented hard blocker
REJECT = full DSH fork at current stage
```

Next engineering work should stop modifying the user's ordinary `web` profile and move the MathModel shell into a reproducible isolated `mathmodel` profile.
