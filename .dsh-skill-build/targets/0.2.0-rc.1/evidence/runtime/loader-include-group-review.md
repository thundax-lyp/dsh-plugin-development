# Loader、Include、Group 源码裁决

目标：`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。

`vendor/loader/src/config/entry.ts`、`group.ts`、`tree.ts` 与 `isolate.ts` 定义公开配置行、子树、服务隔离和运行时操作；`vendor/include/src/index.ts` 定义 patch 顺序、YAML `!!js` 方言、Include 的初始读取/热刷新/写回。`vendor/group/src/index.ts` 仅将 Loader 的 `Group` 作为 default 重导出。`packages/boot/app-boot/src/index.ts` 将 `cordis:include` 和 `cordis:group` 注册为 DSH Host builtin，再挂载根 Include 并执行启动审计。三个包的 `package.json` 均提供目标 tag 的 `@deepseek-ai/*` 根入口；随包 README 的 `@cordisjs/*` 示例名与当前发布包不一致，因此未作为可直接复制的导入路径。

本批纳入三个 package 候选，将 Node internal ModuleLoader/ModuleJob 兼容类型、隔离 realm 实现对象和直接执行表达式的 helper 从普通 bundle 作者指导中排除，理由逐项写入 `api-surface.json`。`EntryOptions`、`PatchOptions`、Group 和 Include 等可用对象由 `api-loader-composition.md` 拥有。

隔离消费验证使用已编译的 `dsh-greet-bundle`，`group.patch.yml` 禁用原平面行并以 `cordis:group` 插入 `nested-greet`。目标 CLI 的配置 dump 显示两个预期行；真实启动后观察到 `greet` 注册、直接执行成功和失败边界，结果见 `evidence/tests/group-consumer-verification.md`。Include 热刷新、持久写入、isolation realm 转移、动态 Group 更新仍未运行。

HMR 留待单独裁决：目标 `dsh-base` 挂载的是 `@deepseek-ai/dsh-hmr`，不是 vendor 的 `@deepseek-ai/cordis-plugin-hmr`；前者在 `packages/boot/hmr/src/index.ts` 协调 Profile 配置与模块重载，并要求 Node `--expose-internals`。不能把 vendor HMR README 的行为直接写成 DSH 默认 Profile 行为。
