# @deepseek-ai/dsh-subagent 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-subagent` 通过具名提供方委派工作，并收集受管理 activation 的结果。本地 spawn 和 fork 子级保留持久会话以接受后续消息；ACP、DSH SDK、Codex 与 Claude Code 执行一次。所有子级共享准入、取消、所有权与发现机制。使用时组合服务、提供方和委派工具。

### 使用本包

每次启动可传入可选的 `cwd`；相对路径以父级当前工作目录解析，省略时捕获该当前目录。子级保留父级的起始目录元数据与权限根目录。子级自己的目录值位于继承历史之后，在继续与重启后保留，并独立于父级之后的目录变化。

本包是每个委派组合都共享的约定。你通过把服务与一个或多个提供方后端以及面向模型的委派工具一起挂载来启用它；此后 agent 即可委派工作，服务会把每个请求路由到具名提供方。

#### 启用委派

挂载服务、提供方与委派工具。提供方按配置名称注册，每个工具行选择一个提供方。最小配置如下：

```yaml
- name: '@deepseek-ai/dsh-subagent'
- name: '@deepseek-ai/dsh-subagent-spawn-in-process'
- name: '@deepseek-ai/dsh-tool-subagent'
  config:
    provider: spawn
    toolName: subagent
```

工具立即返回子会话 ID，后台 activation 结算后父级收到完成通知。仅挂载服务本身不会启用委派。

#### 委派设置

**插件 → 子智能体**页面的限制部分编辑 Host 的 `subagent` 设置分节。用户值覆盖本插件的组合配置；恢复默认会删除用户覆盖。`maxDepth` 默认为 `1`，在委派工具自身未配置深度时提供默认值。工具显式指定的深度（包括 `provider-managed`）优先。深度 `0` 禁止继承此设置的工具委派；深度 `1` 只允许直接子代理。修改在下一次委派时生效。直接调用服务的调用方仍自行提供可选的请求深度。

#### Activation 容量

在 Host 插件上设置 `maxActiveSubagents`，限制每棵 activation 树中在线和正在创建的子级数量。默认值为 `8`，接受正安全整数。顶层父级建立由本地和外部后代共享的池，根父级不占名额。新建和冷恢复在让出执行前预留名额，资源释放完成后才归还。等待后代、有待处理收件箱内容以及正在停止的 activation 仍计入容量；向驻留子级发送消息复用其名额。委派深度是独立策略。

每次新建或冷恢复 Activation 前都会读取当前 `maxActiveSubagents`。调高后已有树可接纳更多子代理；调低后驻留子代理继续运行，使用量降至上限以下前拒绝新接纳。

容量耗尽时，新建或冷恢复以 `ACTIVATION_LIMIT_REACHED` 拒绝（浏览器消息返回 `subagent/delivery-unavailable`）：等待子代理完成，或继续使用现有代理。接纳不会排队，避免等待后代的父代理又等待自己占用的名额。名额仅存在于当前进程，不限制累计 Session 历史或 token 用量。

#### 本地与外部子级

`startActivation({ provider, label, request, signal, delivery })` 返回 `{ childId, messageId?, result, dispose }`。提供 `childId` 会选择本地后端，并保证返回 `messageId`。本地子级接受后续消息并支持冷恢复；外部子级只暴露一次执行，拒绝继续输入。`request.agentOptions` 覆盖后端支持的子级模型设置。`delivery: 'parent'` 提供面向模型的完成通知；`delivery: 'caller'` 让工作流等待结果，不发送父级通知，也不附加初始返回指导。本地父级投递需要持久化，调用方投递可以使用临时本地会话；冷恢复需要持久化与 Session 查询服务。

#### 子级 preset

进程内 spawn 接受独立的 `agentPreset`；fork 与外部后端拒绝此选项。省略选择时，本地子级加入父方当前的 preset 代际。显式 id 挂载当前可用代际，即使该 id 与父方相同。通过 `dsh-tool-subagent` 配置模型可选项，并在 preset 组装中配置 persona 与工具。冷恢复保留历史子级 descriptor 记录的 persona 和工具限制。

#### 消息、中断与发现

