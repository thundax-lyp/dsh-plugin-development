# @deepseek-ai/dsh-sdk-jsonrpc-server .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-sdk-jsonrpc-server 选型与组合](api-core-dsh-sdk-jsonrpc-server-root-overview.md)。

`dsh-sdk-jsonrpc-server` 通过 stdio 服务 SDK 协议格式（wire format），使进程外客户端能够驱动 harness agent（智能体）：它为每个 `sessionId` 打开一个会话、把用户提示词排入队列，并把每个会话事件与 agent 状态转换流式发回客户端。把它作为 `jsonrpc` 插件挂载到 Loader 组合中；外围插件树提供其余一切——agent、模型适配器、持久化与工具。Stdout 只承载 JSON-RPC 帧，因此部署不得组合 stdout logger。它通过 dispose（资源释放）根运行时并以 0 退出应答 `shutdown`；EOF 与信号退出归 app bin 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const Config: Schema<JsonRpcConfig>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## HarnessSdkJsonRpcServer 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`HarnessSdkJsonRpcServer`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class HarnessSdkJsonRpcServer {
    constructor(ctx: Context, transport: JsonRpcTransportPeer, options?: HarnessSdkJsonRpcServerOptions);
    initialize(params: InitializeParams): Promise<InitializeResult>;
    prompt(params: SessionPromptParams): Promise<SessionPromptResult>;
    resume(params: SessionResumeParams): Promise<Record<string, never>>;
    wait(params: SessionWaitParams): Promise<Record<string, never>>;
    getWorkingDirectory(params: SessionWorkingDirectoryParams): Promise<SessionWorkingDirectoryResult>;
    setWorkingDirectory(params: SessionWorkingDirectorySetParams): Promise<SessionWorkingDirectoryResult>;
    shutdown(): Promise<Record<string, never>>;
    handleRequest(method: string, params: Record<string, unknown> | undefined): Promise<unknown>;
}
```

成员检索：`getWorkingDirectory`、`handleRequest`、`initialize`、`prompt`、`resume`、`setWorkingDirectory`、`shutdown`、`wait`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## HarnessSdkJsonRpcServerOptions 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`HarnessSdkJsonRpcServerOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface HarnessSdkJsonRpcServerOptions {
    maxTokensAsSuccess?: boolean;
}
```

成员检索：`maxTokensAsSuccess`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## JsonRpcConfig 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`JsonRpcConfig`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface JsonRpcConfig {
    maxTokensAsSuccess?: boolean;
    input?: Readable;
    output?: Writable;
    exit?: (code: number) => void;
}
```

成员检索：`exit`、`input`、`maxTokensAsSuccess`、`output`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context, config: JsonRpcConfig): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-sdk-jsonrpc-server`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "sdk-jsonrpc-server";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程)。
