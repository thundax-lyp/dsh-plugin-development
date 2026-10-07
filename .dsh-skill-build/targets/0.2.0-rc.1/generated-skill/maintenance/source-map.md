# 目标版本源码映射

本账本只记录 `dsh-v0.2.0-rc.1`、commit `4878cdabd87d4041bdaff61d04c966883b9fd07a` 的证据。路径相对于该 commit 的仓库根目录。记录的是已审阅的事实所属位置；测试路径存在并不等于下游消费任务已经运行。

## 工具定义、注册与执行

权威正文：[模型工具注册与执行契约](../references/api-tools.md)；任务步骤：[制作并装载一个模型工具](../references/how-to-register-model-tool.md)。

| 事实                                                   | 目标版本证据                                                                                                                                                                                   | 验证边界                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `@deepseek-ai/dsh-tools` 的根导出、类型与子路径        | `packages/core/tools/package.json`; `packages/core/tools/src/index.ts`                                                                                                                         | 核查 package export、实际重导出和 Cordis `Context.tools` 合并。                        |
| `defineTool` 的输入、规范结果、取消和纯呈现回调        | `packages/core/tools/src/schema.ts`; `packages/core/tools/src/index.ts`; `packages/core/tools/tests/schema.spec.ts`                                                                            | 独立消费项目的 TypeScript 声明编译通过；执行中取消尚未验证。                           |
| `ToolRuntime.register()` 的返回 disposer、错误与 scope | `packages/core/tools/src/index.ts`; `packages/core/tools/tests/tools.spec.ts`; `packages/core/tools/tests/scoped.spec.ts`                                                                      | 隔离 Profile 实际启动后观察到工具注册；移除 bundle 并重启后观察到工具缺失。            |
| 模型呈现与规范结果分离                                 | `packages/core/tools/src/index.ts`; `packages/core/tools/src/presentation.ts`; `packages/core/tools/tests/tools.spec.ts`                                                                       | 直接工具调用的 `value` 与文本内容已观察；Agent/Session 重放未测。                      |
| Profile bundle 安装、组合和卸载                        | `apps/cli/src/args.ts`; `apps/cli/src/profile-boot.ts`; `packages/boot/plugin-manager/src/operations.ts`; `packages/boot/app-boot/tests/profile.spec.ts`; `docs/user/develop/basic/publish.md` | 独立安装的目标版本 CLI 在隔离 `DSH_HOME` 下执行了 add、dump、boot、remove 和重启检查。 |

详细命令与结果保留在本次创建的 `evidence/tests/greet-consumer-verification.md`；该文件属于维护工作区，不随 Skill 分发。

## Cordis 插件与 fiber 所有权

权威正文：[Cordis 插件、服务与生命周期](../references/api-cordis-core.md)。`@deepseek-ai/cordis` 的根导出和发布文件在 `vendor/cordis/package.json` 与 `vendor/cordis/src/index.ts`；`Context`、插件形态及依赖声明见 `vendor/cordis/src/context.ts`、`vendor/cordis/src/registry.ts`。服务注册和代理访问分别由 `vendor/cordis/src/service.ts`、`vendor/cordis/src/reflect.ts` 实现；effect、fiber 失活、配置验证与重启在 `vendor/cordis/src/fiber.ts`；事件注册与派发在 `vendor/cordis/src/events.ts`。`docs/cordis-api/` 是由目标代码生成的定位材料，不能单独证明实际装载。隔离 Profile 中的工具插件已观察到注册和移除后缺失；独立的服务插件、事件派发与配置更新尚未作消费验证。

## Bundle 与 Profile

权威正文：[Bundle 与 Profile 装载边界](../references/api-profile-bundle.md)。`DshBundleManifest` 和 `DshProfileManifest` 的准确字段在 `packages/util/package-manifest/src/types.ts`；`@deepseek-ai/dsh` 的 bin 声明在 `apps/cli/package.json`，参数解析在 `apps/cli/src/args.ts`。bundle 路径、Profile 层和跳过项由 `packages/boot/app-boot/src/profile.ts` 定义；安装与移除在 `packages/boot/plugin-manager/src/operations.ts`，最终 CLI 组合在 `apps/cli/src/profile-boot.ts`。消费教程 `docs/user/develop/basic/publish.md` 只补充操作顺序，不能覆盖上述代码；本次隔离 Profile 验证记录见维护工作区的 `evidence/tests/greet-consumer-verification.md`。

内置 `acp`、`headless`、`sdk`、`sdk-minimal`、`web` 的层顺序由 `packages/boot/app-boot/src/profile.ts` 给出；各 bundle 的 `package.json` 与 `cordis.patch.yml` 位于 `packages/bundle/acp-app/`、`headless/`、`sdk-app/`、`sdk-minimal/`、`web-app/`。其中 `web-app/package.json` 还按顺序列出五份 preset patch。这些是目标源码/manifest 的配置事实；尚未逐个启动这五种内置 Profile。

## Timer 插件

权威正文：[fiber 所有权下的定时任务](../references/api-timer.md)。公开导出与包版本在 `vendor/timer/package.json`；`vendor/timer/src/index.ts` 定义 `TimerService`、`Context` 增量、各 overload、effect 清理与 `setTimeout`/`setInterval` 的 `@deprecated`。内置层中的 timer 行见 `packages/bundle/base/cordis.patch.yml` 与 `packages/bundle/sdk-minimal/cordis.patch.yml`。隔离消费样例在本次创建的 `evidence/tests/timer-consumer`：TypeScript 编译和打包清单通过；目标版本 CLI 的隔离 Profile add/dump 与实际启动观察到 `example-timer` fiber 激活，remove 后重启观察到它缺失。该 Profile 未输出 heartbeat，因此 tick 与停止后的定时器行为仍未验证。

## Loader、Include 与 Group

