# @deepseek-ai/dsh-session-query：检索与导出会话的只读视图

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在检索与导出会话的只读视图任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[检索与导出会话的只读视图](api-runtime-session-query-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session-query.md)。

## ColdSessionLog 契约

从 `@deepseek-ai/dsh-session-query` 导入 `ColdSessionLog`。`ColdSessionLog` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ColdSessionLog {
    readonly eventState: SessionSeedEventState;
    readonly header: SessionHeader;
    readonly inheritedEventCount: SessionLogOffset;
    readonly events: SessionEvent[];
}
```

成员检索：`eventState`、`events`、`header`、`inheritedEventCount`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## Config 契约

从 `@deepseek-ai/dsh-session-query` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    readWindowMax?: number;
    persistedReadConcurrency?: number;
    preparedSessionCacheSize?: number;
}
```

成员检索：`persistedReadConcurrency`、`preparedSessionCacheSize`、`readWindowMax`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_DEFAULT_PERSISTED_INSPECT_CONCURRENCY 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SESSION_QUERY_DEFAULT_PERSISTED_INSPECT_CONCURRENCY`。`SESSION_QUERY_DEFAULT_PERSISTED_INSPECT_CONCURRENCY` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_DEFAULT_PERSISTED_INSPECT_CONCURRENCY = 4;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_DEFAULT_PREPARED_SESSION_CACHE_SIZE 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SESSION_QUERY_DEFAULT_PREPARED_SESSION_CACHE_SIZE`。`SESSION_QUERY_DEFAULT_PREPARED_SESSION_CACHE_SIZE` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_DEFAULT_PREPARED_SESSION_CACHE_SIZE = 5;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_READ_WINDOW_MAX 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SESSION_QUERY_READ_WINDOW_MAX`。`SESSION_QUERY_READ_WINDOW_MAX` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_READ_WINDOW_MAX = 50;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionAvailability 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionAvailability`。`SessionAvailability` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionAvailability = 'live' | 'persisted';
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventMetadataFilter 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventMetadataFilter`。`SessionEventMetadataFilter` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionEventMetadataFilter = Exclude<SessionEventResultFilter, {
    kind: 'text';
}>;
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventReadRequest 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventReadRequest`。`SessionEventReadRequest` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventReadRequest {
    sessionId: SessionId;
    seq: SessionSeq;
    before?: number;
    after?: number;
}
```

成员检索：`after`、`before`、`seq`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventRecord 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventRecord`。`SessionEventRecord` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventRecord {
    sessionId: SessionId;
    seq: SessionSeq;
    type: SessionEventType;
    time: number;
    surface: SessionEventSurface;
}
```

成员检索：`seq`、`sessionId`、`surface`、`time`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventResultFilter 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventResultFilter`。`SessionEventResultFilter` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionEventResultFilter = ({
    kind: 'seq';
} & SessionResultRange) | ({
    kind: 'time';
} & SessionResultRange) | {
    kind: 'type';
    values: readonly SessionEventType[];
} | {
    kind: 'surface';
    values: readonly SessionEventSurface[];
} | {
    kind: 'text';
    text: string;
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventSearchDocument 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventSearchDocument`。`SessionEventSearchDocument` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventSearchDocument extends SessionEventRecord {
    text: string;
}
```

成员检索：`seq`、`sessionId`、`surface`、`text`、`time`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventSearchHit 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventSearchHit`。`SessionEventSearchHit` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventSearchHit extends SessionEventRecord {
    snippet: string;
}
```

成员检索：`seq`、`sessionId`、`snippet`、`surface`、`time`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventSearchPage 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventSearchPage`。`SessionEventSearchPage` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventSearchPage extends SessionSearchPage<SessionEventSearchHit> {
    session: SessionHeader;
}
```

成员检索：`items`、`nextCursor`、`session`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventSearchRequest 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventSearchRequest`。`SessionEventSearchRequest` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventSearchRequest {
    sessionId: SessionId;
    query: string;
    filters?: readonly SessionEventMetadataFilter[];
    limit?: number;
    cursor?: SessionSearchCursor;
}
```

成员检索：`cursor`、`filters`、`limit`、`query`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventSurface 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventSurface`。`SessionEventSurface` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionEventSurface = 'current' | 'shadowed' | 'log-only';
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventTrace 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventTrace`。`SessionEventTrace` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventTrace {
    target: SessionEventRecord;
    replacedBy?: SessionSeq;
    replacementChain: SessionSeq[];
    replacedEventSeqs: SessionSeq[];
    sourceEventSeqs: SessionSeq[];
    derivedEventSeqs: SessionSeq[];
}
```

成员检索：`derivedEventSeqs`、`replacedBy`、`replacedEventSeqs`、`replacementChain`、`sourceEventSeqs`、`target`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventTraceObservation 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventTraceObservation`。`SessionEventTraceObservation` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventTraceObservation extends SessionEventTrace {
    session: SessionHeader;
}
```

成员检索：`derivedEventSeqs`、`replacedBy`、`replacedEventSeqs`、`replacementChain`、`session`、`sourceEventSeqs`、`target`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventTraceRequest 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventTraceRequest`。`SessionEventTraceRequest` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventTraceRequest {
    sessionId: SessionId;
    seq: SessionSeq;
}
```

成员检索：`seq`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionEventWindow 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionEventWindow`。`SessionEventWindow` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionEventWindow {
    session: SessionHeader;
    inheritedEventCount: SessionLogOffset;
    target: SessionEvent;
    events: SessionEvent[];
    startSeq: SessionSeq;
    endSeq: SessionSeq;
}
```

成员检索：`endSeq`、`events`、`inheritedEventCount`、`session`、`startSeq`、`target`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLineageNode 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionLineageNode`。`SessionLineageNode` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLineageNode {
    session: SessionRecord;
    descendants: SessionLineageNode[];
}
```

成员检索：`descendants`、`session`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLineageTrace 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionLineageTrace`。`SessionLineageTrace` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionLineageTrace = {
    target: SessionRecord;
    ancestors: SessionRecord[];
    descendants: SessionLineageNode[];
} & ({
    complete: true;
    root: SessionRecord;
} | {
    complete: false;
    unresolvedParentId: SessionId;
});
```

成员检索：`ancestors`、`complete`、`descendants`、`target`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogSnapshot 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionLogSnapshot`。`SessionLogSnapshot` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogSnapshot {
    session: SessionHeader;
    inheritedEventCount: SessionLogOffset;
    events: SessionEvent[];
}
```

成员检索：`events`、`inheritedEventCount`、`session`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionObservation 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionObservation`。`SessionObservation` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionObservation extends Disposable {
    readonly source: 'live' | 'prepared';
    readonly header: SessionHeader;
    readonly inheritedEventCount: SessionLogOffsetType;
    readonly events: readonly SessionEvent[];
    readonly cursor: SessionSeqCursor;
    readonly revision?: SessionPersistenceRevision;
    readonly projections?: ProjectionSnapshot;
    retain(): SessionObservation;
}
```

成员检索：`cursor`、`events`、`header`、`inheritedEventCount`、`projections`、`retain`、`revision`、`source`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionObservationOptions 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionObservationOptions`。`SessionObservationOptions` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionObservationOptions {
    readonly signal?: AbortSignal;
    readonly projectionMode?: 'all' | 'none';
}
```

成员检索：`projectionMode`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionQueryEngine 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionQueryEngine`。`SessionQueryEngine` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare abstract class SessionQueryEngine extends Service {
    static inject: string[];
    constructor(ctx: Context, config?: Config);
    observeSession(sessionId: SessionId, options?: SessionObservationOptions): Promise<SessionObservation>;
    abstract searchSessions(request: SessionSearchRequest, exec?: SessionSearchExecContext): Promise<SessionSearchPage<SessionSearchHit>>;
    abstract searchEvents(request: SessionEventSearchRequest, exec?: SessionSearchExecContext): Promise<SessionEventSearchPage>;
    listSessions(signal?: AbortSignal): Promise<SessionRecord[]>;
    readSession(sessionId: SessionId): Promise<SessionLogSnapshot>;
    filterSessions(filters: readonly SessionResultFilter[], signal?: AbortSignal): Promise<SessionRecord[]>;
    readTitle(sessionId: SessionId, signal?: AbortSignal): Promise<SessionTitleSnapshot | undefined>;
    readTitleSnapshot(sessionId: SessionId, signal?: AbortSignal): Promise<SessionTitleObservation>;
    readTitleSnapshots(sessionIds: readonly SessionId[], signal?: AbortSignal): Promise<SessionTitleObservationResult[]>;
    listEvents(sessionId: SessionId): Promise<SessionEventRecord[]>;
    filterEvents(sessionId: SessionId, filters: readonly SessionEventResultFilter[]): Promise<SessionEventSearchDocument[]>;
    readSurface(sessionId: SessionId): Promise<SessionSurfaceSnapshot>;
    traceSession(sessionId: SessionId, signal?: AbortSignal): Promise<SessionLineageTrace>;
    traceEvent(request: SessionEventTraceRequest, signal?: AbortSignal): Promise<SessionEventTraceObservation>;
    readEvent(request: SessionEventReadRequest, signal?: AbortSignal): Promise<SessionEventWindow>;
}
```

成员检索：`filterEvents`、`filterSessions`、`listEvents`、`listSessions`、`observeSession`、`readEvent`、`readSession`、`readSurface`、`readTitle`、`readTitleSnapshot`、`readTitleSnapshots`、`searchEvents`、`searchSessions`、`traceEvent`、`traceSession`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionQueryError 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionQueryError`。`SessionQueryError` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionQueryError extends HarnessError {
    readonly code: SessionQueryErrorCode;
    constructor(message: string, code: SessionQueryErrorCode, options?: ErrorOptions);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionQueryErrorCode 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionQueryErrorCode`。`SessionQueryErrorCode` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionQueryErrorCode = 'SESSION_QUERY_ABORTED' | 'SESSION_QUERY_CORRUPT_SESSION' | 'SESSION_QUERY_EVENT_NOT_FOUND' | 'SESSION_QUERY_INDEX_FAILED' | 'SESSION_QUERY_INVALID_CONFIG' | 'SESSION_QUERY_INVALID_CURSOR' | 'SESSION_QUERY_INVALID_FILTER' | 'SESSION_QUERY_INVALID_LIMIT' | 'SESSION_QUERY_INVALID_QUERY' | 'SESSION_QUERY_INVALID_LINEAGE' | 'SESSION_QUERY_INVALID_SURFACE' | 'SESSION_QUERY_INVALID_WINDOW' | 'SESSION_QUERY_PERSISTENCE_FAILED' | 'SESSION_QUERY_SEARCH_DISABLED' | 'SESSION_QUERY_SESSION_NOT_FOUND' | 'SESSION_QUERY_STALE_CURSOR' | 'SESSION_QUERY_SOURCE_CONFLICT';
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionRecord 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionRecord`。`SessionRecord` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionRecord {
    header: SessionHeader;
    live: boolean;
    persisted: boolean;
    formatStatus?: 'current' | 'migration-required';
}
```

成员检索：`formatStatus`、`header`、`live`、`persisted`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionResultFilter 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionResultFilter`。`SessionResultFilter` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionResultFilter = {
    kind: 'id';
    values: readonly SessionId[];
} | {
    kind: 'cwd';
    values: readonly (string | null)[];
} | ({
    kind: 'created-at';
} & SessionResultRange) | {
    kind: 'parent';
    values: readonly (SessionId | null)[];
} | {
    kind: 'availability';
    values: readonly SessionAvailability[];
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionResultRange 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionResultRange`。`SessionResultRange` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionResultRange {
    from?: number;
    to?: number;
}
```

成员检索：`from`、`to`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionSearchCursor 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionSearchCursor`。`SessionSearchCursor` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function SessionSearchCursor(value: string): SessionSearchCursor;

export type SessionSearchCursor = Branded<'SessionSearchCursor'>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionSearchExecContext 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionSearchExecContext`。`SessionSearchExecContext` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionSearchExecContext {
    signal?: AbortSignal;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionSearchHit 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionSearchHit`。`SessionSearchHit` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionSearchHit extends SessionRecord {
    bestMatch: SessionEventSearchHit;
}
```

成员检索：`bestMatch`、`formatStatus`、`header`、`live`、`persisted`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionSearchPage 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionSearchPage`。`SessionSearchPage` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionSearchPage<T> {
    items: readonly T[];
    nextCursor?: SessionSearchCursor;
}
```

成员检索：`items`、`nextCursor`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionSearchRequest 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionSearchRequest`。`SessionSearchRequest` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionSearchRequest {
    query: string;
    sessionFilters?: readonly SessionResultFilter[];
    eventFilters?: readonly SessionEventMetadataFilter[];
    limit?: number;
    cursor?: SessionSearchCursor;
}
```

成员检索：`cursor`、`eventFilters`、`limit`、`query`、`sessionFilters`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionSurfaceSnapshot 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionSurfaceSnapshot`。`SessionSurfaceSnapshot` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionSurfaceSnapshot {
    session: SessionHeader;
    inheritedEventCount: SessionLogOffset;
    capturedThroughSeq: OptionalSessionSeq;
    events: SurfaceEvent[];
}
```

成员检索：`capturedThroughSeq`、`events`、`inheritedEventCount`、`session`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionTitleObservation 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionTitleObservation`。`SessionTitleObservation` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleObservation {
    session: SessionHeader;
    title?: SessionTitleSnapshot;
}
```

成员检索：`session`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionTitleObservationResult 契约

从 `@deepseek-ai/dsh-session-query` 导入 `SessionTitleObservationResult`。`SessionTitleObservationResult` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionTitleObservationResult = {
    sessionId: SessionId;
    status: 'fulfilled';
    value: SessionTitleObservation;
} | {
    sessionId: SessionId;
    status: 'rejected';
    reason: unknown;
};
```

成员检索：`sessionId`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## assertSessionHeadersCompatible 契约

从 `@deepseek-ai/dsh-session-query` 导入 `assertSessionHeadersCompatible`。`assertSessionHeadersCompatible` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function assertSessionHeadersCompatible(a: SessionHeader, b: SessionHeader): void;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## buildSessionEventRecords 契约

从 `@deepseek-ai/dsh-session-query` 导入 `buildSessionEventRecords`。`buildSessionEventRecords` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function buildSessionEventRecords(sessionId: SessionId, events: readonly SessionEvent[]): SessionEventRecord[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## buildSessionEventSearchDocuments 契约

从 `@deepseek-ai/dsh-session-query` 导入 `buildSessionEventSearchDocuments`。`buildSessionEventSearchDocuments` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function buildSessionEventSearchDocuments(sessionId: SessionId, events: readonly SessionEvent[]): SessionEventSearchDocument[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## compileSessionTextFilter 契约

从 `@deepseek-ai/dsh-session-query` 导入 `compileSessionTextFilter`。`compileSessionTextFilter` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function compileSessionTextFilter(text: string): RegExp;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## extractSessionEventText 契约

从 `@deepseek-ai/dsh-session-query` 导入 `extractSessionEventText`。`extractSessionEventText` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function extractSessionEventText(event: SessionEvent): string;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## filterSessionEventDocuments 契约

从 `@deepseek-ai/dsh-session-query` 导入 `filterSessionEventDocuments`。`filterSessionEventDocuments` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function filterSessionEventDocuments<T extends SessionEventSearchDocument>(documents: readonly T[], filters?: readonly SessionEventResultFilter[]): T[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## filterSessionResults 契约

从 `@deepseek-ai/dsh-session-query` 导入 `filterSessionResults`。`filterSessionResults` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function filterSessionResults<T extends SessionRecord>(records: readonly T[], filters?: readonly SessionResultFilter[]): T[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## materializeSessionEventResultFilters 契约

从 `@deepseek-ai/dsh-session-query` 导入 `materializeSessionEventResultFilters`。`materializeSessionEventResultFilters` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function materializeSessionEventResultFilters(filters: readonly SessionEventResultFilter[]): SessionEventResultFilter[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## materializeSessionResultFilters 契约

从 `@deepseek-ai/dsh-session-query` 导入 `materializeSessionResultFilters`。`materializeSessionResultFilters` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function materializeSessionResultFilters(filters: readonly SessionResultFilter[]): SessionResultFilter[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## readColdSessionLog 契约

从 `@deepseek-ai/dsh-session-query` 导入 `readColdSessionLog`。`readColdSessionLog` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function readColdSessionLog(persistence: SessionPersistence, sessionId: SessionId, signal?: AbortSignal): Promise<ColdSessionLog>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。
