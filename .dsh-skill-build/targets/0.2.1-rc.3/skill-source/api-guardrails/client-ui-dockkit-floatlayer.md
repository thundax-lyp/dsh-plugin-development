# ui-dockkit：floatlayer 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## FloatLayer root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `FloatLayer`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function FloatLayer({ state, intents, labels, renderTab, renderTabTitle, canCloseTab }: FloatLayerProps): ReactNode;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface FloatLayerProps {
  readonly state: LayoutState
  readonly intents: DockIntents
  readonly labels: DockLabels
  readonly renderTab: TabRenderer

  readonly canCloseTab?: (tabId: TabId) => boolean

  readonly renderTabTitle?: TabRenderer
}
```

## FloatLayerProps root

入口 `@deepseek-ai/dsh-client-ui-dockkit`，公开符号 `FloatLayerProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FloatLayerProps {
    readonly state: LayoutState;
    readonly intents: DockIntents;
    readonly labels: DockLabels;
    readonly renderTab: TabRenderer;
    readonly canCloseTab?: (tabId: TabId) => boolean;
    readonly renderTabTitle?: TabRenderer;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: LayoutState;` |
| `intents` | `readonly intents: DockIntents;` |
| `labels` | `readonly labels: DockLabels;` |
| `renderTab` | `readonly renderTab: TabRenderer;` |
| `canCloseTab` | `readonly canCloseTab?: (tabId: TabId) => boolean;` |
| `renderTabTitle` | `readonly renderTabTitle?: TabRenderer;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit) 在真实装载路径检验成功、失败与卸载。
