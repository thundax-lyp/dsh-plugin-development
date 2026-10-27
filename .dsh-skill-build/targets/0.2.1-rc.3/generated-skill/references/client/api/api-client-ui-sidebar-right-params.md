# ui-sidebar-right：params 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

新增 tab 分两步：ctx.sidebarRightTabs.register 注册静态定义，再在 sidebar.right.pane.tab 用 definition.id 为 key 注册 Body。kind 表示内容类别，id 表示实现身份，两者不能混用。类型默认 extension，排序为 extension、builtin、fallback，再按匹配模式长度与注册顺序；同 kind 仅允许一个 builtin 加一个 extension。正文通过 useTabInfo 获取 sidebar、panel、tab；tab.signal 在记录消失或插件卸载时中止，切 Session 与收起不销毁它。openResource 需要 dsh-resource:// URI；openTab 按已注册 kind 打开。布局保存 localStorage，导航 params、资源内容与活动连接不在布局中。

## SidebarRightNavigationParams client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightNavigationParams`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRightNavigationParams = ValuesOf<{
    resource: SidebarRightResourceParams;
    tab: SidebarRightTabParams;
}>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type ValuesOf<T> = T[keyof T]

export type SidebarRightResourceParams = ValuesOf<{
  declared: SidebarRightResourceParamsMap[keyof SidebarRightResourceParamsMap]
  none: undefined
}>

export type SidebarRightTabParams = ValuesOf<{
  declared: SidebarRightTabParamsMap[keyof SidebarRightTabParamsMap]
  none: undefined
}>

export interface SidebarRightResourceParamsMap {}

export interface SidebarRightTabParamsMap {}
```

## SidebarRightResourceParams client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightResourceParams`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRightResourceParams = ValuesOf<{
    declared: SidebarRightResourceParamsMap[keyof SidebarRightResourceParamsMap];
    none: undefined;
}>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type ValuesOf<T> = T[keyof T]

export interface SidebarRightResourceParamsMap {}
```

## SidebarRightResourceParamsMap client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightResourceParamsMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-sidebar-right`、`@deepseek-ai/dsh-client-ui-sidebar-documentpreview`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface SidebarRightResourceParamsMap {
}

interface SidebarRightResourceParamsMap {
    file: WorkspaceFileParams;
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

## SidebarRightTabParams client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabParams`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRightTabParams = ValuesOf<{
    declared: SidebarRightTabParamsMap[keyof SidebarRightTabParamsMap];
    none: undefined;
}>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
type ValuesOf<T> = T[keyof T]

export interface SidebarRightTabParamsMap {}
```

## SidebarRightTabParamsFor client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabParamsFor`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarRightTabParamsFor<K extends string> = (K extends keyof SidebarRightTabParamsMap ? SidebarRightTabParamsMap[K] : never) | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SidebarRightTabParamsMap {}
```

## SidebarRightTabParamsMap client

入口 `@deepseek-ai/dsh-client-ui-sidebar-right/client`，公开符号 `SidebarRightTabParamsMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

同名接口还包含声明合并：以下后续声明分别来自 `@deepseek-ai/dsh-client-ui-sidebar-right`、`@deepseek-ai/dsh-client-ui-sidebar-browser`。只有消费编译面实际导入相应包声明时，这些字段才加入类型；运行时还须由相应包声明 slot 或提供业务数据。不能由类型合并推定这些能力已在当前 Profile 挂载。

```text
export interface SidebarRightTabParamsMap {
}

interface SidebarRightTabParamsMap {
    browser: {
        readonly url?: string;
    };
}
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right) 在真实装载路径检验成功、失败与卸载。
