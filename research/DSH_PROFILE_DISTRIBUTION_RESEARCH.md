# DSH Profile Distribution Research

**Date:** 2026-08-25
**Method:** direct inspection of the running DSH install (`@deepseek-ai/dsh` npx checkout), live `web` profile, and CLI help. All findings verified on this machine unless marked inferred.

---

## 1. Profile mechanism (verified)

A **profile** is a directory under `~/.dsh/profiles/<name>/`:

| File | Role |
|---|---|
| `package.json` | **Source of truth for assembly**: `dsh.profile.bundles` (ordered bundle list) + `dependencies` (npm specs, `link:` allowed) |
| `node_modules/` | installed deps; junction links for local packages |
| `cordis.patch.yml` | user patch layer, applied **after every bundle layer** (id-targeted overrides/disables/inserts) |
| `cordis.yml` | composed loader layer (generated/managed by DSH; lists every plugin id the loader runs) |
| `pnpm-workspace.yaml` | pnpm workspace for `dsh plugin --profile <name> add …` (nodeLinker: hoisted) |

Assembly: bundles expand into plugin entries → user patch layer applies → loader boots fibers. A plugin absent from all layers simply doesn't load; a `disabled: true` patch entry blocks a bundle from re-adding it.

## 2. CLI (verified from bin.js / startup.js help)

```text
dsh --profile <name> …            boot profile under $DSH_HOME/profiles/<name>
dsh web                           alias of --profile web
dsh --profile <name> web --port <p> --no-open
                                  web app flags: --host, --port (0 = OS pick),
                                  --no-open, --trusted-host
dsh plugin --profile <name> add <pkg>   install into profile (pnpm forward)
dsh --profile <name> --dump-config      print composed profile tree
```

Current instance on this machine: `node <npx-checkout>\@deepseek-ai\dsh\lib\bin.js web --no-open` → port 3080, profile `web`.

## 3. Shared vs per-profile state (verified)

| State | Scope |
|---|---|
| `~/.dsh/settings.yaml`, `.credentials.yaml` | **global** (model/API config shared) |
| `~/.dsh/sessions/`, `storages/`, `attachments/` | **global** (session data shared across profiles) |
| `~/.dsh/profiles/<name>/node_modules`, patch, composed layer | **per-profile** |
| loader registry / super-injector | **per running host** — `dev_*` tools act on the host they are loaded into |

Implication: a second profile instance gets the same model config and session data but its **own plugin stack** — exactly what product distribution needs.

## 4. Multi-instance behavior (verified)

The web app binds `127.0.0.1:<port>`; two profiles can run concurrently on different ports (web=3080, mathmodel=3100). No singleton lock observed on `~/.dsh` data dirs for read paths; session writes are append-only JSONL (`session-persistence-jsonl`).

## 5. Distribution model for MathModel product

```text
web profile      → stock DSH + user's own community plugins (untouched by product)
mathmodel profile→ dsh-base + dsh-web-app + @math-modeling/dsh-mathmodeling
                   + @math-modeling/shell-v2; patch: ui-layout disabled (Shell V2 owns root)
```

- Product install = create/refresh `mathmodel` profile dir + install deps (script: `scripts/mathmodel-profile-install.ps1`).
- Product run = `dsh --profile mathmodel web --port 3100 --no-open`.
- Uninstall product = delete profile dir. Web profile never touched.
- Iteration loop: rebuild package → restart mathmodel instance (safe — it does not host the agent session driving development).

## 6. Risks / notes

- `cordis.yml` is composed by DSH on first use — do not hand-edit; express intent via `package.json` bundles + `cordis.patch.yml`.
- `thinking-counter`-style footer races don't apply to the product profile (plugin not in product bundles).
- `agent-presets` roots point at the npx checkout — shared across profiles; fine for now, revisit for standalone distribution packaging.
- Upgrade guard (PHASE3 H0): diff slot catalog on DSH version bump — still open, tracked in Phase 3 plan.
