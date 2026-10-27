# @deepseek-ai/dsh-user-approval 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用本包可要求敏感工具操作在继续前取得一次性决定。`ask` 策略将每个请求发送给部署中的人类或机器应答者；`never` 则直接拒绝，不发出提示。应答者缺失或失败时返回 `unavailable`，使操作以拒绝方式关闭；每项批准也只适用于对应请求。每个请求与结果都会记录在发起请求的会话审计日志中。模型会看到最终工具结果与当前策略，但不会看到人类权限 UI 或审计事件。

### 使用本包

当敏感工具操作应当暂停等待人或机器的决定、而非无条件执行时，组合此服务。工具流水线与沙箱 bash 工具会通过此 seam 路由 `ask` 决定，并在该 seam 缺失时以拒绝方式关闭，因此交互式部署至少应组合一个应答者。

#### 组合应答者

应答者是 `approval/request` waterfall（瀑布式事件）监听器：返回一个结果即为所负责的 agent（智能体）作答，否则调用 `next()` 委托。限定到 agent 的监听器只接收该 agent 的请求，且每项部署应组合一个最终应答者——同级监听器的顺序不是策略优先级机制。没有最终应答者时，请求解析为 `unavailable` 并以拒绝方式关闭；服务自身绝不会提示人类。

#### 设置策略

有效策略取会话中已设置的策略，并回退到配置的默认值。`ask`（默认）委托给已组合的应答者；`never` 在交互式分发之前确定性地拒绝每个请求——这是 CI 与无人值守运行采用的严格无头模式。

```yaml
- name: '@deepseek-ai/dsh-user-approval'
  config:
    policy: ask
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `policy` | `ask` | 没有 `approval/policy` 覆盖的会话的默认策略 |

#### 请求决定

`request(req)` 指名 agent、工具、原因、可选的调用 id，以及一个中止信号。可选的 `displayReason` 提供本地化展示文案，不改写日志中的原因。它要求当前处于尚未结束的轮次中：空闲或在轮次之间调用会在审计前抛出异常。中止会撤回问题——请求以 `cancelled` 结算，迟到的回答被丢弃。若任一审计事件在提交前失败，请求会被拒绝，而不会返回一项未记录的决定。

#### 模型与用户看到什么

模型只会看到发起请求的消费方最终给出的工具结果——允许、拒绝、取消或不可用——以及运行时上下文快照中的当前策略；审计事件与面向人类的权限 UI 不属于模型上下文。`never` 切换会以一条带来源的用户消息告知模型，两种策略都会把各自的完整当前含义贡献给快照。

-----

### 已知限制与延期工作

这些限制说明该 seam 不适用的场景，以及组合时需要特别注意的场景。它们是当前包约束，不是通用权限对比。

- **请求只在尚未结束的轮次内有效**：在空闲时或轮次之间发起调用，会在审计前抛出异常；持久化的轮次外审批工作流仍属延期工作。
- **仅存在一次性授权**：结果词汇包含 `allowed-once`，但不含 `allow-always`、已记住的规则、撤销或授权存储；会话策略只有 `ask`／`never`。
- **请求不携带工具参数**：应答者会看到工具名称、原因和可选调用 id；ACP（Agent Client Protocol）机器通道要求调用 id，并会委托不含 id 的请求。
- **没有内置应答者**：无头或组合不完整的部署会返回 `unavailable` 并以拒绝方式关闭；服务自身绝不会提示人类。

## APPROVAL_POLICIES（.）

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`APPROVAL_POLICIES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const APPROVAL_POLICIES: readonly ApprovalPolicy[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## ApprovalOutcome（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ApprovalOutcome = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable';
```

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`ApprovalOutcome`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## ApprovalPolicy（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ApprovalPolicy = 'ask' | 'never';
```

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`ApprovalPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## ApprovalRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ApprovalRequest extends ApprovalRequestEvent {
    readonly agent: Agent;
    readonly toolName: string;
    readonly callId?: ToolCallId;
    readonly reason?: string;
    readonly signal?: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`ApprovalRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agent`、`callId`、`reason`、`signal`、`toolName`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## ApprovalRequestId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function ApprovalRequestId(id: string): ApprovalRequestId;

export type ApprovalRequestId = Branded<'ApprovalRequestId'>;
```

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`ApprovalRequestId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## ApprovalService（.）

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`ApprovalService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class ApprovalService extends Service {
    config: Config;
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    setPolicy(agent: Agent, policy: ApprovalPolicy): void;
    request(req: ApprovalRequest): Promise<ApprovalOutcome>;
    overrideOf(session: Session): ApprovalPolicy | undefined;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    readonly policy?: ApprovalPolicy;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## setApprovalPolicy（.）

公开导入：`@deepseek-ai/dsh-user-approval`；公开符号：`setApprovalPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function setApprovalPolicy(session: Session, policy: ApprovalPolicy): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

## ApprovalRequestEvent（./types）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ApprovalRequestEvent {
    readonly agent: Agent;
    readonly toolName: string;
    readonly callId?: ToolCallId;
    readonly reason?: string;
    readonly displayReason?: {
        readonly en: string;
        readonly [locale: string]: string;
    };
    readonly signal?: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-user-approval/types`；公开符号：`ApprovalRequestEvent`。 此子路径提供共享声明或纯函数；数据类型本身不自动注册服务。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agent`、`callId`、`displayReason`、`reason`、`signal`、`toolName`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)。

### 一次审批的失败关闭边界

请求必须在活动 turn 内，审计写入 asked/decided 成对事件。`ask` 策略分派给应答者，`never` 直接拒绝；没有应答者或应答失败产生 unavailable，调用方不得将其视为允许。审批仅对应当前请求，不能缓存成未来动作授权。审计 append 失败向调用方传播，不把未记账动作当作已批准。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    approval: ApprovalService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `approval` | `approval: ApprovalService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'approval/request'(this: Scoped<Agent>, req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>): Promise<ApprovalOutcome>;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `approval/request` | `'approval/request'( this: Scoped<Agent>, req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>, ): Promise<ApprovalOutcome>` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-user-approval.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
