# Client/Web 任务 API

本页锁定 `dsh-v0.2.0-rc.2` 的任务所需公开对象和直接成员；运行语义、生命周期与失败边界见 [对应 guardrail](api-client-web.md)。本页只列出这些插件任务直接使用的公开成员。

## Client/Web 任务所需公开对象

**`TypertGatewayService`**

- 入口：`export:@deepseek-ai/dsh-api-gateway:.`
- 签名：`TypertGatewayService`
- 源码：`packages/api/gateway/src/index.ts`

| 成员     | 签名                                                                | 任务用途                                  |
| -------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `stream` | `(request: InvokeRemoteRequest) => Promise<AsyncIterable<unknown>>` | 通过 Gateway 分发一条逻辑 Remote stream。 |

**`ClientRemote`**

- 入口： `export:@deepseek-ai/dsh-api-gateway:./client`
- 签名： `ClientRemote`
- 源码： `packages/api/gateway/src/client/index.ts`

| 成员    | 签名              | 任务用途                                                    |
| ------- | ----------------- | ----------------------------------------------------------- |
| `$host` | `RemoteHostFacts` | 读取 Host home 和 loopback 信息；ready 前 home 可能不存在。 |

**`SettingsForms`**

- 入口： `export:@deepseek-ai/dsh-settings:.`
- 签名： `SettingsForms`
- 源码： `packages/settings/settings/src/index.ts`

| 成员       | 签名                                                                                                    | 任务用途                                        |
| ---------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `mutate`   | `(ns: string, ops: readonly SettingsPathOp[], expectedRevision?: number \| undefined) => Promise<void>` | 在可选 revision 栅栏下原子提交 namespace 操作。 |
| `writable` | `boolean`                                                                                               | 指示此 Host settings store 是否接受写入。       |

**`ConfigForms`**

- 入口： `export:@deepseek-ai/dsh-client-ui-settings:./client`
- 签名： `ConfigForms`
- 源码： `packages/client/ui-settings/src/client/config-form.ts`

| 成员          | 签名                                                                                                   | 任务用途                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `get`         | `<T>(entryId: string) => ConfigForm<T>`                                                                | 返回指定 Loader entry id 的共享表单。                            |
| `whileServed` | `(namespaces: readonly string[], register: (served: ReadonlySet<string>) => () => void) => () => void` | 仅在 Host 提供被监听 namespace 时保留注册；调用方持有 disposer。 |

**`SlotMap`**

- 入口： `export:@deepseek-ai/dsh-client-ui-slots:.`
- 签名： `SlotMap`
- 源码： `packages/client/ui-slots/src/index.ts`

此声明提供 owner 类型增强和 `PropsRuntime` 使用的类型化 key 表；它没有直接声明的方法。

**`SlotCore`**

- 入口： `export:@deepseek-ai/dsh-client-ui-slots:.`
- 签名： `SlotCore`
- 源码： `packages/client/ui-slots/src/index.ts`

| 成员        | 签名                                                                              | 任务用途                                                                    |
| ----------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `factory`   | `(name: string) => StoredFactory \| undefined`                                    | 查找已注册的可复用 Component Factory。                                      |
| `register`  | 下方两个类型化重载；`(options, component) => () => void`                          | 注册 entry 并返回幂等 disposer；通过 `ctx.slots` facade 绑定 fiber 所有权。 |
| `snapshot`  | `(root?: string \| undefined) => LiveCompositionNode[]`                           | 读取当前组合树用于诊断。                                                    |
| `spec`      | `<K extends keyof SlotMap & string>(key: K) => SlotSpec<SlotMap[K]> \| undefined` | 读取 slot key 当前生效的声明。                                              |
| `subscribe` | `(key: string, fn: () => void) => () => void`                                     | 监听指定 key 的注册变化；调用方负责取消订阅。                               |

`SlotCore.register` 有不带和带注册 `inject` 接口的两个重载。`SlotRegistry.register` 声明为 `SlotCore['register']`，因此通过 `ctx.slots` 调用时也适用相同的类型推断。完整签名如下：

