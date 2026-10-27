# ui-dockkit：constraints 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## DOCK_EDGE_FRACTION root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DOCK_EDGE_FRACTION`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DOCK_EDGE_FRACTION = 0.25;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## DOCK_ZONES root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DOCK_ZONES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DOCK_ZONES: readonly DockZone[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## FLOAT_DEFAULT_SIZE root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `FLOAT_DEFAULT_SIZE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const FLOAT_DEFAULT_SIZE: {
    readonly width: 380;
    readonly height: 300;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## FLOAT_MIN_SIZE root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `FLOAT_MIN_SIZE`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const FLOAT_MIN_SIZE: {
    readonly width: 220;
    readonly height: 140;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## MAX_DOCK_PANES root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `MAX_DOCK_PANES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const MAX_DOCK_PANES = 4;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## MIN_PANE_FRACTION root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `MIN_PANE_FRACTION`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const MIN_PANE_FRACTION = 0.12;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## canSplit root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `canSplit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function canSplit(state: LayoutState): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## clampSizes root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `clampSizes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function clampSizes(sizes: readonly number[], minimum?: number): number[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## dockPaneCount root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `dockPaneCount`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function dockPaneCount(state: LayoutState): number;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## zoneAt root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `zoneAt`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function zoneAt(x: number, y: number, edge?: number): DockZone;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## zoneSplit root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `zoneSplit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function zoneSplit(zone: DockZone): {
    axis: SplitAxis;
    direction: SplitDirection;
} | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。
