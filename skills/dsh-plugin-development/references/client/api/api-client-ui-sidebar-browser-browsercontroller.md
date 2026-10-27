# ui-sidebar-browser：browsercontroller 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-browser 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## BrowserControllerState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserControllerState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BrowserControllerState {
    readonly frame: BrowserFrameState;
    readonly restoreTarget: BrowserTarget | undefined;
    readonly addressFailure: BrowserAddressFailure | undefined;
    readonly addressRevision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `frame` | `readonly frame: BrowserFrameState;` |
| `restoreTarget` | `readonly restoreTarget: BrowserTarget \| undefined;` |
| `addressFailure` | `readonly addressFailure: BrowserAddressFailure \| undefined;` |
| `addressRevision` | `readonly addressRevision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

## BrowserInjected client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BrowserInjected {
    readonly keyedHooks: {
        readonly browserState: (key: string) => HostObservable<BrowserControllerState> | undefined;
    };
    mount(request: BrowserMountRequest): () => void;
    dispose(): Promise<void>;
    rebind(actions: BoundActions<BrowserStore>): void;
    loadUrl(tabId: TabId, value: string): void;
    restore(tabId: TabId): void;
    goBack(tabId: TabId): void;
    goForward(tabId: TabId): void;
    reload(tabId: TabId): void;
    setSandbox(tabId: TabId, enabled: boolean): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `keyedHooks` | `readonly keyedHooks: { readonly browserState: (key: string) => HostObservable<BrowserControllerState> \| undefined; };` |
| `mount` | `mount(request: BrowserMountRequest): () => void;` |
| `dispose` | `dispose(): Promise<void>;` |
| `rebind` | `rebind(actions: BoundActions<BrowserStore>): void;` |
| `loadUrl` | `loadUrl(tabId: TabId, value: string): void;` |
| `restore` | `restore(tabId: TabId): void;` |
| `goBack` | `goBack(tabId: TabId): void;` |
| `goForward` | `goForward(tabId: TabId): void;` |
| `reload` | `reload(tabId: TabId): void;` |
| `setSandbox` | `setSandbox(tabId: TabId, enabled: boolean): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface BrowserControllerState {
  readonly frame: BrowserFrameState

  readonly restoreTarget: BrowserTarget | undefined
  readonly addressFailure: BrowserAddressFailure | undefined
  readonly addressRevision: number
}

export interface BrowserMountRequest {
  readonly tabId: TabId
  readonly signal: AbortSignal
  readonly viewportId: string
  readonly applicationOrigin: string
  readonly initial: BrowserTabState | undefined
  readonly initialUrl: string | undefined
  readonly openTab: (url: string) => void
}
```

## BrowserMountRequest client

入口 `@deepseek-ai/dsh-client-ui-sidebar-browser/client`，公开符号 `BrowserMountRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BrowserMountRequest {
    readonly tabId: TabId;
    readonly signal: AbortSignal;
    readonly viewportId: string;
    readonly applicationOrigin: string;
    readonly initial: BrowserTabState | undefined;
    readonly initialUrl: string | undefined;
    readonly openTab: (url: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `tabId` | `readonly tabId: TabId;` |
| `signal` | `readonly signal: AbortSignal;` |
| `viewportId` | `readonly viewportId: string;` |
| `applicationOrigin` | `readonly applicationOrigin: string;` |
| `initial` | `readonly initial: BrowserTabState \| undefined;` |
| `initialUrl` | `readonly initialUrl: string \| undefined;` |
| `openTab` | `readonly openTab: (url: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-browser.md#接入-ui-sidebar-browser) 在真实装载路径检验成功、失败与卸载。
