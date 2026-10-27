# @deepseek-ai/dsh-session-title-all-prompts-llm 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-session-title-all-prompts-llm` 作为可选的 `ctx.sessionTitle` 提供方，通过 `ctx.llm` 总结所有符合条件的用户消息。它注册 `all-prompts` 节奏，并在每条新用户提示词后启动新修订，使用预置历史与子会话提示词。较新的修订会中止并取代旧工作，即使提供方忽略取消，也无法提交陈旧输出。它同时拥有初始生成提示词与修订提示词，只与首消息提供方共享 `dsh-session-title-llm` 的执行模块。本文优先介绍自动行为与配置；实现是建立在该执行器之上的小型提供方策略。

### 使用本包

当会话应随其增长而重新生成标题、使标题持续代表整个对话时，在标题服务旁挂载此插件。它要求自己的 `targetWords` 与 `targetCjkCharacters`，外加共享的执行控制，且全部无默认值。

#### 标题生成时机

每条新的符合条件用户提示词之后都会启动新修订，包括子会话中的提示词；生成会折叠截至当前修订的所有符合条件消息，预置历史也包含在内。较新的修订会中止并取代旧工作，因此陈旧的完成结果永远无法提交。自动失败——包括输入超过 `maxInputBytes`（此时请求失败而非截断历史）——会发出警告并保留先前标题；`ctx.sessionTitle.refresh()` 是显式重试。

已有提供方生成的标题后，每次请求都会包含该标题，并要求模型在它仍能描述主要主题或任务时逐字保留。同主题追问、补充细节、致谢（如“谢谢”）和继续请求本身都不构成改写理由。指令要求模型仅在主要主题或任务发生实质变化或扩展、使旧标题不再准确时更新。回退标题仍会正常触发首次生成；每条符合条件的提示词仍会安排一次修订。

#### 配置

#### 失败与恢复

如果最终封装的聚合提示词超过 `maxInputBytes`，请求会失败而不是截断历史；自动使用时会发出警告并保留先前标题，只有显式 `refresh()` 会重试。自动工作不会为主 agent 请求增加 token 或延迟。

-----

### 已知限制与延期工作

这些限制说明提供方如何对待长会话与异构会话。它们是当前包约束。

- **没有基于摘要继续生成摘要的机制**——输入溢出时保留先前标题；对于很长的会话，此提供方没有基于摘要继续生成摘要的机制或保留策略。
- **消息被平等对待**——它包含每条符合条件的用户消息，不提供可配置的权重或过滤。
- **稳定性依赖模型**——保留标题依靠模型指令，没有确定性的语义校验；模型仍可能改动合适的标题。

## Config（.）

公开导入：`@deepseek-ai/dsh-session-title-all-prompts-llm`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config extends SessionTitleLlmConfig {
    readonly targetWords: number;
    readonly targetCjkCharacters: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-title-all-prompts-llm.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-session-title-all-prompts-llm`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-title-all-prompts-llm.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-session-title-all-prompts-llm`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-title-all-prompts-llm.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-session-title-all-prompts-llm`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "session-title-all-prompts-llm";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-title-all-prompts-llm.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
