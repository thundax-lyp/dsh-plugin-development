# ui-settings-models：operations 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-models 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ModelDiscoveryOutcome client

入口 `@deepseek-ai/dsh-client-ui-settings-models/client`，公开符号 `ModelDiscoveryOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ModelDiscoveryOutcome = {
    readonly kind: 'found';
    readonly models: readonly LlmDiscoveredModel[];
} | {
    readonly kind: 'refused';
    readonly message: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) 在真实装载路径检验成功、失败与卸载。

## ModelsOperations client

入口 `@deepseek-ai/dsh-client-ui-settings-models/client`，公开符号 `ModelsOperations`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ModelsOperations {
    storeCredential(ref: string, value: string): Promise<string | undefined>;
    removeCredential(ref: string): Promise<string | undefined>;
    writeSettings(ns: string, ops: SettingsPathOpView[], expectedRevision: number | undefined): Promise<SettingsWriteOutcome>;
    discoverModels(settingsNs: string, request: LlmModelDiscoveryRequest): Promise<ModelDiscoveryOutcome>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `storeCredential` | `storeCredential(ref: string, value: string): Promise<string \| undefined>;` |
| `removeCredential` | `removeCredential(ref: string): Promise<string \| undefined>;` |
| `writeSettings` | `writeSettings(ns: string, ops: SettingsPathOpView[], expectedRevision: number \| undefined): Promise<SettingsWriteOutcome>;` |
| `discoverModels` | `discoverModels(settingsNs: string, request: LlmModelDiscoveryRequest): Promise<ModelDiscoveryOutcome>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SettingsWriteOutcome =

  | { readonly kind: 'written'; readonly view: SettingsNamespaceView }

  | { readonly kind: 'conflict'; readonly message: string }

  | { readonly kind: 'refused'; readonly message: string }

export type ModelDiscoveryOutcome =

  | { readonly kind: 'found'; readonly models: readonly LlmDiscoveredModel[] }

  | { readonly kind: 'refused'; readonly message: string }
```

## SettingsWriteOutcome client

入口 `@deepseek-ai/dsh-client-ui-settings-models/client`，公开符号 `SettingsWriteOutcome`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SettingsWriteOutcome = {
    readonly kind: 'written';
    readonly view: SettingsNamespaceView;
} | {
    readonly kind: 'conflict';
    readonly message: string;
} | {
    readonly kind: 'refused';
    readonly message: string;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-models.md#接入-ui-settings-models) 在真实装载路径检验成功、失败与卸载。
