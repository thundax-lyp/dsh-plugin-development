# rc.1 LLM 公共入口 pending 裁决

精确 checkout：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。本审计针对 `api-surface.json` 中 `@deepseek-ai/dsh-llm` 的 pending 子入口和 `@deepseek-ai/dsh-llm-deepseek` 根入口；只建议共享账本处置，不修改账本。纳入标准是普通第三方 Host 插件能据此注册/装配模型 route 或诊断，而非“包公开即每个符号都要成为独立任务”。

## `@deepseek-ai/dsh-llm` 子入口

`packages/llm/llm/src/index.ts:48-58` 用 `export *` 原样重导 `./brand`、`./types`、`./assistant-stream`、`./message`，因此这些入口的同名对象是根入口别名，不是新的一份实现。按以下裁决避免一个符号在多个 reference 拥有独立事实：

| pending entry | 对象级候选处置 |
| --- | --- |
| `./types` | `GenerateOptions`、`StreamChunk`、`LlmModelInfo`、`LlmResolvedModelInfo`、`LlmConfigurableProvider`、`LlmProviderInfo`、`LlmFailure`、`FinishReason`、`ToolSchema`、`TokenUsage` 等供 adapter/模型目录消费；根出口已包含。将需要的对象/成员合并至 `api-llm-providers.md` 的 `对象类型与成员`，协议消息形状在相关 Session/工具 reference 引用，勿对同一对象建立另一份权威。其余 `MessageRoleMap`、`ContentBlockMap` 等辅助联合类型仅作类型组成，不是新 Provider 注册任务。|
| `./brand` | `MessageId`、`ToolCallId`、`ProviderRequestId`、`LlmAttemptId`、`ReasoningEffortId` 的构造函数也从根出口导出；`ToolCallId` 等可被 adapter 用于构造合法块，但子路径不新增生命周期或服务。与根对象合并，若成员账本避免重复 ID，子路径记 alias。源码 `src/brand.ts:16-75`。|
| `./message` | `createMessage`、`createUserMessage`、`createAssistantMessage`、`createToolResultMessage`、`freezeMessage` 与消息/source 类型确实公开、创建带来源的模型消息；根出口同名重导。可在 `api-llm-providers.md` 说明 adapter 输出与 Session 来源，或归 Session 日志 reference；不要把 Client 侧序列化消息当独立 LLM route。源码 `src/message.ts:10-310`。|
| `./assistant-stream` | `AssistantStreamAccumulator`、`assembleAssistantStream`、`expandAssistantStream`、`assistantStreamChunks`、可见内容/首 token 时间查询等是在既有 `StreamChunk` 上记录、展开、投影的工具，根入口已重导。Provider 的必需任务仍是输出合法 chunks，`LlmRuntime`/Agent 负责消费；可并入 Provider 流形状说明，但没有额外注册 seam。源码 `src/assistant-stream.ts:14-439`。|
| `./invariant` | **不同于别名，建议纳入诊断任务**：`src/invariant.ts` 真正导出 `name = 'llm-invariant'`、`inject = ['invariants']`、`apply(ctx)`，注册针对 `llm/stream` 的包归属 grammar 校验（block index、delta 类型、usage/finish 次序等）。已在 `api-llm-providers.md` 补具体装载边界；其三个对象应映射该处，而非排除。|
| `./remote`、`./typert` | 公共 package exports 对应生成的跨侧 binding，当前对象发现数均为 0；不提供第三方独立 route 或 provider registry。与 `LlmRuntime` Remote 调用合并，不建立 HOW-TO。|

根入口对象里 `LlmRuntime`、`LlmAdapter`、注册句柄、`GenerateOptions`/`StreamChunk`、`LlmError` 和模型目录类型已经在 `api-llm-providers.md` 描述并由 `llm-adapter-consumer` 隔离验证。不要因为子路径 pending 把根入口整体改回 pending。对 `AssistantStream*`、消息工厂、品牌构造器若决定 included，应为其**具体消费任务**补成员表；否则标明确切的 alias/辅助类型处置，而非无理由排除。

## `@deepseek-ai/dsh-llm-deepseek` 根入口

`packages/llm/llm-deepseek/src/index.ts:2-41` 只重导构件，没有 `name/inject/apply`，自身不是 Cordis 插件。第三方可用它**装配自有 DeepSeek Messages route**，而 `dsh-llm-deepseek-api-key` 已提供固定 `deepseek-official` route 的普通配置任务。以下是根对象级候选：

