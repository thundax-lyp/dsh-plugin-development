# Subagent Provider 与委派服务（Host）

## 适用范围与入口

在 `dsh-v0.2.0-rc.1` 中，`@deepseek-ai/dsh-subagent` 的根导出提供 `SubagentRuntime`、`SubagentProvider`、请求、结果和生命周期类型。Cordis 声明合并把服务挂在 Host `ctx.subagents`。插件作者可注册自有命名 Provider，也可让插件调用已装载的 Provider；模型可见的委派工具由另一个包 `@deepseek-ai/dsh-tool-subagent` 装载。服务本身不会自动为所有 Provider 注册模型工具。

`ctx.subagents` 先于 Provider 与工具装载。基础 bundle 已装载 `spawn` 与 `fork` Provider 及对应工具，但其他 Profile 或自定义树必须检查实际组合。ACP 进程 Provider 的特有配置见 [ACP 委派后端](api-subagent-acp.md)；Profile 装载步骤见 [配置 ACP 委派](how-to-configure-acp-delegation.md)。

## 契约与运行语义

以下流程分别说明 Provider 注册、单次运行以及可续行任务的资源所有权。

### 注册和启动

- `ctx.subagents.registerProvider(provider: SubagentProvider): () => void`：在当前 Cordis effect 中按唯一 `provider.name` 注册。返回 disposer；插件 fiber 卸载会清理注册。名称冲突抛 `SubagentError` 的 `DUPLICATE_PROVIDER`。移除后拒绝新 start，已交给调用者的 run 仍由调用者持有。
- `ctx.subagents.getProvider(name): SubagentProvider | undefined` 与 `list(): string[]`：只查询当前注册表，`list()` 按插入顺序。它们不证明某个模型工具已装载。
- `ctx.subagents.start(name, request): Promise<SubagentRun>`：先检查 Provider 是否存在、请求能力、非负安全整数 `maxDepth` 和对象根 JSON Schema，然后调用 Provider。Provider 的 `start()` 承诺只在孩子已发布后 fulfill；发布前失败由 Provider 清理并 reject。成功返回后调用者必须处理 `run.result`，并在 `finally` 调 `run.dispose()`。非正常子任务通常由 `result.stopReason` 表示，基础设施故障才可能使 `result` reject。
- `ctx.subagents.startContinuable(spec): Promise<ContinuableStart>`：要求 Provider 有 `prepareContinuable`；服务负责身份、Agent、收件箱和后续恢复。fulfill 表示初始 prompt 已被 inbox 接收，不能解释为子任务已完成。此路径还要求 `agents` 服务可用，容量受 `maxActiveSubagents` 控制。

### 消息、发现和生命周期

- `sendMessage(sender, targetId, content, { signal }): Promise<MessageId>` 只接受精确活跃 `Agent` 作为发送者，并验证直接父子关系；可唤起闲置孩子或从持久化恢复非驻留的直接 continuable 孩子。信号只拥有接收前的取消。返回值是 inbox 接收 id，不是回答。
- `interrupt(targetSessionId, authority): void` 对活跃 continuable 孩子发取消信号并立即返回，不等待静止。`authority` 是 `{ kind: 'ancestor', agent }` 或 `{ kind: 'user', parentSessionId }`；非授权抛 `UNAUTHORIZED`，缺席目标是无操作。
- `listChildren(parentSessionId, signal?)` 读直接孩子目录；`listDescendants(rootSessionId, signal?)` 递归读目录并返回分支诊断。两者读取持久 Session 视图，不启动 Agent；需要 Session 查询与投影组合。
- `subagent/provider-added`、`subagent/provider-removed` 是注册表通知。`subagent/start` 与 `subagent/end` 按 `runId` 配对并以委派父 Agent 为 scope；事件是观察信号，持久孩子目录或 Session 才是恢复依据。

### Provider 作者必须履行的所有权

`SubagentProvider.start(request: ResolvedSubagentStartRequest)` 可并发调用。Provider 在 promise fulfill 前拥有所有未发布资源，失败或取消时须回滚到静止；fulfill 后将一个 `SubagentRun` 的结果、取消和异步释放责任交给调用者。`request.signal` 是发布前后相同的取消通道。Provider 自己处理 `request.descriptor` 的持久记录；只有返回 `localAgent` 的运行，服务才在父 Session 目录建立孩子记录。进程 Provider 若无本地 Agent，就不能借此承诺可恢复孩子目录。

`prepareContinuable?(request): Promise<ContinuableCreateSpec>` 只能返回可分离的创建数据（可选 `seed`），不接触后续 Agent 句柄、turn 或 teardown。是否实现该方法本身就是 continuable 能力。自定义 Provider 的完整可编译骨架仍需单独验证；本页暂不把内部 driver 的 `src/*` 导出当作外部包模板。

