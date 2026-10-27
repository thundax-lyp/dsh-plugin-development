# @deepseek-ai/dsh-agent .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent 选型与组合](api-core-dsh-agent-root-overview.md)。

使用 `dsh-agent` 创建或恢复实时 agent（智能体）、发送后续或 steering（中途引导）输入、注入面向模型的上下文、取消工作，并等待 agent 进入空闲状态。插件、UI、钩子与编排器还可以观察或拦截 agent 活动，并仅为一个 agent 应用能力而不影响其他 agent。当代码需要通过公开 `Agent` API 控制或扩展实时 agent 时，请选择本包。请将它与 `dsh-agent-loop` 等 agent 驱动器配合使用；本包本身不会创建模型请求。发起方归因仅存在于进程内，跨 worker、进程、持久队列与重启时必须显式传递。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## InboxState 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`InboxState`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InboxState {
    readonly 'next-turn': readonly UserMessage[];
    readonly 'next-step': readonly UserMessage[];
}
```

成员检索：`next-step`、`next-turn`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## InboxTarget 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`InboxTarget`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type InboxTarget = 'next-turn' | 'next-step';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## InboxWireState 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`InboxWireState`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InboxWireState {
    readonly 'next-turn': readonly JsonValue[];
    readonly 'next-step': readonly JsonValue[];
}
```

成员检索：`next-step`、`next-turn`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ModelSelection 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`ModelSelection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ModelSelection {
    provider: string;
    model: string;
    reasoningEffort?: ReasoningEffortId;
}
```

成员检索：`model`、`provider`、`reasoningEffort`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ModelSelectionRef 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`ModelSelectionRef`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ModelSelectionRef {
    current: ModelSelection | undefined;
    assembled: ModelSelection | undefined;
}
```

成员检索：`assembled`、`current`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## PreStepDecision 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`PreStepDecision`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PreStepDecision = {
    kind: 'reject';
} | {
    kind: 'enter';
    messages: UserMessage[];
    startsRequestSeries?: true;
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## RequestErrorAction 公开契约

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`RequestErrorAction`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RequestErrorAction = {
    kind: 'retry';
} | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ResumeAgentOptions 公开契约

resumeSessionId指定既有持久Session身份，不是新建seed；parentAgent、agentOptions、创建取消signal和未发布setup具有与create一致的所有权边界。失败必须保留原持久记录，并拒绝用全新Session伪装恢复成功。resume只恢复当前协议与持久化provider支持的会话，不自动复原外部进程。

导入入口：`@deepseek-ai/dsh-agent`；公开符号：`ResumeAgentOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ResumeAgentOptions {
    readonly resumeSessionId: SessionId;
    readonly parentAgent?: Agent;
    readonly agentOptions?: AgentOptions;
    readonly signal?: AbortSignal;
    readonly setup?: AgentSetup;
}
```

成员检索：`agentOptions`、`parentAgent`、`resumeSessionId`、`setup`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
