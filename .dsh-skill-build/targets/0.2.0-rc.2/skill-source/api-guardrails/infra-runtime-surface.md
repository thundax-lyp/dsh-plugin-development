# 基础设施任务 API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-infra-runtime.md)。本页只列出这些插件任务直接使用的公开成员。

## 基础设施任务 API

`BrowserUseRegistry` 和 `ComputerUseRegistry` 是可选实验性 provider 任务的公开单例选择接口。其 `providerName` 分别为 `BrowserUseProviderName | undefined` 或 `ComputerUseProviderName | undefined`；`register(name)` 返回异步清理函数，并拒绝第二个仍存活的 provider。品牌类型名称分别从 `@deepseek-ai/dsh-browser-use/brand` 和 `@deepseek-ai/dsh-computer-use/brand` 导出。两个 registry 本身都不执行浏览器或桌面操作；工具由选定的 provider 条目提供。

`SshConnection` 是 `fs-ssh`、`subprocess-ssh` 和 `sandbox-ssh` 背后的公开 `ctx.ssh` 服务。其 `ready` promise 表示连接启动完成；`request(method, params, resultSchema, signal?, wait?)` 发送管理 RPC；`connectStream(endpoint, signal?)` 打开独立的认证 stream；`dispose()` 等待转发和部分完成的初始化收束。`nodeExecutable` 是已验证的远程 Node 路径。仅在可选的 PTC bootstrap 路径和哈希都已配置时才提供 `bootstrapPath`。公开的 `Config` 要求 OpenSSH `host` alias、远程绝对路径 `node`、`helper`、`workspace` 及 `helperHash`；可选的 `bootstrapPath`/`bootstrapHash` 必须成对提供，`requestTimeoutMs`、`maxFrameBytes`、`maxPending` 和 `leaseMs` 用于限制传输。基础设施任务通常通过三个 SSH provider 使用此服务；传输中断导致结果不明时，不得重放操作。源码：`packages/ssh/ssh/src/index.ts`。

**`AgentPresetRegistry`**

- 入口： `export:@deepseek-ai/dsh-agent-preset-registry:.`
- 签名： `AgentPresetRegistry`
- 源码： `packages/preset/agent-preset-registry/src/index.ts`

| 成员       | 签名                                                               | 任务用途                                                      |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| `config`   | `Config`                                                           | 已解析的默认与可变选择配置；不要通过此对象修改活动 revision。 |
| `list`     | `() => Promise<AgentPreset[]>`                                     | 返回所有定义及当前 broken 诊断；等待 Loader 审核结束。        |
| `mount`    | `(ctx: Context, id?: string \| undefined) => Promise<AgentPreset>` | 在 Cordis context 中挂载所选 revision；树失败时拒绝。         |
| `register` | `(definition: PresetDefinition) => Promise<() => Promise<void>>`   | 管理一个定义及其异步注销函数。                                |
| `resolve`  | `(id?: string \| undefined) => Promise<AgentPreset>`               | 不启动 Agent 而读取当前 preset 元数据。                       |
| `select`   | `(agent: Agent, agentPreset: string) => Promise<string>`           | 持久化一个 Agent 选择，并返回所选 preset ID。                 |

**`AttachmentStore`**

- 入口： `export:@deepseek-ai/dsh-attachment:.`
- 签名： `AttachmentStore`
- 源码： `packages/attachment/attachment/src/index.ts`

| 成员               | 签名                                                                                                             | 任务用途                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `imageLimits`      | `ImageAttachmentLimits`                                                                                          | 公开部署环境的图片限制。                     |
| `validateImage`    | `(input: SaveImageAttachment) => Promise<void>`                                                                  | 批次开始写入前先解码并验证。                 |
| `saveImages`       | `(inputs: readonly SaveImageAttachment[]) => Promise<readonly ImageAttachmentRef[]>`                             | 验证有序批次；全部保存成功后再发布引用。     |
| `saveImage`        | `(input: SaveImageAttachment) => Promise<ImageAttachmentRef>`                                                    | 持久化一张规范化图片。                       |
| `readImage`        | `(ref: ImageAttachmentRef, signal?: AbortSignal) => Promise<StoredImageAttachment>`                              | 返回已验证的媒体；传递取消信号。             |
| `saveFile`         | `(input: SaveFileAttachment) => Promise<FileAttachmentRef>`                                                      | 支持文件的 provider 覆盖基类的默认拒绝行为。 |
| `saveFileStream`   | `(input: SaveFileStreamAttachment) => Promise<FileAttachmentRef>`                                                | 覆盖基类的默认拒绝行为，并施加有上限的背压。 |
| `readFileStream`   | `(ref: FileAttachmentRef, signal?: AbortSignal) => AsyncIterable<Uint8Array>`                                    | 覆盖基类的默认拒绝行为；迭代时验证数据块。   |
| `readImageRequest` | `(ref: ImageAttachmentRef, target: ImageRequestTarget, signal?: AbortSignal) => Promise<RequestImageAttachment>` | 需要模型请求投影时，覆盖基类的默认拒绝行为。 |

基类还提供 `admitPromptContent`、`admitEncodedFile`、`isAttachmentError`、`imageHostPath` 和 `fileHostPath`；Host 路径方法可能返回 `undefined`。provider 必须实现四个抽象成员（`imageLimits`、`validateImage`、`saveImage`、`readImage`），并覆盖其所宣称能力需要的默认拒绝方法。

