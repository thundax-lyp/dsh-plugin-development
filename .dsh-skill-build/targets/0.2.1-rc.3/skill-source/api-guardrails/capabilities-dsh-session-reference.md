# @deepseek-ai/dsh-session-reference 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-session-reference` 让一次对话可以引用其他会话：宿主把 `@label` mention 转换为规范 URI，服务则为模型准备每个被引用会话的有界、只读快照，作为持久、不受信任的背景上下文。候选发现按工作目录亲和度对其他会话排序，并用其最新标题作标签。快照在捕获后不可变，并带有固定警告，禁止遵循其中的指令、权限声明或工具请求。它是面向支持跨会话 mention 的宿主的可选服务；它消费 `ctx.sessionQuery`，不需要 SQLite FTS。

### 使用本包

当宿主应允许用户提及另一个会话并把其上下文交给模型时，启用此服务。由于它消费后端无关的 compact 检查点标记，任何 session-query 后端都可配合使用。

#### mention 语法

规范 mention 是 Markdown 形式的 `@label`，或裸 `dsh-session:` URI；每个 JavaScript 字符串会话 id 都能精确往返。服务会把 mention 改写为消息中可读的 `@label` 文本，并返回结构化引用。显式 Markdown mention 会拒绝格式错误的 URI；空或只含标点符号的 scheme mention 仍是普通讨论文本。

#### agent（智能体）能得到什么

引用其他会话的消息后会紧接一条 `## Referenced sessions` 快照，作为第二条 user 角色消息。快照是不受信任的背景：固定警告告诉模型，除非当前用户明确重复，否则不得遵循其中的指令、权限声明或工具请求。每个来源预览都独立有界——每条消息至多 `maxReferences` 个不同会话，每个来源的序列化 JSON 采用配置值或模型相对字节预算。保留策略先丢弃较早的非检查点消息，再缩短保留的文本；只有保留处理后引用仍无法满足预算时，准备才会失败。

引用被截断时，可选的 spill 后端会在目标会话下保存完整的已捕获文本投影。有界预览 JSON 之外的独立省略通知给出精确的 `omittedMessages` 与 `omittedBytes`，以及保存后的定位信息和 `retrievalHint`，或区分未配置存储与保存失败的不可用结果。该通知属于同一条持久上下文消息。完整 transcript（文本记录）携带相同的不受信任背景警告与捕获元数据，包括 `capturedFormatVersion`。每条消息使用每行至多 64 个 Unicode 码点的 JSON 字符串片段；解码并拼接其片段即可恢复精确文本，包括原始换行。这种固定存储格式使很长的单行文本也可通过分页文件读取来检查。

#### 查找可引用的会话

