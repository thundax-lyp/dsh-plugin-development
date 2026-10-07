# Session projection and storage-domain review — 0.2.0-rc.1

Target checkout: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

## Source adjudication

- `packages/session/session-projection/src/index.ts` and `src/types.ts`: public registry, definition, declaration-merge maps, snapshots, checkpoints, effect ownership, pure synchronous fold and wire view. The registry derives its state from committed `session/event`; it does not write Session facts.
- `packages/session/session-projection-cache/src/index.ts` and `src/spec.ts`: optional `session_projcache` per-record domain, positive count/interval configuration, mandatory creation/`turn/end`/dispose writes, identity-bound rows, version filtering, log-tail restore, fail-soft durable write. Cache is a derived shortcut; cache presence is not proof of an authoritative Session event.
- `packages/storage/storage/src/index.ts`, `backend.ts`, `registry.ts`: storage hub and Backend registry; the hub mounts a form and selects a named Backend, while Backend implementations own their media.
- `packages/storage/storage-domain/src/index.ts`, `spec.ts`, `domain.ts`, `events.ts`, `error.ts`: domain spec checks, type-safe KV handle, read/open schema validation, durable-before-memory write chain, post-commit event, explicit async close and failure codes. No domain-level validation runs on newly supplied values at write time.
- `packages/storage/storage-json/src/index.ts`: `root`-configured `json` Backend. `packages/bundle/base/cordis.patch.yml` supplies the default storage/projection composition; a custom Profile must supply its own service order and config.

## Independent consumer verification

Fixture: `evidence/tests/projection-storage-consumer/`, with exact `0.2.0-rc.1` DSH dependencies, Cordis `4.0.4`, TypeScript and Zod. In that directory, `npm install --ignore-scripts --no-audit --no-fund` succeeded (21 packages). The first `npm run smoke` failed at TypeScript because the harness tried `ctx.dispose()`; the declared disposal API is `ctx.fiber.dispose()`. After correcting the harness, `npm run smoke` succeeded: `tsc -p tsconfig.json`, then a real Node run printed:

```json
{"projection":{"before":0,"after":1},"storage":{"restored":"second","removed":true,"changed":["put:a","put:a","deleted:a"]}}
```

This observes declaration merge, projection registration, Session append and snapshot, JSON Backend durability after close/reopen, serial update/delete, and `domain/changed` order in one process. It does not exercise Cache service, Profile Loader, Browser/Client, process restart, corruption recovery, Backend failure injection, permission checks, or plugin fiber unload/reload.

The three fenced source files in each HOW-TO were extracted verbatim into `evidence/tests/projection-storage-consumer/howto-*/` and compiled separately with the installed exact-release dependencies using `../node_modules/.bin/tsc -p tsconfig.json`. Both `register-session-projection` and `persist-domain-records` examples compiled with exit code 0. Compilation alone does not establish their Profile loading or disposal behavior.

## Coverage ledger candidates for parent integration

- `review-public-package-packages-session`: route `package:@deepseek-ai/dsh-session-projection` to `api-guardrails/session-projection.md` and `how-to/register-session-projection.md`. Route `package:@deepseek-ai/dsh-session-projection-cache` to the same reference; no custom cache author example is claimed.
- `review-subsystem-subsystems-session-projection` / `subsystems:session-projection`: route to the projection reference and complete registration HOW-TO.
- `task:packages/session/session-projection-cache/README.zh.md:34` and `:55`: source-checked cache configuration/read behavior belongs in the projection reference; accept only after parent inspects the exact heading/task disposition.
- `review-public-package-packages-storage`: route `package:@deepseek-ai/dsh-storage`, `@deepseek-ai/dsh-storage-domain`, and `@deepseek-ai/dsh-storage-json` to `api-guardrails/storage-domain.md` and `how-to/persist-domain-records.md`. `@deepseek-ai/dsh-storage-sqlite` still requires separate Backend config/behavior review; this chapter only records that it is exported.
- `task:packages/storage/storage-json/README.zh.md:34`: JSON Backend setup is covered by the storage-domain HOW-TO, subject to parent task-heading adjudication.

The parent owns shared `coverage.json`, claims, API-surface ledger, indexes and source-map. This review did not edit those files or the formal generated Skill.