```text
register<
  K extends keyof SlotMap & string,
  const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
  const D extends ChildrenDecl = Record<never, never>,
  H extends StoreDecl | undefined = undefined,
  M = never,
  N extends (keyof LocaleNamespaceMap & string) | undefined = undefined,
  C extends SlotComponent<never> = SlotComponent<never>,
>(
  options: BaseOptions<K, EntryKey, D, H, M, N> & { inject?: undefined },
  component: C & SlotComponent<ComposedProps<
    K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string,
    HandleOf<NoInfer<H>>, object, NoInfer<M>, NoInfer<N>
  >> & RendersCheck<C, D>,
): () => void

register<
  K extends keyof SlotMap & string,
  I extends object,
  const EntryKey extends EntryKeyOf<K> = EntryKeyOf<K>,
  const D extends ChildrenDecl = Record<never, never>,
  H extends StoreDecl | undefined = undefined,
  M = never,
  N extends (keyof LocaleNamespaceMap & string) | undefined = undefined,
  C extends SlotComponent<never> = SlotComponent<never>,
>(
  options: BaseOptions<K, EntryKey, D, H, M, N> & { inject: (...args: InjectParams<K, H>) => I },
  component: C & SlotComponent<ComposedProps<
    K, NoInfer<EntryKey>, keyof NoInfer<D> & keyof SlotMap & string,
    HandleOf<NoInfer<H>>, I, NoInfer<M>, NoInfer<N>
  >> & RendersCheck<C, D>,
): () => void
```

`kindOptions` 按目标 `SlotMap` key 校验：list 使用 `id`，keyed 使用 `key`，chain 使用 `select`。`inject` 只向 Component 返回数据和回调；返回的函数用于撤销 contribution。相关类型声明位于 `packages/client/ui-slots/src/index.ts:1144-1202`；不要用类型断言或 `any` 签名绕过这些检查。

**`SlotRegistry`**

- 入口： `export:@deepseek-ai/dsh-client-ui-renderer:./client`
- 签名： `SlotRegistry`，其中 `register: SlotCore['register']`
- 源码： `packages/client/ui-renderer/src/client/registry.ts:164-181,209-270`

| 成员       | 签名                                                                               | 任务用途                                                                    |
| ---------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `register` | `SlotCore['register']`                                                             | 通过调用方 Cordis fiber 注册；见上方两个重载。                              |
| `inject`   | `(key: keyof SlotMap & string, callback: () => SlotInjectionEffect) => () => void` | 等待 slot 声明，并在 owner 替换时重新运行 effect；调用方持有幂等 disposer。 |

**`WebRuntime`**

- 入口： `export:@deepseek-ai/dsh-web:.`
- 签名： `WebRuntime`
- 源码： `packages/web/web/src/index.ts`

| 成员     | 签名                                                                                         | 任务用途                                                          |
| -------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `fetch`  | `(request: WebFetchRequest, signal?: AbortSignal \| undefined) => Promise<WebFetchResult>`   | 调用时选择可用的 fetch provider；非 2xx 仍作为结果返回。          |
| `search` | `(request: WebSearchRequest, signal?: AbortSignal \| undefined) => Promise<WebSearchResult>` | 选择可用的 search provider，并按 `maxResults` 限制 sources 数量。 |

Provider 作者还可调用 `registerFetchProvider(provider: WebFetchProvider): () => void` 或 `registerSearchProvider(provider: WebSearchProvider): () => void`；见 `packages/web/web/src/index.ts:103-115`。这些方法绑定调用方 fiber，并拒绝同类能力中重复的 id。

**`WebFetchProvider`**

- 入口： `export:@deepseek-ai/dsh-web:.`
- 签名： `WebFetchProvider`
- 源码： `packages/web/web/src/types.ts`

| 成员    | 签名                                                                                       | 任务用途                              |
| ------- | ------------------------------------------------------------------------------------------ | ------------------------------------- |
| `fetch` | `(request: WebFetchRequest, signal?: AbortSignal \| undefined) => Promise<WebFetchResult>` | 获取 URL 内容并转发取消信号。         |
| `id`    | `string`                                                                                   | fetch provider registry 内的唯一 id。 |

必须实现 `available(): boolean`，且该方法应是低开销的本地检查；它属于 `packages/web/web/src/types.ts` 的公开声明。

**`WebSearchProvider`**

- 入口： `export:@deepseek-ai/dsh-web:.`
- 签名： `WebSearchProvider`
- 源码： `packages/web/web/src/types.ts`

