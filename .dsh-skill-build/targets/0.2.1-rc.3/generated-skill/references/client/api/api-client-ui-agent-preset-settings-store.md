# ui-agent-preset：settings-store 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-agent-preset 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## AGENT_PRESET_SETTINGS_NS client

入口 `@deepseek-ai/dsh-client-ui-agent-preset/client`，公开符号 `AGENT_PRESET_SETTINGS_NS`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const AGENT_PRESET_SETTINGS_NS = "agent-preset-registry";
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-agent-preset.md#接入-ui-agent-preset) 在真实装载路径检验成功、失败与卸载。

## AgentPresetOption client

入口 `@deepseek-ai/dsh-client-ui-agent-preset/client`，公开符号 `AgentPresetOption`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AgentPresetOption {
    id: string;
    name?: string;
    description?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `name` | `name?: string;` |
| `description` | `description?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-agent-preset.md#接入-ui-agent-preset) 在真实装载路径检验成功、失败与卸载。

## AgentPresetSettingsState client

入口 `@deepseek-ai/dsh-client-ui-agent-preset/client`，公开符号 `AgentPresetSettingsState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AgentPresetSettingsState {
    status: 'idle' | 'loading' | 'ready' | 'unavailable' | 'error';
    error: string | null;
    options: readonly AgentPresetOption[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `status: 'idle' \| 'loading' \| 'ready' \| 'unavailable' \| 'error';` |
| `error` | `error: string \| null;` |
| `options` | `options: readonly AgentPresetOption[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-agent-preset.md#接入-ui-agent-preset) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface AgentPresetOption {

  id: string

  name?: string

  description?: string
}
```

## writeDefaultPreset client

入口 `@deepseek-ai/dsh-client-ui-agent-preset/client`，公开符号 `writeDefaultPreset`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function writeDefaultPreset(ctx: ClientContext, id: string, expectedRevision?: number): Promise<string | undefined>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-agent-preset.md#接入-ui-agent-preset) 在真实装载路径检验成功、失败与卸载。
