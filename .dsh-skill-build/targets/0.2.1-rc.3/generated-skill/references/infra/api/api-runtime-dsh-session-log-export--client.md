# @deepseek-ai/dsh-session-log-export./client：检索与导出会话的只读视图

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在检索与导出会话的只读视图任务中直接使用的对象。本子路径仅在 Client 编译面导入。

装配与公共失败边界见[检索与导出会话的只读视图](api-runtime-session-query-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session-query.md)。

## SessionLogDownloadDialogInjected 契约

从 `@deepseek-ai/dsh-session-log-export/client` 导入 `SessionLogDownloadDialogInjected`。`SessionLogDownloadDialogInjected` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogDownloadDialogInjected {
    hooks: {
        sessionLogDownload: ObservableSnapshot<SessionLogDownloadState>;
    };
    request: (sessionId: SessionId) => Promise<void>;
    dismiss: (sessionId: SessionId) => void;
}
```

成员检索：`dismiss`、`hooks`、`request`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogDownloadDialogProps 契约

从 `@deepseek-ai/dsh-session-log-export/client` 导入 `SessionLogDownloadDialogProps`。`SessionLogDownloadDialogProps` 是检索与导出会话的只读视图的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionLogDownloadDialogProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS> & InjectFace<SessionLogDownloadDialogInjected>;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `dismiss` | `dismiss: (sessionId: SessionId) => void;` | [SessionLogDownloadDialogInjected 权威声明](api-runtime-dsh-session-log-export--client.md#sessionlogdownloaddialoginjected-契约) |
| `request` | `request: (sessionId: SessionId) => Promise<void>;` | [SessionLogDownloadDialogInjected 权威声明](api-runtime-dsh-session-log-export--client.md#sessionlogdownloaddialoginjected-契约) |

## SessionLogDownloadEntry 契约

从 `@deepseek-ai/dsh-session-log-export/client` 导入 `SessionLogDownloadEntry`。`SessionLogDownloadEntry` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogDownloadEntry {
    readonly open: boolean;
    readonly status: SessionLogDownloadStatus;
    readonly error: string | null;
}
```

成员检索：`error`、`open`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## SessionLogDownloadState 契约

从 `@deepseek-ai/dsh-session-log-export/client` 导入 `SessionLogDownloadState`。`SessionLogDownloadState` 是检索与导出会话的只读视图的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogDownloadState {
    bySession: Record<string, SessionLogDownloadEntry | undefined>;
}
```

成员检索：`bySession`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-session-log-export/client` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: ClientContext): void;
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-session-log-export/client` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[检索与导出会话的只读视图](api-runtime-session-query-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session-query.md)核对成功、拒绝与卸载结果。
