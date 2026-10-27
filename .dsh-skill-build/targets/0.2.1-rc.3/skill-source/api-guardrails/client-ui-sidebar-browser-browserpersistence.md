# ui-sidebar-browser：browserpersistence 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-browser 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## BrowserFailure client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserFailure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BrowserFailure = {
    readonly kind: 'address';
    readonly reason: BrowserAddressFailure;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

## BrowserHistoryEntry client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserHistoryEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BrowserHistoryEntry = BrowserTarget;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

## BrowserNavigationStatus client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserNavigationStatus`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BrowserNavigationStatus = {
    readonly status: 'empty';
} | {
    readonly status: 'loading';
    readonly revision: number;
} | {
    readonly status: 'known';
    readonly revision: number;
} | {
    readonly status: 'unknown';
    readonly revision: number;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

## BrowserTabState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserTabState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BrowserTabState {
    readonly entries: readonly BrowserHistoryEntry[];
    readonly index: number;
    readonly request: {
        readonly revision: number;
        readonly target: BrowserTarget;
    } | undefined;
    readonly navigation: BrowserNavigationStatus;
    readonly failure: BrowserFailure | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `entries` | `readonly entries: readonly BrowserHistoryEntry[];` |
| `index` | `readonly index: number;` |
| `request` | `readonly request: { readonly revision: number; readonly target: BrowserTarget; } \| undefined;` |
| `navigation` | `readonly navigation: BrowserNavigationStatus;` |
| `failure` | `readonly failure: BrowserFailure \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type BrowserHistoryEntry = BrowserTarget

export type BrowserNavigationStatus =
  | { readonly status: 'empty' }
  | { readonly status: 'loading'; readonly revision: number }
  | { readonly status: 'known'; readonly revision: number }
  | { readonly status: 'unknown'; readonly revision: number }

export type BrowserFailure = { readonly kind: 'address'; readonly reason: BrowserAddressFailure }
```
