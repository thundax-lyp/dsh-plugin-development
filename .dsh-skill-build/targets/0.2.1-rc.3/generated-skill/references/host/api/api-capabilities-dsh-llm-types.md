# dsh-llm-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## ContentBlock（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ContentBlock = ContentBlockMap[ContentBlockType];
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ContentBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`type`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ContentBlockMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContentBlockMap {
    'text': TextBlock;
    'reasoning': ReasoningBlock;
    'image': ImageBlock;
    'file': FileBlock;
    'tool-call': ToolCallBlock;
    'tool-addition': ToolAdditionBlock;
    'tool-removal': ToolRemovalBlock;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ContentBlockMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`file`、`image`、`reasoning`、`text`、`tool-addition`、`tool-call`、`tool-removal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ContentBlockType（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ContentBlockType = keyof ContentBlockMap;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ContentBlockType`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## FileBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FileBlock {
    type: 'file';
    attachment: FileAttachmentRef;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`FileBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`attachment`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## FinishReason（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type FinishReason = FinishReasonMap[keyof FinishReasonMap];
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`FinishReason`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## FinishReasonMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FinishReasonMap {
    'stop': {
        kind: 'stop';
    };
    'tool-calls': {
        kind: 'tool-calls';
    };
    'max-tokens': {
        kind: 'max-tokens';
    };
    'aborted': {
        kind: 'aborted';
        failure: LlmFailure;
    };
    'error': {
        kind: 'error';
        failure: LlmFailure;
    };
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`FinishReasonMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`aborted`、`error`、`max-tokens`、`stop`、`tool-calls`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## GenerateOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GenerateOptions {
    provider: string;
    model: string;
    reasoningEffort?: ReasoningEffortId;
    messages: RequestMessage[];
    system?: string;
    tools?: ToolSchema[];
    toolHistory?: ToolHistory;
    temperature?: number;
    maxTokens?: number;
    stop?: string[];
    signal?: AbortSignal;
    sessionId?: Branded<'SessionId'>;
    purpose?: 'compaction' | 'session-title';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`GenerateOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxTokens`、`messages`、`model`、`provider`、`purpose`、`reasoningEffort`、`sessionId`、`signal`、`stop`、`system`、`temperature`、`toolHistory`、`tools`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ImageBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ImageBlock {
    type: 'image';
    attachment: ImageAttachmentRef;
    offloaded?: true;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ImageBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`attachment`、`offloaded`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmConfigurableProvider（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmConfigurableProvider {
    provider: string;
    displayName: string;
    settingsNs: string;
    settingsPath: readonly string[];
    declared?: boolean;
    defaultBaseURL?: string;
    baseURLEnv?: readonly string[];
    nativeAuth?: LlmNativeAuth;
    error?: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmConfigurableProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`baseURLEnv`、`declared`、`defaultBaseURL`、`displayName`、`error`、`nativeAuth`、`provider`、`settingsNs`、`settingsPath`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmDiscoveredModel（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmDiscoveredModel {
    id: string;
    name?: string;
    contextWindow?: number;
    maxTokens?: number;
    inputModalities?: readonly ModelModality[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmDiscoveredModel`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`contextWindow`、`id`、`inputModalities`、`maxTokens`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmFailure（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmFailure {
    readonly message: string;
    readonly code: string;
    readonly status?: number;
    readonly providerRetryAfterMs?: number;
    readonly requestId?: ProviderRequestId;
    readonly offloadImages?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmFailure`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`code`、`message`、`offloadImages`、`providerRetryAfterMs`、`requestId`、`status`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmImageRequestBudget（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmImageRequestBudget {
    representation: 'raw' | 'base64';
    maxBytes?: number;
    maxImages?: number;
    byteQuantum?: number;
    countQuantum?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmImageRequestBudget`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`byteQuantum`、`countQuantum`、`maxBytes`、`maxImages`、`representation`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmImageRequestPrice（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmImageRequestPrice {
    visualTokens: number;
    text: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmImageRequestPrice`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`text`、`visualTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmImageRequestPricing（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmImageRequestPricing {
    priceImages(images: readonly ImageBlock[]): readonly LlmImageRequestPrice[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmImageRequestPricing`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`priceImages`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmModelContext（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmModelContext {
    contextWindow: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmModelContext`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`contextWindow`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmModelDiscoveryOperation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmModelDiscoveryOperation extends LlmModelDiscoveryRequest {
    signal?: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmModelDiscoveryOperation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`api`、`apiKey`、`baseURL`、`provider`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmModelDiscoveryRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmModelDiscoveryRequest {
    provider?: string;
    baseURL?: string;
    api?: string;
    apiKey?: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmModelDiscoveryRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`api`、`apiKey`、`baseURL`、`provider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmModelInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmModelInfo {
    provider: string;
    id: string;
    name: string;
    description?: string;
    inputModalities?: readonly ModelModality[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmModelInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`id`、`inputModalities`、`name`、`provider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmModelReasoningInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmModelReasoningInfo {
    efforts: readonly LlmReasoningEffortInfo[];
    defaultEffort?: ReasoningEffortId;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmModelReasoningInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`defaultEffort`、`efforts`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmNativeAuth（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmNativeAuth {
    env: readonly string[];
    oauth: boolean;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmNativeAuth`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`env`、`oauth`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmProviderInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmProviderInfo {
    id: string;
    name: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmProviderInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmReasoningEffortInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmReasoningEffortInfo {
    id: ReasoningEffortId;
    name: string;
    description?: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmReasoningEffortInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`id`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmResolvedModelInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmResolvedModelInfo extends LlmModelInfo {
    context?: LlmModelContext;
    defaultMaxTokens?: number;
    reasoning?: LlmModelReasoningInfo;
    systemPromptUpdate?: SystemPromptUpdate;
    toolUpdate?: ToolUpdate;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmResolvedModelInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`context`、`defaultMaxTokens`、`description`、`id`、`inputModalities`、`name`、`provider`、`reasoning`、`systemPromptUpdate`、`toolUpdate`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ModelModality（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ModelModality = ModelModalityMap[keyof ModelModalityMap];
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ModelModality`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ModelModalityMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModelModalityMap {
    text: 'text';
    image: 'image';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ModelModalityMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`image`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ReasoningBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ReasoningBlock {
    type: 'reasoning';
    text: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ReasoningBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`text`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ReplayEnvelope（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ReplayEnvelope {
    response: unknown;
    blocks?: readonly unknown[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ReplayEnvelope`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`blocks`、`response`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## RequestMessage（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type RequestMessage = Message | RequestUserInput;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`RequestMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`content`、`id`、`role`、`source`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## RequestUserInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RequestUserInput {
    readonly role: 'user';
    readonly content: UserMessage['content'];
    readonly id?: never;
    readonly source?: never;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`RequestUserInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`role`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## StreamChunk（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type StreamChunk = {
    type: 'block-start';
    index: number;
    blockType: ContentBlockType;
} | {
    type: 'text-delta';
    index: number;
    text: string;
} | {
    type: 'reasoning-delta';
    index: number;
    text: string;
} | {
    type: 'tool-call-delta';
    index: number;
    id: ToolCallId;
    name?: string;
    argumentsDelta: string;
} | {
    type: 'block-end';
    index: number;
    block: ContentBlock;
} | {
    type: 'usage';
    usage: TokenUsage;
} | {
    type: 'finish';
    reason: FinishReason;
    replayState?: ReplayEnvelope;
};
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`StreamChunk`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`type`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## SystemPromptUpdate（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SystemPromptUpdate = 'in-history';
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`SystemPromptUpdate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## TextBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TextBlock {
    type: 'text';
    text: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`TextBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`text`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## TokenUsage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    totalTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
    reasoningTokens?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`TokenUsage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cacheReadTokens`、`cacheWriteTokens`、`inputTokens`、`outputTokens`、`reasoningTokens`、`totalTokens`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolAdditionBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolAdditionBlock {
    type: 'tool-addition';
    toolName: string;
    tool?: never;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolAdditionBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`tool`、`toolName`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolCallBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolCallBlock {
    type: 'tool-call';
    id: ToolCallId;
    name: string;
    arguments: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolCallBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`arguments`、`id`、`name`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolHistory（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolHistory {
    readonly tools: readonly ToolSchema[];
    readonly updates: readonly {
        readonly messageId: MessageId;
        readonly additions: readonly ToolSchema[];
    }[];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolHistory`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`tools`、`updates`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolRemovalBlock（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolRemovalBlock {
    type: 'tool-removal';
    toolName: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolRemovalBlock`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`toolName`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolSchema（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolSchema {
    deferLoading?: true;
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolSchema`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`deferLoading`、`description`、`name`、`parameters`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolUpdate（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ToolUpdate = 'in-history' | 'addition-only';
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolUpdate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
