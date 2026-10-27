# ui-dockkit：controller 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## DockController root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockController`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class DockController {
    constructor(options?: DockControllerOptions);
    subscribe: (listener: () => void) => (() => void);
    getSnapshot: () => DockSnapshot;
    get ops(): readonly LayoutOp[];
    setExpanded(expanded: boolean): void;
    toggleExpanded(): void;
    setMode(mode: DockMode): void;
    splitPane(paneId?: PaneId): boolean;
    addTab(paneId: PaneId): boolean;
    openContent(input: OpenContentInput): TabId;
    duplicateTab(tabId: TabId): TabId;
    closeTab(tabId: TabId): void;
    focusTab(tabId: TabId): void;
    focusPane(paneId: PaneId): void;
    reorderTab(tabId: TabId, index: number): void;
    placeTab(tabId: TabId, toPaneId: PaneId, index: number): boolean;
    dropTab(tabId: TabId, targetPaneId: PaneId, zone: DockZone): boolean;
    floatTab(tabId: TabId, rect?: FloatRect): PaneId;
    unfloatPane(paneId: PaneId, toPaneId?: PaneId): void;
    moveFloat(paneId: PaneId, x: number, y: number): void;
    resizeFloat(paneId: PaneId, rect: FloatRect): void;
    resizeSplit(splitId: SplitId, sizes: readonly number[]): void;
    undo(): boolean;
    redo(): boolean;
    activeDockPaneId(): PaneId;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(options?: DockControllerOptions);` |
| `subscribe` | `subscribe: (listener: () => void) => (() => void);` |
| `getSnapshot` | `getSnapshot: () => DockSnapshot;` |
| `ops` | `get ops(): readonly LayoutOp[];` |
| `setExpanded` | `setExpanded(expanded: boolean): void;` |
| `toggleExpanded` | `toggleExpanded(): void;` |
| `setMode` | `setMode(mode: DockMode): void;` |
| `splitPane` | `splitPane(paneId?: PaneId): boolean;` |
| `addTab` | `addTab(paneId: PaneId): boolean;` |
| `openContent` | `openContent(input: OpenContentInput): TabId;` |
| `duplicateTab` | `duplicateTab(tabId: TabId): TabId;` |
| `closeTab` | `closeTab(tabId: TabId): void;` |
| `focusTab` | `focusTab(tabId: TabId): void;` |
| `focusPane` | `focusPane(paneId: PaneId): void;` |
| `reorderTab` | `reorderTab(tabId: TabId, index: number): void;` |
| `placeTab` | `placeTab(tabId: TabId, toPaneId: PaneId, index: number): boolean;` |
| `dropTab` | `dropTab(tabId: TabId, targetPaneId: PaneId, zone: DockZone): boolean;` |
| `floatTab` | `floatTab(tabId: TabId, rect?: FloatRect): PaneId;` |
| `unfloatPane` | `unfloatPane(paneId: PaneId, toPaneId?: PaneId): void;` |
| `moveFloat` | `moveFloat(paneId: PaneId, x: number, y: number): void;` |
| `resizeFloat` | `resizeFloat(paneId: PaneId, rect: FloatRect): void;` |
| `resizeSplit` | `resizeSplit(splitId: SplitId, sizes: readonly number[]): void;` |
| `undo` | `undo(): boolean;` |
| `redo` | `redo(): boolean;` |
| `activeDockPaneId` | `activeDockPaneId(): PaneId;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface DockSnapshot {
  readonly state: LayoutState
  readonly canUndo: boolean
  readonly canRedo: boolean

  readonly canSplit: boolean

  readonly opCount: number

  readonly cursor: number
}
```

## DockControllerOptions root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockControllerOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DockControllerOptions {
    readonly makeInitialTab?: TabFactory;
    readonly makePaneTab?: TabFactory;
    readonly mode?: DockMode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `makeInitialTab` | `readonly makeInitialTab?: TabFactory;` |
| `makePaneTab` | `readonly makePaneTab?: TabFactory;` |
| `mode` | `readonly mode?: DockMode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## DockSnapshot root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DockSnapshot {
    readonly state: LayoutState;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly canSplit: boolean;
    readonly opCount: number;
    readonly cursor: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: LayoutState;` |
| `canUndo` | `readonly canUndo: boolean;` |
| `canRedo` | `readonly canRedo: boolean;` |
| `canSplit` | `readonly canSplit: boolean;` |
| `opCount` | `readonly opCount: number;` |
| `cursor` | `readonly cursor: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。
