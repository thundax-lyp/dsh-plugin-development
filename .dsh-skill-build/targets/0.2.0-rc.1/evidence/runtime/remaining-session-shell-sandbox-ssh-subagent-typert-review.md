# Remaining package dispositions — dsh-v0.2.0-rc.1

Exact checkout `4878cdabd87d4041bdaff61d04c966883b9fd07a`. Scope: `packages/session`, `shell`, `sandbox`, `ssh`, `subagent`, `typert`, `test-support`; the parent retains shared ledger changes. These decisions are based on package manifests, public `src/index.ts` entrypoints and their referenced implementation, not on package names alone. Existing focused evidence/references own behavior details and verification limits.

## Session packages

| Package | Disposition and exact source basis |
| --- | --- |
| `dsh-session-checkpoint-policy` | Merge into `api-session-persistence.md` / Agent-loop durability composition. `src/index.ts` function plugin injects `llm`, `sessionPersistence`, `sessions`, `tools`; it places semantic flushes before model request/tool side effect and completed steps. It does not define a new Session writer or custom checkpoint-provider registration task. |
| `dsh-session-format`, `dsh-session-format-catalog`, `dsh-session-format-v0-to-v1`, `v1-to-v2`, `v2-to-v3`, `v3-to-v4` | Explicit maintenance exclusion from plugin extension task. `session-format-catalog/src/generated.ts` statically imports all released adjacent codecs/edges; JSONL imports that catalog directly. `session-format-storage-backend-review.md` records per-package details and the absence of runtime plugin registration. |
| `dsh-session-log-deepseek` | Merge into `api-deepseek-request-extensions.md`: `src/index.ts` injects `deepseekLlmApiExtensions`/`sessions` and folds accepted DeepSeek request-extension watermarks; provider-specific Session history, not a general Session format writer. |
| `dsh-session-persistence-jsonl` | Merge into `api-session-persistence.md`: published production backend with root/compression config and concrete ownership/durability, not a replacement for the abstract backend SPI. Its migration catalog is fixed. |
| `dsh-session-projection`, `dsh-session-projection-cache` | Merge into `api-session-projection.md`: public fold definition/registry and optional derived checkpoint cache. Cache only accelerates replay; it is not Session authority. Focused isolated consumer evidence already exists. |
| `dsh-session-stats`, `dsh-session-turn-outline` | Merge into `api-session-projection.md` as built-in projection implementations. Each `src/index.ts` is a function plugin injecting `sessionProjections` and registering a fixed `sessionStats` or `turnOutline` unit; a custom plugin defines its own projection with the generic registry, rather than extending these built-ins. |
| `dsh-session-telemetry-otel` | Merge into `api-runtime-diagnostics-telemetry.md`: `src/index.ts` is a concrete `SessionTelemetryBackend` provider over OTel HTTP, with feedback authorization and bounded output. Custom telemetry backend authors use the seam; ordinary plugins do not repurpose OTel transport internals. |
| `dsh-session-title` | Merge into `api-session-title.md`: registry, log-backed title facts and custom provider task already documented and isolated-tested. |
| `dsh-session-title-llm`, `dsh-session-title-first-prompt-llm`, `dsh-session-title-all-prompts-llm` | Merge into `api-session-title.md`: shared auxiliary LLM route/framing/timeout policy and two concrete cadence plugins. These are composition choices, not three independent provider SPIs; custom provider authors use `SessionTitleProvider` contract. |

## Shell packages

| Package | Disposition and exact source basis |
| --- | --- |
| `dsh-bash-sandbox`, `dsh-pwsh-local`, `dsh-pwsh-sandbox` | Merge into `api-shell-tool.md` + `api-sandbox.md`: concrete `ShellExecutor` providers, selected by Profile and target OS. `bash-sandbox` and `pwsh-sandbox` wrap exact argv through `ctx.sandbox`; `pwsh-local` uses PowerShell over subprocess. Do not mount two `ctx.shell` providers simultaneously. No distinct custom backend SPI beyond `ShellExecutor`. |
| `dsh-shell-env` | Include new real plugin contribution task: `src/index.ts` exports `ShellEnvRegistry.register/collect/list` and `BashEnvContributor`; model shell tools consume per-execution managed `DSH_*` facts. New `api-shell-env.md` and `how-to-contribute-shell-environment.md`, isolated npm consumer passes. |
| `dsh-tool-bash-persistent`, `dsh-tool-pwsh-persistent` | Merge into `api-terminal.md` / `api-shell-tool.md`: concrete owner-scoped model tools over `ctx.terminals`; they do not implement a terminal backend. Need real PTY/Profile test for model visibility, not inferred from registration. |
| `dsh-tool-pwsh` | Merge into `api-shell-tool.md`: model tool consumer over `ctx.shell` and `ctx.shellEnv`, PowerShell Profile alternative to `tool-bash`; no extra plugin provider registry. |

## Sandbox and SSH packages

