# ui-model-selection：directory 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-model-selection 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## ModelDirectory client

入口 `@deepseek-ai/dsh-client-ui-model-selection/client`，公开符号 `ModelDirectory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ModelDirectory {
    readonly store: SnapshotStore<ModelDirectoryState>;
    constructor(sessions: Pick<TypertClientRemote['session'], 'selectModel'>, sessionId: SessionId, available: () => boolean, catalog: ModelCatalogDirectory, projected: ObservableSnapshot<unknown>, isBlank: () => boolean, track?: TrackProductEvent | undefined);
    load(): Promise<ModelDirectoryState>;
    select(selection: ModelSelection): Promise<RemoteResult<void>>;
    resetConnected(): void;
    dispose(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `store` | `readonly store: SnapshotStore<ModelDirectoryState>;` |
| `constructor` | `constructor(sessions: Pick<TypertClientRemote['session'], 'selectModel'>, sessionId: SessionId, available: () => boolean, catalog: ModelCatalogDirectory, projected: ObservableSnapshot<unknown>, isBlank: () => boolean, track?: TrackProductEvent \| undefined);` |
| `load` | `load(): Promise<ModelDirectoryState>;` |
| `select` | `select(selection: ModelSelection): Promise<RemoteResult<void>>;` |
| `resetConnected` | `resetConnected(): void;` |
| `dispose` | `dispose(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-model-selection.md#接入-ui-model-selection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ModelDirectoryState {

  current: ModelSelection | null

  retainedEffort?: string

  routable: boolean | null

  groups: readonly ModelProviderGroup[]

  failures: readonly ModelCatalogFailure[]

  status: 'idle' | 'loading' | 'ready' | 'selecting' | 'error'

  pending: ModelSelection | null

  error: string | null
}
```

## ModelDirectoryState client

入口 `@deepseek-ai/dsh-client-ui-model-selection/client`，公开符号 `ModelDirectoryState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ModelDirectoryState {
    current: ModelSelection | null;
    retainedEffort?: string;
    routable: boolean | null;
    groups: readonly ModelProviderGroup[];
    failures: readonly ModelCatalogFailure[];
    status: 'idle' | 'loading' | 'ready' | 'selecting' | 'error';
    pending: ModelSelection | null;
    error: string | null;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `current` | `current: ModelSelection \| null;` |
| `retainedEffort` | `retainedEffort?: string;` |
| `routable` | `routable: boolean \| null;` |
| `groups` | `groups: readonly ModelProviderGroup[];` |
| `failures` | `failures: readonly ModelCatalogFailure[];` |
| `status` | `status: 'idle' \| 'loading' \| 'ready' \| 'selecting' \| 'error';` |
| `pending` | `pending: ModelSelection \| null;` |
| `error` | `error: string \| null;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-model-selection.md#接入-ui-model-selection) 在真实装载路径检验成功、失败与卸载。
