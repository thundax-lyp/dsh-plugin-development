# rc.1 Skill source integration status (2026-10-07)

Target: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. This is an interim audit, not a freeze or release certificate.

## Integrated topics

Core tool/bundle/Cordis/timer/Loader/HMR plus Remote, Client Modules, Client Slots/resources, Profile plugin manager, Session log/persistence/query, credentials/authorization/settings/permission presets, subagent/ACP/tools, and LLM providers/model routing have draft source references, claims, manifest mappings, route and keyword entries, and source-map sections. Some linked task paths and API ledger entries are still pending; a topic listed here does not imply complete capability adjudication.

## Observed independent checks

- Host tool bundle, timer and Group consumer Profile checks: see their dedicated files under `evidence/tests/` and `evidence/runtime/`.
- Client presence bundle: build/pack/Node VM; real isolated Web Profile and Chrome show one DOM marker and its removal during runtime uninstall (`client-presence-web-smoke.md`).
- Client UI: TypeScript snippets and an isolated lazy Client bundle build/pack/Node VM passed; real slot/resource browser lane pending (`client-ui-slots-resources-review.md`).
- Remote: Host/Client typechecks and target Typert generator fixture passed with the target's decorator shim; full checkout build, Gateway and browser lane pending (`remote-api-review.md`).
- Authorization: independent Host package TypeScript build and pack dry-run passed; Profile and interaction pending (`credentials-permissions-review.md`).
- LLM fixed-text Adapter: Host build/pack and in-process Cordis route/stream/unload passed; intentionally rejects real Agent messages; Profile/Agent/Web/provider lane pending (`llm-provider-review.md`).
- Session fact folding: isolated TypeScript check passed; Agent turn, flush, crash recovery and backend process tests pending (`session-persistence-review.md`).

## Current gate

`validate-skill-source.mjs <target>` still fails at the first pending capability disposition, `coverage.dispositions[6].decision is unsupported: pending`. Keep manifest `draft`; do not run freeze/build/replace. The remaining candidate/API/task ledgers require detailed semantic adjudication, examples, and missing real behavior tests before formal Skill replacement. The already staged/unstaged/untracked formal `skills/dsh-plugin-development/**` belongs to pre-existing workspace state and has not been used as source or replaced.
