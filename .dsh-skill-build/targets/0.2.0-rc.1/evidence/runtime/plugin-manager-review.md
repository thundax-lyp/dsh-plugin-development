# Profile 插件管理与包操作源码裁决

目标：`dsh-v0.2.0-rc.1`，`4878cdabd87d4041bdaff61d04c966883b9fd07a`。本页是取证账本，不是运行验证结果。

## 公开入口与真实挂载

- `packages/boot/plugin-manager/package.json` 发布根、`./types`、`./operations`、`./tools`、`./registry`、`./remote` 与 `./typert`；根入口服务的 `PluginManager` 及方法在 `src/index.ts`，结果与 Cordis 事件在 `src/types.ts`。包有源码通配子路径，但不把每个内部实现文件当作插件任务入口。
- `packages/bundle/base/cordis.patch.yml` 插入 `plugin-manager` 服务行并默认禁用 `tool-plugin-manager`；`packages/bundle/web-app/cordis.patch.yml` 插入 Web 管理 UI，预设 patch 能选择工具。`src/tools.ts` 对全部 action 先执行 `approveEscalation`，调用时权限而非全局授权。
- `apps/cli/src/args.ts` 识别 `dsh plugin --profile`；`apps/cli/src/plugin.ts` 把普通参数交给 `runPluginCommand`，仅精确版本例外命令由 CLI 自行处理。`src/operations.ts` 的 `runPluginCommand` 初始化 Profile、加文件锁，`runProfilePnpm` 执行 pnpm 并 reconcile 新 bundle 与删除的依赖。

## 语义裁决

- `src/index.ts` 的 `listPlugins` 读取 Loader 与 Profile patch，只允许唯一匹配且属于 Profile Include 的行写入；管理组件受保护。`setPluginEnabled` 用稳定 `entryId` 找行，在 Profile patch 写 `disabled`，更高 overlay 可使结果为 `overridden`。
- `listBundles` 覆盖 Profile 依赖、安装拥有的 bundle 和已选择但无有效 patch 的条目；`enabled` 来自 manifest 选择，与实际装载分开。`setBundleEnabled` 更新 `dsh.profile.bundles`，停用不卸依赖，重新启用追加到末尾。
- `installBundle` 依次检查 GitHub 连通性、registry plan、pnpm add、bundle manifest、DSH peer、patch 可加载性；失败或取消恢复 `package.json` 与 `pnpm-lock.yaml`。构建批准写入的 `pnpm-workspace.yaml` 不在恢复集；下载物也可能保留。安装调用的 `stage` 可由 `install` 走到 `enable`，后段失败不回滚已安装依赖。
- `cancelInstall` 在 pnpm/Git 检查阶段停止并等待恢复，在应用阶段返回 `too-late`；`waitForInstall` 只记在途 request。`removeBundle` 先撤选、卸载再 pnpm remove，失败保留已完成动作。无 HMR 且当前进程使用该 bundle 时拒绝服务移除。
- `src/operations.ts` 对本地路径和 registry 的命名 spec 在 pnpm 前做 peer 检查；Git/tarball 下载后检查。`packages/boot/app-boot/src/plugin-compatibility.ts` 只检查 `@deepseek-ai/dsh` 和 `@deepseek-ai/dsh-*` peer，prerelease 参与范围；精确版本例外不能授权脚本。
- `src/index.ts` 的 `change()` 把存盘变化与应用结果分开，成功、失败和取消都发 `plugin-manager/changed`；外部 HMR watcher 更新不会触发该事件。HMR 存在时 `reload` 调 `reconcileProfilePatches`；无 HMR 时 `restart-required`。已有包 JS 替换仍需要进程重启。
- `packages/util/package-manifest/src/types.ts` 公开 `DshBundleManifest.patch: string | string[]` 和 `DshProfileManifest.bundles?: string[]`。`packages/boot/app-boot/src/profile.ts` 的实际读取按 bundle 顺序、Profile patch、launcher overlays 组合；启动跳过不兼容或不可读取的 bundle，并保留诊断。CLI 相对 spec 由 `anchorPathSpec` 按调用目录锚定。

## 行为测试线索（本次未运行）

- `packages/boot/plugin-manager/tests/manager.spec.ts` 覆盖服务在真实 Include/Loader 中的列表、启停、HMR、安装回滚、脚本批准、移除、取消、registry 回退和版本兼容；部分安装用真实本地 pnpm 与 Git fixture。
- `packages/boot/plugin-manager/tests/operations.spec.ts`、`operations-process.spec.ts` 覆盖 CLI 共用包操作；`tools.spec.ts` 覆盖工具 action 与权限；`apps/cli/tests/plugin.spec.ts` 覆盖 CLI 精确版本例外。
- `apps/cli/tests/profiles/web/tests/creator-plugin-manager.expected.e2e.ts` 是 Web Creator 组合线索；存在不证明本次已跑页面测试。

## 未验证边界

本次未运行目标仓库测试，也未在独立 Profile 实际执行新的安装、更新、移除或 Web 页面交互。源码与已有测试只支持上述契约裁决；真实 pnpm、HMR、浏览器同步、失败恢复仍需消费端验证。与本专题相邻的 bundle 制作和先前隔离消费测试由其他证据页记录，不能由本页扩张为管理服务运行证明。
