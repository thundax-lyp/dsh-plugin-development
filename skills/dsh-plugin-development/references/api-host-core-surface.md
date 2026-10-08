# Host/Core 任务 API

## Host/Core 任务 API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-host-core.md)。本页只列出这些插件任务直接使用的公开成员。

Host 示例需要以下公开输入与结果类型：`Agent`（`packages/core/agent/src/types.ts:15`）提供真实父 Agent 及其 Session；`GenerateOptions`（`packages/llm/llm/src/types.ts:511`）包含 provider/model/messages 和可选 `signal`；`StreamChunk`（同文件第 452 行）是 block-start/delta/block-end/usage/finish 联合；`JobId`（`packages/jobs/jobs/src/brand.ts:19`）是 registry 返回的品牌 ID；`SubagentResult`（`packages/subagent/subagent/src/types.ts:271`）含 `output`、可选 `structured`/`diagnostic` 与 `stopReason`；`WorkflowResult`（`packages/workflow/workflow/src/types.ts:72`）含 `value`、`stopReason`、可选 `error` 与 `agentsStarted`。`Context` 是 Cordis 插件注入上下文。

存活的 `Agent` 类型还暴露 `ctx`、`send`、`followup`、`steer`、`inject`、`whenIdle`、`runMaintenance` 和 `inbox`。这些是对所拥有 Agent 的生命周期操作，不是任意 Session ID 上的方法。`GenerateOptions` 提供 `messages`、`provider`、`model`，以及可选的 `maxTokens`、`temperature`、`reasoningEffort`、`toolHistory`、`purpose`、`sessionId` 和取消信号 `signal`；适配器代码必须保留调用方的路由和取消选择。`ToolCallId` 是流式 Tool 调用的品牌标识，不是 UI 生成的字符串。`SubagentResult.stopReason` 区分终止结果；只有请求的对象 schema 成功验证后才有 `structured`，`diagnostic` 则描述失败的运行。`WorkflowResult.value`、`stopReason` 和 `agentsStarted` 是运行结束后的事实；可选的 `error` 解释失败，但不会使 `WorkflowRun.result` 拒绝。

**`SystemPrompt`**

- 入口: `export:@deepseek-ai/dsh-system-prompt:.`
- 签名: `SystemPrompt`
- 源码: `packages/core/system-prompt/src/index.ts`

| 成员                     | 签名                                                                                                                                                                                                                                                     | 任务用途                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `assemble`               | `(context?: AssembleContext) => Promise<PromptAssembly>`                                                                                                                                                                                                 | 运行当前作用域可见的 provider，返回组装后的 prompt/Tool；provider 失败会使组装拒绝。 |
| `context`                | `(context: PromptContext) => () => void`                                                                                                                                                                                                                 | 在当前作用域注册一个具名上下文 provider；清理器可移除它。                            |
| `getContextOrder`        | `(name: "SANDBOX_POLICY" \| "APPROVAL_POLICY" \| "SUBAGENT_DELEGATION") => number`                                                                                                                                                                       | 返回仓库拥有的上下文槽位的固定顺序。                                                 |
| `getSectionOrder`        | `(name: "HARNESS_IDENTITY" \| "DEPLOYMENT_PERSONA_PREFIX" \| "PLAN_POLICY" \| "TEAM_POLICY" \| "PTC_ONLY" \| "FILE_REFERENCE" \| "TOOL_BASH" \| "TOOL_PWSH" \| "TOOL_READ" \| "TOOL_WRITE" \| ... 21 more ... \| "DEPLOYMENT_PERSONA_SUFFIX") => number` | 返回仓库拥有的段落槽位的固定顺序。                                                   |
| `section`                | `(section: PromptSection) => () => void`                                                                                                                                                                                                                 | 注册具名、有序的 prompt 段落；清理器可移除它。                                       |
| `suppressRuntimeContext` | `() => () => void`                                                                                                                                                                                                                                       | 在本作用域隐藏运行时上下文的 prompt 披露，直到清理。                                 |
| `tools`                  | `(provider: (context: AssembleContext) => ToolProviderResult) => () => void`                                                                                                                                                                             | 注册在组装时求值的 Tool schema provider；清理器可移除它。                            |
| `variable`               | `(name: string, provider: (context: AssembleContext) => string \| undefined) => () => void`                                                                                                                                                              | 注册具名插值 provider；返回 undefined 则保持未解析。                                 |

**`ToolRuntime`**

- 入口: `export:@deepseek-ai/dsh-tools:.`
- 签名: `ToolRuntime`
- 源码: `packages/core/tools/src/index.ts`

