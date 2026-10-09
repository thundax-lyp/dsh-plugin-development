# 新 Skill 输出契约

`build-dsh-plugin-development-skill.mjs` 只读取冻结的 `skill-source/`，在目标目录的 `generated-skill/` 创建新 Skill。构建器不读取正式 `skills/dsh-plugin-development/**`，不会合并旧文件，也不会自动替换正式目录。

构建命令：

```text
node .agents/skills/create-dsh-skill/scripts/build-dsh-plugin-development-skill.mjs <target>
```

构建器先核对冻结素材，再把 manifest 声明的文件复制到临时目录并验证完整产物。验证成功后才整体替换 `generated-skill/`；验证失败时保留旧目录。`generated-skill/` 是构建产物，不在其中人工编辑。

独立验证命令：

```text
node .agents/skills/create-dsh-skill/scripts/verify-generated-skill.mjs <target>
```

验证器确认：

- 生成目录只包含 manifest 声明的文件，内容与冻结源一致；
- 新目标的 `SKILL.md` 内含完整任务表和全部纳入 API 对象到权威小节的索引，且不含单独的开发任务路由、术语或关键词索引文件；API 主题页与子主题页的链接、对象 owner 及小节独占通过冻结校验；
- Skill frontmatter 与展示元数据是结构合法、字段完整的受支持 YAML；入口和 source-map 包含精确 npm 版本，所有分发文件均不包含目标 commit；
- 分发正文不含创建进度或验证覆盖状态用语（如 `Not Covered`、`已覆盖`、`未覆盖`、`本次创建`），也不指向未分发的裁决账本；具体产品限制与读者验证步骤保留；
- 本地 Markdown 链接和锚点、JSON 代码块、行尾空白有效；
- 非 Markdown 的 UTF-8 文本不得包含 HTTP(S) URL 或作者机器路径；Markdown 的叙述正文也不得包含，围栏代码和行内代码不由此项离线边界检查覆盖。

在替换正式目录之前，继续以生成目录为输入核查目标源码映射并编译示例：

```text
node scripts/validate_skill.mjs --skill <target>/generated-skill --dsh <target>/checkout
node scripts/check_examples.cjs --dsh <target>/checkout --skill <target>/generated-skill
```

示例编译器只扫描 `references/` 第一层的 Markdown，并选择其中的 TypeScript 代码块；新目标的完整代码示例放在 `references/example-*.md`。该检查只能证明被选中代码块与目标版本类型面相容，不能证明多文件包可构建或已装载。对声称可独立创建、安装和挂载的代表性 HOW-TO 及其 example，还须在隔离消费项目检查依赖解析、构建输出、公开安装入口、真实 Profile 装载、可观察行为和卸载；跨 Client 或 Remote 的任务分别验证相应运行面。按本次纳入的插件任务选取验证对象，在交付报告中逐项列出执行步骤和结果。无法运行的路径记录为 `Not Covered` 并说明影响，不把静态检查写成端到端验证。

`--skill` 仅检查指定 Skill 目录；省略时两个脚本保持原有行为，检查正式 `skills/dsh-plugin-development/`。`--dsh` 验证传入 checkout 的 `HEAD` 与该 npm 版本对应 tag 指向同一 commit，并核查 source-map 路径；commit 不从分发 Skill 读取。示例编译依赖目标 checkout 的锁定依赖、Host 构建和 generated Remote 声明。

以上检查全部通过后，维护者才可整体替换正式 Skill 目录。替换属于仓库修改，不代表已经暂存、提交、推送、创建 PR 或发布。

```text
node .agents/skills/create-dsh-skill/scripts/replace-generated-skill.mjs <target>
```

替换脚本拒绝正式 Skill 中待保留的工作区文件。若旧产物的已跟踪文件全部已被有意删除、目录为空，允许把它视为待替换状态；残留的未跟踪或忽略文件仍会阻止替换。脚本使用独占事务目录复制并核对已验证的新产物，再把正式旧目录整体移走并将新目录放入。新目录就位是明确的替换提交点：提交点前发生错误时恢复旧目录；提交点后的旧备份清理失败不撤销已经完成的替换，而是在成功结果中返回 `cleanupWarning` 与残留 `backupPath`，供维护者处理。不进行逐文件覆盖或选择性保留。
