# Web Client 模块装载契约

## 适用范围与入口

目标版本为 `dsh-v0.2.0-rc.1`。插件作者需要让独立包的浏览器半侧在内置 Web Client 中运行时，给包声明 `dsh.client`，发布 `./client` 导出，并通过裸包名 Loader 行启用 Host 半侧。实际制作、安装和浏览器观察步骤见[构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)；页面 slot 的具体类型由相应 UI reference 拥有，热更新见[Client HMR](api-client-hmr.md)。

`@deepseek-ai/dsh-package-manifest` 公开 `DshClientManifest`；`@deepseek-ai/dsh-client-modules` 的 Host 导出公开 `ClientModuleRegistry`、`ClientArtifactBaseline`、`WebBootEntry`、`WebBootBatch` 和 `WebBootGraph` 等，`./client` 导出公开浏览器模块表与注册协议类型。普通插件写 manifest 和 Client `apply`，不需要实例化模块表。`dsh-client-modules` 是 Web 组合的装载基础设施；它自身的 bootstrap 例外不应复制到业务插件。

## 契约与运行语义

已启用的 Loader 裸包名行被 Host 扫描。其所属包 `package.json` 的 `dsh.client.platform` 为 `web` 时，扫描器从 `exports["./client"]` 解析已经构建好的浏览器入口，形成以包名为 id 的 graph row。子路径行、`cordis:` 内置行和未声明 Web Client 的包不带 Client 半侧。Host 侧 `ClientModuleRegistry` 将 graph 注入 Web index，并经 `/plugins` 路由或 shell carrier 提供版本化脚本；Client 侧模块表登记工厂，浏览器 Loader 在需要时才 materialize 并运行 `apply`。

`./client` 不能是普通 ESM 文件或 Vite 自动发现入口。构建结果须调用 `window.__ModuleLoader__.load({ id, factory })`；`id` 与包名相同，`factory(require)` 返回 Cordis 插件导出。脚本到达只登记工厂，工厂执行和副作用等到首次 import。上游 `packages/client/tsdown.client.ts` 预设可以生成这种 lazy-CJS 文件，但它是仓库内文件，未作为已发布构建包导出。独立包可以按公开注册协议产生同形输出，并在消费端验证。

`DshWindow.__ModuleLoader__` 在 Client bootstrap 后提供 `ClientModuleLoaderTarget.load(registration)`；独立包只调用 `load`。`__DSH_BOOT__` 是 Host 写入的只读启动图，不由插件设置。`ClientModuleLoaderTarget.create`、`mode` 和 `pendingQueue` 属于 shell 启动内部状态，业务插件不操作。