| 成员     | 签名                                                                                         | 任务用途                               |
| -------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| `id`     | `string`                                                                                     | search provider registry 内的唯一 id。 |
| `search` | `(request: WebSearchRequest, signal?: AbortSignal \| undefined) => Promise<WebSearchResult>` | 执行一次查询并转发取消信号。           |

必须实现 `available(): boolean`，且该方法应是低开销的本地检查；它属于 `packages/web/web/src/types.ts` 的公开声明。

**`OfficeToPdf`**

- 入口： `export:@deepseek-ai/dsh-office-to-pdf:.`
- 签名： `OfficeToPdf`
- 源码： `packages/document/office-to-pdf/src/index.ts`

| 成员     | 签名                                                                                                                                           | 任务用途                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `render` | `(workspaceFileScope: WorkspaceFileScope, path: string, priority: OfficeToPdfPriority, signal: AbortSignal) => Promise<RenderedDocumentBytes>` | 读取已授权的 Workspace 文件并返回完整 PDF 字节。 |

**`OfficeToPdfResult`**

- 入口： `export:@deepseek-ai/dsh-office-to-pdf:.`
- 签名： `OfficeToPdfResult`
- 源码： `packages/document/office-to-pdf/src/types.ts`

此结果是数据类型，不是可调用的扩展点；转换方法位于 `OfficeToPdf`。

**`DynamicCordisPackageRunner`**

- 入口： `export:@deepseek-ai/dsh-cordis-client-runner:./client`
- 签名： `DynamicCordisPackageRunner`
- 源码： `packages/extensions/cordis-client-runner/src/client/runtime.ts`

| 成员          | 签名                                                                  | 任务用途                                             |
| ------------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| `dispose`     | `() => Promise<void>`                                                 | 卸载正在运行的浏览器包并等待清理完成。               |
| `getSnapshot` | `() => readonly DynamicCordisLivePackage[]`                           | 读取此页面的运行中包集合；值在发生变更前保持稳定。   |
| `load`        | `(half: DynamicCordisClientHalf) => Promise<DynamicCordisLoadResult>` | 装载指定 run；成功结果也可能仍在等待注入的 service。 |
| `subscribe`   | `(fn: () => void) => () => void`                                      | 监听运行集和渲染失败变化；调用方负责取消订阅。       |

**`TerminalController`**

- 入口： `export:@deepseek-ai/dsh-api-terminal-controller:.`
- 签名： `TerminalController`
- 源码： `packages/api/terminal-controller/src/index.ts`

| 成员     | 签名                                                                                                                                       | 任务用途                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `create` | `(agent: Agent, request: TerminalCreateRequest, signal: AbortSignal) => Promise<WebTerminalInfo>`                                          | 按调用方生成的身份幂等分配；已提交的进程在连接断开后继续存活。 |
| `list`   | `(sessionId: SessionId) => WebTerminalInfo[]`                                                                                              | 返回保留的终端，不激活 Agent。                                 |
| `resize` | `(agent: Agent, id: Branded<"WebTerminalId">, attachmentId: Branded<"TerminalAttachmentId">, cols: number, rows: number) => Promise<void>` | 调整可写 attachment 的尺寸；没有 signal 参数。                 |
| `write`  | `(agent: Agent, id: Branded<"WebTerminalId">, attachmentId: Branded<"TerminalAttachmentId">, data: string) => Promise<void>`               | 通过当前可写 attachment 发送输入；没有 signal 参数。           |

同一公开类还声明了 `environment(agent: Agent, signal: AbortSignal): TerminalEnvironment`、`shells(agent: Agent, signal: AbortSignal): Promise<TerminalShell[]>`、`retain(sessionId: SessionId, id: WebTerminalId, signal: AbortSignal): AsyncIterable<TerminalRetentionFrame>`、`follow(agent: Agent, id: WebTerminalId, attachmentId: TerminalAttachmentId, signal: AbortSignal): AsyncIterable<TerminalFrame>`、`rename(agent: Agent, id: WebTerminalId, title: string): void` 和 `close(agent: Agent, id: WebTerminalId): Promise<void>`。`retain` 和 `follow` 是 stream Remote 方法。源码：`packages/api/terminal-controller/src/index.ts:117-284`。

**`ClientTerminals`**

- 入口： `export:@deepseek-ai/dsh-api-terminal-controller:./client`
- 签名： `ClientTerminals`
- 源码： `packages/api/terminal-controller/src/client/index.ts`

