# Filesystem policy and shell extension review — 0.2.0-rc.1

Target checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source decisions

- `packages/fs/fs/src/index.ts`, `types.ts`: public `FileSystem` seam, opaque targets/versions, atomic write/edit intent, typed failures and three `fs/*` event contracts.
- `packages/fs/fs-observation-policy/src/index.ts`, `types.ts`: event-only in-memory observation gate keyed by `actor.agent.session` and target key; it occupies the first-intent decision slot and clears on fiber disposal. No policy service or persistence exists.
- `packages/fs/fs-local/src/index.ts` and `packages/fs/tool-fs/src/{read,read-target,write,edit}.ts`: local Backend identities and tool dispatch of observations/intents. `fs-local` cwd is a resolution base, not containment.
- `packages/shell/shell/src/index.ts`, `types.ts`: `ctx.shell.resolve`/`execute`, process/result contracts, cancellation and output vocabulary.
- `packages/shell/bash-local/src/index.ts`, `packages/shell/tool-bash/src/index.ts`: local subprocess-backed executor, model tool composition and background/timeout choices. `packages/bundle/base/cordis.patch.yml` selects sandbox backends and default filesystem observation policy, so overlay order must be checked in a real Profile.

## Independent consumer verification

Fixture: `evidence/tests/fs-shell-consumer/`, using published exact `0.2.0-rc.1` DSH dependencies, Cordis `4.0.4`, schemastery `3.18.4` and TypeScript. The first install attempt specified an unpublished schemastery version and failed with `ETARGET`; after pinning the package's actual published version, `npm install --ignore-scripts --no-audit --no-fund` installed 42 packages. The first build exposed a missing side-effect type import for `ctx.shell`; after adding `import type {} from '@deepseek-ai/dsh-shell'`, `npm run smoke` compiled and ran successfully:

```json
{"protectedWrite":true,"shellExit":0,"removedOnUnload":true}
```

The smoke mounted a local `ctx.fs`, custom readonly listener **before** `fs-observation-policy`, resolved a target in a temporary protected directory, and observed `FS_PERMISSION_DENIED` from the real waterfall. It then mounted local subprocess/bash and tools, ran the registered fixed-command tool definition against a Git workdir, obtained exit code 0, disposed its fiber and found the tool absent. The code blocks in both HOW-TOs were extracted verbatim into `howto-*` subdirectories and independently compiled with the fixture's installed release dependencies; both `tsc -p tsconfig.json` calls returned 0.

This does not prove full `tool-fs` read/write dispatch, Loader patch ordering, sandbox enforcement, ToolRuntime permission/approval dispatch, model-visible rendering, cancellation/timeout, background jobs, or process survival across reload. The direct tool-definition call bypassed the ToolRuntime pipeline.

## Parent ledger candidates

- `review-public-package-packages-fs`: route `package:@deepseek-ai/dsh-fs`, `dsh-fs-local`, `dsh-fs-observation-policy`, and `dsh-tool-fs` to `api-guardrails/filesystem-policy.md` and `how-to/guard-filesystem-writes.md`. The full public-package review still needs separate `fs-sandbox`, `tool-fs-search` and `tool-str-replace-editor` adjudication; this chapter does not claim their configurations or algorithms.
- `review-public-package-packages-shell`: route `package:@deepseek-ai/dsh-shell`, `dsh-bash-local` and `dsh-tool-bash` to `api-guardrails/shell-tool.md` and `how-to/add-shell-tool.md`. Pwsh, sandbox and persistent tool variants, plus shell-env, need separate source review before closing the whole group.
- `task:packages/fs/fs-local/README.zh.md:34`, `task:packages/fs/tool-fs/README.zh.md:53`, `task:packages/shell/bash-local/README.zh.md:30`, `task:packages/shell/tool-bash/README.zh.md:30`: the references explain the relevant contracts, but parent should adjudicate each operational heading against its exact task and any required separate HOW-TO.

The parent owns shared manifests, claims, coverage, API/member ledgers, indexes, source-map and the formal Skill. No shared file was changed by this task.