Client bundle 的同步 `require` 只能请求模块表可回答的键。默认共享基线为 `react`、`react/jsx-runtime`、`react-dom`、`react-dom/client`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-client-store`、`@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-ui-primitives`、`@deepseek-ai/dsh-client-ui-dockkit`。非基线的精确请求需列在 `dsh.client.external`；只有有供应行或静态表键的请求可用，`<pkg>/client` 与裸包名映射到同一动态行。类型导入在构建后消失，无运行时请求。跨业务插件的行为交互优先使用 Cordis service，UI 组合使用 slot，不通过 `external` 导入另一个业务插件值。

**对象类型与成员**

| 对象与来源                                                           | 成员                                                         | 插件作者需要的语义                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `DshClientManifest`，`@deepseek-ai/dsh-package-manifest`             | `platform: string`                                           | Web consumer 只选 `web`；必填，无默认值。                                                   |
| 同上                                                                 | `inject?: string[]`                                          | 包名依赖边；用于工厂到达与 Client entry 组合，不等于 Cordis service 注入。缺省不添加边。    |
| 同上                                                                 | `immediately?: boolean`                                      | `true` 将工厂登记放入初始 bootstrap 阶段；普通业务包可省略。                                |
| 同上                                                                 | `external?: string[]`                                        | 非基线模块表请求的精确字符串；缺省只有基线。自请求、缺失供应和同步循环会使组合失败。        |
| `ClientBundleRegistration`，`@deepseek-ai/dsh-client-modules/client` | `id`, `chunk?`, `factory`                                    | `id` 必须匹配 graph row；入口不写 `chunk`。工厂接收 `ClientBundleRequire`，返回导出对象。   |
| `ClientBundleRequire`，同上                                          | `(specifier): unknown`, `async(specifier): Promise<unknown>` | 同步模块表查找；`async` 供构建生成的包内动态 chunk 使用，普通单文件包不调用。未知请求抛错。 |
| `WebBootEntry`，`@deepseek-ai/dsh-client-modules`                    | `id`, `url`, `rev`, `inject?`, `immediately?`, `external?`   | Host 发布的单包行；`url` 是文档相对的版本化引用，`rev` 是不透明 artifact 修订。插件不手写。 |
| `WebBootGraph`，同上                                                 | `rev`, `entries`, `batches`                                  | 当前页面期望的 graph；`batches` 将每行放入唯一初始 combo。插件不改写。                      |

`WebBootBatch` 的 `phase` 为 `bootstrap | application`，还带 `url: string`、`rev: string`、`entries: string[]`；它是 Host 生成的初始脚本 descriptor。`ClientArtifactBaseline` 的 `path: string`、`mtimeMs: number`、`ctimeMs: number`、`size: number` 为构建文件在快照读取前的 stat 值，供 HMR watch 设立基线；它不是内容哈希。以上两种对象均由 Host 创建，普通插件不构造或修改。

`ClientModuleRegistry` 在 Host Context 上名为 `clientModules`：`graph(): WebBootGraph` 读取当前 graph；`clientPath(id)` 和 `artifactBaseline(id)` 返回已发布 bundle 路径或 stat 基线，未知 id 返回 `undefined`；`fetchBundle(request): Promise<Response>` 提供与 Web route 相同的资源响应；`rebuilt(id)` 仅在 artifact 元数据修订变化时重读并重组；`onRebuilt(listener)`、`onGraphChanged(listener)` 返回取消订阅函数。`onGraphChanged` 无 payload，监听者重新调用 `graph()`。这些是宿主集成或 HMR 所用服务面，普通 Client 包无需调用。

此包的 `default` 导出是 `ClientModuleRegistry` 类本身；导入这个类并不额外安装第二个服务。`WebBootBatchPhase` 是 `"bootstrap" | "application"` 的公开类型别名，限定 `WebBootBatch.phase`，由 Host 组装，不是插件可注册的阶段。

## 生命周期与状态

Host 的包 manifest、构建产物和 Profile Loader 行决定某个 Client 半侧是否存在；浏览器每页持有自己的模块表和 Cordis fiber。Client 插件在 `apply` 内注册的 DOM、事件、slot、locale 等资源应交给该 fiber 的 effect/disposer；Loader 行关闭后等待异步清理，再移除该包拥有的样式。重连时 Client Modules 按 Host 的完整 graph 对齐当前页。业务持久事实应来自 Host/Session 等所属存储；浏览器模块表和 DOM 不是可恢复状态。

## 失败、权限与边界

首次激活扫描遇到 malformed `dsh.client`、缺失 `./client` 或缺失构建文件时，聚合错误使模块服务的 fiber 失败；运行中坏包会记录警告，不阻断其它行。未知或修订不匹配的 bundle URL 返回 404。Client transport、登记缺行、依赖传播和工厂运行错误分别记录在模块表中，Web boot audit 会报告具体行。Web Profile 必须实际包含 Host 的模块服务、Web 载体和 Client shell；仅安装包或通过配置 dump 不表示浏览器已加载。`dsh.client` 不授予 Host API 或浏览器权限；Remote、slot 等还需各自的服务和类型入口。

## 验证

先检查包的 `exports["./client"]`、`dsh.client`、构建文件及裸包名 Loader 行；启动 Web Profile 后看 Host graph 中是否出现该 id，再在真实 Web 页面检查 `apply` 的可观察结果，关闭行后检查 disposer 与 DOM 撤销。隔离的 `client-presence-consumer` 已在真实 Chrome 页面显示标记节点，运行中移除包后节点消失；这仅验证该单文件包的装载和清理。目标仓库的 `apps/web/tests/client-plugin-live.e2e.ts` 另有两页、重新加载和断线重连的测试源码，本次未运行该套件。TypeScript 声明检查或配置 dump 不能代替浏览器观察。精确路径归档于 [source-map](../maintenance/source-map.md)。
