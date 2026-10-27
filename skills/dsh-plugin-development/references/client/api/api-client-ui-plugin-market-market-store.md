# ui-plugin-market：market-store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-plugin-market 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## DiscoverFace client

入口 `@deepseek-ai/dsh-client-ui-plugin-market/client`，公开符号 `DiscoverFace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DiscoverFace {
    readonly hooks: {
        readonly discover: SnapshotStore<DiscoverState>;
        readonly locale: HostObservable<LocaleSnapshot>;
    };
    readonly resolveText: (text: LocalizedText) => string;
    readonly ensure: () => void;
    readonly reload: () => void;
    readonly select: (url: string) => void;
    readonly search: (query: DiscoverQuery) => void;
    readonly more: () => void;
    readonly refresh: () => void;
    readonly retry: () => void;
    readonly toggleSources: () => void;
    readonly editDraft: (text: string) => void;
    readonly addSource: () => void;
    readonly removeSource: (url: string) => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `readonly hooks: { readonly discover: SnapshotStore<DiscoverState>; readonly locale: HostObservable<LocaleSnapshot>; };` |
| `resolveText` | `readonly resolveText: (text: LocalizedText) => string;` |
| `ensure` | `readonly ensure: () => void;` |
| `reload` | `readonly reload: () => void;` |
| `select` | `readonly select: (url: string) => void;` |
| `search` | `readonly search: (query: DiscoverQuery) => void;` |
| `more` | `readonly more: () => void;` |
| `refresh` | `readonly refresh: () => void;` |
| `retry` | `readonly retry: () => void;` |
| `toggleSources` | `readonly toggleSources: () => void;` |
| `editDraft` | `readonly editDraft: (text: string) => void;` |
| `addSource` | `readonly addSource: () => void;` |
| `removeSource` | `readonly removeSource: (url: string) => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-market.md#接入-ui-plugin-market) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface DiscoverState {

  readonly status: 'idle' | 'loading' | 'ready' | 'error'
  readonly indexes: readonly MarketIndexSummary[]
  readonly selected: string | null
  readonly listing: ListingState | null

  readonly editing: boolean
  readonly draft: string
  readonly saving: boolean
  readonly sourceFailure: SourceFailure | null
}

export type SourceFailure =
  | { readonly kind: 'invalid' | 'duplicate' | 'unavailable' }
  | { readonly kind: 'other'; readonly reason: string }

export interface ListingState {
  readonly url: string
  readonly query: DiscoverQuery

  readonly status: 'loading' | 'more' | 'ready' | 'error'

  readonly value: MarketSearchResult | null

  readonly answered: DiscoverQuery | null
  readonly failure: ListingFailure | null
}

export type ListingFailure = 'fetch' | 'invalid' | 'changed'
```

## DiscoverState client

入口 `@deepseek-ai/dsh-client-ui-plugin-market/client`，公开符号 `DiscoverState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DiscoverState {
    readonly status: 'idle' | 'loading' | 'ready' | 'error';
    readonly indexes: readonly MarketIndexSummary[];
    readonly selected: string | null;
    readonly listing: ListingState | null;
    readonly editing: boolean;
    readonly draft: string;
    readonly saving: boolean;
    readonly sourceFailure: SourceFailure | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `readonly status: 'idle' \| 'loading' \| 'ready' \| 'error';` |
| `indexes` | `readonly indexes: readonly MarketIndexSummary[];` |
| `selected` | `readonly selected: string \| null;` |
| `listing` | `readonly listing: ListingState \| null;` |
| `editing` | `readonly editing: boolean;` |
| `draft` | `readonly draft: string;` |
| `saving` | `readonly saving: boolean;` |
| `sourceFailure` | `readonly sourceFailure: SourceFailure \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-plugin-market.md#接入-ui-plugin-market) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type SourceFailure =
  | { readonly kind: 'invalid' | 'duplicate' | 'unavailable' }
  | { readonly kind: 'other'; readonly reason: string }

export interface ListingState {
  readonly url: string
  readonly query: DiscoverQuery

  readonly status: 'loading' | 'more' | 'ready' | 'error'

  readonly value: MarketSearchResult | null

  readonly answered: DiscoverQuery | null
  readonly failure: ListingFailure | null
}

export type ListingFailure = 'fetch' | 'invalid' | 'changed'
```
