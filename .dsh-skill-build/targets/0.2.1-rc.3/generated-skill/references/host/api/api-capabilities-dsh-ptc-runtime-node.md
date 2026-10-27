# @deepseek-ai/dsh-ptc-runtime-node 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

执行模型编写的 TypeScript，并提供宿主异步函数。默认的 `per-call` 模式每次启动新 Node 进程，使用与 Bash 相同的平台沙箱策略。显式启用的 `persistent-in-memory` 模式为每个 Agent 跨调用保留受限 REPL。两种模式都返回捕获的日志、精确 JSON 值或结构化失败。直接 Node API 受所选模式的限制。执行时限、输出上限和 V8 堆上限约束运行；取消与逐次执行完成后清理托管进程范围。请求受限模式而沙箱后端不可用时，执行失败。

### 使用本包

在提供 `fs`、`subprocess`、`sandbox` 和 `sandboxPolicy` 的组合中挂载本提供方。`dsh-tools` 的 PTC 模式传入调用 Session 的目录和常设策略；直接运行时消费方在执行前解析这些选项。

#### 配置

在所需服务可用后，配置提供方条目：

```yaml
- name: '@deepseek-ai/dsh-ptc-runtime-node'
  config:
    executionMode: per-call
    timeoutMs: 120000
    maxTimeoutMs: 600000
    maxOutputBytes: 67108864
    maxOldGenerationSizeMb: 512
    maxMessageBytes: 134217728
    maxPendingCalls: 128
    graceMs: 3000
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `executionMode` | `per-call` | `per-call` 每次按文件策略启动新进程；`persistent-in-memory` 为每个所有者保留受限 REPL |
| `timeoutMs` | `120,000` | 默认经过时间截止，包括嵌套工具与审批等待 |
| `maxTimeoutMs` | `600,000` | 解析器应用的经过时间截止上限 |
| `maxOutputBytes` | `67,108,864` | 序列化日志与完成值或诊断的合计预算 |
| `maxOldGenerationSizeMb` | `512` | V8 老生代堆上限，单位 MiB |
| `maxMessageBytes` | `134,217,728` | 控制帧、未完成参数字节和排队控制写入的上限 |
| `maxPendingCalls` | `128` | 同时进行的 Host 绑定调用数量上限 |
| `graceMs` | `3,000` | 受管终止与输出排空宽限时间 |
| `launch` | 本地载体 | 子进程环境中显式的 `{ kind: "node-script", executable, bootstrapPath? }` 或 `{ kind: "embedded", executable }` |

配置目录定义可接受的配置字段。`resolve(request)` 将 cwd 默认设为沙箱策略的工作区根目录，并补全数值或 null 截止选择与执行策略；`run(spec)` 接受这些已解析输入，不补缺省值。

#### 执行与结果

`per-call` 模式中的程序是异步函数体：支持顶层 `await` 与 `return`，且只接受可擦除 TypeScript。成功调用以 `result.value` 返回无损 JSON 值，以 `result.logs` 返回捕获文本。`result.sandbox` 独立于程序结果报告所选模式、观察到的拒绝，以及后端完整或部分的强制能力。

直接文件系统、网络与子进程操作仍是 Node 操作，受所选 OS 沙箱约束。嵌套 Host 绑定通过控制通道调用；PTC 工具调用保留注册表的可见性、排序、日志和审批规则。运行程序不会改变 Session 的常设策略，也不会在拒绝后自动重放程序。

#### 内存保留模式

在现有 `@deepseek-ai/dsh-ptc-runtime-node` 插件上设置 `executionMode: persistent-in-memory` 即可保留状态。两种模式都需要 `fs`、`subprocess`、`sandbox` 和 `sandboxPolicy`；两种模式都应用所选文件沙箱策略。通过配置档补丁显式启用：

```yaml
- id: ptc-runtime
  config:
    executionMode: persistent-in-memory
