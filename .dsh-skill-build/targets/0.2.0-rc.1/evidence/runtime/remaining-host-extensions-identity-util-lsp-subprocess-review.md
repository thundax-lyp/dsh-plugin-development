# Host、扩展及工具包逐包裁决

目标：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。以下路径均相对目标 checkout 的 `packages/`。`included` 是可由插件作者实际执行的主题；`merged` 表示由已有 reference 承接；`excluded` 表示仅有仓库/产品/通用工具职责，没有独立 DSH 插件作者任务。

| 包 | 裁决 | 精确源码证据与归属 |
| --- | --- | --- |
| `host/directory-picker` | merged | `src/index.ts` 导出抽象 `DirectoryPicker` 和 capability union；已由 `api-guardrails/host-platform.md` 承接。 |
| `host/directory-picker-native` | merged | `src/index.ts` 的 `NativeDirectoryPicker extends DirectoryPicker` 是 OS chooser 具体 backend；归 host-platform。 |
| `host/directory-picker-browse` | merged | `src/index.ts` 的 `BrowseDirectoryPicker` 提供 Host 目录遍历具体 backend；归 host-platform。 |
| `host/directory-picker-auto` | merged | `src/index.ts` 的 `apply` 注入 `webServer`、`loader` 并按环境选择 backend/UI；归 host-platform 的 Profile 组合。 |
| `host/open-in-app` | merged | `src/index.ts` 的固定路由/目录启动插件，无可注册新应用 SPI；归 host-platform。 |
| `host/webserver` | merged | `src/index.ts` 提供 `ctx.webServer.register/registerUpgrade/registerFallback`、index 注入；已有 `api-guardrails/web-ingress.md` 与认证路由 HOW-TO。 |
| `host/frontend-static` | merged | `src/index.ts` 的 `apply` 占用唯一 fallback 座位，服务配置的 SPA dist；归 web-ingress/Profile，不建议第三方重复认领。 |
| `host/plugin-inventory` | included | `src/index.ts` 导出 `readPluginInventory(ctx)` 与 Remote `PluginInventoryGateway.list()`，`src/types.ts` 定义只读快照；新增 `api-guardrails/host-plugin-inventory.md`、`how-to/read-host-plugin-inventory.md`。 |
| `host/product-telemetry-otel` | merged | `src/index.ts` 的 `ProductTelemetry` service/Config；已由 `api-guardrails/runtime-diagnostics-telemetry.md` 承接产品事件通道。 |
| `extensions/cordis-host-runner` | included for inspect; dynamic runner excluded | `src/inspect-registry.ts` 的 `CordisInspectRegistryService.register` 是第三方 Host 只读查询 provider seam，见 `api-guardrails/cordis-inspect-provider.md`；`src/index.ts` 的 `DynamicCordisRunnerService.define/run/stop` 接受会话定义的临时 VM 包，不当离线发布插件的 Profile 装载路径。逐符号见 `high-volume-remote-subagent-api-review.md`。 |
| `extensions/cordis-client-runner` | excluded | `src/index.ts` 的 `apply():void {}` 是空 Client 标记；具体 Client 动态运行在其 client 入口，属于同一动态实验系统。 |
| `extensions/tool-cordis` | merged | `src/index.ts` 注册模型可见的动态插件工具及 inspect 查询工具，依赖 tools/cordisInspect；可与自定义 Host inspect provider 组合，但它不是作者安装已发布插件的入口。 |
| `extensions/ui-cordis` | excluded | `src/index.ts` 的 `apply():void {}` 为 UI 装载标记；不承载独立 Host 插件任务。 |
| `identity/anonymous-user-id` | excluded | `src/index.ts` 的 `getOrCreateAnonymousUserId` 在 DSH_HOME 创建/读取遥测反馈 ID，进程路径 memo；这是产品身份设施，非第三方插件身份/权限 API。 |
| `util/atomic-write` | merged | `src/index.ts` 的原子写与文件锁是通用本地 IO 原语；持久化事务责任仍在 Session/Storage 专题，不另建 DSH 能力。 |
| `util/brand` | merged | `src/index.ts` 的 `Branded`、`brandString/brandNumber` 是 opaque ID 类型工具；各领域 reference 定义自己的身份语义。 |
| `util/chunked-list` | excluded | `src/index.ts` 的 append/iterate/schema 是纯数据结构工具，无独立插件组合任务。 |
| `util/code-language` | excluded | `src/index.ts` 的路径到高亮/读取提示映射是展示工具，无服务或扩展注册入口。 |
| `util/crypto` | excluded | `src/index.ts` 的 UUID/base64 函数是通用 helper，不赋予 DSH 授权或会话身份语义。 |
| `util/deque` | excluded | `src/index.ts` 的 `Deque<T>` 是内部队列数据结构，无插件扩展任务。 |
| `util/home-paths` | merged | `src/index.ts` 的 `resolveDshHome`/路径展开用于部署数据目录；由 Profile/Storage 文件归属说明承接。 |
| `util/http-proxy` | excluded | `src/index.ts` 明确是库而非插件，`installProxyFromEnvironment` 安装进程级 undici dispatcher；启动器统一决定代理，不应由独立插件竞争全局策略。 |
| `util/launch-environment` | merged | `src/index.ts` 的 `launchEnvironmentOf(ctx)` 和层快照给 shell/进程环境边界；已由 `api-guardrails/shell-env.md` 承接。 |
| `util/lazy-require` | excluded | `src/index.ts` 的 `createLazyRequire` 是按需加载 helper，无 DSH 组合语义。 |
| `util/native-command` | merged | `src/index.ts` 的 `runNativeCommand`、本机应用查找是 Host 实现工具；开放应用/目录选择的可消费边界归 host-platform，不能绕过相应认证/权限。 |
| `util/output-retention` | merged | `src/index.ts` 的 `ItemRetainer/TextRetainer` 是输出裁剪原语；具体 shell/subprocess/spill 的省略通知和 Session 事实由所属专题解释。 |
| `util/package-manifest` | merged | `src/index.ts` 仅导出包本地化元数据类型；插件 manifest/Loader 归 `api-guardrails/profile-bundle.md`。 |
| `util/time` | excluded | `src/index.ts` 的时区标准化函数服务 UI/记录显示，无独立插件任务。 |
| `util/timeout` | merged | `src/index.ts` 的 deadline/watchdog/clamp 原语供各调用方组合；取消/资源所有权在 subprocess/工具专题定义。 |
| `util/values` | merged | `src/index.ts` 的 JSON 值检查、冻结/复制原语被各服务使用；模型工具输出与事件 canonicalization 归 tools/session-log。 |
| `util/workspace-path` | merged | `src/index.ts` 的 cwd 路径解析/展示 helper；真实 FS 权限与 Session cwd 归 filesystem-policy/workspace。 |
| `lsp/lsp` | included | `src/index.ts` 的 `Lsp` provider registry/service；已有 `api-guardrails/lsp.md` 与 LSP HOW-TO。 |
| `lsp/lsp-stdio` | merged | `src/index.ts` 的 `apply` 注入 fs/lsp/subprocess、注册 stdio LSP server；归 lsp 组合。 |
| `lsp/tool-lsp` | merged | `src/index.ts` 的 `apply` 注册内置模型 LSP 工具；归 lsp/tools，不另当 SPI。 |
| `subprocess/subprocess` | included | `src/index.ts` 的抽象 `SubprocessRuntime`、清理/环境契约；已有 `api-guardrails/subprocess.md` 与 HOW-TO。 |
| `subprocess/subprocess-local` | merged | `src/index.ts` 的 `LocalSubprocessRuntime` 具体实现；归 subprocess 的 Host provider 组合。 |
| `subprocess/win32-process` | excluded | `src/index.ts` 导出 Windows ABI/进程句柄 helper；仅属 Windows 具体 runner 实现，非跨平台插件 SPI。 |
| `ssh/subprocess-ssh` | merged | `src/index.ts` 的 SSH subprocess provider 是具体执行环境后端；归 subprocess/SSH 专题，不把远端执行误当本机 Node 子进程。 |

