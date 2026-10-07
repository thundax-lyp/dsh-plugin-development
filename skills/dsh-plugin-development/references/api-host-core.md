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

## LLM provider and adapter

`LlmRuntime` owns provider adapters and model-directory entries. Register an adapter for one or more provider routes and retain the registration handle; duplicate ownership fails and multi-route registration is atomic. An adapter implements request preparation/model resolution and an async stream, honors the request `AbortSignal`, emits usage before finish, emits nothing after finish, and preserves raw JSON strings for incremental tool arguments. Unsupported options fail with a stable `LlmError` instead of being silently ignored.

Provider-native replay state is admissible only when the same adapter instance owns historical and target routes and the adapter validates it. Never infer replay compatibility from provider/model strings. Secrets belong in schema/config with environment fallbacks, not ad-hoc files. DeepSeek, DeepSeek-account, DeepSeek-api-key, and pi-ai packages are mountable first-party implementations; `deepseek-llm-api-extensions` is a scoped provider registry for request-body fields. `llm-retry` wraps failures according to explicit retry policy and must preserve cancellation.

## Session extension and persistence

Use `@deepseek-ai/dsh-session-projection` to register a pure fold over canonical Session events. Its value must be reproducible from the event log. `session-projection-cache` can checkpoint a projection but is never authoritative. `session-persistence` defines the storage contract and live-write/shutdown ownership; `session-persistence-jsonl` is the first-party backend with lease and migration refusal. A backend must drain accepted writes before shutdown and must fail rather than silently accept incompatible or corrupt records.

Session title, stats, turn-outline, token-meter, telemetry, and log-export packages are concrete projections/providers. Mount only the needed package and its required service. Telemetry/OTel is an external-egress boundary: preserve redaction and sharing disclosure and flush on shutdown. Historical `session-format-vN-to-vN` packages are catalog-selected restore migrations, not APIs for a new plugin.

## Session query

`@deepseek-ai/dsh-session-query` is the replacement boundary for live/cold reads and search. It exports query types, cursors, cold-log reading, text extraction, document builders, compatible-header checks, and observation. `session-query-sqlite` is the local index implementation; `tool-session-query` is the model surface; `session-log-export` is a Client-facing export feature. Configure time/result bounds, honor cancellation, and report incomplete/gapped results rather than presenting them as complete.

## Commands, approval, and questions

`CommandRuntime.register(definition)` registers a scoped `CommandDefinition` with `name`, `description`, optional input hint, and a handler receiving `CommandExecution` (`agent`, source/user facts, attachments, and `signal`). Command names match the runtime grammar; cancellation must propagate. Attachment receipt resolution is a separate registration and must validate ownership.

`ApprovalService.request(request)` returns `allowed-once`, `rejected`, `cancelled`, or `unavailable`. Policy `never` rejects without prompting; policy `ask` still fails closed when no answerer exists. Pass the tool/command cancellation signal and keep approval audit events attributable. Permission presets are a user-facing policy catalog/state layer, not authority to widen an operation by themselves.

`UserQuestionService.ask()`/`askTimed()` owns pending durable questions and explicit answer/timeout/abort outcomes. `tool-ask-user` is the model-facing consumer. Do not implement a second pending-question store in a tool.

## Goal, plan, and todo

`GoalService` creates/edits/pauses/resumes/blocks/completes/clears a Session goal and folds the result into `GoalProjection`; Session events remain authoritative. `tool-goal`, `command-goal`, and `goal-round-driver` are model, human-command, and continuation consumers. Mount the service before them and enforce the caller's authority at the surface.

`plan-mode` and `tool-todo` are UI/model task-state packages. `TodoItem` has `content` and `status`; configuration controls parallel in-progress items. Treat their Client exports as browser-side projections, not Host service implementations.

## Jobs

`JobRegistry.start(spec)` requires a job kind, label, owner, and producer. It returns/publishes a `JobHandle`; output may be pushed through the handle or pumped from owned sources. Use `read`/`readAt` for bounded output, `wait` for settlement, `kill` for cancellation, and `remove` only after retention is no longer needed. `jobs-local` owns concurrency, ring retention, polling, controllers, and cleanup; `tool-jobs` exposes wait/read/kill behavior to the model with bounded wake loops. Once a background job id is published, task-owned cancellation replaces the originating tool-call signal as lifetime owner.

## Skills

`SkillRegistry.register(skill)` adds a runtime skill; `registerProvider(provider)` adds an observable provider and returns provider control/disposal. A `SkillDefinition` carries name, description, invocation policy, provider/source/resource base, and content. Validate names and invocation policy; never trust arbitrary frontmatter as authority. `skill-filesystem` owns discovery roots/watchers and invalidation. `tool-skill` exposes a bounded catalog and explicit invocation; `tool-workspace-dependencies` resolves the bundled runtime paths. Dispose provider watchers and registrations on unload.

## Subagents

`SubagentRuntime.registerProvider()` installs a provider whose declared capabilities determine one-shot versus continuable behavior. Start requests carry provider, prompt, cwd, model/agent options, cancellation, depth, policy, sandbox, tool filter, and optional structured-output schema. Runtime gates include positive finite depth, configured max depth, maximum active children, usable cwd, parent ownership, and provider capability. Parent cancellation, explicit interrupt, collection, descendant drain, and provider teardown are distinct lifecycle paths.

In-process providers inherit controlled parent context; fork-in-process seeds a durable child Session; spawn-in-process starts fresh. ACP, Codex, Claude Code, and DSH SDK providers own subprocess cleanup and stop-reason mapping. ACP is one-shot and does not gain continuable messaging merely because the generic runtime supports it. The `./internal` subpath is not a supported plugin surface.

## Workflows

`WorkflowEngine.start(request)` runs a declared script/meta/args with a selected subagent provider and explicit `maxTotalAgents`; a `WorkflowRun` exposes result/progress, cancellation, and disposal. `workflow-ptc` is the runtime implementation and `tool-workflow` the model surface; `tool-ralph` is a bounded first-party loop. Validate metadata/schema, cap child count and result size, forward cancellation, and dispose every child/run on error or unload.

## External hooks

`@deepseek-ai/dsh-hook-protocol` provides `matchesMatcher`, `parseHookOutput`, `runHook`, `mergeHookOutputs`, event appenders, stderr summarization, and detached-run tracking. `runHook` receives command/cwd/env/payload/dialect/timeout/AbortSignal; treat nonzero exit, timeout, malformed output, and cancellation as distinct outcomes. Bound stderr and drain detached runs during shutdown. Claude Code and Codex packages adapt their config/dialect; they do not make external configuration trustworthy.

## Feedback

`command-feedback` records a categorized Session feedback request/result through `SessionFeedbackService`; `message-feedback` records message-level feedback. Validate Session/message ownership and surface Remote failures such as session-not-found. These are feedback data paths, not an implicit telemetry-sharing grant.

## Guards

`repeat-tool-reminder` adds model context after configured repeated-call thresholds; it is loop hygiene, not a hard deny. `tool-call-timeout-policy` wraps the tool dispatch signal and maps its owned deadline to `TOOL_TIMEOUT`; tools still must honor the signal and quiesce. Compose wrappers through the documented waterfall and never replace a more specific prior failure after it has settled.

## Validation boundary

For every plugin task, verify: package resolution from the target tag, Host compilation, real Profile mounting, one observable request/result, cancellation or failure, and unload cleanup. For `./client`, Remote/Typert, subprocess, persistence restart, and network LLM paths, static declarations and unit tests are insufficient; run the corresponding side or report it as not covered.