权威正文：[Loader 配置行、Include 与分组](../references/api-loader-composition.md)；组合步骤：[把已安装插件移入 Group](../references/how-to-nest-plugin-under-group.md)。公开 package exports 与版本在 `vendor/loader/package.json`、`vendor/include/package.json`、`vendor/group/package.json`；配置行、Group、树和隔离 realm 由 `vendor/loader/src/config/entry.ts`、`group.ts`、`tree.ts`、`isolate.ts` 定义。patch 覆盖和 YAML 表达式方言由 `vendor/include/src/index.ts` 定义，DSH Host 挂载 `cordis:include` 与 `cordis:group` 的边界见 `packages/boot/app-boot/src/index.ts`。`packages/boot/app-boot/tests/config-reload.spec.ts`、`config-dump.spec.ts` 与 `profile.spec.ts` 是关键行为测试；它们不替代独立消费观察。

隔离 Profile 的 `group.patch.yml` 与 `group-observer.patch.yml` 使原 `greet-tool` 行禁用并在 `cordis:group` 下插入 `nested-greet`。目标版本 CLI dump 显示了最终树，真实启动的诊断插件观察到工具注册，直接调用成功、无效参数和预取消错误也已记录。未验证 Include 热刷新、配置持久写入、isolation realm 变化或 Client 侧行为。

## Host HMR

权威正文：[Host HMR 与 Profile 配置重载](../references/api-host-hmr.md)；任务步骤：[在 Profile 中启用 Host HMR](../references/how-to-enable-host-hmr.md)。公开导出与配置在 `packages/boot/hmr/package.json`、`packages/boot/hmr/src/index.ts`；精确文件监视在 `packages/boot/hmr/src/watch-config.ts`。基础组合的 `hmr` 行及 `root: []` 在 `packages/bundle/base/cordis.patch.yml`；`apps/cli/tests/profile-hmr.spec.ts` 验证多种 Profile 层的启用状态，`packages/boot/hmr/tests/modules.spec.ts` 和 `watch-config.spec.ts` 覆盖模块与配置监视行为。隔离消费 Profile 的 patch 新增、改值、撤销观察见 `evidence/tests/profile-consumer/hmr-profile-smoke.mjs` 和 `hmr-probe.result`；manifest 列表与源码模块热更仍未验证。

## Web Client HMR

权威正文：[Web Client 插件图热重载](../references/api-client-hmr.md)；任务步骤：[观察 Web Client 插件热更](../references/how-to-observe-client-plugin-reload.md)。公开 Host、浏览器和 invariant 三个入口见 `packages/client/hmr/package.json`；`src/index.ts` 实现轮询与 SSE，`src/client/index.ts` 接收事件，`src/events.ts` 定义帧 envelope。`packages/bundle/web-app/cordis.patch.yml` 挂载 Host 半边，`packages/client/hmr/tests/node-half.client.spec.ts` 是 Host 侧行为测试。独立 Client 插件的真实构建与页面替换本次尚未验证。

## Remote API

权威正文：[Host 到 Client 的 Remote API](../references/api-remote-api.md)；任务步骤：[为应用增加 Remote 方法](../references/how-to-add-remote-api.md)。`packages/typert/protocol/src/index.ts` 与 `packages/typert/protocol/src/types.ts` 定义 Host 声明、lookup/Context 契约和 Client 结果；`packages/api/gateway/src/index.ts`、`packages/api/gateway/src/client/index.ts` 分别负责 Host dispatch 与 Client `ctx.remote`，`packages/api/remotes/src/client/index.ts` 是 Web 应用的显式贡献选择。生成边界见 `packages/typert/generator/src/workspace.ts` 和 `packages/typert/generator/src/emitter.ts`，Host → Client 构建顺序见根 `package.json`。隔离 `evidence/tests/remote-notes-consumer/` 通过目标发布声明的 Host/Client 编译、Typert 生成与贡献导入；生成工程为 decorator identity 使用目标测试夹具 shim。真实 Gateway、`$mount`、浏览器和目标仓库完整构建未运行。

## Web Client 模块装载

权威正文：[Client 模块装载](../references/api-client-modules.md)；任务步骤：[构建并装载 Web Client 插件](../references/how-to-build-and-load-web-client-plugin.md)。`DshClientManifest` 由 `packages/util/package-manifest/src/types.ts` 公开；Host 模块表和图见 `packages/client/modules/src/index.ts`，浏览器登记、解析与 fiber 清理见 `packages/client/modules/src/client/index.ts`、`packages/client/modules/src/client/manifest.ts`、`packages/client/modules/src/client/system.ts`、`packages/client/modules/src/client/entries.ts`、`packages/client/modules/src/client/entry-lifecycle.ts`。`packages/client/tsdown.client.ts` 只是仓库内部构建预设。隔离消费项目在 `evidence/tests/client-presence-consumer/` 通过构建、打包清单及 Node VM 的 factory/apply/disposer 检查；同一包又在隔离 Web Profile 的真实 Chrome 页面观察到装载标记和运行中卸载后的移除，命令和结果见 `evidence/runtime/client-presence-web-smoke.md`。slot、Remote、重连与控制台/boot audit 尚未验证。

## 当前 Profile 的插件管理

权威正文：[插件与 Bundle 管理](../references/api-plugin-manager.md)；任务步骤：[管理 Profile Bundle](../references/how-to-manage-profile-bundles.md)。公开方法和结果位于 `packages/boot/plugin-manager/src/index.ts`、`packages/boot/plugin-manager/src/types.ts`，CLI 包操作、锁、安装、移除与恢复见 `packages/boot/plugin-manager/src/operations.ts`，模型工具批准见 `packages/boot/plugin-manager/src/tools.ts`。`packages/bundle/base/cordis.patch.yml` 与 `packages/bundle/web-app/cordis.patch.yml` 决定默认挂载层；`packages/boot/plugin-manager/tests/manager.spec.ts`、`packages/boot/plugin-manager/tests/operations.spec.ts`、`packages/boot/plugin-manager/tests/tools.spec.ts` 是行为测试线索。本次未运行这些测试或独立 Profile 管理操作。

