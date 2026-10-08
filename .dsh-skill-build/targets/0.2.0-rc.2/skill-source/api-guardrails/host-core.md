# Host/Core 与 Agent 执行 API 约束

本 reference 锁定 `@deepseek-ai/dsh-agent@0.2.0-rc.2`（`dsh-v0.2.0-rc.2`），涵盖 Host 侧插件接口。Client 与 Typert Remote 入口属于不同的运行端：不要把 Host 服务导入浏览器 bundle，也不要仅凭 `./client`、`./remote` 或 `./typert` 导出推断远程往返已可运行。

## Agent、Session 与 scope

挂载 `@deepseek-ai/dsh-agent` 以获得 `ctx.agents: AgentRegistry`；挂载 `@deepseek-ai/dsh-agent-loop` 以安装具体 factory。`AgentRegistry.create(options: CreateAgentOptions)` 与 `resume(options: ResumeAgentOptions)` 返回 `AgentHandle`，其中的 `agent` 暴露 `send`、`followup`、`steer`、`inject`、`cancel`、`whenIdle`、`runMaintenance`、`status`、`session` 和 `inbox`。若未注册 loop factory，创建或恢复会失败。`AgentHandle.dispose()` 负责卸载；caller abort 与显式 `agent.cancel()` 均不等同于直接丢弃 handle。

`Agent.send()` 启动用户工作，`followup()` 将后续用户工作入队，`steer()` 面向当前或下一步，`inject()` 添加带插件归属的上下文且不会唤醒空闲 Agent。注册按 scope 限定的 Tool 或 prompt 条目时，应使用活跃的 Agent/scope。`@deepseek-ai/dsh-scope` 提供分层 scope 与事件路由；优先使用 context 返回的清理函数，而非手动修改注册表。

`Session.append(type, data, surfaceOptions)` 是持久化权威数据的边界。它对无损 JSON 取快照，验证事件封装、序列和 surface 关系，再同步发布不可变的已接受事件。被拒绝的候选事件不会修改日志；接受后的 listener 失败会被隔离。产出消息的事件必须具有有效的 surface 操作和来源关系。应使用 `SessionStore`/persistence，不要另造日志。

新插件代码不要使用已弃用的 `Session.eventAt()`、`snapshotEvents()` 或 `ownEvents()`。通过已注册的 projection 或 `SessionQuery` 读取派生状态；持久化读取使用 Session persistence API。Fork 保留继承的前缀和 child 拥有的截断点，插件不得重写父历史。

## System prompt 组装

`SystemPrompt` 可通过 `ctx.systemPrompt` 使用。公开插件接口包括：

- `section(section: PromptSection): () => void`
- `context(context: PromptContext): () => void`
- `tools(provider: (context: AssembleContext) => ToolProviderResult): () => void`
- `variable(name: string, provider: (context: AssembleContext) => string | undefined): () => void`
- `suppressRuntimeContext(): () => void`
- `assemble(context?: AssembleContext): Promise<PromptAssembly>`

每项注册都感知 scope，并返回精确的 Cordis effect 清理函数。同名的本 scope section、context 和 variable 会覆盖更远或全局的值；名称重复不合法或顺序值非有限数会导致注册失败。prompt variable 名称须匹配 `[a-z][a-z0-9_]*`。provider 在组装期间运行，因此应保持确定性且无副作用。`suppressRuntimeContext()` 仅隐藏 prompt 中的披露内容，不会禁用服务或其约束。

各 context 包是具体的内容贡献方：agent instructions 强制字节预算并发现 scope 文件；time context 选择配置或请求指定的时区；tmux context 报告位置；file-reference-local 拥有 watcher 和搜索索引；session-reference 序列化有长度上限的被引用 Session 上下文。watcher、定时器和 provider 必须归属插件 scope，并在卸载时清理。

## Tool runtime 与定义

`ctx.tools.register(definition)` 是主要扩展接口。`ToolDefinition` 在模型 schema 基础上增加：

- 必需的 `output.schema` 和纯函数 `output.render(args, value)`；
- 仅返回规范无损 JSON 值的 `execute(args, exec): Promise<unknown>`；
- 用于可重放呈现的可选纯函数 `output.presentationMeta`、`presentCall` 和 `presentResult`；
- 可选的 `projectContent` 和覆盖全部结果的 `finalizeContent` 转换；
- 可选的协作式 `timeoutMs` 及保守判断的 `isConcurrencySafe(args)`。

