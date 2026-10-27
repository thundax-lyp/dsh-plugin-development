# @deepseek-ai/dsh-llm 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用 `@deepseek-ai/dsh-llm` 可通过已配置的提供方适配器流式调用模型、发现模型，并解析模型能力与调用默认值。调用方必须确保所有模型可见输入都可以从会话日志重建。Loop 构建的请求以深度冻结状态到达，因此扩展与适配器不能改写。每个流只尝试调用提供方一次：提供方特定的转换由对应适配器完成，可选包 `@deepseek-ai/dsh-llm-retry` 负责重跑失败的请求。流始终以终止结果结束，因此调用方可以一致地处理成功、失败与取消。

### 使用本包

`listModels` 描述目录驱动界面提供的模型。核心解析与流式调用仍可接受未列出的 ID。GUI 的模型选择与提交要求模型出现在目录中；供 GUI 使用的适配器必须实现 `listModels`，公布其可用模型。基类实现返回空列表，因此不向 GUI 提供模型。

任何调用模型提供方的组合——agent loop（智能体循环）、会话标题生成器、压缩（compaction）摘要器——都会通过本服务流式发起请求。与至少一个提供方适配器一起挂载它；服务本身没有任何配置，也不包含提供方协议代码。

#### 何时选择

当插件或组合需要调用模型时选择本包：它是进入提供方适配器的唯一受支持路径，并在 loop、会话日志与每个消费方之间保持同一套词汇。当需要提供方特定的协议行为（那属于 `dsh-llm-deepseek` 或 `dsh-llm-pi-ai` 之类的适配器）或重试执行（那属于 `dsh-llm-retry`）时，不要选择它。

#### 最小组合

挂载服务与至少一个适配器，然后在每个请求中按名称选择提供方：

```yaml
- name: '@deepseek-ai/dsh-llm'
- name: '@deepseek-ai/dsh-llm-deepseek-api-key'
  config:
    apiKeyEnv: DEEPSEEK_API_KEY
```

流会返回 token 级分片，并始终以一个终止 `finish` 分片结束。`BlockAssembler` 把分片组装为内容块与消息；`AssistantStreamAccumulator` 在紧凑表示中保留其精确时间戳与 token 边界，loop 再把它嵌入一个持久 attempt settlement：

挂载成功后，`ctx.llm.listProviders()` 会按注册顺序报告已注册路由。

`GenerateOptions.messages` 接受持久 `Message` 值和仅供请求使用的 `RequestUserInput` 值。仅供请求使用的输入包含 user-role 内容，不含 `id` 或 `source`；Session 写入和 Agent 投递仍然要求持久消息。调用方必须在流结束前保持辅助输入不变。会记录完整请求的调用方（例如会话标题生成）必须使用持久消息。

`prepareCall(config, signal, configure?)` 接受具体的 `LlmCallConfig` 值。可选的同步纯函数 `ConfigureCall` 接收已分离且深度冻结的 `LlmCallControls`，以及捕获的适配器代次所提供的模型元数据。调用方可组合普通函数来选择具体控制项；后执行的写入替换先前的值。准备操作保留捕获的路由，为省略的控制项应用默认值，校验结果，再返回用于记录与分发的冻结配置。回调失败或取消会在分发前拒绝。准备操作要求注册适配器。

配置函数在适配器默认值物化之前选择控制项。例如，将最低强度选择与显式输出上限组合，再将 `configure(maxTokens)` 作为第三个参数传入：

#### 你可以做什么

