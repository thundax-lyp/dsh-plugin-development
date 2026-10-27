# ui-primitives：diffblock 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## DEFAULT_DIFF_MAX_LINES root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DEFAULT_DIFF_MAX_LINES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DEFAULT_DIFF_MAX_LINES = 16;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## DiffBlock root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DiffBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function DiffBlock({ diffs, labels, maxLines, className }: DiffBlockProps): import("react").JSX.Element | null;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface DiffBlockProps {

  diffs: DiffHunk[]

  labels: DiffBlockLabels

  maxLines?: number | undefined

  className?: string | undefined
}

export interface DiffBlockLabels extends CodeToolbarLabels {
  copy: string
  copied: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}

export interface DiffHunk {

  path: string

  oldText: string | null

  newText: string
}
```

## DiffBlockLabels root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DiffBlockLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DiffBlockLabels extends CodeToolbarLabels {
    copy: string;
    copied: string;
    collapseAria: string;
    expandAria: (hidden: number) => string;
    collapse: string;
    expand: (hidden: number) => string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `copy` | `copy: string;` |
| `copied` | `copied: string;` |
| `collapseAria` | `collapseAria: string;` |
| `expandAria` | `expandAria: (hidden: number) => string;` |
| `collapse` | `collapse: string;` |
| `expand` | `expand: (hidden: number) => string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## DiffBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DiffBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DiffBlockProps {
    diffs: DiffHunk[];
    labels: DiffBlockLabels;
    maxLines?: number | undefined;
    className?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `diffs` | `diffs: DiffHunk[];` |
| `labels` | `labels: DiffBlockLabels;` |
| `maxLines` | `maxLines?: number \| undefined;` |
| `className` | `className?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface DiffHunk {

  path: string

  oldText: string | null

  newText: string
}

export interface DiffBlockLabels extends CodeToolbarLabels {
  copy: string
  copied: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}
```

## DiffHunk root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DiffHunk`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DiffHunk {
    path: string;
    oldText: string | null;
    newText: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `path` | `path: string;` |
| `oldText` | `oldText: string \| null;` |
| `newText` | `newText: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## diffTotals root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `diffTotals`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function diffTotals(diffs: DiffHunk[]): {
    added: number;
    removed: number;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface DiffHunk {

  path: string

  oldText: string | null

  newText: string
}
```