## Session 事实与持久化

权威正文：[Session 日志](../references/api-session-log.md)、[Session 持久化](../references/api-session-persistence.md)；任务步骤：[从事件重建插件事实](../references/how-to-rebuild-plugin-fact-from-session.md)。`packages/core/session/src/index.ts`、`packages/core/session/src/types.ts`、`packages/core/session/src/surface.ts` 定义事件追加、扩展和模型消息投影；`packages/session/session-persistence/src/index.ts`、`packages/session/session-persistence/src/handle.ts`、`packages/session/session-persistence/src/errors.ts` 定义后端与句柄；`packages/core/agent-loop/src/index.ts` 接线写所有权和恢复。隔离消费的事件类型折叠在 `evidence/tests/profile-consumer/session-fact.ts` 通过 TypeScript 检查；完整 Agent turn、flush、崩溃恢复与跨进程 backend 未运行。

## Web Client Slots 与 resources

权威正文：[Client Slots](../references/api-client-slots.md)、[Client resources](../references/api-client-resources.md)；组合步骤：[Session header 资源](../references/how-to-show-session-header-resource.md)。`packages/client/ui-slots/src/index.ts` 定义 slot 类型与注册核心；`packages/client/ui-renderer/src/client/index.ts` 和 `packages/client/ui-renderer/src/client/registry.ts` 提供 `ctx.slots`、等待声明及 fiber 清理。`packages/client/resources/src/client/contract.ts`、`packages/client/resources/src/client/resources.ts` 定义地址协议、provider、snapshot 与中止逻辑；`packages/bundle/web-app/cordis.patch.yml` 是内置 Web 组合线索。目标仓库的 `packages/client/ui-slots/tests/core.client.spec.ts`、`packages/client/ui-renderer/tests/registry.client.spec.ts`、`packages/client/resources/tests/resources.client.spec.ts` 为行为测试源码。隔离 `evidence/tests/client-ui-consumer/` 的 Slots TSX、resources Provider 与组合消费代码通过 Client 类型检查；其浏览器半侧通过构建、打包清单和 Node VM 的模块登记/首帧/slot cell 检查。同一隔离消费包已在真实 Web Profile + Chrome 页面观察到 Session header slot 资源首帧、离开与返回时订阅中止/重开，以及运行中移除插件后的 slot 和 provider 清理；记录见 `evidence/runtime/client-ui-web-smoke.md`。后续资源帧、错误帧与 slot 冲突仍未验证。

## 凭证、授权、设置与权限预设

权威正文：[凭证](../references/api-credentials.md)、[授权](../references/api-authorization.md)、[设置](../references/api-settings.md)、[权限预设](../references/api-permission-presets.md)；已编译的授权包步骤见[授权流程 HOW-TO](../references/how-to-register-authorization-flow.md)。`packages/credentials/credentials/src/index.ts`、`packages/credentials/credentials/src/types.ts` 定义凭证引用和记录，`packages/credentials/credentials-local/src/index.ts` 是本地 Provider；`packages/credentials/authorization/src/index.ts` 定义授权流程、提交与取消。`packages/settings/settings/src/index.ts`、`packages/settings/settings/src/types.ts`、`packages/settings/settings/src/redact.ts`、`packages/settings/settings/src/schema.ts` 定义实时表单和遮蔽。`packages/interaction/permission-presets/src/index.ts`、`packages/interaction/permission-presets/src/types.ts` 定义预设和 Session 事件；`packages/bundle/base/cordis.patch.yml` 是默认 Host 组合。隔离消费包 `evidence/tests/authorization-consumer/` 通过目标版本 Host 编译和 pack dry-run；真实 Profile、授权交互、Web 和 Remote 未运行。

## Session 历史查询与索引

权威正文：[Session 查询](../references/api-session-query.md)；配置步骤：[查询 Session 历史](../references/how-to-query-session-history.md)。`packages/session-query/session-query/src/index.ts`、`packages/session-query/session-query/src/types.ts`、`packages/session-query/session-query/src/config.ts`、`packages/session-query/session-query/src/observation.ts` 定义可信 Host 查询和观察 lease；`packages/session-query/session-query-sqlite/src/index.ts`、`packages/session-query/session-query-sqlite/src/query.ts` 定义派生 SQLite 索引。`packages/session-query/tool-session-query/src/index.ts`、`packages/session-query/tool-session-query/src/workspace-access.ts` 限定模型工具的工作区访问；`packages/bundle/base/cordis.patch.yml` 与 `packages/bundle/web-app/cordis.patch.yml` 是默认禁用全文检索的配置证据。查询、工具和索引的目标测试源码已定位；隔离 Profile、跨工作区权限、重启与 cursor 失效测试尚未运行。

## Subagent Provider、ACP 与模型委派工具

权威正文：[Subagent Provider](../references/api-subagent-provider.md)、[ACP 后端](../references/api-subagent-acp.md)、[模型委派工具](../references/api-subagent-tools.md)；组合步骤：[配置 ACP 委派](../references/how-to-configure-acp-delegation.md)。`packages/subagent/subagent/src/index.ts` 与 `packages/subagent/subagent/src/types.ts` 定义 Provider、请求、结果及控制服务；`packages/subagent/subagent/src/continuation.ts` 定义可续孩子身份。`packages/subagent/subagent-acp/src/index.ts`、`packages/subagent/subagent-acp/src/run.ts` 定义一次性子进程后端；`packages/subagent/tool-subagent/src/index.ts` 定义模型工具组合。`packages/acp/acp/src/index.ts` 和 `packages/bundle/acp-app/cordis.patch.yml` 是单独的 ACP server 路径，不等同于子进程 Provider。自定义 Provider 编译、父子 Profile 握手、取消和卸载尚未运行。

## LLM Adapter 与模型路由

