# ui-settings-plugins：pluginssettingssection 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

插件配置页由 Host 公开的 schema 与配置作用域驱动。自定义页使用 ConfigPageForm 的 state/mutate，不自行写 profile 文件。对其它插件页面的附加内容注册 plugins.detail.actions、plugins.detail.badge 或 plugins.detail.section，并按 subject.kind 的 bundle、row、item 分支处理；不相关 subject 返回 null。

## PluginsSettingsSectionInjected client

入口 `@deepseek-ai/dsh-client-ui-settings-plugins/client`，公开符号 `PluginsSettingsSectionInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PluginsSettingsSectionInjected {
    hooks: {
        tabs: HostObservable<readonly PluginsSettingsTabEntry[]>;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { tabs: HostObservable<readonly PluginsSettingsTabEntry[]>; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-plugins.md#接入-ui-settings-plugins) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface PluginsSettingsTabEntry {
  id: string
  order: number
  label: string
}
```

## PluginsSettingsSectionProps client

入口 `@deepseek-ai/dsh-client-ui-settings-plugins/client`，公开符号 `PluginsSettingsSectionProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PluginsSettingsSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.plugins'> & PropsRenderSlots<'settings.plugins.tab'> & InjectFace<PluginsSettingsSectionInjected>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-plugins.md#接入-ui-settings-plugins) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface PluginsSettingsSectionInjected {
  hooks: {

    tabs: HostObservable<readonly PluginsSettingsTabEntry[]>
  }
}

export interface PluginsSettingsTabEntry {
  id: string
  order: number
  label: string
}
```