| 建议 | 精确符号与源码理由 |
| --- | --- |
| 纳入 Provider 构件任务 | `registerDeepSeekProvider` 是真实 Host helper：`src/host.ts` 通过 `ctx.llm.registerAdapter([provider], adapter)` 绑定任意自有 route，接受 `options()`、`resolveAuth(connection)`、可选 `providerName`/`discoverModels`，并在 volatile retry policy 改变时原子 `replace`。它同时接入 Settings、attachments、fs、DeepSeek request extensions 和匿名用户 ID；调用者仍要自己提供凭证权限与配置事实。`DeepSeekAdapter`/`DeepSeekAdapterOptions` 是更低层但真实可用的构造器/回调契约；直接构造要提供 `resolveUserId` 与 `prepareExtensions` 等完整依赖。`DeepSeekRequestAuth` 将请求级 header 与可选 `onRequestError` 固定到同一 connection snapshot。归 `api-llm-providers.md` 与内置路由章节，不把它们当可直接装载的插件。|
| 纳入配置/目录成员 | `Config`、`Options`、`plainOptions`、`resolveAdapterOptions`、`ResolvedDeepSeekOptions`、`DeepSeekConnectionOptions`、`DeepSeekCatalogModel`、`RequestDefaults`、`catalogModelInfo`、`deepSeekConfigFields`、`PUBLIC_BASE_URL` 是自有 Messages route 的可复用配置、请求快照和模型目录面。`src/config.ts:19-80,95-205` 校验 volatile、环境与协议上限；`src/model-info.ts:45-` 将目录条目映射为 LLM model info。可在 `api-llm-builtins-retry-meter.md` 加成员表/链接到 Provider 文档；不要把 `Options` 当运行时服务。|
| 排除普通 route 任务的 adapter 内部文件设施 | `DeepSeekFileStore`、`DeepSeekFilesClient`、`DeepSeekUploadIndex`、`DeepSeekFileId`、`DeepSeekFileIdType`、`DeepSeekFileConnection`、`DeepSeekFilePolicy`、`DeepSeekFileReference`、`DeepSeekFileObject`、`DeepSeekFilePage`、`DeepSeekUploadRecord`、`deepSeekFileScope` 是 Messages adapter 的 Files API/上传索引实现。`src/adapter.ts:29` 默认创建 store，`src/file-store.ts:131-137` 再创建 index/client；普通 provider helper 已封装它们。独立使用意味着自建文件持久化/过期/配额恢复与权限任务，本轮无这类第三方需求或隔离验证；不应映射为“配置一个 LLM route”的可用成员。它们虽被发布，排除的是**本 Skill 当前插件任务**，不是声称 TypeScript private。|
| 排除独立任务、可作为协议常量引用 | `DEFAULT_*`、`MIN_FILE_EXPIRY_SECONDS`、`MAX_FILE_EXPIRY_SECONDS`、`MAX_FILE_UPLOAD_BYTES`、`MAX_STORED_FILE_BYTES`、`MAX_STORED_FILE_COUNT`、`MAX_IMAGE_BYTES`、`REQUEST_IMAGE_MAX_DIMENSION` 是上述 config、文件和图片策略的默认/界限；`deepSeekImageRequestPricing`、`resolveRequestImageMaxBytes`、`resolveRequestImageTarget`、`deepSeekImageTokens`、`deepSeekRequestImageDimensions` 是 adapter 的图片投影/定价辅助，`src/request-pricing.ts` 和 `src/images.ts` 已在协议路径使用。普通插件使用 `DeepSeekAdapter.imageRequestPricing` 的结果即可；直接调用辅助函数是另一个图像策略实现任务，不能当 route 注册前置。|

`api-surface.json` 中 `DeepSeekAdapter` 的 `providerInfo`、`providerRetryPolicy`、`imageRequestPricing`、`listModels`、`resolveModel`、`prepareCall`、`stream` 与通用 `LlmAdapter` 同形，但其实现有 Messages 特有认证、文件、图片和 replay 语义。若纳入，成员表必须分别写明“自有 route 的构件”及配置/认证；不能仅将对象名映射到“本包不可直接装载”的段落。`DeepSeekConnectionOptions` 的 `defaults`、`filePolicy` 是解析后的操作快照字段，不能从 UI 原始 `Config` 直接读取。

本次只做目标源码与账本审计，没有新增 DeepSeek 自有 route 的编译/联网验证。既有 `evidence/runtime/llm-provider-review.md`、`llm-builtins-retry-meter-review.md` 各自记录通用 adapter 与固定路由的隔离范围；它们不证明上述文件 store 或自建 Messages route 的外部行为。
