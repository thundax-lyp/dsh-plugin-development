# @deepseek-ai/dsh-experimental-agent-team 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-experimental-agent-team` 为一个会话提供 Lead、具名 teammate、直接消息和持久共享任务板。发送使用目标 agent（智能体）的 inbox，并可冷恢复已存储的 teammate。Team 保留 roster 与任务状态，消息持久化遵循目标 Agent 的常规策略。挂载 `dsh-experimental-tool-agent-team` 可提供模型工具。本包为实验性功能，需要持久会话存储。

### 使用本包

当一个 agent 需要共享工作目录中的具名助手、直接 peer 消息以及持久 roster 与任务状态时，加入本包。与 `@deepseek-ai/dsh-experimental-tool-agent-team` 一起挂载可提供模型工具。

#### 何时选择

适用于在同一共享工作区协作并保留持久 roster 和任务状态。不支持独立工作目录、跨进程协调和自动释放任务 owner。需要持久会话存储。

#### 最小工作配置

对现有组合的最小增量是持久会话存储加两个 Team 包：

```yaml
- name: '@deepseek-ai/dsh-session-persistence-jsonl'
- name: '@deepseek-ai/dsh-experimental-agent-team'
- name: '@deepseek-ai/dsh-experimental-tool-agent-team'
```

工具安装后，模型会按请求完成其余工作——例如先「创建一个名为 reviewer 的 teammate 检查 diff」，再「把变更摘要发给 reviewer」。所有限制都是可选的，并在启动时校验：

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxMembers` | `16` | 一支团队最多可创建的 teammate 数，包括失败的 |
| `maxTasks` | `256` | 任务板上最多的活动任务数 |
| `maxMessageBytes` | `65,536` | 单条发送消息的最大尺寸 |
| `disposalTimeoutMs` | `5,000` | 关闭清理允许的时间 |

#### Teammate

请 Lead 创建 teammate：给它一个唯一的小写名字（例如 `reviewer`）并描述其职责。teammate 可以 fresh 启动（不携带 Lead 对话的任何记忆），也可以作为 fork 启动（继承 Lead 已完成的轮次）；创建请求决定用哪种。teammate 名字是永久的——即使创建失败的 teammate 也保留其名字，任何名字都不会被复用。

roster 显示每个成员的职责（`lead` 或 `teammate`）与当前状态：`running`、`inactive`（当前没有执行轮次，包括已加载和仅存储的成员）、`provisioning` 或 `failed`。未加载的成员会在唤醒后收到其消息。

只有 Lead 可以创建 teammate 或中断它们。

#### teammate 之间的消息

任何成员都可向其他成员或 Lead 发送消息。每次尝试要么返回目标 inbox 的 `MessageId`，要么抛出错误。Team 不保留尚未接收的发送意图，不在重启后重试新消息，也不对显式重发去重。

Steer 让 running target 在最近的步骤边界接收消息，并启动或冷恢复 inactive target。成功表示 inbox 接收，不表示模型已处理或已完成单独的同步存储 flush。获准消息遵循普通 Agent 的持久化和 inbox 恢复策略。

#### 共享任务板

任何成员都可以添加任务，包含标题、详情、对其他任务的可选依赖，以及可选的文件触及提示。只有其全部依赖完成后，任务才可 claim。

任务有 owner：成员 claim 任务开始工作，完成后标记完成、释放回板或重新打开；Lead 可以把任务分配给任意成员。每次变更都是 compare-and-set：基于过期副本的更新会被拒绝，因此两个成员不会悄悄覆盖彼此的成果。

#### 等待与中断

成员可以等待下一次团队变化——teammate 的状态、新消息或任务更新——而不必反复轮询；等待只报告是否超时，调用方随后重新读取当前状态。

Lead 可以停止 teammate 的当前轮次，而不会删除其排队的消息；任务归属不变。

#### 成功与失败的表现

成功会返回 teammate roster 行、获准 inbox 消息 id 或更新后的任务 revision。无效成员名称、未就绪任务、过期 revision、上限耗尽和消息准入失败均报告错误。

-----

### 已知限制与延期工作

这些限制说明一支团队目前不能做什么、或哪些方面需要特别的运维关注。它们是当前包约束，不是与其他协作机制的对比。

- **完整视图广播** — 每次 roster 或任务变化都会把完整 roster 和未删除任务板（含描述）发给所有已连接浏览器，即使它正在查看其他 Session。
- **实验原型，无稳定性承诺**——本包公开发布，但孵化期间约定仍可自由变更。
- **单进程、共享 checkout**——成员共享 cwd，修改立即可见；本包不提供 worktree、远端成员、merge 或文件锁。
- **write scope 仅作提示**——Bash、formatter、代码生成器与直接外部写入可以绕过文件版本检查；Lead 必须协调 owner 并检查最终 diff。
- **扁平且不可变的 roster**——只有 Lead 可以创建直接 teammate；不支持嵌套 Team、重命名、删除或名字复用。
- **不会自动释放 owner**——成员不活动、interrupt、进程退出与工作失败都不会释放任务 owner。
- **无发送重试保证**——Team 不保留新尝试，也不对其去重；不支持多个进程同时操作一个 Team。从未到达目标的历史排队消息不会被投递。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    readonly maxMembers?: number;
    readonly maxTasks?: number;
    readonly maxMessageBytes?: number;
    readonly disposalTimeoutMs?: number;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## CreateTeamTaskRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CreateTeamTaskRequest {
    readonly subject: string;
    readonly description: string;
    readonly blockedBy?: readonly TeamTaskId[];
    readonly writeScopes?: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`CreateTeamTaskRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`blockedBy`、`description`、`subject`、`writeScopes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## SendTeamMessageRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SendTeamMessageRequest {
    readonly target: string;
    readonly content: ContentBlock[];
    readonly signal: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`SendTeamMessageRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`signal`、`target`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## SendTeamMessageResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SendTeamMessageResult {
    readonly messageId: MessageId;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`SendTeamMessageResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`messageId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## SpawnTeammateRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpawnTeammateRequest {
    readonly name: string;
    readonly description: string;
    readonly prompt: ContentBlock[];
    readonly context: 'fresh' | 'fork';
    readonly provider: string;
    readonly signal: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`SpawnTeammateRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`context`、`description`、`name`、`prompt`、`provider`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## SpawnTeammateResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SpawnTeammateResult {
    readonly member: TeamMemberView;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`SpawnTeammateResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`member`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamError（.）

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class TeamError extends HarnessError {
    constructor(message: string, code: string, options?: ErrorOptions);
}
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function TeamId(id: SessionId | string): TeamId;

