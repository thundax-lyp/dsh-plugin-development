# @deepseek-ai/dsh-session-query-sqlite：检索与导出会话的只读视图

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在检索与导出会话的只读视图任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[检索与导出会话的只读视图](api-runtime-session-query-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session-query.md)。

## Config 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config extends SessionQueryConfig {
    path: string;
    openAt?: OpenAt;
    journalMode?: JournalMode;
    defaultLimit?: number;
    maxLimit?: number;
    snippetChars?: number;
    persistedReadConcurrency?: number;
    preparedSessionCacheSize?: number;
}
```

成员检索：`defaultLimit`、`journalMode`、`maxLimit`、`openAt`、`path`、`persistedReadConcurrency`、`preparedSessionCacheSize`、`snippetChars`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## JournalMode 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `JournalMode`。`JournalMode` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type JournalMode = 'wal' | 'delete' | 'truncate' | 'persist';
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## OpenAt 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `OpenAt`。`OpenAt` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type OpenAt = 'startup' | 'first-search' | 'never';
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_SQLITE_APPLICATION_ID 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SESSION_QUERY_SQLITE_APPLICATION_ID`。`SESSION_QUERY_SQLITE_APPLICATION_ID` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_SQLITE_APPLICATION_ID = 1146308689;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_SQLITE_DEFAULT_LIMIT 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SESSION_QUERY_SQLITE_DEFAULT_LIMIT`。`SESSION_QUERY_SQLITE_DEFAULT_LIMIT` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_SQLITE_DEFAULT_LIMIT = 20;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_SQLITE_MAX_LIMIT 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SESSION_QUERY_SQLITE_MAX_LIMIT`。`SESSION_QUERY_SQLITE_MAX_LIMIT` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_SQLITE_MAX_LIMIT = 100;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_SQLITE_PATH_KEY 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SESSION_QUERY_SQLITE_PATH_KEY`。`SESSION_QUERY_SQLITE_PATH_KEY` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_SQLITE_PATH_KEY = "launcherSessionQueryPath";
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_SQLITE_SCHEMA_VERSION 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SESSION_QUERY_SQLITE_SCHEMA_VERSION`。`SESSION_QUERY_SQLITE_SCHEMA_VERSION` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_SQLITE_SCHEMA_VERSION = 8;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SESSION_QUERY_SQLITE_SNIPPET_CHARS 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SESSION_QUERY_SQLITE_SNIPPET_CHARS`。`SESSION_QUERY_SQLITE_SNIPPET_CHARS` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_QUERY_SQLITE_SNIPPET_CHARS = 240;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SqliteSessionQueryEngine 契约

从 `@deepseek-ai/dsh-session-query-sqlite` 导入 `SqliteSessionQueryEngine`。`SqliteSessionQueryEngine` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SqliteSessionQueryEngine extends SessionQueryEngine {
    static inject: string[];
    static Config: z<Config>;
    readonly config: ResolvedConfig;
    constructor(ctx: Context, config: Config);
    searchSessions(request: SessionSearchRequest, exec?: SessionSearchExecContext): Promise<SessionSearchPage<SessionSearchHit>>;
    searchEvents(request: SessionEventSearchRequest, exec?: SessionSearchExecContext): Promise<SessionEventSearchPage>;
    close(): Promise<void>;
}
```

成员检索：`close`、`config`、`searchEvents`、`searchSessions`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。