**`AuthorizationService`**

- 入口： `export:@deepseek-ai/dsh-authorization:.`
- 签名： `AuthorizationService`
- 源码： `packages/credentials/authorization/src/index.ts`

| 成员     | 签名                                  | 任务用途                               |
| -------- | ------------------------------------- | -------------------------------------- |
| `cancel` | `(key: CredentialKey) => void`        | 中止此 credential key 正在进行的尝试。 |
| `list`   | `() => readonly AuthorizationEntry[]` | 读取当前已注册 flow 的元数据。         |

**`CredentialProvider`**

- 入口： `export:@deepseek-ai/dsh-credentials:.`
- 签名： `CredentialProvider`
- 源码： `packages/credentials/credentials/src/index.ts`

| 成员      | 签名                                                                          | 任务用途                             |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| `resolve` | `(ref: Branded<"CredentialRef">) => Promise<ResolvedCredential \| undefined>` | 查找密钥引用；undefined 表示不可用。 |
| `set`     | `(ref: Branded<"CredentialRef">, value: string) => Promise<void>`             | 将密钥值持久化到其引用背后。         |

**`FileSystem`**

- 入口： `export:@deepseek-ai/dsh-fs:.`
- 签名： `FileSystem`
- 源码： `packages/fs/fs/src/index.ts`

| 成员          | 签名                                                                                                                         | 任务用途                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `readBytes`   | `(target: FsTarget, signal: AbortSignal \| undefined, maxBytes: number) => Promise<Uint8Array<ArrayBufferLike>>`             | 要求调用方设置字节上限；无上限时拒绝，而非返回无限制读取。 |
| `resolve`     | `(path: string, opts?: { cwd?: string \| undefined; signal?: AbortSignal \| undefined; } \| undefined) => Promise<FsTarget>` | 将调用方路径解析为 provider 内稳定的 FsTarget 标识。       |
| `sandboxMode` | `SandboxMode \| undefined`                                                                                                   | 报告此 provider 的执行隔离模式（如有）。                   |
| `stat`        | `(target: FsTarget, signal?: AbortSignal \| undefined) => Promise<FsInfo \| undefined>`                                      | 读取元数据；undefined 表示目标不存在。                     |
| `watch`       | `(target: FsTarget, changed: (error?: Error \| undefined) => void, signal: AbortSignal) => Promise<() => Promise<void>>`     | 等待观察就绪；清理时等待返回的关闭函数。                   |

**`WebServer`**

- 入口： `export:@deepseek-ai/dsh-host-webserver:.`
- 签名： `WebServer`
- 源码： `packages/host/webserver/src/index.ts`

| 成员       | 签名                              | 任务用途                                                      |
| ---------- | --------------------------------- | ------------------------------------------------------------- |
| `host`     | `"127.0.0.1" \| "0.0.0.0"`        | 配置的 loopback 或全接口绑定地址。                            |
| `port`     | `number`                          | 实际绑定的端口；配置为零时包括 OS 分配的端口。                |
| `register` | `(route: WebRoute) => () => void` | 占用 exact/prefix 路由；kind 与 path 重复时抛错；清理时移除。 |

**`LspService`**

- 入口： `export:@deepseek-ai/dsh-lsp:.`
- 签名： `LspService`
- 源码： `packages/lsp/lsp/src/types.ts`

| 成员               | 签名                                                                          | 任务用途                                                     |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `registerProvider` | `(provider: LspProvider) => () => void`                                       | 占用 provider ID 与扩展名映射；保留清理函数。                |
| `query`            | `(request: LspQueryRequest, signal?: AbortSignal) => Promise<LspQueryResult>` | 按扩展名选择，并返回封闭的 `locations` 或 `hover` 联合类型。 |

`LspProvider` 包含 `id: LspProviderId`、`extensionToLanguage: Readonly<Record<string, string>>` 和 `query(request: LspProviderQuery, signal?: AbortSignal): Promise<LspQueryResult>`。能力接口调用 provider 前会补充映射后的 `languageId`。位置与范围均采用零基 UTF-16 编码。

**`McpResourceRuntime`**

- 入口： `export:@deepseek-ai/dsh-mcp-resources:.`
- 签名： `McpResourceRuntime`
- 源码： `packages/mcp/mcp-resources/src/index.ts`

| 成员       | 签名                                                            | 任务用途                                                             |
| ---------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `register` | `(server: string, provider: McpResourceProvider) => () => void` | 在调用方作用域内注册 server 并公开共享资源工具；连接清理时一起移除。 |

**`DshBundleManifest`**

- 入口： `export:@deepseek-ai/dsh-package-manifest:.`
- 签名： `DshBundleManifest`
- 源码： `packages/util/package-manifest/src/types.ts`

| 成员    | 签名                 | 任务用途                                                   |
| ------- | -------------------- | ---------------------------------------------------------- |
| `patch` | `string \| string[]` | 一个相对于包根目录的补丁文件，或按顺序应用的补丁文件列表。 |

**`DshClientManifest`**

