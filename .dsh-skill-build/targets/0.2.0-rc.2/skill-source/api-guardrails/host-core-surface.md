# Host/Core task API

## Host/Core task API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-host-core.md)。未列入的公开符号仍在 `api-surface.json` 中逐项裁决，但不进入常规插件指导。

Host 示例需要以下公开输入与结果类型：`Agent`（`packages/core/agent/src/types.ts:15`）提供真实父 Agent 及其 Session；`GenerateOptions`（`packages/llm/llm/src/types.ts:511`）包含 provider/model/messages 和可选 `signal`；`StreamChunk`（同文件第 452 行）是 block-start/delta/block-end/usage/finish 联合；`JobId`（`packages/jobs/jobs/src/brand.ts:19`）是 registry 返回的品牌 ID；`SubagentResult`（`packages/subagent/subagent/src/types.ts:271`）含 `output`、可选 `structured`/`diagnostic` 与 `stopReason`；`WorkflowResult`（`packages/workflow/workflow/src/types.ts:72`）含 `value`、`stopReason`、可选 `error` 与 `agentsStarted`。`Context` 是 Cordis 插件注入上下文。

The live `Agent` type also exposes `ctx`, `send`, `followup`, `steer`, `inject`, `whenIdle`, `runMaintenance` and `inbox`. These are lifecycle operations on an owned Agent, not methods on an arbitrary Session id. `GenerateOptions` supplies `messages`, `provider`, `model`, optional `maxTokens`, `temperature`, `reasoningEffort`, `toolHistory`, `purpose`, `sessionId` and cancellation `signal`; adapter code must preserve the caller's routing and cancellation choices. `ToolCallId` is the branded identity for a streamed tool call, not a UI-generated string. `SubagentResult.stopReason` distinguishes terminal outcomes; `structured` is present only after the requested object schema succeeds, while `diagnostic` describes a failed run. `WorkflowResult.value`, `stopReason` and `agentsStarted` are settled run facts; an optional `error` explains failure without making `WorkflowRun.result` reject.

**`SystemPrompt`**

- Entry: `export:@deepseek-ai/dsh-system-prompt:.`
- Signature: `SystemPrompt`
- Source: `packages/core/system-prompt/src/index.ts`

| Member                   | Signature                                                                                                                                                                                                                                                | Task use                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `assemble`               | `(context?: AssembleContext) => Promise<PromptAssembly>`                                                                                                                                                                                                 | Runs the visible scoped providers and returns assembled prompt/tools; provider failure rejects assembly. |
| `context`                | `(context: PromptContext) => () => void`                                                                                                                                                                                                                 | Registers one named context provider in the current scope; disposer removes it. |
| `getContextOrder`        | `(name: "SANDBOX_POLICY" \| "APPROVAL_POLICY" \| "SUBAGENT_DELEGATION") => number`                                                                                                                                                                       | Returns the fixed order for a repository-owned context slot. |
| `getSectionOrder`        | `(name: "HARNESS_IDENTITY" \| "DEPLOYMENT_PERSONA_PREFIX" \| "PLAN_POLICY" \| "TEAM_POLICY" \| "PTC_ONLY" \| "FILE_REFERENCE" \| "TOOL_BASH" \| "TOOL_PWSH" \| "TOOL_READ" \| "TOOL_WRITE" \| ... 21 more ... \| "DEPLOYMENT_PERSONA_SUFFIX") => number` | Returns the fixed order for a repository-owned section slot. |
| `section`                | `(section: PromptSection) => () => void`                                                                                                                                                                                                                 | Registers a named ordered prompt section; disposer removes it. |
| `suppressRuntimeContext` | `() => () => void`                                                                                                                                                                                                                                       | Hides runtime-context prompt disclosure in this scope until disposed. |
| `tools`                  | `(provider: (context: AssembleContext) => ToolProviderResult) => () => void`                                                                                                                                                                             | Registers a tool-schema provider evaluated during assembly; disposer removes it. |
| `variable`               | `(name: string, provider: (context: AssembleContext) => string \| undefined) => () => void`                                                                                                                                                              | Registers a named interpolation provider; undefined leaves it unresolved. |

**`ToolRuntime`**