权威正文：[LLM Provider](../references/api-llm-providers.md)、[模型路由](../references/api-llm-model-routing.md)；任务步骤：[创建 Adapter](../references/how-to-add-llm-adapter.md)、[Session 模型选择](../references/how-to-select-model-for-session.md)。`packages/llm/llm/src/index.ts`、`packages/llm/llm/src/types.ts`、`packages/llm/llm/src/adapter-failure.ts` 定义路由注册、模型目录、请求和流协议；`packages/core/agent/src/model-selection.ts`、`packages/core/agent-default-model/src/index.ts` 定义 Agent route 与默认值。`packages/api/session-controller/src/commands.ts`、`packages/api/session-controller/src/catalog.ts`、`packages/api/session-controller/src/model-selection-projection.ts` 定义 Web Session 选择和日志投影；`packages/bundle/base/cordis.patch.yml` 是 Host 服务组合证据。隔离 `evidence/tests/llm-adapter-consumer/` 通过 Host 编译、打包及进程内 Cordis 注册/目录/空消息流/卸载检查；固定文本示例拒绝 Agent 消息，真实 Profile、Agent、Web、凭证和 HTTP 尚未运行。

## Session 投影与领域存储

[Session 投影](../references/api-session-projection.md)及[注册任务](../references/how-to-register-session-projection.md)依据 `packages/session/session-projection/src/index.ts`、`src/types.ts` 与 `packages/session/session-projection-cache/src/index.ts`；隔离单进程投影 0→1、HOW-TO 声明编译记录在 `evidence/runtime/session-projection-storage-review.md`。缓存冷恢复、Profile 卸载尚未运行。

[Storage Domain](../references/api-storage-domain.md)及[领域记录任务](../references/how-to-persist-domain-records.md)依据 `packages/storage/storage/src/index.ts`、`packages/storage/storage-domain/src/index.ts` 与 `packages/storage/storage-json/src/index.ts`；隔离 JSON Backend 已核对关闭重开、更新、删除与事件顺序。SQLite Backend 独立语义仍待核查。

## Web ingress 与 Connection

[Web ingress](../references/api-web-ingress.md)和[Connection](../references/api-client-connection.md)共同服务[受保护的 HTTP 路由任务](../references/how-to-register-authenticated-http-route.md)。公开 Host 路由契约在 `packages/host/webserver/src/index.ts`、`packages/host/webserver/src/injections.ts`；Connection 的 Host/Client 出口、认证与请求准入在 `packages/client/connection/src/index.ts`、`src/rpc.ts`、`src/browser-auth.ts`、`src/client/index.ts`。内置 Web 组合见 `packages/bundle/web-app/cordis.patch.yml`。隔离发布包 Host 编译、打包与 WebServer+Connection 请求 smoke 记录在 `evidence/runtime/web-ingress-review.md`：401、303/cookie、200、405、Host/Origin/site 403 及卸载 404 已观察；持久凭证层为进程内替身，Web Profile/浏览器/Client 恢复未运行。

## SDK 调用方与 MCP 接入

[SDK 入口](../references/api-sdk-runtime.md)及[驱动 SDK Profile](../references/how-to-run-sdk-profile.md)依据 `packages/sdk/client/src/index.ts`、`packages/sdk/client/src/client.ts`、`packages/sdk/client/src/launch.ts`、`packages/sdk/server/src/server.ts` 与 `packages/sdk/protocol/src/index.ts`。隔离发布包的 HOW-TO 编译及脚本化假 peer JSON-RPC initialize/run/close 见 `evidence/runtime/sdk-mcp-review.md`；真实模型与 Profile 没有运行。

[MCP 客户端](../references/api-mcp-client.md)及[接入 MCP 服务器](../references/how-to-connect-mcp-server.md)依据 `packages/mcp/mcp-client/src/index.ts`、`packages/mcp/mcp-client/src/connection.ts`、`packages/mcp/mcp-client/src/transport.ts`、`packages/mcp/mcp-resources/src/index.ts`。发布包连目标 fixture stdio server 观察到初次工具和资源工具注册、fiber 卸载移除；HTTP、工具执行、资源读取和重连未运行。

## Jobs、Schedule 与 Plan/Todo

[Jobs](../references/api-jobs.md)及[后台任务步骤](../references/how-to-run-background-job.md)依据 `packages/jobs/jobs/src/index.ts`、`packages/jobs/jobs-local/src/index.ts`、`packages/jobs/tool-jobs/src/index.ts`。隔离 Cordis 宿主的完成/取消、工具输出及 CLI Profile 装载记录在 `evidence/runtime/jobs-schedule-planning-review.md`；Profile 内模型轮次、在线卸载及重启恢复未测。

[Schedule](../references/api-schedule.md)及[Session 计划步骤](../references/how-to-schedule-session-task.md)依据 `packages/schedule/schedule/src/index.ts`、`packages/schedule/schedule/src/runtime.ts`、`packages/schedule/schedule/src/storage.ts`。隔离宿主创建、列出、删除和 CLI Profile 启动已验证；到期交付与重启未测。[Plan/Todo](../references/api-planning.md)依据 `packages/plan/plan-mode/src/index.ts`、`packages/todo/tool-todo/src/index.ts`，本次仅独立公开声明编译，未验证实际审阅与浏览器投影。

## Client 设置表单与权限预设 UI

[Client 表单](../references/api-client-settings-forms.md)与[外部插件设置卡片](../references/how-to-add-plugin-settings-card.md)依据 `packages/client/ui-settings/src/client/index.ts`、`packages/client/ui-settings/src/client/config-form.ts`、`packages/client/ui-primitives/src/settings-form/form-model.ts`、`packages/client/ui-plugin-manager/src/client/slot-contract.ts`、`packages/client/modules/src/client/manifest.ts`。独立发布包 Host/Client 类型编译、lazy CJS factory 的 VM 注册与打包检查见 `evidence/runtime/settings-ui-review.md`；真实 Loader、浏览器与保存未运行。

