# dsh-llm-assembler 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 assembler 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## BlockAssembler（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`BlockAssembler`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class BlockAssembler {
    push(chunk: StreamChunk): void;
    blocks(): ContentBlock[];
    interruptedBlocks(): ContentBlock[];
    get usage(): TokenUsage | undefined;
    get finish(): FinishReason;
    get replayState(): ReplayEnvelope | undefined;
    message(source: Omit<ModelMessageSource, 'kind'>): AssistantMessage;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
