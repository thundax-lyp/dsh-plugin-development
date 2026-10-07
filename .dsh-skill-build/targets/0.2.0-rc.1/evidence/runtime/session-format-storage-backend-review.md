# Session format / SQLite storage review — dsh-v0.2.0-rc.1

Checkout commit: `4878cdabd87d4041bdaff61d04c966883b9fd07a`. New files only; no shared ledger/index/source-map edits.

## Package dispositions

| Package(s) | Exact source and decision |
| --- | --- |
| `@deepseek-ai/dsh-session-format` | Public pure `types.ts`, `chain.ts`, `catalog.ts`; `SessionFormatMigration`/codec/catalog can be constructed in a separate program, but no active JSONL runtime registry. Treat as DSH format-maintenance primitive, not ordinary plugin provider. |
| `@deepseek-ai/dsh-session-format-catalog` | `src/generated.ts` generated static imports for V0→V4 and current version 4; `src/children.ts` only substitutes V3→V4 child evidence. Production JSONL imports catalog in `session-persistence-jsonl/src/format.ts` and `src/index.ts`. Merge into Session format boundary, no plugin migration HOW-TO. |
| `@deepseek-ai/dsh-session-format-v0-to-v1`, `v1-to-v2`, `v2-to-v3`, `v3-to-v4` | Each public package supplies the adjacent first-party edge/codec used by generated catalog. They are version conversion implementation packages; no per-package plugin task. |
| `@deepseek-ai/dsh-session-persistence-jsonl` | Production JSONL Session backend; already owned by `api-session-persistence.md`. Its physical format and migration catalog are not a plugin override point. |
| `@deepseek-ai/dsh-storage` | `src/index.ts`, `backend.ts`, `registry.ts` expose the actual Backend SPI, registry, service key, KV unit contract. New reference/HOW-TO candidate here. |
| `@deepseek-ai/dsh-storage-sqlite` | `src/index.ts` exports `SqliteStorageBackend`, `Config`, `apply`; registers built-in `sqlite` on hub; backend owns `node:sqlite` database and KV units. Candidate custom wrapper/provider and Profile route. |
| `@deepseek-ai/dsh-storage-json` / `@deepseek-ai/dsh-storage-domain` | Existing `api-storage-domain.md` and `how-to-persist-domain-records.md` own JSON and domain spec usage. Link, avoid duplicate facts. |
| `@deepseek-ai/dsh-session-query-sqlite` | Session query index package, not domain KV or Session format conversion; disposition belongs to Session query topic. |

Object-level ledger guidance: mark the `session-format` pure compiler/types, `session-format-catalog` static catalog and `session-format-v*-to-v*` edge/codec exports excluded from ordinary plugin API tasks with the concrete reason that production JSONL binds the generated catalog statically and exposes no plugin registration or injection hook. `session-format-catalog/message-projections` is part of the current Session reader's fixed message projection, not a plugin provider. For `storage-sqlite`, `SqliteStorageBackend` and `Config.path`/`journalMode` are used by the custom provider task; `apply`/`inject`/`name` are the built-in `sqlite` plugin composition path. `STORAGE_SQLITE_SCHEMA_VERSION` is backend medium maintenance metadata, not a domain record versioning API. `storage`'s BackendRegistry/StorageBackend/KvFacet/KvUnit/storageBackendServiceKey belong to the SPI reference; other root utility exports need individual disposition, not automatic include from a public package.

## Independent consumer

`evidence/tests/sqlite-storage-consumer`: `npm install --ignore-scripts --no-audit --no-fund` installed 12 packages; `npm run smoke` passed TypeScript compile and Node runtime. Test registers provider name `archive`, provides `storage.backend.archive`, routes `StorageDomain` to it, writes a domain record, disposes Context/database, mounts a new Context at same file, reads and updates. SQLite was a real file under `mkdtemp`, removed at end. This verifies custom registration and built-in medium reuse, not implementation of a novel medium. No full backend contract suite, crash, multiprocess, or historical Session migration run.

## Parent integration candidates

- `api-session-format-storage-backend.md` ← `skill-source/api-guardrails/session-format-storage-backend.md`.
- `how-to-mount-storage-backend.md` ← `skill-source/how-to/mount-storage-backend.md`.
- Reference heading “Session 格式与 Storage Backend”; task heading “挂载自定义 Storage Backend”.
- Mark Session format edge packages as covered by explicit exclusion/merge rationale, not unreviewed. Mark runtime validation only for wrapper registration + SQLite reopen; do not assign that evidence to format migrations or new medium implementations.
