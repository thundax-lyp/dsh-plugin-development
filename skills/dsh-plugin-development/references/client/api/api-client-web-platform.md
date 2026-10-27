# web：platform 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Web shell 的 baseline module table 共享 react、react/jsx-runtime、react-dom、react-dom/client、@deepseek-ai/cordis、zod、@tanstack/react-virtual、dsh-client-store、dsh-client-ui-slots、dsh-client-ui-primitives、dsh-client-ui-dockkit。动态插件复用这些身份，不能把另一个 React 或 Cordis bundle 进自己的 factory。

## PLATFORM_MODULES root

入口 `@deepseek-ai/dsh-client-web`，公开符号 `PLATFORM_MODULES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const PLATFORM_MODULES: readonly [
    "react",
    "react/jsx-runtime",
    "react-dom",
    "react-dom/client",
    "@deepseek-ai/cordis",
    "zod",
    "@tanstack/react-virtual",
    "@deepseek-ai/dsh-client-store",
    "@deepseek-ai/dsh-client-ui-slots",
    "@deepseek-ai/dsh-client-ui-primitives",
    "@deepseek-ai/dsh-client-ui-dockkit"
];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-web.md#接入-web) 在真实装载路径检验成功、失败与卸载。

## PRELOADED_CLIENT_EXTERNALS root

入口 `@deepseek-ai/dsh-client-web`，公开符号 `PRELOADED_CLIENT_EXTERNALS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const PRELOADED_CLIENT_EXTERNALS: readonly [
];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-web.md#接入-web) 在真实装载路径检验成功、失败与卸载。

## PlatformModule root

入口 `@deepseek-ai/dsh-client-web`，公开符号 `PlatformModule`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PlatformModule = (typeof PLATFORM_MODULES)[number];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-web.md#接入-web) 在真实装载路径检验成功、失败与卸载。