| 成员   | 签名                                                                                                                     | 任务用途                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `view` | `(sessionId: SessionId, key: string, contentId: string, terminalId?: WebTerminalId, shellPath?: string) => TerminalView` | 返回每个 occurrence 对应的可观察模型。 |

该类还声明了 `launchShells(sessionId: SessionId, signal: AbortSignal): Promise<TerminalLaunchShells>`、`selectShell(path: string): void`、`close(sessionId: SessionId, key: string, contentId: string, terminalId?: WebTerminalId): void` 和 `retainTabs(tabs: readonly { sessionId: SessionId; tabId: string; contentId: string }[]): void`。源码：`packages/api/terminal-controller/src/client/index.ts:78-143`。

**`Workspace`**

- 入口： `export:@deepseek-ai/dsh-workspace:.`
- 签名： `Workspace`
- 源码： `packages/workspace/workspace/src/types.ts`

| 成员     | 签名                                   | 任务用途                        |
| -------- | -------------------------------------- | ------------------------------- |
| `id`     | `Branded<"WorkspaceId">`               | 稳定的 branded Workspace 身份。 |
| `path`   | `string`                               | 已登记的 Host 目录路径。        |
| `status` | `() => Promise<"ok" \| "missing-dir">` | 检查目录是否仍存在。            |

**`IWorkspaces`**

- 入口： `export:@deepseek-ai/dsh-api-workspace-controller:./client`
- 签名： `IWorkspaces`
- 源码： `packages/api/workspace-controller/src/client/service.ts`

| 成员     | 签名                                                   | 任务用途                                          |
| -------- | ------------------------------------------------------ | ------------------------------------------------- |
| `create` | `(input: { path: string; }) => Promise<WorkspaceView>` | 登记现有路径并返回 Host 解析后的 Workspace。      |
| `list`   | `WorkspaceSource`                                      | 可观察的 Host 权威 Workspace 快照及 follow 状态。 |

**`defineStore`**

- 入口： `export:@deepseek-ai/dsh-client-store:.`
- 签名： `<T, A extends ActionsDecl<T>>(decl: StoreSpec<T, A> & { actions: A & ActionsDecl<T> }): EngineStoreHandle<T, A>`
- 源码： `packages/client/store/src/index.ts`

`init()` 为每个实例创建状态；actions 通过返回的 handle 写入。持久化 key 属于浏览器 `localStorage`。

**`createSnapshotStore`**

- 入口： `export:@deepseek-ai/dsh-client-store:.`
- 签名： `<T>(init: T, opts?: { flush?: 'raf' | 'sync'; persist?: { name: string } }): SnapshotStore<T>`
- 源码： `packages/client/store/src/index.ts`

生成不依赖 React 的 observable，并提供稳定的快照读取；`raf` 批量发送通知，`persist` 使用浏览器 `localStorage`。

**`InputActions` / `TokenSpan`**

- 入口： `export:@deepseek-ai/dsh-client-ui-conversation:./client`
- 签名： `InputActions`; `TokenSpan = { readonly start: number; readonly end: number; readonly draftRev: number }`
- 源码： `packages/client/ui-conversation/src/client/contract/input.ts:222-231`; `contract/draft-editor.ts:7-11`

| 成员               | 签名                                         | 任务用途                                                                                              |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `captureInsertion` | `() => TokenSpan`                            | 在异步操作前捕获选择范围与草稿 revision。                                                             |
| `insertText`       | `(text: string, span: TokenSpan) => boolean` | 插入一次可撤销的纯文本编辑；返回 `false` 表示 revision 已变化或输入被锁定，应保留文本供用户显式重试。 |

导入 conversation 的 `./client` 类型增强后，session scoped 的 `PropsRuntime<'conversation.input.activity'>` 提供 `inputActions: InputActions`、`locked: boolean` 和 `onActiveChange(active: boolean): void`。`InputActivityOwnerProps` 声明在 owner 的 `contract/slots.ts` 中，但公开 `./client` 入口未直接重新导出；应通过 `PropsRuntime` 使用 `SlotMap` key。源码：`packages/client/ui-conversation/src/client/contract/slots.ts:205,260,416-419`。

**`PluginActivationOwnerProps`**