- 入口： `export:@deepseek-ai/dsh-package-manifest:.`
- 签名： `DshClientManifest`
- 源码： `packages/util/package-manifest/src/types.ts`

| 成员       | 签名                    | 任务用途                                                         |
| ---------- | ----------------------- | ---------------------------------------------------------------- |
| `external` | `string[] \| undefined` | 精确列出额外的 Client 模块表请求，包括子路径；缺省时仅保留基线。 |
| `inject`   | `string[] \| undefined` | 用于说明的包名依赖；不是 Cordis 服务注入。                       |

**`DshManifest`**

- 入口： `export:@deepseek-ai/dsh-package-manifest:.`
- 签名： `DshManifest`
- 源码： `packages/util/package-manifest/src/types.ts`

| 成员              | 签名                             | 任务用途                                    |
| ----------------- | -------------------------------- | ------------------------------------------- |
| `bundle`          | `DshBundleManifest \| undefined` | 声明供 Profile 组合使用的可安装 bundle 层。 |
| `client`          | `DshClientManifest \| undefined` | 为所选平台/构建声明 Client 模块。           |
| `manifestVersion` | `1 \| undefined`                 | 可选的字面量 1；与包及 Session 版本无关。   |

**`DshPackageManifest`**

- 入口： `export:@deepseek-ai/dsh-package-manifest:.`
- 签名： `DshPackageManifest`
- 源码： `packages/util/package-manifest/src/types.ts`

| 成员           | 签名                                  | 任务用途                                   |
| -------------- | ------------------------------------- | ------------------------------------------ |
| `dependencies` | `Record<string, string> \| undefined` | 与此包一起安装的 npm 包。                  |
| `dsh`          | `DshManifest \| undefined`            | DSH bundle/Profile/Client 声明。           |
| `engines`      | `DshEnginesManifest \| undefined`     | 声明运行时兼容性；读取方决定是否强制检查。 |
| `name`         | `string`                              | 已发布 npm 包的标识。                      |
| `version`      | `string`                              | 已发布的包版本。                           |

**`DshProfileManifest`**

- 入口： `export:@deepseek-ai/dsh-package-manifest:.`
- 签名： `DshProfileManifest`
- 源码： `packages/util/package-manifest/src/types.ts`

`bundles?: string[]` 是 Profile manifest 中已安装 bundle 包名称的有序列表。安装或移除已声明的 bundle 时，`dsh plugin` CLI 会维护该列表。

**`PtcRuntime`**

- 入口： `export:@deepseek-ai/dsh-ptc-runtime:.`
- 签名： `PtcRuntime`
- 源码： `packages/ptc-runtime/ptc-runtime/src/index.ts`

| 成员          | 签名                                          | 任务用途                                  |
| ------------- | --------------------------------------------- | ----------------------------------------- |
| `isolation`   | `string`                                      | 由 provider 报告的执行隔离标识。          |
| `resolve`     | `(request: PtcRunRequest) => PtcRunSpec`      | 将公开请求转为 provider 私有的运行 spec。 |
| `run`         | `(spec: PtcRunSpec) => Promise<PtcRunResult>` | 执行已解析的 spec 并返回一个结果。        |
| `sandboxMode` | `SandboxMode \| undefined`                    | 支持时，报告 provider 默认 sandbox 模式。 |

**`SandboxPolicyService`**

- 入口： `export:@deepseek-ai/dsh-sandbox-policy:.`
- 签名： `SandboxPolicyService`
- 源码： `packages/sandbox/sandbox-policy/src/index.ts`

| 成员      | 签名                                                         | 任务用途                                     |
| --------- | ------------------------------------------------------------ | -------------------------------------------- |
| `resolve` | `(request?: SandboxPolicyRequest) => SandboxExecutionPolicy` | 解析逐请求 sandbox 模式与 workspace 根目录。 |

**`SandboxProvider`**

- 入口： `export:@deepseek-ai/dsh-sandbox:.`
- 签名： `SandboxProvider`
- 源码： `packages/sandbox/sandbox/src/index.ts`

`confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>` 必须返回已施加隔离的 argv，否则以拒绝执行的方式失败。调用方只启动返回的 argv。

**`ShellExecutor`**

- 入口： `export:@deepseek-ai/dsh-shell:.`
- 签名： `ShellExecutor`
- 源码： `packages/shell/shell/src/index.ts`

| 成员          | 签名                                               | 任务用途                                             |
| ------------- | -------------------------------------------------- | ---------------------------------------------------- |
| `execute`     | `(spec: ShellExecSpec) => Promise<ShellExecution>` | 准备并启动已解析的 spec；可能在发布 handle 前拒绝。  |
| `resolve`     | `(request: ShellExecRequest) => ShellExecSpec`     | 执行前应用 provider 默认值和上限。                   |
| `sandboxMode` | `SandboxMode \| undefined`                         | executor 的默认模式；未使用 sandbox 时为 undefined。 |

**`SpillStore`**

- 入口： `export:@deepseek-ai/dsh-spill:.`
- 签名： `SpillStore`
- 源码： `packages/spill/spill/src/index.ts`

| 成员       | 签名                                          | 任务用途                                                                |
| ---------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| `saveText` | `(input: SaveTextSpill) => Promise<SpillRef>` | 先持久化全文，再返回限定于 Session 的定位符及检索提示；存储失败时拒绝。 |

