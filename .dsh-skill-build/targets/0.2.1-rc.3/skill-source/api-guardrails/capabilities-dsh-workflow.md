# @deepseek-ai/dsh-workflow 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

运行一段纯 JavaScript 编排脚本，将工作扇出给 subagent，并返回脚本的最终 JSON 值。脚本可以使用 `agent()`、`parallel()`、`pipeline()`、`phase()` 和 `log()`；模型通常通过 `workflow` 工具访问它们。每次运行都归调用方所有，将每个子 agent（智能体）归属于调用它的 agent，在失败或取消时以结果兑现而不拒绝，并在 dispose（资源释放）期间等待脚本与子 agent 清理完成。调用方必须提供执行引擎，因此可以更换隔离策略而不改变可见行为。

### 使用本包

当任务分解为许多独立部分、适合用一段脚本统一协调——例如跨多个文件的审计、一次迁移、多角度研究——且模型明确要求工作流式编排时，运行工作流。一两项委派时，优先使用普通 subagent 调用。

#### 模型侧路径

模型通过 `dsh-tool-workflow` 的 `workflow` 工具触达该能力；该工具拥有调用 schema 与结果包络，引擎提供其下的执行。一次工具调用提交 `meta`、`script` 与可选 `args`，运行完成时返回 `{ runId, agentsStarted, result }`。工具会阻塞父级轮次直到整个工作流结算，因此模型只看到最终结果，永远不会看到中间子 agent 消息。

#### 运行工作流脚本

编排脚本是纯 JavaScript 脚本体（不是 TypeScript），以顶层 `await` 运行并以 `return <json-value>` 结尾。`meta` 身份块与任何 `args` 都以普通 JSON 数据到达——绝不作为代码求值。执行期间脚本调用提供的钩子：`agent(prompt, opts)` 启动一个 subagent，并以其最终文本、或在提供 schema 时以经过校验的结构化值兑现；`parallel()` 与 `pipeline()` 组合独立工作；`phase()` 与 `log()` 为观察者叙述进度。

脚本结算时，运行的 result 以返回值、结束原因和已启动的子 agent 数量兑现。脚本不返回值时得到 `null`。

#### 编程方式运行

插件消费方可以直接启动运行：`ctx.workflowEngine.start({ script, meta, args?, parent, signal? })`。`parent` 把每个子 agent 归属于调用它的 agent；`signal` 在中止时取消运行。`start()` 在运行存在之前校验 meta 块并解析脚本，因此格式错误的请求会立即以违规清单失败。

返回的运行公开 `id`、`meta`、`result`、`cancel(reason?)` 与 `dispose()`。result 绝不拒绝：脚本失败以 `stopReason: 'error'` 兑现，取消以 `'cancelled'` 兑现。调用方拥有该运行——每条路径都要调用 `dispose()`；它会取消剩余工作，并按提供方的生命周期约定等待脚本与子 agent 清理完成。

#### 失败与恢复

无法解析的脚本、格式错误的 meta 块、不可用的提供方路由或不受支持的单次运行限制，都会在运行存在之前被同步拒绝；`workflow` 工具把这些报告为模型可以修正的错误。执行期间，钩子误用——错误参数、未知选项、不支持的 schema、超出上限——会明确终止脚本，而不会转为逐项 `null`。普通子 agent 失败不是基础设施错误：`agent()` 以 `null` 兑现，由脚本决定如何处理。

-----

### 已知限制与延期工作

这些限制说明该能力尚未支持什么。它们是当前约束，不是任务积压。

- **仅支持前台收集**——调用方拥有一个活动运行并等待它；后台启动／轮询、spill 句柄与分离收集均暂缓。
- **没有日志化或恢复**——脚本、子 agent 进度与中间值均不设检查点，因此进程重启后无法继续运行。
- **没有已保存或嵌套工作流**——该能力只启动调用方提供的脚本，工作流脚本不会收到用于递归编排的 `workflow()` 钩子。
- **没有 token 预算词汇**——引擎限制并发、条目与子 agent，但请求与结果都不会统计跨子 agent 的模型 token。
- **运行由持有方负责，不由服务跟踪**——卸载引擎不会发现独立的活动句柄；每个消费方都必须 dispose 自己启动的运行。

## WorkflowAgentEndInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowAgentEndInfo extends WorkflowAgentInfo {
    outcome: WorkflowAgentOutcome;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowAgentEndInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`childId`、`label`、`outcome`、`phase`、`seq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowAgentInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowAgentInfo {
    seq: number;
    label: string;
    phase?: string;
    childId: SessionId;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowAgentInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`childId`、`label`、`phase`、`seq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowAgentOutcome（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type WorkflowAgentOutcome = 'completed' | 'failed' | 'cancelled';
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowAgentOutcome`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowEngine（.）

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowEngine`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare abstract class WorkflowEngine extends Service {
    constructor(ctx: Context);
    abstract start(request: WorkflowStartRequest): WorkflowRun;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowError（.）

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class WorkflowError extends HarnessError {
    readonly fatal: boolean;
    constructor(message: string, code: WorkflowErrorCode, options?: ErrorOptions & {
        fatal?: boolean;
    });
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowErrorCode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type WorkflowErrorCode = 'SCRIPT_PARSE' | 'META_INVALID' | 'INVALID_ARGUMENT' | 'UNSUPPORTED_OPTION' | 'UNSUPPORTED_SCHEMA' | 'AGENT_CAP' | 'ITEM_CAP' | 'AGENT_START' | 'AGENT_RESULT' | 'RESULT_UNSERIALIZABLE' | 'CANCELLED';
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowErrorCode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowEventName（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type WorkflowEventName = 'workflow/start' | 'workflow/phase' | 'workflow/log' | 'workflow/agent-start' | 'workflow/agent-end' | 'workflow/end';
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowEventName`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowMeta（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowMeta {
    name: string;
    description: string;
    whenToUse?: string;
    phases?: WorkflowPhase[];
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowMeta`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`description`、`name`、`phases`、`whenToUse`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowPhase（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowPhase {
    title: string;
    detail?: string;
    provider?: string;
    model?: string;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowPhase`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`detail`、`model`、`provider`、`title`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowResult {
    value: unknown;
    stopReason: WorkflowStopReason;
    error?: string;
    agentsStarted: number;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentsStarted`、`error`、`stopReason`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowResultInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowResultInfo {
    stopReason: WorkflowStopReason;
    error?: string;
    agentsStarted: number;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowResultInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentsStarted`、`error`、`stopReason`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowRun（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowRun {
    readonly id: WorkflowRunId;
    readonly meta: WorkflowMeta;
    readonly result: Promise<WorkflowResult>;
    cancel(reason?: string): void;
    dispose(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowRun`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cancel`、`dispose`、`id`、`meta`、`result`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowRunId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function WorkflowRunId(id: string): WorkflowRunId;

export type WorkflowRunId = Branded<'WorkflowRunId'>;
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowRunId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowRunInfo（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowRunInfo {
    id: WorkflowRunId;
    meta: WorkflowMeta;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowRunInfo`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`meta`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowStartRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WorkflowStartRequest {
    script: string;
    meta: WorkflowMeta;
    args?: unknown;
    subagentProvider?: string;
    maxTotalAgents?: number;
    parent: Agent;
    signal?: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowStartRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`args`、`maxTotalAgents`、`meta`、`parent`、`script`、`signal`、`subagentProvider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## WorkflowStopReason（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type WorkflowStopReason = 'completed' | 'cancelled' | 'error';
```

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`WorkflowStopReason`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

## isFatalWorkflowError（.）

公开导入：`@deepseek-ai/dsh-workflow`；公开符号：`isFatalWorkflowError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function isFatalWorkflowError(error: unknown): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)。

### Workflow 活对象与持久结果

`WorkflowEngine.start(request)` 接收纯 JavaScript 函数体，允许顶层 await，以 `return` 返回 JSON 值；不是 TypeScript 文件。`meta` 和 `args` 都是数据，不执行其中内容。`parent` 必填，脚本创建的每个 child 都归这个调用 Agent。

启动先验证 meta 与脚本，非法输入会在 run 创建前失败。`WorkflowRun.result` 以 `WorkflowResult` 兑现，不因脚本失败或取消而 reject；调用方检查 stopReason。无返回值按 null 处理。持有者在 `finally` 中 `await run.dispose()`；它幂等，取消未结束工作并等待脚本及子任务清理。`cancel()` 发起取消，不等同于清理完成。

脚本 hook 为 `agent`、`parallel`、`pipeline`、`phase`、`log`。schema 子任务输出需要经过验证；前台 workflow 工具等待最终结果。选择执行引擎时挂载 `dsh-workflow-ptc` 和实际 `ptcRuntime` provider，抽象 seam 不提供脚本执行环境。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    workflowEngine: WorkflowEngine;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `workflowEngine` | `workflowEngine: WorkflowEngine` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'workflow/start'(info: WorkflowRunInfo): void;
    'workflow/phase'(info: WorkflowRunInfo, title: string): void;
    'workflow/log'(info: WorkflowRunInfo, message: string): void;
    'workflow/agent-start'(info: WorkflowRunInfo, agent: WorkflowAgentInfo): void;
    'workflow/agent-end'(info: WorkflowRunInfo, agent: WorkflowAgentEndInfo): void;
    'workflow/end'(info: WorkflowRunInfo, result: WorkflowResultInfo): void;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `workflow/start` | `'workflow/start'(info: WorkflowRunInfo): void` |
| `workflow/phase` | `'workflow/phase'(info: WorkflowRunInfo, title: string): void` |
| `workflow/log` | `'workflow/log'(info: WorkflowRunInfo, message: string): void` |
| `workflow/agent-start` | `'workflow/agent-start'(info: WorkflowRunInfo, agent: WorkflowAgentInfo): void` |
| `workflow/agent-end` | `'workflow/agent-end'(info: WorkflowRunInfo, agent: WorkflowAgentEndInfo): void` |
| `workflow/end` | `'workflow/end'(info: WorkflowRunInfo, result: WorkflowResultInfo): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-workflow.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