## 对象类型与成员

| 对象或字段                               | 精确公开形状与含义                                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SubagentProvider.name`                  | `string`；注册表唯一名称，由实现者提供。                                                                                                                                                                                                                                                              |
| `SubagentProvider.capabilities`          | `SubagentCapabilities`；必有 `agentOptions`、`outputSchema`、`depthLimit`、`toolFilter`、`persona` 五个 boolean，均为 **one-shot start** 能力。服务对请求的每项可选能力做拒绝式检查。                                                                                                                 |
| `SubagentProvider.inheritsParentContext` | `boolean`；描述是否继承父 Session 已完成轮次的上下文，供模型工具文案使用；不代表权限或工具继承。                                                                                                                                                                                                      |
| `SubagentProvider.agentRouteDefaults`    | 可选 `{ provider: string; model: string }`，仅当支持 `agentOptions` 时使用。                                                                                                                                                                                                                          |
| `SubagentProvider.start`                 | `(request: ResolvedSubagentStartRequest) => Promise<SubagentRun>`；发布边界与清理责任见上节。                                                                                                                                                                                                         |
| `SubagentProvider.prepareContinuable`    | 可选 `(request: ContinuableCreateRequest) => Promise<ContinuableCreateSpec>`；`seed?: readonly SessionEvent[]` 必须是从 seq 0 开始、可重放且轮次平衡的前缀。                                                                                                                                          |
| `SubagentStartRequest`                   | `prompt: ContentBlock[]`、`parent: Agent`、`signal: AbortSignal` 必填；`label?: string`、`agentOptions?: AgentOptions`、`outputSchema?: ObjectJsonSchema`、`maxDepth?: number`、`toolFilter?: ToolRestriction`、`persona?: string` 可选。`ResolvedSubagentStartRequest` 另有服务产生的 `descriptor`。 |
| `SubagentRun`                            | `id: SessionId`、`localAgent: Agent \| undefined`、`result: Promise<SubagentResult>`、`dispose(): Promise<void>`；调用方拥有幂等释放。                                                                                                                                                                |
| `SubagentResult`                         | `output: readonly ContentBlock[]`；可选 `structured?: unknown` 和 `diagnostic?: string`；`stopReason` 至少涵盖 `completed`、`aborted`、`error`、`max-tokens`、`refusal`，联合可由其他后端扩展。只有 `completed` 表示子任务正常结束。                                                                  |
| `ContinuableStartSpec`                   | `provider`、`label`、去掉 `label/signal/outputSchema` 的 `request`、`signal` 必填，`childId?: SessionId` 可选。返回的 `childId` 和 `messageId` 均为已接收身份。                                                                                                                                       |

`SubagentRunInfo` 和 `SubagentRunEndInfo` 均有 `runId`、`provider`、`id`、`local`；`end` 另有 `stopReason` 和可选 `lastAssistantMessage`。`runId` 是一次运行或一次活跃 epoch 的配对键，不应用 `id` 推断只会启动一次。

`SubagentRuntime` 的调用面包括 `registerProvider`/`getProvider`/`list`、`start`/`startContinuable`、`sendMessage`/`interrupt`、`listChildren`/`listDescendants`、`drainContinuableChildren`/`drainContinuableDescendants`。`prompt` 是 run 内用户输入的服务方法；消息收据不等于子任务结果。各组权限、持久目录与停止边界见上节。

## 生命周期与状态

自有 Provider 的注册 effect 属于插件 fiber；卸载清理注册，但不能替持有者 dispose 已发布 run。one-shot 是一次结果和一次释放；continuable 是服务管理的持久身份与收件箱，Provider 只贡献初次创建数据。`drainContinuableChildren` 与 `drainContinuableDescendants` 是 Host teardown 原语，只有拥有准确父 Agent/孩子关系的宿主使用；结束后仍需检查 Session 日志与目录才能重建模型可见事实。

## 失败、权限与边界

缺失 Provider、重复名称、无能力、无 `agents` continuation 组合以及不合法 depth/schema 都会在服务边界拒绝。`sendMessage` 检查邻接，`interrupt` 检查祖先或父地址；不能把这两个控制操作暴露为无鉴权的普通 Remote。模型侧的 `send_message`/`interrupt_agent` 仅在另行挂载 `@deepseek-ai/dsh-tool-subagent-control` 时可见。外部 ACP 协议约束不由本服务自动满足。

## 验证

在精确版本声明中编译自有 Provider，启动真实 Profile 检查注册、一次成功 run、失败前回滚、发布后取消与卸载。若使用 continuable，还需验证冷恢复、收件箱接收和容量拒绝。本次专题只完成源码审查；自定义 Provider 的独立消费包和完整生命周期测试尚未运行，不能据此称可直接发布。
