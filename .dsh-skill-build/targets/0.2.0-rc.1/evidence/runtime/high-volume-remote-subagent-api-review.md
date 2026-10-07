# 高量 Remote、动态 Cordis 与 Subagent 公共 API 裁决

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。本审查以 `skill-source/api-surface.json` 的对象及成员清单为待裁决候选，以目标 checkout 的 `packages/typert/protocol`、`packages/api/gateway`、`packages/api/remotes`、`packages/extensions/cordis-host-runner`、`packages/subagent/subagent` 为事实来源。符号导出不等于独立第三方任务；以下规则按**包 + 导出子路径 + 符号或成员**覆盖候选。`merge` 表示归入现有专题，`include` 表示本轮新增独立插件任务，`exclude` 表示非作者契约或非此 Skill 的任务。

## `@deepseek-ai/dsh-typert-protocol`（根 67，`./types` 48）

源码 `src/index.ts` 的 Host 装饰器/绑定及 `src/types.ts` 的协议类型。根入口以下符号合并到 `api-guardrails/remote-api.md` 和 `how-to/add-remote-api.md`：

| 符号/成员 | 裁决 | 作者用途与边界 |
| --- | --- | --- |
| `Remote`、`RemoteScope`、`TypertRemoteService`、`bindTypertRemote`、`TypertGatewayBindingOptions.namespace`、`TypertGatewayBinding.serviceKey/namespace/service`、`remoteMethods` | merge | 定义 Host service 的公开方法及 scope，读取标记供生成器/Gateway；`remoteMethods` 用于核查，不自行注册 wire 路由。见 `src/index.ts:79-265`。 |
| `RemoteMethodOptions.mode`、`RemoteMethodMarker.method/exportName/invocation/mode`、`RemoteInvocationMarker.kind` | merge | 装饰器选项/反射结果；自有插件只设置 `mode`/export name，其余由标记产生。 |
| `RemoteError` 的 `code/details`、`remoteErrorOf`、`RemoteErrorCode`、`RemoteErrorDetailsMap`、`RemoteFailure`、`RemoteResult.ok` | merge | 业务错误声明与 Client 分支；`isDSHRemoteError` 是 class 的识别标记，不作为新错误域。 |
| `TypertLookupMap`、`TypertLookupProvider` 的 `hostTypeSymbol/parameter/resolve/wire/wireTypeSymbol`、`TypertLookupRegistry.register/get/configure/keys/definitions/subscribe`、`TypertLookupDefinition`、`TypertLookupResolver`、`TypertLookupHost/Wire` | merge | 自有 Host 对象 lookup 的扩展契约；与声明/生成一起使用，不能单凭 interface 虚构可传 Host 对象。源码 `src/types.ts` 与 registry 实现按 owner 的生成流程裁决。 |
| `TypertContextMap`、`TypertHostContextAdapter.resolve/wire/wireTypeSymbol`、`TypertClientContextAdapter.identity/resolve`、`TypertContextRegistry.registerHost/registerClient/getHost/getClient/configureHost/subscribe`、`TypertContextWire`、`TypertContext` | merge | scoped Remote 的 Host/Client 身份投影；需两侧 adapter 和 `RemoteScope`，由应用组合装载。 |
| `TypertRemoteMap`、`TypertRemoteNamespaceMap`、`TypertRemoteNamespace`、`TypertClientRemote.$mount/$on`、`TypertRemoteEvent`、`TypertRemoteEventSelection`、`TypertRemoteContribution.descriptors/package`、`TypertRemoteScopeMap/Api/Namespace` | merge | 生成贡献、Client assembly 与事件类型的声明合并/调用面；`$mount` 由 assembly 插件持有，业务插件只消费明确装配的方法。 |
| `RemoteStream`、`RemoteStreamHandle.send/end/dispose`、`RemoteInvocation.signal/uplink/peer/request/service` | merge | 自有流方法和协作取消；调用方/实现方要分别持有流与取消，不保证可重连恢复。 |
| `TypertCodec.mode`、`TypertSchema.parse`、`InvocationDescriptor` 全部成员、`InvocationParameterDescriptor` 全部成员、`InvocationSourceLocation` 全部成员、`TypertRegistryContract`、`TypertRegistryChange`、`TypertLocalRegistry`、`TypertRemoteRegistry`、`TypertLookup`、`TypertLookupMap` 以外的低层 registry 帧、`TypertForwardableEvent*`、`PeerId/PeerScope`、`TypertDisposer`、`isRemoteJsonValue`、`isRemoteUplinkItem`、`isTypertRemoteSegment`、`TYPERT_OWNED_VALUE`、`TypertOwnedValue`、`isTypertOwnedValue`、`typertOwnedValue` | exclude 或 merge as implementation detail | 生成器、Gateway、跨 wire codec/所有权检查和内部 registry 的形状。它们可出现在生成代码或框架 adapter，但一般插件作者不应手写 descriptor、Peer 帧或保管 owned-value 标记。规范事实归生成器与 Remote API 专题，不新增操作任务。 |

