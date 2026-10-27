# ui-dockkit：sequence 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## EMPTY_HISTORY root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `EMPTY_HISTORY`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const EMPTY_HISTORY: History;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## History root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `History`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface History {
    readonly entries: readonly HistoryEntry[];
    readonly cursor: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly HistoryEntry[];` |
| `cursor` | `readonly cursor: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## HistoryEntry root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `HistoryEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HistoryEntry {
    readonly ops: readonly LayoutOp[];
    readonly inverse: readonly LayoutOp[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `ops` | `readonly ops: readonly LayoutOp[];` |
| `inverse` | `readonly inverse: readonly LayoutOp[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## HistoryStep root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `HistoryStep`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HistoryStep {
    readonly history: History;
    readonly state: LayoutState;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `history` | `readonly history: History;` |
| `state` | `readonly state: LayoutState;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## Sequencer root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `Sequencer`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class Sequencer {
    constructor(initial: LayoutState);
    get state(): LayoutState;
    get history(): History;
    get ops(): readonly LayoutOp[];
    get cursor(): number;
    get canUndo(): boolean;
    get canRedo(): boolean;
    dispatch(op: LayoutOp): LayoutState;
    dispatchAll(ops: readonly LayoutOp[]): LayoutState;
    undo(): boolean;
    redo(): boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(initial: LayoutState);` |
| `state` | `get state(): LayoutState;` |
| `history` | `get history(): History;` |
| `ops` | `get ops(): readonly LayoutOp[];` |
| `cursor` | `get cursor(): number;` |
| `canUndo` | `get canUndo(): boolean;` |
| `canRedo` | `get canRedo(): boolean;` |
| `dispatch` | `dispatch(op: LayoutOp): LayoutState;` |
| `dispatchAll` | `dispatchAll(ops: readonly LayoutOp[]): LayoutState;` |
| `undo` | `undo(): boolean;` |
| `redo` | `redo(): boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## canStepBack root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `canStepBack`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function canStepBack(history: History): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## canStepForward root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `canStepForward`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function canStepForward(history: History): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## isFocusOp root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `isFocusOp`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function isFocusOp(op: LayoutOp): boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## record root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `record`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function record(history: History, state: LayoutState, ops: readonly LayoutOp[]): HistoryStep;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryStep {
  readonly history: History
  readonly state: LayoutState
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## recordedOps root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `recordedOps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function recordedOps(history: History): readonly LayoutOp[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## stepBack root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `stepBack`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function stepBack(history: History, state: LayoutState): HistoryStep | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryStep {
  readonly history: History
  readonly state: LayoutState
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```

## stepForward root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `stepForward`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function stepForward(history: History, state: LayoutState): HistoryStep | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface History {
  readonly entries: readonly HistoryEntry[]

  readonly cursor: number
}

export interface HistoryStep {
  readonly history: History
  readonly state: LayoutState
}

export interface HistoryEntry {
  readonly ops: readonly LayoutOp[]

  readonly inverse: readonly LayoutOp[]
}
```
