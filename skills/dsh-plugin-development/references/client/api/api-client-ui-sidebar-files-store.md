# ui-sidebar-files：store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-files 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## DirLevel client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `DirLevel`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DirLevel {
    readonly entries: readonly WorkspaceDirectoryEntry[];
    readonly truncated: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly WorkspaceDirectoryEntry[];` |
| `truncated` | `readonly truncated: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。

## FilesState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `FilesState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FilesState {
    byTab: Record<TabId, FilesTabState>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `byTab` | `byTab: Record<TabId, FilesTabState>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface FilesTabState {
  autoRefresh: boolean

  root: string

  levels: Record<string, LevelState>

  expanded: string[]

  scrollTop: number
}

export type LevelState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly level: DirLevel; readonly failure?: RemoteFailure }
  | { readonly kind: 'failed'; readonly failure: RemoteFailure }

export interface DirLevel {

  readonly entries: readonly WorkspaceDirectoryEntry[]

  readonly truncated: boolean
}
```

## FilesTabState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `FilesTabState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FilesTabState {
    autoRefresh: boolean;
    root: string;
    levels: Record<string, LevelState>;
    expanded: string[];
    scrollTop: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `autoRefresh` | `autoRefresh: boolean;` |
| `root` | `root: string;` |
| `levels` | `levels: Record<string, LevelState>;` |
| `expanded` | `expanded: string[];` |
| `scrollTop` | `scrollTop: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type LevelState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly level: DirLevel; readonly failure?: RemoteFailure }
  | { readonly kind: 'failed'; readonly failure: RemoteFailure }

export interface DirLevel {

  readonly entries: readonly WorkspaceDirectoryEntry[]

  readonly truncated: boolean
}
```

## LevelState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-files/client`，公开符号 `LevelState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LevelState = {
    readonly kind: 'loading';
} | {
    readonly kind: 'ready';
    readonly level: DirLevel;
    readonly failure?: RemoteFailure;
} | {
    readonly kind: 'failed';
    readonly failure: RemoteFailure;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-files.md#接入-ui-sidebar-files) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface DirLevel {

  readonly entries: readonly WorkspaceDirectoryEntry[]

  readonly truncated: boolean
}
```
