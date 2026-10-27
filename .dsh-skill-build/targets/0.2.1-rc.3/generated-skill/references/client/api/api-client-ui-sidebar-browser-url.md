# ui-sidebar-browser：url 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-browser 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## BrowserAddressFailure client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserAddressFailure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BrowserAddressFailure = 'empty' | 'invalid' | 'protocol' | 'credentials' | 'application-origin';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

## BrowserAddressResult client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserAddressResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BrowserAddressResult = {
    readonly ok: true;
    readonly target: BrowserTarget;
} | {
    readonly ok: false;
    readonly reason: BrowserAddressFailure;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type BrowserTarget =
  | { readonly kind: 'https'; readonly url: string; readonly title: string }
  | { readonly kind: 'http'; readonly url: string; readonly title: string }

export type BrowserAddressFailure = 'empty' | 'invalid' | 'protocol' | 'credentials' | 'application-origin'
```

## BrowserTarget client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserTarget`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type BrowserTarget = {
    readonly kind: 'https';
    readonly url: string;
    readonly title: string;
} | {
    readonly kind: 'http';
    readonly url: string;
    readonly title: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。
