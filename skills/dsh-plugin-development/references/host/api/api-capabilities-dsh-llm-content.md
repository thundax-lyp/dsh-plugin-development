# dsh-llm-content 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 content 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## ImageAttachmentAccess（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ImageAttachmentAccess {
    readonlyPath: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ImageAttachmentAccess`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`readonlyPath`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ImageAttachmentAccessResolver（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ImageAttachmentAccessResolver = (ref: ImageAttachmentRef) => ImageAttachmentAccess | undefined;
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ImageAttachmentAccessResolver`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ProjectedToolUpdates（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ProjectedToolUpdates {
    readonly messages: readonly RequestMessage[];
    readonly tools: readonly ToolSchema[] | undefined;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ProjectedToolUpdates`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`messages`、`tools`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## contentHasFile（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`contentHasFile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function contentHasFile(content: readonly ContentBlock[]): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## contentHasImage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`contentHasImage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function contentHasImage(content: readonly ContentBlock[]): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## fileHandleText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`fileHandleText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function fileHandleText(ref: FileAttachmentRef, readonlyPath: string | undefined): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## offloadedImageText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`offloadedImageText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function offloadedImageText(ref: ImageAttachmentRef, access?: ImageAttachmentAccess): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## projectFilesToText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`projectFilesToText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function projectFilesToText(messages: readonly Message[], resolvePath: (ref: FileAttachmentRef) => string | undefined): readonly Message[];

export declare function projectFilesToText(messages: readonly RequestMessage[], resolvePath: (ref: FileAttachmentRef) => string | undefined): readonly RequestMessage[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## projectImagesForTextModel（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`projectImagesForTextModel`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function projectImagesForTextModel(messages: readonly Message[]): readonly Message[];

export declare function projectImagesForTextModel(messages: readonly RequestMessage[]): readonly RequestMessage[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## projectOffloadedImages（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`projectOffloadedImages`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function projectOffloadedImages(messages: readonly Message[], placeholder: (ref: ImageAttachmentRef) => string): readonly Message[];

export declare function projectOffloadedImages(messages: readonly RequestMessage[], placeholder: (ref: ImageAttachmentRef) => string): readonly RequestMessage[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## projectToolUpdates（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`projectToolUpdates`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function projectToolUpdates(messages: readonly RequestMessage[], tools: readonly ToolSchema[] | undefined, toolUpdate: ToolUpdate | undefined, history?: ToolHistory): ProjectedToolUpdates;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## requestImageHandleText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`requestImageHandleText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function requestImageHandleText(ref: ImageAttachmentRef, version: Pick<RequestImageAttachment, 'width' | 'height'>, access?: ImageAttachmentAccess): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## requiredImageOffload（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`requiredImageOffload`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function requiredImageOffload(messages: readonly RequestMessage[], budget: Pick<LlmImageRequestBudget, 'representation' | 'maxBytes' | 'maxImages' | 'byteQuantum' | 'countQuantum'>, versionBytes: (block: ImageBlock) => number): number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## resolveImageAttachmentAccess（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`resolveImageAttachmentAccess`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveImageAttachmentAccess(attachments: AttachmentStore, mapHostPath: (hostPath: string) => string | undefined, ref: ImageAttachmentRef): ImageAttachmentAccess | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## textOnlyImageText（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`textOnlyImageText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function textOnlyImageText(ref: ImageAttachmentRef): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
