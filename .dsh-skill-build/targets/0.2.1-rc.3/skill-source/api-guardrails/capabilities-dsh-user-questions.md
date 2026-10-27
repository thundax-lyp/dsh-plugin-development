# @deepseek-ai/dsh-user-questions 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

当工具或权限流程需要用户提供结构化答案时，使用 `ctx.userQuestions`。`ask()` 会等待回答；`askTimed()` 可以放行 agent 继续独立工作，而问题仍留在会话中供用户回答。

### 提出问题

当工作无法在没有答案的情况下继续时调用 `ask()`。当 agent 可以在一段前台等待后继续独立工作时调用 `askTimed()`。回答 UI 通过 `attachWait` 接手等待，取得 Host 计算的剩余时长，并用本地时钟倒计时。没有接手方时，包括最后一个 Client 断开之后，服务在原 deadline 放行模型。`userQuestions` projection 从工具调用、其结果和最终回复派生持久问题；Client 接手状态不落盘。

对于单选题，`custom` 会覆盖选中的选项，且 `selected` 为空。对于多选题，`custom` 可以补充 `selected` 中的标签。UI 可以把跳过的条目保留为 `{ id, selected: [] }`，既维持现有回答形态，也保留该批次中的其他回答。

问题可以携带呈现意图 `intent`，声明它就是某种已知决策，识别该标记的 UI 可以按该决策呈现；目前唯一的标记是 `plan-review`，其 `detail` 是待审阅的计划，`approve` 指明表示同意的选项。意图只改变呈现：遵循它的 UI 回答的选项标签与通用 UI 相同，不认识该标记的 UI 则渲染通用选项列表。`ask()` 会以 `BAD_INTENT` 拒绝两种类型无法表达的断言：`approve` 未命名该问题自己的任何选项，以及没有 `detail` 的问题声明了意图。`dsh-plan-mode` 在 `exit_plan_mode` 的审阅问题上设置它。

请求包含 agent 时，`ask()` 会通过当前 `AgentRegistry` 验证该 agent 与注册表中的存活实例是同一对象，并且只允许运行时根调用。存活子级不能发起人机交互。不含 agent 的程序化请求仍会交给本地未限定 scope 的 waterfall listener，若无人接受则以 `NO_PROVIDER` 失败。

工具调用开放期间，唯一的回答路径就是这条请求；重新连接的浏览器会再次收到它，仍可完成。调用返回 pending 之后，或拥有它的进程结束之后，问题进入 `continued`：`answer` Remote 方法把回复作为 `user-question-reply` 消息 steer 给 agent。没有任何 Remote 方法会放弃问题——Client 收起面板时不发送任何内容，因此该调用在收到回答前一直可回答。回答已关闭的会话时先恢复其根 agent。两条路径都不会为已结束的工具调用伪造结果。

### 已知限制与暂缓事项

- **带 Agent scope 的 Web 回答**：Remote Events 仅在请求带有存活 Agent scope 时路由随产品交付的 Web 回答者；agentless 调用方需要本地未限定 scope 的 waterfall listener。
- **词汇仅包含问题表单形态**：可供选择的选项加可选的自定义文本；更丰富的交互形态（文件选择器、diff 预览确认）尚无 seam 词汇。
- **草稿文本不属于 Host 问题持久化状态**：问题通过 projection 跨客户端重启保留；未完成的输入仍只保存在一个浏览器配置中。

