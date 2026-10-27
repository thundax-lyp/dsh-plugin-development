# ui-sidebar-files：face 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-files 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## FilesInjected client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `FilesInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FilesInjected {
    readonly refresh: (tabId: TabId) => void;
    readonly setAutoRefresh: (tabId: TabId, enabled: boolean) => void;
    readonly start: (tabId: TabId, root: string, signal: AbortSignal) => void;
    readonly load: (tabId: TabId, path: string, signal: AbortSignal) => void;
    readonly toggle: (tabId: TabId, parentPath: string, path: string, expanded: readonly string[], signal: AbortSignal) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `refresh` | `readonly refresh: (tabId: TabId) => void;` |
| `setAutoRefresh` | `readonly setAutoRefresh: (tabId: TabId, enabled: boolean) => void;` |
| `start` | `readonly start: (tabId: TabId, root: string, signal: AbortSignal) => void;` |
| `load` | `readonly load: (tabId: TabId, path: string, signal: AbortSignal) => void;` |
| `toggle` | `readonly toggle: (tabId: TabId, parentPath: string, path: string, expanded: readonly string[], signal: AbortSignal) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。

## ListWorkspaceDirectory client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `ListWorkspaceDirectory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ListWorkspaceDirectory = (sessionId: SessionId, path: string, signal: AbortSignal) => Promise<RemoteResult<DirLevel>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。

## WorkspaceFilesListRemote client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `WorkspaceFilesListRemote`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WorkspaceFilesListRemote = {
    readonly workspaceFiles: Pick<ClientRemote['workspaceFiles'], 'list'>;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。