`SpillStore` 不提供检索方法。后端路径保持私有。

**`Domain`**

- 入口： `export:@deepseek-ai/dsh-storage-domain:.`
- 签名： `Domain<S>`
- 源码： `packages/storage/storage-domain/src/domain.ts`

| 成员    | 签名                                                                                               | 任务用途                                                      |
| ------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `close` | `() => Promise<void>`                                                                              | 拒绝新写入，等待排队写入完成，释放 backend unit；可重复调用。 |
| `name`  | `string`                                                                                           | 来自其 spec 的 Domain 标识。                                  |
| `table` | `<N extends keyof S["tables"] & string>(name: N) => KvTable<TableKeyOf<S, N>, TableValueOf<S, N>>` | 返回一个已声明表的稳定类型化 handle。                         |

**`Storage`**

- 入口： `export:@deepseek-ai/dsh-storage:.`
- 签名： `Storage`
- 源码： `packages/storage/storage/src/index.ts`

| 成员     | 签名                                                                               | 任务用途                                                                            |
| -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `domain` | `StorageForms extends { domain: infer D } ? D : never`                             | 声明合并提供 `DomainFacility`；在 domain form 挂载前读取会抛出 `form-not-mounted`。 |
| `form`   | `<K extends keyof StorageForms>(form: K) => StorageForms[K]`                       | 返回已挂载的命名 form，否则抛出 form-not-mounted。                                  |
| `mount`  | `<K extends keyof StorageForms>(form: K, facility: StorageForms[K]) => () => void` | 占用一个命名 form，并返回归 effect 管理的卸载清理函数。                             |

**`SubprocessRuntime`**

- 入口： `export:@deepseek-ai/dsh-subprocess:.`
- 签名： `SubprocessRuntime`
- 源码： `packages/subprocess/subprocess/src/index.ts`

| 成员                  | 签名                                                                                                 | 任务用途                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `resolveExecutable`   | `(command: string, env?: Readonly<Record<string, string>>, signal?: AbortSignal) => Promise<string>` | 在 provider 的执行环境中验证路径。                            |
| `terminalEnvironment` | `(signal?: AbortSignal) => Promise<SubprocessTerminalEnvironment>`                                   | 分配终端前检查平台和首选 shell。                              |
| `spawn`               | `(spec: SubprocessSpawnSpec) => SubprocessHandle`                                                    | 同步发布受管进程 handle；无效或已中止的 spec 可在此之前抛错。 |
| `spawnTerminal`       | `(spec: SubprocessTerminalSpawnSpec) => Promise<SubprocessTerminalHandle>`                           | 分配终端 Session 并返回其受管 handle。                        |