`ToolRunContext` 包含不可变身份、已解析并冻结的参数、可选 agent、必需的 `signal`、`deferContext()` 和 `concludeTurn()`。将 signal 传给所有自有异步资源，并在自有工作全部停止后才结束。若未挂载 `@deepseek-ai/dsh-tool-call-timeout-policy`，`timeoutMs` 不生效。同进程工作不能被强制终止。

完整的最小 Host 插件：

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

即使没有显式保存返回的注册对象，它仍归插件 scope 所有。抛错、无效输出、渲染器失败、未知 Tool 及取消都会转换为规范化错误结果。普通 Tool 失败不会终止 turn。PTC 调用会重新进入同一策略流水线，接收规范 JSON 值，而不是渲染后的文字。`guard()` 只能累加拒绝条件；`tools/pre-execute`、`tools/execute`、`tools/post-execute` 和 `tools/result` 依次负责策略、包装、转换与观察。

执行前策略返回 `PreToolDecision`：`allow` 执行调用；`deny` 给出面向模型的原因和可选的结构化错误标识；`cancel` 选择规范取消结果；`ask` 请求审批，且仅在 `allowed-once` 后执行。ask 原因进入审计，`displayReason` 可提供本地化提示文本。执行后策略返回 `PostToolDecision`：`accept` 可替换规范 JSON `value` 或渲染后的 `content`，并添加后续上下文；`block` 以纠正性反馈替换结果。不得在策略 hook 中重写已记录的输入参数。规范化成功分支包含 `isError: false`、本次执行的 `value` 和渲染的 `content`；失败分支包含 `isError: true`、`error: { message, info? }` 和 `content`，没有成功值。结果形状见[所选公开接口](api-host-core-surface.md#hostcore-任务-api)。

## LLM provider 与 adapter

`LlmRuntime` 拥有 provider adapter 和模型目录条目。通过 `ctx.llm.registerAdapter(providers, adapter)` 为一个或多个 provider 路由注册 adapter，并保留注册 handle；重复所有权会失败，多路由注册是原子操作。`LlmAdapter.stream(options)` 是唯一抽象方法；默认的 `resolveModel` 和 `prepareCall` 实现适用于静态路由。当变化中的设置必须绑定到同一次分发时，应覆写准备逻辑。stream 须遵守请求的 `AbortSignal`，在 finish 前发出 usage，finish 后不再发出内容，并保留增量 Tool 参数的原始 JSON 字符串。不支持的选项应以稳定的 `LlmError` 失败，不能静默忽略。

仅当同一 adapter 实例拥有历史路由与目标路由，且 adapter 已验证时，才能使用 provider 原生重放状态。不得仅凭 provider/model 字符串推断重放兼容性。密钥应存于 schema/config，并可从环境变量回退，不应放在临时自定义文件中。DeepSeek、DeepSeek-account、DeepSeek-api-key 和 pi-ai 包是可挂载的第一方实现；`deepseek-llm-api-extensions` 是用于请求体字段的 scoped provider 注册表。`llm-retry` 按明确的重试策略包装失败，且必须保留取消语义。

拥有重试设置的 adapter 可将 `resolveRetryPolicy(config, diagnosticPath)` 的结果交给 `providerRetryPolicy(provider)`。该函数会验证、补默认值并独立保存 `normal`（对指定失败码进行有界重试）或 `always`（直到成功、取消或卸载才停止重试）策略；注册时会将已解析策略与路由一起捕获。可选的 retry 插件在失败步骤执行该策略。对于需要凭证的传输，先从自有配置解析密钥，再在构造 HTTP header 前调用 `assertUsableApiKey(raw, packageName, credentialRef)`。它会裁剪密钥，并对空值或不适合 header 的值抛出 `INVALID_CREDENTIAL`，且不回显密钥；仍须避免在日志和 Session 事件中记录密钥。

## Session 扩展与持久化

用 `@deepseek-ai/dsh-session-projection` 对规范 Session 事件注册纯同步 fold。仅供 Host 使用的 key 放在 `SessionProjectionStateMap` 中；Client 可见的 key 还需要 `SessionProjectionMap` 和 `wire: { viewSchema, view }`。定义必须包含 `key`、`stateSchema`、`init(header, inheritedEventCount)`、`apply(state, event)` 及非负的 `stateVersion`；对于无关事件应返回同一个状态引用。通过 `stateOf(session, key)` 读取 Host 状态；`snapshot(session, keys?)` 只包含 Client 可见的 wire 值。状态值必须可从事件日志重建。`session-projection-cache` 可为 projection 创建 checkpoint，但它不是权威数据。`session-persistence` 定义存储契约以及实时写入和关闭时的所有权；`session-persistence-jsonl` 是具有 lease 和迁移拒绝机制的第一方 backend。backend 必须在关闭前排空已接受的写入，并拒绝不兼容或损坏的记录，不得静默接受。

Session title、stats、turn-outline、token-meter、telemetry 和 log-export 包是具体的 projection/provider。只挂载所需包及其必需服务。Telemetry/OTel 涉及对外传输边界：保留脱敏和共享披露，并在关闭时 flush。历史 `session-format-vN-to-vN` 包是由目录选择的恢复迁移实现，不是新插件应使用的 API。

## Session 查询

`@deepseek-ai/dsh-session-query` 是实时和冷存储读取及搜索的新接口。它导出查询类型、cursor、冷日志读取、文本提取、文档构建、兼容 header 检查及观察能力。`session-query-sqlite` 是本地索引实现；`tool-session-query` 是模型接口；`session-log-export` 是面向 Client 的导出功能。配置时间和结果上限，遵守取消请求，并如实报告不完整或有缺口的结果，不能将其呈现为完整结果。

## 命令、审批与提问

`CommandRuntime.register(definition)` 注册 scoped `CommandDefinition`，其字段包括 `name`、`description`、可选的 `input: { hint, attachments? }`，以及 `handler(invocation: CommandInvocation): CommandResult | Promise<CommandResult>`。invocation 包含 `commandId`、接收命令的 `agent`、精确的 `rawInput`、已接收的 `attachments` 和 `signal`；`CommandExecution` 是 `CommandRuntime.execute` 的**已完成返回值**，不是 handler 参数。名称须匹配 `/^[a-z][a-z0-9_-]*$/`。普通命令结果为 `{ kind: 'success', text? }` 或 `{ kind: 'error', text }`；取消必须传播。附件回执解析属于单独的注册项，且必须验证所有权。见 `packages/interaction/commands/src/index.ts` 和 `src/types.ts`。

`ApprovalService.request({ agent, toolName, callId?, reason?, signal? })` 要求 `agent.session` 上存在 open turn；否则会在追加审计事件前抛错。slash `CommandRuntime` handler 运行时没有 open turn，因此不能直接使用此审批服务。应在绑定 turn 的 Tool 执行期间请求审批，传入 Agent、Tool 名称、call ID 和取消 signal，并且仅在 `allowed-once` 时执行动作。其他结果为 `rejected`、`cancelled` 和 `unavailable`；审计追加失败会 reject，不会返回未经审计的决策。策略 `never` 不提示即拒绝；策略 `ask` 在没有应答方时仍以拒绝为默认行为。permission preset 是面向用户的策略目录和状态层，本身没有扩大操作权限的授权能力。

`UserQuestionService.ask()`/`askTimed()` 负责持久化的待回答问题及明确的回答、超时、取消结果。`tool-ask-user` 是面向模型的 consumer。不要在 Tool 内另建待回答问题存储。

## Goal、plan 与 todo

`GoalService` 可创建、编辑、暂停、恢复、阻塞、完成和清除 Session goal，并将结果 fold 到 `GoalProjection`；Session 事件仍是权威数据。`tool-goal`、`command-goal` 和 `goal-round-driver` 分别是模型、人工命令和继续执行场景的 consumer。先挂载 service，再挂载它们，并在调用接口检查 caller 权限。

`plan-mode` 和 `tool-todo` 是 UI/模型任务状态包。`TodoItem` 包含 `content` 和 `status`；配置控制并行进行中的条目。应将其 Client 导出视为浏览器侧 projection，而不是 Host service 实现。

## 后台任务（Jobs）

`JobRegistry.start(spec: JobSpec): JobId` 要求 `kind`、`label` 及同步的 `run(job: JobHandle): JobHooks`；`owner?: SessionId` 可选，但 Session 自有 job 必须设置它。producer 在 `run` **内部**收到 `JobHandle`，并返回同步且幂等的 `cancel(reason?)`，以及清理后才结束的 `done: Promise<JobOutcome>`。`start` 返回发出的 id，而非 handle。省略 owner 会创建无主 job，在 service 卸载前对任何 caller 可见。输出可通过 `job.append()` 推送，也可从自有来源提取。`read` 消耗 cursor，并在完成后返回一次性结果；`readAt` 不改变 cursor，且会报告缺口。`wait` 仅观察完成而不取消，`kill` 请求取消，`remove` 用于删除不再需要的保留输出。应挂载具体的 `@deepseek-ai/dsh-jobs-local`；抽象 `JobRegistry` 不允许直接构造。`tool-jobs` 以有界唤醒循环向模型暴露等待、读取与终止行为。后台 job id 一经发布，由 job 所属任务的取消机制取代原始 Tool 调用 signal，成为生命周期所有者。见 `packages/jobs/jobs/src/{index,types}.ts` 与 `packages/jobs/jobs-local/src/index.ts`。

对于 `JobSpec.output`，每个 `JobOutputSource.read(fromByte)` 返回增量、非消耗式的 `{ text, nextOffset, lossy, spillPath? }`；注册表提取来源输出，并在完成前最后排空一次。`JobEvents` 观察者可用 `{ owner }`（该 Session 及无主 job）、`{ owners: 'scope' }`（组合的 owner）或 `{ owners: 'all' }` 订阅。它收到带有新 `JobView` 的生命周期事件；`settled` 还报告 `cause`（`producer`、`kill` 或 `teardown`）及等待者是否已收到完成通知。`output` 事件只包含 id、可选 owner 和新的字节总量，因此观察者应从自有 cursor 调用 `readAt`，不能假设事件本身含文本。订阅的清理函数应保留在观察方 scope 中。

## Skill

`SkillRegistry.register(skill: SkillRegistration): () => void` 添加 runtime Skill。`registerProvider(create: (control: SkillProviderControl) => SkillProvider): () => void` 在插件 apply 期间调用同步 factory；其 `control` 包含 abort `signal` 和 `invalidate()` 回调，返回值是注册清理函数。provider 自身提供 `name`、异步 `list(options)` 和 `get(candidate, options)`；发现结果可为完整 candidate 数组，或带 `complete` 状态的观察结果。远程初始化应放在 `list` 中，而非注册 factory 中。`SkillDefinition` 包含名称、描述、调用策略、provider/source/resource base 及内容。须验证名称和调用策略；不得将任意 frontmatter 视为授权。`skill-filesystem` 拥有发现根目录、watcher 及失效处理。`tool-skill` 暴露有界目录与显式调用；`tool-workspace-dependencies` 解析捆绑 runtime 路径。卸载时清理 provider watcher 和注册项。见 `packages/skill/skill/src/index.ts`。

`SkillProviderObservation` 的形状为 `{ candidates, complete }`。发现不完整时，provider 可以返回可用 candidate 并设置 `complete: false`；注册表不缓存该观察结果，`snapshot()` 报告 `complete: false`，因此 consumer 可保留上一次的有效状态并稍后重试。provider 发现过程抛错会被隔离，也会令本次目录观察结果不完整。provider 仍须遵守 caller 取消，并在自身数据变化后使注册项失效。

## 子 Agent

`SubagentRuntime.registerProvider(provider: SubagentProvider): () => void` 安装一个具名 provider。`start(name, request: SubagentStartRequest): Promise<SubagentRun>` 是一次性路径；request 必须包含 `prompt: ContentBlock[]`、精确的真实 `parent: Agent` 和 `signal`，可选的 label、Agent options、schema、深度上限、Tool 过滤器和 persona 则受 provider 声明的能力约束。返回的 run 包含 `result` 和幂等 `dispose()`；取得结果或错误后都要卸载。`list()` 返回的是 **provider 名称**，不是 child Session。持久化 child 查询使用 `listChildren(parentSessionId, signal?)` 或 `listDescendants(rootSessionId, signal?)`；可继续运行的消息投递和中断有独立的权限检查。runtime 门禁包括正且有限的深度、已配置的最大深度、最大活跃 child 数、可用 cwd、父对象所有权及 provider 能力。父对象取消、显式中断、收集、后代排空和 provider 卸载是不同的生命周期路径。

五个一次性 `SubagentCapabilities` 标志是 `agentOptions`、`outputSchema`、对应 `maxDepth` 的 `depthLimit`、`toolFilter` 和 `persona`；请求不支持的选项会在 provider 启动前失败。这些标志不代表支持继续执行：该路径需要 provider 的 `prepareContinuable` 和 continuation manager。`sendMessage(sender, targetId, content, { signal })` 只接受由精确、真实且相邻的 Agent 发出的模型内容；其 signal 仅控制 inbox 接受前的工作，接受后的投递由 child/parent 生命周期负责。`interrupt(childId, authority)` 检查人工调用的直接父 Session 地址，或精确的真实祖先 Agent，并向当前可继续的 turn 发出信号，而不卸载 child。

进程内 provider 按受控方式继承父上下文；fork-in-process 从父历史建立持久化 child Session；spawn-in-process 从空白状态开始。ACP、Codex、Claude Code 和 DSH SDK provider 负责子进程清理和停止原因映射。ACP 仅支持一次性运行；通用 runtime 支持可继续消息并不意味着 ACP 也支持。`./internal` 子路径不是受支持的插件接口。

## Workflow

`WorkflowEngine.start(request: WorkflowStartRequest): WorkflowRun` 执行 `{ script, meta: { name, description, phases? }, args?, subagentProvider?, maxTotalAgents?, parent, signal? }`。`parent` 必需；脚本只有通过已挂载的 provider 才能调用 `agent()`。`WorkflowRun` 暴露 `id`、`meta`、不会 reject 的 `result: Promise<WorkflowResult>`（`value`、`stopReason`、`error?`、`agentsStarted`）、`cancel(reason?)` 和幂等的异步 `dispose()`。`workflow-ptc` 是 runtime 实现，`tool-workflow` 是模型接口；`tool-ralph` 是有界的第一方循环。须验证元数据和 schema、明确设置 child 与结果上限、转发取消，并在所有退出路径卸载 run。

进度观察者可能收到 `workflow/start`、`workflow/phase`、`workflow/log`、`workflow/agent-start`、`workflow/agent-end` 和 `workflow/end`。最后一个事件包含 `WorkflowResultInfo`（`stopReason`、可选 `error`、`agentsStarted`），不包含脚本的可变 `value`；run 所有者只能通过等待 `run.result` 取得该值。观察到终止事件不会转移 run 或其 child 的所有权。

## 外部 hook

`@deepseek-ai/dsh-hook-protocol` 提供 `matchesMatcher`、`parseHookOutput`、`runHook`、`mergeHookOutputs`、事件追加函数、stderr 摘要及 detached run 跟踪。实际调用为 `runHook(shell, hook: { command, timeoutSec? }, options: { payload, env?, cwd?, signal, trailingNewline, defaultTimeoutMs, expectedEventName? }, now): Promise<{ output, durationMs }>`；`timeoutSec` 单位为秒，默认超时时长单位为毫秒。它通过 `ctx.shell` 执行，借助该 service 清除凭证，即使基础设施失败也会返回解析后的非阻塞结果。bridge 选择 matcher dialect、payload、环境、决策映射，以及是否在 open turn 内写入配对的 `hook/invoked`/`hook/result` 事件。非零退出码、超时、格式错误的输出及取消应分别处理。限制 stderr 长度，并在关闭时排空 detached run。Claude Code 和 Codex 包适配各自的配置与 dialect，但不会使外部配置自动可信。

## 反馈

`command-feedback` 通过 `SessionFeedbackService` 记录分类的 Session 反馈请求与结果；`message-feedback` 记录消息级反馈。须验证 Session/消息所有权，并向调用方呈现 session-not-found 等 Remote 失败。这些是反馈数据路径，不隐含遥测共享授权。

## 防护机制

`repeat-tool-reminder` 在达到配置的重复调用阈值后添加模型上下文；它用于约束循环行为，不是硬性拒绝。`tool-call-timeout-policy` 包装 Tool 分发 signal，并将自身管理的截止时间映射为 `TOOL_TIMEOUT`；Tool 仍须遵守 signal 并停止工作。按文档规定的 waterfall 组合 wrapper；已有更具体的失败结果结束后，不得将其替换。

## 可选的第一方挂载方案

以下已发布包是上述服务的具体实现选择。仅在任务需要其作用时挂载；每个配置行都有不同的配置、失败或卸载条件。

### Agent 默认设置与呈现

| 选择                          | 必需作用与边界                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dsh-agent-default-model`     | 可挂载的模型选择服务；`currentSelection()` 读取 provider、model 和 reasoning effort，`saveSelection()` 通过 config editor 持久化。选择结果与凭证或 LLM 路由是否可用是不同的状态。 |
| `dsh-agent-instructions`      | 将配置的指令文件投射到 prompt，受根目录和字节预算约束；刷新和文件 watcher 归该配置行所有，并须在卸载时停止。                                                                      |
| `dsh-agent-tool-presentation` | `mode: native \| ptc \| both` 注册 scoped `tools.presentAs`；`ptc` 和 `both` 要求激活前已有 `ptcRuntime`。呈现能力不授予执行权限。                                                |

### LLM adapter 包

| 选择                       | 必需作用与边界                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `dsh-llm-deepseek`         | 暴露 `DeepSeekAdapter` 和 `registerDeepSeekProvider`，作为 adapter/transport 基础，而不是完整的凭证 Profile。     |
| `dsh-llm-deepseek-account` | 通过 `deepseekAccount.resolveToken` 注册 `deepseek-account`；未登录或 401 无效 token 需要账号专属的恢复路径。     |
| `dsh-llm-deepseek-api-key` | 注册 `deepseek-official`，先解析 credential service，再回退到启动环境；两者均缺失时以 `MISSING_CREDENTIAL` 失败。 |
| `dsh-llm-pi-ai`            | 注册可配置 provider、discovery 和 route；配置变化时须替换整代注册，并退役旧注册。                                 |
| `dsh-llm-retry`            | 注册具有明确重试预算和取消语义的 `llmRetry` Session projection，而非 adapter 的隐式默认行为。                     |

### Session 持久化包

| 选择                            | 必需作用与边界                                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dsh-session-persistence`       | 抽象持久化服务，提供 `create`、`open`、`stat`、`list` 和 `flush`；`SessionHandle` 拥有有序的 `read`、`append`、`flush` 和 `close`。已完成的 append 在本地可见，已完成的 flush 是崩溃持久性边界。 |
| `dsh-session-persistence-jsonl` | 具体的单写者 backend；关闭时排空已接受事件，拒绝不支持的新格式和损坏的已提交前缀。                                                                                                               |
| `dsh-session-projection-cache`  | 依赖 storage domain、Session 和 projection；checkpoint/restore 可加速读取，完整日志重放仍是权威依据。                                                                                            |

### 子 Agent provider 包

| 选择                                              | 必需作用与边界                                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `dsh-subagent-spawn-in-process`                   | 注册 `spawn`，从空白状态启动 child，支持进程内启动参数覆写和 `prepareContinuable`；后续 turn 由 continuation manager 拥有。 |
| `dsh-subagent-fork-in-process`                    | 注册 `fork`，以已完成的父 turn 为初始内容，并支持 `prepareContinuable`；未完成的父工作不会继承。                            |
| `dsh-subagent-acp`                                | 需要子进程，不支持任何可选的启动能力且只支持一次性运行；须等待外部进程清理。                                                |
| `dsh-subagent-claude-code` / `dsh-subagent-codex` | 不同的外部 CLI/config provider；两者都拒绝可选启动能力，并须清理各自子进程。                                                |
| `dsh-subagent-dsh-sdk`                            | 使用独立的 child runtime；应检查其声明的模型路由、schema、深度、过滤器和 persona 能力，而非假定进程内继承。                 |

源码归属为本目标版本中对应的 `packages/core/agent-*`、`packages/context/agent-instructions`、`packages/llm/*`、`packages/session/*` 和 `packages/subagent/*` 包的 `src/index.ts` 文件。网络、外部 CLI 和持久化重启行为需要分别在真实环境中检查。

## 验证边界

对每项插件任务，都须验证：从目标 tag 解析包、Host 编译、真实 Profile 挂载、至少一组可观察的请求与结果、取消或失败，以及卸载清理。对于 `./client`、Remote/Typert、子进程、持久化重启和网络 LLM 路径，静态声明与单元测试不足以证明行为；只有运行对应端后才可作出该行为声明。
