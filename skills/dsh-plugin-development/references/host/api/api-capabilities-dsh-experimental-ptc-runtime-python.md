# @deepseek-ai/dsh-experimental-ptc-runtime-python 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

在 macOS 或 Linux 上，以全新的 CPython 3.10+ 进程运行模型生成的 Python，并遵循与 TypeScript PTC 相同的文件策略。程序可以使用顶层 `await` 和 `return`、调用已配置的 binding，并正常写入 stdout/stderr。直接文件操作遵循所选沙箱策略；资源预算和进程组拆卸约束执行。运行之间不保留状态，且没有已发布 profile 启用这个实验性 runtime。

### 使用本包

仅在显式组合中选择这个已发布的实验包。将 `PythonPtcRuntime` 与 `dsh-tools` 一起注册后，`run(resolve(request))` 会在全新的 CPython 3.10+ 子进程中执行每个程序；成功时以 `result.value` resolve，失败时以 `result.error` resolve（正交的 `PtcRunFailure.kind` 分类涵盖解析失败、抛出异常、无效完成值、输出溢出、预算到期、中止、约束不可用与执行基底终止）。仅有调用方误用会 reject，例如 binding 不合法、执行选项未解析，或在 dispose 后调用。配置在加载期拒绝：非 Unix 平台；不是可执行普通文件的显式 `pythonBin`，或无法在 `PATH` 上解析的裸名；非 CPython、低于 3.10 或探测失败的解释器；非正或非整数预算；低于截断标记下限（64）的 `maxLogBytes`；会被 `setTimeout` 截断的定时器值；超过有效 fd-3 帧上限的预算（宿主堆无法安全解析接近上限的帧时，该上限会降低）；或最坏峰值会突破 `RLIMIT_AS` 的 `addressSpaceMb`／输出预算组合。

组合必须为此本地执行宿主提供 `sandbox` 和 `sandboxPolicy`。`resolve(request)` 接受显式 `sandboxPolicy`，或解析共享部署策略，并将 `cwd` 默认设为该策略的工作区根目录。PTC mode 提供调用 Session 的策略和目录。配置的 `maxWallMs` 仍是执行截止时间；不支持显式 `timeoutMs` 覆盖。

`read-only` 和 `workspace-write` 通过配置的沙箱提供方执行；`danger-full-access` 显式绕过约束。`result.sandbox` 独立于程序结果报告模式、观察到的拒绝，以及后端的完整或部分强制能力。沙箱服务定义文件限制与后端局限；这些模式不限制网络访问或任意文件读取。

运行时声明文件约束，因此 `run_code` 暴露 `sandbox_permissions` 和 `justification`。审批只为完整程序的一次执行扩大访问权限；嵌套工具保留各自的策略与审批。程序在拒绝后绝不自动重放。消费方的升级权限指引见 PTC mode。

运行时提供以下执行指引：

#### 你得到什么

包的默认导出是 `PythonPtcRuntime` 插件。其公开面还重新导出宿主侧协议词汇：`validateChildFrame`（重建每条入站帧）、无损 JSON codec 与计量器（`encodeJsonPlain`、`checkDoneValue`、`hasUnsafeIntegerToken`、`hasNonLosslessNumber`）、`logTruncationMarker`（共享截断标记文本），以及 `resolvePythonBin`（对照当前 `PATH` 的解释器查找）、`readProcessStart`（供测试用的进程启动统计）、`detachResidual`（已结算运行的资源清理测试 seam）与 `hostFrameParseCeiling`（给定堆上限可容纳的堆推导帧解析上限）。每个上限都是带默认值并经校验的 `Config` 字段：`cpuSeconds`（60）、`maxWallMs`（600000）、`addressSpaceMb`（512，Darwin 上不生效）、`maxLogBytes`（65536）、`maxValueBytes`（32768）、`graceMs`（3000）与 `pythonBin`（`python3`，在加载期解析、检查可执行性，在五秒强制终止期限内探测版本并固定）。每个子进程只接收 `TMPDIR`；环境中的凭证、`PATH`、`HOME` 与其他宿主状态均不可见。

#### wire

#### 可能出错的地方

无法建立所需约束时返回 `sandbox-unavailable`；运行时绝不在无约束状态下重试。工作正常的沙箱拒绝某个操作时，它仍属于程序失败；当诊断与所选后端匹配时，设置 `sandbox.denied`。被程序捕获的拒绝不一定体现在这个诊断标志中。

