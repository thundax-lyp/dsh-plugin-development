# ui-sidebar-documentpreview：rpc 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-documentpreview 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## DocumentFileBytes client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `DocumentFileBytes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DocumentFileBytes = WorkspaceFileBytes<Uint8Array<ArrayBuffer>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

## ReadDocumentBytes client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `ReadDocumentBytes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ReadDocumentBytes = (file: SessionFile, signal: AbortSignal) => Promise<RemoteResult<DocumentFileBytes>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SessionFile {

  readonly sessionId: SessionId

  readonly path: string
}

export type DocumentFileBytes = WorkspaceFileBytes<Uint8Array<ArrayBuffer>>
```

## ReadWorkspaceFilePage client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `ReadWorkspaceFilePage`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ReadWorkspaceFilePage = (sessionId: SessionId, path: string, offset: number, signal: AbortSignal) => Promise<RemoteResult<WorkspaceFileText>>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

## SessionFile client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `SessionFile`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionFile {
    readonly sessionId: SessionId;
    readonly path: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `readonly sessionId: SessionId;` |
| `path` | `readonly path: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

## WorkspaceFilesReadRemote client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `WorkspaceFilesReadRemote`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WorkspaceFilesReadRemote {
    readonly workspaceFiles: {
        read(sessionId: SessionId, path: string, range: WorkspaceFileRange, signal?: AbortSignal): Promise<RemoteResult<WorkspaceFileText>>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `workspaceFiles` | `readonly workspaceFiles: { read(sessionId: SessionId, path: string, range: WorkspaceFileRange, signal?: AbortSignal): Promise<RemoteResult<WorkspaceFileText>>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。