`./types` 的 48 个对象都是根入口同名**类型别名再导出**，按上表同名符号裁决；不另建 48 份事实或 HOW-TO。`RemoteErrorDetailsMap` 的 `gateway/bad-request`、`gateway/cancelled`、`gateway/internal` 是协议包内建代码；第三方只合并自己的业务 code，不覆盖三者。`InvocationDescriptor` 和参数 descriptor 的各字段是生成输出和 Gateway 输入，不是逐字段可供手写配置的插件 API。以上规则同时覆盖它们在 `api-surface.json` 中发现的每个成员。

为消除名称缩写歧义：`TypertClientEventListener` 合并到 Client `$on`；`TypertHostContextResolver` 合并到 scoped context adapter；`TypertLookupWire` 合并到 lookup wire 契约；`TypertRegistryListener`、`TypertForwardableEventEntry` 是 registry/转发内部回调而排除；`TypertRemoteScopeApi`、`TypertRemoteScopeNamespace` 是生成 Client scope 类型而合并到 Remote assembly。

## `@deepseek-ai/dsh-api-gateway`（根 16，Client 19，stream-protocol 29，types 10）

源码 `packages/api/gateway/src/index.ts`、`src/client/index.ts`、`src/stream-protocol.ts`、`src/types.ts`。

| 入口与对象/成员 | 裁决 | 所有权 |
| --- | --- | --- |
| 根 `TypertGateway`/`TypertGatewayService` 的 `invoke/registerRemoteEvents/stream/wireStream`、`InvokeRemoteRequest.args/method/namespace/peer/signal/uplink`、`TypertGatewayWireStream.failure/open`、`Config.streamInboxBytes/websocketHeartbeatIntervalMs` | merge | Gateway/Connection 的 Host transport；应用 Profile 装载，业务插件不直接调用 `invoke` 或持有 wire stream。归 `remote-api.md` 的装配边界。 |
| 根 `TypertGatewayError` 的 `endpoint/field`、`TypertGatewayErrorCode`、`TypertGatewayFaultDetails.endpoint/field` | merge | 基础设施失败类型，业务 Client 按 `RemoteResult` 与稳定 code 处理；不自造 Gateway code。 |
| 根 `TypertRemoteEventSource/Dispatch/Frame/Invocation/Outcome/Context` 及其全部成员、`RemoteEventHostInfo.home` | merge | 仅固定 Host BFF event source 与 Gateway 之间的事件桥，不能将任意 Cordis event 自动当作可转发。归 `api-remotes` assembly。 |
| `./client` 的 `ClientRemote`、`RemoteHostFacts`、`RemoteStream`、`RemoteJournalStream`、`RemoteSnapshotStream`、`RemoteStreamOptions/Item/Factory`、`RemoteJournalChange/Frame/StreamOptions`、`RemoteSnapshotStreamOptions`、`RemoteStreamCarrierError`、`isRemoteFailure`、`cancelledFailure`、`carrierFailure` | merge | 真实 Client 消费与流包装入口；分别归 `remote-api.md`、Session query 的按代际恢复边界。`ClientRemote.$host/$stream`、`$mount/$on` 的具体职责见 Remote 章节；业务调用方不调 `$mount`。 |
| `./client` 的 `apply`、`inject` | exclude | Gateway Client service 装载元数据/函数，由 Client assembly 挂载，不是插件业务调用。 |
| `./stream-protocol` 全部 29 个对象及其成员 | exclude | 物理 HTTP/WebSocket 端点、帧、解析/投影/恢复辅助函数；`src/stream-protocol.ts` 是 transport 协议，不是第三方业务 API。自有流用装饰器与 Client `RemoteStream`，不手写 `RemoteStreamClientMessage`、event frame 或 endpoint。 |
| `./types` 全部 10 个对象 | merge alias | 与根入口同名的 Host type-only 再导出，按根对象归属；不新增章节。 |

