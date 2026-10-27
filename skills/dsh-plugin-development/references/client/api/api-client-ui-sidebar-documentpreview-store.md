# ui-sidebar-documentpreview：store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-sidebar-documentpreview 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## TextPage client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `TextPage`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TextPage {
    readonly text: string;
    readonly lines: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `text` | `readonly text: string;` |
| `lines` | `readonly lines: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

## TextState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `TextState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TextState {
    byTab: Record<TabId, TextTabState>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `byTab` | `byTab: Record<TabId, TextTabState>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface TextTabState {
  autoRefresh: boolean
  resourcesDirty: boolean

  rendererId?: string

  mode?: DocumentLoadMode

  contentRendererId?: string

  loadRevision: number

  complete?: DocumentFileBytes

  version: string | undefined

  observedVersion: string | undefined

  pages: Record<number, TextPage>

  eof: boolean

  loading: boolean

  failure: RemoteFailure | undefined

  scrollTop: number

  wrap: boolean

  revision: number | undefined
}

export interface TextPage {
  readonly text: string
  readonly lines: number
}
```

## TextStore client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `TextStore`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TextStore = ReturnType<typeof createTextStore>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。

## TextTabState client

入口 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client`，公开符号 `TextTabState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface TextTabState {
    autoRefresh: boolean;
    resourcesDirty: boolean;
    rendererId?: string;
    mode?: DocumentLoadMode;
    contentRendererId?: string;
    loadRevision: number;
    complete?: DocumentFileBytes;
    version: string | undefined;
    observedVersion: string | undefined;
    pages: Record<number, TextPage>;
    eof: boolean;
    loading: boolean;
    failure: RemoteFailure | undefined;
    scrollTop: number;
    wrap: boolean;
    revision: number | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `autoRefresh` | `autoRefresh: boolean;` |
| `resourcesDirty` | `resourcesDirty: boolean;` |
| `rendererId` | `rendererId?: string;` |
| `mode` | `mode?: DocumentLoadMode;` |
| `contentRendererId` | `contentRendererId?: string;` |
| `loadRevision` | `loadRevision: number;` |
| `complete` | `complete?: DocumentFileBytes;` |
| `version` | `version: string \| undefined;` |
| `observedVersion` | `observedVersion: string \| undefined;` |
| `pages` | `pages: Record<number, TextPage>;` |
| `eof` | `eof: boolean;` |
| `loading` | `loading: boolean;` |
| `failure` | `failure: RemoteFailure \| undefined;` |
| `scrollTop` | `scrollTop: number;` |
| `wrap` | `wrap: boolean;` |
| `revision` | `revision: number \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-sidebar-documentpreview.md#接入-ui-sidebar-documentpreview) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface TextPage {
  readonly text: string
  readonly lines: number
}
```
