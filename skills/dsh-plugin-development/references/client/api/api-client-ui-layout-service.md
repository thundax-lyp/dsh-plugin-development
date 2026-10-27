# ui-layout：service 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-layout 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ILayout client

入口 `@deepseek-ai/dsh-client-ui-layout/client`，公开符号 `ILayout`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ILayout {
    readonly panelInfo: HostObservable<PanelInfo>;
    selectPanel(panelId: MainPanelId | null): void;
    beginNavigation(): AbortSignal;
    toggleSidebar(): void;
    openRightbar(track: boolean, fullscreen: boolean): void;
    closeRightbar(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `panelInfo` | `readonly panelInfo: HostObservable<PanelInfo>;` |
| `selectPanel` | `selectPanel(panelId: MainPanelId \| null): void;` |
| `beginNavigation` | `beginNavigation(): AbortSignal;` |
| `toggleSidebar` | `toggleSidebar(): void;` |
| `openRightbar` | `openRightbar(track: boolean, fullscreen: boolean): void;` |
| `closeRightbar` | `closeRightbar(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-layout.md#接入-ui-layout) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type MainPanelId = Branded<'MainPanelId'>

export interface PanelInfo {

  readonly activePanelId: MainPanelId | null
}
```

## LayoutController client

入口 `@deepseek-ai/dsh-client-ui-layout/client`，公开符号 `LayoutController`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class LayoutController implements ILayout {
    readonly panelInfo: HostObservable<PanelInfo>;
    constructor(panels: PanelActions, hasMainPanel: (id: MainPanelId) => boolean, panelInfo: HostObservable<PanelInfo>);
    selectPanel(panelId: MainPanelId | null): void;
    beginNavigation(): AbortSignal;
    dispose(): void;
    toggleSidebar(): void;
    openRightbar(track: boolean, fullscreen: boolean): void;
    closeRightbar(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `panelInfo` | `readonly panelInfo: HostObservable<PanelInfo>;` |
| `constructor` | `constructor(panels: PanelActions, hasMainPanel: (id: MainPanelId) => boolean, panelInfo: HostObservable<PanelInfo>);` |
| `selectPanel` | `selectPanel(panelId: MainPanelId \| null): void;` |
| `beginNavigation` | `beginNavigation(): AbortSignal;` |
| `dispose` | `dispose(): void;` |
| `toggleSidebar` | `toggleSidebar(): void;` |
| `openRightbar` | `openRightbar(track: boolean, fullscreen: boolean): void;` |
| `closeRightbar` | `closeRightbar(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-layout.md#接入-ui-layout) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PanelInfo {

  readonly activePanelId: MainPanelId | null
}

export type MainPanelId = Branded<'MainPanelId'>
```

## MainPanelId client

入口 `@deepseek-ai/dsh-client-ui-layout/client`，公开符号 `MainPanelId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type MainPanelId = Branded<'MainPanelId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-layout.md#接入-ui-layout) 在真实装载路径检验成功、失败与卸载。

## PanelInfo client

入口 `@deepseek-ai/dsh-client-ui-layout/client`，公开符号 `PanelInfo`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PanelInfo {
    readonly activePanelId: MainPanelId | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `activePanelId` | `readonly activePanelId: MainPanelId \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-layout.md#接入-ui-layout) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type MainPanelId = Branded<'MainPanelId'>
```