根事件桥的准确同名对象包括 `TypertRemoteEventContext`、`TypertRemoteEventDispatch`、`TypertRemoteEventFrame`、`TypertRemoteEventInvocation`、`TypertRemoteEventOutcome`；其字段按事件源所属组合归属，第三方不手写物理帧。

## `@deepseek-ai/dsh-api-remotes`（根 4，Client 85，types 1）

源码 `packages/api/remotes/src/index.ts` 与 `src/client/index.ts`。根 `inject=['typertGateway']`、`apply(ctx)`、`API_REMOTE_FORWARDED_EVENTS`、`ApiRemoteForwardedEvent` 是当前 Web **应用选择**的固定 BFF 组合：Host 注册唯一转发事件源，Client 显式 import 所选 `/remote` 贡献。这四项整体 `merge` 到 `remote-api.md` 的 assembly 边界；不是任意第三方包可调用 `register` 扩充的动态注册表。`./types` 的 `ApiRemoteForwardedEvent` 同名 alias，合并。

`./client` 的 85 个对象按 `src/client/index.ts` 的导出来源统一裁决：

- `ClientRemote`、`ApiRemoteForwardedEvent`、`RemoteHostFacts`（如存在）属于当前 assembly 的类型面，`merge` 到 `remote-api.md`，业务 Client 可以 import 这个组合以获得已选 namespace 与 `$on` allowlist。
- `ConnectionHandle`、`ConnectionSinks`、`ContentBlock`、`MessageId`、`Rpc*`、`SessionId`、`StreamChunk` 等 carrier type-only alias 归 `client-connection.md`/Session owner。
- `Plugin*`、`Bundle*`、`Registry`、`ManagementError` 等 plugin-manager type-only alias 归 `plugin-manager.md`；`CordisDynamic*` 和 inspect/run 状态 alias 归原始 `dsh-cordis-host-runner`，本审查下文裁决；`Llm*` 等类型归 LLM、文件引用归 workspace、subagent 类型归 subagent owner。它们只为 Web 应用提供单入口类型导入，不能以 alias 重复计入 85 个新 API 任务。
- `./client` 的 `apply`、`inject` 是当前应用的贡献装载函数/依赖，`exclude` 作为第三方独立 API。第三方 Remote 要进入此 assembly，须由应用 owner 修改导入与构建，不能靠它自动扫描。

## `@deepseek-ai/dsh-cordis-host-runner`（根 50，types 35）

源码 `packages/extensions/cordis-host-runner/src/index.ts`、`src/inspect-registry.ts`、`src/types.ts`。**新纳入** `api-guardrails/cordis-inspect-provider.md` 与 `how-to/register-cordis-inspect-provider.md`：

