# dsh-llm-assistant-stream 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 assistant-stream 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## AssistantStreamAccumulator（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AssistantStreamAccumulator`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class AssistantStreamAccumulator {
    push(value: TimedStreamChunk): TimedStreamChunk;
    snapshot(): readonly AssistantStreamRecord[];
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## AssistantStreamRecord（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type AssistantStreamRecord = {
    readonly type: 'text-chunks';
    readonly time0: number;
    readonly index: number;
    readonly dt: readonly number[];
    readonly texts: readonly string[];
} | {
    readonly type: 'reasoning-chunks';
    readonly time0: number;
    readonly index: number;
    readonly dt: readonly number[];
    readonly texts: readonly string[];
} | {
    readonly type: 'tool-call-chunks';
    readonly time0: number;
    readonly index: number;
    readonly dt: readonly number[];
    readonly id: ToolCallId;
    readonly name?: string;
    readonly args: readonly string[];
} | {
    readonly type: 'chunk';
    readonly time: number;
    readonly chunk: StreamChunk;
};
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AssistantStreamRecord`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`type`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## AssistantStreamRun（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type AssistantStreamRun = Exclude<AssistantStreamRecord, {
    type: 'chunk';
}>;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AssistantStreamRun`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`dt`、`index`、`time0`、`type`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## RawStreamChunkType（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type RawStreamChunkType = Exclude<StreamChunk['type'], 'text-delta' | 'reasoning-delta' | 'tool-call-delta'>;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`RawStreamChunkType`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## TimedStreamChunk（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TimedStreamChunk {
    readonly time: number;
    readonly chunk: StreamChunk;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`TimedStreamChunk`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`chunk`、`time`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## assembleAssistantStream（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`assembleAssistantStream`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assembleAssistantStream(stream: readonly AssistantStreamRecord[], assembler?: BlockAssembler): BlockAssembler;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## assistantStreamChunks（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`assistantStreamChunks`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assistantStreamChunks<T extends RawStreamChunkType>(stream: readonly AssistantStreamRecord[], type: T): readonly Extract<StreamChunk, {
    type: T;
}>[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## assistantStreamFirstTokenTime（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`assistantStreamFirstTokenTime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assistantStreamFirstTokenTime(stream: readonly AssistantStreamRecord[]): number | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## assistantStreamHasVisibleContent（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`assistantStreamHasVisibleContent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assistantStreamHasVisibleContent(stream: readonly AssistantStreamRecord[]): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## assistantStreamHasVisibleText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`assistantStreamHasVisibleText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assistantStreamHasVisibleText(stream: readonly AssistantStreamRecord[]): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## chunkHasVisibleText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`chunkHasVisibleText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function chunkHasVisibleText(chunk: StreamChunk): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## expandAssistantStream（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`expandAssistantStream`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function expandAssistantStream(stream: readonly AssistantStreamRecord[]): readonly TimedStreamChunk[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## isTokenDelta（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`isTokenDelta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isTokenDelta(chunk: StreamChunk): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## isVisibleChunk（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`isVisibleChunk`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isVisibleChunk(chunk: StreamChunk): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## joinAssistantStreamText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`joinAssistantStreamText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function joinAssistantStreamText(stream: readonly AssistantStreamRecord[]): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## lastAssistantStreamChunk（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`lastAssistantStreamChunk`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function lastAssistantStreamChunk<T extends RawStreamChunkType>(stream: readonly AssistantStreamRecord[], type: T): Extract<StreamChunk, {
    type: T;
}> | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## runFirstTokenTime（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`runFirstTokenTime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function runFirstTokenTime(run: AssistantStreamRun): number | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## runFirstVisibleTime（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`runFirstVisibleTime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function runFirstVisibleTime(run: AssistantStreamRun): number | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
