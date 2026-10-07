# 内置 Skill Provider 与模型载入器

## 可完成的插件任务

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-skill-filesystem` 是可在 Host 插件中装载的文件系统 provider；插件作者可指定一个受部署者管理的技能根目录。完整示例见 [装载自有 Skill 目录](how-to-mount-skill-directory.md)。自定义动态 provider 的注册契约见 [Skill Provider](api-skill-providers.md)。先装载 `@deepseek-ai/dsh-skill` 的 `ctx.skills`，再装 provider；模型能否调用还取决于所属 Agent 是否装载 `@deepseek-ai/dsh-tool-skill`。

## 对象类型与成员

| 包与公开入口                        | 可用成员、任务和边界                                                                                                                                                                                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@deepseek-ai/dsh-skill-filesystem` | `name`、`inject`、`Config`、`apply(ctx, config)`、`FileSystemSkillProvider`。`Config` 可设置 `providerName`、`includeDefaultRoots`、`dshHome`、`agentsHome`、`customSkillDirs`、`bundledSkillDir` 与 watcher 选项。`apply` 注册 provider 和观察/清理 effect；显式目录要由部署者提供可信路径。 |
| `@deepseek-ai/dsh-tool-skill`       | `name`、`inject`、`Config.catalogDescriptionMaxLength`、`apply(ctx, config)`、`SkillCatalogSource`。提供模型 `skill` 工具、可恢复的会话 catalog，以及用户显式 `/<name>` 载入。它不发现磁盘技能，且 catalog 只列模型可调用的技能。                                                             |
| `@deepseek-ai/dsh-skill-badge`      | `name`、`inject`、`apply(ctx)` 注册打包的 `dsh-badge` provider；base patch 有此行但默认 `disabled: true`。启用决定由部署 Profile 作出，插件不能把它当作默认可用技能。                                                                                                                         |
| `@deepseek-ai/dsh-skill-office`     | `name`、`inject`、`Config`、`apply(ctx, config)` 注册三个 Office 技能。`assetRoot` 必须含打包资源和 `scripts/check_office.py`；`node`/`cli` 指定外部执行文件，`cli:false` 明确关闭 LibreOffice Kit。sdk-app patch 装载该 provider，不代表每个 Profile 都有它。                                |

`FileSystemSkillProvider.get(ref)` 按已列出的目录候选读取技能正文，目录枚举本身不等于正文已加载。`SkillCatalogSource.kind` 标记 catalog 的来源种类，`entries` 与 `update` 由模型工具所属 Agent scope 使用，不是另一个磁盘扫描器。

## 文件系统根与生命周期

`skill-filesystem` 默认按 `cwd` 扫描项目 `.dsh/skills`、`.agents/skills`，再扫描 `customSkillDirs`、用户根和可选 bundled 根。`includeDefaultRoots:false` 只保留显式 `customSkillDirs` 与显式 `bundledSkillDir`，不会继承环境中的 bundled 根。根目录产生 candidate；`get` 才载入正文。`ctx.fs` 存在时，非可信根通过文件系统 service 读取；没有该 service 时按该包的 Host 路径读取。`watch` 默认开启，编辑后通过 `control.invalidate()` 更新 catalog；watch 启动失败可返回当时可读的候选，不能据此声称有后续变化通知。插件 scope 释放时 provider 停止受理、watcher 关闭。

`tool-skill` 以 Agent scope 查询 registry，并且载入时再次检查 `modelInvocable`。显式 `/<name>` 只针对真正的 `source.kind='user'` 消息和 `userInvocable` 技能；未知名称仍是普通文本。目录注册和模型工具是两个不同所有者，停用 provider 后旧 catalog 不构成继续读取的授权。Skill 正文来自部署的可信目录，应按部署权限管理；加载成功不等于模型任务完成。

## 目标证据与验证

公开导出及运行时：`packages/skill/skill-filesystem/src/index.ts`、`packages/skill/tool-skill/src/index.ts`、`packages/skill/skill-badge/src/index.ts`、`packages/skill/skill-office/src/index.ts`。组合清单：`packages/bundle/base/cordis.patch.yml`、`packages/bundle/web-app/cordis.patch.yml`、`packages/bundle/web-app/presets/standard.patch.yml`、`packages/bundle/sdk-app/cordis.patch.yml`。隔离消费者验证见 `evidence/runtime/skill-bundled-context-review.md`。
