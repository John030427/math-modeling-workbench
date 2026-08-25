# MathModel Profile Bootstrap — Research & Decision

**Date:** 2026-08-25
**DSH version tested:** 0.1.1-rc.2 (npx checkout install)
**Outcome:** `scripts/mathmodel-profile-init.ps1` implements the chosen route.

---

## Routes considered

| Route | Mechanism | Verdict |
|---|---|---|
| A. `dsh plugin --profile mathmodel add <pkg>` | official; forwards to pnpm; initializes profile on first use | viable, but adds packages one-by-one and hides bundle ordering |
| B. Template materialization (chosen) | repo `profiles/mathmodel-template/{package.json,cordis.patch.yml,pnpm-workspace.yaml}` → copy to `~/.dsh/profiles/mathmodel`, rewrite `__MM_REPO__` link paths, junction `@math-modeling/*`, `pnpm install` | explicit, reviewable, idempotent, matches how `web` profile itself is shaped |
| C. Hand-edit live profile | fragile, drifts | rejected |

## Chosen composition (verified via `dsh --profile mathmodel --dump-config`)

```text
bundles:
  @deepseek-ai/dsh-base
  @deepseek-ai/dsh-web-app
  @math-modeling/mathmodel-suite     ← single product bundle
suite bundle patch:
  insert mathmodel-shell (before) + dsh-mathmodeling (after)
  disable ui-layout (MathModel Shell owns root)
```

Dump-config evidence (2026-08-25):

```text
# == @deepseek-ai/dsh-web-app, patched by @math-modeling/mathmodel-suite
- id: ui-layout
  name: '@deepseek-ai/dsh-client-ui-layout'
  disabled: true
```

`scripts/mathmodel-profile-verify.ps1` asserts: suite/shell/domain present; ui-layout only-with-disabled-marker; zero community/user plugins; optional live health (`-LivePort 3100`).

## CLI notes

- Correct boot form for a custom profile: `dsh --profile mathmodel --port 3100 --no-open`.
  `dsh <name> web …` is NOT valid for custom names (`web` is a hardcoded alias of `--profile web` and rejects parent flags).
- `--dump-config` prints the composed tree INCLUDING disabled entries (annotated `disabled: true`) — verify semantics, not string absence.
- `pnpm-workspace.yaml` with `nodeLinker: hoisted` mirrors the web profile; explicit junctions for the three `@math-modeling` packages are still created by init as a resolution guarantee.

## Removal

`scripts/mathmodel-remove.ps1`: stop the :3100 listener → delete `~/.dsh/profiles/mathmodel`. The `web` profile is never referenced.