[权限预设](../references/api-permission-presets.md)与[Web 组合](../references/how-to-compose-permission-preset-ui.md)依据 `packages/interaction/permission-presets/src/index.ts`、`packages/client/ui-permission-presets/src/client/index.ts`、`packages/client/ui-permission-presets/src/client/settings-store.ts`。未来 Session 默认与当前 Session 选择是不同写入路径；真实浏览器选择、确认、重连仍未运行。

## Filesystem 策略与 Shell 工具

[Filesystem 策略](../references/api-filesystem-policy.md)及[写入围挡步骤](../references/how-to-guard-filesystem-writes.md)依据 `packages/fs/fs/src/index.ts`、`packages/fs/fs-observation-policy/src/index.ts`、`packages/fs/fs-local/src/index.ts`、`packages/fs/tool-fs/src/write.ts`。目标发布依赖的隔离消费测试观察到受保护路径拒绝；完整 tool-fs、Loader 顺序及 sandbox 未运行，记录见 `evidence/runtime/fs-shell-review.md`。

[Shell](../references/api-shell-tool.md)及[固定命令工具步骤](../references/how-to-add-shell-tool.md)依据 `packages/shell/shell/src/index.ts`、`packages/shell/bash-local/src/index.ts`、`packages/shell/tool-bash/src/index.ts`。隔离测试观察到本地 shell exit 0 和工具卸载后注销；ToolRuntime 权限、取消、timeout 和沙箱仍未运行。

## Skill Provider 与 SystemPrompt

[Skill Provider](../references/api-skill-providers.md)及[注册步骤](../references/how-to-register-skill-provider.md)依据 `packages/skill/skill/src/index.ts` 与 `packages/skill/skill/tests/skill.spec.ts`；发布依赖隔离 Cordis service 的 provider list/get、卸载已验证，记录见 `evidence/runtime/skill-context-review.md`。真实 Agent Skill 调用及 Profile 未运行。

[SystemPrompt](../references/api-system-prompt-context.md)及[运行上下文步骤](../references/how-to-contribute-runtime-context.md)依据 `packages/core/system-prompt/src/index.ts`、`packages/core/agent-loop/src/agent.ts`、`packages/core/agent-loop/src/runtime-context.ts`。隔离 service 的章节/context render 已通过；AgentLoop 的 Session 快照与恢复未运行。

## Goal 与 Workflow

[Goal](../references/api-goal.md)及[协调步骤](../references/how-to-coordinate-goal.md)依据 `packages/goal/goal/src/index.ts`、`packages/goal/goal/src/domain.ts`、`packages/goal/goal/src/fold.ts`。隔离真实 GoalService/Session 投影的 create→pause 观察到两条已提交事件；Goal round driver、Agent 续行、模型工具及重启未运行，详见 `evidence/runtime/goal-workflow-agent-review.md`。

[Workflow](../references/api-workflow-agent-loop.md)及[运行所有权步骤](../references/how-to-own-workflow-run.md)依据 `packages/workflow/workflow/src/index.ts`、`packages/workflow/workflow-ptc/src/index.ts`、`packages/core/agent-loop/src/index.ts`。独立声明编译通过；运行 fixture 只用显式 StubWorkflowEngine 验证调用方等待/释放，未执行真实 PTC、subagent、sandbox 或 Profile。

## 工具策略 Hook 与审批

[工具策略 Hook](../references/api-tool-policy-hooks.md)与[实现步骤](../references/how-to-add-tool-execution-policy.md)依据 `packages/core/tools/src/index.ts`、`packages/interaction/user-approval/src/index.ts`、`packages/interaction/user-approval/src/types.ts`，行为对照 `packages/core/tools/tests/tools.spec.ts`。隔离发布包的声明编译、短调用、guard 禁止执行、无 Agent 的 ask 封闭拒绝与卸载恢复见 `evidence/runtime/tool-policy-review.md`；真实 open turn、Client 回答者、审计恢复、PTC 子调用未运行。

## Conversation nodes 与 Chat renderer

[Conversation nodes](../references/api-conversation-nodes.md)及[增加节点步骤](../references/how-to-add-conversation-node.md)依据 `packages/client/ui-conversation/src/client/contract/conversation.ts`、`packages/client/ui-conversation/src/client/conversation/definition-registry.ts`、`packages/client/ui-chat/src/client/index.ts`、`packages/client/ui-chat/src/client/chat/ChatNodeSeat.tsx`。独立 Client TSX 编译、浏览器半侧构建/打包及真实 Web Profile + Chrome 的 turn/start 节点可见/在线卸载已验证，见 `evidence/runtime/conversation-node-review.md`；自定义 Host 事件、multi-event update 和冷重启未运行。

## Browser/Computer Use provider 登记和 Session 资源所有权

权威正文：[Browser/Computer Use provider 登记和 Session 资源所有权](../references/api-browser-computer-use.md)。精确 checkout：`packages/browser-use/browser-use/src/index.ts`、`packages/computer-use/computer-use/src/index.ts`、`packages/experimental/browser-use-runtime/src/index.ts`。独立核查记录：`evidence/runtime/browser-computer-use-review.md`。

## 附件保存、读取与引用完整性

权威正文：[附件保存、读取与引用完整性](../references/api-attachment-store.md)。精确 checkout：`packages/attachment/attachment/src/index.ts`、`packages/attachment/attachment-local/src/index.ts`。独立核查记录：`evidence/runtime/attachment-feedback-review.md`。

## Session 级记录和消息级反馈 CAS

权威正文：[Session 级记录和消息级反馈 CAS](../references/api-user-feedback.md)。精确 checkout：`packages/feedback/command-feedback/src/index.ts`、`packages/feedback/message-feedback/src/index.ts`。独立核查记录：`evidence/runtime/attachment-feedback-review.md`。

## Workspace 注册表与 Session 活动

