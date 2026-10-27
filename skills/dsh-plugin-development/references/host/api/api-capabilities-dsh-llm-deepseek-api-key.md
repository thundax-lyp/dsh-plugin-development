# @deepseek-ai/dsh-llm-deepseek-api-key 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

为 `deepseek-official` 注册鉴权、模型发现和官方模型列表。通过 llm-deepseek 共用 Messages 请求实现；本包拥有凭据解析、目录可用性判断和模型准入。

鉴权解析将验证后的 API key 放入 `x-api-key`，供 Messages 和 Files 请求共同使用。

### 使用此包

`apiKeyEnv` 默认为 `DEEPSEEK_API_KEY`，在每次请求和模型发现时解析凭据。已组合 credentials 服务时，按其优先级解析；只有未组合该服务时才直接读取启动环境。请求时凭据缺失以 `MISSING_CREDENTIAL` 失败；格式错误以 `INVALID_CREDENTIAL` 失败。模型发现在凭据缺失时返回空目录，在模型选择器中隐藏该路由，但保留其设置入口。凭据格式错误和其他读取失败继续上报。添加或删除密钥会影响下一次模型发现。

```yaml
- id: llm-deepseek
  name: '@deepseek-ai/dsh-llm-deepseek-api-key'
  config:
    reasoningEffort: high
    apiKeyEnv: DEEPSEEK_API_KEY
```

端点和凭据引用来自同一次配置解析；进行中的请求保留该快照，后续配置更新仅影响后续请求。账号登录态不影响该路由使用的凭据。

`models` 是该 provider 独立的可配置目录；默认值和协议能力来自共享传输包。当 `models` 等于内置目录、且 Messages 的 origin 是官方 API `https://api.deepseek.com` 时，路由改为提供官方 `GET https://api.deepseek.com/models` 列表。列表请求用 `x-api-key` 携带 API key，带上 harness 的 `User-Agent`，并拒绝重定向；没有 API key 时不发任何请求。其他端点，包括由 `baseURL` 或 `$DEEPSEEK_BASE_URL` 指定的端点，提供 `models`，不请求列表。目录判断不探测推理端点。

第一次访问会等待列表，最长 `modelsTimeoutMs`。之后的访问直接使用已加载的列表，列表超过 `modelsMaxAgeMs` 后在后台刷新；路由空闲时不发请求。获取失败或得到空列表时保留上一份；还没有加载到任何列表时，路由提供当前版本内置的目录（`deepseek-flash` 与 `deepseek-v4-pro`）。列表请求返回 HTTP 401 只让这一次加载失败。每次加载成功、连续失败中的第一次失败及其退回的目录、以及每个因声明无法读取或不可用而被隐藏的列表条目，都会以 `[llm-deepseek-api-key]` 标签写到 stderr；stdout 保留给协议消息，且不记录任何密钥。

列出的模型按账号路由的规则提供、与本版本的内置条目合并，并在网络请求之前以 `CLIENT_UPGRADE_REQUIRED` 或 `MODEL_UNSUPPORTED` 拒绝；列表没有列出的模型 id 照常透传。

与内置目录不同的 `models` 列表会替换整个目录，并停止请求列表；模型页把编辑后的目录存在这里。删除这个列表（即模型页上的**恢复默认模型**）后，路由重新使用列表，即使缓存的列表尚未过期，下一次访问也会重新加载。与内置目录完全相同的列表视为未自定义。

| 字段 | 默认值 | 含义 |
|---|---|---|
| `modelsTimeoutMs` | `5,000` | 单次列表请求以及首次访问等待的上限 |
| `modelsMaxAgeMs` | `600,000` | 列表超过这个时长后，下一次访问时刷新；获取失败后同样在这个时长后重试 |

设置命名空间采用 Cordis entry id，没有 entry 时采用插件名。产品保留 official 的 `llm-deepseek` entry id，账号使用 `llm-deepseek-account`。

### 已知限制与后续工作

- 配置的目录是配置元数据，不验证远端是否接受模型；实际调用仍可能失败。
- 路由使用列表时，模型页显示的仍是内置目录，因此只有列表提供的模型只出现在模型选择器中。在模型页编辑目录会保存页面上显示的行，这类模型会消失，直到点**恢复默认模型**。
- 自定义的目录收不到列表之后新增的模型。
- 列表缓存只在内存中；没有网络的启动会一直提供内置目录，直到加载到列表。
- 进程运行期间的列表变化在 Web 模型选择器下一次刷新目录时生效；插件不主动通知。
- 当前版本不能用任何已列出的模型时，路由不提供模型。

## Config（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

公开声明（保留类型空间与值空间）：

```text
export interface Config extends ProtocolConfig, ModelListingConfig {
    apiKeyEnv: Volatile<string>;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    apiKeyEnv: z<string, string, "volatile-defined">;
    modelsTimeoutMs: z<number, number, "volatile-defined">;
    modelsMaxAgeMs: z<number, number, "volatile-defined">;
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, "volatile">;
}>>, Schemastery.ObjectT<NoInfer<{
    apiKeyEnv: z<string, string, "volatile-defined">;
    modelsTimeoutMs: z<number, number, "volatile-defined">;
    modelsMaxAgeMs: z<number, number, "volatile-defined">;
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, "volatile">;
}>>, "plain">;
```

同名导出同时提供类型与运行时值；使用 `import type` 引入配置类型，使用普通 `import` 引入运行时 schema，不能当作文本常量。

这里的 `ProtocolConfig` 是共享传输包的 [Config](api-capabilities-dsh-llm-deepseek-config.md#config)（账号配置通过 `Omit<ProtocolConfig, 'models'>` 排除共享目录）；列表基字段来自 [ModelListingConfig](api-capabilities-dsh-llm-deepseek-listing-config.md#modellistingconfig)。继承字段与本包新增字段共同组成配置，不能只填写本节成员表。

| 成员 | 公开类型 |
| --- | --- |
| `apiKeyEnv` | `apiKeyEnv: Volatile<string>;` |

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## Options（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type Options = ProtocolOptions & ModelListingOptions & {
    apiKeyEnv?: string;
};
```

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`Options`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## ResolvedDeepSeekOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ResolvedDeepSeekOptions extends DeepSeekConnectionOptions {
    apiKeyEnv: CredentialRef;
    listing?: ListingSettings;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`ResolvedDeepSeekOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`apiKeyEnv`、`listing`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "llm-deepseek-api-key";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## plainOptions（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`plainOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function plainOptions(config: Config): Options;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## resolveAdapterOptions（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek-api-key`；公开符号：`resolveAdapterOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function resolveAdapterOptions(config: Options, environment?: LaunchEnvironmentSnapshot): ResolvedDeepSeekOptions;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek-api-key.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
