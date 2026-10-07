# 在 Profile 中启用 Host HMR

## 目标与前置

目标版本 `dsh-v0.2.0-rc.1`。让已安装 Profile 的 patch 变化触发 Loader 重组，并在明确指定模块监视根时观察源码热更。先读 [Host HMR 契约](api-host-hmr.md)、[Bundle 与 Profile](api-profile-bundle.md) 和 [Loader 配置](api-loader-composition.md)。基础 bundle 的 `hmr` 行在部分 Profile 被后续层禁用，先以最终配置为准。

## 实现步骤

1. 在隔离的 `DSH_HOME` 初始化目标 Profile，运行 `dsh --profile <name> --dump-config`。检查最终树中的 `hmr` 行、`disabled` 与 `config.root`。配置 dump 只证明层拼接，不证明 watcher 已启动。
2. 需要配置层热更时，在 Profile 自己的 `cordis.patch.yml` 中启用目标 id `hmr`。基础 bundle 的 `root: []` 保留 Profile manifest/patch 的独立监视。修改 Profile patch 前保存原内容，并通过原子替换写入有效 YAML；不要把整个文件先清空再重写。
3. 需要插件源码热更时，再把**明确的源码根**放入 `hmr.config.root`。该路径相对 HMR owner 的 `baseUrl`，必要时用 `base` 设置基目录。不要把所有依赖目录都纳入监视；目标源码进入构建输出或 Loader 模块图后，HMR 才能替换已装载的 fiber。已发布依赖包的 JS 更新仍需重启进程核对。
4. 启动目标 Profile，等 `appReady` 后修改自己拥有的插件 patch。观察原 fiber 的 disposer 完成、新 fiber 激活以及最终服务或工具结果。若要串行执行自有配置写入，可在实际挂载了 `ctx.hmr` 的 Host 插件中调用 `await ctx.hmr.runExclusive(async () => { /* write one owned change */ })`，并处理失败；不把包安装操作放入这条队列。
5. 再修改受监视的模块构建产物，观察 `hmr/reload`、新实例行为与旧实例清理。修改 bundle 清单时要单独验证 manifest 列表的重组；只有变更列表顺序或成员才触发该路径。最后撤销自己插入的 patch，等待卸载并停止 Profile，确认 watcher 与异步任务静止。

## 验证与限制

本次已在目标发布版本的隔离 Profile 验证 patch 插入、配置改值和撤销：记录中依次出现 `active: first`、`disposed: first`、`active: second`、`disposed: second`。模块文件替换、manifest 列表重组和重启后持久状态尚未实际运行。`hmr/reload` 或配置 dump 不能单独证明业务功能；完成判据是旧资源释放与新行为可观察。热更不保存 Session 事实，需恢复的模型可见状态由其所有者另行持久化。
