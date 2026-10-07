# Host 到 Client 的 Remote API

## 入口、侧别与适用条件

目标版本把 Remote 分为四个所有者：`@deepseek-ai/dsh-typert-protocol` 提供 Host 装饰器、绑定和失败类型；`@deepseek-ai/dsh-typert-generator` 在 Host 构建时生成严格描述符、codec 和 Client 投影；`@deepseek-ai/dsh-api-gateway` 的根入口导出 `TypertGateway` 并提供 Host `ctx.typertGateway`，`./client` 提供浏览器 `ctx.remote`；`@deepseek-ai/dsh-api-remotes/client` 是当前 Web 应用显式选择的业务 Remote 集合。Connection 负责 `/api` 载体、请求关联、信任和取消。自有业务包的 `@Remote` 方法不会仅因安装到 Profile 就自动进入 Web Client：应用组合的 Remote assembly 还须导入该包生成的 `/remote` 贡献并挂载。

独立 Host 插件可以在其 Service 上声明 Remote 方法，但要让现有 Web app 调用它，必须由应用 owner 更新 Client assembly 并完成 Host → Client 构建。仅在 Host 从源码启动时可见的 SRC fallback 不会生成 Client 类型或严格 codec。对普通只在 Host 内使用的服务，不必引入 Remote。

## Host 声明与公开对象

`TypertRemoteService` 构造器以 Cordis `serviceKey` 注册 Service，并以相同键作为默认线名；`{ namespace }` 可显式更名。已经有基类的 Service 可用 `bindTypertRemote(this, serviceKey, options)` 产生同等可检查绑定。`@Remote` 标注公开实例方法，可用 `@Remote('exportName')` 改线名；`@Remote({ mode: 'stream' })` 声明流。`@RemoteScope(key, ...)` 先经 `ctx.typert.contexts` 解析带身份的 scoped Context，再从该 Context 取 Service；它与直接 `@Remote` 的对象 lookup 不同。未标注方法不会进入生成的 Client API。

直接 Remote 参数必须是必需的简单标识符，不支持可选、默认、解构、rest 或泛型方法；严格生成要求公开、非 static、带实现。普通参数需能严格投影为 JSON/受支持的二进制 codec。`Agent`、`Session` 等 Host 对象只能作为顶层 lookup 参数，必须有对应 `TypertLookupMap` 与运行时 resolver。合作取消使用最后一个参数 `signal: AbortSignal`；它不进 wire `args`，Client 方法的尾部可传 signal。流方法返回 `Iterable`、`AsyncIterable` 或 `RemoteStream<Out, In>`；`In` 的每项通过 `ctx.invocation.uplink()` 读取并在 Host 侧校验。尚无自己的流重连游标时，不把它写成可恢复订阅。

包需发布由生成器负责的 `./typert`（Host 描述符）和有 Remote 方法时的 `./remote`（Client 贡献）指向 `lib/typert.host.*`、`lib/typert.remote-client.*`。这些是生成文件，不能手工编辑或把源码路径伪装成已生成输出。生成器检查导出和 `files` 清单。Host Loader 负责注册其 `./typert`；应用侧 assembly 显式选择 `/remote`。签名、命名空间、code 表、lookup 或装饰器变动后，先构建 Host 再构建 Client；实现体单独修改不要求重新生成声明。

Host 反射注册使用生成的 `TypertContribution`：`package` 与 `face`（`TypertFace` 为 `'host' | 'client'`）标识编译面，`schemas` 是惰性 `TypertSchemaFactory.create()` 集合，`model` 是 `TypertPackageModel`，其 `services`、`events`、`objects` 仅描述生成的公开形状，`invocations` 是 Host Remote 描述符。`TypertSchemaFilter.package?`、`face?` 筛选注册结果；`TypertSchemaRecord.package`、`face`、`schema` 标记已物化的 live schema。`typertKey`、`typertPackageKey`、`typertEndpoint` 分别生成 schema、package-face 与 invocation endpoint 的键；不能用这些键替代运行时注册或授权。

`TypertRegistry.register(contribution)` 由当前 fiber 拥有，并返回撤销函数；`get`、`list` 查询当前 schema，`local`、`remotes`、`lookups` 分别提供本地 invocation、远端贡献与对象 lookup 注册表。Client 的 `@deepseek-ai/dsh-typert-registry/client` `apply(ctx)` 安装相同 Registry 实现；它是应用 Client assembly 的装载函数，并不自动导入业务包的生成 `/remote` 贡献。反射对象与 `apply` 是组合契约，不是要求每个普通业务插件手写的独立扩展点。