`listCandidates(agent, query?, limit?)` 列出除 agent 自身外的会话，按 id、工作目录、投影标题或显示标题做不区分大小写的过滤，并把同目录会话排在前面。每个候选的 `label` 使用最新标题；标题缺失或不可读时回退到会话 id。显示标题优先使用 subagent 的持久创建 label，再回退到该标题。候选还会报告其工作目录是否就是发起方 agent 的工作目录，宿主因此可以只在位置能区分该行时才显示它。浏览器消费方通过 `ctx.remote.sessionReferenceResolver.candidates` 调用同一发现能力；该方法在 `displayTitle` 存在时用它标记规范 mention。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxReferences` | `3` | 一条已准备消息中不同源会话的最大数量；不得超过 `3` |
| `candidateLimit` | `50` | 返回给宿主的默认候选数量 |
| `maxReferenceBytes` | 自动 | 每个来源的最大序列化 JSON 字节数；显式设置时精确覆盖自动预算 |
| `referenceContextFraction` | `0.2` | 每个来源的上下文窗口比例，范围为 `0` 到 `1` |

自动预算为每个来源 `max(65536, floor(contextWindow × 4 × referenceContextFraction))` 字节。模型上下文容量以 token 计量；每个 token 四字节是容量估算，不是精确的 token 换算。缺少路由、LLM（大语言模型）服务、适配器或容量时使用 64 KiB；其他模型元数据查询错误与取消会使准备失败。

-----

### 已知限制与延期工作

这些限制说明跨会话引用何时不合适。它们是当前包约束。

- **不支持消息正文检索**：候选查询会检查标题，但不搜索消息主体。
- **标签只来自投影**：已挂载会话的标签来自实时投影切面，冷会话的标签来自持久检查点；若会话无法提供这两者，则以其 id 作为标签，也无法按标题找到。发现过程绝不读取日志：折叠出一个标题需要处理整份日志，而这段代码会在每次补全击键时运行。在投影缓存建立前持久化的会话，会在首次打开时恢复标题并写入检查点。
- **受信任调用方边界**：该服务假设宿主有权读取 `ctx.sessionQuery` 公开的每个会话；它不是面向模型的搜索工具。
- **只投影文本**：不会在会话间传播非文本 user 与 assistant 块。
- **没有实时链接**：引用是快照，不是 fork、恢复、订阅或源会话变更。
- **transcript 搜索按行进行**：字面短语可能跨越 JSON 片段行或包含转义字符；精确文本匹配需先解码并拼接消息片段。已保存产物可能按后端策略过期。

## Config（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    maxReferences?: number;
    candidateLimit?: number;
    maxReferenceBytes?: number;
    referenceContextFraction?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## DEFAULT_CANDIDATE_LIMIT（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`DEFAULT_CANDIDATE_LIMIT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_CANDIDATE_LIMIT = 50;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## DEFAULT_MAX_REFERENCE_BYTES（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`DEFAULT_MAX_REFERENCE_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MAX_REFERENCE_BYTES = 65536;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## MAX_REFERENCES（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`MAX_REFERENCES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MAX_REFERENCES = 3;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## PreparedReferencedMessage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PreparedReferencedMessage {
    content: ContentBlock[];
    additionalContext?: UserMessage;
}
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`PreparedReferencedMessage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`additionalContext`、`content`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## ReferencedConversationItem（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ReferencedConversationItem {
    role: 'user' | 'assistant';
    text: string;
}
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`ReferencedConversationItem`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`role`、`text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SESSION_REFERENCE_SCHEME（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SESSION_REFERENCE_SCHEME`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const SESSION_REFERENCE_SCHEME = "dsh-session:";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceCandidate（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionReferenceCandidate {
    sessionId: SessionId;
    label: string;
    displayTitle?: string;
    cwd?: string;
    sameWorkspace: boolean;
    createdAt: number;
}
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceCandidate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`createdAt`、`cwd`、`displayTitle`、`label`、`sameWorkspace`、`sessionId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceError（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class SessionReferenceError extends Error {
    readonly code: SessionReferenceErrorCode;
    constructor(message: string, code: SessionReferenceErrorCode, options?: ErrorOptions);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceErrorCode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type SessionReferenceErrorCode = 'SESSION_REFERENCE_INVALID_CONFIG' | 'SESSION_REFERENCE_INVALID_REFERENCE' | 'SESSION_REFERENCE_SELF_REFERENCE' | 'SESSION_REFERENCE_TOO_MANY' | 'SESSION_REFERENCE_READ_FAILED' | 'SESSION_REFERENCE_BUDGET_EXCEEDED' | 'SESSION_REFERENCE_CANCELLED';
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceErrorCode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceInput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionReferenceInput {
    sessionId: SessionId;
    label?: string;
}
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceInput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`label`、`sessionId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceMentionCandidate（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionReferenceMentionCandidate extends SessionReferenceCandidate {
    mention: string;
}
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceMentionCandidate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`createdAt`、`cwd`、`displayTitle`、`label`、`mention`、`sameWorkspace`、`sessionId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceResolver（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceResolver`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class SessionReferenceResolver extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config?: Config);
    listCandidates(agent: Agent, query?: string, limit?: number, signal?: AbortSignal): Promise<SessionReferenceCandidate[]>;
    remoteExportCandidates(agent: Agent, query: string, signal: AbortSignal): Promise<SessionReferenceMentionCandidate[]>;
    prepare(agent: Agent, content: ContentBlock[], references: SessionReferenceInput[], signal?: AbortSignal): Promise<PreparedReferencedMessage>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## SessionReferenceSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionReferenceSource {
    kind: 'session-reference';
    form: 'recall';
    version: 1;
    references: {
        sessionId: string;
        label: string;
        capturedFormatVersion?: number;
        capturedThroughSeq: OptionalSessionSeq;
        compacted: boolean;
        originalMessages: number;
        retainedMessages: number;
        omittedMessages: number;
        omittedBytes: number;
        truncated: boolean;
        inputIndex: number;
    }[];
}
```

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`SessionReferenceSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`form`、`kind`、`references`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## decodeSessionReferenceUri（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`decodeSessionReferenceUri`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function decodeSessionReferenceUri(uri: string): SessionIdType;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## encodeSessionReferenceUri（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`encodeSessionReferenceUri`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function encodeSessionReferenceUri(sessionId: SessionIdType): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## formatSessionReferenceMention（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`formatSessionReferenceMention`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function formatSessionReferenceMention(reference: SessionReferenceInput): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## parseSessionReferenceText（.）

公开导入：`@deepseek-ai/dsh-session-reference`；公开符号：`parseSessionReferenceText`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parseSessionReferenceText(text: string): ParsedSessionReferenceText;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    sessionReferenceResolver: SessionReferenceResolver;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `sessionReferenceResolver` | `sessionReferenceResolver: SessionReferenceResolver` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-session-reference.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