每个确切在线 Agent 都可以对直接可继续 child 使用 `sendMessage()`；驻留的可继续 child 还可以对自己的直接 parent 使用它。正在工作的目标通过 Steer 在最近 step 接收 Agent 消息；空闲目标启动轮次，且只有直接 child 可以冷恢复。parent 也可以随时中断正在运行的后代或列举自己的子级。浏览器发出的继续执行 prompt 会独立选择 Queue 或 Steer，并且可以携带图片部分：Host 先通过附件存储完成整批图片的准入与持久化，子级 inbox 才接受这条消息；当子级声明的模型不接受图片输入时拒绝投递。 直接子级发现读取 parent 自有的 `subagentCatalog` projection。`listChildren(parentSessionId, signal?)` 持有一次优先实时来源的 Session 观察，异步返回目录，不读取子级日志。它转发取消信号，并在物化后释放观察。物化以 O(D) 时间保留 D 条事实的父日志事件顺序。外部条目是叶节点，不需要观察子 Session。后代发现按父事件顺序递归读取子级目录，每个可达 Session 观察一次。无法读取目录的分支会被跳过，并返回诊断；两条路径都不加载或恢复子级 Agent。

#### 失败与恢复

缺少 `agents` 服务时，启动请求以 `CONTINUATION_UNAVAILABLE` 拒绝；运行时可用但父级缺失或被替换时，以 `UNAUTHORIZED` 拒绝。未实现任何执行方法的提供方会在注册时以 `UNSUPPORTED_CAPABILITY` 被拒绝；请求不受支持的能力会以同一码使创建失败。调用方信号仅取消尚未发布的工作；发布后通过 `dispose()` 取消该次 activation，并等待其后代（包括正在启动的后代）及其资源清理完成。`result` 在清理与通知结束后完成，携带输出、可选结构化数据与停止原因；结果捕获故障在清理后使其拒绝。清理失败使 `dispose()` 拒绝，并将生命周期结束事件标记为失败；结果 promise 与父级通知保留已捕获的执行结果。

-----

### 已知限制与延期工作

这些限制说明该 seam 何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是通用委派对比或任务积压。

- **后代读取串行执行**——每个可达目录（包括一次性子级）都需要一次观察。冷 Session 缺少有效的 prepared 观察时需要读取完整日志；大型冷会话树可能累积存储延迟。
- **外部子级执行一次**——ACP、DSH SDK、Codex 与 Claude Code 没有本地子 Session，也不接受后续输入。释放后仍可发现父级拥有的执行记录。
- **仅允许相邻模型消息**——`sendMessage()` 要求确切在线 sender；每个 sender 都可以指定直接可继续 child，只有具备驻留可继续 Activation 的 sender 可以指定自己的直接 parent。浏览器提示使用独立的人类 Queue 或 Steer 控制路径。
- **child 到 parent 的投递要求直接 parent 保持在线**——服务没有持久 parent mailbox；parent 缺失时会拒绝消息，而非接受无法唤醒的工作。
- **取消收敛期间存在唤醒缺口**——中断信号发出后、Agent 进入 idle 前被接受的后续消息会保持排队，直到另一条唤醒发送到达。
- **待处理的注入上下文会保留 Activation**——settlement 会保守地把每个 Inbox occurrence 都视为未完成。Agent 进入 idle 后停放的上下文会让 child 及其在线祖先继续驻留，直到唤醒投递将其 claim、queue 变更将其移除，或 manager teardown 将其丢弃。宿主完成检查等待活动工作、待创建子级与资源清理，但不会等待仅包含空闲停放 Inbox 的子树；它既不结算这些 activation 的结果，也不丢弃其消息。
- **驻留仅限进程内**——Activation inbox 与所有权图不会在两个 harness 进程之间协调；对单个持久化存储的并发访问需要持久化邮箱与跨进程租约协议。
- **不回放已接受但未记录的消息**——崩溃可能丢失从未写入子会话日志、已被接受的提示词；丢失的消息不会自动回放。
- **没有持久化 parent mailbox**——child 到 parent 的消息要求驻留的可继续 child 与在线直接 parent，提供的是接受标识，不保证恰好一次投递。
- **生命周期事件只供观察**——影响运行的 `subagent/end` 延续或决策接口仍需等待具体消费方。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    maxActiveSubagents: Volatile<number>;
    maxDepth: Volatile<number>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentRuntime（.）

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class SubagentRuntime extends TypertRemoteService {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        maxDepth: z<number, number, "volatile-defined">;
        maxActiveSubagents: z<number, number, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        maxDepth: z<number, number, "volatile-defined">;
        maxActiveSubagents: z<number, number, "volatile-defined">;
    }>>, "plain">;
    static inject: string[];
    constructor(ctx: Context, config: Config);
    resolveMaxDepth(configured?: number | 'provider-managed'): number | undefined;
    startActivation(spec: SubagentActivationSpec & {
        readonly childId: SessionId;
    }): Promise<SubagentActivation & {
        readonly messageId: MessageId;
    }>;
    startActivation(spec: SubagentActivationSpec): Promise<SubagentActivation>;
    waitForChildren(parent: Agent): Promise<boolean>;
    sendMessage(sender: Agent, targetId: SessionId, content: ContentBlock[], options: SubagentSendMessageOptions): Promise<MessageId>;
    interrupt(targetSessionId: SessionId, authority: SubagentInterruptAuthority): void;
    drainDescendants(parents: readonly Agent[]): Promise<void>;
    drainChildren(parent: Agent, childIds: readonly SessionId[]): Promise<void>;
    listChildren(parentSessionId: SessionId, signal?: AbortSignal): Promise<SubagentCatalogEntry[]>;
    listDescendants(rootSessionId: SessionId, signal?: AbortSignal): Promise<SubagentDescendantListEntry[]>;
    prompt(request: SubagentPromptRequest, signal: AbortSignal): Promise<SubagentPromptReceipt>;
    interruptByParent(childSessionId: SessionId, parentSessionId: SessionId, mode: 'continuable'): SubagentInterruptReceipt;
    registerProvider(provider: SubagentProvider): () => void;
    getProvider(name: string): SubagentProvider | undefined;
    list(): string[];
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