| 根符号/成员 | 裁决 | 任务 |
| --- | --- | --- |
| `CordisInspectRegistryService.register/list/query`、`HostCordisInspectProviderRegistration.manifest/query`、`CordisInspectProviderManifest.id/description/methods`、`CordisInspectMethodManifest.name/description/inputSchema/outputSchema`、`CordisInspectProviderView.platform`、`CordisInspectPlatform` | include | 第三方 Host 插件声明只读、模型可查询的能力，拥有权限、取消和注册 disposer。`src/inspect-registry.ts` 校验 manifest、输入/输出和 signal。 |
| `CordisInspectRegistryService.syncClientManifest/resolveClientQuery`、`CordisInspectQueryRequest/Resolution/Resolved`、`CordisInspectRequestId/ResolveAck` | exclude | 跨页 Client manifest 与 pending query 回执由 Client runner/工具路径拥有；Host provider 不构造/结算它们。 |
| `default` / `DynamicCordisRunnerService` 的全部 21 个公开方法、`Config.vmTimeoutMs`、`DynamicCordis*`、`CordisDynamic*`、`CordisRun*`、`CordisHalfState`、`ApprovalRequestId`、`RequestRunOutcome`、`CordisErrorDetails` | exclude | Session 中模型定义并经人类批准的临时 VM 插件执行系统；不是离线发布插件的 Profile 装载 API。`define/run/stop/inventory` 等虽然公开给产品 Remote/工具，但没有第三方固定插件任务。`src/index.ts` 和 `src/registry.ts` 为其 owner。 |

`./types` 35 个同名 wire type-only alias 按根同名项裁决；只可把 manifest 两类和 `CordisInspectPlatform/ProviderView` 归入 inspect 任务，其余跨页回执或动态 runner 状态按上表排除。`CordisInspectProviderView` 的 `description/id/methods` 继承 manifest，归 manifest 契约。Registry 的 `query` 可用于框架消费，业务 provider 只实现自己的 `registration.query`，不能把 `Registry.query` 当免授权入口。

精确的动态系统排除规则是根符号名称以 `DynamicCordis`、`CordisDynamic`、`CordisRun`、`CordisHalf` 开头者全部归动态 VM 系统；连同 `ApprovalRequestId`、`RequestRunOutcome`、`CordisErrorDetails`、默认 Service 与 `Config`，不映射为离线插件任务。这一规则逐一覆盖 define receipt/request/definition、Host/Client half、inventory/inspection、run attempt/request/resolution/response、stop/undefine receipt 等候选及其字段。inspect 跨页内部排除项的准确名称还有 `CordisInspectQueryResolution`、`CordisInspectQueryResolved`、`CordisInspectResolveAck`。

## `@deepseek-ai/dsh-subagent`（根 67，client 10，internal 7，invariant 3）

源码 `packages/subagent/subagent/src/index.ts`、`src/types.ts`、`src/descriptor.ts`、`src/child-agent.ts`、`src/out-of-process.ts`。根符号按下列互斥组裁决：