- Entry: `export:@deepseek-ai/dsh-tools:.`
- Signature: `ToolRuntime`
- Source: `packages/core/tools/src/index.ts`

| Member     | Signature                                                    | Task use                                           |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `execute`  | `(exec: ToolExecutionInput) => Promise<ToolExecutionResult>` | Runs one caller-cancellable call through guards and policy; returns normalized success/error. |
| `get`      | `(name: string, scope?: any) => ToolDefinition \| undefined` | Resolves the effective registered definition for a name and optional scope. |
| `guard`    | `(guard: ToolGuard) => () => void`                           | Adds a monotonic deny check; returned disposer removes the guard. |
| `register` | `(definition: ToolDefinition) => () => void`                 | Registers a scoped tool definition and returns its effect disposer. |

**`ToolDefinition`**

- Entry: `export:@deepseek-ai/dsh-tools:.`
- Signature: `ToolDefinition`
- Source: `packages/core/tools/src/index.ts`

| Member              | Signature                                                                                                              | Task use                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `execute`           | `(args: unknown, exec: ToolRunContext) => Promise<unknown>`                                                            | Async body returns only canonical JSON; it must honor exec.signal and quiesce. |
| `finalizeContent`   | `((exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => ContentBlock[] \| undefined) \| undefined` | Total synchronous final content transform for every normalized outcome. |
| `isConcurrencySafe` | `((args: unknown) => boolean) \| undefined`                                                                            | Pure synchronous opt-in; only true permits sibling overlap. |
| `output`            | `ToolOutputDefinition`                                                                                                 | Declares mandatory canonical schema and pure render projection. |
| `presentCall`       | `((args: unknown) => ToolCallView \| undefined) \| undefined`                                                          | Pure replayable pending-call view; undefined uses generic view. |
| `presentResult`     | `((args: unknown, result: ToolResult) => ToolResultView \| undefined) \| undefined`                                    | Pure replayable settled-result view; undefined keeps generic content. |
| `projectContent`    | `((exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => ContentBlock[] \| undefined) \| undefined` | Optional content projection before post-execute policies. |
| `timeoutMs`         | `number \| undefined`                                                                                                  | Cooperative positive deadline, enforced only by mounted timeout policy. |

