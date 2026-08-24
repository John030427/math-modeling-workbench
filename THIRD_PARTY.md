# Third-Party Dependencies

Pinned third-party code used by Math Modeling Workbench.  
**Rule:** Application code must not import third-party internal paths directly — only through `AlgorithmProvider` adapters.

---

## Planned: chengziyue1222/math-model-agent (czy-provider)

| Field | Value |
|-------|--------|
| Repository | https://github.com/chengziyue1222/math-model-agent |
| Purpose | Optional algorithm execution adapter (`czy-provider`) |
| Pin | **TBD** — lock to commit SHA before enabling in production |
| License | **Verify before enable** — read `LICENSE` at pinned commit |
| Integration | `packages/core/algorithm-provider/czy-provider/` wraps public `algorithms` exports only |
| Status | **Not linked in P0** — interface + stub only |

### License check (pending)

- [ ] Read LICENSE at pinned commit
- [ ] Confirm compatible with our repo license and DSH plugin distribution
- [ ] Record attribution in plugin `THIRD_PARTY_NOTICES.md`

---

## DSH ecosystem (runtime peers)

| Package | Purpose | Notes |
|---------|---------|--------|
| `@deepseek-ai/cordis` | Plugin host/client runtime | Peer dependency |
| `@deepseek-ai/dsh-host-webserver` | HTTP routes | Peer |
| `@deepseek-ai/dsh-client-runtime` | Browser plugin loader | Peer |
| `@deepseek-ai/dsh-client-ui-slots` | UI extension points | Peer |
| `@deepseek-ai/dsh-super-injector` | Hot install/uninstall | Dev/install tool |

---

## Reference / benchmark repos (not vendored)

| Repo | Use |
|------|-----|
| ShuoSachiko/MathMN | Integrity patterns (PolyForm NC — no code copy) |
| Barson0588/math-modeling-assistant | Problems IA reference (MIT) |
| zhanwen/MathModel | External links only |
| Gunp-666/MCM-AI-Starter-Kit | Figure rules reference |

See `research/GITHUB_BENCHMARK.md`.

---

## Update policy

When pinning or upgrading a third-party dependency:

1. Update this file (commit SHA, license, date).
2. Run adapter test suite.
3. Update `packages/dsh-mathmodeling/THIRD_PARTY_NOTICES.md` if shipping their code/assets.
