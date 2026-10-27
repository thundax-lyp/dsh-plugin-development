# ui-dockkit：adapter 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## DockIntents root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockIntents`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DockIntents {
    readonly focusTab: (tabId: TabId) => void;
    readonly focusPane: (paneId: PaneId) => void;
    readonly splitPane: (paneId: PaneId) => void;
    readonly addTab: (paneId: PaneId) => void;
    readonly closeTab: (tabId: TabId) => void;
    readonly duplicateTab: (tabId: TabId) => void;
    readonly floatTab: (tabId: TabId, rect?: FloatRect) => void;
    readonly unfloatPane: (paneId: PaneId) => void;
    readonly placeTab: (tabId: TabId, toPaneId: PaneId, index: number) => void;
    readonly dropTab: (tabId: TabId, paneId: PaneId, zone: DockZone) => void;
    readonly moveFloat: (paneId: PaneId, x: number, y: number) => void;
    readonly resizeFloat: (paneId: PaneId, rect: FloatRect) => void;
    readonly resizeSplit: (splitId: SplitId, sizes: readonly number[]) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `focusTab` | `readonly focusTab: (tabId: TabId) => void;` |
| `focusPane` | `readonly focusPane: (paneId: PaneId) => void;` |
| `splitPane` | `readonly splitPane: (paneId: PaneId) => void;` |
| `addTab` | `readonly addTab: (paneId: PaneId) => void;` |
| `closeTab` | `readonly closeTab: (tabId: TabId) => void;` |
| `duplicateTab` | `readonly duplicateTab: (tabId: TabId) => void;` |
| `floatTab` | `readonly floatTab: (tabId: TabId, rect?: FloatRect) => void;` |
| `unfloatPane` | `readonly unfloatPane: (paneId: PaneId) => void;` |
| `placeTab` | `readonly placeTab: (tabId: TabId, toPaneId: PaneId, index: number) => void;` |
| `dropTab` | `readonly dropTab: (tabId: TabId, paneId: PaneId, zone: DockZone) => void;` |
| `moveFloat` | `readonly moveFloat: (paneId: PaneId, x: number, y: number) => void;` |
| `resizeFloat` | `readonly resizeFloat: (paneId: PaneId, rect: FloatRect) => void;` |
| `resizeSplit` | `readonly resizeSplit: (splitId: SplitId, sizes: readonly number[]) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## DockLabels root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DockLabels {
    readonly emptyPane: string;
    readonly splitPane: string;
    readonly splitPaneShortcut?: string | undefined;
    readonly splitPaneKeys?: readonly string[] | undefined;
    readonly splitPaneDisabled: string;
    readonly splitPaneNarrow: string;
    readonly closeTab: string;
    readonly closeTabShortcut?: string | undefined;
    readonly closeTabKeys?: readonly string[] | undefined;
    readonly addTab: string;
    readonly dockFloat: string;
    readonly closeFloat: string;
    readonly dropZone: Readonly<Record<DockZone, string>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `emptyPane` | `readonly emptyPane: string;` |
| `splitPane` | `readonly splitPane: string;` |
| `splitPaneShortcut` | `readonly splitPaneShortcut?: string \| undefined;` |
| `splitPaneKeys` | `readonly splitPaneKeys?: readonly string[] \| undefined;` |
| `splitPaneDisabled` | `readonly splitPaneDisabled: string;` |
| `splitPaneNarrow` | `readonly splitPaneNarrow: string;` |
| `closeTab` | `readonly closeTab: string;` |
| `closeTabShortcut` | `readonly closeTabShortcut?: string \| undefined;` |
| `closeTabKeys` | `readonly closeTabKeys?: readonly string[] \| undefined;` |
| `addTab` | `readonly addTab: string;` |
| `dockFloat` | `readonly dockFloat: string;` |
| `closeFloat` | `readonly closeFloat: string;` |
| `dropZone` | `readonly dropZone: Readonly<Record<DockZone, string>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## TabMenuExtras root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `TabMenuExtras`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TabMenuExtras = (tab: TabRecord, dismiss: () => void) => ReactNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## TabRenderer root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `TabRenderer`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TabRenderer = (tab: TabRecord) => ReactNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。
