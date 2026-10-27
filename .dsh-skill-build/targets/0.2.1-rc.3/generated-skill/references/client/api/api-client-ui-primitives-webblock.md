# ui-primitives：webblock 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## WebBlock root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `WebBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function WebBlock(props: WebBlockProps): import("react").JSX.Element;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type WebBlockProps = WebSearchBlockProps | WebFetchBlockProps

export interface WebSearchBlockProps {
  kind: 'search'

  labels: WebBlockLabels

  answer?: string | undefined

  sources: WebSourceView[]

  truncated: boolean

  className?: string | undefined
}

export interface WebFetchBlockProps {
  kind: 'fetch'

  labels: WebBlockLabels

  url: string

  statusCode: number

  truncated: boolean

  className?: string | undefined
}

export interface WebBlockLabels {
  noResults: string
  sourcesTruncated: string
  http: string
  contentTruncated: string
  markdown: MarkdownLabels
}

export interface WebSourceView {

  url: string

  title?: string | undefined

  snippet?: string | undefined

  publishedAt?: string | undefined
}
```

## WebBlockLabels root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `WebBlockLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBlockLabels {
    noResults: string;
    sourcesTruncated: string;
    http: string;
    contentTruncated: string;
    markdown: MarkdownLabels;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `noResults` | `noResults: string;` |
| `sourcesTruncated` | `sourcesTruncated: string;` |
| `http` | `http: string;` |
| `contentTruncated` | `contentTruncated: string;` |
| `markdown` | `markdown: MarkdownLabels;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## WebBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `WebBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WebBlockProps = WebSearchBlockProps | WebFetchBlockProps;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebSearchBlockProps {
  kind: 'search'

  labels: WebBlockLabels

  answer?: string | undefined

  sources: WebSourceView[]

  truncated: boolean

  className?: string | undefined
}

export interface WebFetchBlockProps {
  kind: 'fetch'

  labels: WebBlockLabels

  url: string

  statusCode: number

  truncated: boolean

  className?: string | undefined
}

export interface WebBlockLabels {
  noResults: string
  sourcesTruncated: string
  http: string
  contentTruncated: string
  markdown: MarkdownLabels
}

export interface WebSourceView {

  url: string

  title?: string | undefined

  snippet?: string | undefined

  publishedAt?: string | undefined
}
```

## WebFetchBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `WebFetchBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebFetchBlockProps {
    kind: 'fetch';
    labels: WebBlockLabels;
    url: string;
    statusCode: number;
    truncated: boolean;
    className?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'fetch';` |
| `labels` | `labels: WebBlockLabels;` |
| `url` | `url: string;` |
| `statusCode` | `statusCode: number;` |
| `truncated` | `truncated: boolean;` |
| `className` | `className?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebBlockLabels {
  noResults: string
  sourcesTruncated: string
  http: string
  contentTruncated: string
  markdown: MarkdownLabels
}
```

## WebSearchBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `WebSearchBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebSearchBlockProps {
    kind: 'search';
    labels: WebBlockLabels;
    answer?: string | undefined;
    sources: WebSourceView[];
    truncated: boolean;
    className?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'search';` |
| `labels` | `labels: WebBlockLabels;` |
| `answer` | `answer?: string \| undefined;` |
| `sources` | `sources: WebSourceView[];` |
| `truncated` | `truncated: boolean;` |
| `className` | `className?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebSourceView {

  url: string

  title?: string | undefined

  snippet?: string | undefined

  publishedAt?: string | undefined
}

export interface WebBlockLabels {
  noResults: string
  sourcesTruncated: string
  http: string
  contentTruncated: string
  markdown: MarkdownLabels
}
```

## WebSourceView root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `WebSourceView`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebSourceView {
    url: string;
    title?: string | undefined;
    snippet?: string | undefined;
    publishedAt?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `url` | `url: string;` |
| `title` | `title?: string \| undefined;` |
| `snippet` | `snippet?: string \| undefined;` |
| `publishedAt` | `publishedAt?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。
