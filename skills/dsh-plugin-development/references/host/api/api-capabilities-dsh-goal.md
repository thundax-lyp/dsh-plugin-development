# @deepseek-ai/dsh-goal 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-goal` 让一个长期完成目标在多轮、会话恢复、fork 与进程重启后持续存在。用户与 agent（智能体）可以 create、edit、pause、resume、complete、block 或 clear 该目标；比较并设置的更新会拒绝陈旧视图。可配置的 Round 上限（默认 256）约束自动续行，被阻塞的 goal 会保留稳定的策略代码和面向人的说明。本包存储 goal 状态但不调度工作，续行权限是进程本地的而非持久状态。单个目标需要横跨多轮时选择本包；常规单轮工作或并行目标不要使用。

### 使用本包

当会话需要在多轮与多次重启之间记住一个长期完成目标时，挂载 `dsh-goal`。本包是服务：模型工具、`/goal` 命令与续行驱动器都是消费同一 goal 状态的独立包，因此只挂载本包只会存储和提供 goal，不会启动任何工作。

#### 何时使用

goal 适合一个需要跨自动 Goal Round 持续的长期完成目标——例如完成一次迁移，或修复所有失败的文档门禁。常规单轮工作不应创建 goal。服务每会话至多保留一个当前 goal：未完成的 goal 必须先 edit、pause、resume、block 或 clear，才能被另一个替代；已完成的 goal 可以直接被替换。

#### 配置服务

通过组合配置项加载本包；唯一的部署选择是默认 Round 上限，应用于未自行指定上限的 create。

```yaml
- name: '@deepseek-ai/dsh-goal'
  config:
    defaultMaxGoalRounds: 256
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `defaultMaxGoalRounds` | `256` | 当 create 请求省略上限时应用的 Round 上限 |

#### 会话投影

`GoalService` 要求组合提供 `ctx.sessionProjections`（`@deepseek-ai/dsh-session-projection`），并在启动时注册 `goal` 投影单元；未组合投影注册表的组合无法激活 `ctx.goals`。该单元版本为 6，其宿主状态保留最新的有效当前 goal、所有曾使用的 goal id，以及第一次严格回放失败。客户端视图提供当前 goal；首次 create 前与 clear tombstone 后为 `null`。该键同时合并到 `SessionProjectionStateMap` 与 `SessionProjectionMap`；载体通过历史尾页和 `session/projection` 推送帧提供客户端值。

#### 驱动生命周期

goal 经历四种持久 phase——`active`、`paused`、`blocked`、`complete`——外加一个进程本地标志，表示自动续行是否已启用。动词如下：

| 操作 | 作用 |
|---|---|
| `create` | 以目标和 Round 上限启动一个 active goal |
| `edit` | 修改目标和/或 Round 上限，不改变 phase |
| `pause` | 停止自动续行并保留状态 |
| `resume` | 重新开始续行；也用于会话恢复或 fork 后重新启用 active goal |
| `complete` | 标记 goal 已完成并停止续行 |
| `block` | 记录稳定的 blocker 代码与说明 |
| `clear` | 移除当前 goal；其历史保留在会话日志中 |

pause、complete、block 和 clear 都会停用续行。block 是唯一保留策略自有 lower-kebab-case 代码与自由文本说明的 phase，因此提供方限制、预算耗尽、执行错误与请求人工输入共用一种持久 phase，而不是扩增生命周期状态。resume 只在 Round 上限仍有剩余容量时接受已停止的 goal，或 active 但已停用续行的 goal，并清除任何先前的 blocker reason。

#### 什么会保留，什么不会

每项被接受的变更都会持久记录到会话日志——goal 状态的唯一存储——因此 goal 状态绝不依赖临时消息投递。会话恢复或 fork 后，goal、其 phase、其 revision 与已准入 Round 数量都仍然存在。自动续行是例外：任何会话开始边界之后，`active` 的 goal 都会被停用续行——在有人显式 resume 之前，agent 不会自行继续。

#### 观察 goal

消费方用 `ctx.goals.get(agent)` 读取当前 goal，获得脱离内部状态的视图：目标、phase、已开始与上限 Round 数量、被阻塞时的 blocker reason，以及续行是否已启用。变更必须携带该视图中的精确 `{ id, revision }`，因此持有旧状态的消费方会收到清晰的陈旧 revision 错误，而不是静默覆盖更新的状态：

-----

### 已知限制与延期工作

这些限制说明 goal 服务何时不合适或需要特别注意。它们是当前包约束，不是任务积压。

- **只负责状态，不负责任务调度**——本包不决定已启用续行的 goal 何时继续，不重试异常失败，也不取消活跃轮次；这些策略属于 `dsh-goal-round-driver` 等消费方包。
- **只有 Round 数量预算**——`maxGoalRounds` 不计量 token、货币、挂钟时间或提供方配额。
- **没有独立评估器**——记录完成或阻塞的调用方拥有最终决定权；由评估器支持的认证暂缓到独立策略层。
- **只有一个当前 goal**——系统有意不支持并行目标或独立 goal 数据库；替换或清除后，历史仍可在会话日志中读取。
- **信任进程内生产方**——能直接访问 `Session` 的插件可以追加伪造的 `goal/change` 数据。严格回放会检测格式错误或不一致的记录，并使 goal 访问从该记录起失败，直到日志修复；这是完整性检测，不是插件隔离。

## Config（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    defaultMaxGoalRounds?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## GoalService（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`GoalService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class GoalService extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config?: Config);
    get(agent: Agent): GoalView | undefined;
    disarm(agent: Agent): GoalView | undefined;
    create(agent: Agent, request: CreateGoalRequest): GoalView;
    edit(agent: Agent, ref: GoalRef, request: EditGoalRequest): GoalView;
    pause(agent: Agent, ref: GoalRef): GoalView;
    resume(agent: Agent, ref: GoalRef): GoalView;
    complete(agent: Agent, ref: GoalRef): GoalView;
    block(agent: Agent, ref: GoalRef, reason: GoalBlockReason): GoalView;
    clear(agent: Agent, ref: GoalRef): GoalRef;
    remoteExportCreate(agent: Agent, request: CreateGoalRequest): CreateGoalResult;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## ResolvedConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedConfig {
    defaultMaxGoalRounds: number;
}
```

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`ResolvedConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`defaultMaxGoalRounds`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## applyGoalProjection（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`applyGoalProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function applyGoalProjection(state: GoalProjectionState, event: SessionEvent): GoalProjectionState;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