- 入口： `export:@deepseek-ai/dsh-client-ui-plugin-manager:./client`
- 签名： `PluginActivationOwnerProps`
- 源码：`packages/client/ui-plugin-manager/src/client/slot-contract.ts:66-79`；由 `src/client/index.ts` 重新导出

`plugins.bundle.activation` 是 plugin manager 声明的 root scoped keyed slot。注册时以精确的 Bundle 包名作为 `key`；用户显式启用后，owner props 用于提供后续引导。

| 成员            | 签名         | 任务用途                             |
| --------------- | ------------ | ------------------------------------ |
| `packageName`   | `string`     | 此启用引导对应的 Bundle。            |
| `onDismiss`     | `() => void` | 关闭此激活引导。                     |
| `onOpenDetails` | `() => void` | 关闭引导并导航到该 Bundle 的详情页。 |

**`ConfigForm`**

- 入口： `export:@deepseek-ai/dsh-client-ui-settings:./client`
- 签名： `ConfigForm<T>`
- 源码： `packages/client/ui-settings/src/client/config-form-types.ts`

| 成员          | 签名                                                                                               | 任务用途                                       |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `getSnapshot` | `() => ConfigFormSnapshot<T>`                                                                      | 读取稳定的当前值、revision、模式和可写状态。   |
| `mutate`      | `(ops: readonly SettingsPathOpView[], expectedRevision?: number \| undefined) => Promise<boolean>` | 针对可选的固定 revision 排队提交原子路径操作。 |
| `set`         | `(field: string, value: unknown) => Promise<boolean>`                                              | 排队写入一个顶层字段。                         |
| `subscribe`   | `(listener: () => void) => () => void`                                                             | 监听快照替换；调用方负责取消订阅。             |
| `unset`       | `(field: string) => Promise<boolean>`                                                              | 清除一个 override，以恢复继承值。              |

`ConfigFormSnapshot<T>` 是 `getSnapshot()` 的返回结果：`status` 可为 `loading | ready | unavailable`，`mode` 可为 `host | memory`，`writable` 控制能否修改，`revision?: number` 为 Host 写入提供栅栏。`base`、`user` 和解析后的 `value?: T` 分别区分默认值、override 和生效值。`mutate` 返回 false 或 reject 后，重试前应读取新快照；不要复用旧 revision。

`TerminalCreateRequest` 必须包含调用方生成的 `id: WebTerminalId`、`cols` 和 `rows`，可选传入发现的 `shellPath`；传输故障后应使用同一个 id 重试，避免分配第二个终端。`TerminalFrame` 是以 `type` 区分的联合类型：初始 `snapshot` 包含有界的 `screen`、`sequence` 和 `info`；后续 `output` 包含有序的 `sequence`/`data`；`state` 包含更新后的 `info`。retain hold 与 `write`/`resize` 使用的可写 attachment 分离。Client `TerminalView` 提供稳定的 `id`、可观察的 `state`、`mount()` 清理、`connect()`、`refresh()`、`acknowledge(revision)`、`write(data)`、`resize(cols, rows)`、异步 `rename(title)`、`close()` 和 `dispose()`；Sidebar occurrence 结束时，view owner 必须调用 `dispose()`。源码：`packages/api/terminal-controller/src/types.ts` 和 `src/client/index.ts`。

对于 Workspace UI，`WorkspaceSource.getSnapshot()` 返回 `WorkspaceSnapshot`，`subscribe(listener)` 返回对应的取消订阅函数。快照的 `state` 和 `phase` 区分 idle/loading/error、初始 baseline 与 ready follow 状态；`items` 保存 Host 权威的行，`archivedSessionIds` 和 `pinnedSessionIds` 是独立集合，`error` 解释 follow 失败。`WorkspaceArchiveError` 带有 `name` 和 `rpcError: RemoteFailure`；提供停止活动后重试的选项前应检查错误码。源码：`packages/api/workspace-controller/src/client/service.ts` 和 Client model。

## Remote 编写所需符号

这些符号属于 `@deepseek-ai/dsh-typert-protocol` 根入口；所选 Host/Client 示例直接使用它们。`TypertRemoteService` 是将 Cordis service key 绑定到 wire namespace 的 service 基类。其构造函数签名为 `protected (ctx: Context, serviceKey: string, options?: { namespace?: string })`；子类调用 `super(ctx, key, { namespace })`。源码：`packages/typert/protocol/src/index.ts:166-179`。