```

保存补丁，在使用 PTC 工具展示的配置中通过 `dsh headless --patch <path>` 加载。默认的 `per-call` 模式不跨调用保留程序内存。修改配置会重载提供方并释放其执行资源。单文件打包宿主使用内存保留模式时，需要使用 `node-script` 启动方式，将 `launch.executable` 指向 Node，并将 `launch.bootstrapPath` 指向本包构建出的 `persistent-process.js`。

每个存活 Agent 保留独立进程，跨 `run_code` 调用和轮次保留顶层变量、函数及导入模块。使用 `await import(...)`、`console.log(...)` 和末尾 JSON 表达式；不支持顶层 `return`。Node REPL 使用非严格模式，给未声明的名称赋值会创建保留的全局变量。`_` 和 `_error` 是普通的保留全局变量，不使用交互式 REPL 的结果设置器。声明遵循 Node REPL 规则，包括重复声明已有 `let`、`const` 或 `class` 名称时报错；应给可变绑定赋值或选择新名称。开头的 `{ ... }` 按语句块执行，可以包含顶层 await 和临时声明；需要返回对象表达式时，用圆括号包裹。保留的函数和工具方法引用调用当前执行的绑定。必须等待所有工具调用；已完成执行的回调不能在后续执行中调用工具。

内存按尽力保留处理，不保存到磁盘。重启、Agent 销毁、提供方卸载、取消、超时、协议失败、输出超限或进程退出都会清除内存。缺失变量产生普通引用错误，模型需要重新获取句柄和创建声明。当前执行中的异常只结算一次，并保留此前发生的修改。已完成执行的回调抛出的异常不会在后续结果中报告；结束执行前应等待异步工作完成。Session 仍记录程序、工具分派和可见结果；恢复 Session 或派生 Agent 时从空内存开始。每次执行都会将进程工作目录重置为本次解析的 cwd；程序中的 `process.chdir()` 不跨执行保留。直接 Node 访问遵循已解析的文件策略。保留状态的所有者必须先释放环境，才能更改权限模式、工作区根目录或 Session 身份。

服务消费者通过 `stateOwner` 对象复用环境，并在结束时等待 `release(owner)`。没有所有者的请求在临时进程中执行。权限设置同步记录新模式。Session 模式变化时，运行时立即禁止复用受影响的进程并开始取消，包括空闲环境。下一次程序执行前等待这些进程清理；清理失败会阻止本次程序启动，并允许重试。权限设置成功时，旧进程可能仍在停止过程中。单次获准的提权使用独立环境，返回前等待清理；该次执行无法访问原环境的变量，也不会保留新声明。执行及必要清理完成之前，同一所有者的并发调用会被拒绝；不同所有者可以并发。空闲环境没有过期计时器，进程保留到释放或失败为止。原始 stdout/stderr 不携带执行标识：执行期间收到的字节计入本次输出预算，包括较早启动的子进程此时写出的内容；空闲期间丢弃 stdout，只保留限额内的 stderr 诊断尾部。结束本次执行前，应等待子进程完成。进程退出诊断包含退出码和保留的 stderr 尾部；空闲期间的失败写入宿主日志。清理期间无法观测进程范围时，释放所有者会重试终止；清理成功前拒绝新执行。确认进程退出后仍未排空的管道会产生诊断，但不阻止释放环境。

#### 截止时间与取消

对于携带 Session 策略的调用，模式变化会取消其准入，即使调用仍在等待清理或进程启动。恢复先前的模式不会重新启用已取消的调用。

PTC 消费方按 dsh-tools 的说明公开逐次超时与经审批的沙箱选择。运行时只读 `timeout` 描述符向该消费方报告有效默认值与上限。提供方通过 `executionInstructions` 负责求值语法、输出方式和状态保留指引。工具消费者将对应模式的规则附加到面向模型的 schema，不根据 `programFormat` 推断是否保留状态。

省略 `timeoutMs` 使用配置的经过时间默认值；数值请求经过验证并封顶。服务调用方可以显式传入 `timeoutMs: null` 来省略经过时间定时器，工作流适配器即如此；`run_code` 仍只接受正数覆盖值。启用的截止覆盖运行时准备和执行，包括等待嵌套工具或审批的时间。它不是 CPU 计量器。超时或取消通过 Host 的受管进程所有者停止同步循环；逐次执行成功完成也会清理该受管范围。选择结果后、清理前停止计时器，因此调用可能要在执行截止之后等待清理结算才返回。

#### 失败

程序解析错误与抛出异常为 `exception`；截止到期为 `timeout`；取消为 `abort`；畸形或超量控制通信为 `protocol`；约束不可用为 `sandbox-unavailable`；进程提前退出或受管清理失败为 `worker-exit`。进程提供方保留与执行基底无关的失败名 `worker-exit`。有损完成值为 `invalid-output`，外层结果超限为 `output-limit`，并保留能容纳的日志前缀。无效或不支持的选项，以及资源释放后的调用，以调用方误用拒绝。

-----

### 已知限制与延后工作

这些限制界定执行保证与保留的输出。

- **约束继承所选后端的限制**——完整与部分强制能力分开报告；沙箱策略与受管进程约束是不同保证。
- **堆上限不是进程树内存限制**——原生分配与后代进程内存不属于 V8 老生代上限。不提供进程树 CPU 计量器。
- **清理继承子进程的可观测范围**——使用 fallback 的平台上，逃逸的后代可能仍在受管范围之外；参见子进程提供方声明的限制。
- **默认执行是一次性的**：保留状态需要设置 `executionMode: persistent-in-memory`；两种模式都不提供 yield/wait API。
- **内存保留环境为每个存活所有者保留一个进程**——空闲所有者保留进程及堆内存，直到显式释放、所有者销毁或执行失败。并行创建多个所有者会保留多个进程；空闲过期机制留待后续处理。
- **输出上限拒绝超量内容，而不保留每个字节**——溢出只能保存本提供方交付的有界结果。
- **绑定在传输接纳时受限**——控制限制不约束 Host 绑定生成结果期间分配的内存。
- **console shim 有五个方法**——`log`、`info`、`warn`、`error` 与 `debug`。

## Config（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime-node`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    launch?: LaunchConfig;
    executionMode?: 'per-call' | 'persistent-in-memory';
    timeoutMs?: number;
    maxTimeoutMs?: number;
    maxOutputBytes?: number;
    maxOldGenerationSizeMb?: number;
    maxMessageBytes?: number;
    maxPendingCalls?: number;
    graceMs?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime-node.md)。

## LaunchConfig（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type LaunchConfig = {
    kind: 'node-script';
    executable: string;
    bootstrapPath?: string;
} | {
    kind: 'embedded';
    executable: string;
};
```

公开导入：`@deepseek-ai/dsh-ptc-runtime-node`；公开符号：`LaunchConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`executable`、`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime-node.md)。

## NodePtcRuntime（.）

公开导入：`@deepseek-ai/dsh-ptc-runtime-node`；公开符号：`NodePtcRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class NodePtcRuntime extends PtcRuntime {
    static inject: string[];
    static Config: import("@deepseek-ai/schemastery").default<Config>;
    readonly language = "typescript";
    readonly isolation = "process";
    get programFormat(): 'function-body' | 'repl';
    get executionInstructions(): string;
    constructor(ctx: Context, config: Config);
    get sandboxMode(): SandboxMode | undefined;
    release(owner: object): Promise<void>;
    get timeout(): {
        defaultMs: number;
        maxMs: number;
    };
    resolve(request: PtcRunRequest): PtcRunSpec;
    run(spec: PtcRunSpec): Promise<PtcRunResult>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-ptc-runtime-node.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