- **流式发起一次模型调用**——`ctx.llm.stream(options)` 为任何已注册提供方与模型产出原始分片（token 级增量）；消费方用 `BlockAssembler` 组装。
- **注册提供方适配器**——一个适配器拥有一个或多个提供方路由，其注册会捕获该路由的重试策略；重复注册同一路由会以 `DUPLICATE_ADAPTER` 失败。
- **通过配置暴露并激活提供方**——适配器声明可配置提供方路由与 settings namespace，配置界面因此可以激活休眠提供方并编辑连接信息，无需重启。`LlmConfigurableProvider.error` 报告供修复的配置诊断；未受影响的模型仍可提供服务。条目还可携带 `defaultBaseURL`，即配置未设置端点时适配器使用的端点；以及 `nativeAuth`，即配置未指定凭据引用时适配器认证读取的环境变量与 OAuth 登录；`baseURLEnv` 列出配置端点所用的环境变量。配置界面直接从目录读取这些字段，无需调用适配器。
- **发现与解析模型**——列出适配器公布的模型、询问端点它提供哪些模型（候选携带可选的 `inputModalities`；缺省表示未知），并解析某个精确模型的上下文窗口、输出默认值、推理（reasoning）强度、输入模态与系统提示词更新模式：当模型把任意位置最新的 `system` 消息读作有效系统提示词时，`LlmResolvedModelInfo.systemPromptUpdate` 为 `'in-history'`；只读取开头 system 消息时该字段缺失；`normalizeModelInfo` 以 `INVALID_MODEL_INFO` 拒绝任何其他值。
- **校验调用配置**——显式或配置的推理强度会在任何提供方 I/O 之前对照精确模型校验；请求省略输出上限时，会填入适配器配置的输出上限。
- **不展开即读取内嵌 Assistant 流**——`assistantStreamFirstTokenTime`（首 token）、`assistantStreamHasVisibleContent`（任一可见内容）与 `assistantStreamHasVisibleText`（任一可见文本）通过可提前退出的扫描直接从紧凑记录得出结果；`lastAssistantStreamChunk` 反向扫描到某一类型的最后一个原始 chunk，`assistantStreamChunks` 与 `joinAssistantStreamText` 扫描整个流，`assembleAssistantStream` 向 `BlockAssembler` 每个 run 喂一段拼接 delta，blocks／usage／replayState 与逐成员展开相同。`runFirstTokenTime` 与 `runFirstVisibleTime` 对单个打包 run 做提前退出扫描，`isTokenDelta`、`isVisibleChunk` 与 `chunkHasVisibleText` 定义单个 chunk 的 token 与可见性规则。`expandAssistantStream` 仍是持久边界读取记录的校验路径；它不被记忆化，因为保留的展开在事件生命周期内约花费紧凑流的十倍内存。

#### 失败与恢复

每个流都恰好以一个终止 `finish` 分片结束：失败为 `{ kind: 'error', failure }`，取消为 `{ kind: 'aborted', failure }`。失败携带稳定 code，如 `NO_ADAPTER`、`MISSING_CREDENTIAL`、`AUTH`、`RATE_LIMIT` 与 `CONTEXT_WINDOW_EXCEEDED`；消费方依据 code 路由，绝不解析消息文本。`QUOTA` 表示提供方中立的额度耗尽，`ACCOUNT_QUOTA` 专用于当前产品能够充值的第一方账号余额不足。点名未注册提供方的请求会以 `NO_ADAPTER` 失败，格式错误的凭据会以 `INVALID_CREDENTIAL` 失败，而不是表现为不透明的 fetch 错误。本服务从不自行重跑请求：重试是 `dsh-llm-retry` 在 agent 失败步骤扩展点上的职责。

-----

### 已知限制与延期工作

这些限制说明本服务在哪里停止、由其他包或未来工作接续。它们是当前包约束，不是任务积压。

- **本服务不提供重试执行、缓存或速率限制**——提供方注册会存储重试策略，但一次流仍是一次提供方尝试；`@deepseek-ai/dsh-llm-retry` 在持久 agent 步骤边界上执行该策略。
- **`BlockAssembler` 只处理核心块类型**——插件添加块类型的流若从未由 `block-end` 关闭，`blocks()` 会抛出异常。
- **`GenerateOptions.sessionId` 是本地声明的品牌类型**——导入 dsh-session 的 `SessionId` 会产生依赖循环。
- **工具更新需要会话历史** — `GenerateOptions.tools` 包含当前有效定义。`toolHistory` 提供 `Session.toolHistory()` 派生的初始声明及已解析历史定义的添加记录。适配器分发时，`projectToolUpdates` 构造延迟声明，并在 `in-history` 模式保留已移除定义；`addition-only` 省略已移除定义和移除消息。不支持更新的路由接收有效工具，不携带 developer 消息或 `deferLoading`。缺少历史或请求前缀遗漏已记录更新时，回退为当前声明且不发送 developer 消息。 显式延迟加载的初始工具在首个保留的添加块出现前保持延迟状态；声明延迟加载工具不会使其激活。

