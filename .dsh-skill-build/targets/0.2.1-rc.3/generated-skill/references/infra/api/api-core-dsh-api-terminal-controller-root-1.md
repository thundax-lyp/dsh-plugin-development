# @deepseek-ai/dsh-api-terminal-controller .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-terminal-controller 选型与组合](api-core-dsh-api-terminal-controller-root-overview.md)。

从 Web 侧栏在 Session 当前工作目录打开执行环境的默认 shell。重新连接已有进程，并关闭 provider 管理的完整进程范围。终端输出不进入 Agent 对话记录。保留终端会占用进程和有界屏幕缓存。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    readonly shell?: {
        path: string;
        name: string;
        args: string[];
    } | undefined;
    readonly shellCandidates: string[];
    readonly maxTerminals: number;
    readonly maxCols: number;
    readonly maxRows: number;
    readonly scrollback: number;
    readonly maxBufferedBytes: number;
    readonly maxInputBytes: number;
    readonly disposeGraceMs: number;
    readonly unattendedTimeoutMs: number;
    readonly activityPollIntervalMs: number;
    readonly cleanupRetryMs: number;
}
```

成员检索：`activityPollIntervalMs`、`cleanupRetryMs`、`disposeGraceMs`、`maxBufferedBytes`、`maxCols`、`maxInputBytes`、`maxRows`、`maxTerminals`、`scrollback`、`shell`、`shellCandidates`、`unattendedTimeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalController 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class TerminalController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    environment(agent: Agent, signal: AbortSignal): TerminalEnvironment;
    shells(agent: Agent, signal: AbortSignal): Promise<TerminalShell[]>;
    list(sessionId: SessionId): WebTerminalInfo[];
    create(agent: Agent, request: TerminalCreateRequest, signal: AbortSignal): Promise<WebTerminalInfo>;
    retain(sessionId: SessionId, id: WebTerminalId, signal: AbortSignal): AsyncIterable<TerminalRetentionFrame>;
    attach(agent: Agent, id: WebTerminalId, signal: AbortSignal): RemoteStream<TerminalFrame, TerminalInput>;
    rename(agent: Agent, id: WebTerminalId, title: string): void;
    close(agent: Agent, id: WebTerminalId): Promise<void>;
}
```

成员检索：`attach`、`close`、`create`、`environment`、`list`、`rename`、`retain`、`shells`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalCreateRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalCreateRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalCreateRequest {
    readonly shellPath?: string;
    readonly id: WebTerminalId;
    readonly cols: number;
    readonly rows: number;
}
```

成员检索：`cols`、`id`、`rows`、`shellPath`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalEnvironment 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalEnvironment`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalEnvironment {
    readonly cwd: string;
    readonly maxInputBytes: number;
    readonly maxBufferedBytes: number;
    readonly maxCols: number;
    readonly maxRows: number;
    readonly scrollback: number;
}
```

成员检索：`cwd`、`maxBufferedBytes`、`maxCols`、`maxInputBytes`、`maxRows`、`scrollback`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TerminalFrame = {
    readonly type: 'snapshot';
    readonly sequence: number;
    readonly screen: string;
    readonly info: WebTerminalInfo;
    readonly writable: boolean;
    readonly inputWindow?: RemoteUplinkWindow;
} | {
    readonly type: 'output';
    readonly sequence: number;
    readonly data: string;
} | {
    readonly type: 'state';
    readonly info: WebTerminalInfo;
    readonly writable: boolean;
} | {
    readonly type: 'ack';
    readonly sequence: number;
    readonly refusal?: 'read-only' | 'not-running';
};
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalInput 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalInput`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TerminalInput = {
    readonly type: 'write';
    readonly sequence: number;
    readonly data: string;
} | {
    readonly type: 'resize';
    readonly sequence: number;
    readonly cols: number;
    readonly rows: number;
};
```

成员检索：`sequence`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalRetentionFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalRetentionFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalRetentionFrame {
    readonly type: 'retained';
}
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalShell 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller`；公开符号：`TerminalShell`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalShell {
    readonly path: string;
    readonly args: readonly string[];
    readonly name: string;
}
```

成员检索：`args`、`name`、`path`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
