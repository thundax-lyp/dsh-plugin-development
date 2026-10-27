# ui-dockkit：geometry 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## DRAG_THRESHOLD root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DRAG_THRESHOLD`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DRAG_THRESHOLD = 4;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## DropTarget root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DropTarget`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DropTarget = {
    readonly kind: 'strip';
    readonly paneId: PaneId;
    readonly index: number;
} | {
    readonly kind: 'zone';
    readonly paneId: PaneId;
    readonly zone: DockZone;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## HalvesFit root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `HalvesFit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HalvesFit {
    readonly row: boolean;
    readonly column: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `row` | `readonly row: boolean;` |
| `column` | `readonly column: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## PaneMeasure root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `PaneMeasure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PaneMeasure {
    readonly pane: Rect;
    readonly strip: Rect;
    readonly chipsWidth: number;
    readonly fillWidth: number;
    readonly splitControlWidth?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `pane` | `readonly pane: Rect;` |
| `strip` | `readonly strip: Rect;` |
| `chipsWidth` | `readonly chipsWidth: number;` |
| `fillWidth` | `readonly fillWidth: number;` |
| `splitControlWidth` | `readonly splitControlWidth?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Rect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
```

## Rect root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `Rect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `x` | `readonly x: number;` |
| `y` | `readonly y: number;` |
| `width` | `readonly width: number;` |
| `height` | `readonly height: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## SPLIT_MINIMUMS root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `SPLIT_MINIMUMS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const SPLIT_MINIMUMS: SplitMinimums;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SplitMinimums {

  readonly divider: number

  readonly chip: number

  readonly body: number
}
```

## Size root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `Size`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Size {
    readonly width: number;
    readonly height: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `width` | `readonly width: number;` |
| `height` | `readonly height: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## SplitMinimums root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `SplitMinimums`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SplitMinimums {
    readonly divider: number;
    readonly chip: number;
    readonly body: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `divider` | `readonly divider: number;` |
| `chip` | `readonly chip: number;` |
| `body` | `readonly body: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## containsPoint root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `containsPoint`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function containsPoint(rect: Rect, x: number, y: number): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Rect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
```

## dividerSizes root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `dividerSizes`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function dividerSizes(sizes: readonly number[], index: number, delta: number): number[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## floatRectAt root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `floatRectAt`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function floatRectAt(x: number, y: number, size: Size): FloatRect;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Size {
  readonly width: number
  readonly height: number
}
```

## halvesFit root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `halvesFit`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function halvesFit(measure: PaneMeasure, minimums?: SplitMinimums): HalvesFit;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PaneMeasure {

  readonly pane: Rect

  readonly strip: Rect

  readonly chipsWidth: number

  readonly fillWidth: number

  readonly splitControlWidth?: number
}

export interface SplitMinimums {

  readonly divider: number

  readonly chip: number

  readonly body: number
}

export interface HalvesFit {

  readonly row: boolean

  readonly column: boolean
}

export interface Rect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
```

## insertionIndex root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `insertionIndex`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function insertionIndex(tabRects: readonly Rect[], x: number): number;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Rect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
```

## movedRect root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `movedRect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function movedRect(rect: FloatRect, dx: number, dy: number): FloatRect;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## passedThreshold root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `passedThreshold`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function passedThreshold(startX: number, startY: number, x: number, y: number): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## resizedRect root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `resizedRect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function resizedRect(rect: FloatRect, dx: number, dy: number, min: Size): FloatRect;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface Size {
  readonly width: number
  readonly height: number
}
```

## zoneInRect root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `zoneInRect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function zoneInRect(rect: Rect, x: number, y: number, edge?: number): DockZone;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface Rect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
```