| 成员       | 签名                                                         | 任务用途                                                                    |
| ---------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `execute`  | `(exec: ToolExecutionInput) => Promise<ToolExecutionResult>` | 在 guard 和策略下执行一次可由调用方取消的调用；返回规范化的成功或错误结果。 |
| `get`      | `(name: string, scope?: any) => ToolDefinition \| undefined` | 解析指定名称及可选作用域中生效的注册定义。                                  |
| `guard`    | `(guard: ToolGuard) => () => void`                           | 添加只能拒绝的单调检查；返回的清理器移除该 guard。                          |
| `register` | `(definition: ToolDefinition) => () => void`                 | 注册作用域内的 Tool 定义并返回其作用清理器。                                |

**`ToolDefinition`**

- 入口: `export:@deepseek-ai/dsh-tools:.`
- 签名: `ToolDefinition`
- 源码: `packages/core/tools/src/index.ts`

| 成员                | 签名                                                                                                                   | 任务用途                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `execute`           | `(args: unknown, exec: ToolRunContext) => Promise<unknown>`                                                            | 异步执行体只返回规范 JSON；必须遵守 exec.signal 并在取消后停止。 |
| `finalizeContent`   | `((exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => ContentBlock[] \| undefined) \| undefined` | 对所有规范化结果执行完整的同步最终内容转换。                     |
| `isConcurrencySafe` | `((args: unknown) => boolean) \| undefined`                                                                            | 纯同步的显式选择；只有返回 true 才允许同级调用重叠。             |
| `output`            | `ToolOutputDefinition`                                                                                                 | 声明必需的规范 schema 和纯渲染投影。                             |
| `presentCall`       | `((args: unknown) => ToolCallView \| undefined) \| undefined`                                                          | 纯函数且可重放的待执行调用视图；undefined 使用通用视图。         |
| `presentResult`     | `((args: unknown, result: ToolResult) => ToolResultView \| undefined) \| undefined`                                    | 纯函数且可重放的已完成结果视图；undefined 保留通用内容。         |
| `projectContent`    | `((exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => ContentBlock[] \| undefined) \| undefined` | 执行后策略运行前的可选内容投影。                                 |
| `timeoutMs`         | `number \| undefined`                                                                                                  | 正数协作式时限；仅在已安装超时策略时生效。                       |