权威正文：[Workspace 注册表与 Session 活动](../references/api-workspace.md)。精确 checkout：`packages/workspace/workspace/src/index.ts`、`packages/workspace/workspace/src/types.ts`。独立核查记录：`evidence/runtime/workspace-lsp-review.md`。

## LSP provider 注册与查询

权威正文：[LSP provider 注册与查询](../references/api-lsp.md)。精确 checkout：`packages/lsp/lsp/src/index.ts`、`packages/lsp/lsp/src/types.ts`。独立核查记录：`evidence/runtime/workspace-lsp-review.md`。

## Host 目录选择与固定打开应用入口

权威正文：[Host 目录选择与固定打开应用入口](../references/api-host-platform.md)。精确 checkout：`packages/host/directory-picker/src/index.ts`、`packages/host/open-in-app/src/index.ts`。独立核查记录：`evidence/runtime/host-platform-review.md`。

## Terminal backend 与 owner 作用域

权威正文：[Terminal backend 与 owner 作用域](../references/api-terminal.md)。精确 checkout：`packages/terminal/terminal/src/index.ts`、`packages/terminal/terminal/src/types.ts`。独立核查记录：`evidence/runtime/host-platform-review.md`。

## Web search/fetch provider 注册、选择和工具结果

权威正文：[Web search/fetch provider 注册、选择和工具结果](../references/api-web-provider.md)。精确 checkout：`packages/web/web/src/index.ts`、`packages/web/web/src/types.ts`、`packages/web/tool-web/src/index.ts`。独立核查记录：`evidence/runtime/web-provider-review.md`。

## 在插件中注册运行时不变量和按需 Session Telemetry

权威正文：[在插件中注册运行时不变量和按需 Session Telemetry](../references/api-runtime-diagnostics-telemetry.md)、[完整步骤](../references/how-to-add-runtime-diagnostics.md)。精确源码：`packages/runtime-diagnostics/invariants/src/index.ts`；独立核查：`evidence/runtime/runtime-telemetry-review.md`。

## 为官方 DeepSeek Adapter 添加请求字段

权威正文：[为官方 DeepSeek Adapter 添加请求字段](../references/api-deepseek-request-extensions.md)、[完整步骤](../references/how-to-add-deepseek-request-field.md)。精确源码：`packages/llm/deepseek-llm-api-extensions/src/index.ts`；独立核查：`evidence/runtime/deepseek-request-extension-review.md`。

## 组合 Session compaction 与上下文恢复策略

权威正文：[组合 Session compaction 与上下文恢复策略](../references/api-compaction-context-recovery.md)、[完整步骤](../references/how-to-compose-compaction-recovery.md)。精确源码：`packages/compaction/compaction/src/index.ts`；独立核查：`evidence/runtime/compaction-recovery-review.md`。

## 给 Web Client 注册快捷命令并在线卸载

权威正文：[给 Web Client 注册快捷命令并在线卸载](../references/api-client-shortcuts.md)、[完整步骤](../references/how-to-add-client-shortcut.md)。精确源码：`packages/client/shortcuts/src/client/index.ts`；独立核查：`evidence/runtime/client-shortcuts-review.md`。

## 保存插件的大文本结果并返回持久引用

权威正文：[保存插件的大文本结果并返回持久引用](../references/api-spill.md)、[完整步骤](../references/how-to-save-large-report.md)。精确源码：`packages/spill/spill/src/index.ts`；独立核查：`evidence/runtime/sandbox-ssh-spill-review.md`。

## 人类命令与用户问题

权威正文：[命令与问题](../references/api-human-commands-questions.md)、[确认命令](../references/how-to-add-confirmation-command.md)。精确源码：`packages/interaction/commands/src/index.ts`、`packages/interaction/user-questions/src/index.ts`；隔离核查：`evidence/runtime/human-commands-questions-review.md`。

## 在 Host 插件中运行受管命令

权威正文：[在 Host 插件中运行受管命令](../references/api-subprocess.md)、[完整步骤](../references/how-to-run-managed-command.md)。精确源码：`packages/subprocess/subprocess/src/index.ts`；独立核查：`evidence/runtime/subprocess-review.md`。

## 给 Web Client 增加右侧栏 tab

权威正文：[给 Web Client 增加右侧栏 tab](../references/api-sidebar-right-tabs.md)、[完整步骤](../references/how-to-add-sidebar-right-tab.md)。精确源码：`packages/client/ui-sidebar-right/src/client/index.ts`；独立核查：`evidence/runtime/sidebar-right-tab-review.md`。

## 从已验证 GitHub Webhook 事件请求创建 Session

权威正文：[从已验证 GitHub Webhook 事件请求创建 Session](../references/api-webhook-rules.md)、[完整步骤](../references/how-to-create-session-from-github-webhook.md)。精确源码：`packages/webhook/webhook/src/index.ts`；独立核查：`evidence/runtime/webhook-rules-review.md`。

## 运行带 Host binding 的隔离程序

权威正文：[运行带 Host binding 的隔离程序](../references/api-ptc-runtime.md)、[完整步骤](../references/how-to-run-program-with-host-binding.md)。精确源码：`packages/ptc-runtime/ptc-runtime/src/index.ts`；独立核查：`evidence/runtime/ptc-runtime-review.md`。

## 注册 Session 标题 provider 并记录标题来源

权威正文：[注册 Session 标题 provider 并记录标题来源](../references/api-session-title.md)、[完整步骤](../references/how-to-register-session-title-provider.md)。精确源码：`packages/session/session-title/src/index.ts`；独立核查：`evidence/runtime/session-title-provider-review.md`。

## 给 Web Client 增加全局主面板与侧栏入口

权威正文：[给 Web Client 增加全局主面板与侧栏入口](../references/api-client-main-panels.md)、[完整步骤](../references/how-to-add-main-panel.md)。精确源码：`packages/client/ui-layout/src/client/index.ts`；独立核查：`evidence/runtime/client-main-panel-review.md`。