已发布的 `SubprocessHandle` 提供 `done`、`terminate()` 和 `waitForExit(signal?)`。`SubprocessTerminalHandle` 提供 `done`、终端 I/O、检查方法，以及用于整个 Session 静止的 `terminate(): Promise<void>`。编写清理代码前参见[进程 handle](#backend-存储与进程-handle)。

**`TypertRemoteService`**

- 入口： `export:@deepseek-ai/dsh-typert-protocol:.`
- 签名： `TypertRemoteService<T>`
- 源码： `packages/typert/protocol/src/index.ts`

Host 类将 Cordis 服务键绑定到 wire 命名空间；仅通过生成的 Typert 产物公开 `@Remote` 方法。Host/Client 构建路径见 [Remote 组合](how-to-infra-runtime.md#组合-preset-与-host-到-client-的-remote)。

**`WebhookRuntime`**

- 入口： `export:@deepseek-ai/dsh-webhook:.`
- 签名： `WebhookRuntime`
- 源码： `packages/webhook/webhook/src/index.ts`

| 成员       | 签名                                                               | 任务用途                                                       |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| `dispatch` | `<K extends string>(delivery: VerifiedWebhookDelivery<K>) => void` | 验证可信 delivery 并建立快照，启动匹配回调，在回调完成前返回。 |
| `register` | `<K extends string>(rule: WebhookRule<K>) => () => Promise<void>`  | 注册唯一规则，并返回能中止、等待活动回调完成的异步清理函数。   |

## 直接成员发现未涵盖的成员与任务边界

- `DshClientManifest.platform: string` 是必需字段；Web loader 选择 `"web"`。`immediately?: boolean` 选择第一阶段注册屏障。这些字段声明于 `packages/util/package-manifest/src/types.ts`，实际 Client 模块任务需要它们。
- `Storage.domain` 在运行时**不是**不可用的 `never`：`@deepseek-ai/dsh-storage-domain` 将 `domain: DomainFacility` 合并到 `StorageForms`，且必须挂载其插件。在挂载前，`Storage.form('domain')` 会抛出 `StorageError('form-not-mounted', ...)`。domain 调用方负责管理 `Domain<S>` handle 并等待 `close()`。
- `BrowserUseRegistry` 和 `ComputerUseRegistry` 是实验性选择任务的公开对象。二者分别声明 `providerName: BrowserUseProviderName | undefined` 或 `ComputerUseProviderName | undefined`，`register(name)` 返回 `() => Promise<void>`。即使名称相同，也会拒绝第二个 provider。其源码分别为 `packages/browser-use/browser-use/src/index.ts` 和 `packages/computer-use/computer-use/src/index.ts`。它们不提供浏览器/桌面操作方法。
- `WebServer.register(route: WebRoute): () => void` 接受 `kind: 'exact' | 'prefix'`、没有尾部斜线的绝对 `path`，以及负责响应的 handler。`WebhookRuntime.register<K extends string>(rule: WebhookRule<K>): () => Promise<void>` 与 `dispatch<K extends string>(delivery: VerifiedWebhookDelivery<K>): void` 不同；dispatch 不等待匹配回调。源码分别见 `packages/host/webserver/src/index.ts` 和 `packages/webhook/webhook/src/index.ts`。
- `AgentPresetRegistry.register(definition: PresetDefinition): Promise<() => Promise<void>>` 注册完整定义，并在启用或诊断完成后返回其所有者清理函数。`list(): Promise<AgentPreset[]>` 包含 broken 定义。在 Profile 中使用 `@deepseek-ai/dsh-agent-preset` 条目提交定义；`register` 不会扫描目录。

上表是精选的直接声明，并非继承的 Service 方法、provider 接口或嵌套请求/结果分支的完整说明。provider 实现必须阅读其目标声明并运行契约测试，才可视为完整。

## 基础设施 provider 调用结构

以下精选签名提供任务使用的成员契约；provider 实现者还必须满足所引公开声明中的每个抽象方法。在目标 checkout 中，引用的 `packages/.../src` 路径用于定位源码；在独立消费项目中，应检查已安装契约包的 `exports.types` 所指向的 `node_modules/@deepseek-ai/<package>/lib/types/` 声明。此列表有意窄于完整的包 API。

- `AttachmentStore`（`packages/attachment/attachment/src/index.ts`）：`saveImages(inputs: readonly SaveImageAttachment[]): Promise<readonly ImageAttachmentRef[]>`；`saveImage(input: SaveImageAttachment): Promise<ImageAttachmentRef>`；`readImage(ref: ImageAttachmentRef, signal?: AbortSignal): Promise<StoredImageAttachment>`。发布引用前验证全部输入；provider 负责持久媒体及读取时的完整性。
- `AuthorizationService`（`packages/credentials/authorization/src/index.ts`）：`registerFlow(flow: AuthorizationFlow): () => void`；`begin(request: AuthorizationRequest): Promise<AuthorizationOutcome>`；`cancel(key: CredentialKey): void`。flow 归 effect 管理；`begin` 可能拒绝或失败，取消必须传达到进行中的 interaction。
- `CredentialProvider`（`packages/credentials/credentials/src/index.ts`）：`resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined>`；`set(ref: CredentialRef, value: string): Promise<void>`；`unset(ref: CredentialRef): Promise<void>`。完整 provider 还需实现 `describe`、记录读取/列举/修改/删除；设置中存储 `CredentialRef`，而不是解析后的值。
- `FileSystem`（`packages/fs/fs/src/index.ts`）：`resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget>`；`readBytes(target: FsTarget, signal: AbortSignal | undefined, maxBytes: number): Promise<Uint8Array>`；`watch(target: FsTarget, changed: (error?: Error) => void, signal: AbortSignal): Promise<() => Promise<void>>`。观察就绪后 `watch` 才完成；返回的关闭函数可等待。
- `LspService`（`packages/lsp/lsp/src/types.ts`）：`registerProvider(provider: LspProvider): () => void`；`query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>`。操作属于封闭联合类型 `goToDefinition | findReferences | goToImplementation | hover`；位置使用零基 UTF-16 范围。`LspError` 涵盖重复注册与无法选择 provider。
- `McpResourceRuntime`（`packages/mcp/mcp-resources/src/index.ts`）：`register(server: string, provider: McpResourceProvider): () => void`。provider 实现 `request(request: McpResourceRequest, exec: ToolExecution): Promise<JsonValue>`；请求联合类型包含 `resources/list`、`resources/templates/list` 和 `resources/read`。注册限定于调用方作用域，并随其 effect 移除。
- `PtcRuntime`（`packages/ptc-runtime/ptc-runtime/src/index.ts`）：`resolve(request: PtcRunRequest): PtcRunSpec`；`run(spec: PtcRunSpec): Promise<PtcRunResult>`。spec 是 provider 私有对象；调用方将同一 provider 的 `resolve` 返回值传给 `run`。
- `SandboxPolicyService`（`packages/sandbox/sandbox-policy/src/index.ts`）：`resolve(request: SandboxPolicyRequest = {}): SandboxExecutionPolicy`。`SandboxProvider`（`packages/sandbox/sandbox/src/index.ts`）：`confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>`。`confine` 返回可强制隔离的 argv 或拒绝；调用方只运行返回的 argv，隔离失败后绝不运行原始值。
- `ShellExecutor`（`packages/shell/shell/src/index.ts`）：`resolve(request: ShellExecRequest): ShellExecSpec`；`execute(spec: ShellExecSpec): Promise<ShellExecution>`。前者应用 provider 默认值和上限；后者可能在发布 handle 前拒绝，之后的 handle/结果清理由所选 provider 负责。
- `SpillStore`（`packages/spill/spill/src/index.ts`）：`saveText(input: SaveTextSpill): Promise<SpillRef>`。定位符是持久的公开结果；后端路径保持私有。
- `Storage`（`packages/storage/storage/src/index.ts`）：`mount<K extends keyof StorageForms>(form: K, facility: StorageForms[K]): () => void`；`form<K extends keyof StorageForms>(form: K): StorageForms[K]`。domain 包将 `domain: DomainFacility` 合并到 `StorageForms`。`DomainFacility.open<S extends DomainSpec>(spec: S): Promise<Domain<S>>`（`packages/storage/storage-domain/src/index.ts`）返回由调用方管理的 handle；`Domain<S>.close(): Promise<void>`（`src/domain.ts`）等待排队写入完成。
- `SubprocessRuntime`（`packages/subprocess/subprocess/src/index.ts`）：`resolveExecutable(command: string, env?: Readonly<Record<string, string>>, signal?: AbortSignal): Promise<string>`；`spawn(spec: SubprocessSpawnSpec): SubprocessHandle`；`spawnTerminal(spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle>`。`spawn` 可能在发布前同步失败；已发布 handle 负责退出观察和终止。

### Attachment 持久化与 credential 记录

`AttachmentStore` 还公开 `saveFile(input: SaveFileAttachment): Promise<FileAttachmentRef>`、`saveFileStream(input: SaveFileStreamAttachment): Promise<FileAttachmentRef>` 和 `readFileStream(ref: FileAttachmentRef, signal?: AbortSignal): AsyncIterable<Uint8Array>`。基类对这些方法返回 `ATTACHMENT_FILES_UNSUPPORTED`；支持文件的 provider 需覆盖它们。流式写入施加背压而不缓存整个文件；流式读取在观察取消的同时验证完整性。`saveImages` 在保存单张图片前验证完整批次；失败时不发布部分引用列表。源码：`packages/attachment/attachment/src/index.ts:145-228`。

完整的 `CredentialProvider` 抽象契约还包括 `resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined>`、`set(ref: CredentialRef, value: string): Promise<void>`、`describe(ref: CredentialRef): Promise<CredentialInfo>`、`readRecord(key: CredentialKey): Promise<CredentialRecord | undefined>`、`describeRecord(key: CredentialKey): Promise<CredentialRecordInfo>`、`listRecords(): Promise<readonly CredentialRecordEntry[]>`、`modifyRecord(key: CredentialKey, mutate: (current: CredentialRecord | undefined) => Promise<CredentialRecord | undefined>): Promise<CredentialRecord | undefined>` 和 `deleteRecord(key: CredentialKey): Promise<void>`。`resolve` 查找引用，`set` 写入引用值，`unset(ref: CredentialRef): Promise<void>` 移除引用值。`modifyRecord` 将读取、修改和写入串行化；修改函数返回 `undefined` 时保持条目不变。记录描述和列表省略密钥值。provider 仅在提交后发出更新通知。源码：`packages/credentials/credentials/src/index.ts:170-282`。

`AuthorizationFlow` 为 `{ key: CredentialKey; label: string; methods: readonly [AuthorizationMethod, ...AuthorizationMethod[]]; run(session: AuthorizationSession): Promise<void> }`。session 提供 `method`、`signal`、`commit(record: CredentialRecord): Promise<void>`、`notify(notice: AuthorizationNotice): void` 和 `prompt(prompt: AuthorizationPrompt): Promise<string>`。`AuthorizationRequest` 提供 `key`、可选的 `method` 和 `signal`，以及含 `notify` 与 `prompt` 的 `interaction: AuthorizationInteraction`；`begin` 使用所提供的 interaction。持久化后 `commit` 才完成。人工拒绝会抛出 `AuthorizationDeclinedError` 并以已取消状态结束；通过单个 prompt 自身信号撤回该 prompt 是不同的分支。源码：`packages/credentials/authorization/src/index.ts:73-180` 和 `src/types.ts:11-76`。

### Backend 存储与进程 handle

`ctx.storage.backend.register(name: string, backend: StorageBackend): () => void` 占用 backend 名称。provider 另通过 `ctx.provide(storageBackendServiceKey(name), backend)` 提供生命周期依赖。注销名称**不会**关闭 backend；停止接收新工作后，provider 应等待 `backend.close(): Promise<void>`。`StorageBackend.kv?: KvFacet` 提供 `open(descriptor: KvUnitDescriptor): Promise<KvUnit>`。descriptor 包含 `name`、`version`、`tables`、`hasGlobal`，以及可选的 `layout` 和 `compatibleVersions`。unit 提供 `loadAll()`、`putRecord(table, key, value)`、`deleteRecord(table, key)`、可选的 `backupRecord(table, key): Promise<string>`、`setGlobal(value)` 和 `close()`。每次已完成的写入都是原子且持久的；调用方负责串行化并发写入。`close()` 等待写入完成；之后的调用会被拒绝。只有 backend 实现了 `backupRecord`，Domain 才能使用 `backup-and-skip` 策略。源码：`packages/storage/storage/src/registry.ts:14-63`、`src/backend.ts:17-145` 和 `src/index.ts:20-80`。

`spawn(spec)` 发布 `SubprocessHandle` 后，其 `done: Promise<SubprocessOutcome>` 返回命令退出事实，启动或 provider 故障时则拒绝。对 provider 管理的进程范围，`terminate(): void` 可重复调用；`waitForExit(signal?: AbortSignal): Promise<boolean>` 等待同一范围，等待信号中止时返回 `false`，失去观察能力时抛错。仅有 `done` 不能证明该范围内的子孙进程已退出。管道 `stdin`/`stdout`/`stderr` 和可选的 `control` stream 归调用方管理。collect 模式中，`collected.stdout?` 和 `.stderr?` 是带 `readFrom(fromByte): SubprocessOutputRead` 的 `SubprocessOutputReader` handle；其 `text`、`nextOffset`、`lossy` 和可选的 `spillPath` 允许不同读取方在退出后仍维护各自的字节偏移。源码：`packages/subprocess/subprocess/src/index.ts:101-163` 和 `src/types.ts:124-196`。

`ShellExecution` 扩展 `ShellProcess`。调用 `result(): Promise<ShellRunResult>` 获取可复用的前台投影；非零退出、超时和中止会作为结果事实返回，而启动时始终未产生进程等基础设施失败会拒绝。对于后台工作，`done: Promise<void>` 从不拒绝，`status`/`exitCode`/`signal` 暴露结束状态，`readOutput(): ShellProcessRead` 推进消费式游标，`observed: ShellObservedStreams` 提供独立、不消费的偏移读取器，`kill(): boolean` 请求终止受管范围。捕获的输出在退出后仍可读取。源码：`packages/shell/shell/src/index.ts:70-96` 和 `src/types.ts:168-240`。

### PTC binding 与隔离证据

`PtcRunRequest` 提供 `program`、`bindings: PtcBindingNamespace[]`，以及可选的 `cwd`、`timeoutMs`、`sandboxPolicy` 和 `signal`。每个 binding 命名空间提供 `global`、`functions: Record<string, (args: unknown) => Promise<PtcJsonValue>>` 和可选的 `errorClass`；返回值必须是 JSON。`PtcRunResult` 有可选的 `value`、必需的 `logs`、可选的 `sandbox` 和可选的 `error: PtcRunFailure`。程序异常、超时、中止、worker 退出、无效输出、输出超限、协议错误和 sandbox 不可用，是已解析结果中不同的失败类型，而不是普通的 promise 拒绝。源码：`packages/ptc-runtime/ptc-runtime/src/types.ts:20-170`。

`ConfinedArgv` 返回 `{ argv: string[]; enforcement: 'full' | 'partial'; denialSignatures: readonly string[]; runnerFailureRules: readonly RunnerFailureRule[] }`。规则包含可选的 `allowedExitCodes`、必需的 `fatalSignatures` 和可选的 `informationalLines`。这些诊断由所选 runner 提供：应先分类 runner 失败，再将匹配输出视为策略拒绝。仅请求 sandbox 模式不能证明隔离已生效；`confine` 失败后不得回退到原始 argv。源码：`packages/sandbox/sandbox/src/index.ts:70-129`。

## 任务所需的结构类型

这些公开结构是所列方法的输入或结果。即使消费方不将其作为运行时值导入，它们仍属于可调用契约。

- `PresetDefinition`（`packages/preset/agent-preset-registry/src/definition.ts`）：必需的 `id: string` 和 `plugins: readonly EntryOptions[]`（包含已声明的可选 `id` 与 `disabled` 表达式变体）；可选的 `name`、`description`、`order`。`@deepseek-ai/dsh-agent-preset` 条目将其作为 `Config` 接受，`AgentPresetRegistry.register` 也可直接接受。嵌套 group 格式错误会验证失败；`list()` 暴露 broken 启用诊断。
- `DomainSpec`（`packages/storage/storage-domain/src/spec.ts`）：必需的 `name`、非负 `version` 和 `tables`；可选的 `layout`、`compatibleVersions`、`invalidRecords` 和 `global`。`defineDomain<S extends DomainSpec>(spec: S): S` 验证声明；`domainTable<K,V>(schema)` 声明带类型的表。`DomainFacility.open<S extends DomainSpec>(spec: S): Promise<Domain<S>>` 是唯一的打开操作。`Domain<S>.table(name)` 返回 `KvTable<K,V>`，提供同步 `get`/快照迭代器和持久化异步 `put`、`delete`、`update`；`close()` 需要等待完成。`open` 成功前必须存在 backend 路由及 `kv` facet。
- `WebRoute`（`packages/host/webserver/src/index.ts`）：`{ kind: 'exact' | 'prefix'; path: string; handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }`。`path` 是无尾部斜线的绝对路径；handler 负责完整响应。`WebServer.register` 拒绝重复的 `(kind, path)` 并返回同步清理函数。
- `WebhookRule<K>`（`packages/webhook/webhook/src/types.ts`）：必需且唯一的 `id: WebhookRuleId`、`kind: K` 和 `run(delivery: Readonly<VerifiedWebhookDelivery<K>>, signal: AbortSignal): WebhookSessionRequest | null | Promise<...>`。`VerifiedWebhookDelivery` 包含 `kind`、`source`、`deliveryId`、规范化 JSON `event` 和以 epoch 毫秒表示的 `receivedAt`。`WebhookSessionRequest` 要求 `workspacePath`、`title`、非空 `prompt`、`agentPreset` 和 `permissionPreset`；可选的 `model` 选择路由。调用 `dispatch` 前由 adapter 负责认证；runtime 只对已可信的 delivery 建立快照并验证，然后启动匹配规则。
- `DshClientManifest.platform` 是必需字段，`DshProfileManifest.bundles` 是有序 Profile 列表（`packages/util/package-manifest/src/types.ts`）。二者分别是 Client loader 和 Profile composer 使用的声明字段。仅因代码没有直接_调用_它们就判定无用，会误判公开配置契约。

## Cordis 生命周期公开 API

公开 Cordis 包从 `vendor/cordis/src/index.ts` 重新导出 `Context`、`Service`、`Plugin`、`Inject`、`Fiber`、`FiberState`、`Effect` 和 `Disposable`。Loader 与 Include 包分别从 `vendor/loader/src/config/entry.ts` 和 `vendor/include/src/index.ts` 发布组合结构。这些是 Host 插件通用的编写契约，与具体 DSH 能力服务无关。

`@deepseek-ai/schemastery` 发布插件导出的 `Config` 所用的默认 `Schema` 构造器。`Schema.object({ field: Schema.string().default(value) })` 在 `apply` 前提供验证与默认值；`.volatile()` 标记需通过 `Volatile<T>.get()` 读取实时值的字段。所选包示例使用 `object`、`string`、`default` 和 `volatile`；构造器的其他元数据与展示方法是可选项，不能证明发生了启用 effect。名为 `Config` 的普通对象不是 Standard Schema。

| 作者使用路径 | 目标声明与 effect                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 函数插件     | `Plugin.Function<T>` 是 `(ctx: Context, config: T) => any`，可带 `name`、`Config`、`inject` 和 `provide` 元数据。                                                                                                                                             |
| 对象插件     | `Plugin.Object<T>` 有 `apply(ctx: Context, config: T): any` 及相同的可选元数据。类插件通过 `new (ctx: Context, config: T)` 构造。                                                                                                                             |
| 依赖声明     | `Inject<M> = (keyof M)[] \| { [K in keyof M]?: M[K] }`。`ctx.inject(deps: Inject, callback: Plugin.Function<void>): Fiber & PromiseLike<Fiber>` 在所有必需服务存在时启动回调，服务变化时卸载或重启。                                                          |
| 子插件挂载   | `ctx.plugin<P extends Plugin>(plugin: P, ...args): Fiber & PromiseLike<Fiber>` 在当前 fiber 下启动一个子插件。等待它完成启动；配置验证或启动失败时会拒绝。父级负责清理子插件。                                                                                |
| 自有资源     | `ctx.effect(execute: () => SyncEffect, label?: string)` 及其异步 effect 重载返回清理函数；`Effect` 接受一个清理函数、清理函数的 promise，或清理函数的同步/异步可迭代对象。effect 主体立即执行。该 effect 的清理函数按注册顺序的逆序运行，卸载时会等待其完成。 |
| 服务实现     | `new Service(ctx: Context, name: string)` 通过 `ctx.reflect.provide` 在该 context 注册实例。子类调用 `super(ctx, 'serviceKey')`；所属 fiber 卸载时移除服务。通过声明合并扩展 Cordis `Context`，为 `ctx.serviceKey` 提供类型。                                 |
| 可变配置     | `Volatile<T>` 标记实时配置值；消费方通过 `get()` 读取当前值，而非保留较早的快照。使用所属 Config schema 的 `.volatile()` 声明。                                                                                                                               |
| Fiber 观察   | `fiber.state: FiberState`（`PENDING`、`LOADING`、`ACTIVE`、`FAILED`、`UNLOADING`、`DISPOSED`）和 `fiber.dispose(): Promise<void>`。`PENDING` 表示缺少注入，稍后仍可启用；`FAILED` 记录配置或启动失败。`dispose()` 在清理后完成。                              |
| Loader 条目  | `EntryOptions` 要求 `id: string`、`name: string`，可选 `config`、`group`、`disabled`、`inject`。条目稳定的 `id` 允许 Loader 对同一条目打补丁或重载。                                                                                                          |
| Include 补丁 | `PatchOptions` 有可选的 `insert?: EntryOptions[]` 用于添加条目，或通过 `id` 修改现有条目。顶层裸 `EntryOptions` 不会插入：`applyEntryPatches` 会警告 `patch: id is required for non-insert patches` 或 `entry not found`。                                    |

`Config` 是 Standard Schema 值，不是普通对象；Cordis 在插件启用前验证，出错时抛出 `ValidationError`。在已清理或正在卸载的 fiber 上调用 `ctx.effect` 会抛出 `CordisError('INACTIVE_EFFECT')`。应检查 `fiber.state` 或等待 fiber，不能因缺少插件日志就判定成功。

`fiber.await(): Promise<Fiber>` 等待当前生命周期操作稳定，并重新抛出配置验证或插件启动错误。`fiber.config` 是已验证配置，`fiber.ctx` 是该插件运行的 context，`fiber.parent` 是父 context，`fiber.inject` 是依赖注入映射，`fiber.name` 是展示名称。`fiber.effect(...)` 将资源绑定到该 fiber，并在 `fiber.dispose()` 时清理；`fiber.state` 用于观察生命周期状态。
