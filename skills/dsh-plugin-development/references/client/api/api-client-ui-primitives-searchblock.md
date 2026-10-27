# ui-primitives：searchblock 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## DEFAULT_SEARCH_MAX_LINES root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DEFAULT_SEARCH_MAX_LINES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DEFAULT_SEARCH_MAX_LINES = 16;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SearchBlock root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function SearchBlock(props: SearchBlockProps): import("react").JSX.Element;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SearchBlockProps = SearchMatchesBlockProps | SearchPathsBlockProps

export interface SearchMatchesBlockProps extends SearchBlockCommon {
  kind: 'matches'

  files: SearchFileGroup[]
}

export interface SearchPathsBlockProps extends SearchBlockCommon {
  kind: 'paths'

  paths: string[]
}

export interface SearchFileGroup {

  path: string

  matches: SearchBlockLineMatch[]
}

interface SearchBlockCommon {

  labels: SearchBlockLabels

  truncated: boolean

  total: number

  maxLines?: number | undefined

  className?: string | undefined
}

export interface SearchBlockLabels {
  pathsSummary: (shown: number, total: number, truncated: boolean) => string
  matchesSummary: (shown: number, total: number, files: number, truncated: boolean) => string
  copy: string
  copied: string
  noResults: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}

export interface SearchBlockLineMatch {

  lineNumber: number

  line: string
}
```

## SearchBlockLabels root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchBlockLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SearchBlockLabels {
    pathsSummary: (shown: number, total: number, truncated: boolean) => string;
    matchesSummary: (shown: number, total: number, files: number, truncated: boolean) => string;
    copy: string;
    copied: string;
    noResults: string;
    collapseAria: string;
    expandAria: (hidden: number) => string;
    collapse: string;
    expand: (hidden: number) => string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `pathsSummary` | `pathsSummary: (shown: number, total: number, truncated: boolean) => string;` |
| `matchesSummary` | `matchesSummary: (shown: number, total: number, files: number, truncated: boolean) => string;` |
| `copy` | `copy: string;` |
| `copied` | `copied: string;` |
| `noResults` | `noResults: string;` |
| `collapseAria` | `collapseAria: string;` |
| `expandAria` | `expandAria: (hidden: number) => string;` |
| `collapse` | `collapse: string;` |
| `expand` | `expand: (hidden: number) => string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SearchBlockLineMatch root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchBlockLineMatch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SearchBlockLineMatch {
    lineNumber: number;
    line: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `lineNumber` | `lineNumber: number;` |
| `line` | `line: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## SearchBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SearchBlockProps = SearchMatchesBlockProps | SearchPathsBlockProps;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SearchBlockLabels {
  pathsSummary: (shown: number, total: number, truncated: boolean) => string
  matchesSummary: (shown: number, total: number, files: number, truncated: boolean) => string
  copy: string
  copied: string
  noResults: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}

export interface SearchMatchesBlockProps extends SearchBlockCommon {
  kind: 'matches'

  files: SearchFileGroup[]
}

export interface SearchPathsBlockProps extends SearchBlockCommon {
  kind: 'paths'

  paths: string[]
}

export interface SearchFileGroup {

  path: string

  matches: SearchBlockLineMatch[]
}

interface SearchBlockCommon {

  labels: SearchBlockLabels

  truncated: boolean

  total: number

  maxLines?: number | undefined

  className?: string | undefined
}

export interface SearchBlockLineMatch {

  lineNumber: number

  line: string
}
```

## SearchFileGroup root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchFileGroup`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SearchFileGroup {
    path: string;
    matches: SearchBlockLineMatch[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `path` | `path: string;` |
| `matches` | `matches: SearchBlockLineMatch[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SearchBlockLineMatch {

  lineNumber: number

  line: string
}
```

## SearchMatchesBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchMatchesBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SearchMatchesBlockProps extends SearchBlockCommon {
    kind: 'matches';
    files: SearchFileGroup[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'matches';` |
| `files` | `files: SearchFileGroup[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface SearchFileGroup {

  path: string

  matches: SearchBlockLineMatch[]
}

interface SearchBlockCommon {

  labels: SearchBlockLabels

  truncated: boolean

  total: number

  maxLines?: number | undefined

  className?: string | undefined
}

export interface SearchBlockLabels {
  pathsSummary: (shown: number, total: number, truncated: boolean) => string
  matchesSummary: (shown: number, total: number, files: number, truncated: boolean) => string
  copy: string
  copied: string
  noResults: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}

export interface SearchBlockLineMatch {

  lineNumber: number

  line: string
}
```

## SearchPathsBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `SearchPathsBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface SearchPathsBlockProps extends SearchBlockCommon {
    kind: 'paths';
    paths: string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `kind` | `kind: 'paths';` |
| `paths` | `paths: string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
interface SearchBlockCommon {

  labels: SearchBlockLabels

  truncated: boolean

  total: number

  maxLines?: number | undefined

  className?: string | undefined
}

export interface SearchBlockLabels {
  pathsSummary: (shown: number, total: number, truncated: boolean) => string
  matchesSummary: (shown: number, total: number, files: number, truncated: boolean) => string
  copy: string
  copied: string
  noResults: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}
```