| 根符号/成员 | 裁决 | 作者任务与边界 |
| --- | --- | --- |
| `SubagentRuntime`/默认 Service 的 `registerProvider/getProvider/list/start/startContinuable/sendMessage/interrupt/listChildren/listDescendants/prompt`、`SubagentProvider` 全部成员、`SubagentCapabilities` 全部成员、`SubagentStartRequest`/`ResolvedSubagentStartRequest` 全部成员、`SubagentRun`/`SubagentResult` 全部成员、`ContinuableCreateRequest/CreateSpec/StartSpec/Start` 全部成员、`SubagentError`、`SubagentStopReason/Map`、`Config` | merge | 自定义 Provider、启动与调用，归 `api-guardrails/subagent-provider.md`。`SubagentRuntime.interruptByParent` 与 `drainContinuableChildren/Descendants` 是拥有父地址的 Host 管理路径，不开放普通 Client。 |
| `SubagentRunId`、`SubagentRunInfo/EndInfo`、`SubagentAddress`、`SubagentCatalogEntry/Row`、`SubagentListEntry/DescendantListEntry`、`SubagentInterruptAuthority/Receipt`、`SubagentPromptRequest/Receipt/RequestId`、`SubagentSendMessageOptions`、`SubagentIdentityProjection/TimingProjection` | merge | 事件/控制/目录的读写类型，分别归 `subagent-provider.md` 与 `subagent-tools.md`；成员只在所属服务/事件有意义，不独立授权。 |
| `SubagentDescriptorData/Input`、`OneShotSubagentDescriptorData/Input`、`ContinuableSubagentDescriptorData/Input`、`SUBAGENT_DESCRIPTOR_VERSION`、`snapshotSubagentDescriptor`、`foldSubagentDescriptor` | merge | 服务持久化 descriptor 与恢复辅助；Provider 可读取 `request.descriptor`，不另造不兼容版本。归 subagent-provider 的恢复边界。 |
| `NO_START_CAPABILITIES`、`resolveChildCwd/Depth/AgentOptions`、`parentAgentOptionsForDelegation`、`captureDelegatedPolicyOverrides/appendDelegatedPolicyOverrides`、`DelegatedPolicyOverrides`、`ChildComposition`、`applyChildComposition`、`childSessionMeta`、`delegationDepthOf`、`assertSubagentMaxDepth/assertPositiveFinite/assertUsableCwd/validateConfiguredCwd` | merge implementation helper | 具体 in-process/进程 Provider 可复用的政策/深度/目录原语；语义归自有 Provider 与父 Agent 授权，不因函数导出自动授予委派权限。 |
| `subprocessRunHandle`、`SubprocessRunHandleParts`、`settleRunResult`、`RunResultSettlement`、`settleRun`、`finalAssistantOutput`、`AssistantOutputFold` | merge implementation helper | 进程 Provider 的结果、取消、清理辅助；可用于自有 backend，但完整 `SubagentRun` 所有权仍归 Provider。归 subagent-provider 与 ACP 实现边界。 |
| `AgentMessageSource`、`SubagentSettledMessageSource` | merge | continuable 消息的 Session source 类型；归 Session/subagent 恢复事实，不独立构造消息入口。 |

`./client` 的 10 个对象为上述控制/展示类型的客户端再导出，按根同名归属；不能据此在 Client 直接调用 Host `SubagentRuntime`。`./internal` 的 7 个工具/Host prompt queue helper 明确在 internal 子路径，全部 `exclude`。`./invariant` 的 `apply/inject/name` 是检查插件的装载元数据，全部 `exclude` 为独立委派 API；可作为测试配置，不是 Provider SPI。根服务的 `interruptByParent`、`drainContinuableChildren/Descendants` 保留在 Host 所有者边界，模型侧直接委派控制由另装的工具插件决定。

根分组中被斜杠缩写的精确名称包括 `ContinuableCreateSpec`、`ContinuableStart`、`ContinuableStartSpec`、`ContinuableSubagentDescriptorInput`、`OneShotSubagentDescriptorInput`、`SubagentCatalogRow`、`SubagentDepthError`、`SubagentDescendantListEntry`、`SubagentDescriptorInput`、`SubagentInterruptReceipt`、`SubagentPromptReceipt`、`SubagentPromptRequestId`、`SubagentRunEndInfo`、`SubagentStopReasonMap`、`SubagentTimingProjection`；全部依前表归既有 Provider/控制/投影专题。`resolveChildAgentOptions` 与 `resolveChildDepth` 是具体 Provider 的辅助函数，按 implementation helper 合并，不构成独立授权。

## 独立验证与未运行项

`evidence/tests/cordis-inspect-consumer` 对新增 inspect HOW-TO 的 TypeScript 原样提取，在 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-cordis-host-runner@0.2.0-rc.1` 的独立安装中 `tsc -p tsconfig.json` exit 0；真实 Cordis `CordisInspectRegistryService` 装载、provider 注册、重复 id 拒绝及 fiber 卸载注销，`node verify.mjs` 输出 `PASS inspect registration, collision, disposal`。尚未装载 `tool-cordis`/真实 Agent 来执行模型查询，也未验证远程 Client 或自有权限。其余四包本轮为精确源码与声明语义审查，未新跑 Host/Client/Gateway 或 Subagent 端到端测试；已有 Remote/Provider 专题列出的独立验证边界不因本矩阵改变。