## 测试 Client Remote 调用

权威正文：[测试 Client Remote 调用](../references/api-testing-support.md)、[完整步骤](../references/how-to-test-client-remote-call.md)。精确源码：`packages/test-support/remote-mock/src/index.ts`；独立核查：`evidence/runtime/testing-support-review.md`。

## 给 Web Client 增加主题 token 覆盖层

权威正文：[给 Web Client 增加主题 token 覆盖层](../references/api-client-theme.md)、[完整步骤](../references/how-to-add-theme-layer.md)。精确源码：`packages/client/ui-theme/src/client/index.ts`；独立核查：`evidence/runtime/client-theme-review.md`。

## 给 Client 输入框增加候选触发源

权威正文：[给 Client 输入框增加候选触发源](../references/api-client-input-trigger.md)、[完整步骤](../references/how-to-add-input-trigger.md)。精确源码：`packages/client/ui-input-trigger/src/client/index.ts`；独立核查：`evidence/runtime/client-input-trigger-review.md`。

## 配置 DeepSeek Account 模型路由

权威正文：[配置 DeepSeek Account 模型路由](../references/api-deepseek-account-auth.md)、[完整步骤](../references/how-to-configure-deepseek-account-model.md)。精确源码：`packages/credentials/deepseek-account/src/index.ts`；独立核查：`evidence/runtime/deepseek-account-auth-review.md`。

## Hook 桥接与内置 Guard

权威正文：[Hook 与 Guard](../references/api-hook-bridges-guards.md)。目标 `packages/hooks/hooks-codex/src/index.ts`、`packages/hooks/hooks-claude-code/src/index.ts`、`packages/guard/repeat-tool-reminder/src/index.ts`、`packages/guard/timeout-policy/src/index.ts`；独立消费记录：`evidence/runtime/hook-bridges-guards-review.md`。

## session-format-storage-backend

权威正文：[API 参考](../references/api-session-format-storage-backend.md)。精确源码：`packages/storage/storage/src/backend.ts`；独立核查：`evidence/runtime/session-format-storage-backend-review.md`。

## agent-presets-persona

权威正文：[API 参考](../references/api-agent-presets-persona.md)。精确源码：`packages/preset/agent-preset-registry/src/index.ts`；独立核查：`evidence/runtime/agent-presets-persona-review.md`。

## llm-builtins-retry-meter

权威正文：[API 参考](../references/api-llm-builtins-retry-meter.md)。精确源码：`packages/llm/llm-retry/src/index.ts`；独立核查：`evidence/runtime/llm-builtins-retry-meter-review.md`。

## Client 本地化

权威正文：[Client 本地化](../references/api-client-locale.md)、[完整步骤](../references/how-to-localize-client-panel.md)。精确源码：`packages/client/locale/src/client/index.ts`；浏览器验证：`evidence/runtime/client-locale-review.md`.

## 应用命令行参数

权威正文：[命令行参数](../references/api-cmdline.md)、[完整步骤](../references/how-to-add-app-command-line-option.md)。精确源码：`packages/boot/cmdline/src/index.ts`；独立验证：`evidence/runtime/cmdline-review.md`。

## skill-bundled-consumers

权威正文：[API 参考](../references/api-skill-bundled-consumers.md)。精确源码：`packages/skill/skill-filesystem/src/index.ts`；独立验证：`evidence/runtime/skill-bundled-context-review.md`。

## opt-in-context-plugins

权威正文：[API 参考](../references/api-opt-in-context-plugins.md)。精确源码：`packages/context/time-context/src/index.ts`；独立验证：`evidence/runtime/skill-bundled-context-review.md`。

## shell-env

权威正文：[API 参考](../references/api-shell-env.md)。精确源码：`packages/shell/shell-env/src/index.ts`；独立验证：`evidence/runtime/shell-env-review.md`。

## 给 Session header 增加局部状态

权威正文：[API 参考](../references/api-client-store.md)、[完整步骤](../references/how-to-add-stateful-client-slot.md)。精确源码：`packages/client/store/src/index.ts`；独立核查：`evidence/runtime/client-store-file-upload-review.md`。

## 从 Client 上传并提交文件

权威正文：[API 参考](../references/api-client-file-upload.md)、[完整步骤](../references/how-to-upload-and-submit-file.md)。精确源码：`packages/client/file-upload/src/client/index.ts`；独立核查：`evidence/runtime/client-store-file-upload-review.md`。

## 注册静音 WAV Provider

权威正文：[API 参考](../references/api-speech-provider.md)、[完整步骤](../references/how-to-register-silence-speech-provider.md)。精确源码：`packages/experimental/speech-to-text/src/index.ts`；独立核查：`evidence/runtime/speech-provider-review.md`。

## 启用实验 Inspector

权威正文：[API 参考](../references/api-experimental-inspector.md)、[完整步骤](../references/how-to-enable-experimental-inspector.md)。精确源码：`packages/experimental/inspector/src/index.ts`；独立核查：`evidence/runtime/experimental-inspector-review.md`。

## 转换已授权的 Office 文件

权威正文：[API 参考](../references/api-office-to-pdf.md)、[完整步骤](../references/how-to-convert-office-document.md)。精确源码：`packages/document/office-to-pdf/src/index.ts`；独立核查：`evidence/runtime/remaining-core-goal-deliverables-document-fs-workflow-review.md`。

## 读取当前 Session 的工作区变化

权威正文：[API 参考](../references/api-workspace-changes.md)、[完整步骤](../references/how-to-read-workspace-changes.md)。精确源码：`packages/deliverables/workspace-changes/src/index.ts`；独立核查：`evidence/runtime/remaining-core-goal-deliverables-document-fs-workflow-review.md`。

## 编辑自有 Profile 插件原始配置

权威正文：[API 参考](../references/api-config-editor.md)、[完整步骤](../references/how-to-edit-owned-plugin-config.md)。精确源码：`packages/boot/config-editor/src/index.ts`；独立核查：`evidence/tests/config-editor-consumer`。

