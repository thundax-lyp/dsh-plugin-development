# @deepseek-ai/dsh-api-terminal-controller ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-terminal-controller 选型与组合](api-core-dsh-api-terminal-controller-client-overview.md)。

从 Web 侧栏在 Session 当前工作目录打开执行环境的默认 shell。重新连接已有进程，并关闭 provider 管理的完整进程范围。终端输出不进入 Agent 对话记录。保留终端会占用进程和有界屏幕缓存。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ClientTerminals 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`ClientTerminals`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ClientTerminals extends Service {
    readonly closeFailures: SnapshotStore<readonly TerminalCloseFailure[]>;
    constructor(ctx: Context, remote: TerminalRemote);
    view(sessionId: SessionId, key: string, contentId: string, terminalId?: WebTerminalId, shellPath?: string): TerminalView;
    launchShells(sessionId: SessionId, signal: AbortSignal): Promise<TerminalLaunchShells>;
    selectShell(path: string): void;
    close(sessionId: SessionId, key: string, contentId: string, terminalId?: WebTerminalId): void;
    retainTabs(tabs: readonly {
        sessionId: SessionId;
        tabId: string;
        contentId: string;
    }[]): void;
    recover(sessionId: SessionId, refresh?: boolean): Promise<WebTerminalInfo[]>;
    retryClose(id: WebTerminalId): void;
}
```

成员检索：`close`、`closeFailures`、`launchShells`、`recover`、`retainTabs`、`retryClose`、`selectShell`、`view`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalCloseFailure 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalCloseFailure`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalCloseFailure {
    readonly id: WebTerminalId;
    readonly title: string;
    readonly message: string;
}
```

成员检索：`id`、`message`、`title`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalLaunchShells 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalLaunchShells`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalLaunchShells {
    readonly shells: readonly TerminalShell[];
    readonly selectedShell: string | undefined;
}
```

成员检索：`selectedShell`、`shells`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalRemote 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalRemote`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TerminalRemote = ClientRemote['terminal'];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalRenderFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalRenderFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalRenderFrame {
    readonly revision: number;
    readonly frame: Extract<TerminalFrame, {
        type: 'snapshot' | 'output';
    }>;
}
```

成员检索：`frame`、`revision`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalView 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class TerminalView {
    readonly id: WebTerminalId;
    readonly state: SnapshotStore<TerminalViewState>;
    constructor(sessionId: SessionId, remote: TerminalRemote, gateway: Pick<ClientRemote, '$stream'>, inventory: TerminalInventory, id: WebTerminalId, createWhenMissing?: boolean, shellPath?: string | undefined, retain?: ((signal: AbortSignal) => Promise<void>) | undefined);
    mount(): () => void;
    refresh(): Promise<void>;
    connect(): void;
    acknowledge(revision: number): void;
    write(data: string): void;
    resize(cols: number, rows: number): void;
    rename(title: string): Promise<void>;
    close(): Promise<void>;
    dispose(): Promise<void>;
}
```

成员检索：`acknowledge`、`close`、`connect`、`dispose`、`id`、`mount`、`refresh`、`rename`、`resize`、`state`、`write`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalViewIssue 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalViewIssue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type TerminalViewIssue = 'missingTerminal' | 'inputFull' | 'attachmentEnded' | 'invalidOutput' | 'terminalLimit';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TerminalViewState 公开契约

导入入口：`@deepseek-ai/dsh-api-terminal-controller/client`；公开符号：`TerminalViewState`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TerminalViewState {
    readonly phase: 'idle' | 'loading' | 'creating' | 'connecting' | 'connected' | 'disconnected' | 'closing' | 'closed' | 'failed';
    readonly environment?: TerminalEnvironment | undefined;
    readonly title?: string | undefined;
    readonly info?: WebTerminalInfo | undefined;
    readonly writable: boolean;
    readonly render?: TerminalRenderFrame | undefined;
    readonly error?: string | undefined;
    readonly issue?: TerminalViewIssue | undefined;
}
```

成员检索：`environment`、`error`、`info`、`issue`、`phase`、`render`、`title`、`writable`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
