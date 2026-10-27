# @deepseek-ai/dsh-webhook-github 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-webhook-github` 会在注入的 `ctx.webServer` 上注册一条精确 HTTP 路由。它限制并验证 GitHub 原始 JSON body，投影提供方无关的交付，调用 `ctx.webhookRuntime.dispatch()`，并在不等待规则或会话的情况下返回 `202`。部署需要为通用 webhook 运行时提供经过身份验证的 GitHub 入口时，请使用它。

### 配置

| Key | 含义 |
|---|---|
| `source` | 携带给规则的非空适配器实例，例如 `primary-github`。 |
| `path` | 不带尾随斜杠、查询或片段的精确非根路径。 |
| `secretEnv` | 包含 GitHub webhook 密钥的凭据引用。 |
| `maxBodyBytes` | 未改动请求 body 的正安全整数上限。 |

所有字段均为必填。每次请求都会重新解析密钥引用，因此轮换会在下一次交付生效，而无需重新加载插件。

### HTTP 约定

只接受 `POST application/json`。适配器读取有界 UTF-8 body，要求 `X-Hub-Signature-256`、`X-GitHub-Delivery` 与 `X-GitHub-Event`，解析密钥，在 JSON 解析前验证 HMAC，并要求顶层是无损 JSON 对象。它绝不记录密钥、签名或 payload。

| 状态 | 含义 |
|---|---|
| `202` | 已验证 JSON 已在内存中分发。 |
| `400` | 必需 header、UTF-8、JSON 或顶层对象无效。 |
| `401` | 签名无效。 |
| `405` | 方法不是 `POST`。 |
| `413` | 声明或流式 body 超过 `maxBodyBytes`。 |
| `415` | media type 不是 `application/json`。 |
| `503` | 凭据或 webhook 运行时不可用。 |

`202` 不表示任何规则已经匹配，也不表示已创建会话。GitHub 事件特定字段的验证属于各规则；适配器只保证通过身份验证的通用 JSON。

### 专用监听器组合

普通 Web profile 已经拥有 `ctx.webServer`。把另一个 `dsh-host-webserver` 和此适配器挂载到仅隔离 `webServer` 的 group 内；适配器仍会继承凭据与 `webhookRuntime`。GitHub 评审指南在 TLS 反向代理后使用 `127.0.0.1:3081/github`，而 UI 继续位于端口 3080。

示例的 overlay 与规则模块随本包发布，位于 `examples/github-review/`。先将本包及其 `dsh-webhook` peer 安装到 profile，再从该安装目录加载 overlay；指南给出完整命令。

### 已知限制与延期工作

- **无 TLS**：注入的开发 WebServer 通常只监听 loopback，并位于 TLS 反向代理或 tunnel 后。
- **仅通用 payload 验证**：规则负责验证自己消费的 GitHub 事件字段。
- **不向提供方确认下游工作**：`202` 先于任意规则调用与会话创建。
- **不支持表单编码**：GitHub 必须发送 `application/json`；`application/x-www-form-urlencoded` 会被拒绝。

## Config（.）

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    readonly source: string;
    readonly path: string;
    readonly secretEnv: string;
    readonly maxBodyBytes: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

## EmitterWebhookEvent（.）

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`EmitterWebhookEvent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export type EmitterWebhookEvent<TEmitterEvent extends EmitterWebhookEventName = EmitterWebhookEventName> = TEmitterEvent extends `${infer TWebhookEvent}.${infer TAction}` ? BaseWebhookEvent<Extract<TWebhookEvent, WebhookEventName>> & {
    payload: {
        action: TAction;
    };
} : BaseWebhookEvent<Extract<TEmitterEvent, WebhookEventName>>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

这是固定依赖 `@octokit/webhooks` 的类型透传；适配器先验证 GitHub 请求签名，再把事件交给通用运行时，不把类型声明当作来源认证。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `id` | `id: string;` | 来自 `BaseWebhookEvent` 的公开继承或联合分支 |
| `name` | `name: TName;` | 来自 `BaseWebhookEvent` 的公开继承或联合分支 |

## EmitterWebhookEventName（.）

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`EmitterWebhookEventName`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export type EmitterWebhookEventName = (typeof emitterEventNames)[number];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

这是固定依赖 `@octokit/webhooks` 的类型透传；适配器先验证 GitHub 请求签名，再把事件交给通用运行时，不把类型声明当作来源认证。

## GitHubJsonObject（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type GitHubJsonObject = {
    readonly [key: string]: JsonValue;
};
```

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`GitHubJsonObject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

## GitHubWebhookEvent（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface GitHubWebhookEvent {
    readonly name: string;
    readonly payload: GitHubJsonObject;
}
```

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`GitHubWebhookEvent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`payload`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-webhook-github`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "webhook-github";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-webhook-github.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