## 读取 Host 当前插件清单快照

权威正文：[API 参考](../references/api-host-plugin-inventory.md)、[完整步骤](../references/how-to-read-host-plugin-inventory.md)。精确源码：`packages/host/plugin-inventory/src/index.ts`；独立核查：`evidence/tests/host-plugin-inventory-consumer`。

## 用本机 Sandbox 限制进程

权威正文：[API 参考](../references/api-sandbox.md)、[完整步骤](../references/how-to-confine-local-process.md)。精确源码：`packages/sandbox/sandbox/src/index.ts`；隔离核查：`evidence/runtime/sandbox-ssh-how-to-review.md`。

## 组合并验证 SSH 远端执行世界

权威正文：[API 参考](../references/api-ssh.md)、[完整步骤](../references/how-to-run-ssh-execution-world.md)。精确源码：`packages/ssh/ssh/src/index.ts`；隔离核查：`evidence/runtime/sandbox-ssh-how-to-review.md`。

## 注册 Host Cordis Inspect Provider

权威正文：[API 参考](../references/api-cordis-inspect-provider.md)、[完整步骤](../references/how-to-register-cordis-inspect-provider.md)。精确源码：`packages/extensions/cordis-host-runner/src/inspect-registry.ts`；隔离核查：`evidence/tests/cordis-inspect-consumer`。

## 添加 Client slash 命令

权威正文：[API 参考](../references/api-client-command-ui.md)、[完整步骤](../references/how-to-add-client-command.md)。精确源码：`packages/client/ui-commands/src/client/index.ts`；隔离编译：`evidence/tests/client-command-consumer`。

## 完成工作区文件引用

权威正文：[API 参考](../references/api-file-reference.md)、[完整步骤](../references/how-to-complete-file-reference.md)。精确源码：`packages/context/file-reference/src/index.ts`；隔离核查：`evidence/runtime/context-skill-consumer-review.md`。

## 解析跨 Session 引用

权威正文：[API 参考](../references/api-session-reference.md)、[完整步骤](../references/how-to-list-session-references.md)。精确源码：`packages/context/session-reference/src/index.ts`；隔离核查：`evidence/runtime/context-skill-consumer-review.md`。

## 解析打包工作区运行时路径

权威正文：[API 参考](../references/api-workspace-dependencies.md)、[完整步骤](../references/how-to-resolve-workspace-dependencies.md)。精确源码：`packages/skill/tool-workspace-dependencies/src/index.ts`；隔离核查：`evidence/runtime/context-skill-consumer-review.md`。

## 装载 Agent 指令文件

权威正文：[API 参考](../references/api-agent-instructions.md)、[完整步骤](../references/how-to-load-agent-instructions.md)。精确源码：`packages/context/agent-instructions/src/index.ts`；隔离核查：`evidence/runtime/context-skill-consumer-review.md`。

## 注册自有 DeepSeek Messages route

权威正文：[Provider API](../references/api-llm-providers.md)、[完整步骤](../references/how-to-register-custom-deepseek-route.md)。精确源码：`packages/llm/llm-deepseek/src/host.ts`；隔离核查：`evidence/runtime/deepseek-custom-route-review.md`。

## 使用受 owner 管理的持久终端

权威正文：[Terminal API](../references/api-terminal.md)、[完整步骤](../references/how-to-run-persistent-terminal.md)。精确源码：`packages/terminal/terminal/src/index.ts`；隔离核查：`evidence/runtime/terminal-how-to-review.md`。

## 配置并使用实验 Agent Team

权威正文：[Team API](../references/api-experimental-agent-team.md)、[完整步骤](../references/how-to-use-experimental-agent-team.md)。精确源码：`packages/experimental/agent-team/src/index.ts`；隔离核查：`evidence/runtime/experimental-agent-team-auto-review.md`。

## 配置 pi-ai gateway 与官方包清单

权威正文：[内置 Provider](../references/api-llm-builtins-retry-meter.md)、[完整步骤](../references/how-to-configure-pi-ai-and-inventory.md)。精确源码：`packages/llm/llm-pi-ai/src/index.ts`、`packages/llm/plugin-package-inventory-deepseek/src/index.ts`；隔离核查：`evidence/runtime/pi-ai-inventory-profile-review.md`。

## 在自有 Client slot 渲染 Markdown

权威正文：[UI primitives](../references/api-client-ui-primitives.md)、[完整步骤](../references/how-to-render-markdown-slot.md)。精确源码：`packages/client/ui-primitives/src/index.ts`；隔离编译：`evidence/tests/client-primitives-consumer`。

## 为工具生成有界输出和省略说明

权威正文：[API 参考](../references/api-output-retention.md)、[完整步骤](../references/how-to-bound-tool-output.md)。精确源码：`packages/util/output-retention/src/index.ts`；隔离核查：`evidence/runtime/output-retention-review.md`。

## 为自有出站请求沿用进程代理策略

权威正文：[API 参考](../references/api-http-proxy.md)、[完整步骤](../references/how-to-use-outbound-http-proxy.md)。精确源码：`packages/util/http-proxy/src/index.ts`；隔离核查：`evidence/runtime/http-proxy-review.md`。

## 建立带覆盖关系的 Scope 标签注册表

权威正文：[API 参考](../references/api-scope-registry.md)、[完整步骤](../references/how-to-build-scoped-registry.md)。精确源码：`packages/core/scope/src/index.ts`；隔离核查：`evidence/runtime/scope-registry-review.md`。

## 运行独立 Loader Profile 启动 smoke

权威正文：[API 参考](../references/api-loader-smoke-profile.md)、[完整步骤](../references/how-to-smoke-loader-profile.md)。精确源码：`packages/test-support/loader-smoke/src/index.ts`；隔离核查：`evidence/runtime/loader-smoke-profile-review.md`。