## goalProjectionDefinition（.）

公开导入：`@deepseek-ai/dsh-goal`；公开符号：`goalProjectionDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const goalProjectionDefinition: {
    key: "goal";
    stateSchema: zod.ZodType<GoalProjectionState, unknown, zod.core.$ZodTypeInternals<GoalProjectionState, unknown>>;
    init: () => GoalProjectionState;
    apply: typeof applyGoalProjection;
    wire: {
        viewSchema: zod.ZodType<GoalProjection | null, unknown, zod.core.$ZodTypeInternals<GoalProjection | null, unknown>>;
        view: (state: NoInfer<GoalProjectionState>) => GoalProjection | null;
    };
    stateVersion: number;
};
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-goal.md)。

### Goal 的持久状态与激活状态

goal 的修订与轮次是持久事实，自动运行是否 armed 是活状态。恢复和 Session start 会解除自动激活，不能因日志里仍为 active 就开始后台工作。mutation 必须引用精确 goal id 与 revision，冲突先重读再裁决。projection registry 是必须前置，卸载服务同时撤回 projection，不能继续读取旧服务实例的状态。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

相关对象：[types](api-capabilities-dsh-goal-types.md)。

相关对象：[domain](api-capabilities-dsh-goal-domain.md)。

相关对象：[runtime](api-capabilities-dsh-goal-runtime.md)。

相关对象：[fold](api-capabilities-dsh-goal-fold.md)。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    goals: GoalService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `goals` | `goals: GoalService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-goal.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'goal/activation-changed'(payload: GoalActivationChanged): void;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `goal/activation-changed` | `'goal/activation-changed'(payload: GoalActivationChanged): void` |
| `goal/changed` | `'goal/changed'(this: import('@deepseek-ai/dsh-scope').Scoped<Agent>, payload: { agent: Agent; change: GoalChanged }): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-goal.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
