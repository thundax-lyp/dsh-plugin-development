# Utility package disposition

Target `dsh-v0.2.0-rc.1` at commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. Each row was checked against its package exports and source in the exact checkout. These are public reusable helpers, but none supplies a Cordis registration or a distinct plugin-author assembly task.

| Package manifest | Candidate | Export entries | Symbols | Decision reason |
| --- | --- | ---: | ---: | --- |
| `packages/util/brand/package.json` | `dsh-brand` | 1 | 4 | Type-only branded primitive helper; its exports carry no Context service, Loader row, provider, or plugin installation step. |
| `packages/util/chunked-list/package.json` | `dsh-chunked-list` | 1 | 4 | Persistent in-process collection algorithm; the package exports list data structures, not DSH state ownership or a Profile extension. |
| `packages/util/deque/package.json` | `dsh-deque` | 1 | 1 | General in-process deque implementation; no Cordis registration, Host/Client service, or plugin task is attached to this package. |
| `packages/util/lazy-require/package.json` | `dsh-lazy-require` | 1 | 1 | CommonJS lazy module loading helper; the package does not own DSH plugin loading or Profile lifecycle. |
| `packages/util/code-language/package.json` | `dsh-util-code-language` | 1 | 3 | Shared extension-to-syntax-highlighting lookup table for existing UI/read tools; no external language registration API or plugin task. |
| `packages/util/crypto/package.json` | `dsh-util-crypto` | 1 | 3 | Browser-safe UUID and byte conversion primitives; generic algorithms rather than DSH plugin extension contracts. |
| `packages/util/time/package.json` | `dsh-util-time` | 1 | 1 | IANA time-zone validation and canonicalization helpers; no scheduler provider or timezone registry extension. |
| `packages/util/values/package.json` | `dsh-util-values` | 1 | 7 | Generic lossless JSON and immutable value helpers; canonical tool results and Session facts are documented at their owning APIs. |
| `packages/util/workspace-path/package.json` | `dsh-util-workspace-path` | 1 | 12 | Browser-safe Workspace path presentation helpers; Workspace registration and activity ownership are documented at the Workspace service. |
| `packages/util/atomic-write/package.json` | `dsh-atomic-write` | 1 | 4 | Atomic file replacement/lock helper with no DSH storage-domain provider registration; plugin persistence is documented at Storage Domain. |
| `packages/util/timeout/package.json` | `dsh-timeout` | 1 | 8 | Generic bounded-deadline and cancellation helper; each owning tool/provider API defines its own timeout and abort contract. |
