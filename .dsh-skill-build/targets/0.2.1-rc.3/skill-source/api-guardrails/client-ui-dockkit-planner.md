# ui-dockkit：planner 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## Mint root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `Mint`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Mint {
    (prefix: 'tab'): TabId;
    (prefix: 'pane' | 'float'): PaneId;
    (prefix: 'split'): SplitId;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## OpenContentInput root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `OpenContentInput`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface OpenContentInput {
    readonly contentId: string;
    readonly title: string;
    readonly kind: string;
    readonly paneId?: PaneId;
    readonly index?: number;
    readonly revealIfOpened?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `contentId` | `readonly contentId: string;` |
| `title` | `readonly title: string;` |
| `kind` | `readonly kind: string;` |
| `paneId` | `readonly paneId?: PaneId;` |
| `index` | `readonly index?: number;` |
| `revealIfOpened` | `readonly revealIfOpened?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## PlannedTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `PlannedTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PlannedTab {
    readonly ops: readonly LayoutOp[];
    readonly tabId: TabId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `ops` | `readonly ops: readonly LayoutOp[];` |
| `tabId` | `readonly tabId: TabId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## activeDockPaneId root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `activeDockPaneId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function activeDockPaneId(state: LayoutState): PaneId;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## findContentTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `findContentTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function findContentTab(state: LayoutState, contentId: string, kind?: string): TabId | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## findPaneContentTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `findPaneContentTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function findPaneContentTab(state: LayoutState, paneId: PaneId, contentId: string, kind?: string): TabId | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## planAddTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planAddTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planAddTab(state: LayoutState, mint: Mint, paneId: PaneId, makeTab?: TabFactory): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}
```

## planDropTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planDropTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planDropTab(state: LayoutState, mint: Mint, tabId: TabId, targetPaneId: PaneId, zone: DockZone, makeTab?: TabFactory): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}
```

## planDuplicateTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planDuplicateTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planDuplicateTab(state: LayoutState, mint: Mint, tabId: TabId): PlannedTab;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}

export interface PlannedTab {
  readonly ops: readonly LayoutOp[]

  readonly tabId: TabId
}
```

## planFloatTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planFloatTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planFloatTab(state: LayoutState, mint: Mint, tabId: TabId, rect?: FloatRect): {
    readonly ops: readonly LayoutOp[];
    readonly paneId: PaneId;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}
```

## planOpenContent root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planOpenContent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planOpenContent(state: LayoutState, mint: Mint, input: OpenContentInput): PlannedTab;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}

export interface OpenContentInput {

  readonly contentId: string
  readonly title: string
  readonly kind: string

  readonly paneId?: PaneId

  readonly index?: number

  readonly revealIfOpened?: boolean
}

export interface PlannedTab {
  readonly ops: readonly LayoutOp[]

  readonly tabId: TabId
}
```

## planPlaceTab root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planPlaceTab`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planPlaceTab(state: LayoutState, tabId: TabId, toPaneId: PaneId, index: number): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## planResizeSplit root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planResizeSplit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planResizeSplit(splitId: SplitId, sizes: readonly number[], minimum?: number): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## planSetExpanded root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planSetExpanded`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planSetExpanded(state: LayoutState, expanded: boolean): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## planSetMode root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planSetMode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planSetMode(state: LayoutState, mode: DockMode): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## planSettle root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planSettle`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planSettle(state: LayoutState, mint: Mint, makeTab?: TabFactory): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}
```

## planSplitPane root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planSplitPane`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planSplitPane(state: LayoutState, mint: Mint, paneId?: PaneId, makePaneTab?: TabFactory): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Mint {
  (prefix: 'tab'): TabId
  (prefix: 'pane' | 'float'): PaneId
  (prefix: 'split'): SplitId
}
```

## planUnfloatPane root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `planUnfloatPane`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function planUnfloatPane(state: LayoutState, paneId: PaneId, toPaneId?: PaneId): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。