## 实际独立验证

- `evidence/tests/office-to-pdf-consumer` 从两篇 Office/workspace-changes HOW-TO 原样提取 TS，精确 npm 声明 `tsc -p tsconfig.json` exit 0；Office runtime smoke 通过装载、超限读取前拒绝和清理。真实转换和 workspace turn/Git Profile 未运行。
- `evidence/tests/host-webserver-consumer` 从本轮曾拟写的基础路由代码编译并运行，精确 npm `tsc -p tsconfig.json` 与 `node dist/route.js` exit 0；`node verify.mjs` 得到 `PASS route, collision, deregistration`。因已有权威 web-ingress 文档，未保留重复专题。该测试不覆盖认证、upgrade、SSE、gzip 或浏览器。
- `evidence/tests/host-plugin-inventory-consumer` 从新增 HOW-TO 原样提取 TS，精确 npm `tsc -p tsconfig.json` 与 `node dist/inventory.js` exit 0；`node verify.mjs` 得到 `PASS disabled Loader entry snapshot`，观察 `enabled:false`、`fiberPhase:null`。首次尝试直接访问 `ctx.pluginInventory` 编译失败，因发布类型未增补该 Context 字段；示例已改为公开 `readPluginInventory(ctx)` 并重新编译通过。未验证跨重启、预设 roster 或远程权限。
