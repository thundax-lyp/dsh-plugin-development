# ui-sidebar-right：stores 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。

## OpenContentIntent client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `OpenContentIntent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface OpenContentIntent {
    readonly kind: string;
    readonly contentId: string;
    readonly title: string;
    readonly paneId?: PaneId;
    readonly preferNewPane?: boolean;
    readonly replaceTab?: TabId;
    readonly revealIfOpened?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `readonly kind: string;` |
| `contentId` | `readonly contentId: string;` |
| `title` | `readonly title: string;` |
| `paneId` | `readonly paneId?: PaneId;` |
| `preferNewPane` | `readonly preferNewPane?: boolean;` |
| `replaceTab` | `readonly replaceTab?: TabId;` |
| `revealIfOpened` | `readonly revealIfOpened?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SidebarRightState {
    bySession: Record<string, SurfaceState>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `bySession` | `bySession: Record<string, SurfaceState>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SurfaceState {
  readonly layout: LayoutState
  readonly history: History

  readonly minted: number
}
```

## SurfaceState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SurfaceState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SurfaceState {
    readonly layout: LayoutState;
    readonly history: History;
    readonly minted: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `layout` | `readonly layout: LayoutState;` |
| `history` | `readonly history: History;` |
| `minted` | `readonly minted: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。
