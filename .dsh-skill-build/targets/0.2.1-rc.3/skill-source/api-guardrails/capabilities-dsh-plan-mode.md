# @deepseek-ai/dsh-plan-mode 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

计划模式要求 agent 先探索和设计再执行，然后把完成的计划呈交你批准。用 `/plan` 进入，并可附带一条消息或按顺序排列的图片与文件附件；用 `/plan off` 离开，批准评审以继续执行，或反馈意见以要求继续规划。部署方定义的引导控制规划行为，但每个工具仍然可用，因此请用沙箱模式与审批提示施加强制限制。激活状态会在会话恢复和 fork 后保留。当你希望 agent 行动前先提交一份经评审的计划时，选择计划模式。

### 使用本包

计划模式激活时，agent 会按你的指令行事，并先呈交计划供评审，而不是立即执行。常用路径：配置引导文本，用 `/plan` 进入计划模式，agent 调用 `exit_plan_mode` 时评审完成的计划。

#### 何时选择

当希望 agent 先探索和设计再执行、并且想先批准计划时，选择计划模式。它不限制 agent：每个工具仍可调用，因此需要强制限制时请使用沙箱模式与审批提示。当 agent 应立即按你的请求行事、无需规划阶段时，跳过它。

#### 最小配置

唯一必需的配置是 agent 规划期间遵循的引导文本；添加任何其他配置都会在加载时失败。

```yaml
- name: '@deepseek-ai/dsh-plan-mode'
  config:
    section: |
      You are in plan mode. Explore and design before presenting the complete
      plan through exit_plan_mode.
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `section` | 必填 | 计划模式激活时作为 `plan:policy` 提示词段落渲染的引导 |

#### 进入与离开计划模式

输入 `/plan` 进入计划模式，或输入 `/plan <message>` 连同一条指令一起进入——该消息会成为你在计划引导下的下一条请求。输入 `/plan off` 直接离开计划模式；它还会取消尚未生效的计划模式进入。

你可以在 `/plan` 消息中附带图片与通用文件，它们按选择顺序随指令一起提交。带附件的 `/plan off` 会在模式变更前被拒绝，因此草稿和附件卡仍可继续使用。`/plan` 命令在支持斜杠命令的界面中可用，例如 Web 客户端。

#### 经评审的退出

agent 完成计划后，会以 markdown 形式、从标题开头书写计划并调用 `exit_plan_mode`。你评审该计划的原文，选择 `Approve` 离开计划模式，或选择 `Keep planning` 带反馈把 agent 送回去。

选择 `Keep planning`（可附自由文本反馈）会让 agent 回去修订计划；关闭评审改为发言，则结束 agent 当前轮次，你的下一条消息开始下一次请求。若没有可用的交互评审，`exit_plan_mode` 无法运行，你仍可用 `/plan off` 离开计划模式。

#### 观察计划状态

界面可以显示计划模式是否激活，以及你请求的模式变更是否仍在等待生效。该状态在每个标签页中一致，并能在重启后保留。

-----

### 已知限制与延期工作

这些限制描述计划模式在哪些情况下不符合你的预期，或需要额外的注意。它们是当前包约束，不是路线图。

- **引导而非强制**——计划模式只通过文本约束；需要强制限制的部署要分别配置沙箱模式与审批策略。
- **待生效选择只存在于进程内**——某轮最后一个被接受的 pre-step 之后作出的选择，若进程在另一个被接受的轮内 pre-step 之前退出就会丢失；UI 必须重新应用它。
- **没有创建时 plan 选项**——fork 的 agent 继承已记录的计划状态，新 spawn 的 agent 则从未激活开始。
- **存活的子级无法打开评审**——由另一个存活 agent 所有的子级调用 `exit_plan_mode` 会失败，并被要求把尚未解决的决策包含进最终结果；仅有持久化 fork 谱系并不能阻止恢复为运行时根的会话打开该评审。
- **只有一个专用评审渲染器**——只有 Web UI 具备 `plan-review` 呈现；其他交互提供方通过其通用选项流程呈现同一请求。

## EXIT_PLAN_MODE（.）

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`EXIT_PLAN_MODE`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const EXIT_PLAN_MODE = "exit_plan_mode";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## PlanModeConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PlanModeConfig {
    section: string;
}
```

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`PlanModeConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`section`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## PlanModeController（.）

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`PlanModeController`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class PlanModeController extends Service {
    static inject: string[];
    constructor(ctx: Context, config?: PlanModeConfig);
    get(agent: Agent): {
        active: boolean;
        pending?: boolean;
    };
    set(agent: Agent, active: boolean): 'committed' | 'queued' | 'cancelled' | 'noop';
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## PlanProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PlanProjection {
    active: boolean;
    pending: boolean;
}
```

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`PlanProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`active`、`pending`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## PlanUnitState（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PlanUnitState {
    active: boolean;
    wanted: boolean | null;
    running: {
        commandId: CommandId;
        wanted: boolean;
    } | null;
    activeAtLastHeader: boolean | null;
}
```

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`PlanUnitState`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`active`、`activeAtLastHeader`、`running`、`wanted`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## planProjectionDefinition（.）

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`planProjectionDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export declare const planProjectionDefinition: {
    key: "plan";
    stateVersion: number;
    stateSchema: zod.ZodType<PlanUnitState, unknown, zod.core.$ZodTypeInternals<PlanUnitState, unknown>>;
    init: () => {
        active: false;
        wanted: null;
        running: null;
        activeAtLastHeader: null;
    };
    apply: (state: NoInfer<PlanUnitState>, event: import("@deepseek-ai/dsh-session").SessionEvent) => PlanUnitState;
    wire: {
        viewSchema: zod.ZodType<PlanProjection, unknown, zod.core.$ZodTypeInternals<PlanProjection, unknown>>;
        view: (state: NoInfer<PlanUnitState>) => {
            active: boolean;
            pending: boolean;
        };
    };
};
```

这是上方声明的公开对象；按实际类型使用，不把它当作文本常量。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## resolveConfig（.）

公开导入：`@deepseek-ai/dsh-plan-mode`；公开符号：`resolveConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveConfig(config: PlanModeConfig): PlanModeConfig;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    planMode: PlanModeController;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `planMode` | `planMode: PlanModeController` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-plan-mode.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
