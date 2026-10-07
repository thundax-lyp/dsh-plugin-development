# rc.1 Boot 与 API Controller 裁决

目标 checkout `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。以 package exports、Host 实现和实际 Web/base patch 分别裁决，未将包名或根文件存在当作扩展契约。

## Boot

| 入口 | 具体处置与源码 |
| --- | --- |
| `@deepseek-ai/dsh-config-editor` | **纳入受信任 Host 管理插件的独立任务**。`packages/boot/config-editor/src/index.ts:26-157` 的公开 `ConfigEditor` service 有 `documentPath`、`entries()`、`configuration()`、`edit(entry, change)`；它不是只供 Settings 包私用的函数。base `cordis.patch.yml:97-99` 在有 `profileContext` 时装载它。普通 UI 设置仍由 `dsh-settings` 包装成 JSON/volatile/revision/secret-redaction；见 `api-config-editor.md` 和完整 `how-to-edit-owned-plugin-config.md`。|
| `@deepseek-ai/dsh-app-boot` 根 | 合并至 `api-profile-bundle.md` 的 Profile/bundle 组成任务。`packages/boot/app-boot/src/index.ts` 输出 boot、profile manifest/patch 组合、schema dump、兼容性、包解析工具；普通第三方 Cordis 插件只需包 manifest 与 patch，不应自行调用 `boot()` 或重建 profile service。嵌入式 launcher 是不同任务，现有 Profile reference 已给入口范围。|
| `@deepseek-ai/dsh-app-boot/worker/profile-resolution-bootstrap` | **排除普通插件任务**：`src/profile-resolution/worker-bootstrap.ts` 只有模块求值副作用，从 Worker 环境数据读取 Harness 注册的 runtime resolution 并安装 import 拦截；没有可调用对象或独立 provider slot。不能以导出子路径推断插件应主动 import。|
| `@deepseek-ai/dsh-cmdline` | 主代理已单独处理；本轮未重判。|

`evidence/tests/config-editor-consumer/` 从 HOW-TO 原样抽取 TypeScript、包清单与 patch；`npm install --ignore-scripts --no-audit --no-fund`、`npm run build` 在发布的 rc.1 依赖上通过。`node smoke.mjs` 用 `dsh-app-boot.boot()`、真实 Profile bundle/Loader/ConfigEditor、两个示例 service：初值 10，输入 0 被拒，`edit` 后活动 `Volatile.get()` 为 7，Profile patch 有 `limit: 7`，`configuration().override.limit` 为 7。未在本轮模拟写失败、HMR 并发、home/CLI overlay、重启还原；这些路径由目标源码的 `packages/settings/settings/tests/editor-failures.spec.ts`、`configuration.spec.ts`、`configuration-inheritance.spec.ts` 提供行为定位，但这些测试未在本隔离验证中执行。

## 内建 API Controller

`packages/bundle/web-app/cordis.patch.yml:121-149` 明确装载以下固定 Host Controller。它们各自 `extends TypertRemoteService`，构造时固定 namespace/所依赖的内部 service；`./remote`、`./typert` 是生成跨侧 binding，`./types` 是该固定 UI 协议的数据形状。普通第三方 Host 插件在所属领域的 service/provider seam 扩展，不重复注册这些 controller，也不把生成 Client binding 当通用 RPC 构造器。

| 包 | 已排除处置的准确边界 |
| --- | --- |
| `dsh-api-account-controller` | `src/index.ts:10-121` 固定 `deepseekAccount` 与 `agents`，namespace `account`；账号扩展任务在 Account/credentials service。|
| `dsh-api-job-controller` | `src/index.ts:43-130` 固定 `jobs` 与 `typert`，提供 Web job 跟踪；第三方 job 生产者应走 Jobs service。|
| `dsh-api-session-controller` | `src/index.ts:99-528` 集成 Sessions/Agent/model catalog/控制流；类型多但都是该 Web 页面协议，不是任意 Session controller provider。|
| `dsh-api-settings-controller` | `src/index.ts:76-270` 固定 `settings`/credentials 页面 Remote；第三方设置贡献走 SettingsForms/Client form。|
| `dsh-api-terminal-controller` | `src/index.ts:75-379` 固定 Subprocess/SandboxPolicy 的 Web terminal Remote；外部终端实现走底层 Subprocess/Terminal backend。|
| `dsh-api-workspace-controller` | `src/index.ts:51-200` 固定 WorkspaceRegistry 的 Web 工作区命令与活动订阅；普通工作区扩展走 Registry/provider。|
| `dsh-api-workspace-files` | `src/index.ts:183-465` 固定 `fs`/SandboxPolicy/Sessions 的文件浏览 Remote；文件系统扩展走 `ctx.fs` provider 与权限策略。|

`dsh-api-remotes` 根的 `apply` 和固定 `API_REMOTE_FORWARDED_EVENTS` 只是把此应用选定的 Cordis 事件转给 Gateway；`src/index.ts` 不是第三方事件注册表，`./client` 汇集本应用多个生成 Client binding，`./types` 只定义 allowlist 事件名。建议合并 `dsh-api-gateway` 的 Remote 传输专题，而不是单列通用扩展任务。`dsh-api-gateway/stream-protocol` 和 `./types` 是根/Client 已纳入 Gateway 契约的同一 wire 类型，按该 reference 自包含映射或排除仅供内部解析的帧 helper；不要把裸协议常量当插件作者另一个工作流。