### 精确 API 对象与成员

`@deepseek-ai/dsh-typert-registry` 是 Host 的 `ctx.typert` 服务；`TypertRegistry.register` 接受**生成的** `TypertContribution`，重复 package-face、schema、invocation id 或 endpoint 会在整个批次提交前拒绝。注册返回由调用 fiber 拥有的撤销函数，卸载时原子移除贡献和本地 invocation。通常由 Loader 装载包的 `./typert`，插件作者不手写反射模型。`get`/`resolve`/`list` 查询 live schema，`local`/`remotes`/`lookups`/`contexts` 分别提供本地描述符、远端贡献、lookup 与 scoped Context 注册；查询不替代业务权限。`typertKey`、`typertPackageKey`、`typertEndpoint` 只构造命名键。Client assembly 的 `@deepseek-ai/dsh-typert-registry/client` `apply` 安装同一反射服务；它不会自动把自有 Remote 贡献装入应用，装配者仍需导入并挂载生成的 `./remote`。

| 对象/导出             | 纳入的成员                                                                                                                                                                                              | 调用边界                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `TypertContribution`  | `TypertContribution.face`, `TypertContribution.invocations`, `TypertContribution.model`, `TypertContribution.package`, `TypertContribution.schemas`                                                     | 生成器提供的 package-face、schema、model 与 invocation 批次；插件不手写反射对象。 |
| `typertEndpoint`      | —                                                                                                                                                                                                       | 将 invocation namespace/method 组成 endpoint key。                                |
| `TypertFace`          | —                                                                                                                                                                                                       | Host 或 Client 编译面。                                                           |
| `typertKey`           | —                                                                                                                                                                                                       | 组成 package/schema 全局键。                                                      |
| `typertPackageKey`    | —                                                                                                                                                                                                       | 组成 package/face 全局键。                                                        |
| `TypertPackageModel`  | `TypertPackageModel.events`, `TypertPackageModel.objects`, `TypertPackageModel.services`                                                                                                                | 生成的 service/event/object 反射集合；仅供贡献与检查，不是授权表。                |
| `TypertRegistry`      | `TypertRegistry.contexts`, `TypertRegistry.get`, `TypertRegistry.list`, `TypertRegistry.local`, `TypertRegistry.lookups`, `TypertRegistry.register`, `TypertRegistry.remotes`, `TypertRegistry.resolve` | Host 反射服务；注册、查询与子注册表均随所在 fiber 生命周期使用。                  |
| `TypertSchemaFactory` | `TypertSchemaFactory.create`, `TypertSchemaFactory.name`                                                                                                                                                | 惰性创建本进程 Zod schema。                                                       |
| `TypertSchemaFilter`  | `TypertSchemaFilter.face`, `TypertSchemaFilter.package`                                                                                                                                                 | 按 package/face 筛选 live schema。                                                |
| `TypertSchemaRecord`  | `TypertSchemaRecord.face`, `TypertSchemaRecord.key`, `TypertSchemaRecord.name`, `TypertSchemaRecord.package`, `TypertSchemaRecord.schema`                                                               | 带 package/face/key 的已物化 schema。                                             |
| `./client apply`      | —                                                                                                                                                                                                       | `./client` 装配函数；将 Registry 安装到 Client Cordis。                           |

### 构建时生成器入口

构建包子路径为 `./tsdown`。

`@deepseek-ai/dsh-typert-generator/tsdown` 的 `typertPlugin(options?)` 是包构建阶段的公开入口，返回兼容 rolldown 的 `transform`/`writeBundle` 插件；它不是运行时 Cordis service。`TypertPluginOptions.mode` 为 `'package'`（默认）或 `'workspace'`，`faces?` 指定本构建阶段要分析的独立 TypeScript program face。构建需先完成同一 workspace 的 `tsc` 声明检查，再让 tsdown 的 `writeBundle` 指向包的输出目录；插件对没有 Typert 导出的包跳过，对有导出的包生成 `lib/typert.host.*` 及适用时的 `lib/typert.remote-client.*`。包的 exports/files 必须与生成器要求的路径一致。`WorkspaceTypertGenerator` 是仓库工作区级分析/发射器；独立外部包不能只传自己源码目录就推断目标应用已接入其 Client assembly。源码见 `packages/typert/generator/src/{tsdown-plugin,workspace}.ts`。

