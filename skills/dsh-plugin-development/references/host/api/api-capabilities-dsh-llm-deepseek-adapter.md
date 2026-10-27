# dsh-llm-deepseek-adapter 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 adapter 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## DeepSeekAdapter（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekAdapter`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class DeepSeekAdapter<C extends Connection = Connection> extends LlmAdapter {
    constructor(dependencies: DeepSeekAdapterOptions<C>);
    providerInfo(provider: string): {
        id: string;
        name: string;
    };
    providerRetryPolicy(_provider: string): import("@deepseek-ai/dsh-llm").ResolvedRetryPolicy;
    listModels(provider: string): Promise<never[] | import("@deepseek-ai/dsh-llm").LlmModelInfo[]>;
    resolveModel(provider: string, model: string, signal?: AbortSignal): Promise<import("@deepseek-ai/dsh-llm").LlmResolvedModelInfo>;
    imageRequestPricing(_provider: string, model: string): import("@deepseek-ai/dsh-llm").LlmImageRequestPricing;
    imageRequestTarget(_provider: string, model: string, image: ImageAttachmentRef): import("@deepseek-ai/dsh-attachment").ImageRequestTarget;
    prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall>;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