### 子任务的权限与所有权

`SubagentRuntime` 注册 provider；具体 provider 决定 fresh/fork、可继续或外部一次性执行的能力。不要把所有后端都视为可发消息的本地 Agent。可继续启动依赖持久化和运行时服务；缺失时公开操作拒绝，而非创建一个假 child。

`startActivation` 的启动过程归调用方取消控制；接受后的子级执行、最终结果投递和清理归 runtime。外部后端只有一次性结果，不支持继续消息；关闭须等待 backend handle 的 `dispose()` 完成。父级等待与取消不能把仍在清理的资源视为已结束。

子级继承委派时捕获的 sandbox 策略并固定 approval 为 never，不能让子级通过父级的应答者升级权限。独立 preset 选择与继承 preset 不同；同 ID 的显式选择也可能取得不同 generation。跨重启通过 Session 描述恢复，不序列化活 Agent 对象。

`sendMessage` 按真实 sender 和 target 身份执行，附件先被准入为持久引用。`interruptByParent` 要核对直接父子关系；`drainChildren` 与 `drainDescendants` 服务于 owner 的卸载，须等待停止完成。`listChildren` 从持久目录读取；外部子级是叶节点，不应尝试打开不存在的子 Session。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

相关对象：[continuation-messages](api-capabilities-dsh-subagent-continuation-messages.md)。

相关对象：[assistant-output](api-capabilities-dsh-subagent-assistant-output.md)。

相关对象：[child-agent](api-capabilities-dsh-subagent-child-agent.md)。

相关对象：[types](api-capabilities-dsh-subagent-types.md)。

相关对象：[descriptor](api-capabilities-dsh-subagent-descriptor.md)。

相关对象：[out-of-process](api-capabilities-dsh-subagent-out-of-process.md)。

相关对象：[structured](api-capabilities-dsh-subagent-structured.md)。

相关对象：[control-types](api-capabilities-dsh-subagent-control-types.md)。

相关对象：[projection-types](api-capabilities-dsh-subagent-projection-types.md)。

相关对象：[list-children](api-capabilities-dsh-subagent-list-children.md)。

相关对象：[error](api-capabilities-dsh-subagent-error.md)。

相关对象：[depth](api-capabilities-dsh-subagent-depth.md)。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    subagents: SubagentRuntime;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `subagents` | `subagents: SubagentRuntime` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'subagent/provider-added'(provider: SubagentProvider): void;
    'subagent/provider-removed'(name: string): void;
    'subagent/start'(this: Scoped<SubagentRuntime>, info: SubagentRunInfo): void;
    'subagent/end'(this: Scoped<SubagentRuntime>, info: SubagentRunEndInfo): void;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `subagent/provider-added` | `'subagent/provider-added'(provider: SubagentProvider): void` |
| `subagent/provider-removed` | `'subagent/provider-removed'(name: string): void` |
| `subagent/start` | `'subagent/start'(this: Scoped<SubagentRuntime>, info: SubagentRunInfo): void` |
| `subagent/end` | `'subagent/end'(this: Scoped<SubagentRuntime>, info: SubagentRunEndInfo): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
