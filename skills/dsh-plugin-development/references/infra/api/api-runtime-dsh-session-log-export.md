# @deepseek-ai/dsh-session-log-export：检索与导出会话的只读视图

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在检索与导出会话的只读视图任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[检索与导出会话的只读视图](api-runtime-session-query-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session-query.md)。

## Config 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    readonly compressionLevel?: SessionLogCompressionLevel;
}

export declare const Config: Schema<Config>;
```

成员检索：`compressionLevel`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## DEFAULT_SESSION_LOG_COMPRESSION_LEVEL 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `DEFAULT_SESSION_LOG_COMPRESSION_LEVEL`。`DEFAULT_SESSION_LOG_COMPRESSION_LEVEL` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_SESSION_LOG_COMPRESSION_LEVEL: SessionLogCompressionLevel;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_LOG_EXPORT_PATH 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `SESSION_LOG_EXPORT_PATH`。`SESSION_LOG_EXPORT_PATH` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_LOG_EXPORT_PATH = "/api/session.export";
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_LOG_FILENAME 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `SESSION_LOG_FILENAME`。`SESSION_LOG_FILENAME` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_LOG_FILENAME: string;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogCompressionLevel 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `SessionLogCompressionLevel`。`SessionLogCompressionLevel` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionLogCompressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogExportDeps 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `SessionLogExportDeps`。`SessionLogExportDeps` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogExportDeps {
    readonly sessionQuery: SessionQueryEngine | undefined;
    readonly sessionPersistence: SessionPersistence | undefined;
    readonly attachments: AttachmentStore | undefined;
    readonly sessions: SessionStore | undefined;
}
```

成员检索：`attachments`、`sessionPersistence`、`sessionQuery`、`sessions`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogExportReady 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `SessionLogExportReady`。`SessionLogExportReady` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogExportReady {
    readonly sessionQuery: SessionQueryEngine;
    readonly sessionPersistence: SessionPersistence;
    readonly attachments: AttachmentStore;
    readonly sessions: SessionStore | undefined;
}
```

成员检索：`attachments`、`sessionPersistence`、`sessionQuery`、`sessions`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogZipEntry 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `SessionLogZipEntry`。`SessionLogZipEntry` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionLogZipEntry = {
    readonly path: string;
    readonly content: string;
} | {
    readonly path: string;
    readonly data: Uint8Array;
} | {
    readonly path: string;
    readonly chunks: AsyncIterable<Uint8Array>;
};
```

成员检索：`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config?: Config): void;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## flushLiveSessionLog 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `flushLiveSessionLog`。`flushLiveSessionLog` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function flushLiveSessionLog(deps: Pick<SessionLogExportDeps, 'sessions'>, id: SessionId, signal?: AbortSignal): Promise<void>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "session-log-download";
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## readSessionLogText 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `readSessionLogText`。`readSessionLogText` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function readSessionLogText(persistence: SessionPersistence, id: SessionId, signal?: AbortSignal): Promise<string | undefined>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## serializeSessionLog 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `serializeSessionLog`。`serializeSessionLog` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function serializeSessionLog(header: SessionHeader, events: readonly SessionEvent[]): string;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## sessionLogExportDeps 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `sessionLogExportDeps`。`sessionLogExportDeps` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionLogExportDeps(ctx: Context): SessionLogExportDeps;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## sessionLogZipEntries 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `sessionLogZipEntries`。`sessionLogZipEntries` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionLogZipEntries(deps: SessionLogExportReady, rootContent: string, sessionId: SessionId, includeDescendants: boolean, signal?: AbortSignal): AsyncGenerator<SessionLogZipEntry>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## sessionLogZipFilename 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `sessionLogZipFilename`。`sessionLogZipFilename` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionLogZipFilename(sessionId: string): string;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## streamSessionLogZip 契约

从 `@deepseek-ai/dsh-session-log-export` 导入 `streamSessionLogZip`。`streamSessionLogZip` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function streamSessionLogZip(deps: SessionLogExportReady, rootContent: string, sessionId: SessionId, includeDescendants: boolean, compressionLevel: SessionLogCompressionLevel, signal: AbortSignal): ReadableStream<Uint8Array>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。
