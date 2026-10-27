# modules：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host 从 enabled Loader 的裸包名行发现 dsh.client，./client 子路径行不携带浏览器半部。声明 platform:web、导出 ./client、预先构建 lib/client.js；普通 ESM 文件不是可加载 bundle。浏览器执行脚本只登记 factory，首次 materialization 才执行正文。baseline requests 由 shell 冻结模块表提供；external 只列精确的非 baseline request。缺供应者、同步循环和自请求使组合失败。删除 Host 行会等待异步清理，再淘汰无人引用的模块与样式。跨 Host release 的图不应用，改版需刷新页面。

## createClientModuleSystem client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `createClientModuleSystem`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function createClientModuleSystem(target: ClientModuleLoaderTarget, bootstrapModule: ClientBootstrapModule, options: ClientModuleCreateOptions): ClientModuleSystem;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## ClientArtifactBaseline root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `ClientArtifactBaseline`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientArtifactBaseline {
    readonly path: string;
    readonly mtimeMs: number;
    readonly ctimeMs: number;
    readonly size: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `path` | `readonly path: string;` |
| `mtimeMs` | `readonly mtimeMs: number;` |
| `ctimeMs` | `readonly ctimeMs: number;` |
| `size` | `readonly size: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## ClientModuleRegistry root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `ClientModuleRegistry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ClientModuleRegistry extends Service {
    static inject: string[];
    constructor(ctx: Context);
    graph(): WebBootGraph;
    clientPath(id: string): string | undefined;
    fetchBundle(request: Request): Promise<Response>;
    artifactBaseline(id: string): ClientArtifactBaseline | undefined;
    rebuilt(id: string): string | undefined;
    onRebuilt(listener: (id: string, rev: string) => void): () => void;
    onGraphChanged(listener: () => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `constructor` | `constructor(ctx: Context);` |
| `graph` | `graph(): WebBootGraph;` |
| `clientPath` | `clientPath(id: string): string \| undefined;` |
| `fetchBundle` | `fetchBundle(request: Request): Promise<Response>;` |
| `artifactBaseline` | `artifactBaseline(id: string): ClientArtifactBaseline \| undefined;` |
| `rebuilt` | `rebuilt(id: string): string \| undefined;` |
| `onRebuilt` | `onRebuilt(listener: (id: string, rev: string) => void): () => void;` |
| `onGraphChanged` | `onGraphChanged(listener: () => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientArtifactBaseline {

  readonly path: string

  readonly mtimeMs: number

  readonly ctimeMs: number

  readonly size: number
}
```

## bootInjections root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `bootInjections`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function bootInjections(graph: WebBootGraph): IndexInjection[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## default root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `default`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class ClientModuleRegistry extends Service {
    static inject: string[];
    constructor(ctx: Context);
    graph(): WebBootGraph;
    clientPath(id: string): string | undefined;
    fetchBundle(request: Request): Promise<Response>;
    artifactBaseline(id: string): ClientArtifactBaseline | undefined;
    rebuilt(id: string): string | undefined;
    onRebuilt(listener: (id: string, rev: string) => void): () => void;
    onGraphChanged(listener: () => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `constructor` | `constructor(ctx: Context);` |
| `graph` | `graph(): WebBootGraph;` |
| `clientPath` | `clientPath(id: string): string \| undefined;` |
| `fetchBundle` | `fetchBundle(request: Request): Promise<Response>;` |
| `artifactBaseline` | `artifactBaseline(id: string): ClientArtifactBaseline \| undefined;` |
| `rebuilt` | `rebuilt(id: string): string \| undefined;` |
| `onRebuilt` | `onRebuilt(listener: (id: string, rev: string) => void): () => void;` |
| `onGraphChanged` | `onGraphChanged(listener: () => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientArtifactBaseline {

  readonly path: string

  readonly mtimeMs: number

  readonly ctimeMs: number

  readonly size: number
}
```

## orderByModuleGraph root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `orderByModuleGraph`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function orderByModuleGraph(entries: readonly WebBootEntry[]): WebBootEntry[];
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。
