# @deepseek-ai/dsh-session-persistence：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## SessionAccess 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionAccess`。`SessionAccess` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionAccess = 'read' | 'write';
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionAlreadyExistsError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionAlreadyExistsError`。`SessionAlreadyExistsError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionAlreadyExistsError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionAlreadyOwnedError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionAlreadyOwnedError`。`SessionAlreadyOwnedError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionAlreadyOwnedError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatUnsupportedError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionFormatUnsupportedError`。`SessionFormatUnsupportedError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionFormatUnsupportedError extends Error {
    readonly location?: SessionLocation | undefined;
    constructor(message: string, location?: SessionLocation | undefined);
}
```

成员检索：`location`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHandle 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHandle`。调用者拥有 close 以释放 writer。flush 保证耐久，read 可指定 prefix/range；read-only handle 不得 append。取消只按对应方法 options 执行，写入结果不明时先读取核对序号。

```text
export interface SessionHandle extends AsyncDisposable {
    readonly id: SessionId;
    readonly header: SessionHeader;
    readonly inheritedEventCount: SessionLogOffset;
    readonly access: SessionAccess;
    read(offset?: number, length?: number, options?: SessionHandleReadOptions): Promise<SessionHandleReadResult>;
    append(events: readonly SessionEvent[], options?: SessionHandleAppendOptions): Promise<void>;
    flush(options?: SessionHandleFlushOptions): Promise<void>;
    close(): Promise<void>;
}
```

成员检索：`access`、`append`、`close`、`flush`、`header`、`id`、`inheritedEventCount`、`read`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHandleAppendOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHandleAppendOptions`。`SessionHandleAppendOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionHandleAppendOptions {
    readonly signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHandleClosedError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHandleClosedError`。`SessionHandleClosedError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionHandleClosedError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId, operation: string);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHandleFlushOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHandleFlushOptions`。`SessionHandleFlushOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionHandleFlushOptions {
    readonly signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHandleReadOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHandleReadOptions`。`SessionHandleReadOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionHandleReadOptions {
    readonly signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHandleReadResult 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHandleReadResult`。`SessionHandleReadResult` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionHandleReadResult {
    readonly eventState: SessionSeedEventState;
    readonly events: readonly SessionEvent[];
}
```

成员检索：`eventState`、`events`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionHeader 契约

完整公开声明：

```text
export interface SessionHeader {
    readonly version: typeof SESSION_FORMAT_VERSION;
    readonly id: SessionId;
    readonly createdAt: number;
    readonly cwd?: string;
    readonly parentSession?: SessionId;
    readonly isSeeded: boolean;
    readonly origin?: 'subagent';
    readonly delegationDepth?: number;
    readonly agentPreset?: string;
}
```


从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionHeader`。`SessionHeader` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionInspection 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionInspection`。`SessionInspection` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionInspection extends SessionStorageMetadata {
    readonly events: readonly SessionEvent[];
}
```

成员检索：`events`、`inheritedEventCount`、`meta`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionLocation 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionLocation`。`SessionLocation` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLocation {
    readonly kind: string;
    readonly path: string;
}
```

成员检索：`kind`、`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionOwnershipLostError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionOwnershipLostError`。`SessionOwnershipLostError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionOwnershipLostError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistence 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistence`。append-only 后端。create 返回 write handle；open(read) 不抢写权，open(write) 原子竞争唯一 writer。append 是 best-effort；flush 才是耐久屏障，并强制物化延迟创建的会话。

```text
export declare abstract class SessionPersistence extends Service {
    readonly identity: symbol;
    constructor(ctx: Context);
    abstract create(header: SessionHeader, options?: SessionPersistenceCreateOptions): Promise<SessionHandle>;
    abstract open(id: SessionId, access: SessionAccess, options?: SessionPersistenceOpenOptions): Promise<SessionHandle>;
    abstract flush(): Promise<void>;
    abstract stat(id: SessionId, options?: SessionPersistenceStatOptions): Promise<SessionPersistenceSnapshot | undefined>;
    abstract list(options?: SessionPersistenceListOptions): Promise<readonly SessionPersistenceSnapshot[]>;
}
```

成员检索：`create`、`flush`、`identity`、`list`、`open`、`stat`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceCorruptionError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceCorruptionError`。`SessionPersistenceCorruptionError` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionPersistenceCorruptionError extends Error {
    constructor(message: string, options: ErrorOptions);
}
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceCreateOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceCreateOptions`。`SessionPersistenceCreateOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionPersistenceCreateOptions {
    readonly signal?: AbortSignal;
    readonly inheritedEventCount?: SessionLogOffset;
}
```

成员检索：`inheritedEventCount`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceListOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceListOptions`。`SessionPersistenceListOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionPersistenceListOptions {
    readonly signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceNotFoundError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceNotFoundError`。`SessionPersistenceNotFoundError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionPersistenceNotFoundError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceOpenOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceOpenOptions`。`SessionPersistenceOpenOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionPersistenceOpenOptions {
    readonly signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceRevision 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceRevision`。只在同一服务实例和 SessionId 中比较的不透明变化 token；与 writer ownership churn、resume、open 权限无关。

```text
export declare function SessionPersistenceRevision(value: string): SessionPersistenceRevision;

export type SessionPersistenceRevision = Branded<'SessionPersistenceRevision'>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceSnapshot 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceSnapshot`。`SessionPersistenceSnapshot` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionPersistenceSnapshot {
    readonly header: SessionHeader;
    readonly formatStatus?: 'current' | 'migration-required';
    readonly revision: SessionPersistenceRevision;
    readonly eventCount?: number;
    readonly sizeBytes?: number;
}
```

成员检索：`eventCount`、`formatStatus`、`header`、`revision`、`sizeBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionPersistenceStatOptions 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionPersistenceStatOptions`。`SessionPersistenceStatOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionPersistenceStatOptions {
    readonly signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionReadOnlyError 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionReadOnlyError`。`SessionReadOnlyError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionReadOnlyError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId, operation: string);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionStorageMetadata 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `SessionStorageMetadata`。`SessionStorageMetadata` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionStorageMetadata {
    readonly meta: SessionHeader;
    readonly inheritedEventCount: SessionLogOffset;
}
```

成员检索：`inheritedEventCount`、`meta`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## assertContiguous 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `assertContiguous`。`assertContiguous` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function assertContiguous(id: SessionId, events: readonly SessionEvent[], cursor: number): void;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## assertStoredId 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `assertStoredId`。`assertStoredId` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function assertStoredId(id: SessionId, meta: SessionHeader): void;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## assertVersion 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `assertVersion`。`assertVersion` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function assertVersion(meta: {
    readonly id: SessionId;
    readonly version: number;
}, location?: SessionLocation): void;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## materializeAppendBatch 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `materializeAppendBatch`。`materializeAppendBatch` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function materializeAppendBatch(events: readonly SessionEvent[]): readonly SessionEvent[];
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## materializeCreateHeader 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `materializeCreateHeader`。`materializeCreateHeader` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function materializeCreateHeader(header: SessionHeader): SessionHeader;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## sessionFormatVersionRefusal 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `sessionFormatVersionRefusal`。`sessionFormatVersionRefusal` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionFormatVersionRefusal(id: string, version: number): string;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## validateStoredEvents 契约

从 `@deepseek-ai/dsh-session-persistence` 导入 `validateStoredEvents`。`validateStoredEvents` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function validateStoredEvents(meta: SessionHeader, events: SessionEvent[], location?: SessionLocation): SessionEvent[];
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
