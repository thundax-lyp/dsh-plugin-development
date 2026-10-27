# ui-theme：settings-store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ThemeRuntime 由浏览器插件提供，不由消费者直接构造。getTheme 读稳定快照；register 注册主题并返回 disposer，重复 id 与 system id 抛错；移除当前主题回退默认偏好。overrideTokens 按 source 叠加 light/dark 值对，后注册层逐 token 覆盖，旧层 disposer 不会删除同 source 的新层。设置操作通过 Host settings scope 持久化；CSS tokens 本身不产生模型可见事实。

## AppearanceRowState client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `AppearanceRowState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AppearanceRowState {
    preference: ThemePreference;
    revision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `preference` | `preference: ThemePreference;` |
| `revision` | `revision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。

## FontRowState client

入口 `@deepseek-ai/dsh-client-ui-theme/client`，公开符号 `FontRowState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FontRowState {
    fontSizes: FontSizes;
    fontFamilies: FontFamilies;
    revision: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `fontSizes` | `fontSizes: FontSizes;` |
| `fontFamilies` | `fontFamilies: FontFamilies;` |
| `revision` | `revision: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-theme.md#接入-ui-theme) 在真实装载路径检验成功、失败与卸载。
