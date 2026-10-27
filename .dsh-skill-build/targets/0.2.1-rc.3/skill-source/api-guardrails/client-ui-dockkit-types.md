# ui-dockkit：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## ApplyResult root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `ApplyResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ApplyResult {
    readonly state: LayoutState;
    readonly inverse: readonly LayoutOp[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: LayoutState;` |
| `inverse` | `readonly inverse: readonly LayoutOp[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface LayoutState {
  readonly nodes: Readonly<Record<NodeId, LayoutNode>>
  readonly tabs: Readonly<Record<TabId, TabRecord>>

  readonly rootId: NodeId

  readonly floats: readonly PaneId[]

  readonly activePaneId: PaneId

  readonly expanded: boolean

  readonly mode: DockMode
}

export type LayoutOp =

  | {
    readonly type: 'split'
    readonly paneId: PaneId
    readonly axis: SplitAxis
    readonly direction: SplitDirection
    readonly newPaneId: PaneId

    readonly newSplitId: SplitId
  }

  | { readonly type: 'merge'; readonly paneId: PaneId }

  | { readonly type: 'openTab'; readonly paneId: PaneId; readonly tab: TabRecord; readonly index: number }

  | { readonly type: 'closeTab'; readonly tabId: TabId }

  | { readonly type: 'moveTab'; readonly tabId: TabId; readonly toPaneId: PaneId; readonly index: number }

  | { readonly type: 'reorderTab'; readonly tabId: TabId; readonly index: number }

  | { readonly type: 'focusTab'; readonly tabId: TabId }

  | { readonly type: 'focusPane'; readonly paneId: PaneId }

  | { readonly type: 'resize'; readonly splitId: SplitId; readonly sizes: readonly number[] }

  | { readonly type: 'float'; readonly tabId: TabId; readonly newPaneId: PaneId; readonly rect: FloatRect }

  | { readonly type: 'unfloat'; readonly paneId: PaneId; readonly toPaneId: PaneId; readonly index: number }

  | { readonly type: 'moveFloat'; readonly paneId: PaneId; readonly x: number; readonly y: number }

  | { readonly type: 'resizeFloat'; readonly paneId: PaneId; readonly rect: FloatRect }

  | { readonly type: 'setExpanded'; readonly expanded: boolean }

  | { readonly type: 'setMode'; readonly mode: DockMode }

  | {
    readonly type: 'insertPane'
    readonly pane: PaneNode
    readonly tabs: readonly TabRecord[]
    readonly attach: PaneAttachment
  }

  | { readonly type: 'insertTab'; readonly paneId: PaneId; readonly tab: TabRecord; readonly index: number }

  | {
    readonly type: 'restoreFocus'
    readonly activePaneId: PaneId
    readonly floats: readonly PaneId[]

    readonly paneActiveTabs: Readonly<Record<PaneId, TabId | undefined>>
  }

export type PaneId = Branded<'PaneId'>

export type SplitId = Branded<'SplitId'>

export type NodeId = PaneId | SplitId

export type TabId = Branded<'TabId'>

export type SplitAxis = 'row' | 'column'

export type SplitDirection = 'before' | 'after'

export type DockMode = 'push' | 'fullscreen'

export interface FloatRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface PaneNode {
  readonly kind: 'pane'
  readonly id: PaneId
  readonly host: PaneHost
  readonly tabs: readonly TabId[]

  readonly activeTabId: TabId | undefined

  readonly rect: FloatRect | undefined
}

export type LayoutNode = SplitNode | PaneNode

export interface TabRecord {
  readonly id: TabId
  readonly kind: string
  readonly contentId: string
  readonly title: string
}

export type PaneAttachment =

  | { readonly mode: 'child'; readonly parentId: SplitId; readonly index: number; readonly sizes: readonly number[] }

  | { readonly mode: 'wrap'; readonly targetId: NodeId; readonly split: SplitNode }

  | { readonly mode: 'float'; readonly index: number }

export interface SplitNode {
  readonly kind: 'split'
  readonly id: SplitId
  readonly axis: SplitAxis

  readonly children: readonly NodeId[]

  readonly sizes: readonly number[]
}

export type PaneHost = 'dock' | 'float'
```

## DockMode root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockMode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DockMode = 'push' | 'fullscreen';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## DockZone root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `DockZone`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DockZone = 'center' | 'top' | 'right' | 'bottom' | 'left';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## FloatRect root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `FloatRect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FloatRect {
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

## LayoutNode root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `LayoutNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LayoutNode = SplitNode | PaneNode;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SplitNode {
  readonly kind: 'split'
  readonly id: SplitId
  readonly axis: SplitAxis

  readonly children: readonly NodeId[]

  readonly sizes: readonly number[]
}

export interface PaneNode {
  readonly kind: 'pane'
  readonly id: PaneId
  readonly host: PaneHost
  readonly tabs: readonly TabId[]

  readonly activeTabId: TabId | undefined

  readonly rect: FloatRect | undefined
}

export type PaneId = Branded<'PaneId'>

export type SplitId = Branded<'SplitId'>

export type NodeId = PaneId | SplitId

export type TabId = Branded<'TabId'>

export type SplitAxis = 'row' | 'column'

export interface FloatRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type PaneHost = 'dock' | 'float'
```

## LayoutOp root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `LayoutOp`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type LayoutOp = {
    readonly type: 'split';
    readonly paneId: PaneId;
    readonly axis: SplitAxis;
    readonly direction: SplitDirection;
    readonly newPaneId: PaneId;
    readonly newSplitId: SplitId;
} | {
    readonly type: 'merge';
    readonly paneId: PaneId;
} | {
    readonly type: 'openTab';
    readonly paneId: PaneId;
    readonly tab: TabRecord;
    readonly index: number;
} | {
    readonly type: 'closeTab';
    readonly tabId: TabId;
} | {
    readonly type: 'moveTab';
    readonly tabId: TabId;
    readonly toPaneId: PaneId;
    readonly index: number;
} | {
    readonly type: 'reorderTab';
    readonly tabId: TabId;
    readonly index: number;
} | {
    readonly type: 'focusTab';
    readonly tabId: TabId;
} | {
    readonly type: 'focusPane';
    readonly paneId: PaneId;
} | {
    readonly type: 'resize';
    readonly splitId: SplitId;
    readonly sizes: readonly number[];
} | {
    readonly type: 'float';
    readonly tabId: TabId;
    readonly newPaneId: PaneId;
    readonly rect: FloatRect;
} | {
    readonly type: 'unfloat';
    readonly paneId: PaneId;
    readonly toPaneId: PaneId;
    readonly index: number;
} | {
    readonly type: 'moveFloat';
    readonly paneId: PaneId;
    readonly x: number;
    readonly y: number;
} | {
    readonly type: 'resizeFloat';
    readonly paneId: PaneId;
    readonly rect: FloatRect;
} | {
    readonly type: 'setExpanded';
    readonly expanded: boolean;
} | {
    readonly type: 'setMode';
    readonly mode: DockMode;
} | {
    readonly type: 'insertPane';
    readonly pane: PaneNode;
    readonly tabs: readonly TabRecord[];
    readonly attach: PaneAttachment;
} | {
    readonly type: 'insertTab';
    readonly paneId: PaneId;
    readonly tab: TabRecord;
    readonly index: number;
} | {
    readonly type: 'restoreFocus';
    readonly activePaneId: PaneId;
    readonly floats: readonly PaneId[];
    readonly paneActiveTabs: Readonly<Record<PaneId, TabId | undefined>>;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PaneId = Branded<'PaneId'>

export type SplitId = Branded<'SplitId'>

export type TabId = Branded<'TabId'>

export type SplitAxis = 'row' | 'column'

export type SplitDirection = 'before' | 'after'

export type DockMode = 'push' | 'fullscreen'

export interface FloatRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface PaneNode {
  readonly kind: 'pane'
  readonly id: PaneId
  readonly host: PaneHost
  readonly tabs: readonly TabId[]

  readonly activeTabId: TabId | undefined

  readonly rect: FloatRect | undefined
}

export interface TabRecord {
  readonly id: TabId
  readonly kind: string
  readonly contentId: string
  readonly title: string
}

export type PaneAttachment =

  | { readonly mode: 'child'; readonly parentId: SplitId; readonly index: number; readonly sizes: readonly number[] }

  | { readonly mode: 'wrap'; readonly targetId: NodeId; readonly split: SplitNode }

  | { readonly mode: 'float'; readonly index: number }

export type NodeId = PaneId | SplitId

export interface SplitNode {
  readonly kind: 'split'
  readonly id: SplitId
  readonly axis: SplitAxis

  readonly children: readonly NodeId[]

  readonly sizes: readonly number[]
}

export type PaneHost = 'dock' | 'float'
```

## LayoutState root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `LayoutState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LayoutState {
    readonly nodes: Readonly<Record<NodeId, LayoutNode>>;
    readonly tabs: Readonly<Record<TabId, TabRecord>>;
    readonly rootId: NodeId;
    readonly floats: readonly PaneId[];
    readonly activePaneId: PaneId;
    readonly expanded: boolean;
    readonly mode: DockMode;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `nodes` | `readonly nodes: Readonly<Record<NodeId, LayoutNode>>;` |
| `tabs` | `readonly tabs: Readonly<Record<TabId, TabRecord>>;` |
| `rootId` | `readonly rootId: NodeId;` |
| `floats` | `readonly floats: readonly PaneId[];` |
| `activePaneId` | `readonly activePaneId: PaneId;` |
| `expanded` | `readonly expanded: boolean;` |
| `mode` | `readonly mode: DockMode;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PaneId = Branded<'PaneId'>

export type NodeId = PaneId | SplitId

export type TabId = Branded<'TabId'>

export type DockMode = 'push' | 'fullscreen'

export type LayoutNode = SplitNode | PaneNode

export interface TabRecord {
  readonly id: TabId
  readonly kind: string
  readonly contentId: string
  readonly title: string
}

export type SplitId = Branded<'SplitId'>

export interface SplitNode {
  readonly kind: 'split'
  readonly id: SplitId
  readonly axis: SplitAxis

  readonly children: readonly NodeId[]

  readonly sizes: readonly number[]
}

export interface PaneNode {
  readonly kind: 'pane'
  readonly id: PaneId
  readonly host: PaneHost
  readonly tabs: readonly TabId[]

  readonly activeTabId: TabId | undefined

  readonly rect: FloatRect | undefined
}

export type SplitAxis = 'row' | 'column'

export interface FloatRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type PaneHost = 'dock' | 'float'
```

## NodeId root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `NodeId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type NodeId = PaneId | SplitId;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PaneId = Branded<'PaneId'>

export type SplitId = Branded<'SplitId'>
```

## PaneAttachment root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `PaneAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PaneAttachment = {
    readonly mode: 'child';
    readonly parentId: SplitId;
    readonly index: number;
    readonly sizes: readonly number[];
} | {
    readonly mode: 'wrap';
    readonly targetId: NodeId;
    readonly split: SplitNode;
} | {
    readonly mode: 'float';
    readonly index: number;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SplitId = Branded<'SplitId'>

export type NodeId = PaneId | SplitId

export interface SplitNode {
  readonly kind: 'split'
  readonly id: SplitId
  readonly axis: SplitAxis

  readonly children: readonly NodeId[]

  readonly sizes: readonly number[]
}

export type PaneId = Branded<'PaneId'>

export type SplitAxis = 'row' | 'column'
```

## PaneHost root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `PaneHost`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PaneHost = 'dock' | 'float';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## PaneId root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `PaneId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PaneId = Branded<'PaneId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## PaneNode root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `PaneNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PaneNode {
    readonly kind: 'pane';
    readonly id: PaneId;
    readonly host: PaneHost;
    readonly tabs: readonly TabId[];
    readonly activeTabId: TabId | undefined;
    readonly rect: FloatRect | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'pane';` |
| `id` | `readonly id: PaneId;` |
| `host` | `readonly host: PaneHost;` |
| `tabs` | `readonly tabs: readonly TabId[];` |
| `activeTabId` | `readonly activeTabId: TabId \| undefined;` |
| `rect` | `readonly rect: FloatRect \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type PaneId = Branded<'PaneId'>

export type TabId = Branded<'TabId'>

export interface FloatRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type PaneHost = 'dock' | 'float'
```

## SplitAxis root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `SplitAxis`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SplitAxis = 'row' | 'column';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## SplitDirection root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `SplitDirection`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SplitDirection = 'before' | 'after';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## SplitId root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `SplitId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SplitId = Branded<'SplitId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## SplitNode root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `SplitNode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SplitNode {
    readonly kind: 'split';
    readonly id: SplitId;
    readonly axis: SplitAxis;
    readonly children: readonly NodeId[];
    readonly sizes: readonly number[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: 'split';` |
| `id` | `readonly id: SplitId;` |
| `axis` | `readonly axis: SplitAxis;` |
| `children` | `readonly children: readonly NodeId[];` |
| `sizes` | `readonly sizes: readonly number[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SplitId = Branded<'SplitId'>

export type NodeId = PaneId | SplitId

export type SplitAxis = 'row' | 'column'

export type PaneId = Branded<'PaneId'>
```

## TabId root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `TabId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TabId = Branded<'TabId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

## TabRecord root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `TabRecord`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TabRecord {
    readonly id: TabId;
    readonly kind: string;
    readonly contentId: string;
    readonly title: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: TabId;` |
| `kind` | `readonly kind: string;` |
| `contentId` | `readonly contentId: string;` |
| `title` | `readonly title: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type TabId = Branded<'TabId'>
```
