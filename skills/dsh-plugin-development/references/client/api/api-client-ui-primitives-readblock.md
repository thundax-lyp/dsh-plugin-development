# ui-primitives：readblock 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## DEFAULT_READ_MAX_LINES root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `DEFAULT_READ_MAX_LINES`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const DEFAULT_READ_MAX_LINES = 16;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## ReadBlock root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `ReadBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function ReadBlock({ label, labels, lines, totalLines, lang, maxLines, className, }: ReadBlockProps): import("react").JSX.Element;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ReadBlockProps {

  label?: string | undefined

  lines: readonly ReadBlockLine[]

  labels: ReadBlockLabels

  totalLines: number

  lang?: string | undefined

  maxLines?: number | undefined

  className?: string | undefined
}

export interface ReadBlockLabels extends CodeToolbarLabels {
  window: (shown: number, total: number) => string
  copy: string
  copied: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}

export interface ReadBlockLine {

  number: number

  text: string
}
```

## ReadBlockLabels root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `ReadBlockLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReadBlockLabels extends CodeToolbarLabels {
    window: (shown: number, total: number) => string;
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
| `window` | `window: (shown: number, total: number) => string;` |
| `copy` | `copy: string;` |
| `copied` | `copied: string;` |
| `collapseAria` | `collapseAria: string;` |
| `expandAria` | `expandAria: (hidden: number) => string;` |
| `collapse` | `collapse: string;` |
| `expand` | `expand: (hidden: number) => string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## ReadBlockLine root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `ReadBlockLine`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReadBlockLine {
    number: number;
    text: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `number` | `number: number;` |
| `text` | `text: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## ReadBlockProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `ReadBlockProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ReadBlockProps {
    label?: string | undefined;
    lines: readonly ReadBlockLine[];
    labels: ReadBlockLabels;
    totalLines: number;
    lang?: string | undefined;
    maxLines?: number | undefined;
    className?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `label` | `label?: string \| undefined;` |
| `lines` | `lines: readonly ReadBlockLine[];` |
| `labels` | `labels: ReadBlockLabels;` |
| `totalLines` | `totalLines: number;` |
| `lang` | `lang?: string \| undefined;` |
| `maxLines` | `maxLines?: number \| undefined;` |
| `className` | `className?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ReadBlockLine {

  number: number

  text: string
}

export interface ReadBlockLabels extends CodeToolbarLabels {
  window: (shown: number, total: number) => string
  copy: string
  copied: string
  collapseAria: string
  expandAria: (hidden: number) => string
  collapse: string
  expand: (hidden: number) => string
}
```