| Package | Disposition and exact source basis |
| --- | --- |
| `dsh-sandbox`, `dsh-sandbox-local`, `dsh-sandbox-policy` | Merge into `api-sandbox.md`: abstract `ctx.sandbox`, local runner implementation, and per-call policy resolver. Policy and OS enforcement are separate; source review did not run platform confinement. |
| `dsh-sandbox-windows-acl` | Merge as Windows-only concrete runner under `api-sandbox.md`. Public `src/index.ts` exports ACL grants, SID/path helpers and backend options, but its effect is an OS-specific sandbox implementation, not cross-platform plugin policy. No Windows execution validation here. |
| `dsh-ssh`, `dsh-fs-ssh`, `dsh-subprocess-ssh`, `dsh-sandbox-ssh` | Merge into `api-ssh.md`/`api-subprocess.md`/`api-sandbox.md`: `SshConnection` owns versioned POSIX helper and connection, FS/subprocess/sandbox packages provide corresponding remote capability in one execution world. No arbitrary helper-method plugin extension or remote handshake validation. |

## Subagent packages

| Package | Disposition and exact source basis |
| --- | --- |
| `dsh-subagent` | Include under `api-subagent-provider.md`: named provider registry, one-shot and continuable service operations. Custom provider is the actual extension task; its lifecycle/permission constraints are documented there. |
| `dsh-subagent-claude-code`, `dsh-subagent-codex`, `dsh-subagent-dsh-sdk` | Merge as concrete out-of-process one-shot providers under `api-subagent-provider.md` and ACP/SDK-specific composition notes. `src/index.ts` of each registers a profile-named provider with its own external process/SDK/protocol; none grants generic provider capabilities or model tool visibility automatically. No external SDK handshake in this pass. |
| `dsh-subagent-fork-in-process`, `dsh-subagent-spawn-in-process` | Merge as built-in in-process providers under `api-subagent-provider.md`: fork seeds a child from parent prefix; spawn starts a fresh child. Concrete compositions, not new SPIs. |
| `dsh-subagent-in-process-driver` | Merge/exclude as implementation helper: shared child-Agent lifecycle driver consumed by in-process spawn/fork providers, no standalone Profile/Client plugin task. Its public export alone does not warrant recommending direct use instead of the provider contract. |
| `dsh-tool-subagent`, `dsh-tool-subagent-control` | Merge into `api-subagent-tools.md`: model-facing delegation and control tools over `ctx.subagents`; providers are separately registered. Do not conflate `sendMessage` receipt with result or tool presence with provider availability. |

## Typert packages

| Package | Disposition and exact source basis |
| --- | --- |
| `dsh-typert-protocol` | Merge into `api-remote-api.md`: `Remote`/`RemoteScope`, `TypertRemoteService`/binding, `RemoteError` and typed wire metadata are the Host Remote declaration contract. |
| `dsh-typert-generator` | Merge into `api-remote-api.md` and `how-to-add-remote-api.md`: analyzer/emitter/generator is a build step that owns generated Host descriptors and Client contribution; generated artifacts must not be hand-edited. No runtime Cordis provider task. |
| `dsh-typert-loader` | Merge into `api-remote-api.md`: Loader observes mounted package entries, resolves `./typert`, validates and registers into `ctx.typert`; explicit `Config.packages` handles nested entries. Not a new business Remote method declaration seam. |
| `dsh-typert-registry` | Merge into `api-remote-api.md`: Host registry for generated package reflection/Zod schemas; manual `ctx.typert.register` is available for handwritten wire schemas/non-Loader compositions. Ordinary plugin-generated Remote follows `./typert`+Loader path. |

## Test support packages

| Package | Disposition and evidence |
| --- | --- |
| `dsh-agent-loop-testkit` | Distinct Host AgentLoop Inbox test task; `how-to-test-agent-loop-inbox.md` and independent npm fixture pass. |
| `dsh-client-test-runtime` | Source-workspace Client Slot test task; independent npm TypeScript compile passes but Vitest collection fails because published renderer lacks `src/client/bind.ts`. `testing-support-review.md` records exact failure. |
| `dsh-llm-mock-server` | Distinct LLM Messages fault-server task; `how-to-test-llm-adapter-faults.md` and independent server consumer pass. No adapter tested. |
| `dsh-llm-replay`, `dsh-session-snapshot` | Explicit specialized ACP/keyless snapshot corpus boundary, not generic plugin unit tests; no isolated consumer validation. |
| `dsh-loader-smoke` | Conditional Host Profile task in `how-to-smoke-test-loader-profile.md`; requires real app bin/config/driver, not run here. |
| `dsh-remote-mock` | Distinct Client Remote request task in `how-to-test-client-remote-call.md`; independent decoded carrier consumer passes, real browser and generated Remote untested. |

## Parent integration candidates

- New topic `api-shell-env.md` ← `skill-source/api-guardrails/shell-env.md`; task `how-to-contribute-shell-environment.md` ← `skill-source/how-to/contribute-shell-environment.md`.
- Existing topic merges and exclusions above should each receive a package/entry disposition; do not mark a package validated because a neighboring provider fixture passed.
- This matrix is a semantic route map. Runtime evidence is limited to the focused consumer files and failures named here; no Windows ACL confinement, SSH handshake, external subagent protocol, full Client browser, or Session migration was run.
