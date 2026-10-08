# Host/Core and agent-execution API guardrails

This reference is pinned to `@deepseek-ai/dsh-agent@0.2.0-rc.2` (`dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`). It covers Host-side plugin seams. Client and Typert Remote entry points are separate runtime sides: do not import Host services into a browser bundle, and do not infer a working remote round trip from a `./client`, `./remote`, or `./typert` export alone.

## Agent, Session, and scope

Mount `@deepseek-ai/dsh-agent` for `ctx.agents: AgentRegistry`; mount `@deepseek-ai/dsh-agent-loop` to install the concrete factory. `AgentRegistry.create(options: CreateAgentOptions)` and `resume(options: ResumeAgentOptions)` return an `AgentHandle` whose `agent` exposes `send`, `followup`, `steer`, `inject`, `cancel`, `whenIdle`, `runMaintenance`, `status`, `session`, and `inbox`. Creation/resume fails if no loop factory is registered. `AgentHandle.dispose()` owns teardown; caller abort and explicit `agent.cancel()` are distinct from merely dropping the handle.

`Agent.send()` starts user work, `followup()` queues later user work, `steer()` targets the current/next step, and `inject()` contributes plugin-attributed context without waking an idle agent. Use the active agent/scope when registering scoped tools or prompt entries. `@deepseek-ai/dsh-scope` exposes scoped layers and event routing; prefer the context-returned disposer over manual registry mutation.

`Session.append(type, data, surfaceOptions)` is the durable source-of-truth boundary. It snapshots lossless JSON, validates event envelope/sequence/surface relations, then synchronously publishes an immutable accepted event. A rejected candidate does not mutate the log; listener failures after acceptance are contained. Message-producing events require a valid surface operation and source relations. Use `SessionStore`/persistence rather than inventing another log.

Do not use the deprecated `Session.eventAt()`, `snapshotEvents()`, or `ownEvents()` in new plugin code. Read derived state through a registered projection or `SessionQuery`; use Session persistence APIs for durable reads. Forks preserve an inherited prefix and child-owned cut, and a plugin must not rewrite parent history.

## System prompt composition

`SystemPrompt` is available as `ctx.systemPrompt`. Its public plugin seams are:

- `section(section: PromptSection): () => void`
- `context(context: PromptContext): () => void`
- `tools(provider: (context: AssembleContext) => ToolProviderResult): () => void`
- `variable(name: string, provider: (context: AssembleContext) => string | undefined): () => void`
- `suppressRuntimeContext(): () => void`
- `assemble(context?: AssembleContext): Promise<PromptAssembly>`

Every registration is scope-aware and returns the exact Cordis effect disposer. Same-name scoped sections, contexts, and variables shadow farther/global values; invalid duplicate names or non-finite orders fail at registration. Prompt-variable names match `[a-z][a-z0-9_]*`. Providers run during assembly, so keep them deterministic and side-effect free. `suppressRuntimeContext()` hides prompt disclosure only; it does not disable the services or their enforcement.

The context packages are concrete contributors: agent instructions enforce byte budgets and discover scope files; time context selects a configured/request time zone; tmux context reports location; file-reference-local owns its watcher/search index; session-reference serializes bounded referenced-session context. Watchers/timers/providers must be owned by the plugin scope and disposed on unload.

## Tool runtime and definition

`ctx.tools.register(definition)` is the primary extension seam. A `ToolDefinition` extends the model schema with:

- mandatory `output.schema` and pure `output.render(args, value)`;
- `execute(args, exec): Promise<unknown>`, returning only the canonical lossless-JSON value;
- optional pure `output.presentationMeta`, `presentCall`, and `presentResult` for replayable presentation;
- optional `projectContent` and total `finalizeContent` transforms;
- optional cooperative `timeoutMs` and conservative `isConcurrencySafe(args)`.

`ToolRunContext` carries immutable identity, parsed/frozen arguments, optional agent, required `signal`, `deferContext()`, and `concludeTurn()`. Forward the signal to all owned async resources and do not resolve until owned work is quiescent. `timeoutMs` has no effect unless `@deepseek-ai/dsh-tool-call-timeout-policy` is mounted. Same-process work cannot be hard-killed.

Complete minimal Host plugin:

```ts
import { readFile } from 'node:fs/promises'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-read-file'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'read_file',
    description: 'Read a UTF-8 file.',
    parameters: {
      path: { type: 'string', required: true, description: 'Absolute path' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      return readFile(args.path, { encoding: 'utf8', signal: exec.signal })
    },
  }))
}
```

