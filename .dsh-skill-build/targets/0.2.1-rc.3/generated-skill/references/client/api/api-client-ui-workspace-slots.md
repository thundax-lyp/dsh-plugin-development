# ui-workspace：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-workspace 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## DirectoryFlowOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `DirectoryFlowOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DirectoryFlowOwnerProps {
    open: boolean;
    busy: boolean;
    onPicked: (path: string) => void;
    onCancel: () => void;
    onError: (message: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `open` | `open: boolean;` |
| `busy` | `busy: boolean;` |
| `onPicked` | `onPicked: (path: string) => void;` |
| `onCancel` | `onCancel: () => void;` |
| `onError` | `onError: (message: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## DirectoryFlowSlotName client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `DirectoryFlowSlotName`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DirectoryFlowSlotName = 'conversation.hero.workspace.directoryFlow' | 'sidebar.workspaces.directoryFlow';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## DirectoryPickingHooks client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `DirectoryPickingHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DirectoryPickingHooks = PropsHooks<DirectoryPickingInjected['hooks']>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DirectoryPickingInjected = {
  hooks: {

    directoryFlow: HostObservable<boolean>
  }
}
```

## DirectoryPickingInjected client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `DirectoryPickingInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DirectoryPickingInjected = {
    hooks: {
        directoryFlow: HostObservable<boolean>;
    };
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## MenuOpenState client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `MenuOpenState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MenuOpenState = readonly [
    open: boolean,
    setOpen: (open: boolean) => void
];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## RowToast client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `RowToast`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RowToast = {
    kind: 'archived';
    sessionId: SessionId;
} | {
    kind: 'stoppedAndArchived';
    sessionId: SessionId;
} | {
    kind: 'sessionIdCopied';
} | {
    kind: 'sessionIdCopyFailed';
} | {
    kind: 'pinFailed';
} | {
    kind: 'unpinFailed';
} | {
    kind: 'archivedNotOpenable';
} | {
    kind: 'defaultWorkspaceFailed';
} | {
    kind: 'forkRequiresOpen';
    sessionId: SessionId;
} | {
    kind: 'shortcutForkFailed';
    reason: 'unavailable' | 'failed';
} | {
    kind: 'createFailed';
    message: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## SessionRenameTarget client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `SessionRenameTarget`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionRenameTarget {
    sessionId: SessionId;
    currentTitle: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `sessionId: SessionId;` |
| `currentTitle` | `currentTitle: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## SessionRowOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `SessionRowOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionRowOwnerProps {
    sessionId: SessionId;
    displayTitle: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `sessionId: SessionId;` |
| `displayTitle` | `displayTitle: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## SessionRowScheduleOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `SessionRowScheduleOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SessionRowScheduleOwnerProps {
    readonly sessionId: SessionId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sessionId` | `readonly sessionId: SessionId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## UseMenuOpenState client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `UseMenuOpenState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseMenuOpenState = () => MenuOpenState;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type MenuOpenState = readonly [open: boolean, setOpen: (open: boolean) => void]
```

## WorkspaceBrowserInjected client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `WorkspaceBrowserInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WorkspaceBrowserInjected = {
    hooks: DirectoryPickingInjected['hooks'] & {
        hostInfo: HostObservable<RemoteHostFacts>;
        workspaceShortcuts: HostObservable<WorkspaceShortcutState>;
        shortcuts: HostObservable<readonly ShortcutCatalogEntry[]>;
    };
    requestSearch: () => void;
    requestAddWorkspace: () => void;
    closeAddWorkspace: () => void;
    setDirectoryBusy: (busy: boolean) => void;
    startSession: (workspaceId?: WorkspaceId, options?: StartSessionOptions) => void;
    open: (sessionId: SessionId) => void;
    searchSessions: (query: string, signal: AbortSignal) => Promise<{
        items: readonly SessionSearchResultItem[];
        hasMore: boolean;
    }>;
    searchResultLimit: number;
    requestSessionRename: (sessionId: SessionId, currentTitle: string) => void;
    notifyArchivedNotOpenable: () => void;
    renameWorkspace: (workspaceId: WorkspaceId, title: string) => Promise<void>;
    deleteWorkspace: (workspaceId: WorkspaceId) => Promise<void>;
    insertWorkspaceBefore: (workspaceId: WorkspaceId, beforeWorkspaceId?: WorkspaceId) => Promise<void>;
    unarchiveSession: (sessionId: SessionId) => Promise<void>;
    createWorkspace: (input: {
        path: string;
    }) => Promise<WorkspaceView>;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DirectoryPickingInjected = {
  hooks: {

    directoryFlow: HostObservable<boolean>
  }
}
```

## WorkspaceBrowserProps client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `WorkspaceBrowserProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WorkspaceBrowserProps = PropsRuntime<'sidebar.workspaces'> & PropsRenderSlots<'sidebar.workspaces.directoryFlow' | 'sidebar.workspaces.session.menu.item' | 'sidebar.workspaces.session.row.action' | 'sidebar.session.row.leading' | 'sidebar.session.row.hover'> & PropsStore<WorkspaceViewStoreHandle> & Omit<WorkspaceBrowserInjected, 'hooks'> & PropsHooks<WorkspaceBrowserInjected['hooks']> & PropsLocale<'workspace'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type WorkspaceBrowserInjected = {
  hooks: DirectoryPickingInjected['hooks'] & {

    hostInfo: HostObservable<RemoteHostFacts>
    workspaceShortcuts: HostObservable<WorkspaceShortcutState>
    shortcuts: HostObservable<readonly ShortcutCatalogEntry[]>
  }

  requestSearch: () => void

  requestAddWorkspace: () => void

  closeAddWorkspace: () => void

  setDirectoryBusy: (busy: boolean) => void

  startSession: (workspaceId?: WorkspaceId, options?: StartSessionOptions) => void

  open: (sessionId: SessionId) => void

  searchSessions: (
    query: string,
    signal: AbortSignal,
  ) => Promise<{ items: readonly SessionSearchResultItem[]; hasMore: boolean }>

  searchResultLimit: number

  requestSessionRename: (sessionId: SessionId, currentTitle: string) => void

  notifyArchivedNotOpenable: () => void

  renameWorkspace: (workspaceId: WorkspaceId, title: string) => Promise<void>

  deleteWorkspace: (workspaceId: WorkspaceId) => Promise<void>

  insertWorkspaceBefore: (workspaceId: WorkspaceId, beforeWorkspaceId?: WorkspaceId) => Promise<void>

  unarchiveSession: (sessionId: SessionId) => Promise<void>

  createWorkspace: (input: { path: string }) => Promise<WorkspaceView>
}

export type WorkspaceViewStoreHandle = ReturnType<typeof createWorkspaceViewStore>

export type DirectoryPickingInjected = {
  hooks: {

    directoryFlow: HostObservable<boolean>
  }
}
```

## WorkspacePickerInjected client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `WorkspacePickerInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WorkspacePickerInjected = DirectoryPickingInjected & {
    createWorkspace: (input: {
        path: string;
    }) => Promise<WorkspaceView>;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DirectoryPickingInjected = {
  hooks: {

    directoryFlow: HostObservable<boolean>
  }
}
```

## WorkspacePickerProps client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `WorkspacePickerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WorkspacePickerProps = PropsRuntime<'conversation.hero.workspace'> & PropsRenderSlots<'conversation.hero.workspace.directoryFlow'> & Omit<WorkspacePickerInjected, 'hooks'> & PropsHooks<WorkspacePickerInjected['hooks']> & PropsLocale<'workspace'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type WorkspacePickerInjected = DirectoryPickingInjected & {

  createWorkspace: (input: { path: string }) => Promise<WorkspaceView>
}

export type DirectoryPickingInjected = {
  hooks: {

    directoryFlow: HostObservable<boolean>
  }
}
```