### Lookup 与 scoped Context 注册

自有 Remote 若接受 Host 对象参数，包作者先以声明合并扩展 `TypertLookupMap`，再在 Host 的 `ctx.typert.lookups.register(key, provider)` 注册同 key 的 `TypertLookupProvider`。provider 的 `parameter`、`wire`、`hostTypeSymbol`、`wireTypeSymbol` 必须对应生成器看到的公开声明，`resolve(id)` 在每次调用时从已校验 wire 身份取得当前 Host 对象，找不到时返回 `undefined`。`register` 返回属于插件 fiber 的撤销函数。应用组合可用 `configure(key, resolver)` 临时覆盖解析策略；`get`、`keys`、`definitions`、`subscribe` 只观察当前运行时或曾见过的声明，不能代替装载 provider。身份值和权限仍由业务 owner 校验，类型投影不会自行授权。

自有 scoped Remote 先声明合并 `TypertContextMap`，用 `ctx.typert.contexts.registerHost(key, adapter)` 注册 Host `TypertHostContextAdapter`：`wire`、`wireTypeSymbol` 定义线格式，`resolve(id)` 找到当前 live `Context`。Client assembly 持有 `registerClient(key, adapter)`；`TypertClientContextAdapter.identity(ctx)` 抽取 wire 身份，`resolve(id)` 为一次 Client 调用取得 Context。`configureHost` 允许组合层临时覆盖 Host 解析策略；`getHost`、`getClient`、`subscribe` 是观察接口。所有注册/覆盖均返回撤销函数，随所属 fiber 卸载；Client 所需贡献仍须进入应用 assembly。源码契约在 `packages/typert/protocol/src/types.ts` 的 `TypertLookupProvider`、`TypertLookupRegistry`、`TypertHostContextAdapter`、`TypertClientContextAdapter` 和 `TypertContextRegistry`。

## Client 调用与失败

`ClientRemote` 是 `@deepseek-ai/dsh-api-gateway/client` 的公开 Client service 类型；业务调用通过 `ctx.remote`，其方法名由应用装配的生成贡献决定。

调用插件自身声明 `inject: ['remote', 'remote.<namespace>']`，并导入会挂载该贡献的 Client assembly 类型。`ctx.remote.<namespace>.<method>(...)` 返回 `Promise<RemoteResult<T>>`：`ok: true` 带 `value`，`ok: false` 带真实 `RemoteError`。调用方按稳定 `error.code` 分支；业务、取消和载体失败进入错误分支，装配错误仍可能 reject。`RemoteErrorDetailsMap` 在抛错 owner 处做声明合并；通用 `gateway/bad-request`、`gateway/cancelled`、`gateway/internal` 由协议包声明，基础设施代码由 Gateway 声明。跨 wire 保留 `code`、`message`、`details`，不保留自定义 class identity 或 `cause`。业务 catch 只在需要把任意提供者异常明确归为领域 code 时使用。

Client 的 `ctx.remote.$host.home` 和 `isLoopback` 是普通读值，首个 ready 前 `home` 可为 `undefined`；需要重连响应的插件监听 `connection/reset` 或其领域通知。`ctx.remote.$on()` 仅订阅 assembly 明确转发的事件，随调用 fiber 释放；普通通知不会自动重放。需要持久恢复的插件必须查询 owner 提供的基线、游标或 Session 事实。`RemoteResult` 不是 Session 记录，Remote 调用本身不保证模型可见历史可重建。

## 装载、卸载与验证

Host Gateway 每次调用都从当前描述符和 Service 取目标，验证命名参数、codec 和 lookup 后执行；未分类异常折叠为 `gateway/internal`。卸载 Client 贡献会撤销具体方法并中止在途调用，外部保存的旧函数柄不应继续调用。Endpoint 使用 Connection 的 `/api` 请求路径；流使用共享 `/api/remote.mux` WebSocket 或进程内载体。权限来自 Connection 的信任检查和业务 Service 自己的授权，不从有类型的调用推断用户已获准。

生成和验证的任务步骤见 [添加一个 Remote API](how-to-add-remote-api.md)。本次源码核查覆盖公开类型、运行时和目标仓库测试位置；隔离工程通过 Host/Client 声明编译、生成器和贡献导入，并记录了生成器测试 shim 的限制。目标仓库完整构建、真实 `ctx.remote.$mount`、HTTP/浏览器调用和卸载尚未执行，不能宣称跨侧消费路径已验证。
