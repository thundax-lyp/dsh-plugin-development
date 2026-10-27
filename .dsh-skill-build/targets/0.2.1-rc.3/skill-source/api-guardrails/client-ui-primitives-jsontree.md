# ui-primitives：jsontree 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## JsonTree root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `JsonTree`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function JsonTree({ data, label, className, collapsedStringLines, stringWrapping, copyable, expandTopLevel, labels, }: JsonTreeProps): import("react").JSX.Element;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface JsonTreeProps {

  data: object | unknown[]

  label: string

  className?: string | undefined

  collapsedStringLines?: number

  stringWrapping?: {

    label: string

    getDefault: () => boolean

    setDefault: (wrapped: boolean) => void
  } | undefined

  copyable?: boolean

  expandTopLevel?: boolean

  labels: JsonTreeLabels
}

export interface JsonTreeLabels {

  copyValue: string

  copyJson: string

  copyPath: string

  copyPrettyJson: string

  copyCompactJson: string

  copied: string

  copyFailed: string

  collapseNode: string

  expandNode: string

  copyButtonTitle: (action: string) => string
}
```

## JsonTreeLabels root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `JsonTreeLabels`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface JsonTreeLabels {
    copyValue: string;
    copyJson: string;
    copyPath: string;
    copyPrettyJson: string;
    copyCompactJson: string;
    copied: string;
    copyFailed: string;
    collapseNode: string;
    expandNode: string;
    copyButtonTitle: (action: string) => string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `copyValue` | `copyValue: string;` |
| `copyJson` | `copyJson: string;` |
| `copyPath` | `copyPath: string;` |
| `copyPrettyJson` | `copyPrettyJson: string;` |
| `copyCompactJson` | `copyCompactJson: string;` |
| `copied` | `copied: string;` |
| `copyFailed` | `copyFailed: string;` |
| `collapseNode` | `collapseNode: string;` |
| `expandNode` | `expandNode: string;` |
| `copyButtonTitle` | `copyButtonTitle: (action: string) => string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。

## JsonTreeProps root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `JsonTreeProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface JsonTreeProps {
    data: object | unknown[];
    label: string;
    className?: string | undefined;
    collapsedStringLines?: number;
    stringWrapping?: {
        label: string;
        getDefault: () => boolean;
        setDefault: (wrapped: boolean) => void;
    } | undefined;
    copyable?: boolean;
    expandTopLevel?: boolean;
    labels: JsonTreeLabels;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `data` | `data: object \| unknown[];` |
| `label` | `label: string;` |
| `className` | `className?: string \| undefined;` |
| `collapsedStringLines` | `collapsedStringLines?: number;` |
| `stringWrapping` | `stringWrapping?: { label: string; getDefault: () => boolean; setDefault: (wrapped: boolean) => void; } \| undefined;` |
| `copyable` | `copyable?: boolean;` |
| `expandTopLevel` | `expandTopLevel?: boolean;` |
| `labels` | `labels: JsonTreeLabels;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface JsonTreeLabels {

  copyValue: string

  copyJson: string

  copyPath: string

  copyPrettyJson: string

  copyCompactJson: string

  copied: string

  copyFailed: string

  collapseNode: string

  expandNode: string

  copyButtonTitle: (action: string) => string
}
```
