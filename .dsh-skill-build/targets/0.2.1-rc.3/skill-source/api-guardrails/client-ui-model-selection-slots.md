# ui-model-selection：slots 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-model-selection 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ModelLabelOwner client

入口 `@deepseek-ai/dsh-client-ui-model-selection/client`，公开符号 `ModelLabelOwner`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ModelLabelOwner {
    provider: Pick<ModelProviderGroup, 'id' | 'name'>;
    model: ModelCatalogModel;
    placement: 'trigger' | 'menu' | 'option';
    selected: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `provider` | `provider: Pick<ModelProviderGroup, 'id' \| 'name'>;` |
| `model` | `model: ModelCatalogModel;` |
| `placement` | `placement: 'trigger' \| 'menu' \| 'option';` |
| `selected` | `selected: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-model-selection.md#接入-ui-model-selection) 在真实装载路径检验成功、失败与卸载。

## ModelSelectInjected client

入口 `@deepseek-ai/dsh-client-ui-model-selection/client`，公开符号 `ModelSelectInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ModelSelectInjected {
    available: boolean;
    directory: SnapshotStore<ModelDirectoryState>;
    load: () => void;
    select: (selection: ModelSelection) => Promise<RemoteResult<void> | undefined>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `available` | `available: boolean;` |
| `directory` | `directory: SnapshotStore<ModelDirectoryState>;` |
| `load` | `load: () => void;` |
| `select` | `select: (selection: ModelSelection) => Promise<RemoteResult<void> \| undefined>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-model-selection.md#接入-ui-model-selection) 在真实装载路径检验成功、失败与卸载。
