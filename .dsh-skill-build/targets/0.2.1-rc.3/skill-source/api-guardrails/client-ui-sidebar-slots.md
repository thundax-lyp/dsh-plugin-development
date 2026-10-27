# ui-sidebar：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## SidebarBrandMarkOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarBrandMarkOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarBrandMarkOwnerProps {
    size: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `size` | `size: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarBrandNameOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarBrandNameOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarBrandNameOwnerProps {
    children?: never;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `children` | `children?: never;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarFooterActionOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarFooterActionOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarFooterActionOwnerProps {
    wide: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `wide` | `wide: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarPanelActionEntry client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarPanelActionEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarPanelActionEntry {
    readonly id: string;
    readonly label: string;
    readonly pinned: boolean;
    readonly active?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: string;` |
| `label` | `readonly label: string;` |
| `pinned` | `readonly pinned: boolean;` |
| `active` | `readonly active?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarPanelActionsOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarPanelActionsOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarPanelActionsOwnerProps {
    readonly entries: readonly SidebarPanelActionEntry[];
    readonly onOpen: (id: string) => void;
    readonly onPinnedChange: (id: string, pinned: boolean) => void;
    readonly onDismiss: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly SidebarPanelActionEntry[];` |
| `onOpen` | `readonly onOpen: (id: string) => void;` |
| `onPinnedChange` | `readonly onPinnedChange: (id: string, pinned: boolean) => void;` |
| `onDismiss` | `readonly onDismiss: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SidebarPanelActionEntry {

  readonly id: string

  readonly label: string

  readonly pinned: boolean

  readonly active?: boolean
}
```

## SidebarPanelIconOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarPanelIconOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarPanelIconOwnerProps {
    size: number;
    active: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `size` | `size: number;` |
| `active` | `active: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarPanelMetadata client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarPanelMetadata`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarPanelMetadata {
    id: MainPanelId;
    order: number;
    label: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: MainPanelId;` |
| `order` | `order: number;` |
| `label` | `label: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarRootComponentProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarRootComponentProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRootComponentProps = PropsRuntime<'sidebar'> & PropsRenderSlots<'sidebar.brand.mark' | 'sidebar.brand.name' | 'sidebar.toggle.badge' | 'sidebar.panellist' | 'sidebar.panellist.actions' | 'sidebar.workspaces' | 'sidebar.settings' | 'sidebar.footer.action'> & InjectFace<SidebarRootInjected> & PropsLocale<'sidebar'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SidebarRootInjected = {

  startSession: (workspaceId?: WorkspaceId) => void

  toggleSidebar: () => void

  selectPanel: (id: MainPanelId) => void

  setPinned: (id: string, pinned: boolean) => void

  trackEntryClick: (attributes: ProductEventMap['sidebar_menu_click']) => void

  hooks: {
    panels: ObservableSnapshot<readonly SidebarPanelMetadata[]>
    shortcuts: ObservableSnapshot<readonly ShortcutCatalogEntry[]>

    entryPins: ObservableSnapshot<readonly string[]>

    entryActions: ObservableSnapshot<boolean>
  }
}

export interface SidebarPanelMetadata {

  id: MainPanelId

  order: number

  label: string
}
```

## SidebarRootInjected client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarRootInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRootInjected = {
    startSession: (workspaceId?: WorkspaceId) => void;
    toggleSidebar: () => void;
    selectPanel: (id: MainPanelId) => void;
    setPinned: (id: string, pinned: boolean) => void;
    trackEntryClick: (attributes: ProductEventMap['sidebar_menu_click']) => void;
    hooks: {
        panels: ObservableSnapshot<readonly SidebarPanelMetadata[]>;
        shortcuts: ObservableSnapshot<readonly ShortcutCatalogEntry[]>;
        entryPins: ObservableSnapshot<readonly string[]>;
        entryActions: ObservableSnapshot<boolean>;
    };
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SidebarPanelMetadata {

  id: MainPanelId

  order: number

  label: string
}
```

## SidebarSectionOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarSectionOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarSectionOwnerProps {
    wide: boolean;
    expandSidebar: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `wide` | `wide: boolean;` |
| `expandSidebar` | `expandSidebar: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。

## SidebarSettingsOwnerProps client

入口 `@deepseek-ai/dsh-client-ui-sidebar/client`，公开符号 `SidebarSettingsOwnerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarSettingsOwnerProps {
    wide: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `wide` | `wide: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar.md#接入-ui-sidebar) 在真实装载路径检验成功、失败与卸载。