For the [Host tool task](how-to-host-core.md#register-host-tool), `defineTool(options: DefineToolOptions<S, O>): ToolDefinition` is exported by the same package (`packages/core/tools/src/schema.ts:482-562`). The options require `name`, `description`, a per-property `parameters` DSL, `output: { schema, render }`, and `execute(args, exec)`; optional `timeoutMs`, `isConcurrencySafe`, `projectContent`, `finalizeContent`, `presentCall`, and `presentResult` follow the definitions above. `ToolRunContext` (`packages/core/tools/src/index.ts:418-438`) extends execution identity (`callId`, `name`, `arguments`, optional `agent`, required `signal`) and adds `deferContext(context)` and `concludeTurn()`. The exact `ToolDefinition` method table alone is insufficient to implement a typed `defineTool` callback.

`ToolExecutionResult` is discriminated by `isError` (`packages/core/tools/src/index.ts:572-596`). `ToolExecutionSuccess` has `isError: false`, canonical execution-local `value: JsonValue`, model-facing `content`, optional durable presentation `meta`, deferred `additionalContexts`, and optional `concludesTurn`. `ToolExecutionFailure` has `isError: true`, `error: ToolFailure` (`message` plus optional `ToolErrorInfo`), model-facing `content`, optional `additionalContexts`, and **no** successful `value` or `concludesTurn`. `PreToolDecision` (`index.ts:607-615`) permits `allow`, `deny`, `cancel`, or approval-gated `ask`; `PostToolDecision` (`index.ts:617-620`) permits `accept` with either replacement `value` or `content` and optional `additionalContexts`, or `block` with feedback. A pre-policy never rewrites the already logged arguments.

**`LlmRuntime`**

- Entry: `export:@deepseek-ai/dsh-llm:.`
- Signature: `LlmRuntime`
- Source: `packages/llm/llm/src/index.ts`

| Member        | Signature                                                                                | Task use                                           |
| ------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `prepareCall` | `(config: LlmCallConfig, signal?: AbortSignal \| undefined) => Promise<PreparedLlmCall>` | Resolves exact route/model and binds adapter generation; rejects missing route. |
| `stream`      | `(options: GenerateOptions) => AsyncIterable<StreamChunk>`                               | Streams normalized chunks through the selected registered adapter. |

Adapter registration is the plugin-facing part of this runtime (`packages/llm/llm/src/index.ts:396-421,490-584`): `registerAdapter(providers: string[], adapter: LlmAdapter): AdapterRegistrationHandle`, `registerConfigurableProviders(entries: readonly LlmConfigurableProvider[]): DirectoryRegistrationHandle`, and `registerModelDiscovery(settingsNs: string, discover: (request: LlmModelDiscoveryRequest, signal?: AbortSignal) => Promise<readonly LlmDiscoveredModel[]>): () => void`. Registration handles are effect-owned disposers; the first two also support atomic `replace(...)`. The last two are needed only for a settings/catalog surface; a runtime-only adapter may use `registerAdapter` alone.

`LlmModelDiscoveryRequest` (`packages/llm/llm/src/types.ts:276-293`) carries an optional existing `provider` route, draft `baseURL`, wire `api`, and operation-only `apiKey`; a route still being added has no provider id yet. The discovery callback receives cancellation as a **separate** optional `signal` argument, not inside that request object (`src/index.ts:564-570`). An adapter's `providerRetryPolicy(provider)` returns `ResolvedRetryPolicy | undefined`; `resolveRetryPolicy(config, diagnosticPath)` validates and freezes a `normal` or `always` route policy before registration captures it (`src/retry-policy.ts:149-180`). A credential-backed adapter may call `assertUsableApiKey(raw, packageName, credentialRef)` to trim and validate a key while keeping its value out of diagnostics (`src/index.ts:130-166`).

**`LlmAdapter`**

- Entry: `export:@deepseek-ai/dsh-llm:.`
- Signature: `LlmAdapter`
- Source: `packages/llm/llm/src/index.ts`

| Member        | Signature                                                                                              | Task use                                           |
| ------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `prepareCall` | `(provider: string, model: string, signal?: AbortSignal \| undefined) => Promise<PreparedAdapterCall>` | Default binds resolveModel and stream; override for changing settings generations. |
| `stream`      | `(options: GenerateOptions) => AsyncIterable<StreamChunk>`                                             | Only abstract method; honor optional signal, emit valid chunks then finish. |

`LlmAdapter` is an abstract class whose only required override is `stream(options)` (`packages/llm/llm/src/index.ts:208-290`). Defaults exist for `providerInfo(provider)`, `providerRetryPolicy(provider)`, `imageRequestPricing(provider, model)`, `listModels(provider)`, `resolveModel(provider, model, signal?)`, and `prepareCall(provider, model, signal?)`. The default `listModels` returns an empty catalog: direct routing can accept an unlisted model, but catalog-driven GUI selection needs advertised models. Override `prepareCall` when dynamic connection settings must bind model metadata and dispatch to one adapter generation.

**`Session`**

- Entry: `export:@deepseek-ai/dsh-session:.`
- Signature: `Session`
- Source: `packages/core/session/src/index.ts`

| Member    | Signature                                                                                                                                                   | Task use                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `append`  | `<T extends SessionEventType>(type: T, data: SessionEventMap[T], ...opts: T extends SurfaceEventType ? [opts: SurfaceIntent<T>] : []) => SessionEvent<...>` | Validates and commits one event plus required surface intent, then emits it. |
| `header`  | `SessionHeader`                                                                                                                                             | Immutable Session metadata used by projection init and workspace ownership. |
| `id`      | `Branded<"SessionId">`                                                                                                                                      | Durable Session identity; also the Agent and job-owner address. |
| `seq`     | `BrandedNumber<"SessionLogOffset">`                                                                                                                         | Next log offset; advances only on accepted append. |
| `surface` | `SessionSurface`                                                                                                                                            | Surface-intent helper for authorized message-producing events. |

**`SessionProjectionRegistry`**

- Entry: `export:@deepseek-ai/dsh-session-projection:.`
- Signature: `SessionProjectionRegistry`
- Source: `packages/session/session-projection/src/index.ts`

| Member       | Signature                                                                                                                                                                                                                                                                                                                          | Task use                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `checkpoint` | `(session: Session) => ProjectionCheckpoint`                                                                                                                                                                                                                                                                                       | Captures every registered unit at the Session cursor for cache persistence. |
| `register`   | `{ <K extends keyof SessionProjectionMap, S extends SessionProjectionStateMap[K]>(definition: Omit<ProjectionDefinition<K, S>, "wire"> & { wire: (K extends never ? { ...; } : never) & {}; }): () => void; <K extends Exclude<keyof SessionProjectionStateMap, keyof SessionProjectionMap>, S extends SessionProjectionStateM...` | Registers a pure keyed fold; exact effect disposer removes the unit. |
| `restore`    | `(checkpoint: ProjectionCheckpoint, events: readonly SessionEvent[], baseSeq: SessionLogOffset, header: SessionHeader, inheritedEventCount: SessionLogOffset) => { snapshot: ProjectionSnapshot; checkpoint: ProjectionCheckpoint; }`                                                                                              | Replays events over a validated checkpoint and returns snapshot/checkpoint. |
| `snapshot`   | `(session: Session, keys?: readonly never[] \| undefined) => ProjectionSnapshot`                                                                                                                                                                                                                                                   | Returns one consistent cut of Client-visible wire views; host-only keys omitted. |

The direct-member extractor missed the generic `stateOf<K extends keyof SessionProjectionStateMap>(session: Session, key: K): SessionProjectionStateMap[K] | undefined` method (`packages/session/session-projection/src/index.ts:316-328`). A host-only projection is read there, while `snapshot` returns only keys with a `wire` view. `ProjectionDefinition` (`index.ts:48-94`) requires `key`, `stateSchema`, pure synchronous `init` and `apply`, and `stateVersion`; a Client-visible key also requires `wire: { viewSchema, view }`. Add the key to `SessionProjectionStateMap` by declaration merge; add it to `SessionProjectionMap` only if the Client needs the view.

`SessionProjectionStateMap` (`src/types.ts:24`) is an empty open interface. Each plugin supplies a distinct key and state type through declaration merging before calling `register` or `stateOf`; it is not a runtime registry or a persistence store.

**`CommandRuntime`**

- Entry: `export:@deepseek-ai/dsh-commands:.`
- Signature: `CommandRuntime`
- Source: `packages/interaction/commands/src/index.ts`

| Member     | Signature                                                                                                                           | Task use                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `execute`  | `(agent: Agent, line: string, submittedAttachments: readonly any[], signal: AbortSignal) => Promise<CommandExecution \| undefined>` | Dispatches slash line for exact Agent/signal; returns settled execution or undefined. |
| `list`     | `(agent: Agent) => readonly CommandDescriptor[]`                                                                                    | Returns effective scoped command descriptors for one Agent. |
| `register` | `(definition: CommandDefinition) => () => void`                                                                                     | Registers a scoped command definition; disposer removes it. |

`CommandDefinition` (`packages/interaction/commands/src/index.ts:61-79`) has `name`, `description`, optional `definitionId`, `input: { hint, attachments? }`, `recordInput`, and `handler(invocation: CommandInvocation): CommandResult | Promise<CommandResult>`. `CommandInvocation` carries `commandId`, `agent`, exact `rawInput`, admitted `attachments`, and `signal`. `CommandExecution` (`packages/interaction/commands/src/types.ts`) is the registry's **settled** `{ commandId, result }`, not the handler input. `CommandRuntime.registerFileReceiptResolver(resolver: CommandFileReceiptResolver): () => void` is a separate Host-only authority for staged file receipts.

**`ApprovalService`**

- Entry: `export:@deepseek-ai/dsh-user-approval:.`
- Signature: `ApprovalService`
- Source: `packages/interaction/user-approval/src/index.ts`

| Member    | Signature                                            | Task use                                           |
| --------- | ---------------------------------------------------- | -------------------------------------------------- |
| `config`  | `Config`                                             | Configured approval policy input; effective policy is resolved per request. |
| `request` | `(req: ApprovalRequest) => Promise<ApprovalOutcome>` | Returns allowed-once/rejected/cancelled/unavailable; never-policy or unavailable answerer fails closed. |

**`GoalService`**

- Entry: `export:@deepseek-ai/dsh-goal:.`
- Signature: `GoalService`
- Source: `packages/goal/goal/src/index.ts`

| Member     | Signature                                                            | Task use                                           |
| ---------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| `block`    | `(agent: Agent, ref: GoalRef, reason: GoalBlockReason) => GoalView`  | Records a blocked goal with reason and returns current view. |
| `clear`    | `(agent: Agent, ref: GoalRef) => GoalRef`                            | Clears the referenced goal and returns its durable reference. |
| `complete` | `(agent: Agent, ref: GoalRef) => GoalView`                           | Marks the referenced goal complete and returns its view. |
| `create`   | `(agent: Agent, request: CreateGoalRequest) => GoalView`             | Creates one Session-owned goal and returns its view. |
| `edit`     | `(agent: Agent, ref: GoalRef, request: EditGoalRequest) => GoalView` | Changes the referenced goal using validated request fields. |
| `get`      | `(agent: Agent) => GoalView \| undefined`                            | Reads the current goal view for one Agent, if any. |
| `pause`    | `(agent: Agent, ref: GoalRef) => GoalView`                           | Records paused state for referenced goal and returns view. |
| `resume`   | `(agent: Agent, ref: GoalRef) => GoalView`                           | Resumes referenced goal and returns view. |

**`JobRegistry`**

- Entry: `export:@deepseek-ai/dsh-jobs:.`
- Signature: `JobRegistry`
- Source: `packages/jobs/jobs/src/index.ts`

| Member   | Signature                                                                                                        | Task use                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `events` | `JobEvents`                                                                                                      | Filtered subscription face for job lifecycle/output notifications. |
| `get`    | `(id: Branded<"JobId">, caller?: any) => JobView`                                                                | Returns a fresh projection; unknown or foreign job throws. |
| `kill`   | `(id: Branded<"JobId">, caller?: any, reason?: string \| undefined) => "requested" \| "already-finished"`        | Requests producer cancellation; does not itself await settlement. |
| `list`   | `(caller?: any) => JobView[]`                                                                                    | Lists caller-visible jobs; omitted caller sees unowned jobs only. |
| `read`   | `(id: Branded<"JobId">, caller?: any) => JobRead`                                                                | Consumes model cursor; reports gaps and one-time settled result. |
| `readAt` | `(id: Branded<"JobId">, from: number, caller?: any) => JobOutputRead`                                            | Non-consuming retained output read from absolute byte offset. |
| `remove` | `(id: Branded<"JobId">, caller?: any) => void`                                                                   | Removes a retained job after ownership checks. |
| `start`  | `(spec: JobSpec) => Branded<"JobId">`                                                                            | Preflights spec, passes JobHandle to run, returns issued JobId. |
| `wait`   | `(id: Branded<"JobId">, timeoutMs: number, caller?: any, signal?: AbortSignal \| undefined) => Promise<JobView>` | Waits for settlement or timeout without cancelling the job. |

`JobSpec` (`packages/jobs/jobs/src/types.ts:126-154`) requires `kind`, `label`, and `run(job: JobHandle): JobHooks`; `owner?: SessionId`, `outputLimitBytes?`, and `output?` are optional. `JobRegistry.start(spec): JobId` returns the id. The registry passes `JobHandle` into `run`; its `append(text, options?)` and `updateProgress(line)` are synchronous. `JobHooks` must supply synchronous idempotent `cancel(reason?)` and `done: Promise<JobOutcome>`; `done` resolves after producer cleanup to `{ status: 'completed' | 'killed' | 'failed', detail?, result? }`. These callback contracts determine ownership and cannot be inferred from the `start` member signature alone.

`JobOutputSource` (`src/types.ts:55-69`) is `{ channel?, read(fromByte): JobSourceRead }`; `read` returns `{ text, nextOffset, lossy, spillPath? }` without consuming its own history. `JobSpec.output` sources are pumped and drained once more before settlement. `JobEvents.subscribe(filter, listener): () => void` (`src/types.ts:200-255`) takes `JobEventFilter`: `{ owner: SessionId }`, `{ owners: 'scope' }`, or `{ owners: 'all' }`. `JobEvent` lifecycle variants contain `job: JobView`; `settled` adds `cause: 'producer' | 'kill' | 'teardown'` and `awaited`, while `output` sends only `id`, optional `owner`, and `total`. The listener should use `readAt` with its own offset for output text, and the returned disposer ends observation.

`JobKindMap` is the open declaration map in `packages/jobs/jobs/src/view.ts`. A custom producer adds its literal `kind` under `declare module '@deepseek-ai/dsh-jobs/view'`; the shipped `bash` and `subagent` keys are examples of first-party registrations, not names reserved for third-party jobs. The root `@deepseek-ai/dsh-jobs` export also re-exports this type.

**`LocalJobRegistry`**

- Entry: `export:@deepseek-ai/dsh-jobs-local:.`
- Signature: `LocalJobRegistry`
- Source: `packages/jobs/jobs-local/src/index.ts`

| Member   | Signature                                                                                             | Task use                                           |
| -------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `events` | `JobEvents`                                                                                           | Concrete filtered job lifecycle/output subscription. |
| `get`    | `(id: JobId, caller?: any) => JobView`                                                                | Concrete fresh projection with owner access checks. |
| `kill`   | `(id: JobId, caller?: any, reason?: string \| undefined) => "requested" \| "already-finished"`        | Requests concrete producer cancellation; return says requested or finished. |
| `list`   | `(caller?: any) => JobView[]`                                                                         | Concrete caller-visible list with owner fencing. |
| `read`   | `(id: JobId, caller?: any) => JobRead`                                                                | Concrete consuming read, including gap and one-time result. |
| `readAt` | `(id: JobId, from: number, caller?: any) => JobOutputRead`                                            | Concrete non-consuming byte-offset read with gap flag. |
| `remove` | `(id: JobId, caller?: any) => void`                                                                   | Drops retained concrete record after access checks. |
| `start`  | `(spec: JobSpec) => JobId`                                                                            | Runs producer preflight and returns issued id, not JobHandle. |
| `wait`   | `(id: JobId, timeoutMs: number, caller?: any, signal?: AbortSignal \| undefined) => Promise<JobView>` | Observes concrete settlement or timeout without killing. |

**`SkillRegistry`**

- Entry: `export:@deepseek-ai/dsh-skill:.`
- Signature: `SkillRegistry`
- Source: `packages/skill/skill/src/index.ts`

| Member             | Signature                                                                             | Task use                                           |
| ------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `get`              | `(name: string, options?: SkillViewOptions) => Promise<SkillDefinition \| undefined>` | Loads winning full skill for name and lookup scope; may be undefined. |
| `list`             | `(options?: SkillViewOptions) => Promise<SkillSummary[]>`                             | Discovers invocation-neutral summaries for cwd and scope. |
| `register`         | `(skill: SkillRegistration) => () => void`                                            | Registers runtime skill in current scope; effect disposer removes it. |
| `registerProvider` | `(create: (control: SkillProviderControl) => SkillProvider) => () => void`            | Calls synchronous control-to-provider factory; returns disposer. |
| `snapshot`         | `(options?: SkillViewOptions) => Promise<SkillCatalogSnapshot>`                       | Returns resolved catalog revision and winning candidates. |

`SkillProviderControl` (`packages/skill/skill/src/index.ts:270-276`) contains `signal` and `invalidate()`. The `registerProvider` factory receives that control synchronously and returns a `SkillProvider` with `name`, `list(options)`, and `get(candidate, options)` (`index.ts:247-267,390-422`); the registration call returns only the disposer. The provider's `list` can return a complete candidate array or `{ candidates, complete }`; `get` returns the full definition or `undefined`. A runtime-only skill uses `register(skill)` instead.

`SkillProviderObservation` (`index.ts:239-245`) allows partial `{ candidates, complete: false }`. The registry uses those candidates for the current observation but does not cache an incomplete catalog; `snapshot()` reports `complete: false`, allowing the caller to keep last-good presentation and retry discovery (`index.ts:472-496,519-550`). A thrown provider list is contained and likewise prevents caching.

**`FileSystemSkillProvider`**

- Entry: `export:@deepseek-ai/dsh-skill-filesystem:.`
- Signature: `FileSystemSkillProvider`
- Source: `packages/skill/skill-filesystem/src/index.ts`

| Member    | Signature                                                                  | Task use                                           |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `dispose` | `() => Promise<void>`                                                      | Stops watchers/polling and releases provider-owned resources. |
| `get`     | `(candidate: SkillCandidate, options: SkillLookupOptions) => Promise<any>` | Loads selected candidate body under lookup cwd/signal. |
| `list`    | `(options: SkillLookupOptions) => Promise<any>`                            | Discovers candidates under configured roots and lookup cwd/signal. |
| `name`    | `string`                                                                   | Provider identity used for registry duplicate checks. |

**`SubagentRuntime`**

- Entry: `export:@deepseek-ai/dsh-subagent:.`
- Signature: `SubagentRuntime`
- Source: `packages/subagent/subagent/src/index.ts`

| Member             | Signature                                                                                 | Task use                                           |
| ------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `interrupt`        | `(targetSessionId: SessionId, authority: SubagentInterruptAuthority) => void`             | Signals live continuable child under checked parent authority. |
| `list`             | `() => string[]`                                                                          | Lists registered provider names, not child Sessions. |
| `prompt`           | `(request: SubagentPromptRequest, signal: AbortSignal) => Promise<SubagentPromptReceipt>` | Delivers content to continuable child using supplied cancellation. |
| `registerProvider` | `(provider: SubagentProvider) => () => void`                                              | Registers one named provider; effect disposer removes it. |
| `start`            | `(name: string, request: SubagentStartRequest) => Promise<SubagentRun>`                   | Validates capabilities then publishes one-shot run; caller disposes run. |

`SubagentStartRequest` (`src/types.ts:145-203`) requires the live `parent`, `prompt: ContentBlock[]` and owning `signal`. `label`, `agentOptions`, `outputSchema`, `maxDepth`, `toolFilter` and `persona` are optional, but each nontrivial override requires the selected provider capability and is rejected when unsupported. The signal owns cancellation before and after publication. `SubagentRun` (`src/types.ts:308-336`) exposes `id`, optional `localAgent`, settling `result` and idempotent async `dispose()`. A child-level failure resolves a result with error stop reason; a non-representable infrastructure fault rejects. A provider implements `SubagentProvider` (`src/types.ts:344-390`) with unique `name`, `capabilities`, `inheritsParentContext` and `start(resolvedRequest)`, optionally `agentRouteDefaults` and `prepareContinuable`. The provider cleans unpublished setup on rejection; the caller owns a published run and disposes it after settlement or cancellation. Continuable child creation is owned by the continuation manager, not by `SubagentRun`.

`SubagentCapabilities` (`src/types.ts:130-136`) has five one-shot booleans: `agentOptions`, `outputSchema`, `depthLimit`, `toolFilter`, and `persona`. `depthLimit` gates request `maxDepth`; none of these flags promises continuable support. For a continuable child, `SubagentRuntime.sendMessage(sender, targetId, content, options)` accepts `SubagentSendMessageOptions = { signal: AbortSignal }` (`src/index.ts:268-287`, `src/types.ts:69-73`). The signal cancels work only before inbox acceptance; the accepted message is durable and later turn work has its own lifetime. `interrupt(targetSessionId, authority)` checks direct-parent human or exact live-ancestor authority before signalling the current turn (`src/index.ts:314-329`, `src/types.ts:60-67`).

**`default`**

- Entry: `export:@deepseek-ai/dsh-tool-subagent:./model-selection-settings`
- Signature: `SubagentModelSelectionConfig`
- Source: `packages/subagent/tool-subagent/src/model-selection-settings.ts`

| Member    | Signature                              | Task use                                           |
| --------- | -------------------------------------- | -------------------------------------------------- |
| `current` | `() => SubagentModelSelectionSettings` | Reads current subagent model-selection settings. |

**`WorkflowEngine`**

- Entry: `export:@deepseek-ai/dsh-workflow:.`
- Signature: `WorkflowEngine`
- Source: `packages/workflow/workflow/src/index.ts`

| Member  | Signature                                        | Task use                                           |
| ------- | ------------------------------------------------ | -------------------------------------------------- |
| `start` | `(request: WorkflowStartRequest) => WorkflowRun` | Starts script for exact parent; returned run owns result/cancel/dispose. |

`WorkflowStartRequest` (`src/runtime-types.ts:19-36`) requires the JavaScript `script`, plain JSON `meta`, and live `parent`; optional `args`, `subagentProvider`, `maxTotalAgents` and `signal` constrain one run. `WorkflowRun` (`src/runtime-types.ts:41-54`) exposes `id`, validated `meta`, non-rejecting `result`, synchronous `cancel(reason?)` and idempotent async `dispose()` that awaits script and child cleanup. Do not treat a resolved run handle as completed workflow output.

`WorkflowEventName` (`packages/workflow/workflow/src/index.ts:94-101`) is `workflow/start`, `workflow/phase`, `workflow/log`, `workflow/agent-start`, `workflow/agent-end`, or `workflow/end`. The terminal observer payload is `WorkflowResultInfo` (`src/types.ts:117-133`): `stopReason`, optional `error`, and `agentsStarted`, deliberately omitting the materialized `value`. The run owner awaits `WorkflowRun.result` for that value and still disposes the run.

**`default`**

- Entry: `export:@deepseek-ai/dsh-workflow-ptc:.`
- Signature: `PtcWorkflowEngine`
- Source: `packages/workflow/workflow-ptc/src/index.ts`

| Member  | Signature                                        | Task use                                           |
| ------- | ------------------------------------------------ | -------------------------------------------------- |
| `start` | `(request: WorkflowStartRequest) => WorkflowRun` | Runs workflow script with selected PTC runtime and returns disposable run. |

**`runHook`**

- Entry: `export:@deepseek-ai/dsh-hook-protocol:.`
- Signature: `any`
- Source: `packages/hooks/hook-protocol/src/runner.ts`

No directly declared member is needed beyond the callable/type signature for the selected task.

`RunHookOptions` (`packages/hooks/hook-protocol/src/runner.ts:23-55`) requires `payload`, owning `signal`, `trailingNewline` and millisecond `defaultTimeoutMs`; optional `env`, `cwd`, `expectedEventName` affect execution and event-specific output parsing. A hook-specific `timeoutSec` overrides that default after conversion to milliseconds. The bridge decides whether stdin receives a trailing newline; a plugin must not infer that from the command alone.

`appendHookInvoked(session, invocation: HookInvocation)` (`src/events.ts:13-25,66-78`) records an open-turn `turn`, hook `point`, `dialect`, stable `handlerId`, and optional matcher. `appendHookResult(session, record: HookResultRecord)` (`src/events.ts:27-48,86-106`) requires the same turn/point/id plus decoded `output`, explicit `stderrSummaryMaxChars`, and `durationMs`; it derives the durable decision, optional exit code, and bounded stderr summary. The two log-only events must be paired inside one open turn.

**`AgentRegistry`**

- Entry: `export:@deepseek-ai/dsh-agent:.`
- Signature: `AgentRegistry`
- Source: `packages/core/agent/src/index.ts`

| Member     | Signature                                                 | Task use                                           |
| ---------- | --------------------------------------------------------- | -------------------------------------------------- |
| `create`   | `(options: CreateAgentOptions) => Promise<AgentHandle>`   | Creates Agent through installed loop factory; returns teardown handle. |
| `enter`    | `(agent: Agent, owner: Agent \| undefined) => () => void` | Advanced unpublished insertion; closure detaches exact live entry. |
| `get`      | `(id: SessionId) => Agent \| undefined`                   | Looks up one currently live Agent by SessionId. |
| `list`     | `() => Agent[]`                                           | Returns fresh array of all live Agents in registration order. |
| `register` | `(agent: Agent) => any`                                   | Effect-registers prebuilt root Agent and announces creation. |
| `resume`   | `(options: ResumeAgentOptions) => Promise<AgentHandle>`   | Resumes Session through installed loop factory; returns teardown handle. |
| `roots`    | `() => Agent[]`                                           | Returns fresh array of runtime roots; lineage alone does not decide. |

**`AgentHandle`**

- Entry: `export:@deepseek-ai/dsh-agent:.`
- Signature: `AgentHandle`
- Source: `packages/core/agent/src/index.ts`

| Member    | Signature             | Task use                                           |
| --------- | --------------------- | -------------------------------------------------- |
| `agent`   | `Agent`               | Exact created/resumed live Agent owned by this handle. |
| `dispose` | `() => Promise<void>` | Drains and tears down Agent resources and registration. |
