# dsh-llm-message 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 message 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm.md)；本页逐项保留对象的参数、字段和判别分支。

## AssistantMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AssistantMessage extends MessageBase {
    readonly role: 'assistant';
    readonly source: ModelMessageSource;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AssistantMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`role`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## AssistantProviderMetadata（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AssistantProviderMetadata {
    provider: string;
    model: string;
    replayState?: unknown;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AssistantProviderMetadata`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`model`、`provider`、`replayState`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## CONTEXT_SUMMARY_MAX_CHARS（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`CONTEXT_SUMMARY_MAX_CHARS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const CONTEXT_SUMMARY_MAX_CHARS = 120;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ContextForm（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ContextForm = 'instructions' | 'catalog' | 'snapshot' | 'notice' | 'relay' | 'recall';
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ContextForm`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ContextFormed（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ContextFormed = {
    readonly form?: never;
} | {
    readonly form: 'instructions';
} | {
    readonly form: 'catalog';
} | {
    readonly form: 'snapshot';
    readonly sections: readonly ContextSnapshotSection[];
} | {
    readonly form: 'notice';
    readonly summary: string;
} | {
    readonly form: 'relay';
} | {
    readonly form: 'recall';
};
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ContextFormed`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`form`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ContextSnapshotSection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ContextSnapshotSection {
    readonly name: string;
    readonly text: string;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ContextSnapshotSection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## DeveloperMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeveloperMessage extends MessageBase {
    readonly role: 'developer';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`DeveloperMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`role`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## Message（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type Message = MessageRoleMap[keyof MessageRoleMap];
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`Message`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`content`、`id`、`role`、`source`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## MessageRoleMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface MessageRoleMap {
    system: SystemMessage;
    developer: DeveloperMessage;
    user: UserMessage;
    assistant: AssistantMessage;
    tool: ToolResultMessage;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`MessageRoleMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`assistant`、`developer`、`system`、`tool`、`user`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## MessageSource（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type MessageSource = MessageSourceMap[keyof MessageSourceMap];
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`MessageSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## MessageSourceMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

声明来源包 `@deepseek-ai/dsh-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface MessageSourceMap {
    user: {
        kind: 'user';
    };
    model: ModelMessageSource;
    tool: ToolMessageSource;
    'system-prompt': SystemPromptMessageSource;
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'model-selection': {
        kind: 'model-selection';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-user-approval`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'user-approval': {
        kind: 'user-approval';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-tools`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'ptc-mode': {
        kind: 'ptc-mode';
    };
}
```

声明来源包 `@deepseek-ai/dsh-tools`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'tool-registry': {
        kind: 'tool-registry';
    };
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'agent-message': AgentMessageSource;
    'subagent-settled': SubagentSettledMessageSource;
}
```

声明来源包 `@deepseek-ai/dsh-user-questions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'user-question-reply': {
        kind: 'user-question-reply';
        callId: ToolCallId;
        outcome: 'answered';
    };
}
```

声明来源包 `@deepseek-ai/dsh-compaction`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'compact-checkpoint': CompactionCheckpointSource;
}
```

声明来源包 `@deepseek-ai/dsh-skill`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'skill-invocation': SkillInvocationSource;
}
```

声明来源包 `@deepseek-ai/dsh-session-reference`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'session-reference': SessionReferenceSource;
}
```

声明来源包 `@deepseek-ai/dsh-session-title-llm`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'dsh-session-title-llm': {
        kind: 'dsh-session-title-llm';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    goal: GoalMessageSource;
}
```