## AskUserQuestionAnswer（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskUserQuestionAnswer {
    answers: AskUserQuestionAnswerItem[];
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`AskUserQuestionAnswer`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`answers`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## AskUserQuestionAnswerItem（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskUserQuestionAnswerItem {
    id: string;
    selected: string[];
    custom?: string;
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`AskUserQuestionAnswerItem`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`custom`、`id`、`selected`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## AskUserQuestionIntent（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type AskUserQuestionIntent = {
    kind: 'plan-review';
    approve: string;
    callId?: ToolCallId;
};
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`AskUserQuestionIntent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`approve`、`callId`、`kind`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## AskUserQuestionItem（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskUserQuestionItem {
    id: string;
    question: string;
    detail?: string;
    header?: string;
    options?: AskUserQuestionOption[];
    multiSelect?: boolean;
    intent?: AskUserQuestionIntent;
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`AskUserQuestionItem`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`detail`、`header`、`id`、`intent`、`multiSelect`、`options`、`question`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## AskUserQuestionOption（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskUserQuestionOption {
    label: string;
    description?: string;
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`AskUserQuestionOption`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`label`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## AskUserQuestionRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskUserQuestionRequest extends AskUserQuestionRequestEvent {
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`AskUserQuestionRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## PendingUserQuestion（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PendingUserQuestion {
    readonly callId: ToolCallId;
    readonly questions: readonly AskUserQuestionItem[];
    readonly state: UserQuestionState;
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`PendingUserQuestion`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`callId`、`questions`、`state`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## SettledUserQuestion（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SettledUserQuestion {
    readonly callId: ToolCallId;
    readonly answers: readonly AskUserQuestionAnswerItem[];
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`SettledUserQuestion`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`answers`、`callId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## TIMED_WAIT_PARAMETER（.）

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`TIMED_WAIT_PARAMETER`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const TIMED_WAIT_PARAMETER = "timeout";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## TimedUserQuestionResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TimedUserQuestionResult = AskUserQuestionAnswer | {
    pending: true;
    callId: ToolCallId;
};
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`TimedUserQuestionResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## UserQuestionError（.）

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`UserQuestionError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class UserQuestionError extends HarnessError {
    constructor(message: string, code: string, options?: ErrorOptions);
}
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## UserQuestionProjectionView（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UserQuestionProjectionView {
    readonly active: readonly PendingUserQuestion[];
    readonly settled: readonly SettledUserQuestion[];
}
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`UserQuestionProjectionView`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`active`、`settled`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## UserQuestionService（.）

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`UserQuestionService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class UserQuestionService extends TypertRemoteService {
    static Config: z<Schemastery.ObjectS<{}>, Schemastery.ObjectT<{}>, "plain">;
    constructor(ctx: Context);
    answer(agent: Agent, callId: ToolCallId, answer: AskUserQuestionAnswer): boolean;
    attachWait(agent: Agent, callId: ToolCallId, signal: AbortSignal): AsyncIterable<{
        remainingMs: number;
    }>;
    askTimed(request: AskUserQuestionRequest & {
        agent: Agent;
    }, callId: ToolCallId, timeoutMs: number): Promise<TimedUserQuestionResult>;
    ask(request: AskUserQuestionRequest): Promise<AskUserQuestionAnswer>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## UserQuestionState（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type UserQuestionState = 'open' | 'continued';
```

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`UserQuestionState`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## isTimedAskUserQuestionSchema（.）

公开导入：`@deepseek-ai/dsh-user-questions`；公开符号：`isTimedAskUserQuestionSchema`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isTimedAskUserQuestionSchema(tool: Pick<ToolSchema, 'name' | 'parameters'>): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## AskUserQuestionRequestEvent（./types）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AskUserQuestionRequestEvent {
    questions: AskUserQuestionItem[];
    agent?: Agent;
    signal?: AbortSignal;
    wait?: {
        callId: ToolCallId;
        timed?: boolean;
    };
}
```

公开导入：`@deepseek-ai/dsh-user-questions/types`；公开符号：`AskUserQuestionRequestEvent`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agent`、`questions`、`signal`、`wait`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'user-questions/request'(this: Scoped<Agent>, request: AskUserQuestionRequestEvent, next: () => Promise<AskUserQuestionAnswer>): Promise<AskUserQuestionAnswer>;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `user-questions/request` | `'user-questions/request'( this: Scoped<Agent>, request: AskUserQuestionRequestEvent, next: () => Promise<AskUserQuestionAnswer>, ): Promise<AskUserQuestionAnswer>` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    userQuestions: UserQuestionService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `userQuestions` | `userQuestions: UserQuestionService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-user-questions.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
