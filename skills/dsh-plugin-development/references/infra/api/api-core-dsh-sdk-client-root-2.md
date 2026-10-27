# @deepseek-ai/dsh-sdk-client .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-sdk-client 选型与组合](api-core-dsh-sdk-client-root-overview.md)。

`dsh-sdk-client` 让 TypeScript 程序通过 stdio JSON-RPC 启动并驱动完整的 DeepSeek Harness 运行时。使用 `DeepSeekHarness` 可打开会话、发送文本或图像提示词、收集事件与通知流，并在运行时进入 idle 后取得最后提交的助手响应；使用 `HarnessClient` 可直接发送协议请求和订阅通知。调用方可以提供 `dshBin`；否则客户端解析同版本的 `@deepseek-ai/dsh` 可执行文件。客户端跨多次运行持有子进程，公开类型化的传输与协议错误，并在 `close()` 或 `await using` 时回收进程。它适用于调用方能够选择运行时 profile 和启动设置的场景。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## NotificationFilter 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`NotificationFilter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type NotificationFilter = (notification: HarnessNotification) => boolean;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## NotificationSubscription 公开契约

订阅owner可await next、tryNext非阻塞取出排队项，或异步迭代。session tree过滤在客户端跟随subagent.started血缘；不代表服务器只发送该树的通知。任务完成后释放订阅，close终止进程并结束所有接收等待。

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`NotificationSubscription`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface NotificationSubscription extends AsyncIterable<HarnessNotification> {
    next(): Promise<HarnessNotification>;
    tryNext(): HarnessNotification | undefined;
    close(): void;
}
```

成员检索：`close`、`next`、`tryNext`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## RequestTimeoutError 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`RequestTimeoutError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RequestTimeoutError extends Error {
    constructor(message: string);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## RunOptions 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`RunOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RunOptions {
    sessionId?: string;
    onNotification?: (notification: HarnessNotification) => void;
}
```

成员检索：`onNotification`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## RunResult 公开契约

sessionId是保存后续继续或恢复用的身份；finalResponse是活动区间最后提交根助手文本；events与notifications保留观察证据。steering或其他工作可在idle前加入，因此结果不承诺只对应某条prompt。没有finalResponse也不能直接判定进程或持久化失败，应结合事件和协议结果。

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`RunResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RunResult {
    sessionId: string;
    finalResponse: string;
    events: SessionEvent[];
    notifications: HarnessNotification[];
}
```

成员检索：`events`、`finalResponse`、`notifications`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SdkPromptContentBlock 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`SdkPromptContentBlock`。

公开声明签名：

```text
export type SdkPromptContentBlock = ContentBlock | SdkEncodedImageBlock;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SdkProtocolError 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`SdkProtocolError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SdkProtocolError extends Error {
    constructor(message: string);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## TransportClosedError 公开契约

导入入口：`@deepseek-ai/dsh-sdk-client`；公开符号：`TransportClosedError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class TransportClosedError extends Error {
    constructor(message: string);
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。
