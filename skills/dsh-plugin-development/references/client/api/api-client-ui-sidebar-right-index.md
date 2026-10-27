# ui-sidebar-right：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。

## FloatRect client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `FloatRect`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [FloatRect 权威契约](api-client-ui-dockkit-types.md#floatrect-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `height` | `readonly height: number;` | [FloatRect 权威声明](api-client-ui-dockkit-types.md#floatrect-root) |
| `width` | `readonly width: number;` | [FloatRect 权威声明](api-client-ui-dockkit-types.md#floatrect-root) |
| `x` | `readonly x: number;` | [FloatRect 权威声明](api-client-ui-dockkit-types.md#floatrect-root) |

## PaneId client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `PaneId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PaneId 权威契约](api-client-ui-dockkit-types.md#paneid-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## TabId client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `TabId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TabId 权威契约](api-client-ui-dockkit-types.md#tabid-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## TabRecord client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `TabRecord`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [TabRecord 权威契约](api-client-ui-dockkit-types.md#tabrecord-root)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。



继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `contentId` | `readonly contentId: string;` | [TabRecord 权威声明](api-client-ui-dockkit-types.md#tabrecord-root) |
| `kind` | `readonly kind: string;` | [TabRecord 权威声明](api-client-ui-dockkit-types.md#tabrecord-root) |
| `title` | `readonly title: string;` | [TabRecord 权威声明](api-client-ui-dockkit-types.md#tabrecord-root) |
