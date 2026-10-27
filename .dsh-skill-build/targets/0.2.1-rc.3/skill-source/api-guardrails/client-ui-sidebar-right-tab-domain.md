# ui-sidebar-right：tab-domain 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。

## PinResource client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `PinResource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PinResource = (address: string, signal: AbortSignal) => void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightNavigator client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightNavigator`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightNavigator {
    openResourceIn(sessionId: SessionId, address: string, options?: SidebarRightOpenResourceOptions): void;
    openTabIn(sessionId: SessionId, kind: string, options?: SidebarRightOpenTabOptions): void;
    closeIn(sessionId: SessionId, tabId: TabId): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `openResourceIn` | `openResourceIn(sessionId: SessionId, address: string, options?: SidebarRightOpenResourceOptions): void;` |
| `openTabIn` | `openTabIn(sessionId: SessionId, kind: string, options?: SidebarRightOpenTabOptions): void;` |
| `closeIn` | `closeIn(sessionId: SessionId, tabId: TabId): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightOccurrenceId client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightOccurrenceId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRightOccurrenceId = Branded<'SidebarRightOccurrenceId'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## TabOccurrence client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `TabOccurrence`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TabOccurrence {
    readonly commands: SidebarRightTabCommands;
    readonly id: SidebarRightOccurrenceId;
    readonly sessionId: SessionId;
    readonly tabId: TabId;
    readonly signal: AbortSignal;
    readonly navigation: SnapshotStore<SidebarRightTabNavigation>;
    readonly tabActions: SidebarRightTabActions;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `commands` | `readonly commands: SidebarRightTabCommands;` |
| `id` | `readonly id: SidebarRightOccurrenceId;` |
| `sessionId` | `readonly sessionId: SessionId;` |
| `tabId` | `readonly tabId: TabId;` |
| `signal` | `readonly signal: AbortSignal;` |
| `navigation` | `readonly navigation: SnapshotStore<SidebarRightTabNavigation>;` |
| `tabActions` | `readonly tabActions: SidebarRightTabActions;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type SidebarRightOccurrenceId = Branded<'SidebarRightOccurrenceId'>
```
