# dsh-subagent-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-subagent.md)；本页逐项保留对象的参数、字段和判别分支。

## ContinuableCreateRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContinuableCreateRequest {
    readonly cwd: string;
    readonly sessionId: SessionId;
    readonly parent: Agent;
    readonly signal: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`ContinuableCreateRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`、`parent`、`sessionId`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## ContinuableCreateSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContinuableCreateSpec {
    readonly seed?: readonly SessionEvent[];
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`ContinuableCreateSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`seed`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## ResolvedSubagentStartRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedSubagentStartRequest extends SubagentStartRequest {
    readonly cwd: string;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`ResolvedSubagentStartRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentOptions`、`agentPreset`、`cwd`、`label`、`maxDepth`、`outputSchema`、`parent`、`prompt`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentActivation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentActivation {
    readonly childId: SessionId;
    readonly messageId?: MessageId;
    readonly result: Promise<SubagentResult>;
    dispose(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentActivation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`childId`、`dispose`、`messageId`、`result`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentActivationSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentActivationSpec {
    readonly provider: string;
    readonly label: string;
    readonly childId?: SessionId;
    readonly request: Omit<SubagentStartRequest, 'label' | 'signal'>;
    readonly signal: AbortSignal;
    readonly delivery: 'parent' | 'caller';
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentActivationSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`childId`、`delivery`、`label`、`provider`、`request`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentCapabilities（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentCapabilities {
    readonly agentOptions: boolean;
    readonly agentPreset: boolean;
    readonly outputSchema: boolean;
    readonly depthLimit: boolean;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentCapabilities`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentOptions`、`agentPreset`、`depthLimit`、`outputSchema`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentInterruptAuthority（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentInterruptAuthority = {
    readonly kind: 'user';
    readonly parentSessionId: SessionId;
} | {
    readonly kind: 'ancestor';
    readonly agent: Agent;
};
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentInterruptAuthority`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentProvider（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentProvider {
    readonly name: string;
    readonly capabilities: SubagentCapabilities;
    readonly inheritsParentContext: boolean;
    readonly agentRouteDefaults?: Readonly<{
        provider: string;
        model: string;
    }>;
    start?(request: ResolvedSubagentStartRequest): Promise<SubagentRun>;
    prepareContinuable?(request: ContinuableCreateRequest): Promise<ContinuableCreateSpec>;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentRouteDefaults`、`capabilities`、`inheritsParentContext`、`name`、`prepareContinuable`、`start`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentResult {
    readonly output: readonly ContentBlock[];
    readonly structured?: unknown;
    readonly diagnostic?: string;
    readonly stopReason: SubagentStopReason;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`diagnostic`、`output`、`stopReason`、`structured`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentRun（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentRun {
    readonly id: SessionId;
    readonly result: Promise<SubagentResult>;
    dispose(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentRun`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`dispose`、`id`、`result`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentRunEndInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentRunEndInfo {
    readonly runId: SubagentRunId;
    readonly provider: string;
    readonly id: SessionId;
    readonly local: boolean;
    readonly stopReason: SubagentResult['stopReason'];
    readonly lastAssistantMessage?: readonly ContentBlock[];
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentRunEndInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`lastAssistantMessage`、`local`、`provider`、`runId`、`stopReason`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentRunId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function SubagentRunId(id: string): SubagentRunId;

export type SubagentRunId = Branded<'SubagentRunId'>;
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentRunId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentRunInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentRunInfo {
    readonly runId: SubagentRunId;
    readonly provider: string;
    readonly id: SessionId;
    readonly local: boolean;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentRunInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`local`、`provider`、`runId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentSendMessageOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentSendMessageOptions {
    readonly signal: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentSendMessageOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentStartRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentStartRequest {
    readonly cwd?: string;
    readonly agentPreset?: string;
    readonly label?: string;
    readonly prompt: ContentBlock[];
    readonly parent: Agent;
    readonly signal: AbortSignal;
    readonly agentOptions?: AgentOptions;
    readonly outputSchema?: ObjectJsonSchema;
    readonly maxDepth?: number;
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentStartRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentOptions`、`agentPreset`、`cwd`、`label`、`maxDepth`、`outputSchema`、`parent`、`prompt`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentStopReason（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SubagentStopReason = SubagentStopReasonMap[keyof SubagentStopReasonMap];
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentStopReason`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。

## SubagentStopReasonMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SubagentStopReasonMap {
    completed: 'completed';
    aborted: 'aborted';
    error: 'error';
    'max-tokens': 'max-tokens';
    refusal: 'refusal';
}
```

公开导入：`@deepseek-ai/dsh-subagent`；公开符号：`SubagentStopReasonMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`aborted`、`completed`、`error`、`max-tokens`、`refusal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent.md)。
