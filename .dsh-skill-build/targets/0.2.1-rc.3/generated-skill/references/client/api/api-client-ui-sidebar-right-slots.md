# ui-sidebar-right：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。

## SidebarRightGuideActionEntry client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightGuideActionEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightGuideActionEntry {
    readonly id: string;
    readonly label: string;
    readonly pinned: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: string;` |
| `label` | `readonly label: string;` |
| `pinned` | `readonly pinned: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightGuideActionsOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightGuideActionsOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightGuideActionsOwnerProps {
    readonly entries: readonly SidebarRightGuideActionEntry[];
    readonly onOpen: (id: string) => void;
    readonly onPinnedChange: (id: string, pinned: boolean) => void;
    readonly onDismiss: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly SidebarRightGuideActionEntry[];` |
| `onOpen` | `readonly onOpen: (id: string) => void;` |
| `onPinnedChange` | `readonly onPinnedChange: (id: string, pinned: boolean) => void;` |
| `onDismiss` | `readonly onDismiss: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SidebarRightGuideActionEntry {

  readonly id: string

  readonly label: string

  readonly pinned: boolean
}
```

## SidebarRightGuideEntryOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightGuideEntryOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightGuideEntryOwnerProps {
    readonly entryId: string;
    readonly kind: string;
    readonly title: string;
    readonly description?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entryId` | `readonly entryId: string;` |
| `kind` | `readonly kind: string;` |
| `title` | `readonly title: string;` |
| `description` | `readonly description?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightTabActions client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabActions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightTabActions {
    bindCommands(commands: SidebarRightTabCommands): () => void;
    openResource(address: string, options?: SidebarRightTabPlacement & {
        readonly params?: SidebarRightResourceParams;
    }): void;
    openTab<K extends string>(kind: K, options?: SidebarRightTabPlacement & {
        readonly params?: SidebarRightTabParamsFor<K>;
    }): void;
    close(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `bindCommands` | `bindCommands(commands: SidebarRightTabCommands): () => void;` |
| `openResource` | `openResource(address: string, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightResourceParams; }): void;` |
| `openTab` | `openTab<K extends string>(kind: K, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightTabParamsFor<K>; }): void;` |
| `close` | `close(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SidebarRightTabPlacement {

  readonly paneId?: PaneId

  readonly preferNewPane?: boolean

  readonly revealIfOpened?: boolean

  readonly replaceTab?: boolean
}

export interface SidebarRightTabCommands {

  readonly refresh?: () => void
}
```

## SidebarRightTabInfo client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabInfo`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightTabInfo {
    readonly sidebar: {
        readonly expanded: boolean;
        readonly fullscreen: boolean;
    };
    readonly panel: {
        readonly id: PaneId;
    };
    readonly tab: TabRecord & {
        readonly refreshShortcut?: ShortcutCatalogEntry | undefined;
        readonly visible: boolean;
        readonly navigation: SidebarRightTabNavigation;
        readonly signal: AbortSignal;
        readonly actions: SidebarRightTabActions;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `sidebar` | `readonly sidebar: { readonly expanded: boolean; readonly fullscreen: boolean; };` |
| `panel` | `readonly panel: { readonly id: PaneId; };` |
| `tab` | `readonly tab: TabRecord & { readonly refreshShortcut?: ShortcutCatalogEntry \| undefined; readonly visible: boolean; readonly navigation: SidebarRightTabNavigation; readonly signal: AbortSignal; readonly actions: SidebarRightTabActions; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SidebarRightTabNavigation {

  readonly address: string

  readonly params: SidebarRightNavigationParams

  readonly revision: number
}

export interface SidebarRightTabActions {

  bindCommands(commands: SidebarRightTabCommands): () => void

  openResource(address: string, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightResourceParams }): void

  openTab<K extends string>(kind: K, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightTabParamsFor<K> }): void

  close(): void
}

export interface SidebarRightTabPlacement {

  readonly paneId?: PaneId

  readonly preferNewPane?: boolean

  readonly revealIfOpened?: boolean

  readonly replaceTab?: boolean
}

export interface SidebarRightTabCommands {

  readonly refresh?: () => void
}
```

## SidebarRightTabInjected client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightTabInjected {
    hooks: {
        tabInfo: SlotHookFactory<'sidebar.right.pane.tab', UseSidebarRightTabInfo>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { tabInfo: SlotHookFactory<'sidebar.right.pane.tab', UseSidebarRightTabInfo>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type UseSidebarRightTabInfo = () => SidebarRightTabInfo

export interface SidebarRightTabInfo {
  readonly sidebar: {
    readonly expanded: boolean

    readonly fullscreen: boolean
  }
  readonly panel: { readonly id: PaneId }
  readonly tab: TabRecord & {

    readonly refreshShortcut?: ShortcutCatalogEntry | undefined

    readonly visible: boolean
    readonly navigation: SidebarRightTabNavigation

    readonly signal: AbortSignal
    readonly actions: SidebarRightTabActions
  }
}

export interface SidebarRightTabNavigation {

  readonly address: string

  readonly params: SidebarRightNavigationParams

  readonly revision: number
}

export interface SidebarRightTabActions {

  bindCommands(commands: SidebarRightTabCommands): () => void

  openResource(address: string, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightResourceParams }): void

  openTab<K extends string>(kind: K, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightTabParamsFor<K> }): void

  close(): void
}

export interface SidebarRightTabPlacement {

  readonly paneId?: PaneId

  readonly preferNewPane?: boolean

  readonly revealIfOpened?: boolean

  readonly replaceTab?: boolean
}

export interface SidebarRightTabCommands {

  readonly refresh?: () => void
}
```

## SidebarRightTabMenuOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabMenuOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightTabMenuOwnerProps {
    tab: TabRecord;
    dismiss: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `tab` | `tab: TabRecord;` |
| `dismiss` | `dismiss: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightTabNavigation client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabNavigation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightTabNavigation {
    readonly address: string;
    readonly params: SidebarRightNavigationParams;
    readonly revision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `address` | `readonly address: string;` |
| `params` | `readonly params: SidebarRightNavigationParams;` |
| `revision` | `readonly revision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightTabPlacement client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabPlacement`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightTabPlacement {
    readonly paneId?: PaneId;
    readonly preferNewPane?: boolean;
    readonly revealIfOpened?: boolean;
    readonly replaceTab?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `paneId` | `readonly paneId?: PaneId;` |
| `preferNewPane` | `readonly preferNewPane?: boolean;` |
| `revealIfOpened` | `readonly revealIfOpened?: boolean;` |
| `replaceTab` | `readonly replaceTab?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## UseSidebarRightTabInfo client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `UseSidebarRightTabInfo`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseSidebarRightTabInfo = () => SidebarRightTabInfo;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface SidebarRightTabInfo {
  readonly sidebar: {
    readonly expanded: boolean

    readonly fullscreen: boolean
  }
  readonly panel: { readonly id: PaneId }
  readonly tab: TabRecord & {

    readonly refreshShortcut?: ShortcutCatalogEntry | undefined

    readonly visible: boolean
    readonly navigation: SidebarRightTabNavigation

    readonly signal: AbortSignal
    readonly actions: SidebarRightTabActions
  }
}

export interface SidebarRightTabNavigation {

  readonly address: string

  readonly params: SidebarRightNavigationParams

  readonly revision: number
}

export interface SidebarRightTabActions {

  bindCommands(commands: SidebarRightTabCommands): () => void

  openResource(address: string, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightResourceParams }): void

  openTab<K extends string>(kind: K, options?: SidebarRightTabPlacement & { readonly params?: SidebarRightTabParamsFor<K> }): void

  close(): void
}

export interface SidebarRightTabPlacement {

  readonly paneId?: PaneId

  readonly preferNewPane?: boolean

  readonly revealIfOpened?: boolean

  readonly replaceTab?: boolean
}

export interface SidebarRightTabCommands {

  readonly refresh?: () => void
}
```
