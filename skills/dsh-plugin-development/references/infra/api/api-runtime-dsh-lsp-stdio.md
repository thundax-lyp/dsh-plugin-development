# @deepseek-ai/dsh-lsp-stdio：语言服务 Provider 与四类查询

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在语言服务 Provider 与四类查询任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-lsp.md)。

## Config 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    servers: Record<string, LspLocalServerConfig>;
}

export declare const Config: z<Config>;
```

成员检索：`servers`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspConnection 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `LspConnection`。`LspConnection` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LspConnection {
    readonly closed: Promise<void>;
    constructor(spec: ConnectionSpec, spawner: ConnectionSpawner, onServerRequest: (method: string, params: unknown) => Promise<unknown>, writer?: ConnectionWriter);
    get stderrTail(): string;
    get failed(): boolean;
    failedWith(error: unknown): boolean;
    request(method: string, params: unknown): Promise<unknown>;
    notify(method: string, params: unknown): Promise<void>;
    cancel(requestId: number): void;
    peekNextId(): number;
    terminate(): void;
    waitForManagedRangeExit(signal?: AbortSignal): Promise<boolean>;
}
```

成员检索：`cancel`、`closed`、`failed`、`failedWith`、`notify`、`peekNextId`、`request`、`stderrTail`、`terminate`、`waitForManagedRangeExit`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspInstance 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `LspInstance`。`LspInstance` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LspInstance {
    constructor(spec: InstanceSpec, spawner: ConnectionSpawner, writer?: ConnectionWriter);
    get dead(): boolean;
    isTransportFailure(error: unknown): boolean;
    query(request: LspProviderQuery, source: HostSource, signal?: AbortSignal): Promise<LspQueryResult>;
    dispose(): Promise<void>;
}
```

成员检索：`dead`、`dispose`、`isTransportFailure`、`query`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspLocalServerConfig 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `LspLocalServerConfig`。`LspLocalServerConfig` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspLocalServerConfig {
    command: string;
    extensionToLanguage: Record<string, string>;
    args?: string[];
    env?: Record<string, string>;
    initializationOptions?: unknown;
    configuration?: unknown;
    maxMessageBytes?: number;
    maxStderrBytes?: number;
    maxDocumentBytes?: number;
    shutdownTimeoutMs?: number;
    killGraceMs?: number;
}
```

成员检索：`args`、`command`、`configuration`、`env`、`extensionToLanguage`、`initializationOptions`、`killGraceMs`、`maxDocumentBytes`、`maxMessageBytes`、`maxStderrBytes`、`shutdownTimeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## MessageDecoder 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `MessageDecoder`。`MessageDecoder` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class MessageDecoder {
    constructor(maxMessageBytes: number);
    push(chunk: Buffer): unknown[];
}
```

成员检索：`push`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## canonicalizeWorkspace 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `canonicalizeWorkspace`。`canonicalizeWorkspace` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function canonicalizeWorkspace(fs: FileSystem, workspaceRoot: string, signal?: AbortSignal): Promise<HostWorkspace>;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## encodeMessage 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `encodeMessage`。`encodeMessage` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function encodeMessage(message: unknown): Buffer;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "lsp-stdio";
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## negotiatePositionEncoding 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `negotiatePositionEncoding`。`negotiatePositionEncoding` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function negotiatePositionEncoding(encoding: string | undefined): 'utf-16';
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## normalizeHover 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `normalizeHover`。`normalizeHover` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function normalizeHover(payload: unknown): LspHover | null;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## normalizeLocations 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `normalizeLocations`。`normalizeLocations` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function normalizeLocations(payload: unknown): LspLocation[];
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## readHostSource 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `readHostSource`。`readHostSource` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function readHostSource(fs: FileSystem, filePath: string, workspace: HostWorkspace, maxDocumentBytes: number, signal?: AbortSignal): Promise<HostSource>;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## requestMethod 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `requestMethod`。`requestMethod` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function requestMethod(operation: LspOperation): string;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## supportsOperation 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `supportsOperation`。`supportsOperation` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function supportsOperation(capabilities: WireServerCapabilities, operation: LspOperation): boolean;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## supportsTransientOpen 契约

从 `@deepseek-ai/dsh-lsp-stdio` 导入 `supportsTransientOpen`。`supportsTransientOpen` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function supportsTransientOpen(sync: WireServerCapabilities['textDocumentSync']): boolean;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。
