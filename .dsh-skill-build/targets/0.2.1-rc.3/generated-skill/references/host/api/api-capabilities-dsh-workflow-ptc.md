# @deepseek-ai/dsh-workflow-ptc 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

在全新 Node 进程中按调用 Session 的文件沙箱策略运行 JavaScript 工作流。脚本保留 `agent()`、`parallel()`、`pipeline()`、`phase()` 和 `log()` 钩子，委派的工作由 subagent 完成。同一个执行提供方服务 PTC 与工作流，包括需显式启用的 Ralph 循环。运行没有整体经过时间截止；取消会停止受管进程并释放子 agent。所选沙箱与子进程提供方决定强制能力和清理限制。

### 使用本包

在提供 subagent、沙箱策略和 Node PTC 运行时的组合中挂载本引擎。它为 `dsh-tool-workflow` 及显式启用时的 `dsh-tool-ralph` 提供工作流执行。Ralph 在已发布默认组合中保持禁用。引擎在加载时拒绝非 TypeScript 的 PTC 提供方。Python PTC 组合必须禁用 `workflow-ptc`、`tool-workflow` 以及任何已启用的 `tool-ralph` 条目。

#### 最小配置

上述依赖可用后，挂载引擎及其面向模型的消费方：

```yaml
- name: '@deepseek-ai/dsh-workflow-ptc'
- name: '@deepseek-ai/dsh-tool-workflow'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `provider` | `spawn` | `agent()` 调用使用的宿主侧 subagent 提供方。 |
| `maxConcurrentAgents` | `0` | 并发 `agent()` 上限；`0` 根据可用 CPU 并行度解析。 |
| `maxTotalAgents` | `1000` | 一次运行最多启动的 `agent()` 调用数。 |
| `maxItemsPerCall` | `4096` | 一次 `parallel()` 或 `pipeline()` 调用接受的条目数。 |
| `syncTimeoutMs` | `5000` | 脚本最初同步片段的 VM 超时时间，单位为毫秒。 |

Node PTC 提供方的 `maxPendingCalls` 也限制工作流并发：子 agent 启动、结果等待与资源释放会占用这些名额。进度批次至多再占用一个名额。设置 `maxConcurrentAgents` 时应预留余量。

#### 结果与失败

脚本支持顶层 `await`；`meta` 和 `args` 作为 JSON 数据传入。每次 `agent()` 调用都会在本次运行的固定父 agent 下启动受管理的 subagent Activation，并等待其文本或结构化结果。工作流记录自己的成员并收集其结果，不向父级子代理目录添加条目，也不向父模型发送子 agent 结算通知。最终的无损 JSON 返回值成为运行结果；普通子 agent 失败使 `agent()` 以 `null` 兑现。

无效元数据、无法解析的正文、不可用的提供方路由或高于上限的单次运行上限，在运行发布前被拒绝。执行期间，钩子误用与超出协作式上限会使工作流失败。进程失败、所需约束不可用，以及超出 PTC 输出或控制限制也会使运行失败。

#### 文件策略与取消

引擎分别捕获调用 Session 的有效工作目录与常设文件策略。父级之后切换目录时，PTC 进程及该工作流随后启动的每个子级都保留捕获的目录。不支持文件约束的运行时只允许用于 `danger-full-access`；`read-only` 和 `workspace-write` 在执行前失败。Node 内存保留模式在临时环境中执行异步包装函数，因此工作流局部变量不会进入 Agent 保留的 REPL。VM 保留文档说明的辅助 API，但它不是安全边界：触达 Node 的代码遵循所选运行时的文件策略。程序可见的环境为空。文件策略不限制网络访问。

工作流向 PTC 请求 `timeoutMs: null`。最初的 VM 片段仍受 `syncTimeoutMs` 限制，调用方的中止信号仍然生效，包括外层工具的截止。取消立即中止 PTC 进程及待启动或活跃的 subagent。调用方必须释放每次运行并等待子 agent 清理；不另设工作流清理定时器。

-----

### 已知限制与延期工作

这些限制界定工作流执行与清理。

- **文件约束与清理继承提供方限制**——Node PTC 与子进程提供方定义强制能力完整度和受管进程范围。
- **工作流上限是协作式的**——辅助函数计数器限制普通脚本；它们不是 Host 强制的安全配额或后代 token 预算。
- **没有整体经过时间截止**——运行可以持续到完成、失败或取消。调用方截止仍然适用。
- **子 agent 清理遵循提供方约定**——适配器等待资源释放与待完成启动，不另设放弃等待的定时器。
- **VM 不是安全边界**——不提供的全局变量用于指导脚本作者；OS 策略约束触达 Node 的代码。
- **跨 realm 错误在脚本内无法通过 `instanceof Error`**——根据 `name` 与 `code` 等稳定字段分支。

## ChildHandle（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ChildHandle {
    readonly id: string;
    readonly result: Promise<ChildResult>;
    dispose(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`ChildHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`dispose`、`id`、`result`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## ChildPort（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ChildPort {
    startAgent(request: ChildStartRequest): Promise<ChildHandle>;
}
```

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`ChildPort`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`startAgent`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## ChildResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ChildResult {
    output: ContentBlock[];
    structured?: unknown;
    stopReason: string;
}
```

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`ChildResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`output`、`stopReason`、`structured`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## ChildStartRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ChildStartRequest {
    prompt: string;
    schema?: ObjectJsonSchema;
    provider?: string;
    model?: string;
}
```

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`ChildStartRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`model`、`prompt`、`provider`、`schema`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    provider?: string;
    maxConcurrentAgents?: number;
    maxTotalAgents?: number;
    maxItemsPerCall?: number;
    syncTimeoutMs?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## MaterializeError（.）

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`MaterializeError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class MaterializeError extends Error {
    readonly path: string;
    readonly reason: string;
    constructor(path: string, reason: string);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## WorkerInit（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkerInit {
    meta: WorkflowMeta;
    body: string;
    args?: unknown;
    limits: WorkerLimits;
}
```

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`WorkerInit`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`args`、`body`、`limits`、`meta`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## WorkerLimits（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkerLimits {
    maxConcurrentAgents: number;
    maxTotalAgents: number;
    maxItemsPerCall: number;
    syncTimeoutMs: number;
}
```

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`WorkerLimits`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxConcurrentAgents`、`maxItemsPerCall`、`maxTotalAgents`、`syncTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## default（.）

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`default`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
declare class PtcWorkflowEngine extends WorkflowEngine {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    start(request: WorkflowStartRequest): WorkflowRun;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## materializeFromRealm（.）

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`materializeFromRealm`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function materializeFromRealm(value: unknown, root?: string): unknown;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## validateMeta（.）

公开导入：`@deepseek-ai/dsh-workflow-ptc`；公开符号：`validateMeta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function validateMeta(value: unknown): WorkflowMeta;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow-ptc.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
