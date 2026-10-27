# @deepseek-ai/dsh-sdk-protocol .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-sdk-protocol 选型与组合](api-core-dsh-sdk-protocol-root-overview.md)。

`dsh-sdk-protocol` 让 DeepSeek Harness 运行时与其 SDK 客户端通过按换行分帧的字节流交换 JSON-RPC 2.0 消息：一个传输类，加上协议两端共同使用的具名请求、结果与通知类型。服务端是 `dsh-sdk-jsonrpc-server` 插件；客户端是 TypeScript 的 `dsh-sdk-client` 与 Python SDK（后者复现这些结构但不导入它们）。当你实现或调试协议某一端时使用本包：分帧规则、方法名、载荷类型与错误语义都在这里。它是纯库——无插件、无配置、无注册。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SdkPromptContentBlock 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SdkPromptContentBlock`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SdkPromptContentBlock = ContentBlock | SdkEncodedImageBlock;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SdkRunStatus 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SdkRunStatus`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SdkRunStatus = 'ok' | 'error';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SessionEventNotification 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SessionEventNotification`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionEventNotification {
    sessionId: string;
    event: SessionEvent;
}
```

成员检索：`event`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SessionPromptParams 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SessionPromptParams`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPromptParams {
    sessionId: string;
    contentBlocks: SdkPromptContentBlock[];
}
```

成员检索：`contentBlocks`、`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SessionPromptResult 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SessionPromptResult`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionPromptResult {
    messageId: string;
}
```

成员检索：`messageId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SessionResumeParams 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SessionResumeParams`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionResumeParams {
    sessionId: string;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SessionStatusNotification 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SessionStatusNotification`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionStatusNotification {
    sessionId: string;
    status: 'idle' | 'running';
}
```

成员检索：`sessionId`、`status`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## SessionWaitParams 公开契约

导入入口：`@deepseek-ai/dsh-sdk-protocol`；公开符号：`SessionWaitParams`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionWaitParams {
    sessionId: string;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。