## AdapterRegistrationHandle（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AdapterRegistrationHandle {
    (): void;
    replace(providers: string[]): void;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`AdapterRegistrationHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`replace`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## DirectoryRegistrationHandle（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DirectoryRegistrationHandle {
    (): void;
    replace(entries: readonly LlmConfigurableProvider[]): void;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`DirectoryRegistrationHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`replace`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmAdapter（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmAdapter`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare abstract class LlmAdapter {
    providerInfo(provider: string): LlmProviderInfo;
    providerRetryPolicy(_provider: string): ResolvedRetryPolicy | undefined;
    imageRequestPricing(_provider: string, _model: string): LlmImageRequestPricing | undefined;
    imageRequestTarget(_provider: string, _model: string, image: ImageAttachmentRef): ImageRequestTarget;
    listModels(_provider: string): Promise<readonly LlmModelInfo[]>;
    resolveModel(provider: string, model: string, _signal?: AbortSignal): Promise<LlmResolvedModelInfo>;
    prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall>;
    abstract stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmError（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class LlmError extends HarnessError {
    readonly failure: LlmFailure;
    constructor(message: string, code: string, options?: LlmErrorOptions);
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmErrorOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface LlmErrorOptions extends ErrorOptions {
    status?: number;
    providerRetryAfterMs?: number;
    requestId?: ProviderRequestId;
    offloadImages?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmErrorOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`offloadImages`、`providerRetryAfterMs`、`requestId`、`status`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## LlmRuntime（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`LlmRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class LlmRuntime extends TypertRemoteService {
    constructor(ctx: Context);
    registerAdapter(providers: string[], adapter: LlmAdapter): AdapterRegistrationHandle;
    listProviders(): LlmProviderInfo[];
    registerConfigurableProviders(entries: readonly LlmConfigurableProvider[]): DirectoryRegistrationHandle;
    listConfigurableProviders(): LlmConfigurableProvider[];
    registerModelDiscovery(settingsNs: string, discover: (request: LlmModelDiscoveryRequest, signal?: AbortSignal) => Promise<readonly LlmDiscoveredModel[]>): () => void;
    discoverModels(settingsNs: string, request: LlmModelDiscoveryRequest, signal?: AbortSignal): Promise<LlmDiscoveredModel[]>;
    remoteDiscoverModels(settingsNs: string, request: LlmModelDiscoveryRequest, signal: AbortSignal): Promise<LlmDiscoveredModel[]>;
    providerRetryPolicy(provider: string): ResolvedRetryPolicy;
    imageRequestPricing(provider: string, model: string): LlmImageRequestPricing | undefined;
    imageRequestTarget(provider: string, model: string, image: ImageAttachmentRef): ImageRequestTarget;
    fileRequestText(ref: FileAttachmentRef): string;
    listModels(provider: string): Promise<LlmModelInfo[]>;
    resolveModelInfo(provider: string, model: string, signal?: AbortSignal): Promise<LlmResolvedModelInfo>;
    resolveCallConfig(config: LlmCallConfig, signal?: AbortSignal): Promise<LlmCallConfig>;
    prepareCall(config: LlmCallConfig, signal?: AbortSignal, configure?: ConfigureCall): Promise<PreparedLlmCall>;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## PreparedAdapterCall（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PreparedAdapterCall {
    readonly model: LlmResolvedModelInfo;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`PreparedAdapterCall`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`model`、`stream`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## PreparedLlmCall（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PreparedLlmCall {
    readonly config: LlmCallConfig;
    readonly retryPolicy: ResolvedRetryPolicy;
    readonly context?: LlmModelContext;
    readonly inputModalities?: readonly ModelModality[];
    readonly systemPromptUpdate?: SystemPromptUpdate;
    readonly toolUpdate?: ToolUpdate;
    readonly adapterDefaults: LlmCallConfigAdapterDefaults;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
```

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`PreparedLlmCall`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`adapterDefaults`、`config`、`context`、`inputModalities`、`retryPolicy`、`stream`、`systemPromptUpdate`、`toolUpdate`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

## assertUsableApiKey（.）

公开导入：`@deepseek-ai/dsh-llm`；公开符号：`assertUsableApiKey`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function assertUsableApiKey(raw: string, pkg: string, ref: string): string;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm.md)。

### 模型调用与适配器的关键约束

`LlmAdapter.stream(options)` 是唯一必须实现的方法。它接收完整 `GenerateOptions`，返回 `AsyncIterable<StreamChunk>`。循环产生的请求经过深冻结，`llm/stream` waterfall 只能读取而不能改写模型可见输入；自行构造请求的调用方也必须在流结束前保持输入不变。模型可见信息应能由 Session 重建。

`registerAdapter(providers, adapter)` 首次必须提供非空路由。候选路由整体验证，冲突抛出 `DUPLICATE_ADAPTER`，不留下半套注册。返回的可调用 handle 释放全部当前路由；`replace(providers)` 同步原子替换，允许空数组，已释放后抛 `REGISTRATION_DISPOSED`。provider 目录与 adapter 路由是两份不同注册，`registerConfigurableProviders` 不会自动实现 wire 调用。

`prepareCall(config, signal, configure)` 将精确模型能力、默认配置、重试策略和 adapter generation 绑定。纯同步 `configure` 接收冻结副本，失败或取消在 dispatch 前拒绝。返回对象的 `stream` 只能调用一次，调用的配置字段必须匹配其 `config`，否则为 `INVALID_PREPARED_CALL`。不要先读取一代模型能力，再用新一代 endpoint 发起调用。

流中按首次出现分配 block index，同一 block 的 delta 和 end 保持 index。工具 arguments 始终是原始 JSON 字符串；`usage` 在 `finish` 前，terminal `finish` 后不得再产出。runtime 将 adapter 抛错归一化为 `finish.reason.kind: error/aborted`；消费者按 `failure.code` 判断，不解析错误文字。service 不自行重试；`dsh-llm-retry` 处理 failed-step 重试。

`listModels` 是建议目录，基础实现返回空列表；核心路由仍可接受未列出的模型 ID，GUI 选择与提交要求目录成员。为 GUI 提供模型的 adapter 须实现目录。`resolveModel` 的异步查询必须响应传入 signal。图片和文件仍使用持久引用；请求投影不允许静默丢失模型输入。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

相关对象：[error](api-capabilities-dsh-llm-error.md)。

相关对象：[attribution](api-capabilities-dsh-llm-attribution.md)。

相关对象：[retry-policy](api-capabilities-dsh-llm-retry-policy.md)。

相关对象：[api-key](api-capabilities-dsh-llm-api-key.md)。

相关对象：[message](api-capabilities-dsh-llm-message.md)。

相关对象：[assistant-stream](api-capabilities-dsh-llm-assistant-stream.md)。

相关对象：[assembler](api-capabilities-dsh-llm-assembler.md)。

相关对象：[call-config](api-capabilities-dsh-llm-call-config.md)。

相关对象：[types](api-capabilities-dsh-llm-types.md)。

相关对象：[content](api-capabilities-dsh-llm-content.md)。

相关对象：[brand](api-capabilities-dsh-llm-brand.md)。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    llm: LlmRuntime;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `llm` | `llm: LlmRuntime` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-llm.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。

## Events 声明合并入口

完整公开声明：

```text
interface Events {
    'llm/stream'(this: LlmRuntime, options: GenerateOptions, next: () => AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk>;
}
```


本包通过 Cordis `Events` 声明以下事件。监听注册归调用插件 scope，卸载后撤回；waterfall handler 只有调用 next 才继续到下一层，不把观察通知改作隐式授权。可持久重建的业务事实由服务写入 Session，事件监听本身不形成恢复记录。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `llm/stream` | `'llm/stream'(this: LlmRuntime, options: GenerateOptions, next: () => AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk>` |
| `llm/adapters-updated` | `'llm/adapters-updated'(): void` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-llm.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
