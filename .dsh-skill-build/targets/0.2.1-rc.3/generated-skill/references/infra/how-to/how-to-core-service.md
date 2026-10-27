# 注册 Service 并处理插件生命周期

## 注册并验证可卸载的 Service

包元数据对象：

- [DshBundleManifest](../api/api-core-package-manifest.md#dshbundlemanifest-包元数据契约)。
- [DshClientManifest](../api/api-core-package-manifest.md#dshclientmanifest-包元数据契约)。
- [DshEnginesManifest](../api/api-core-package-manifest.md#dshenginesmanifest-包元数据契约)。
- [DshManifest](../api/api-core-package-manifest.md#dshmanifest-包元数据契约)。
- [DshPackageManifest](../api/api-core-package-manifest.md#dshpackagemanifest-包元数据契约)。
- [DshProfileManifest](../api/api-core-package-manifest.md#dshprofilemanifest-包元数据契约)。
- [LocalizedText](../api/api-core-package-manifest.md#localizedtext-包元数据契约)。
- [PluginLocalizedMeta](../api/api-core-package-manifest.md#pluginlocalizedmeta-包元数据契约)。

相关对象：

- [Context](../api/api-core-cordis-root-1.md#context-公开契约)。
- [Fiber](../api/api-core-cordis-root-2.md#fiber-公开契约)。
- [FiberState](../api/api-core-cordis-root-2.md#fiberstate-公开契约)。
- [Plugin](../api/api-core-cordis-root-4.md#plugin-公开契约)。
- [Service](../api/api-core-cordis-root-4.md#service-公开契约)。

目标：其他插件能通过 `ctx.localGreeting` 调用服务，停用提供方后服务和计时器同时消失。版本为 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

1. 从 [Cordis Context](../api/api-core-cordis-root-overview.md)、[Service](../api/api-core-cordis-root-overview.md) 和 [Loader](../api/api-core-cordis-plugin-loader-root-overview.md) 确认运行时对象、模块装载与实例句柄的区别。一个函数插件是 `(ctx, config)`；对象插件需要 `apply`；类插件经 `new` 创建。三者是模块形态，不是互斥产品能力。
2. 按 [完整独立 Service 示例](../examples/example-core-service.md) 创建所有文件，锁定 peer 版本，构建后添加 bundle。新增条目用 `insert`；仅写 `name` 的 patch 是对已有条目的断言或覆盖，不能代替插入。
3. 在消费插件的 `inject` 明列服务键。Loader 并发启动配置项，列表先后不保证初始化顺序；依赖缺失使插件保持 PENDING。提供方消失时依赖方卸载，服务恢复后才重新启动。
4. Service 在 `super(ctx, key)` 注册；用 `ctx.effect` 管理框架外的连接、watcher 和定时器。effect 回调返回 disposer。监听器、子插件及服务注册本身已属于 fiber，避免再用全局状态复制所有权。
5. 等待 `fiber.dispose()` 完成后断言调用入口和外部资源已经释放。disposer 按注册逆序启动，但异步 disposer 可并发；严格先取消再等待再关闭的资源放进同一个异步 disposer 串行处理。apply 或 Config 校验失败观察 FAILED，不能把启动日志当成完成。

完成判据：调用结果正确；禁用提供方后依赖方退出 ACTIVE，计时器停止；重新启用无重复注册；失败启动没有残留外部资源。`Context.is(value)` 用于跨独立 Cordis 副本识别 Context，不依赖 `instanceof`。

## 选择事件调度并验证监听器清理

相关对象：

- [DispatchMode](../api/api-core-cordis-root-1.md#dispatchmode-公开契约)。
- [EventOptions](../api/api-core-cordis-root-1.md#eventoptions-公开契约)。
- [Events](../api/api-core-cordis-root-2.md#events-公开契约)。
- [EventsService](../api/api-core-cordis-root-2.md#eventsservice-公开契约)。

目标：观察插件事件或实现可拦截的扩展链，同时遵守事件 owner 定义的调度方式。

1. 查看 [Cordis 事件契约](../api/api-core-cordis-root-overview.md)，在所属包声明合并 `Events` 并通过 type-only import 引入声明。不要猜事件参数或把所有事件当成可 await 的通知。
2. `ctx.on` 注册普通监听器，`ctx.once` 只收一次；返回 disposer 可提前移除，fiber 卸载也会自动移除。`prepend` 调整优先级，`global` 会绕过过滤，仅在确实要求跨范围观察时使用。
3. `emit` 同步分发且不等 Promise；需要耐久检查点使用 owner 定义的 `parallel` 并等待所有监听器。`serial` 逐个等待直到首个非 null/false/undefined 值；`bail` 同步提前返回；`waterfall` 用最后的 `next` 包裹后续链，不调用 next 会截断。
4. 注册后发一次带唯一标识的事件，断言参数和返回值；卸载后再发，断言没有旧监听器。scope 过滤属于事件契约，不能用 `global` 模拟另一 Agent 的作用域。

完成判据：取消或卸载没有留下监听器，异步持久化用可等待的 checkpoint，而不是 fire-and-forget 事件。

## 定义 Config 并使配置错误在装载时失败

相关对象：

- [Plugin](../api/api-core-cordis-root-4.md#plugin-公开契约)。
- [resolveConfig](../api/api-core-cordis-root-6.md#resolveconfig-公开契约)。
- [default](../api/api-core-schemastery-root-1.md#default-公开契约)。

目标：配置默认值、字段约束和失败在插件装载边界明确生效，热替换不留下旧注册。

1. 查询 [Schemastery](../api/api-core-schemastery-root-overview.md)、[Cordis插件配置](../api/api-core-cordis-root-overview.md) 与 [Settings表单](../api/api-core-dsh-settings-root-overview.md)。模块导出 Config 类型及同名schema；schema必须符合Standard Schema接口，普通数据对象不能代替它。
2. 在schema声明部署可调字段、默认值和自包含校验。对其他服务或注册资源的引用使用inject，不能把异步服务存在性检查塞进静态schema并假设Cordis会等待任意Promise。
3. 新插件在bundle patch的insert行写config；覆盖已有id时会替换整份config，必须重述保留字段。Loader在该行依赖具备后，用注入Context求值其!!js表达式，再校验Config；不要在表达式中执行不可回滚业务动作。
4. 运行缺字段、错误类型、越界数字和正确配置四种输入，确认默认填充与FAILED诊断。schema失败时apply不应成功，不能通过捕获错误并保留半初始化资源把配置失败伪装成PENDING。
5. HMR启用时修改普通配置会卸载重建；volatile字段按目标schema/Loader契约live更新。两种路径都验证旧effect清理、实例值正确，不把普通配置热替换与Settings路径编辑当成同一生命周期。

完成判据：无需改代码即可改变部署字段，无效配置明确拒绝，正常配置可观察，旧注册或外部资源不残留。完整包基础仍见 [Service示例](../examples/example-core-service.md)，给其模块添加Config导出不会自动生成一个独立持久设置文件。

## 交付预构建包与 Git 安装边界

相关对象：

- [InstallBundleOptions](../api/api-core-dsh-plugin-manager-root-1.md#installbundleoptions-公开契约)。
- [PluginManager](../api/api-core-dsh-plugin-manager-root-3.md#pluginmanager-公开契约)。
- [DshBundleManifest](../api/api-core-package-manifest.md#dshbundlemanifest-包元数据契约)。
- [DshEnginesManifest](../api/api-core-package-manifest.md#dshenginesmanifest-包元数据契约)。
- [DshManifest](../api/api-core-package-manifest.md#dshmanifest-包元数据契约)。
- [DshPackageManifest](../api/api-core-package-manifest.md#dshpackagemanifest-包元数据契约)。

目标：消费profile能够从已准备的分发物解析运行入口，并明确Git源码安装所需构建脚本与授权。

1. 核对 [包manifest](../api/api-core-package-manifest.md) 与 [PluginManager安装契约](../api/api-core-dsh-plugin-manager-root-overview.md)。先在作者环境构建lib，再检查files/exports同时包含JS入口、声明、bundle patch及需要的Client/Remote产物。依赖宿主共享实例的DSH包同时列peerDependencies与devDependencies，第三方独立版本列dependencies。
2. 预构建npm包或tarball提供现成lib；执行本地 `pnpm run build`、`pnpm pack` 后检查tarball文件清单，再在隔离profile用 `dsh plugin --profile <profile> add ./local-greeting-1.0.0.tgz`。只有生成分发物与隔离安装验证属于此步骤；公开发布需要另行授权。
3. Git安装获取源码，不会自动运行名为build的脚本。作者提供自包含prepare脚本，在干净Git checkout内构建公开入口；不能依赖兄弟monorepo目录或只在作者机器存在的生成文件。消费方使用固定revision的spec，例如 `github:owner/repository#<revision>`。
4. pnpm阻止未获准的Git依赖prepare时，保留其打印的确切package key。用户明确允许安装时执行该源码后，在目标profile的pnpm-workspace.yaml以allowBuilds为该确切key设true，再重试add。不要由运行期工具审批推断安装脚本已获准，也不添加通配允许项。Web manager的approvedBuilds只接受当前pending且未被已有规则拒绝的名字；schema含YAML anchors/aliases的授权段拒绝。
5. 检查add结果的dependency、bundle selection和application状态，再dump-config确认层存在，实际启动并调用一次，停用后验证清理。pnpm或bundle验证失败会恢复manifest与lockfile；随后激活失败可能保留已完成安装和selection，不能盲目重复安装或假设自动回滚。未启用HMR时按restart-required重启。

完成判据：干净消费环境能解析构建入口并实际运行，tarball没有漏文件；Git路径证明prepare自包含，安装脚本只在明确允许后执行；报告分别记录构建、安装、激活和卸载，不把pnpm退出0当作应用可用。