export type TeamId = Branded<'TeamId'>;
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMemberPhase（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TeamMemberPhase = 'provisioning' | 'active' | 'failed';
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMemberPhase`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMemberProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamMemberProjection {
    readonly id: SessionId;
    readonly name: string;
    readonly role: 'lead' | 'teammate';
    readonly phase: TeamMemberPhase;
    readonly error?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMemberProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`error`、`id`、`name`、`phase`、`role`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMemberSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamMemberSnapshot {
    readonly id: SessionId;
    readonly name: string;
    readonly description: string;
    readonly provider: string;
    readonly context: 'fresh' | 'fork';
    readonly phase: TeamMemberPhase;
    readonly error?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMemberSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`context`、`description`、`error`、`id`、`name`、`phase`、`provider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMemberView（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamMemberView {
    readonly id: SessionId;
    readonly name: string;
    readonly role: 'lead' | 'teammate';
    readonly status: 'running' | 'inactive' | 'provisioning' | 'failed';
    readonly description?: string;
    readonly provider?: string;
    readonly context?: 'fresh' | 'fork';
    readonly model?: string;
    readonly diagnostics: string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMemberView`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`context`、`description`、`diagnostics`、`id`、`model`、`name`、`provider`、`role`、`status`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMembership（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamMembership {
    readonly root: Agent;
    readonly id: TeamId;
    readonly role: 'lead' | 'teammate';
    readonly name: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMembership`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`name`、`role`、`root`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMessageId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function TeamMessageId(id: string): TeamMessageId;

export type TeamMessageId = Branded<'TeamMessageId'>;
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMessageId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMessageSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamMessageSnapshot {
    readonly id: TeamMessageId;
    readonly senderId: SessionId;
    readonly senderName: string;
    readonly targetId: SessionId;
    readonly content: ContentBlock[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMessageSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`content`、`id`、`senderId`、`senderName`、`targetId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamMessageSource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamMessageSource {
    readonly kind: 'team-message';
    readonly teamId: TeamId;
    readonly messageId: TeamMessageId;
    readonly senderId: SessionId;
    readonly senderName: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamMessageSource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`messageId`、`senderId`、`senderName`、`teamId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamProjection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamProjection {
    readonly members: TeamMemberProjection[];
    readonly tasks: TeamTaskView[];
    readonly failure?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`failure`、`members`、`tasks`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamService（.）

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class TeamService extends Service {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config?: Config);
    membership(agent: Agent): TeamMembership;
    listMembers(agent: Agent): TeamMemberView[];
    spawnTeammate(caller: Agent, request: SpawnTeammateRequest): Promise<SpawnTeammateResult>;
    sendMessage(caller: Agent, request: SendTeamMessageRequest): Promise<SendTeamMessageResult>;
    createTask(caller: Agent, request: CreateTeamTaskRequest): Promise<TeamTaskView>;
    getTask(caller: Agent, id: TeamTaskId): TeamTaskView;
    listTasks(caller: Agent): TeamTaskView[];
    updateTask(caller: Agent, request: UpdateTeamTaskRequest): Promise<TeamTaskView>;
    waitForChange(caller: Agent, timeoutMs: number, signal: AbortSignal): Promise<TeamWaitResult>;
    interrupt(caller: Agent, targetName: string): {
        previousStatus: 'running' | 'inactive';
    };
    tryMembership(agent: Agent): TeamMembership | undefined;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamTaskAction（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TeamTaskAction = 'claim' | 'release' | 'edit' | 'set_dependencies' | 'complete' | 'reopen' | 'reassign' | 'delete';
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamTaskAction`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamTaskId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function TeamTaskId(id: string): TeamTaskId;

export type TeamTaskId = Branded<'TeamTaskId'>;
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamTaskId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamTaskSnapshot（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamTaskSnapshot {
    readonly id: TeamTaskId;
    readonly revision: number;
    readonly subject: string;
    readonly description: string;
    readonly status: TeamTaskStatus;
    readonly ownerId?: SessionId;
    readonly blockedBy: TeamTaskId[];
    readonly writeScopes: string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamTaskSnapshot`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`blockedBy`、`description`、`id`、`ownerId`、`revision`、`status`、`subject`、`writeScopes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamTaskStatus（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type TeamTaskStatus = 'pending' | 'in_progress' | 'completed' | 'deleted';
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamTaskStatus`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamTaskView（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamTaskView {
    readonly id: TeamTaskId;
    readonly revision: number;
    readonly subject: string;
    readonly description: string;
    readonly status: TeamTaskStatus;
    readonly blockedBy: TeamTaskId[];
    readonly writeScopes: string[];
    readonly ownerName?: string;
    readonly ready: boolean;
    readonly writeScopeWarnings: string[];
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamTaskView`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`blockedBy`、`description`、`id`、`ownerName`、`ready`、`revision`、`status`、`subject`、`writeScopeWarnings`、`writeScopes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## TeamWaitResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TeamWaitResult {
    readonly timedOut: boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`TeamWaitResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`timedOut`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## UpdateTeamTaskRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UpdateTeamTaskRequest {
    readonly taskId: TeamTaskId;
    readonly expectedRevision: number;
    readonly action: TeamTaskAction;
    readonly subject?: string;
    readonly description?: string;
    readonly blockedBy?: readonly TeamTaskId[];
    readonly writeScopes?: readonly string[];
    readonly owner?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-agent-team`；公开符号：`UpdateTeamTaskRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`action`、`blockedBy`、`description`、`expectedRevision`、`owner`、`subject`、`taskId`、`writeScopes`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    agentTeams: TeamService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `agentTeams` | `agentTeams: TeamService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-agent-team.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