宿主侧校验在不抛异常的情况下丢弃垃圾，因此畸形或伪造帧永远不会让宿主进程崩溃：`validateChildFrame` 对任何不能干净重建的内容返回 `undefined`，非数字的 call id 永远不会被回显进 reply，伪造的额外字段永远不会被带走。非无损 JSON 或超过配置字节预算的完成值会被显式拒绝（`non-lossless`／`over-budget`），而不是被静默取整或截断。原始长度超过有效帧解析上限（64 MiB，或当宿主的配置堆无法安全解析接近上限的帧时更低——见 `hostFrameParseCeiling`）的 fd-3 帧会让本次运行以 `worker-exit` 结算（接收路径在 `toString`/`JSON.parse` 之前限制原始帧，紧凑宽帧不能解码出远超其线上字节的宿主内存）。

-----

### 已知限制与延期工作

这些限制定义本包覆盖与不覆盖的内容；它们是当前包约束，不是任务积压。

- **跨语言 guard 覆盖执行的表面与帧字段形状，而非字段类型**——mirror e2e 比较必填／可选字段集，而非 `cpuSeconds` 在两侧是否都是 `int`；类型级漂移由评审加后端的真实子进程套件捕获。
- **以 `setsid()` 逃出子进程组后代不被组拆卸回收**——`kill(-pid)` 够不到它；运行仍按 done 帧决定的值结算，若该孤儿持有管道，close 截止兜底会强制结算，但孤儿本身在自行退出前一直存活到 fiber 之外。
- **结算后到达的 `log` 帧被丢弃**——运行一旦结算，宿主侧捕获即关闭；迟到的 fd-3 `log` 帧（来自比 done 帧存活更久的线程）会被丢弃，而不是追加到 `logs`。
- **binding 回复值没有 seam 级字节或深度上限**——`maxValueBytes` 只计量 done 帧的完成值；宽 binding 回复在宿主侧重建（`snapshotJsonValue` 遍历）并整帧编码，两侧都只受进程内存约束（与没有子进程侧预算的 binding 实参一样）。
- **已发布 profile 均不挂载本提供方**——keyless `ptc-python-turn` 快照通过真实 Loader 替换 headless PTC 运行时；已发布 profile 使用沙箱 Node 进程后端。
- **工作流执行需要 Node**——使用本 Python 提供方的组合禁用 `workflow-ptc`、`tool-workflow` 和 `tool-ralph`；工作流提供方在加载时拒绝不兼容的运行时。
- **跨通道日志交错由后端决定**——Python stdout、stderr 与 fd-3 日志帧彼此独立传输；每个通道保留自身顺序，但它们在 `result.logs` 中的总顺序可能不同。
- **需要 CPython 3.10 或更高版本**——配置的可执行文件会在加载期完成解析与版本探测；不受支持的解释器会在 `ctx.ptcRuntime` 注册前失败。
- **执行限于本地 Unix 宿主**——解释器、工作目录与沙箱 runner 必须位于运行本插件的宿主上。提供方使用 POSIX 资源限制和进程组信号；不支持 Windows 或远程执行提供方。
- **沙箱强制能力继承后端限制**——成功的程序也可能报告部分强制能力，文件约束不构成多租户隔离或完整的后代清理保证。
- **诊断前缀省略包名中的 experimental 限定词**——标记 `[dsh-ptc-runtime-python] log capture truncated at <N> bytes` 独立于 npm 包名来标识本提供方。协议镜像检查 TypeScript 与 Python 的标记字节完全相同。
- **`run()` 是一次性的**——`logs` 只有在 `PtcRunResult` resolve 后才能获得；没有为运行中程序产生的输出提供流式日志或进度接口。
- **运行之间不保留状态**——每次请求都在全新子进程中执行；持久 REPL 风格内核在某个后端带来自己的日志方案之前保持延期。
- **原始长度超过有效帧解析上限的 fd-3 帧会让本次运行以 worker-exit 结算**——上限为 64 MiB，或当宿主的配置堆无法安全解析接近上限的帧时更低（`hostFrameParseCeiling`）；`maxLogBytes`/`maxValueBytes` 在加载期被限制到同一上限，因此诚实子进程的帧总能放得下；模型构造的超过该上限的 binding 实参（一个在 seam 层没有预算的值）会触发同一上限——这是该 OOM 防护的已接受残余。
- **停止读取回复的子进程会在回复积压超过 1024 帧时以 worker-exit 结算运行**——宿主每次写一条回复，管道满时等待 `drain`；只持续发送调用而不消费回复的子进程会让保留的积压（及其钉住的 binding 结果）一直增长到墙钟，因此积压上限让运行提前失败。binding 结果在 seam 层没有字节上限，所以这是计数上限而非字节上限。
- **向永不结算的 binding 洪泛调用的子进程会在 1024 个调用在途时以 worker-exit 结算运行**——binding 调用在分发前计数、异步体结算时释放，否则 promise 永不 resolve 的 binding 会让每个调用帧累积一个异步闭包直到墙钟。与回复积压一样，这是计数上限而非字节上限。
- **组合日志与值的峰值不被加载门建模**——持续写入的模型 daemon 线程与完成值计量、分帧相加的峰值没有任何门会放行或拒绝；运行以 `worker-exit` 告终，隔离成立，只有失败分类降级。
- **CPU 信号的分类取决于 launcher**——软限制保留默认的 `SIGXCPU` 终止行为，包括执行原生调用期间。bwrap 等 launcher 可能将该信号转换为有歧义的退出码，此时报告 `worker-exit`；直接观察到的 `SIGXCPU` 则为 `timeout`。仅模型代码返回后的 CPU 检查会在终止前尝试发送 `timeout` 帧，繁忙或反压中的控制通道可能阻止该报告。内核限制与墙钟截止仍然生效。
- **1 秒双限 `ulimit -t 1` CPU 超限被报告为 `worker-exit` 而非 timeout**——当宿主在一个与软限相等的硬 CPU 限下启动且该限为 1 时，`_clamped` 无法下调软限，内核在同一 tick SIGKILL 忙循环，SIGXCPU 永远不会送达；隔离成立，只有分类降级。
- **中间 binding 值没有字节上限**——实现仍受无损 JSON 序列化成本与进程内存约束，提供方或执行器可能应用自己的获取上限。

## BootMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface BootMessage {
    type: 'boot';
    cpuSeconds: number;
    addressSpaceBytes: number;
    maxLogBytes: number;
    maxValueBytes: number;
    namespaces: Namespace[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`BootMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`addressSpaceBytes`、`cpuSeconds`、`maxLogBytes`、`maxValueBytes`、`namespaces`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## ChildToHost（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ChildToHost = BootAckMessage | CallMessage | LogMessage | DoneMessage;
```

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`ChildToHost`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`type`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    cpuSeconds?: number;
    maxWallMs?: number;
    addressSpaceMb?: number;
    maxLogBytes?: number;
    maxValueBytes?: number;
    graceMs?: number;
    pythonBin?: string;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## PythonPtcRuntime（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`PythonPtcRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class PythonPtcRuntime extends PtcRuntime {
    static inject: string[];
    static Config: z<Config>;
    readonly language = "python";
    readonly isolation = "process";
    get sandboxMode(): SandboxMode;
    get executionInstructions(): string;
    constructor(ctx: Context, config: Config);
    resolve(request: PtcRunRequest): PtcRunSpec;
    run(request: PtcRunSpec): Promise<PtcRunResult>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## ReplyMessage（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ReplyMessage = ReplyOk | ReplyErr;
```

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`ReplyMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`id`、`ok`、`type`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## checkDoneValue（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`checkDoneValue`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function checkDoneValue(value: unknown, maxBytes: number): {
    ok: true;
    bytes: number;
} | {
    ok: false;
    reason: 'over-budget' | 'non-lossless';
};
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## detachResidual（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`detachResidual`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function detachResidual(residual: Buffer): Buffer[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## encodeJsonPlain（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`encodeJsonPlain`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function encodeJsonPlain(value: unknown): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## hasNonLosslessNumber（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`hasNonLosslessNumber`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function hasNonLosslessNumber(value: unknown): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## hasUnsafeIntegerToken（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`hasUnsafeIntegerToken`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function hasUnsafeIntegerToken(line: string): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## hostFrameParseCeiling（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`hostFrameParseCeiling`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function hostFrameParseCeiling(heapLimit?: number): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## logTruncationMarker（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`logTruncationMarker`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function logTruncationMarker(maxBytes: number): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## readProcessStart（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`readProcessStart`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function readProcessStart(pid: number): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## resolvePythonBin（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`resolvePythonBin`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolvePythonBin(bin: string): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## validateChildFrame（.）

公开导入：`@deepseek-ai/dsh-experimental-ptc-runtime-python`；公开符号：`validateChildFrame`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function validateChildFrame(raw: unknown): ChildToHost | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-ptc-runtime-python.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