| 符号                                                    | 公开任务契约                                                                                                                                                                                                                                                                    | 源码                                                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Remote`                                                | 标准方法装饰器 `@Remote` 或 `@Remote(name: string)`；可选的 `{ mode: 'stream' }` 声明逻辑 stream。仅接受公开实例方法。取消参数命名为 `signal`，置于最后。                                                                                                                       | `packages/typert/protocol/src/index.ts:195-225`; `packages/typert/generator/src/analyzer.ts:1106` |
| `RemoteError<Code>`                                     | `new RemoteError(code, message, details, options?: ErrorOptions)`；`Code` 索引经声明合并的 `RemoteErrorDetailsMap`，因此 `details` 具有错误码对应的类型。`isDSHRemoteError` 无需依赖跨 realm 的 `instanceof` 即可识别领域错误。`cause` 只存在于当前进程，不保证通过 wire 传递。 | `packages/typert/protocol/src/remote-error.ts:12-31`                                              |
| `RemoteErrorDetailsMap`                                 | 可通过声明合并扩展的错误码到 details 映射表。领域包在抛错代码旁声明自己的错误码；内置码包括 `gateway/bad-request`、`gateway/cancelled`、`gateway/internal`。                                                                                                                    | `packages/typert/protocol/src/types.ts:45-63`                                                     |
| `RemoteResult<T>`                                       | 判别式结果 `{ ok: true; value: T } \| { ok: false; error: RemoteFailure }`；业务或传输失败使用 error 分支，本地 assembly 故障可能 reject。                                                                                                                                      | `packages/typert/protocol/src/types.ts:67-79`                                                     |
| `RemoteFailure`                                         | 错误分支包含稳定的 `code`、可读的 `message`，且当错误码属于 `RemoteErrorDetailsMap` 时包含类型化的 `details`；它是 Remote 调用返回的数据，不是本地抛出的异常。                                                                                                                  | `packages/typert/protocol/src/types.ts:49-78`                                                     |
| `TypertRemoteContribution`                              | 生成的 Client contribution `{ package: string; descriptors: readonly InvocationDescriptor[] }`；将生成的 `./remote` 运行时值传给 `ctx.remote.$mount`。不要手写 descriptors。                                                                                                    | `packages/typert/protocol/src/types.ts:423-438`                                                   |
| `TypertClientRemote`                                    | Client facade 提供 `$mount(contribution): Promise<TypertDisposer>` 和类型化的 `$on(event, listener)`；namespace 方法由声明合并提供。mount 由 effect 持有，但销毁依赖它的 UI 前须等待 disposer。                                                                                 | `packages/typert/protocol/src/types.ts:431-455`                                                   |
| `RemoteStream<Out, In>` / `RemoteStreamHandle<Out, In>` | Host stream 方法返回 iterable 或标记过的 `RemoteStream`；生成的 Client 方法打开 handle，支持异步迭代及 `send`、`end`、`dispose`。持有者既不迭代也不 dispose 时，会一直占用 Host stream 资源。                                                                                   | `packages/typert/protocol/src/types.ts:82-124`                                                    |

## Slot 编写所需符号

`@deepseek-ai/dsh-client-ui-slots` 根入口导出类型定义，`@deepseek-ai/dsh-client-ui-renderer/client` 安装公开的 `ctx.slots` service facade。该 facade 将 `register` 和 `inject` effect 绑定到调用方 Cordis fiber；运行时 owner 位于 `packages/client/ui-renderer/src/client/registry.ts:164-181,194-270`。

`SlotRegistry.register({ name, id }, Component, options?)` 提交类型化 entry 并返回 disposer；`SlotRegistry.inject(name, callback)` 等待 owner slot 后运行回调，并在 owner 消失时撤销注册。贡献方应通过 `ctx.slots` 调用这两个方法；无需自行调用 renderer 侧的 `UiRendererService.mount` 或 owner 侧的 header props。`ConversationSessionHeaderSlotProps` 和 `ConversationHeaderActionOwnerProps` 属于内置 conversation owner；导入其 `./client` 类型增强后，`PropsRuntime<'conversation.session.header.actions'>` 即可使用对应 key。

| 符号                                                 | 公开任务契约                                                                                                                                                                                   | 源码                                                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `SlotMap` / `SlotEntryDef`                           | Owner 通过声明合并定义各 key，必须包含 `kind` 和 `scope`；`owner`、`keyProps`、`hookContext`、`inject` 等字段描述共享接口。其他包注册前用 `import type {}` 导入 owner 的 `./client` 类型增强。 | `packages/client/ui-slots/src/index.ts:25-30,116-137`                                                               |
| `PropsRuntime<K, EntryKey>`                          | 包含 owner 共享属性、key 属性、slot 注入接口及 scope 标准属性；Component 从中读取，不读取捕获的 Cordis `ctx`。在选定的 header actions 示例中，`K` 为 `conversation.session.header.actions`。   | `packages/client/ui-slots/src/index.ts:245-262`; `packages/client/ui-conversation/src/client/contract/slots.ts:156` |
| `PropsStore<H>` / `InjectFace<I>` / `PropsLocale<N>` | 分别添加 store selector/actions、注册时注入的数据/回调及类型化的 `t`。只有注册项声明了对应能力时才包含相应共享属性。                                                                           | `packages/client/ui-slots/src/index.ts:595-609`                                                                     |

## Web provider 请求与结果符号

以下类型由 `@deepseek-ai/dsh-web` 根入口导出，是编写或调用 provider 所需的契约。其 `WebRuntime` 在调用时选择 provider，并公开 `registerSearchProvider`、`registerFetchProvider`、`search` 和 `fetch`；见 `packages/web/web/src/index.ts:96-164`。

| 符号                                  | 公开任务契约                                                                                                                                                                             | 源码                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `WebSearchRequest`                    | `{ query: string; maxResults?: number }`；provider 可利用 `maxResults` 降低上游成本，`WebRuntime` 会按此限制返回的 sources。                                                             | `packages/web/web/src/types.ts:13-28`                                          |
| `WebSearchResult` / `WebSearchSource` | 结果包含可选 `content`、`sources: readonly WebSearchSource[]` 和 `truncated: boolean`；每个 source 必须有 `url`，可选 `title`、`snippet`、`publishedAt`。                                | `packages/web/web/src/types.ts:30-56`                                          |
| `WebFetchRequest`                     | `{ url: string }`；timeout 和 format 不是请求字段。可选的 `AbortSignal` 单独传给 `fetch`。                                                                                               | `packages/web/web/src/types.ts:58-68`                                          |
| `WebFetchResult` / `WebFetchBody`     | 结果包含最终 `url`、`statusCode`、`body`、`truncated`；封闭的 body 联合类型包含 `kind: 'html' \| 'text'` 和 `content`。非 2xx 响应属于结果，不是传输异常。                               | `packages/web/web/src/types.ts:70-96`                                          |
| `WebError` / `WebRuntimeConfig`       | Registry 与选择失败通过 `WebError.code` 表示；`WebRuntimeConfig.searchProvider` 和 `.fetchProvider` 可固定 id，否则必须恰好有一个可用 provider。不要把 provider 特有错误码视为封闭枚举。 | `packages/web/web/src/types.ts:122-135`; `packages/web/web/src/index.ts:62-93` |

## 构建时生成 Remote

`@deepseek-ai/dsh-typert-generator` 根入口导出 `WorkspaceTypertGenerator(root, options?)`；`generate(packages?, faces?)` 返回 `WorkspaceEmitResult[]`，包含 `package`、`packageRoot`、`face`、`js`、`dts`，以及可选的 `remote`，后者包含 `js`、`dts`、`dtsMap`。所选步骤使用 `generate(['@acme/dsh-review'], ['host'])` 请求一个 Host 包，写出 `typert.host.*` 和 `typert.remote-client.*`，再基于这些声明编译 Client。生成器只从根目录独立的 `tsconfig.host.json` 和 `tsconfig.client.json` 发现 `packages/` 下的包 project references，并验证 manifest 中精确的 exports 和 `files` 条目。源码：`packages/typert/generator/src/index.ts:14-15`、`src/workspace.ts:14-123`、`src/analyzer.ts:294-336,478-520`。已发布的 `./tsdown` 子路径还导出 `typertPlugin(options?)`，可用于另一种构建集成（`src/tsdown-plugin.ts:30-43`）；所选步骤使用直接的根入口 API。
