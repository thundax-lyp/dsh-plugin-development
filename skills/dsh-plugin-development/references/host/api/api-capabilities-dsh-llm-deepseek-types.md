# dsh-llm-deepseek-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## DeepSeekAdapterOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekAdapterOptions<Connection extends DeepSeekConnectionOptions = DeepSeekConnectionOptions> {
    onReplayDegrade?: (detail: {
        provider: string;
        model: string;
        reason: string;
    }) => void;
    onExtensionsOmitted?: (detail: {
        provider: string;
        model: string;
        fields: readonly string[];
        error: unknown;
    }) => void;
    onExtensionsUnaccepted?: (detail: {
        provider: string;
        model: string;
        error: unknown;
    }) => void;
    providerName?: string;
    discoverModels?: (provider: string) => Promise<LlmModelInfo[]>;
    options: () => Connection;
    connect?: (signal?: AbortSignal) => Promise<Connection>;
    admit?: (connection: Connection, model: string) => void;
    resolveAuth: (connection: Connection) => Promise<DeepSeekRequestAuth>;
    resolveUserId: () => AnonymousUserId;
    resolveAttachments?: () => AttachmentStore | undefined;
    resolveImageAccess?: (attachments: AttachmentStore, ref: ImageAttachmentRef) => ImageAttachmentAccess | undefined;
    resolveFiles?: () => DeepSeekFileStore;
    prepareExtensions: (request: DeepSeekLlmApiExtensionRequest) => Promise<PreparedDeepSeekLlmApiExtensions>;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekAdapterOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`admit`、`connect`、`discoverModels`、`onExtensionsOmitted`、`onExtensionsUnaccepted`、`onReplayDegrade`、`options`、`prepareExtensions`、`providerName`、`resolveAttachments`、`resolveAuth`、`resolveFiles`、`resolveImageAccess`、`resolveUserId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DeepSeekCatalogModel（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekCatalogModel {
    id: string;
    name?: string;
    description?: string;
    contextWindow?: number;
    maxTokens?: number;
    inputModalities?: ModelModality[];
    imagePixelBudget?: number | 'low';
    imageMaxBytes?: number;
    systemPromptUpdate?: SystemPromptUpdate;
    toolUpdate?: ToolUpdate;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekCatalogModel`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`contextWindow`、`description`、`id`、`imageMaxBytes`、`imagePixelBudget`、`inputModalities`、`maxTokens`、`name`、`systemPromptUpdate`、`toolUpdate`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DeepSeekConnectionOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekConnectionOptions {
    baseURL: string;
    defaults: RequestDefaults;
    maxTokens: number;
    defaultContextWindow: number;
    models: readonly DeepSeekCatalogModel[];
    streamIdleTimeoutMs: number;
    maxRequestFilesBytes: number;
    maxInlineRequestImageBytes: number;
    maxImagesPerRequest: number;
    imageOffloadByteQuantum: number;
    inlineImageOffloadByteQuantum: number;
    imageOffloadCountQuantum: number;
    filesApiTimeoutMs: number;
    filePolicy: DeepSeekFilePolicy;
    retryPolicy: ResolvedRetryPolicy;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekConnectionOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`baseURL`、`defaultContextWindow`、`defaults`、`filePolicy`、`filesApiTimeoutMs`、`imageOffloadByteQuantum`、`imageOffloadCountQuantum`、`inlineImageOffloadByteQuantum`、`maxImagesPerRequest`、`maxInlineRequestImageBytes`、`maxRequestFilesBytes`、`maxTokens`、`models`、`retryPolicy`、`streamIdleTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DeepSeekRequestAuth（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekRequestAuth {
    headers: Readonly<Record<string, string>>;
    onRequestError?: (error: unknown) => Promise<unknown>;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekRequestAuth`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`headers`、`onRequestError`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## RequestDefaults（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RequestDefaults {
    thinking?: 'enabled' | 'disabled' | undefined;
    reasoningEffort?: 'off' | 'low' | 'high' | 'max' | undefined;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`RequestDefaults`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`reasoningEffort`、`thinking`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
