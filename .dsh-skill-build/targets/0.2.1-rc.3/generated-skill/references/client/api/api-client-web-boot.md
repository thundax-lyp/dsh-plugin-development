# web：boot 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Web shell 的 baseline module table 共享 react、react/jsx-runtime、react-dom、react-dom/client、@deepseek-ai/cordis、zod、@tanstack/react-virtual、dsh-client-store、dsh-client-ui-slots、dsh-client-ui-primitives、dsh-client-ui-dockkit。动态插件复用这些身份，不能把另一个 React 或 Cordis bundle 进自己的 factory。

## AppWebEntry root

入口 `@deepseek-ai/dsh-client-web`，公开符号 `AppWebEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class AppWebEntry {
    constructor(container: HTMLElement, seams?: BootSeams);
    run(onFailure?: (reason: unknown) => void): Promise<void>;
    dispose(): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(container: HTMLElement, seams?: BootSeams);` |
| `run` | `run(onFailure?: (reason: unknown) => void): Promise<void>;` |
| `dispose` | `dispose(): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-web.md#接入-web) 在真实装载路径检验成功、失败与卸载。

## BootSeams root

入口 `@deepseek-ai/dsh-client-web`，公开符号 `BootSeams`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BootSeams = Pick<ClientModuleCreateOptions, 'loadBundle'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-web.md#接入-web) 在真实装载路径检验成功、失败与卸载。
