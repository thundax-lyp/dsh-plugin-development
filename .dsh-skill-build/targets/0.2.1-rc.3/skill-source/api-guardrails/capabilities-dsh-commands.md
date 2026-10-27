# @deepseek-ai/dsh-commands 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-commands` 让用户能在交互式 Harness UI 中运行 `/command [input]` 操作，且不会把命令或结果变成模型消息。命令可以展示输入提示、接受附件，并只针对一个 agent 生效，同时为其他 agent 保留同名的全局命令。每次通过准入的执行都会记录到接收 agent 的会话日志中，UI 则在模型历史之外渲染结算结果。它适合为 `dsh` CLI（命令行界面）或 Web 客户端提供直接面向用户的控制；无 UI 的演示与 ACP（Agent Client Protocol）自动化不提供此命令面。

### 使用本包

当交互式 UI 希望用户用斜杠命令而非模型提示词驱动 agent 侧行为时，组合此服务。无 UI 的演示主干和 ACP 自动化不提供命令适配器，也不需要它。

#### 注册命令

插件通过 `ctx.commands.register()` 注册命令，提供小写名称、发现界面中的说明、可选的 `input` 提示和处理器。可选的品牌类型字段 `definitionId` 为适配器提供带插件命名空间的稳定定义标识，它独立于显示文案和每次执行的 `commandId`。有效描述符只携带被选中定义的标识，作用域覆盖不会继承被遮蔽注册项的标识。

处理器返回 `success` 或 `error`，并可附带由适配器渲染的 UI 文本。`recordInput` 默认为 true；若载荷由命令自己的权威领域事件持有，命令会将 `recordInput` 设为 false，避免会话日志重复记录该输入。同一作用域内重复注册同名命令会抛出异常。

#### 命令语法

命令行的第 0 字节必须是斜杠，随后是小写名称（可含字母、数字、`_` 或 `-`），再之后是输入末尾或空白。名称之后的每个字节——包括分隔空白——都是该命令的 `rawInput`，命令自己拥有其专属语法。不符合命令语法、或名称未知的行会被适配器拒绝，而不是变成模型提示词。

#### 限定到 agent 的命令

普通注册全局生效。挂载在 agent 自身上下文之下的命令生产插件会声明 `commands` 注入，并注册精确限定到该 agent 的命令；该定义只对这个 agent 遮蔽同名的全局定义。

#### 附件

命令可以声明 `input.attachments` 以接受 composer 图片与通用文件。执行器负责强制执行声明：把附件发给未声明的命令、附件存储缺失、会话范围内的文件上传凭证未知或图片批量超出限制，都会在处理器运行前以错误结果结算。图片以 base64 输入通过命令 wire，通用文件则引用后台上传完成后得到的凭证，因此命令提交不会再次读取文件字节。通过准入的 `ImageBlock` 与 `FileBlock` 按用户选择顺序组成冻结的 `invocation.attachments` 数组，其模型可见用途由处理器负责。

#### 从适配器分派

交互式适配器调用 `execute(agent, line, attachments, signal)`，传入确切的接收 agent、完整命令行与本次提交的有序附件。它返回已结算的 `CommandExecution`——规范化结果加生命周期配对 `commandId`——语法无效或名称未知时返回 `undefined`。`list(agent)` 与 `find(agent, name)` 在应用 agent 作用域遮蔽后用于命令发现。

#### 取消

调用方的中止信号会让注册表停止等待处理器；无视信号的处理器可能在调用方停止等待后继续产生自身的外部副作用。被取消或抛异常的处理器在日志中以 `command/done` 错误结算。

-----

### 已知限制与延期工作

这些限制说明注册表不提供什么。它们是当前包约束，不是 UI 积压事项。

- **仅支持非结构化文本输入**：表单、补全 schema 和类型化参数仍由各命令自行解析。
- **副作用采用协作式取消**：中止后，分发会停止等待；处理器必须遵循信号，才能停止已经进入外部系统的工作。

## CommandDefinition（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandDefinition {
    readonly definitionId?: CommandDefinitionId;
    readonly name: string;
    readonly description: string;
    readonly input?: CommandInputDescriptor;
    readonly recordInput?: boolean;
    readonly handler: (invocation: CommandInvocation) => CommandResult | Promise<CommandResult>;
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`definitionId`、`description`、`handler`、`input`、`name`、`recordInput`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandDefinitionId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function CommandDefinitionId(id: string): CommandDefinitionId;