The plugin scope owns the returned registration even when it is not stored explicitly. Throwing, invalid output, renderer failure, unknown tools, and cancellation become normalized error results. Ordinary tool failure does not terminate the turn. PTC calls re-enter the same policy pipeline and receive the canonical JSON value, not rendered prose. `guard()` is monotonic deny; `tools/pre-execute`, `tools/execute`, `tools/post-execute`, and `tools/result` own policy/wrapping/transform/observation in that order.

The pre-execute policy returns `PreToolDecision`: `allow` runs the call; `deny` supplies a model-facing reason and optional structured error identity; `cancel` selects the canonical cancellation result; `ask` requests approval and runs only after `allowed-once`. The ask reason is audited, while `displayReason` may supply localized prompt text. The post-execute policy returns `PostToolDecision`: `accept` may replace either the canonical JSON `value` or rendered `content` and add later context; `block` replaces the outcome with corrective feedback. Do not rewrite already logged input arguments in a policy hook. The normalized success branch has `isError: false`, execution-local `value`, and rendered `content`; the failure branch has `isError: true`, `error: { message, info? }`, and `content`, with no successful value. See [the selected surface](api-host-core-surface.md#hostcore-task-api) for these result shapes.

## LLM provider and adapter

`LlmRuntime` owns provider adapters and model-directory entries. Register an adapter for one or more provider routes and retain the registration handle; duplicate ownership fails and multi-route registration is atomic. An adapter implements request preparation/model resolution and an async stream, honors the request `AbortSignal`, emits usage before finish, emits nothing after finish, and preserves raw JSON strings for incremental tool arguments. Unsupported options fail with a stable `LlmError` instead of being silently ignored.

Provider-native replay state is admissible only when the same adapter instance owns historical and target routes and the adapter validates it. Never infer replay compatibility from provider/model strings. Secrets belong in schema/config with environment fallbacks, not ad-hoc files. DeepSeek, DeepSeek-account, DeepSeek-api-key, and pi-ai packages are mountable first-party implementations; `deepseek-llm-api-extensions` is a scoped provider registry for request-body fields. `llm-retry` wraps failures according to explicit retry policy and must preserve cancellation.

An adapter that owns retry settings can pass `resolveRetryPolicy(config, diagnosticPath)` to `providerRetryPolicy(provider)`. It validates, defaults, and detaches `normal` (bounded retries for named failure codes) or `always` (retries until success, cancellation, or disposal) policy; registration captures the resolved policy with the route. The optional retry plugin executes that policy on failed steps. For a credential-backed transport, resolve the key from owned config and call `assertUsableApiKey(raw, packageName, credentialRef)` before building an HTTP header. It trims the key and raises `INVALID_CREDENTIAL` for blank or non-header-safe values without echoing the secret; still keep the key out of logs and Session events.

## Session extension and persistence

Use `@deepseek-ai/dsh-session-projection` to register a pure synchronous fold over canonical Session events. A host-only key lives in `SessionProjectionStateMap`; a Client-visible key also needs `SessionProjectionMap` plus `wire: { viewSchema, view }`. The definition requires `key`, `stateSchema`, `init(header, inheritedEventCount)`, `apply(state, event)`, and nonnegative `stateVersion`; return the same state reference for unrelated events. Read host state with `stateOf(session, key)`; `snapshot(session, keys?)` includes only Client-visible wire values. Its value must be reproducible from the event log. `session-projection-cache` can checkpoint a projection but is never authoritative. `session-persistence` defines the storage contract and live-write/shutdown ownership; `session-persistence-jsonl` is the first-party backend with lease and migration refusal. A backend must drain accepted writes before shutdown and must fail rather than silently accept incompatible or corrupt records.

Session title, stats, turn-outline, token-meter, telemetry, and log-export packages are concrete projections/providers. Mount only the needed package and its required service. Telemetry/OTel is an external-egress boundary: preserve redaction and sharing disclosure and flush on shutdown. Historical `session-format-vN-to-vN` packages are catalog-selected restore migrations, not APIs for a new plugin.

## Session query

`@deepseek-ai/dsh-session-query` is the replacement boundary for live/cold reads and search. It exports query types, cursors, cold-log reading, text extraction, document builders, compatible-header checks, and observation. `session-query-sqlite` is the local index implementation; `tool-session-query` is the model surface; `session-log-export` is a Client-facing export feature. Configure time/result bounds, honor cancellation, and report incomplete/gapped results rather than presenting them as complete.

## Commands, approval, and questions

`CommandRuntime.register(definition)` registers a scoped `CommandDefinition` with `name`, `description`, optional `input: { hint, attachments? }`, and `handler(invocation: CommandInvocation): CommandResult | Promise<CommandResult>`. The invocation contains `commandId`, the receiving `agent`, exact `rawInput`, admitted `attachments`, and `signal`; `CommandExecution` is the *settled return* of `CommandRuntime.execute`, not the handler argument. Names match `/^[a-z][a-z0-9_-]*$/`. An ordinary command result is `{ kind: 'success', text? }` or `{ kind: 'error', text }`; cancellation must propagate. Attachment receipt resolution is a separate registration and must validate ownership. See `packages/interaction/commands/src/index.ts` and `src/types.ts`.

`ApprovalService.request(request)` returns `allowed-once`, `rejected`, `cancelled`, or `unavailable`. Policy `never` rejects without prompting; policy `ask` still fails closed when no answerer exists. Pass the tool/command cancellation signal and keep approval audit events attributable. Permission presets are a user-facing policy catalog/state layer, not authority to widen an operation by themselves.

`UserQuestionService.ask()`/`askTimed()` owns pending durable questions and explicit answer/timeout/abort outcomes. `tool-ask-user` is the model-facing consumer. Do not implement a second pending-question store in a tool.

## Goal, plan, and todo

`GoalService` creates/edits/pauses/resumes/blocks/completes/clears a Session goal and folds the result into `GoalProjection`; Session events remain authoritative. `tool-goal`, `command-goal`, and `goal-round-driver` are model, human-command, and continuation consumers. Mount the service before them and enforce the caller's authority at the surface.

`plan-mode` and `tool-todo` are UI/model task-state packages. `TodoItem` has `content` and `status`; configuration controls parallel in-progress items. Treat their Client exports as browser-side projections, not Host service implementations.

## Jobs

`JobRegistry.start(spec: JobSpec): JobId` requires `kind`, `label`, and synchronous `run(job: JobHandle): JobHooks`; `owner?: SessionId` is optional but required for a Session-owned job. The producer receives `JobHandle` *inside* `run` and returns synchronous, idempotent `cancel(reason?)` plus a `done: Promise<JobOutcome>` that settles after cleanup. `start` returns the issued id, not the handle. Omitted owner creates an unowned job visible to any caller until service disposal. Output may be pushed through `job.append()` or pumped from owned sources. `read` consumes its cursor and returns a one-time result after settlement; `readAt` leaves that cursor alone and reports gaps. `wait` observes settlement without cancelling, `kill` requests cancellation, and `remove` is for no-longer-needed retained output. Mount concrete `@deepseek-ai/dsh-jobs-local`; the abstract `JobRegistry` rejects direct construction. `tool-jobs` exposes wait/read/kill behavior to the model with bounded wake loops. Once a background job id is published, task-owned cancellation replaces the originating tool-call signal as lifetime owner. See `packages/jobs/jobs/src/{index,types}.ts` and `packages/jobs/jobs-local/src/index.ts`.

For `JobSpec.output`, each `JobOutputSource.read(fromByte)` returns an incremental, nonconsuming `{ text, nextOffset, lossy, spillPath? }`; the registry pumps sources and makes one final drain before settlement. A `JobEvents` observer subscribes with `{ owner }` (that Session plus unowned jobs), `{ owners: 'scope' }` (composed owners), or `{ owners: 'all' }`. It receives lifecycle events with a fresh `JobView`; `settled` also reports `cause` (`producer`, `kill`, or `teardown`) and whether a waiter already received the completion. An `output` event carries only id, optional owner, and new byte total, so observers call `readAt` from their own cursor rather than assuming the event contains text. Keep the subscription disposer in the observing scope.

## Skills

`SkillRegistry.register(skill: SkillRegistration): () => void` adds a runtime skill. `registerProvider(create: (control: SkillProviderControl) => SkillProvider): () => void` invokes the synchronous factory during plugin apply; its `control` has an abort `signal` and `invalidate()` callback, and the return value is the registration disposer. The provider itself supplies `name`, async `list(options)` and `get(candidate, options)`; discovery can return a complete candidate array or an observation with `complete` status. Remote initialization belongs inside `list`, not the registration factory. A `SkillDefinition` carries name, description, invocation policy, provider/source/resource base, and content. Validate names and invocation policy; never trust arbitrary frontmatter as authority. `skill-filesystem` owns discovery roots/watchers and invalidation. `tool-skill` exposes a bounded catalog and explicit invocation; `tool-workspace-dependencies` resolves the bundled runtime paths. Dispose provider watchers and registrations on unload. See `packages/skill/skill/src/index.ts`.

`SkillProviderObservation` is `{ candidates, complete }`. A provider may return usable candidates with `complete: false` when discovery is partial; the registry does not cache that observation and `snapshot()` reports `complete: false`, so consumers can retain last-good state and retry later. A thrown provider discovery is contained and also makes that catalog observation incomplete. The provider must still honor caller cancellation and should invalidate its registration after its own data changes.

## Subagents

`SubagentRuntime.registerProvider(provider: SubagentProvider): () => void` installs one named provider. `start(name, request: SubagentStartRequest): Promise<SubagentRun>` is the one-shot path; request requires `prompt: ContentBlock[]`, exact live `parent: Agent`, and `signal`, with optional label, Agent options, schema, depth cap, tool filter, and persona gated by the provider's declared capabilities. The returned run has `result` and idempotent `dispose()`; always dispose it after result or error. `list()` returns **provider names**, not child Sessions. Durable child discovery uses `listChildren(parentSessionId, signal?)` or `listDescendants(rootSessionId, signal?)`; continuable delivery and interrupt have separate authority checks. Runtime gates include positive finite depth, configured max depth, maximum active children, usable cwd, parent ownership, and provider capability. Parent cancellation, explicit interrupt, collection, descendant drain, and provider teardown are distinct lifecycle paths.

The five one-shot `SubagentCapabilities` flags are `agentOptions`, `outputSchema`, `depthLimit` (for `maxDepth`), `toolFilter`, and `persona`; unsupported requested options fail before the provider starts. These flags do not imply continuable support: that path requires the provider's `prepareContinuable` and the continuation manager. `sendMessage(sender, targetId, content, { signal })` accepts model-authored content only from an exact live adjacent Agent; its signal controls work until inbox acceptance, after which child/parent lifecycle owns delivery. `interrupt(childId, authority)` checks either a human direct-parent Session address or an exact live ancestor Agent and signals the current continuable turn without disposing the child.

In-process providers inherit controlled parent context; fork-in-process seeds a durable child Session; spawn-in-process starts fresh. ACP, Codex, Claude Code, and DSH SDK providers own subprocess cleanup and stop-reason mapping. ACP is one-shot and does not gain continuable messaging merely because the generic runtime supports it. The `./internal` subpath is not a supported plugin surface.

## Workflows

`WorkflowEngine.start(request: WorkflowStartRequest): WorkflowRun` runs `{ script, meta: { name, description, phases? }, args?, subagentProvider?, maxTotalAgents?, parent, signal? }`. The `parent` is required, and the script can call `agent()` only through a mounted provider. A `WorkflowRun` exposes `id`, `meta`, a never-rejecting `result: Promise<WorkflowResult>` (`value`, `stopReason`, `error?`, `agentsStarted`), `cancel(reason?)`, and idempotent async `dispose()`. `workflow-ptc` is the runtime implementation and `tool-workflow` the model surface; `tool-ralph` is a bounded first-party loop. Validate metadata/schema, set an explicit child cap and result bound, forward cancellation, and dispose the run on every exit path.

Progress observers may receive `workflow/start`, `workflow/phase`, `workflow/log`, `workflow/agent-start`, `workflow/agent-end`, and `workflow/end`. The last event carries `WorkflowResultInfo` (`stopReason`, optional `error`, `agentsStarted`) without the script's mutable `value`; the run owner obtains that only by awaiting `run.result`. Observing a terminal event does not transfer ownership of the run or its children.

## External hooks

`@deepseek-ai/dsh-hook-protocol` provides `matchesMatcher`, `parseHookOutput`, `runHook`, `mergeHookOutputs`, event appenders, stderr summarization, and detached-run tracking. The actual call is `runHook(shell, hook: { command, timeoutSec? }, options: { payload, env?, cwd?, signal, trailingNewline, defaultTimeoutMs, expectedEventName? }, now): Promise<{ output, durationMs }>`; `timeoutSec` is seconds, while the default is milliseconds. It executes through `ctx.shell`, scrubs credentials via that service, and returns a parsed nonblocking outcome even for infrastructure failure. The bridge selects matcher dialect, payload, environment, decision mapping, and whether to write paired `hook/invoked`/`hook/result` events inside an open turn. Treat nonzero exit, timeout, malformed output, and cancellation as distinct outcomes. Bound stderr and drain detached runs during shutdown. Claude Code and Codex packages adapt their config/dialect; they do not make external configuration trustworthy.

## Feedback

`command-feedback` records a categorized Session feedback request/result through `SessionFeedbackService`; `message-feedback` records message-level feedback. Validate Session/message ownership and surface Remote failures such as session-not-found. These are feedback data paths, not an implicit telemetry-sharing grant.

## Guards

`repeat-tool-reminder` adds model context after configured repeated-call thresholds; it is loop hygiene, not a hard deny. `tool-call-timeout-policy` wraps the tool dispatch signal and maps its owned deadline to `TOOL_TIMEOUT`; tools still must honor the signal and quiesce. Compose wrappers through the documented waterfall and never replace a more specific prior failure after it has settled.

## Optional first-party mount choices

These published packages are concrete choices behind the preceding services. Mount them only when the task uses their role; each row has a distinct configuration, failure or disposal condition.

| Choice | Required role and boundary |
| --- | --- |
| `dsh-agent-default-model` | Mountable selection service; `currentSelection()` reads provider/model/reasoning effort and `saveSelection()` persists through config editor. Selection is separate from credential or LLM route availability. |
| `dsh-agent-instructions` | Projects configured instruction files into the prompt with root and byte-budget limits; refresh and file watchers belong to the row and must stop on unload. |
| `dsh-agent-tool-presentation` | `mode: native | ptc | both` registers scoped `tools.presentAs`; `ptc` and `both` require `ptcRuntime` before activation. Presentation does not grant execution authority. |
| `dsh-llm-deepseek` | Exposes `DeepSeekAdapter` and `registerDeepSeekProvider` as adapter/transport base, not a complete credential Profile. |
| `dsh-llm-deepseek-account` | Registers `deepseek-account` through `deepseekAccount.resolveToken`; missing login and invalid 401 token need account-specific recovery. |
| `dsh-llm-deepseek-api-key` | Registers `deepseek-official`, resolving credential service before startup environment; missing both fails with `MISSING_CREDENTIAL`. |
| `dsh-llm-pi-ai` | Registers configurable providers, discovery and routes; a config change must replace one generation of registrations and retire the old one. |
| `dsh-llm-retry` | Registers the `llmRetry` Session projection with explicit retry budget and cancellation, not an implicit adapter default. |
| `dsh-session-persistence` | Abstract durable service with `create`, `open`, `stat`, `list` and `flush`; `SessionHandle` owns ordered `read`, `append`, `flush` and `close`. Resolved append is locally visible, resolved flush is the crash-durability barrier. |
| `dsh-session-persistence-jsonl` | Concrete single-writer backend; drains accepted events on close, rejects unsupported newer formats and corrupt committed prefixes. |
| `dsh-session-projection-cache` | Depends on storage domain, sessions and projections; checkpoint/restore accelerates reads, while full log replay remains authoritative. |
| `dsh-subagent-spawn-in-process` | Registers `spawn`, begins a fresh child, supports in-process start overrides and `prepareContinuable`; continuation manager owns later turns. |
| `dsh-subagent-fork-in-process` | Registers `fork`, seeds completed parent turns and supports `prepareContinuable`; unfinished parent work is not inherited. |
| `dsh-subagent-acp` | Requires subprocess, supports none of the optional start capabilities and remains one-shot; await external process cleanup. |
| `dsh-subagent-claude-code` / `dsh-subagent-codex` | Distinct external CLI/config providers; both reject optional start capabilities and must clean up their subprocesses. |
| `dsh-subagent-dsh-sdk` | Uses an independent child runtime; check its declared model route, schema, depth, filter and persona capabilities instead of assuming in-process inheritance. |

The source owners are the matching `packages/core/agent-*`, `packages/context/agent-instructions`, `packages/llm/*`, `packages/session/*`, and `packages/subagent/*` package `src/index.ts` files in this target. Network, external CLI and persistence restart behavior require separate real-environment checks.

## Validation boundary

For every plugin task, verify: package resolution from the target tag, Host compilation, real Profile mounting, one observable request/result, cancellation or failure, and unload cleanup. For `./client`, Remote/Typert, subprocess, persistence restart, and network LLM paths, static declarations and unit tests are insufficient; run the corresponding side or report it as not covered.
