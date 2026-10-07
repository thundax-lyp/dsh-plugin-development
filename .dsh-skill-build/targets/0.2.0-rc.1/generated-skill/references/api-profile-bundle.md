# Bundle 与 Profile 装载边界

## 适用范围与入口

目标版本为 `dsh-v0.2.0-rc.1`。插件作者通过包的 `package.json` 声明 `dsh.bundle.patch`，在 patch 内插入或覆盖 Cordis 插件行；消费者用 `dsh plugin --profile <name> add <spec>` 安装并选择 bundle，再用 `dsh --profile <name>` 启动。`@deepseek-ai/dsh` 发布 `dsh` CLI。独立包的文件、构建、安装、工具调用和卸载示例见[制作并装载一个模型工具](how-to-register-model-tool.md)。

Profile 是 `$DSH_HOME/profiles/<name>` 下的一份可运行组合，其 `package.json` 有 `dsh.profile.bundles` 有序列表和 Profile 自己的依赖；Profile 的 `cordis.patch.yml` 是用户覆盖层。bundle 是提供 patch 的安装包，不是独立启动命令。`web`、`headless`、`sdk`、`sdk-minimal` 和 `acp` 是目标版本随附模板；自定义组合应以命名 Profile 和有序 patch 表达。

## 契约与运行语义

bundle manifest 的 `dsh.bundle.patch` 是一个相对包目录的文件路径，或有序路径数组。每个文件是 Cordis patch 列表。Profile 从空 entry 列表开始，按 `dsh.profile.bundles` 顺序应用每个 bundle 的 patch，再应用 Profile patch、home 级 patch 和命令行 `--patch`，后层的同 id patch 替换目标行的完整 `config`，不深度合并。内置 bundle 优先从 DSH 安装解析；外部 bundle 从 Profile 的安装目录解析。

`dsh plugin --profile <name> <pnpm-args...>` 将包操作转给该 Profile 的 pnpm 环境；相对文件安装 spec 以调用者当前目录为基准。未声明 `dsh.bundle` 的包可以作为依赖存在，但不会贡献可启用的层。安装之后先用 `dsh --profile <name> --dump-config` 查看实际组合，再启动 Profile。dump 只证明配置表达式和层拼接，不能证明插件已激活。

包可在 patch 中通过 `name` 指向它的公开模块入口；`id` 是后续层覆盖和诊断的稳定标识。独立消费包要发布可被 Node 解析的构建输出；本地链接可使用包自己的 `node_modules`，必须把需要与 Host 共享实例的 DSH 包列为 peer，并在开发环境提供声明依赖。`dsh plugin remove` 解除 Profile 依赖及 bundle 层，但卸载后行为仍要实际观察。

## 内置 Profile 的层选择

目标版本的内置 Profile 声明在 `app-boot/src/profile.ts`，每个 bundle 的 `package.json` 再声明其自身 patch。插件作者选择已有 Profile 作宿主时要先确认实际层，而不能仅凭 Profile 名推断服务可用：

| Profile       | 内置 bundle 顺序            | 与插件装载相关的限制                                                                                                |
| ------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `web`         | `dsh-base` → `dsh-web-app`  | Web patch 加入 Host/Web/Client 行，并连续应用自己的 preset patch；Client 插件仍须有自己的 Client 入口与浏览器验证。 |
| `headless`    | `dsh-base` → `dsh-headless` | patch 加入一次性任务驱动并关闭 HMR；不提供 Web 或浏览器运行时。                                                     |
| `sdk`         | `dsh-base` → `dsh-sdk-app`  | stdio JSON-RPC 服务占用标准输出，patch 关闭 HMR；插件日志不得直接污染协议输出。                                     |
| `sdk-minimal` | 只有 `dsh-sdk-minimal`      | 该 patch 自己插入完整的最小 Cordis 树，不继承 `dsh-base`；不能把 base 的可选服务当成已安装。                        |
| `acp`         | `dsh-base` → `dsh-acp-app`  | patch 加入 ACP 启动和服务并关闭 HMR；这不是普通 Web Profile。                                                       |

这些 patch 是已发布 bundle 的配置输入，供选择、覆盖和核对挂载条件；不是插件作者需要复制的模板。每个 Profile 后仍可加自己的 bundle、Profile patch、home patch 和命令行 patch。特别是后层对同一 `id` 的 `config` 是整行替换，覆盖内置行时要带上仍需保留的字段。上述内置组合来自 manifest 和装载源码；本次只对独立工具 bundle 的命名 Profile 路径做了实际启动验证，没有逐个启动所有内置 Profile。

## 对象类型与成员

| 对象                                            | 字段或命令                                                        | 语义                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `DshBundleManifest`                             | `patch: string \| string[]`                                       | 包内相对 patch 路径；数组按声明顺序串接。                               |
| `DshProfileManifest`                            | `bundles?: string[]`                                              | Profile 的有序 bundle 层；单个 bundle package 只贡献自己的一层。        |
| `ProfileLayer`                                  | `packageName`, `packageDir`, `patchPaths`, `patches`              | 装载器解析后的 bundle 身份、路径和 patch。                              |
| `Profile`                                       | `name`, `dir`, `layers`, `patchPath`, `patches`, `skippedBundles` | 已加载的 Profile 及未贡献层的原因；跳过一个 bundle 不保证剩余组合完整。 |
| `dsh --profile <name> --dump-config`            | CLI 命令                                                          | 打印配置出的组合；不挂载运行时插件。                                    |
| `dsh plugin --profile <name> add/remove <spec>` | CLI 命令                                                          | 在 Profile 中安装或移除包，并更新相应 bundle 选择。                     |

`@deepseek-ai/dsh-app-boot/profile` 是 Host 侧组成库；通常独立插件只需声明 bundle，由 CLI 处理 Profile 初始化和解析。若嵌入方直接使用它，须明确拥有自己的安装锚点、Profile 生命周期、错误和跳过项报告。

## 生命周期与状态

Profile manifest、已安装依赖和 patch 文件是持久配置；运行中的插件实例与 Cordis effect 是临时资源。启用 HMR 时配置变化可重新组合；禁用或未装载 HMR 时需要重启。CLI 的 add/remove 操作更改 Profile 后，还需检查 Loader 实际激活与卸载的结果。插件自身的持久业务事实不能只保存在 Profile patch 或进程对象里，应由其所属的状态接口管理。

## 失败、权限与边界

包解析、manifest 读取、兼容性或 patch 加载失败会形成 `skippedBundles`，启动器报告原因；用户 Profile 或 overlay 的解析错误会使启动失败。被跳过的 bundle 不贡献行，即使 `dsh.profile.bundles` 仍列出它。`dsh plugin` 的外部安装可能运行第三方构建脚本；git 依赖的 `prepare` 需要安装方允许构建。不要把配置 dump、已安装目录或成功的包操作单独当作插件行为证明。

## 验证

先对照目标版本的 CLI `bin`/参数解析、app-boot Profile 类型与解析实现、plugin-manager 包操作及真实 bundle manifest。隔离消费项目已验证工具 bundle 的 TypeScript 编译、包清单、add/dump、Profile 启动中的直接工具调用、remove 和重启后缺失。该验证没有创建 Agent 轮次，也未覆盖所有随附模板、HMR、失败回滚或 Client/Remote 侧。精确源路径见 `maintenance/source-map.md`。
