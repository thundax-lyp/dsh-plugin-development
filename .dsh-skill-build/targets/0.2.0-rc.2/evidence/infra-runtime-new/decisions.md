# 基础设施候选裁决（dsh-v0.2.0-rc.2）

唯一事实 checkout：`639ed015397290b3745d163aafe02ffee4aa3f84`。下表仅覆盖本组调查入口；共享账本由主 agent 合并。

| 候选 ID | 公开入口与对象 | 目标版本证据路径 | 任务 ID | 建议及理由 |
| --- | --- | --- | --- | --- |
| `package:@deepseek-ai/dsh-package-manifest` | `DshBundleManifest`, `DshProfileManifest`, `DshPackageManifest`，`package.json.dsh` | `packages/util/package-manifest/src/types.ts`, `packages/bundle/base/package.json` | `ship-profile-bundle` | included：包公开类型定义 bundle patch 与 profile bundle 列表；由 launcher 消费。 |
| `package:@deepseek-ai/dsh-app-boot` | `Profile`, `ProfileManifest`, `loadProfileDirectory`, `bundlePatchFiles` | `packages/boot/app-boot/src/profile.ts`, `packages/boot/app-boot/README.zh.md`, `apps/cli/src/profile-boot.ts` | `ship-profile-bundle` | included：公开 helper 解释组合和失败；常规插件作者优先走 CLI，而非直接调用低层 boot。 |
| `package:@deepseek-ai/dsh` | `dsh --profile`, `--from-default-profile`, `--dump-config`, `dsh plugin` | `apps/cli/src/args.ts`, `apps/cli/src/plugin.ts`, `apps/cli/README.zh.md`, `apps/cli/tests/profile-initialization.spec.ts` | `ship-profile-bundle` | included：正式装载及安装入口。 |
| `composition:packages/bundle/base/cordis.patch.yml` | base bundle patch | `packages/bundle/base/package.json`, `packages/bundle/base/cordis.patch.yml` | `ship-profile-bundle` | merged：产品默认基础层，是组合证据，不是插件必须复制的模板。 |
| `composition:packages/bundle/web-app/cordis.patch.yml` | Web bundle patch | `packages/bundle/web-app/package.json`, `packages/bundle/web-app/cordis.patch.yml` | `ship-profile-bundle` | merged：Web 模式层，核实目标形态和 profile 顺序。 |
| `composition:packages/bundle/web-app/presets/cordis.patch.yml` | Agent preset 行 | `packages/bundle/web-app/presets/cordis.patch.yml`, `packages/bundle/web-app/cordis.patch.yml` | `customize-profile` | merged：只作为 preset 组合证据；preset 的对象契约归 Host 组。 |
| `package:@deepseek-ai/dsh-plugin-manager` | `PluginManager`、`dsh plugin` | `packages/boot/plugin-manager/src/index.ts`, `packages/boot/plugin-manager/README.zh.md`, `apps/cli/src/plugin.ts` | `install-profile-bundle` | included：管理已安装 bundle 与 profile 选中状态；涉及授权和构建脚本，不能概括为纯配置写入。 |
| `package:@deepseek-ai/dsh-settings` | `Settings`/表单投影 | `packages/settings/settings/src/index.ts`, `packages/settings/settings/README.zh.md`, `docs/cookbook/adding-a-settings-card.md` | `expose-live-config` | included：只投影 active、唯一 id 的 volatile 配置。Client 表单 UI 的 owner 归 Client 组。 |
| `package:@deepseek-ai/dsh-config-editor` | profile patch 写入服务 | `packages/boot/config-editor/src/index.ts`, `packages/boot/config-editor/README.zh.md` | `expose-live-config` | merged：Settings 的持久写入依赖；不是另一个作者配置 schema。 |
| `package:@deepseek-ai/dsh-storage` | `Storage`, `StorageBackend` | `packages/storage/storage/src/index.ts`, `packages/storage/storage/src/backend.ts`, `packages/storage/storage/README.zh.md` | `persist-plugin-records` | included：后端/形式注册表，需配置后端和领域层。 |
| `package:@deepseek-ai/dsh-storage-domain` | `defineDomain`, `domainTable`, `DomainFacility` | `packages/storage/storage-domain/src/spec.ts`, `packages/storage/storage-domain/src/index.ts`, `packages/storage/storage-domain/src/domain.ts` | `persist-plugin-records` | included：宿主非 Session 数据的公开领域 API。 |
| `package:@deepseek-ai/dsh-storage-json` | JSON 后端 | `packages/storage/storage-json/package.json`, `packages/storage/storage-json/README.zh.md` | `persist-plugin-records` | merged：介质组合选项，不把它当作独立领域 API。 |
| `package:@deepseek-ai/dsh-storage-sqlite` | SQLite 后端 | `packages/storage/storage-sqlite/package.json`, `packages/storage/storage-sqlite/README.zh.md` | `persist-plugin-records` | merged：介质组合选项，按目标 Profile 选择。 |
| `package:@deepseek-ai/dsh-webhook` | `WebhookRuntime.register`, `WebhookRule` | `packages/webhook/webhook/src/index.ts`, `packages/webhook/webhook/src/types.ts`, `packages/webhook/webhook/README.zh.md` | `respond-to-webhook` | included：有公开规则注册和可观察的 Session 创建路径；必须配合经验证的 provider adapter。 |
| `package:@deepseek-ai/dsh-api-gateway` | `TypertGatewayService`、`/api` | `packages/api/gateway/src/index.ts`, `packages/api/gateway/README.zh.md` | `expose-remote-api` | cross-owner：Gateway 传输与 Remote 业务 API 归 Client/Remote 组；本组只提供 Web route 边界线索，不另写对象事实。 |
| `export:@deepseek-ai/dsh-plugin-manager:./operations` | `runPluginCommand` | `packages/boot/plugin-manager/src/operations.ts`, `apps/cli/src/plugin.ts` | `install-profile-bundle` | included：应用壳集成 profile 包管理的公开入口；独立于运行中 `PluginManager` 服务。 |
| `export:@deepseek-ai/dsh-cmdline:.` | `CmdlineArgs`, `parseCmdline`, `AppExit` | `packages/boot/cmdline/src/index.ts`, `packages/bundle/web-app/src/startup.ts` | `parse-app-args` | included：自定义 profile 应用可解析启动器留下的 flag。 |
| `export:@deepseek-ai/dsh-host-webserver:.` | `WebServer`, `WebRoute`, `WebUpgradeRoute` | `packages/host/webserver/src/index.ts`, `packages/host/webserver/tests/` | `register-http-route` | included：具名 HTTP 和 upgrade 路由是公开 Host 扩展点，注册与释放由插件拥有。 |
| `export:@deepseek-ai/dsh-webhook-github:.` | `Config` | `packages/webhook/webhook-github/src/index.ts`, `apps/cli/config/examples/github-review/cordis.yml` | `respond-to-webhook` | included：目标版本的签名验证适配器，装载路径明确；202 只表示内存分发。 |

## 跨组关系

- Host 对象 `Context`、工具、Service、Agent preset 的权威契约归 Host 组。本组只说明 bundle/profile 装载这些行的条件。
- Client UI 页和 `dsh.client` 模块契约归 Client 组；Settings 页可链接本组 volatile 配置 HOW-TO。
- Remote 的业务方法与 Client 生成类型归 Client/Remote 组。`/api` 属 Gateway 运输层，不能把任意 Fetch 路由等同于公开 Remote 方法。
- `@deepseek-ai/dsh-package-manifest` 候选只有根类型导出；包 `exports['./src/*']` 是源码通配线索，不作为另一个稳定业务对象。其余本组相关公开子路径及默认 bundle 的逐 ID 处置在 `recommendations.json.entryDispositions`。

## 本组仍需主 agent 集成核验

- 把以上候选逐个映射到完整 `coverage.json` 与 `api-surface.json`，核对自动符号候选的成员级处置。
- 本组草稿是静态证据驱动；独立消费包构建、Profile 实际装载、Web hook 请求与存储重启行为需在总体验证执行，不应在分发文本里写成已执行。
