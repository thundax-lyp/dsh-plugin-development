# modules：manifest 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host 从 enabled Loader 的裸包名行发现 dsh.client，./client 子路径行不携带浏览器半部。声明 platform:web、导出 ./client、预先构建 lib/client.js；普通 ESM 文件不是可加载 bundle。浏览器执行脚本只登记 factory，首次 materialization 才执行正文。baseline requests 由 shell 冻结模块表提供；external 只列精确的非 baseline request。缺供应者、同步循环和自请求使组合失败。删除 Host 行会等待异步清理，再淘汰无人引用的模块与样式。跨 Host release 的图不应用，改版需刷新页面。

## BootManifest client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `BootManifest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BootManifest {
    rev: string;
    release?: WebBootRelease;
    modules: BootModuleRow[];
    plugins: BootPluginRow[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rev` | `rev: string;` |
| `release` | `release?: WebBootRelease;` |
| `modules` | `modules: BootModuleRow[];` |
| `plugins` | `plugins: BootPluginRow[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebBootRelease {

  version: string

  commit?: string
}

export interface BootModuleRow {

  id: string

  url: string

  initialUrl: string

  rev: string

  inject: string[]

  external: string[]
}

export interface BootPluginRow {

  id: string

  inject: string[]

  immediately: boolean
}
```

## BootModuleRow client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `BootModuleRow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BootModuleRow {
    id: string;
    url: string;
    initialUrl: string;
    rev: string;
    inject: string[];
    external: string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `url` | `url: string;` |
| `initialUrl` | `initialUrl: string;` |
| `rev` | `rev: string;` |
| `inject` | `inject: string[];` |
| `external` | `external: string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## BootPluginRow client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `BootPluginRow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BootPluginRow {
    id: string;
    inject: string[];
    immediately: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `inject` | `inject: string[];` |
| `immediately` | `immediately: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## ClientBootstrapModule client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientBootstrapModule`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientBootstrapModule {
    id: string;
    exports: Record<string, unknown>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `exports` | `exports: Record<string, unknown>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## ClientBundleRegistration client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientBundleRegistration`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientBundleRegistration {
    id: string;
    chunk?: string;
    factory: (require: ClientBundleRequire) => Record<string, unknown>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `chunk` | `chunk?: string;` |
| `factory` | `factory: (require: ClientBundleRequire) => Record<string, unknown>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientBundleRequire {

  (specifier: string): unknown

  async(specifier: string): Promise<unknown>
}
```

## ClientModuleCreateOptions client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientModuleCreateOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientModuleCreateOptions {
    boot: unknown;
    staticModules: Record<string, unknown>;
    loadBundle?: (url: string) => Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `boot` | `boot: unknown;` |
| `staticModules` | `staticModules: Record<string, unknown>;` |
| `loadBundle` | `loadBundle?: (url: string) => Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## ClientModuleLoader client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientModuleLoader`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientModuleLoader {
    version: 'client';
    manifest: BootManifest;
    entries: ClientEntries;
    loadCache: Map<string, ClientModuleRecord>;
    import(specifier: string, parentURL: string, attrs: Record<string, unknown>): Promise<unknown>;
    prefetch(id: string): Promise<void>;
    importError(id: string): Error | undefined;
    invalidate(id: string, rev?: string): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `version` | `version: 'client';` |
| `manifest` | `manifest: BootManifest;` |
| `entries` | `entries: ClientEntries;` |
| `loadCache` | `loadCache: Map<string, ClientModuleRecord>;` |
| `import` | `import(specifier: string, parentURL: string, attrs: Record<string, unknown>): Promise<unknown>;` |
| `prefetch` | `prefetch(id: string): Promise<void>;` |
| `importError` | `importError(id: string): Error \| undefined;` |
| `invalidate` | `invalidate(id: string, rev?: string): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface BootManifest {

  rev: string

  release?: WebBootRelease

  modules: BootModuleRow[]

  plugins: BootPluginRow[]
}

export interface ClientModuleRecord {

  id: string

  exports: unknown

  styles: string[]

  edges: Set<string>
}

export interface WebBootRelease {

  version: string

  commit?: string
}

export interface BootModuleRow {

  id: string

  url: string

  initialUrl: string

  rev: string

  inject: string[]

  external: string[]
}

export interface BootPluginRow {

  id: string

  inject: string[]

  immediately: boolean
}
```

## ClientModuleLoaderTarget client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientModuleLoaderTarget`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientModuleLoaderTarget {
    mode: 'queue' | 'live';
    pendingQueue: ClientBundleRegistration[];
    load(registration: ClientBundleRegistration): void;
    create(options: ClientModuleCreateOptions): ClientModuleSystem;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `mode` | `mode: 'queue' \| 'live';` |
| `pendingQueue` | `pendingQueue: ClientBundleRegistration[];` |
| `load` | `load(registration: ClientBundleRegistration): void;` |
| `create` | `create(options: ClientModuleCreateOptions): ClientModuleSystem;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientBundleRegistration {

  id: string

  chunk?: string

  factory: (require: ClientBundleRequire) => Record<string, unknown>
}

export interface ClientModuleCreateOptions {

  boot: unknown

  staticModules: Record<string, unknown>

  loadBundle?: (url: string) => Promise<void>
}

export interface ClientBundleRequire {

  (specifier: string): unknown

  async(specifier: string): Promise<unknown>
}
```

## ClientModuleRecord client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientModuleRecord`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientModuleRecord {
    id: string;
    exports: unknown;
    styles: string[];
    edges: Set<string>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `exports` | `exports: unknown;` |
| `styles` | `styles: string[];` |
| `edges` | `edges: Set<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## ClientModuleSystemOptions client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `ClientModuleSystemOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientModuleSystemOptions {
    manifest: BootManifest;
    staticModules: Record<string, unknown>;
    registrationTarget: ClientModuleLoaderTarget;
    bootstrapModule: ClientBootstrapModule;
    loadBundle?: (url: string) => Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `manifest` | `manifest: BootManifest;` |
| `staticModules` | `staticModules: Record<string, unknown>;` |
| `registrationTarget` | `registrationTarget: ClientModuleLoaderTarget;` |
| `bootstrapModule` | `bootstrapModule: ClientBootstrapModule;` |
| `loadBundle` | `loadBundle?: (url: string) => Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface BootManifest {

  rev: string

  release?: WebBootRelease

  modules: BootModuleRow[]

  plugins: BootPluginRow[]
}

export interface ClientBootstrapModule {

  id: string

  exports: Record<string, unknown>
}

export interface ClientModuleLoaderTarget {

  mode: 'queue' | 'live'

  pendingQueue: ClientBundleRegistration[]

  load(registration: ClientBundleRegistration): void

  create(options: ClientModuleCreateOptions): ClientModuleSystem
}

export interface WebBootRelease {

  version: string

  commit?: string
}

export interface BootModuleRow {

  id: string

  url: string

  initialUrl: string

  rev: string

  inject: string[]

  external: string[]
}

export interface BootPluginRow {

  id: string

  inject: string[]

  immediately: boolean
}

export interface ClientBundleRegistration {

  id: string

  chunk?: string

  factory: (require: ClientBundleRequire) => Record<string, unknown>
}

export interface ClientModuleCreateOptions {

  boot: unknown

  staticModules: Record<string, unknown>

  loadBundle?: (url: string) => Promise<void>
}

export interface ClientBundleRequire {

  (specifier: string): unknown

  async(specifier: string): Promise<unknown>
}
```

## DshWindow client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `DshWindow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface DshWindow {
    __DSH_BOOT__?: unknown;
    __ModuleLoader__?: ClientModuleLoaderTarget;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `__DSH_BOOT__` | `__DSH_BOOT__?: unknown;` |
| `__ModuleLoader__` | `__ModuleLoader__?: ClientModuleLoaderTarget;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientModuleLoaderTarget {

  mode: 'queue' | 'live'

  pendingQueue: ClientBundleRegistration[]

  load(registration: ClientBundleRegistration): void

  create(options: ClientModuleCreateOptions): ClientModuleSystem
}

export interface ClientBundleRegistration {

  id: string

  chunk?: string

  factory: (require: ClientBundleRequire) => Record<string, unknown>
}

export interface ClientModuleCreateOptions {

  boot: unknown

  staticModules: Record<string, unknown>

  loadBundle?: (url: string) => Promise<void>
}

export interface ClientBundleRequire {

  (specifier: string): unknown

  async(specifier: string): Promise<unknown>
}
```

## WebBootEntry client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `WebBootEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootEntry {
    id: string;
    url: string;
    rev: string;
    inject?: string[];
    immediately?: boolean;
    external?: string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `url` | `url: string;` |
| `rev` | `rev: string;` |
| `inject` | `inject?: string[];` |
| `immediately` | `immediately?: boolean;` |
| `external` | `external?: string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## WebBootGraph client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `WebBootGraph`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootGraph {
    rev: string;
    release?: WebBootRelease;
    entries: WebBootEntry[];
    batches: WebBootBatch[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rev` | `rev: string;` |
| `release` | `release?: WebBootRelease;` |
| `entries` | `entries: WebBootEntry[];` |
| `batches` | `batches: WebBootBatch[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebBootEntry {

  id: string

  url: string

  rev: string

  inject?: string[]

  immediately?: boolean

  external?: string[]
}

export interface WebBootBatch {

  phase: WebBootBatchPhase

  url: string

  rev: string

  entries: string[]
}

export interface WebBootRelease {

  version: string

  commit?: string
}

export type WebBootBatchPhase = 'bootstrap' | 'application'
```

## WebBootRelease client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `WebBootRelease`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootRelease {
    version: string;
    commit?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `version` | `version: string;` |
| `commit` | `commit?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## exactPackageSpecifier client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `exactPackageSpecifier`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function exactPackageSpecifier(specifier: string): string | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## parseBootManifest client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `parseBootManifest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function parseBootManifest(wire: unknown): BootManifest;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface BootManifest {

  rev: string

  release?: WebBootRelease

  modules: BootModuleRow[]

  plugins: BootPluginRow[]
}

export interface WebBootRelease {

  version: string

  commit?: string
}

export interface BootModuleRow {

  id: string

  url: string

  initialUrl: string

  rev: string

  inject: string[]

  external: string[]
}

export interface BootPluginRow {

  id: string

  inject: string[]

  immediately: boolean
}
```

## parseDshClient client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `parseDshClient`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function parseDshClient(pkgName: string, value: unknown): DshClientManifest | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## stripClientSuffix client

入口 `@deepseek-ai/dsh-client-modules/client`，公开符号 `stripClientSuffix`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function stripClientSuffix(spec: string): string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## BootManifest root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `BootManifest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BootManifest {
    rev: string;
    release?: WebBootRelease;
    modules: BootModuleRow[];
    plugins: BootPluginRow[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rev` | `rev: string;` |
| `release` | `release?: WebBootRelease;` |
| `modules` | `modules: BootModuleRow[];` |
| `plugins` | `plugins: BootPluginRow[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebBootRelease {

  version: string

  commit?: string
}

export interface BootModuleRow {

  id: string

  url: string

  initialUrl: string

  rev: string

  inject: string[]

  external: string[]
}

export interface BootPluginRow {

  id: string

  inject: string[]

  immediately: boolean
}
```

## BootModuleRow root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `BootModuleRow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BootModuleRow {
    id: string;
    url: string;
    initialUrl: string;
    rev: string;
    inject: string[];
    external: string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `url` | `url: string;` |
| `initialUrl` | `initialUrl: string;` |
| `rev` | `rev: string;` |
| `inject` | `inject: string[];` |
| `external` | `external: string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## BootPluginRow root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `BootPluginRow`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface BootPluginRow {
    id: string;
    inject: string[];
    immediately: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `inject` | `inject: string[];` |
| `immediately` | `immediately: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## WebBootBatch root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `WebBootBatch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootBatch {
    phase: WebBootBatchPhase;
    url: string;
    rev: string;
    entries: string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `phase` | `phase: WebBootBatchPhase;` |
| `url` | `url: string;` |
| `rev` | `rev: string;` |
| `entries` | `entries: string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type WebBootBatchPhase = 'bootstrap' | 'application'
```

## WebBootBatchPhase root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `WebBootBatchPhase`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type WebBootBatchPhase = 'bootstrap' | 'application';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## WebBootEntry root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `WebBootEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootEntry {
    id: string;
    url: string;
    rev: string;
    inject?: string[];
    immediately?: boolean;
    external?: string[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `id: string;` |
| `url` | `url: string;` |
| `rev` | `rev: string;` |
| `inject` | `inject?: string[];` |
| `immediately` | `immediately?: boolean;` |
| `external` | `external?: string[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## WebBootGraph root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `WebBootGraph`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootGraph {
    rev: string;
    release?: WebBootRelease;
    entries: WebBootEntry[];
    batches: WebBootBatch[];
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rev` | `rev: string;` |
| `release` | `release?: WebBootRelease;` |
| `entries` | `entries: WebBootEntry[];` |
| `batches` | `batches: WebBootBatch[];` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface WebBootEntry {

  id: string

  url: string

  rev: string

  inject?: string[]

  immediately?: boolean

  external?: string[]
}

export interface WebBootBatch {

  phase: WebBootBatchPhase

  url: string

  rev: string

  entries: string[]
}

export interface WebBootRelease {

  version: string

  commit?: string
}

export type WebBootBatchPhase = 'bootstrap' | 'application'
```

## WebBootRelease root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `WebBootRelease`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface WebBootRelease {
    version: string;
    commit?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `version` | `version: string;` |
| `commit` | `commit?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。

## stripClientSuffix root

入口 `@deepseek-ai/dsh-client-modules`，公开符号 `stripClientSuffix`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function stripClientSuffix(spec: string): string;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-modules.md#接入-modules) 在真实装载路径检验成功、失败与卸载。
