# @deepseek-ai/dsh-terminal：持久终端后端与会话

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在持久终端后端与会话任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[持久终端后端与会话](api-runtime-terminal-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-terminal.md)。

## TerminalBackend 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalBackend`。`TerminalBackend` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalBackend {
    readonly type: string;
    spawn(spec: TerminalBackendSpawnSpec): Promise<TerminalBackendSession>;
}
```

成员检索：`spawn`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalBackendCleanupError 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalBackendCleanupError`。`TerminalBackendCleanupError` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class TerminalBackendCleanupError extends AggregateError {
    readonly spawnError: unknown;
    readonly cleanupError: unknown;
    constructor(spawnError: unknown, cleanupError: unknown);
}
```

成员检索：`cleanupError`、`spawnError`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalBackendSession 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalBackendSession`。`TerminalBackendSession` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalBackendSession {
    readonly motd: string;
    readonly pid?: number;
    startSend(request: TerminalSendRequest): TerminalSendOperation;
    read(request: TerminalReadRequest): TerminalReadResult;
    signal(signal: TerminalSignal): Promise<TerminalSignalResult>;
    status(): TerminalSessionStatus;
    close(reason: string): Promise<void>;
}
```

成员检索：`close`、`motd`、`pid`、`read`、`signal`、`startSend`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalBackendSpawnSpec 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalBackendSpawnSpec`。`TerminalBackendSpawnSpec` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalBackendSpawnSpec extends TerminalSpawnRequest {
    sessionId: TerminalSessionIdValue;
    owner: Agent;
    signal?: AbortSignal;
}
```

成员检索：`cwd`、`name`、`owner`、`sessionId`、`signal`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalError 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalError`。`TerminalError` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class TerminalError extends Error {
    readonly code: TerminalErrorCode;
    constructor(message: string, code: TerminalErrorCode);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalErrorCode 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalErrorCode`。`TerminalErrorCode` 是持久终端后端与会话的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type TerminalErrorCode = 'DUPLICATE_BACKEND' | 'DUPLICATE_NAME' | 'FOREIGN_SESSION' | 'NO_BACKEND' | 'NO_SESSION' | 'OWNER_NOT_LIVE' | 'SEND_ACTIVE' | 'SERVICE_DISPOSING';
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalReadRequest 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalReadRequest`。`TerminalReadRequest` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalReadRequest {
    offset?: number;
    count?: number;
}
```

成员检索：`count`、`offset`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalReadResult 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalReadResult`。`TerminalReadResult` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalReadResult {
    text: string;
    totalLines: number;
    lineBegin: number;
    lineEnd: number;
    truncated: boolean;
}
```

成员检索：`lineBegin`、`lineEnd`、`text`、`totalLines`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSendOperation 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSendOperation`。`TerminalSendOperation` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSendOperation {
    done: Promise<TerminalSendResult>;
    readOutput(): TerminalSendRead;
    cancel(): boolean;
}
```

成员检索：`cancel`、`done`、`readOutput`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSendRead 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSendRead`。`TerminalSendRead` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSendRead {
    delta: string;
    truncated: boolean;
}
```

成员检索：`delta`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSendRequest 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSendRequest`。`TerminalSendRequest` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSendRequest {
    text: string;
    submit: boolean;
    signal?: AbortSignal;
}
```

成员检索：`signal`、`submit`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSendResult 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSendResult`。`TerminalSendResult` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSendResult {
    viewport: string;
    waitReason: TerminalWaitReason;
    sessionStatus: TerminalSessionStatus;
    truncated: boolean;
}
```

成员检索：`sessionStatus`、`truncated`、`viewport`、`waitReason`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSessionId 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSessionId`。`TerminalSessionId` 是持久终端后端与会话的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function TerminalSessionId(value: string): TerminalSessionId;

export type TerminalSessionId = TerminalSessionIdValue;
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSessionService 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSessionService`。ctx.terminals 精确绑定 Agent 对象且会话名在 owner 内唯一；未发布 spawn 也计为 owner activity。send 同步抢占单次活动发送，清理失败保留 tracked activity 并报告。

```text
export declare class TerminalSessionService extends Service {
    constructor(ctx: Context);
    registerBackend(backend: TerminalBackend): () => void;
    listBackends(): string[];
    spawn(owner: Agent, request: TerminalSpawnRequest, signal?: AbortSignal): Promise<TerminalSpawnResult>;
    hasOwnerActivity(owner: Agent): boolean;
    startSend(owner: Agent, id: TerminalSessionId, request: TerminalSendRequest): TerminalSendOperation;
    read(owner: Agent, id: TerminalSessionId, request?: TerminalReadRequest): TerminalReadResult;
    signal(owner: Agent, id: TerminalSessionId, signal: TerminalSignal): Promise<TerminalSignalResult>;
    kill(owner: Agent, id: TerminalSessionId, reason?: string): Promise<boolean>;
    list(owner: Agent): TerminalSessionSnapshot[];
}
```

成员检索：`hasOwnerActivity`、`kill`、`list`、`listBackends`、`read`、`registerBackend`、`signal`、`spawn`、`startSend`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSessionSnapshot 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSessionSnapshot`。`TerminalSessionSnapshot` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSessionSnapshot {
    sessionId: TerminalSessionIdValue;
    name?: string;
    type: string;
    pid?: number;
    status: TerminalSessionStatus;
}
```

成员检索：`name`、`pid`、`sessionId`、`status`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSessionStatus 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSessionStatus`。`TerminalSessionStatus` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type TerminalSessionStatus = {
    kind: 'running';
} | {
    kind: 'exited';
    exitCode: number | null;
    signal: NodeJS.Signals | null;
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSignal 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSignal`。`TerminalSignal` 是持久终端后端与会话的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type TerminalSignal = 'SIGINT' | 'SIGTERM' | 'SIGKILL' | 'SIGTSTP' | 'SIGHUP';
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSignalResult 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSignalResult`。`TerminalSignalResult` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSignalResult {
    delivered: true;
    targetPgid: number;
}
```

成员检索：`delivered`、`targetPgid`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSpawnRequest 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSpawnRequest`。`TerminalSpawnRequest` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSpawnRequest {
    type: string;
    name?: string;
    cwd?: string;
}
```

成员检索：`cwd`、`name`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalSpawnResult 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalSpawnResult`。`TerminalSpawnResult` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TerminalSpawnResult extends TerminalSessionSnapshot {
    motd: string;
}
```

成员检索：`motd`、`name`、`pid`、`sessionId`、`status`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalWaitReason 契约

从 `@deepseek-ai/dsh-terminal` 导入 `TerminalWaitReason`。`TerminalWaitReason` 是持久终端后端与会话的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type TerminalWaitReason = 'stdin_read' | 'inferred_idle' | 'timeout' | 'session_exit';
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。
