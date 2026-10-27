# modules：entries 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host 从 enabled Loader 的裸包名行发现 dsh.client，./client 子路径行不携带浏览器半部。声明 platform:web、导出 ./client、预先构建 lib/client.js；普通 ESM 文件不是可加载 bundle。浏览器执行脚本只登记 factory，首次 materialization 才执行正文。baseline requests 由 shell 冻结模块表提供；external 只列精确的非 baseline request。缺供应者、同步循环和自请求使组合失败。删除 Host 行会等待异步清理，再淘汰无人引用的模块与样式。跨 Host release 的图不应用，改版需刷新页面。

## ClientEntries client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientEntries`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ClientEntries {
    readonly state: ObservableSnapshot<ClientEntryState>;
    constructor(modules: ClientModuleLoader, index: ModuleIndex);
    get releaseChange(): ObservableSnapshot<ClientReleaseChange | undefined>;
    dismissRelease(): void;
    start(loader: Loader, manifest: BootManifest): Promise<void>;
    sync(graph: unknown): Promise<void>;
    retry(): Promise<void>;
    reload(id: string, rev: string): Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `state` | `readonly state: ObservableSnapshot<ClientEntryState>;` |
| `constructor` | `constructor(modules: ClientModuleLoader, index: ModuleIndex);` |
| `releaseChange` | `get releaseChange(): ObservableSnapshot<ClientReleaseChange \| undefined>;` |
| `dismissRelease` | `dismissRelease(): void;` |
| `start` | `start(loader: Loader, manifest: BootManifest): Promise<void>;` |
| `sync` | `sync(graph: unknown): Promise<void>;` |
| `retry` | `retry(): Promise<void>;` |
| `reload` | `reload(id: string, rev: string): Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientEntryState {

  readonly syncing: boolean

  readonly failures: readonly { readonly id: string; readonly message: string }[]
}
```

## ClientEntryState client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientEntryState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientEntryState {
    readonly syncing: boolean;
    readonly failures: readonly {
        readonly id: string;
        readonly message: string;
    }[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `syncing` | `readonly syncing: boolean;` |
| `failures` | `readonly failures: readonly { readonly id: string; readonly message: string; }[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。
