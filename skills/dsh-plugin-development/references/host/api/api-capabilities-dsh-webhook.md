# @deepseek-ai/dsh-webhook 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-webhook` 提供 Host 侧的 `ctx.webhookRuntime`：它既是受信任程序化 webhook 规则的注册表，也拥有唯一内置动作——在 Web Workspace 中创建普通根会话。接口只包含 `register(rule)` 和 `dispatch(delivery)`；提供方身份验证属于适配器包。当受信任规则必须把外部事件变成新的 agent（智能体）会话时，请使用它。

### 规则接口

`WebhookRule<K>` 具有带 brand 类型的唯一 `id`、提供方 `kind` 与 `run(delivery, signal)`。回调可以执行任意受信任代码，并返回 `null` 或一个 `WebhookSessionRequest`。同类规则彼此独立启动；某个回调抛出异常或其返回的 Promise 被拒绝时，只会记录日志，不会阻止同级规则。

`VerifiedWebhookDelivery` 携带提供方种类、已配置来源 id、提供方交付 id、规范化的无损 JSON 与接收时间。运行时会在共享前快照并冻结完整值。`deliveryId` 仅是来源信息；重复交付会再次运行规则。

注册是一项 effect。它的可等待 disposer 会先隐藏规则，再中止并排空活动回调。回调必须观察所提供的 signal；忽略取消的同进程代码无法被安全强制停止。

### 会话请求

`WebhookSessionRequest` 要求 `workspacePath`、`title`、`prompt`、`agentPreset` 与 `permissionPreset`；可选 `model` 会指定明确的提供方／模型路由与输出 token 上限。明确路由使用其适配器的默认推理（reasoning）强度。省略时会快照包含推理强度的完整当前部署选择，直到首个请求记录持久 header；之后的 Web 模型变更保留普通会话行为。

运行时会在变更状态前验证 preset，解析或创建规范 Workspace，以该 Workspace 路径作为 `SessionHeader.cwd` 创建 Agent，在发布前挂载 agent preset，并在应用权限、标题与提示词前附加会话。附加失败会对尚未发布的动作执行 dispose（资源释放）。之后若在提示词前失败，则以尽力而为方式脱离 Workspace 并对 Agent 执行 dispose。

成功的 `Agent.followup()` 是 webhook 操作的提交点。消息使用 `source.kind: "webhook"`，并携带提供方、来源、交付与规则来源信息。运行时不等待 idle、不执行特殊 flush、不检查回复，也不发布完成状态；之后完全由普通 Agent 与会话行为接管。

### 组合

在 Web Host plane 上，于 Agents、模型默认值、agent presets、permission presets、标题与 Workspace 注册表之后加载运行时。用户编写的规则插件注入 `webhookRuntime`，并通过自己的 effect 交出 `register()` 返回的 disposer。

GitHub 评审指南展示了规则模块、专用入口端口、密钥设置与 Workspace 路由。

### 已知限制与延期工作

- **仅限进程内 fire-and-forget** — 崩溃会丢失尚未接纳提示词的规则调用；不存在队列、回放或重试。
- **无内置去重** — 提供方重复交付可能创建重复会话；需要幂等性的规则自行负责。
- **无完成结果** — HTTP 接受与规则结算都不报告 Agent 成功、idle 或输出。
- **受信任回调必须配合取消** — 运行时 teardown 会中止并等待回调，但无法终止任意同进程代码。
- **Workspace 创建可能比失败的会话尝试更长寿** — 空 Workspace 会保留，因为另一个并发调用者可能已经使用它。

## VerifiedWebhookDelivery（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VerifiedWebhookDelivery<K extends string = string> {
    readonly kind: K;
    readonly source: WebhookSourceId;
    readonly deliveryId: WebhookDeliveryId;
    readonly event: WebhookEventOf<K>;
    readonly receivedAt: number;
}
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`VerifiedWebhookDelivery`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`deliveryId`、`event`、`kind`、`receivedAt`、`source`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookDeliveryId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function WebhookDeliveryId(value: string): WebhookDeliveryId;

export type WebhookDeliveryId = Branded<'WebhookDeliveryId'>;
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookDeliveryId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookEventMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

声明来源包 `@deepseek-ai/dsh-webhook`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface WebhookEventMap {
}
```

声明来源包 `@deepseek-ai/dsh-webhook-github`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface WebhookEventMap {
    github: GitHubWebhookEvent;
}
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookEventMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookEventOf（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type WebhookEventOf<K extends string> = K extends keyof WebhookEventMap ? WebhookEventMap[K] : JsonValue;
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookEventOf`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookModelSelection（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WebhookModelSelection {
    readonly provider: string;
    readonly model: string;
    readonly maxTokens?: number;
}
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookModelSelection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`maxTokens`、`model`、`provider`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookRule（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WebhookRule<K extends string = string> {
    readonly id: WebhookRuleId;
    readonly kind: K;
    run(delivery: Readonly<VerifiedWebhookDelivery<K>>, signal: AbortSignal): WebhookSessionRequest | null | Promise<WebhookSessionRequest | null>;
}
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookRule`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`id`、`kind`、`run`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookRuleId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function WebhookRuleId(value: string): WebhookRuleId;

export type WebhookRuleId = Branded<'WebhookRuleId'>;
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookRuleId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookRuntime（.）

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class WebhookRuntime extends Service {
    static inject: string[];
    constructor(ctx: Context);
    register<K extends string>(rule: WebhookRule<K>): () => Promise<void>;
    dispatch<K extends string>(delivery: VerifiedWebhookDelivery<K>): void;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookSessionRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface WebhookSessionRequest {
    readonly workspacePath: string;
    readonly title: string;
    readonly prompt: string;
    readonly agentPreset: string;
    readonly permissionPreset: string;
    readonly model?: WebhookModelSelection;
}
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookSessionRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`agentPreset`、`model`、`permissionPreset`、`prompt`、`title`、`workspacePath`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## WebhookSourceId（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export declare function WebhookSourceId(value: string): WebhookSourceId;

export type WebhookSourceId = Branded<'WebhookSourceId'>;
```

公开导入：`@deepseek-ai/dsh-webhook`；公开符号：`WebhookSourceId`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    webhookRuntime: WebhookRuntime;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `webhookRuntime` | `webhookRuntime: WebhookRuntime` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-webhook.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