export type CommandDefinitionId = Branded<'CommandDefinitionId'>;
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandDefinitionId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandDescriptor（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandDescriptor {
    readonly definitionId?: CommandDefinitionId;
    readonly name: string;
    readonly description: string;
    readonly input?: CommandInputDescriptor;
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandDescriptor`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`definitionId`、`description`、`input`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandExecution（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandExecution {
    readonly commandId: CommandId;
    readonly result: CommandResult;
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandExecution`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`commandId`、`result`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandFileReceiptResolver（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CommandFileReceiptResolver = (agent: Agent, receiptId: string) => FileAttachmentRef | undefined;
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandFileReceiptResolver`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function CommandId(id: string): CommandId;

export type CommandId = Branded<'CommandId'>;
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandInputDescriptor（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandInputDescriptor {
    readonly hint: string;
    readonly attachments?: boolean;
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandInputDescriptor`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`attachments`、`hint`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandInvocation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandInvocation {
    readonly commandId: CommandId;
    readonly agent: Agent;
    readonly rawInput: string;
    readonly attachments: readonly (ImageBlock | FileBlock)[];
    readonly signal: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandInvocation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agent`、`attachments`、`commandId`、`rawInput`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CommandResult = {
    readonly kind: 'success';
    readonly text?: string;
    readonly sourceEventSeq?: SessionSeq;
} | {
    readonly kind: 'error';
    readonly text: string;
};
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`、`text`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandRuntime（.）

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class CommandRuntime extends TypertRemoteService {
    constructor(ctx: Context);
    register(definition: CommandDefinition): () => void;
    registerFileReceiptResolver(resolver: CommandFileReceiptResolver): () => void;
    list(agent: Agent): readonly CommandDescriptor[];
    find(agent: Agent, name: string): CommandDefinition | undefined;
    execute(agent: Agent, line: string, submittedAttachments: readonly CommandSubmitAttachment[], signal: AbortSignal): Promise<CommandExecution | undefined>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandSource（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CommandSource = CommandSourceMap[keyof CommandSourceMap];
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandSourceMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandSourceMap {
    user: {
        kind: 'user';
    };
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandSourceMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`user`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## CommandSubmitAttachment（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type CommandSubmitAttachment = ({
    readonly type: 'image';
} & EncodedImageAttachment) | {
    readonly type: 'file';
    readonly receiptId: string;
};
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`CommandSubmitAttachment`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## ParsedCommand（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ParsedCommand {
    readonly name: string;
    readonly rawInput: string;
}
```

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`ParsedCommand`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`rawInput`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "commands";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

## parseCommand（.）

公开导入：`@deepseek-ai/dsh-commands`；公开符号：`parseCommand`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parseCommand(line: string): ParsedCommand | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-commands.md)。

### 命令输入、模型边界与卸载

`CommandDefinition.name` 为不带 `/` 的小写名称；description 用于 UI 发现，handler 接收 invocation 并返回 success/error 判别结果。`rawInput` 保留命令名后的精确分隔空白。未声明 `input.attachments` 的命令拒绝附件；声明后 registry 准入持久附件，handler 决定是否以及怎样形成模型内容。

注册在 calling scope 内，同层同名冲突；agent 层命令可覆盖全局而不影响其他 Agent。`recordInput` 默认 true，只有已有权威 domain event 拥有 payload 时才关闭，以免失去审计。`execute` 在接收 Agent 上记录 command/run 和 command/done 并用 commandId 配对；命令文字和直接结果不自动成为模型消息。

handler 应响应 invocation.signal。调度在 abort 时停止等待，已经外逃的外部副作用仍要求 handler 自己停止；这不是硬中断。注册返回 disposer，卸载后 `find/list` 不再展示贡献命令。需要驱动模型的生产者必须显式调用 Agent 的公开入口，不能依赖 UI 输出隐式进入模型。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    commands: CommandRuntime;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `commands` | `commands: CommandRuntime` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-commands.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'commands/change'(): void;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `commands/change` | `'commands/change'(): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-commands.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
