# 在 Profile 中安装、更新和移除插件 Bundle

## 目标与前置

目标版本为 `dsh-v0.2.0-rc.1`。任务结果是让一个独立插件包在指定 Profile 中贡献 patch 行，观察真实运行能力，并能停用或移除它。先按 [Bundle 与 Profile 装载边界](api-profile-bundle.md) 制作有 `package.json.dsh.bundle.patch` 的包；管理服务和结果字段见[当前 Profile 的插件与 Bundle 管理](api-plugin-manager.md)。本文使用 CLI，因而不要求 Creator 工具或 Web 页面已经挂载。

## 实现步骤

1. 在插件包的 `package.json` 放入可解析的运行入口，并声明 `dsh.bundle.patch` 为包内相对路径或有序路径数组；发布文件应包含这些 patch 和构建后的 JS。patch 中为每个待管理行写稳定 `id`，`name` 指向安装包公开模块入口。若 TypeScript 源码通过 Git 安装，需要自足的 `prepare` 构建；预构建 npm 包或 tarball 可避免安装时构建批准。共享实例的 DSH 包列入 `peerDependencies`，本地编译与测试所需声明列入 `devDependencies`。
2. 确定 Profile 名和安装 spec。`dsh plugin --profile demo add ./my-plugin` 将相对路径按调用者当前目录锚定，并把新 bundle 加入有序 `dsh.profile.bundles`；初次操作会创建 Profile，普通自定义 Profile 以 `@deepseek-ai/dsh-base` 开头。Git 地址、registry 名或 tarball 也可作安装 spec。未声明 `dsh.bundle` 的普通依赖可安装，但不产生 Profile 层；管理服务的 `installBundle` 则把“不是 bundle”作为失败并恢复 manifest 与 lockfile。
3. 用 `dsh --profile demo --dump-config` 核对 bundle 层与预期行，再运行 `dsh --profile demo`；观察插件 fiber、所注册的 Service、工具或 Client 行以及一次实际调用。配置 dump 仅核对拼接结果。若服务使用 Host `ctx.pluginManager`，先 `listBundles()` 核对 `enabled`、`error`、`rows`，`listPlugins()` 获取实际运行行；Creator 工具使用 `list_bundles`、`list_plugins` 的分页 JSON。
4. 要停用而保留依赖，在有管理服务的运行 Profile 调 `setBundleEnabled(packageName, false)`；要停用单行，先从 `listPlugins` 找到可写行的 `entryId`，再调 `setPluginEnabled(entryId, false)`。检查 `ChangeResult.application`，并重新读取清单与能力。`restart-required` 要在重启后再观察；`overridden` 表示后层仍胜出。CLI 可以用 `dsh plugin --profile demo remove <packageName>` 同时卸掉包与选择；管理服务 `removeBundle` 先撤选并卸载，再运行 pnpm remove，失败时可能留下部分变更。
5. 更新包时，先核对新版本对目标 DSH 的 peer 范围和发布文件，再通过 `dsh plugin --profile demo add <packageName>@<exactVersion>` 或安装同包的新 spec 走 Profile 的包操作。已有依赖替换需要**重启进程**才能读取新的 JS 模块代际；`--dump-config` 与新依赖版本只证明文件已变化。重启后核对 `listBundles` 的版本、目标行和一次实际行为。更新过程中不要把不兼容的版本豁免当作常规升级步骤；若确需例外，须对该精确插件/DSH 版本对单独授权并承担风险。

## 验证与完成判据

- 包构建或打包检查证明产物文件存在；`--dump-config` 证明层拼接；只有实际启动及调用能证明插件行为。
- 安装与更新要同时确认依赖、bundle 选择、目标 Loader 行和目标能力。管理调用读取 `changed`、`stage`、`application`、`error`、`packageResult` 和 `warnings`；`application: applied` 只覆盖 Host，应单独检查浏览器结果。
- 停用或移除后重新读取清单，并在新的 Session 或重启后确认目标能力不可用。Session 已有的事实和外部持久状态不随 bundle 卸载自动删除。
- pnpm 失败时查看返回的 `logPath`；安装失败可能留下下载物或 `pnpm-workspace.yaml` 中待批准构建，移除失败则读回现存 Profile 状态再重试。

## 条件与限制

CLI 可以把所有 pnpm 参数交给 Profile 目录中的包管理器；`add`/`install` 中命名的本地路径和 registry spec 会做 DSH peer 兼容预检，Git/tarball 需下载后检查，不兼容时尝试恢复 Profile manifest 与锁文件。pnpm 的 `prepare`/依赖构建脚本可在本机执行，所需批准与 Agent 工具调用批准相互独立。Profile patch、home patch、命令行 `--patch` 位于 bundle 后面，可以覆盖已保存选择或单行 `disabled`；因此每次更改后都以实际组合和运行行为为准。
