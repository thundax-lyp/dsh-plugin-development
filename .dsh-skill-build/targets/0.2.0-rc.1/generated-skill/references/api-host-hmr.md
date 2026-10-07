# Host HMR 与 Profile 配置重载

## 何时使用和如何挂载

目标版本的 DSH 基础 bundle 在 `hmr` 行装载 `@deepseek-ai/dsh-hmr`，并在有 `profileContext` 时启用它；默认 `config.root: []` 只保留 Profile 配置监视，不监视插件源码。`headless`、`sdk-app`、`acp-app` 的后续 bundle patch 禁用该行，`sdk-minimal` 不包含它。插件作者若需要在这些组合中使用 HMR，必须先核对最终 patch 树，再明确启用；未启用时修改在重启后生效。`@deepseek-ai/cordis-plugin-hmr` 虽仍发布，但 DSH Profile 的基础组合没有使用它，不能用它推断 Profile manifest 重载行为。

`@deepseek-ai/dsh-hmr` 的默认导出是 Host `Service`，在 Cordis `Context` 中提供 `ctx.hmr`；`HmrConfig`、`Reload` 是同一根导出的公开类型。它依赖 `loader` 与 `timer`，构造时要求 Loader 可访问 Node 内部模块图，否则抛出 `--expose-internals is required for HMR service`。正常 DSH CLI 启动路径提供该条件；自己嵌入 Host 的作者需要自行满足。HMR 的启用由配置树控制，插件包无需为一般工具或 Service 注册 HMR。

## 配置和公开成员

根入口 `default` 是 HMR service 类；插件应通过已装载 Profile 的 `ctx.hmr` 调用以下成员。

| 入口                                     | 契约及边界                                                                                                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HmrConfig.base?: string`                | 相对拥有者 context 的 `baseUrl` 解析模块监视基目录。                                                                                                                           |
| `HmrConfig.root: string[]`               | 模块监视根；schema 默认 `["."]`，DSH 基础 bundle 显式设为 `[]`。空数组不取消独立的 Profile 配置文件监视。                                                                      |
| `HmrConfig.ignored: string[]`            | 模块路径 glob；schema 默认忽略 `node_modules`、点目录、`cache`、`data`。                                                                                                       |
| `HmrConfig.debounce: number`             | 模块改动合批毫秒数；schema 默认 `100`。另外继承 Chokidar 选项。                                                                                                                |
| `ctx.hmr.runExclusive(operation)`        | 将调用方的异步变更与自动重载串行；返回操作结果。嵌套事务拒绝，服务释放后拒绝；调用方需要处理 rejection。包安装不在这条队列中。                                                 |
| `ctx.hmr.watchConfig(filename, refresh)` | 注册绝对文件路径监视，返回异步 disposer。文件可尚不存在；同一路径重复注册拒绝。`refresh` 应从当前文件重建配置并等待 Loader 完成；调用方拥有 disposer，失败时仍须处理资源释放。 |
| `ctx.hmr.baseDir`、`config`              | 可读取的基目录和配置；诊断用途，勿直接操纵 watcher、模块缓存或事务队列。                                                                                                       |
| `hmr/change(url)`、`hmr/reload(reloads)` | Cordis 事件；前者为无模块或配置处理器的文件变更，后者为模块替换完成。`Reload` 有 `filename` 和可选 `runtime`。监听器要随自己的 fiber 清理。                                    |

`getLinked(url)` 和 `getOuterStack()` 虽在公开类上可见，当前实现分别访问 Node 内部加载图和诊断栈。普通插件不依赖它们决定热更完成；以实际服务生命周期和 Loader 状态为准。`watchConfig` 的底层监视器由 HMR 与注册它的 Cordis effect 共同管理，初始注册失败会关闭 watcher；后续 `refresh` 抛错会记录警告，监视继续运行。配置修改失败不能当作新配置已经生效。

## 模块、Include 与 Profile 的顺序

HMR 在同一队列中处理模块变更、Include 文件刷新和 Profile manifest/patch 重组。Profile 场景需有 `appReady`，在启动就绪前收到的改动不会抢先重组。Profile manifest 仅当有序 `dsh.profile.bundles` 列表变化时重组；Profile 自身 patch 与 home patch 的内容变化也会触发重组。实际层顺序和整值 `config` 替换见 [Bundle 与 Profile](api-profile-bundle.md)；配置行语义见 [Loader、Include 与 Group](api-loader-composition.md)。

模块监视需要显式设置非空 `root`。框架入口依赖的变动交由 Host 的 `loader.exit()` 钩子处理；已加载插件模块及其依赖走替换与 fiber 重挂载；匹配 Include 文件时刷新该树。热更不是状态迁移或 Session 日志重写：插件应在自己的 effect/disposer 中释放外部资源，并用 Session/持久化契约保存必须重建的模型可见事实。`hmr/reload` 不证明应用功能已经通过端到端验证。

## 验证与限制

用 `dsh --profile <name> --dump-config` 核对 `hmr` 行、`disabled` 和 `root`；dump 只显示组合结果。启动后分别修改 Profile patch、manifest 的 bundle 顺序和受监视插件源码，观察目标 entry/fiber 与服务结果。初始 watcher 失败会使 HMR 初始化失败；后续文件事件或重组失败会记警告并保留上次可用配置。停止 Host 时等待 watcher 与已排队操作清理。本次用已发布目标版本的隔离 Profile 修改自身 patch，观察到新增 probe 激活、改值后旧 fiber 释放与新 fiber 激活、撤销后释放。尚未实际验证 manifest bundle 列表变更或源码模块替换；目标 checkout 缺少依赖，因此其中的 HMR 测试本次未运行。
