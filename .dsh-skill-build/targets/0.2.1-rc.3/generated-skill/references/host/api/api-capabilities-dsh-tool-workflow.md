# @deepseek-ai/dsh-tool-workflow 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-tool-workflow` 让模型运行 JavaScript 编排，将工作委派给多个 subagent，并返回最终 JSON 值。仅当用户明确要求工作流或大型多 agent（智能体）编排时使用；一两项委派应优先使用普通 subagent 调用。前台执行等待所有工作结束；取消或异常完成返回错误，而不是部分成功。`run_in_background: true` 立即返回自有任务 id，并提供实时输出。部署方可以用 `toolName` 重命名工具，用 `maxResultChars` 限制渲染结果。

### 使用本包

`workflow` 工具运行由模型编写的编排脚本，把工作扇出到多个 subagent，并返回脚本的最终 JSON 值。仅当用户明确要求工作流或大型多 agent 编排时使用——例如跨多个文件的审计、一次迁移、多角度研究；一两项委派时优先使用普通 subagent 调用。

#### 调用工具

模型提交三个参数外加一个开关：`meta`（必需的身份数据：`name`、`description`，以及可选的 `whenToUse` 与 `phases`）、`script`（必需的纯 JavaScript 脚本体——不含 `export const meta` 语句；其参数描述携带脚本体规则，工具描述携带钩子约定）、`args`（可选 JSON 对象，作为全局变量 `args` 向脚本公开；裸列表应包装到字段中，使协议 schema 如实表达形态），以及 `run_in_background`（可选；仅在 `enableRunInBackground` 生效时存在）。

前台成功返回包络 `{ kind: 'foreground', runId, agentsStarted, result }`，向模型渲染为 `workflow "<name>" completed (<count> agent<optional-s>).`，后接 `Return value:` 与美化打印的 JSON。无法启动的工作流——脚本解析或 meta 校验失败——返回模型可以修正的错误。取消与执行失败返回 `Error: workflow run was cancelled` 或 `Error: workflow run failed: <error>`；部分输出绝不会被报告为成功。

#### 运行期间的预期

脚本运行期间，父级轮次会等待：工具启动运行、等待其结果，并始终对该运行执行 dispose（资源释放），因此脚本及其子 agent 在每条路径上完全停稳——包括从父级步骤中止信号桥接而来的取消。模型只看到最终结果，永远不会看到中间子 agent 消息；子 agent 自己的工作不会进入父级对话。

#### 后台运行

`run_in_background: true` 会立刻返回 `{ kind: 'background', jobId, runId }`：运行以自有 `workflow` 任务身份注册到 `ctx.jobs`，会话头部任务列表因此从该任务的输出环实时流式显示它的 `phase()`、`log()` 与成员生命周期行，行的进度行跟随当前阶段。没有任何工具步骤信号到达该运行——`job_kill`、列表里的停止控件与 owner 拆除才是取消它的途径。结算即任务的结算：完成的运行把同一份渲染后的返回值作为任务的 result 交出（完成通知宣布它，模型结算后的第一次 `job_output` 携带它一次），被取消的运行以 kill 原因结算为 `killed`，失败的运行以脚本的失败信息结算为 `failed`。没有活体任务注册表与服务于调用方的控制器时调用失败，并点名缺失的组合部件。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `toolName` | `workflow` | 要注册的面向模型工具名称。 |
| `maxResultChars` | `50000` | 渲染结果上限；更长的 JSON 会被截断并附上提示。 |
| `enableRunInBackground` | `true` | 公开 `run_in_background`；关闭后调用同样会被拒绝。 |

-----

### 已知限制与延期工作

这些限制说明该工具尚未支持什么。它们是当前约束，不是任务积压。

- **后台运行不向模型报告中间值**——结算前的 `job_output` 只返回状态；返回值在完成时整体送达，取消仍会丢弃局部输出。
- **`args` 必须是对象，Native 结果文本有界**——调用方把顶层数组／标量包装到字段中；规范工作流结果保持完整，超过 `maxResultChars` 的 JSON 会在面向模型的投影中截断，而不是存储在检索句柄背后。
- **每次工具注册的工作流策略固定**——提供方选择、上限与工具名称属于部署配置，不是模型调用参数。
- **持久记录只覆盖顶层且只供观察**——嵌套 PTC mode dispatch 不记录；记录故障会刻意退化为不完整前缀，而不改变执行。
- **尚无回放后台运行的 recorded-session 场景**——单元与真实引擎组合套件覆盖该路径；快照树只钉住 schema 与提示词文本。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-workflow`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    toolName?: string;
    maxResultChars?: number;
    enableRunInBackground?: boolean;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-workflow`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-workflow`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-workflow`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-workflow";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## ToolWorkflowAgentEndData（./types）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolWorkflowAgentEndData {
    readonly runId: WorkflowRunId;
    readonly seq: number;
    readonly outcome: WorkflowAgentOutcome;
}
```

公开导入：`@deepseek-ai/dsh-tool-workflow/types`；公开符号：`ToolWorkflowAgentEndData`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`outcome`、`runId`、`seq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## ToolWorkflowAgentStartData（./types）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolWorkflowAgentStartData {
    readonly runId: WorkflowRunId;
    readonly seq: number;
    readonly label: string;
    readonly phase?: string;
    readonly childId: SessionId;
}
```

公开导入：`@deepseek-ai/dsh-tool-workflow/types`；公开符号：`ToolWorkflowAgentStartData`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`childId`、`label`、`phase`、`runId`、`seq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## ToolWorkflowRunEndData（./types）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolWorkflowRunEndData {
    readonly runId: WorkflowRunId;
    readonly stopReason: WorkflowStopReason;
}
```

公开导入：`@deepseek-ai/dsh-tool-workflow/types`；公开符号：`ToolWorkflowRunEndData`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`runId`、`stopReason`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## ToolWorkflowRunStartData（./types）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ToolWorkflowRunStartData {
    readonly runId: WorkflowRunId;
    readonly name: string;
}
```

公开导入：`@deepseek-ai/dsh-tool-workflow/types`；公开符号：`ToolWorkflowRunStartData`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`runId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-workflow.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
