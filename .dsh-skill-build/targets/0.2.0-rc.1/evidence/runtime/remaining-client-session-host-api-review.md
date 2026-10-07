# Remaining Client, Session, and Host API adjudication

Target `dsh-v0.2.0-rc.1` at commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`. The [machine matrix](remaining-client-session-host-api-matrix.json) is a recommendation for shared `api-surface.json`; this pass did not modify that ledger or the formal Skill. It covers the requested fifteen packages: 38 public entries, 349 objects, and 821 discovered members. Every row records current decision, recommendation, exact source, owner, section, and plugin task.

| Group | Entries | Objects | Members | Newly recommended included objects | Routing decision |
| --- | ---: | ---: | ---: | ---: | --- |
| `dsh-deepseek-account` | 2 | 35 | 91 | 0 | Existing abstract account Service is the only full replacement contract; account DTOs merge into it. |
| `dsh-session-title` | 4 | 39 | 82 | 3 | Provider request, result, cadence now appear in the provider section. |
| `dsh-workspace` | 3 | 30 | 63 | 0 | Existing registry and owner types carry the task; activity/domain DTOs merge. |
| `dsh-skill` | 1 | 23 | 70 | 11 | Provider, candidate, definition, lookup, observation, and registration types have section-local contracts. |
| `dsh-commands` | 6 | 29 | 47 | 0 | Existing command registry/input objects carry the task; brand, Remote, Typert, and type aliases merge. |
| `dsh-system-prompt` | 2 | 22 | 42 | 7 | Prompt section/context, assembly input and rendering functions support the author task. |
| `dsh-authorization` | 3 | 27 | 57 | 5 | Flow interaction and prompt/result data are documented under authorization. |
| `dsh-compaction` | 4 | 22 | 37 | 0 | Existing service/result contracts carry the task; checkpoint and invariant subpaths merge or exclude. |
| `dsh-fs` | 2 | 18 | 58 | 5 | Target, observation, write intent, info, and error are the operation contract. |
| `dsh-remote-mock` | 1 | 19 | 45 | 6 | Stream script helpers and handle now have a section-local test author contract. |
| `dsh-sdk-client` | 1 | 16 | 54 | 4 | External harness options, low-level client/session, and run result support SDK Profile use. |
| `dsh-shell` | 1 | 17 | 60 | 3 | Executor request, execution handle, and settled result support a custom shell tool. |
| `dsh-plan-mode` | 4 | 15 | 23 | 3 | Config, projection, and exit tool identifier attach to the Plan mode task. |
| `dsh-terminal` | 1 | 22 | 72 | 13 | Owner-scoped request/result/status/signal types now have a field table. |
| `dsh-user-approval` | 3 | 15 | 20 | 3 | Request, policy, and closed outcome have a section-local field table. |

## Source decisions

The exact checkout package manifests confirm all listed entry subpaths. `./invariant` exports are Cordis implementation wiring and have no independent third-party task route. `./types`, `./brand`, `./checkpoint`, `./remote`, `./typert`, and `./client` rows are merged when they mirror or support a canonical Host task; current shared-ledger exclusions remain excluded. A `merged` member is public but does not warrant an independent included symbol/field promise in this owner section.

`packages/session/session-title/src/index.ts` defines `SessionTitleProviderRequest` with live `session`, message snapshot, optional route, and abort signal; `SessionTitleProviderResult` carries title, exact message seqs, and optional used model. `packages/terminal/terminal/src/types.ts` defines request, read, send, status, signal, and snapshot vocabulary; `src/index.ts` defines stable `TerminalErrorCode` values. `packages/test-support/remote-mock/src/streams.ts` defines `frames`, `openStream`, `streamHandle`, `streamMethod`, and `StreamHandle` cancellation/termination semantics. `packages/interaction/user-approval/src/{index,types}.ts` defines closed policy/outcome and the answerer request fields. These are the documentation gaps repaired in `session-title.md`, `terminal.md`, `testing-support.md`, `tool-policy-hooks.md`, and `planning.md`.

`packages/skill/skill/src/index.ts`, `packages/core/system-prompt/src/index.ts`, `packages/credentials/authorization/src/{index,types}.ts`, `packages/fs/fs/src/index.ts`, `packages/sdk/client/src/index.ts`, and `packages/shell/shell/src/index.ts` are the canonical code sources for the other newly recommended included objects. Their existing owner sections already name the relevant objects and task members. The matrix retains already included objects, even when a sibling type alias or helper remains merged.

## Checks and boundary

The checkout HEAD matches the target commit. Matrix JSON parsed successfully. All matrix package manifests and object source files exist in that checkout. Every mapped owner heading exists, and each newly recommended included object/member name appears within its exact owner section. The touched Markdown and JSON files have no trailing whitespace. This pass added type and task explanations; it did not compile new TypeScript, start a Profile, run a Remote/Client browser, or repeat prior scenario tests. Token presence is a static gate, so integration should still review whether each recommendation deserves an `included` ledger decision.