声明来源包 `@deepseek-ai/dsh-experimental-agent-team`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'team-message': TeamMessageSource;
}
```

声明来源包 `@deepseek-ai/dsh-repeat-tool-reminder`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'repeat-tool-reminder': {
        kind: 'repeat-tool-reminder';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-webhook`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    webhook: {
        readonly kind: 'webhook';
        readonly provider: string;
        readonly source: WebhookSourceId;
        readonly deliveryId: WebhookDeliveryId;
        readonly ruleId: WebhookRuleId;
        readonly form: 'notice';
        readonly summary: string;
    };
}
```

声明来源包 `@deepseek-ai/dsh-hooks-claude-code`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'hooks-claude-code': {
        kind: 'hooks-claude-code';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-plan-mode`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'plan-mode': {
        kind: 'plan-mode';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-hooks-codex`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'hooks-codex': {
        kind: 'hooks-codex';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-agent-instructions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'agent-instructions': AgentInstructionSource;
}
```

声明来源包 `@deepseek-ai/dsh-tool-skill`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'skill-catalog': SkillCatalogSource;
}
```

声明来源包 `@deepseek-ai/dsh-tool-goal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'tool-goal': {
        kind: 'tool-goal';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-time-context`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'time-context': {
        kind: 'time-context';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-tmux-context`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'tmux-context': {
        kind: 'tmux-context';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-api-session-controller`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'user-rpc': {
        kind: 'user';
        rpcId: SessionRequestId;
        clientTimeZone?: string;
        principal?: Principal;
    };
}
```

声明来源包 `@deepseek-ai/dsh-cordis-host-runner`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'cordis-host-runner': {
        kind: 'cordis-host-runner';
    };
}
```

声明来源包 `@deepseek-ai/dsh-tool-jobs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'tool-jobs': {
        kind: 'tool-jobs';
    } & ContextFormed;
}
```

声明来源包 `@deepseek-ai/dsh-working-directory`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface MessageSourceMap {
    'working-directory': {
        kind: 'working-directory';
    };
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`MessageSourceMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`model`、`system-prompt`、`tool`、`user`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ModelMessageSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModelMessageSource extends AssistantProviderMetadata {
    kind: 'model';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ModelMessageSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`model`、`provider`、`replayState`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## SystemMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SystemMessage extends MessageBase {
    readonly role: 'system';
    readonly source: MessageSourceMap['system-prompt'];
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`SystemMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`role`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## SystemPromptMessageSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SystemPromptMessageSource {
    kind: 'system-prompt';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`SystemPromptMessageSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolMessageSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolMessageSource {
    kind: 'tool';
    callId: ToolCallId;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolMessageSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`callId`、`kind`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolResultMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolResultMessage extends MessageBase {
    readonly role: 'tool';
    readonly source: ToolMessageSource;
    readonly toolCallId: ToolCallId;
    readonly isError?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolResultMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`isError`、`role`、`source`、`toolCallId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## ToolResultMessageInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolResultMessageInput {
    readonly callId: ToolCallId;
    readonly content: readonly ContentBlock[];
    readonly isError: boolean;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`ToolResultMessageInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`callId`、`content`、`isError`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## UserMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UserMessage extends MessageBase {
    readonly role: 'user';
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`UserMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`role`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## boundContextSummary（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`boundContextSummary`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function boundContextSummary(summary: string): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## createAssistantMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`createAssistantMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createAssistantMessage(input: NewAssistantMessage & {
    readonly id?: never;
    readonly role?: never;
}): AssistantMessage;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## createDeveloperMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`createDeveloperMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createDeveloperMessage<T extends NewDeveloperMessage>(input: T & {
    readonly id?: never;
    readonly role?: never;
}): T & Pick<DeveloperMessage, 'id' | 'role'>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## createMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`createMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createMessage<T extends NewMessage>(input: T & {
    readonly id?: never;
}): T & Pick<Message, 'id'>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## createSystemMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`createSystemMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createSystemMessage(text: string): SystemMessage;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## createToolResultMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`createToolResultMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createToolResultMessage(input: ToolResultMessageInput): ToolResultMessage;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## createUserMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`createUserMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createUserMessage<T extends NewUserMessage>(input: T & {
    readonly id?: never;
    readonly role?: never;
}): T & Pick<UserMessage, 'id' | 'role'>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## freezeMessage（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`freezeMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function freezeMessage<T extends Message>(message: T): T;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。
