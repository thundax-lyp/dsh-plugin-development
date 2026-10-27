# 组合公开能力并消费已发布接口

## 在 Client 消费已有 Remote 并处理失败

相关公开对象：

- [ClientRemote](../api/api-core-dsh-api-gateway-client-1.md#clientremote-公开契约)。
- [RemoteHostFacts](../api/api-core-dsh-api-gateway-client-1.md#remotehostfacts-公开契约)。
- [isRemoteFailure](../api/api-core-dsh-api-gateway-client-3.md#isremotefailure-公开契约)。
- [ClientRemote](../api/api-core-dsh-api-remotes-client-1.md#clientremote-公开契约)。
- [RemoteHostFacts](../api/api-core-dsh-api-remotes-client-10.md#remotehostfacts-公开契约)。

目标：Client 使用现有 Host controller 的生成契约，并在重连与卸载后停止使用旧调用入口。

1. 从 [Gateway Client](../api/api-core-dsh-api-gateway-client-overview.md) 和 [API Remote assembly](../api/api-core-dsh-api-remotes-client-overview.md) 选择实际 namespace。Client 插件导入 assembly 声明并 inject `remote` 与 `remote.<namespace>`。完整的 Host controller 包和生成 artifact 必须由 profile 装载；只导入 type 不会在 Host 注册服务。
2. 直接调用生成的 `ctx.remote.<namespace>.<method>`；不要复制参数签名。返回 `RemoteResult<T>`，先检查 ok，再读 value 或按 error.code 分支。未知错误保留并向上报告，不以空值冒充成功。若调用支持取消，AbortSignal 按生成签名末位传入。
3. namespace 的 `$mount` 必须归 Client 插件 owner 所有，卸载撤销同一 contribution；不要手工延长旧方法引用的生命周期。若保存过方法引用，卸载后调用应返回已撤回失败。
4. `ctx.remote.$host` 是 plain read，home 在首个 ready frame 前可能 undefined；重连后在 `connection/reset` 或领域事件刷新状态，不为它虚构订阅计数器。持有的流句柄在组件卸载或取消时 dispose。
5. 用本地 Host 与 Client 真实组合测试正常结果、业务失败、取消与卸载；再用浏览器检查传输和重连。owner 本地调用成功不能证明非 owner 授权。

完成判据：请求到达目标 Host owner，生成 codec 拒绝不合法输入，取消不成为成功值，Client 卸载移除 namespace，重连不复用失效快照。

## 使用 SDK 驱动独立 Harness 并回收子进程

相关公开对象：

- [DeepSeekHarness](../api/api-core-dsh-sdk-client-root-1.md#deepseekharness-公开契约)。
- [HarnessClient](../api/api-core-dsh-sdk-client-root-1.md#harnessclient-公开契约)。
- [HarnessClientOptions](../api/api-core-dsh-sdk-client-root-1.md#harnessclientoptions-公开契约)。
- [HarnessSession](../api/api-core-dsh-sdk-client-root-1.md#harnesssession-公开契约)。
- [RunResult](../api/api-core-dsh-sdk-client-root-2.md#runresult-公开契约)。

目标：独立 TypeScript 消费者驱动 JSON-RPC Harness，保留 session id 并可靠关闭子进程。

1. 查询 [SDK Client](../api/api-core-dsh-sdk-client-root-overview.md) 与 [SDK protocol](../api/api-core-dsh-sdk-protocol-root-overview.md)，准备明确的运行时可执行文件、sdk profile、DSH_HOME 与工作区。SDK 不在 Cordis Context 内运行；它与 Web Remote 的端点和 wire vocabulary 不相同。
2. 用 DeepSeekHarness 的启动规格配置 profile/provider/model/patches；首次使用惰性启动。start 的 initialize 握手有期限，服务器在接受 prompt 前校验精确路由。可选 reasoningEffort 归适配器，maxTokens 是正整数。
3. run 接受文本或规范 prompt content blocks，返回 RunResult 的 sessionId/finalResponse/events/notifications。finalResponse 是该活动区间最后提交的根会话助手文本，不保证只因果归属于单条 prompt；期间可能有 steering 或其他入队工作。
4. 完整任务等待应先 subscribeSessionTree，再 prompt，调用 session/wait 后排空已排队通知；HarnessSession.run 以首次 idle 为活动区间终点。恢复持久会话用 resumeSession(savedId)，保留原 home/workspace；session(id) 只是当前进程的惰性句柄，不是持久恢复。
5. finally 调用 close，或使用支持的 await using。close 先有界 shutdown，再 stdin EOF、SIGTERM、SIGKILL 直到真实退出，幂等且关闭后拒绝复用。初始化失败和清理失败同时发生时保留 AggregateError，不能在旧进程退出未证明前新建另一个运行时。

完成判据：会话身份持续一致，失败不伪造新会话替代，超时包含诊断，close 后无存活子进程。恢复 Session 不恢复 shell、浏览器等外部进程。

## 声明 Agent preset 并保留运行代际

相关公开对象：

- [AgentPresetRegistry](../api/api-core-dsh-agent-preset-registry-root-1.md#agentpresetregistry-公开契约)。
- [Config](../api/api-core-dsh-agent-preset-registry-root-1.md#config-公开契约)。
- [default](../api/api-core-dsh-agent-preset-registry-root-1.md#agentpresetregistry-公开契约)。
- [Config](../api/api-core-dsh-agent-preset-root-1.md#config-公开契约)。
- [default](../api/api-core-dsh-agent-preset-root-1.md#default-公开契约)。

目标：新 Agent 使用选中的插件组合，既有 Agent 的配置和资源不被热更新悄悄替换。

1. 选择 [Agent preset registry](../api/api-core-dsh-agent-preset-registry-root-overview.md) 和 [声明插件](../api/api-core-dsh-agent-preset-root-overview.md)。先装载 registry，再声明一个或多个 preset；声明插件 inject agentPresets，不依赖 YAML 列表先后。
2. 新条目在 patch 中 insert，registry config.default 指向稳定 preset id；声明插件的 config 写 id、plugins 及可选 name/description/order。Loader 行 id 是编辑地址，config.id 是保存在会话中的 preset 标识，不能混用。
3. plugins 是完整 Cordis 子插件行。服务依赖、Config 校验与 effect 所有权照常有效；对需要服务的子插件写 inject，不把全部功能无条件放在根作用域。
4. 创建新 Agent 时选择对应 preset，断言工具/提示词/限制只作用于该 Agent。修改声明后只影响之后创建的 Agent，既有 Agent 持有其代际直到释放；重复 preset id 必须失败。
5. 释放 Agent，确认其持有的代际和子插件资源撤销。preset 声明不提供文件目录复制或删除行为，不把 package 内随附 Skill 目录当成 API 注册机制。

完成判据：两个 preset 的作用域隔离，旧 Agent 保留已取得代际，新 Agent 获取更新，最后一个 owner 释放后资源清理。

## 运行并停止会话隔离的动态 Cordis 包

相关公开对象：

- [apply](../api/api-core-dsh-cordis-client-runner-client-4.md#apply-公开契约)。
- [Config](../api/api-core-dsh-cordis-host-runner-root-1.md#config-公开契约)。
- [DynamicCordisRunnerService](../api/api-core-dsh-cordis-host-runner-root-6.md#dynamiccordisrunnerservice-公开契约)。

目标：经公开动态 runner 定义、运行、停止一份包，明确临时定义与已安装 bundle 的差异。

1. 查询 [Host runner](../api/api-core-dsh-cordis-host-runner-root-overview.md)、[Client runner](../api/api-core-dsh-cordis-client-runner-client-overview.md)。仅 Host 的包可在本进程激活；带浏览器半的包需真实 Client runner 与 UI 处理审批，不能由 Host 假定页面已运行。
2. define 校验元数据并预检各半语法，生成不可变 package revision；run 的 mode=run 启动当前版本，mode=update 替换版本。带 Client 的包先审批，再 Host，最后 Client。取消须结束挂起的审批和请求。
3. stop 释放运行 effects 并保留定义；undefine 连定义一起移除。定义按 Session 隔离且仅进程内存在，日志保留参数和回执不会恢复注册表。页面刷新后必须显式再次运行 Client 半。
4. Client 检查要有活动事件流；超时取首个有效响应，某页面失败不能阻止其他页面成功。断连不重放已错过请求，重连后重试。host vmTimeoutMs 仅限制同步求值片段，不是全生命周期执行时限。
5. 以两个 Session、两个页面、取消和停用 runner 核查隔离、审批、pending 结束与资源清理。Node VM 与 façade 不构成安全沙箱；所声明的 Cordis 服务仍能访问 live runtime。

完成判据：stop 后实际 effect 撤销，undefine 后定义不可查，其他 Session 不可读该定义，重启不伪称恢复它。

## 选用 Host 目录与 Web 集成能力

相关公开对象：

- [DirectoryPicker](../api/api-core-dsh-host-directory-picker-root-1.md#directorypicker-公开契约)。
- [DirectoryPickerBrowseCapability](../api/api-core-dsh-host-directory-picker-root-1.md#directorypickerbrowsecapability-公开契约)。
- [DirectoryPickerCapability](../api/api-core-dsh-host-directory-picker-root-1.md#directorypickercapability-公开契约)。
- [DirectoryPickerNativeCapability](../api/api-core-dsh-host-directory-picker-root-2.md#directorypickernativecapability-公开契约)。
- [WebRoute](../api/api-core-dsh-host-webserver-root-1.md#webroute-公开契约)。
- [WebServer](../api/api-core-dsh-host-webserver-root-1.md#webserver-公开契约)。

目标：插件复用 Host 服务，且不会把不同交互环境的 capability 当成同一方法。

1. 查询 [DirectoryPicker](../api/api-core-dsh-host-directory-picker-root-overview.md)、[WebServer](../api/api-core-dsh-host-webserver-root-overview.md) 及实际 provider。目录选择由 capability().kind 判别；native 在 Host 显示 OS 对话框，browse 提供列表与创建目录能力供页面驱动，远程浏览器不能看到 Host 的原生窗口。
2. 为消费方 inject 所需 service，只装载一个实现。switch 根据 kind 调用其方法；未知扩展 kind 隐藏不支持的入口，不猜它也有 pick。native pick 取消返回 null；browse list 使用绝对路径，scan 观察 signal，注意 truncated；createDirectory 的 name 是单段非空名称，不允许斜杠或 .、..。
3. Web 路由注册及文件/打开应用入口只在其 Host provider 存在时使用，注册 disposer 归插件 owner。客户端按钮需通过实际公开 Remote 接到 Host，不能向浏览器导入 node:* Host 包。
4. 测试缺 provider、取消、无权限/不可读目录、重复创建、超出列表限制、插件卸载及不同 platform provider。打开外部应用的成功回执不证明用户完成操作。

完成判据：选择环境正确，取消释放等待资源，路径错误明确，卸载撤销注册，远程 Client 不误用 Host 原生窗口。

## 提交选择过的产品遥测并区分入队与送达

相关对象：

- [Config](../api/api-core-dsh-host-product-telemetry-otel-root-1.md#config-公开契约)。
- [ProductTelemetryRecord](../api/api-core-dsh-host-product-telemetry-otel-root-1.md#producttelemetryrecord-公开契约)。
- [ProductTelemetryScalar](../api/api-core-dsh-host-product-telemetry-otel-root-1.md#producttelemetryscalar-公开契约)。
- [default](../api/api-core-dsh-host-product-telemetry-otel-root-1.md#default-公开契约)。

目标：在已明确启用的本地组合中提交最小产品事件，不自动收集会话数据或把本地入队当成外部送达。

1. 查询 [产品遥测发送方](../api/api-core-dsh-host-product-telemetry-otel-root-overview.md)。provider 依赖 otel，装载本身不会发送事件；consumer 自行决定发生时机和字段。普通 Web Client 不默认收集产品事件。
2. 配置明确的 endpoint、channel、serviceName 与 serviceVersion；endpoint 必须 HTTP(S)，channel 是合法 HTTP header value；maxExportBatchSize 不大于 maxQueueSize。只在获准的集成中使用外部收集器，本地验证使用脚本化接收端。
3. 通过 productTelemetry.emit(record) 提交 event name、string body、Unix毫秒 timestamp，attributes只含 scalar 或一层scalar对象，不放会话正文、凭据或隐式用户标识。调用同步入队，不等待网络，观察时间由入队时赋值。
4. 队列满时新记录会丢弃；SDK 管理 batch/retry。卸载在 shutdownTimeoutMillis 内 drain，期限到达中止 pending exports，仍可能丢失。日志诊断不等同 collector 或 warehouse acknowledgement。
5. 用本地接收器验证允许字段、队列限制与卸载 drain，再明确比较本地入队、HTTP接收和业务入库三个证据边界。

完成判据：未调用时无事件，提交字段符合批准范围，停用后发送方清理完成，报告没有把入队写成外部送达。
