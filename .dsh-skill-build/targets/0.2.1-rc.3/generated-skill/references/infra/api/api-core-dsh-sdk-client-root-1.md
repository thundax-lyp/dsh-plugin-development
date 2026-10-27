# @deepseek-ai/dsh-sdk-client .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-sdk-client 选型与组合](api-core-dsh-sdk-client-root-overview.md)。

`dsh-sdk-client` 让 TypeScript 程序通过 stdio JSON-RPC 启动并驱动完整的 DeepSeek Harness 运行时。使用 `DeepSeekHarness` 可打开会话、发送文本或图像提示词、收集事件与通知流，并在运行时进入 idle 后取得最后提交的助手响应；使用 `HarnessClient` 可直接发送协议请求和订阅通知。调用方可以提供 `dshBin`；否则客户端解析同版本的 `@deepseek-ai/dsh` 可执行文件。客户端跨多次运行持有子进程，公开类型化的传输与协议错误，并在 `close()` 或 `await using` 时回收进程。它适用于调用方能够选择运行时 profile 和启动设置的场景。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ContentBlock 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`ContentBlock`。

公开声明签名：

```text
export type ContentBlock = ContentBlockMap[ContentBlockType];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## DeepSeekHarness 公开契约

SDK高层owner，首次使用惰性spawn且在多次run间持有子进程。run等待prompt的durable入队回执并收集到首次Agent idle，finalResponse是该活动区间最后提交根助手文本；不是单prompt因果保证。resumeSession从持久home恢复，session(id)仅当前进程懒句柄。close/await using回收进程；初始化与清理均失败保留AggregateError，不在退出未知时另开运行时。

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`DeepSeekHarness`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class DeepSeekHarness implements AsyncDisposable {
    constructor(options?: DeepSeekHarnessOptions);
    get client(): HarnessClient;
    start(): Promise<void>;
    session(sessionId?: string): HarnessSession;
    resumeSession(sessionId: string): Promise<HarnessSession>;
    run(input: string | SdkPromptContentBlock[], options?: RunOptions): Promise<RunResult>;
    close(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
}
```

成员检索：`client`、`close`、`resumeSession`、`run`、`session`、`start`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## DeepSeekHarnessOptions 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`DeepSeekHarnessOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface DeepSeekHarnessOptions extends HarnessClientOptions {
    cwd?: string;
    provider?: string;
    model?: string;
    reasoningEffort?: ReasoningEffortId;
    maxTokens?: number;
}
```

成员检索：`cwd`、`disposeEofGraceMs`、`disposeGraceMs`、`dshBin`、`dshHome`、`env`、`initializeTimeoutMs`、`maxTokens`、`model`、`patches`、`processCwd`、`profile`、`provider`、`reasoningEffort`、`requestTimeoutMs`、`shutdownTimeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## HarnessClient 公开契约

低层JSON-RPC进程owner：start/initialize/prompt/request/close与通知订阅。prompt仅确认入队message id，不等任务完成；完整任务可先订阅再prompt并请求session/wait。Options.env给定时整体替换子进程环境。close先有界shutdown，再EOF→SIGTERM→SIGKILL，必须等真实退出，关闭后不能复用。

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`HarnessClient`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class HarnessClient {
    readonly options: HarnessClientOptions;
    constructor(options?: HarnessClientOptions);
    start(): void;
    initialize(params: InitializeParams): Promise<InitializeResult>;
    prompt(sessionId: string, contentBlocks: SdkPromptContentBlock[]): Promise<string>;
    resumeSession(sessionId: string): Promise<void>;
    getWorkingDirectory(sessionId: string): Promise<string>;
    setWorkingDirectory(sessionId: string, path: string): Promise<string>;
    request(method: string, params?: object, timeoutMs?: number): Promise<unknown>;
    subscribe(filter?: NotificationFilter): NotificationSubscription;
    subscribeSessionTree(sessionId: string): NotificationSubscription;
    close(): Promise<void>;
}
```

成员检索：`close`、`getWorkingDirectory`、`initialize`、`options`、`prompt`、`request`、`resumeSession`、`setWorkingDirectory`、`start`、`subscribe`、`subscribeSessionTree`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## HarnessClientOptions 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`HarnessClientOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface HarnessClientOptions {
    dshBin?: string;
    profile?: string;
    patches?: string[];
    dshHome?: string;
    processCwd?: string;
    env?: NodeJS.ProcessEnv;
    initializeTimeoutMs?: number;
    requestTimeoutMs?: number;
    shutdownTimeoutMs?: number;
    disposeEofGraceMs?: number;
    disposeGraceMs?: number;
}
```

成员检索：`disposeEofGraceMs`、`disposeGraceMs`、`dshBin`、`dshHome`、`env`、`initializeTimeoutMs`、`patches`、`processCwd`、`profile`、`requestTimeoutMs`、`shutdownTimeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## HarnessNotification 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`HarnessNotification`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface HarnessNotification {
    method: string;
    params: Record<string, unknown>;
}
```

成员检索：`method`、`params`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## HarnessSession 公开契约

绑定SessionId的高层句柄；run的活动区间终点是首次idle，get/setWorkingDirectory读写有效目录并可创建未知Session但不启动模型轮次。相对目录按Session当前目录解析，不修改已启动外部进程、权限或最初cwd元数据。恢复既有持久会话应调用harness.resumeSession，而不是把session(id)当成磁盘加载。

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`HarnessSession`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class HarnessSession {
    readonly harness: DeepSeekHarness;
    readonly id: string;
    constructor(harness: DeepSeekHarness, id: string);
    getWorkingDirectory(): Promise<string>;
    setWorkingDirectory(path: string): Promise<string>;
    run(input: string | SdkPromptContentBlock[], options?: Pick<RunOptions, 'onNotification'>): Promise<RunResult>;
}
```

成员检索：`getWorkingDirectory`、`harness`、`id`、`run`、`setWorkingDirectory`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## JsonRpcResponseError 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`JsonRpcResponseError`。

公开声明签名：

```text
export declare class JsonRpcResponseError extends Error {
    readonly code: number | undefined;
    readonly data?: unknown | undefined;
    constructor(code: number | undefined, message: string, data?: unknown | undefined);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。
