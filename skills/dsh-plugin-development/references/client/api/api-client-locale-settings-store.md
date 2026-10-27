# locale：settings-store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

LocaleRuntime 管理字典与语言偏好。插件把自己的中英字典注册到唯一 namespace，并通过 bind 得到翻译函数；组件以 locale 声明让 renderer 注入 t，不能依赖 primitives 读取应用语言。字典注册返回清理入口，必须随插件退出释放。

## LanguageOptionRow client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LanguageOptionRow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LanguageOptionRow {
    id: string;
    label: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `label` | `label: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。

## LanguageRowState client

入口 `@deepseek-ai/dsh-client-locale/client`，公开符号 `LanguageRowState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface LanguageRowState {
    active: string;
    options: LanguageOptionRow[];
    revision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `active` | `active: string;` |
| `options` | `options: LanguageOptionRow[];` |
| `revision` | `revision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-locale.md#接入-locale) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface LanguageOptionRow {

  id: string

  label: string
}
```