对于 [Host Tool 任务](how-to-host-core.md#register-host-tool)，同一包导出 `defineTool(options: DefineToolOptions<S, O>): ToolDefinition`（`packages/core/tools/src/schema.ts:482-562`）。选项要求 `name`、`description`、逐属性定义的 `parameters` DSL、`output: { schema, render }` 和 `execute(args, exec)`；可选的 `timeoutMs`、`isConcurrencySafe`、`projectContent`、`finalizeContent`、`presentCall` 与 `presentResult` 遵循上表定义。`ToolRunContext`（`packages/core/tools/src/index.ts:418-438`）扩展执行标识（`callId`、`name`、`arguments`、可选 `agent`、必需 `signal`），另提供 `deferContext(context)` 和 `concludeTurn()`。仅凭 `ToolDefinition` 成员表不足以实现有类型的 `defineTool` 回调。

`ToolExecutionResult` 由 `isError` 判别（`packages/core/tools/src/index.ts:572-596`）。`ToolExecutionSuccess` 含 `isError: false`、执行范围内的规范 `value: JsonValue`、模型可见的 `content`、可选且可持久化的呈现 `meta`、延迟注入的 `additionalContexts` 和可选的 `concludesTurn`。`ToolExecutionFailure` 含 `isError: true`、`error: ToolFailure`（`message` 与可选的 `ToolErrorInfo`）、模型可见的 `content` 和可选的 `additionalContexts`，**没有**成功态的 `value` 或 `concludesTurn`。`PreToolDecision`（`index.ts:607-615`）允许 `allow`、`deny`、`cancel`，或由审批控制的 `ask`；`PostToolDecision`（`index.ts:617-620`）允许 `accept` 并替换 `value` 或 `content`，还可附带 `additionalContexts`，或者以反馈执行 `block`。执行前策略不会改写已经记录的参数。

**`LlmRuntime`**

- 入口: `export:@deepseek-ai/dsh-llm:.`
- 签名: `LlmRuntime`
- 源码: `packages/llm/llm/src/index.ts`

| 成员          | 签名                                                                                     | 任务用途                                             |
| ------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `prepareCall` | `(config: LlmCallConfig, signal?: AbortSignal \| undefined) => Promise<PreparedLlmCall>` | 解析精确路由和模型并绑定适配器代次；缺失路由时拒绝。 |
| `stream`      | `(options: GenerateOptions) => AsyncIterable<StreamChunk>`                               | 通过所选已注册适配器流式输出规范化片段。             |

适配器注册是该运行时面向插件的部分（`packages/llm/llm/src/index.ts:396-421,490-584`）：`registerAdapter(providers: string[], adapter: LlmAdapter): AdapterRegistrationHandle`、`registerConfigurableProviders(entries: readonly LlmConfigurableProvider[]): DirectoryRegistrationHandle` 和 `registerModelDiscovery(settingsNs: string, discover: (request: LlmModelDiscoveryRequest, signal?: AbortSignal) => Promise<readonly LlmDiscoveredModel[]>): () => void`。注册句柄是由作用域拥有的清理器；前两者还支持原子 `replace(...)`。后两者仅在提供设置或模型目录界面时需要；只提供运行时能力的适配器可仅调用 `registerAdapter`。

`LlmModelDiscoveryRequest`（`packages/llm/llm/src/types.ts:276-293`）包含可选的现有 `provider` 路由、草稿 `baseURL`、传输协议 `api` 和仅供本次操作使用的 `apiKey`；仍在新增中的路由尚无 provider ID。发现回调通过**单独的**可选 `signal` 参数接收取消信号，而不是从请求对象中读取（`src/index.ts:564-570`）。适配器的 `providerRetryPolicy(provider)` 返回 `ResolvedRetryPolicy | undefined`；注册捕获策略前，`resolveRetryPolicy(config, diagnosticPath)` 会验证并冻结 `normal` 或 `always` 路由策略（`src/retry-policy.ts:149-180`）。使用凭据的适配器可调用 `assertUsableApiKey(raw, packageName, credentialRef)` 去除密钥首尾空白并验证，同时避免在诊断信息中泄露密钥值（`src/index.ts:130-166`）。

**`LlmAdapter`**

- 入口: `export:@deepseek-ai/dsh-llm:.`
- 签名: `LlmAdapter`
- 源码: `packages/llm/llm/src/index.ts`

| 成员          | 签名                                                                                                   | 任务用途                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `prepareCall` | `(provider: string, model: string, signal?: AbortSignal \| undefined) => Promise<PreparedAdapterCall>` | 默认绑定 resolveModel 与 stream；设置代次变化时应覆盖。       |
| `stream`      | `(options: GenerateOptions) => AsyncIterable<StreamChunk>`                                             | 唯一抽象方法；遵守可选 signal，输出有效片段后以 finish 结束。 |

`LlmAdapter` 是抽象类，唯一必须覆盖的方法是 `stream(options)`（`packages/llm/llm/src/index.ts:208-290`）。`providerInfo(provider)`、`providerRetryPolicy(provider)`、`imageRequestPricing(provider, model)`、`listModels(provider)`、`resolveModel(provider, model, signal?)` 和 `prepareCall(provider, model, signal?)` 均有默认实现。默认的 `listModels` 返回空目录：直接路由可以使用未列入目录的模型，但通过 GUI 目录选择模型时必须提供模型列表。若动态连接设置必须绑定模型元数据并分派到某一代适配器，应覆盖 `prepareCall`。

**`Session`**

- 入口: `export:@deepseek-ai/dsh-session:.`
- 签名: `Session`
- 源码: `packages/core/session/src/index.ts`

| 成员      | 签名                                                                                                                                                        | 任务用途                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `append`  | `<T extends SessionEventType>(type: T, data: SessionEventMap[T], ...opts: T extends SurfaceEventType ? [opts: SurfaceIntent<T>] : []) => SessionEvent<...>` | 验证并提交一个事件及所需 surface intent，然后发出该事件。   |
| `header`  | `SessionHeader`                                                                                                                                             | 不可变的 Session 元数据，供投影初始化和工作区归属判断使用。 |
| `id`      | `Branded<"SessionId">`                                                                                                                                      | 可持久化的 Session 标识，也用作 Agent 和作业所有者地址。    |
| `seq`     | `BrandedNumber<"SessionLogOffset">`                                                                                                                         | 下一日志偏移量；仅在 append 被接受时前进。                  |
| `surface` | `SessionSurface`                                                                                                                                            | 为已获授权的消息生成事件提供 surface intent 的辅助对象。    |

**`SessionProjectionRegistry`**

- 入口: `export:@deepseek-ai/dsh-session-projection:.`
- 签名: `SessionProjectionRegistry`
- 源码: `packages/session/session-projection/src/index.ts`

| 成员         | 签名                                                                                                                                                                                                                                                                                                                               | 任务用途                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `checkpoint` | `(session: Session) => ProjectionCheckpoint`                                                                                                                                                                                                                                                                                       | 在 Session 游标处捕获全部已注册单元，供缓存持久化。          |
| `register`   | `{ <K extends keyof SessionProjectionMap, S extends SessionProjectionStateMap[K]>(definition: Omit<ProjectionDefinition<K, S>, "wire"> & { wire: (K extends never ? { ...; } : never) & {}; }): () => void; <K extends Exclude<keyof SessionProjectionStateMap, keyof SessionProjectionMap>, S extends SessionProjectionStateM...` | 注册纯函数的按键折叠；对应作用清理器移除该单元。             |
| `restore`    | `(checkpoint: ProjectionCheckpoint, events: readonly SessionEvent[], baseSeq: SessionLogOffset, header: SessionHeader, inheritedEventCount: SessionLogOffset) => { snapshot: ProjectionSnapshot; checkpoint: ProjectionCheckpoint; }`                                                                                              | 基于已验证的检查点重放事件并返回快照和检查点。               |
| `snapshot`   | `(session: Session, keys?: readonly never[] \| undefined) => ProjectionSnapshot`                                                                                                                                                                                                                                                   | 返回 Client 可见 wire 视图的一致快照；省略仅 Host 可见的键。 |

直接成员提取器遗漏了泛型方法 `stateOf<K extends keyof SessionProjectionStateMap>(session: Session, key: K): SessionProjectionStateMap[K] | undefined`（`packages/session/session-projection/src/index.ts:316-328`）。仅 Host 可见的投影从这里读取；`snapshot` 只返回带 `wire` 视图的键。`ProjectionDefinition`（`index.ts:48-94`）要求 `key`、`stateSchema`、纯同步的 `init` 和 `apply`，以及 `stateVersion`；Client 可见的键还要求 `wire: { viewSchema, view }`。通过声明合并把键加入 `SessionProjectionStateMap`；仅当 Client 需要该视图时才加入 `SessionProjectionMap`。

`SessionProjectionStateMap`（`src/types.ts:24`）是空的开放接口。每个插件在调用 `register` 或 `stateOf` 前通过声明合并提供不同的键和状态类型；它不是运行时注册表或持久化存储。

**`CommandRuntime`**

- 入口: `export:@deepseek-ai/dsh-commands:.`
- 签名: `CommandRuntime`
- 源码: `packages/interaction/commands/src/index.ts`

| 成员       | 签名                                                                                                                                | 任务用途                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `execute`  | `(agent: Agent, line: string, submittedAttachments: readonly any[], signal: AbortSignal) => Promise<CommandExecution \| undefined>` | 按指定 Agent 和 signal 分发 slash 行；返回已完成的执行结果或 undefined。 |
| `list`     | `(agent: Agent) => readonly CommandDescriptor[]`                                                                                    | 返回一个 Agent 在当前作用域生效的命令描述。                              |
| `register` | `(definition: CommandDefinition) => () => void`                                                                                     | 注册作用域内的命令定义；清理器可移除它。                                 |

`CommandDefinition`（`packages/interaction/commands/src/index.ts:61-79`）包含 `name`、`description`、可选的 `definitionId`、`input: { hint, attachments? }`、`recordInput`，以及 `handler(invocation: CommandInvocation): CommandResult | Promise<CommandResult>`。`CommandInvocation` 携带 `commandId`、`agent`、原样的 `rawInput`、已准入的 `attachments` 和 `signal`。`CommandExecution`（`packages/interaction/commands/src/types.ts`）是注册表返回的**已完成**结果 `{ commandId, result }`，不是处理器输入。`CommandRuntime.registerFileReceiptResolver(resolver: CommandFileReceiptResolver): () => void` 是处理暂存文件回执的独立 Host 专用权限。

**`ApprovalService`**

- 入口: `export:@deepseek-ai/dsh-user-approval:.`
- 签名: `ApprovalService`
- 源码: `packages/interaction/user-approval/src/index.ts`

| 成员      | 签名                                                 | 任务用途                                                                             |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `config`  | `Config`                                             | 已配置的审批策略输入；每次请求分别解析生效策略。                                     |
| `request` | `(req: ApprovalRequest) => Promise<ApprovalOutcome>` | 要求 Agent 处于开放 turn；返回允许一次、拒绝、取消或不可用，审计记录无法提交时抛错。 |

`ApprovalRequest` 要求 `agent: Agent` 和 `toolName: string`；可选的 `callId?: ToolCallId`、`reason?: string` 和 `signal?: AbortSignal` 用于标识并取消具体 Tool 操作。`CommandRuntime.execute` 不会开启 turn，因此 slash command 处理器不能直接调用此方法。

**`GoalService`**

- 入口: `export:@deepseek-ai/dsh-goal:.`
- 签名: `GoalService`
- 源码: `packages/goal/goal/src/index.ts`

| 成员       | 签名                                                                 | 任务用途                                    |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------- |
| `block`    | `(agent: Agent, ref: GoalRef, reason: GoalBlockReason) => GoalView`  | 记录带原因的受阻目标并返回当前视图。        |
| `clear`    | `(agent: Agent, ref: GoalRef) => GoalRef`                            | 清除所引用的目标并返回其持久引用。          |
| `complete` | `(agent: Agent, ref: GoalRef) => GoalView`                           | 将所引用的目标标记为完成并返回其视图。      |
| `create`   | `(agent: Agent, request: CreateGoalRequest) => GoalView`             | 创建一个由 Session 拥有的目标并返回其视图。 |
| `edit`     | `(agent: Agent, ref: GoalRef, request: EditGoalRequest) => GoalView` | 使用经过验证的请求字段修改所引用的目标。    |
| `get`      | `(agent: Agent) => GoalView \| undefined`                            | 读取一个 Agent 当前的目标视图（如有）。     |
| `pause`    | `(agent: Agent, ref: GoalRef) => GoalView`                           | 记录所引用目标的暂停状态并返回视图。        |
| `resume`   | `(agent: Agent, ref: GoalRef) => GoalView`                           | 恢复所引用的目标并返回视图。                |

**`JobRegistry`**

- 入口: `export:@deepseek-ai/dsh-jobs:.`
- 签名: `JobRegistry`
- 源码: `packages/jobs/jobs/src/index.ts`

| 成员     | 签名                                                                                                             | 任务用途                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `events` | `JobEvents`                                                                                                      | 用于作业生命周期及输出通知的过滤订阅接口。                 |
| `get`    | `(id: Branded<"JobId">, caller?: any) => JobView`                                                                | 返回新的投影视图；未知或非本方作业会抛错。                 |
| `kill`   | `(id: Branded<"JobId">, caller?: any, reason?: string \| undefined) => "requested" \| "already-finished"`        | 请求取消生产者；本方法本身不等待结束。                     |
| `list`   | `(caller?: any) => JobView[]`                                                                                    | 列出调用方可见的作业；省略调用方时仅能看到无所有者的作业。 |
| `read`   | `(id: Branded<"JobId">, caller?: any) => JobRead`                                                                | 推进模型游标；报告缺口和仅返回一次的终止结果。             |
| `readAt` | `(id: Branded<"JobId">, from: number, caller?: any) => JobOutputRead`                                            | 从绝对字节偏移量读取保留的输出，不消耗游标。               |
| `remove` | `(id: Branded<"JobId">, caller?: any) => void`                                                                   | 通过所有权检查后移除保留的作业。                           |
| `start`  | `(spec: JobSpec) => Branded<"JobId">`                                                                            | 预检规格，将 JobHandle 传给 run，并返回签发的 JobId。      |
| `wait`   | `(id: Branded<"JobId">, timeoutMs: number, caller?: any, signal?: AbortSignal \| undefined) => Promise<JobView>` | 等待作业结束或超时，不取消作业。                           |

`JobSpec`（`packages/jobs/jobs/src/types.ts:126-154`）要求 `kind`、`label` 和 `run(job: JobHandle): JobHooks`；`owner?: SessionId`、`outputLimitBytes?` 与 `output?` 可选。`JobRegistry.start(spec): JobId` 返回 ID。注册表将 `JobHandle` 传入 `run`；其 `append(text, options?)` 和 `updateProgress(line)` 都是同步方法。`JobHooks` 必须提供同步且幂等的 `cancel(reason?)`，以及 `done: Promise<JobOutcome>`；生产者清理完成后，`done` 解析为 `{ status: 'completed' | 'killed' | 'failed', detail?, result? }`。这些回调契约决定资源所有权，不能仅从 `start` 成员签名推断。

`JobOutputSource`（`src/types.ts:55-69`）是 `{ channel?, read(fromByte): JobSourceRead }`；`read` 返回 `{ text, nextOffset, lossy, spillPath? }`，不会消耗自身历史。`JobSpec.output` 的来源会持续抽取，并在结束前再排空一次。`JobEvents.subscribe(filter, listener): () => void`（`src/types.ts:200-255`）接收 `JobEventFilter`：`{ owner: SessionId }`、`{ owners: 'scope' }` 或 `{ owners: 'all' }`。`JobEvent` 的生命周期变体含 `job: JobView`；`settled` 另含 `cause: 'producer' | 'kill' | 'teardown'` 和 `awaited`，而 `output` 只发送 `id`、可选的 `owner` 和 `total`。监听器应以自己的偏移量调用 `readAt` 获取输出文本，返回的清理器用于停止监听。

`JobKindMap` 是 `packages/jobs/jobs/src/view.ts` 中开放的声明映射。自定义生产者在 `declare module '@deepseek-ai/dsh-jobs/view'` 下加入其字面量 `kind`；内置的 `bash` 和 `subagent` 键只是第一方注册示例，并非禁止第三方作业使用的保留名称。根导出 `@deepseek-ai/dsh-jobs` 也重新导出该类型。

**`LocalJobRegistry`**

- 入口: `export:@deepseek-ai/dsh-jobs-local:.`
- 签名: `LocalJobRegistry`
- 源码: `packages/jobs/jobs-local/src/index.ts`

| 成员     | 签名                                                                                                  | 任务用途                                               |
| -------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `events` | `JobEvents`                                                                                           | 具体实现中的过滤式作业生命周期和输出订阅。             |
| `get`    | `(id: JobId, caller?: any) => JobView`                                                                | 具体实现中带所有者访问检查的新投影视图。               |
| `kill`   | `(id: JobId, caller?: any, reason?: string \| undefined) => "requested" \| "already-finished"`        | 请求取消具体生产者；返回值表明已请求或已结束。         |
| `list`   | `(caller?: any) => JobView[]`                                                                         | 具体实现中带所有者隔离的调用方可见列表。               |
| `read`   | `(id: JobId, caller?: any) => JobRead`                                                                | 具体实现中推进游标的读取，含缺口和仅返回一次的结果。   |
| `readAt` | `(id: JobId, from: number, caller?: any) => JobOutputRead`                                            | 具体实现中按字节偏移量读取且不消耗游标，并附缺口标志。 |
| `remove` | `(id: JobId, caller?: any) => void`                                                                   | 通过访问检查后删除具体实现保留的记录。                 |
| `start`  | `(spec: JobSpec) => JobId`                                                                            | 执行生产者预检并返回签发的 ID，而非 JobHandle。        |
| `wait`   | `(id: JobId, timeoutMs: number, caller?: any, signal?: AbortSignal \| undefined) => Promise<JobView>` | 观察具体实现的结束或超时，不终止作业。                 |

**`SkillRegistry`**

- 入口: `export:@deepseek-ai/dsh-skill:.`
- 签名: `SkillRegistry`
- 源码: `packages/skill/skill/src/index.ts`

| 成员               | 签名                                                                                  | 任务用途                                                     |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `get`              | `(name: string, options?: SkillViewOptions) => Promise<SkillDefinition \| undefined>` | 按名称及查找作用域加载胜出的完整 Skill；可能返回 undefined。 |
| `list`             | `(options?: SkillViewOptions) => Promise<SkillSummary[]>`                             | 发现当前 cwd 和作用域内与调用无关的摘要。                    |
| `register`         | `(skill: SkillRegistration) => () => void`                                            | 在当前作用域注册运行时 Skill；作用清理器可移除它。           |
| `registerProvider` | `(create: (control: SkillProviderControl) => SkillProvider) => () => void`            | 调用同步的控制对象到 provider 工厂；返回清理器。             |
| `snapshot`         | `(options?: SkillViewOptions) => Promise<SkillCatalogSnapshot>`                       | 返回已解析的目录版本及胜出的候选。                           |

`SkillProviderControl`（`packages/skill/skill/src/index.ts:270-276`）包含 `signal` 和 `invalidate()`。`registerProvider` 工厂同步接收此控制对象，并返回含 `name`、`list(options)` 和 `get(candidate, options)` 的 `SkillProvider`（`index.ts:247-267,390-422`）；注册调用本身只返回清理器。provider 的 `list` 可以返回完整候选数组，也可以返回 `{ candidates, complete }`；`get` 返回完整定义或 `undefined`。仅在运行时提供 Skill 时改用 `register(skill)`。

`SkillProviderObservation`（`index.ts:239-245`）允许部分结果 `{ candidates, complete: false }`。注册表在本次观察中使用这些候选，但不会缓存不完整的目录；`snapshot()` 报告 `complete: false`，调用方可保留上一次有效呈现并重试发现（`index.ts:472-496,519-550`）。provider 的 `list` 抛错会被隔离，同样阻止缓存。

**`FileSystemSkillProvider`**

- 入口: `export:@deepseek-ai/dsh-skill-filesystem:.`
- 签名: `FileSystemSkillProvider`
- 源码: `packages/skill/skill-filesystem/src/index.ts`

| 成员      | 签名                                                                       | 任务用途                                        |
| --------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| `dispose` | `() => Promise<void>`                                                      | 停止监听和轮询，并释放 provider 拥有的资源。    |
| `get`     | `(candidate: SkillCandidate, options: SkillLookupOptions) => Promise<any>` | 在指定查找 cwd 和 signal 下加载所选候选的正文。 |
| `list`    | `(options: SkillLookupOptions) => Promise<any>`                            | 在已配置根目录及查找 cwd 和 signal 下发现候选。 |
| `name`    | `string`                                                                   | 注册表用于重复项检查的 provider 标识。          |

**`SubagentRuntime`**

- 入口: `export:@deepseek-ai/dsh-subagent:.`
- 签名: `SubagentRuntime`
- 源码: `packages/subagent/subagent/src/index.ts`

| 成员               | 签名                                                                                      | 任务用途                                                |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `interrupt`        | `(targetSessionId: SessionId, authority: SubagentInterruptAuthority) => void`             | 核验父级权限后，向存活且可继续交互的子 Agent 发出信号。 |
| `list`             | `() => string[]`                                                                          | 列出已注册 provider 名称，而非子 Session。              |
| `prompt`           | `(request: SubagentPromptRequest, signal: AbortSignal) => Promise<SubagentPromptReceipt>` | 使用提供的取消信号向可继续交互的子 Agent 送达内容。     |
| `registerProvider` | `(provider: SubagentProvider) => () => void`                                              | 注册一个具名 provider；作用清理器可移除它。             |
| `start`            | `(name: string, request: SubagentStartRequest) => Promise<SubagentRun>`                   | 验证能力后发布单次运行；调用方负责清理运行。            |

`SubagentStartRequest`（`src/types.ts:145-203`）要求存活的 `parent`、`prompt: ContentBlock[]` 和拥有取消权的 `signal`。`label`、`agentOptions`、`outputSchema`、`maxDepth`、`toolFilter` 与 `persona` 可选，但每项非平凡覆盖都需要所选 provider 的相应能力；不支持时请求会被拒绝。发布前后都由此信号控制取消。`SubagentRun`（`src/types.ts:308-336`）暴露 `id`、可选的 `localAgent`、最终落定的 `result` 和幂等的异步 `dispose()`。子 Agent 层面的失败解析为带错误停止原因的结果；无法表示为结果的基础设施故障则使 Promise 拒绝。provider 实现 `SubagentProvider`（`src/types.ts:344-390`），要求唯一的 `name`、`capabilities`、`inheritsParentContext` 和 `start(resolvedRequest)`，可选 `agentRouteDefaults` 与 `prepareContinuable`。未发布的准备工作在拒绝时由 provider 清理；已发布的运行由调用方拥有，并在结束或取消后清理。可继续交互的子 Agent 由续接管理器创建，不归 `SubagentRun` 所有。

`SubagentCapabilities`（`src/types.ts:130-136`）有五个单次运行能力布尔值：`agentOptions`、`outputSchema`、`depthLimit`、`toolFilter` 和 `persona`。`depthLimit` 控制请求的 `maxDepth`；这些标志都不表示支持继续交互。对可继续交互的子 Agent，`SubagentRuntime.sendMessage(sender, targetId, content, options)` 接收 `SubagentSendMessageOptions = { signal: AbortSignal }`（`src/index.ts:268-287`、`src/types.ts:69-73`）。信号只能在消息被 inbox 接收前取消工作；已接收的消息是持久的，后续 turn 的生命周期独立。`interrupt(targetSessionId, authority)` 在向当前 turn 发出中断信号前，会核查直接父级的人类权限或精确的存活祖先权限（`src/index.ts:314-329`、`src/types.ts:60-67`）。

**`default`**

- 入口: `export:@deepseek-ai/dsh-tool-subagent:./model-selection-settings`
- 签名: `SubagentModelSelectionConfig`
- 源码: `packages/subagent/tool-subagent/src/model-selection-settings.ts`

| 成员      | 签名                                   | 任务用途                          |
| --------- | -------------------------------------- | --------------------------------- |
| `current` | `() => SubagentModelSelectionSettings` | 读取当前子 Agent 的模型选择设置。 |

**`WorkflowEngine`**

- 入口: `export:@deepseek-ai/dsh-workflow:.`
- 签名: `WorkflowEngine`
- 源码: `packages/workflow/workflow/src/index.ts`

| 成员    | 签名                                             | 任务用途                                                 |
| ------- | ------------------------------------------------ | -------------------------------------------------------- |
| `start` | `(request: WorkflowStartRequest) => WorkflowRun` | 为指定父级启动脚本；返回的运行句柄负责结果、取消和清理。 |

`WorkflowStartRequest`（`src/runtime-types.ts:19-36`）要求 JavaScript `script`、普通 JSON `meta` 和存活的 `parent`；可选的 `args`、`subagentProvider`、`maxTotalAgents` 与 `signal` 限定本次运行。`WorkflowRun`（`src/runtime-types.ts:41-54`）暴露 `id`、经过验证的 `meta`、不会拒绝的 `result`、同步的 `cancel(reason?)`，以及等待脚本和子 Agent 清理完成的幂等异步 `dispose()`。取得运行句柄不等于工作流已经产出完成结果。

`WorkflowEventName`（`packages/workflow/workflow/src/index.ts:94-101`）可为 `workflow/start`、`workflow/phase`、`workflow/log`、`workflow/agent-start`、`workflow/agent-end` 或 `workflow/end`。终止事件的观察者载荷是 `WorkflowResultInfo`（`src/types.ts:117-133`）：`stopReason`、可选的 `error` 与 `agentsStarted`，特意不包含实际 `value`。运行所有者应等待 `WorkflowRun.result` 获取该值，并且仍须清理运行。

**`default`**

- 入口: `export:@deepseek-ai/dsh-workflow-ptc:.`
- 签名: `PtcWorkflowEngine`
- 源码: `packages/workflow/workflow-ptc/src/index.ts`

| 成员    | 签名                                             | 任务用途                                                    |
| ------- | ------------------------------------------------ | ----------------------------------------------------------- |
| `start` | `(request: WorkflowStartRequest) => WorkflowRun` | 使用所选 PTC 运行时执行工作流脚本，并返回可清理的运行句柄。 |

**`runHook`**

- 入口: `export:@deepseek-ai/dsh-hook-protocol:.`
- 签名: `any`
- 源码: `packages/hooks/hook-protocol/src/runner.ts`

所选任务只需可调用签名与类型签名，不需要其他直接声明的成员。

`RunHookOptions`（`packages/hooks/hook-protocol/src/runner.ts:23-55`）要求 `payload`、负责取消的 `signal`、`trailingNewline` 和以毫秒计的 `defaultTimeoutMs`；可选的 `env`、`cwd`、`expectedEventName` 影响执行及特定事件的输出解析。Hook 专用的 `timeoutSec` 换算为毫秒后会覆盖默认值。是否向 stdin 追加换行由桥接层决定；插件不能仅从命令推断。

`appendHookInvoked(session, invocation: HookInvocation)`（`src/events.ts:13-25,66-78`）记录处于开放状态的 `turn`、Hook 的 `point`、`dialect`、稳定的 `handlerId` 和可选 matcher。`appendHookResult(session, record: HookResultRecord)`（`src/events.ts:27-48,86-106`）要求相同的 turn、point 和 ID，以及解码后的 `output`、显式的 `stderrSummaryMaxChars` 和 `durationMs`；它据此得出可持久化的决策、可选退出码及受长度限制的 stderr 摘要。这两个仅用于日志的事件必须在同一个开放 turn 内配对。

**`AgentRegistry`**

- 入口: `export:@deepseek-ai/dsh-agent:.`
- 签名: `AgentRegistry`
- 源码: `packages/core/agent/src/index.ts`

| 成员       | 签名                                                      | 任务用途                                                     |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| `create`   | `(options: CreateAgentOptions) => Promise<AgentHandle>`   | 通过已安装的循环工厂创建 Agent；返回拆卸句柄。               |
| `enter`    | `(agent: Agent, owner: Agent \| undefined) => () => void` | 高级用法：插入尚未发布的对象；返回的闭包移除指定的存活条目。 |
| `get`      | `(id: SessionId) => Agent \| undefined`                   | 按 SessionId 查找当前存活的 Agent。                          |
| `list`     | `() => Agent[]`                                           | 按注册顺序返回全部存活 Agent 的新数组。                      |
| `register` | `(agent: Agent) => any`                                   | 通过作用注册预构建的根 Agent 并发出创建通知。                |
| `resume`   | `(options: ResumeAgentOptions) => Promise<AgentHandle>`   | 通过已安装的循环工厂恢复 Session；返回拆卸句柄。             |
| `roots`    | `() => Agent[]`                                           | 返回运行时根节点的新数组；不能仅凭谱系判断。                 |

**`AgentHandle`**

- 入口: `export:@deepseek-ai/dsh-agent:.`
- 签名: `AgentHandle`
- 源码: `packages/core/agent/src/index.ts`

| 成员      | 签名                  | 任务用途                                 |
| --------- | --------------------- | ---------------------------------------- |
| `agent`   | `Agent`               | 此句柄拥有的、刚创建或恢复的存活 Agent。 |
| `dispose` | `() => Promise<void>` | 排空并拆卸 Agent 的资源及注册。          |
