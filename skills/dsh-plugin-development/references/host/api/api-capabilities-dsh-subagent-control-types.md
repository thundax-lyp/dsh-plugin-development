# dsh-subagent-control-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 control-types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-subagent.md)；本页逐项保留对象的参数、字段和判别分支。

## SubagentAddress（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentAddress = {
    readonly parentSessionId: SessionId;
    readonly childSessionId: SessionId;
} & ({
    readonly mode: 'one-shot';
} | {
    readonly mode: 'continuable';
} | {
    readonly mode: 'unknown';
});
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentAddress`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`childSessionId`、`mode`、`parentSessionId`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentCatalogRow（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentCatalogRow = {
    readonly id: SessionId;
    readonly activity: 'running' | 'inactive';
} & ({
    readonly mode: 'one-shot';
    readonly label?: string;
} | {
    readonly mode: 'external';
    readonly label?: string;
} | {
    readonly mode: 'continuable';
    readonly label: string;
});
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentCatalogRow`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`activity`、`id`、`label`、`mode`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentDelivery（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentDelivery = SubagentPromptRequest['delivery'];
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentDelivery`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentInterruptReceipt（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentInterruptReceipt {
    readonly accepted: true;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentInterruptReceipt`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`accepted`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentListEntry（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentListEntry = SubagentCatalogRow & {
    readonly kind: 'child';
    readonly hasChildren: boolean;
} | {
    readonly kind: 'diagnostic';
    readonly id: SessionId;
    readonly reason: 'corrupt' | 'unsupported' | 'unavailable';
};
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentListEntry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`id`、`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentPromptReceipt（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentPromptReceipt {
    readonly messageId: MessageId;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentPromptReceipt`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`messageId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentPromptRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentPromptRequest {
    readonly requestId: SubagentPromptRequestId;
    readonly parentSessionId: SessionId;
    readonly childSessionId: SessionId;
    readonly mode: 'continuable';
    readonly delivery: 'queue' | 'steer';
    readonly content: readonly PromptContentPart[];
    readonly clientTimeZone?: string;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentPromptRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`childSessionId`、`clientTimeZone`、`content`、`delivery`、`mode`、`parentSessionId`、`requestId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentPromptRequestId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentPromptRequestId = Branded<'session-request-id'>;
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentPromptRequestId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。
