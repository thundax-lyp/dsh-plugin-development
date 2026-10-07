# 新 Skill 输出契约

`build-dsh-plugin-development-skill.mjs` 只读取冻结的 `skill-source/`，在目标目录的 `generated-skill/` 创建新 Skill。构建器不读取正式 `skills/dsh-plugin-development/**`，不会合并旧文件，也不会自动替换正式目录。

构建命令：

```text
node .agents/skills/create-dsh-skill/scripts/build-dsh-plugin-development-skill.mjs <target>
```

构建器先完整删除旧的 `generated-skill/`，再逐项校验冻结哈希，将 manifest 中声明的文件复制到临时目录并形成新的 `generated-skill/`。该目录是纯构建产物，不在其中进行人工编辑。

独立验证命令：

```text
node .agents/skills/create-dsh-skill/scripts/verify-generated-skill.mjs <target>
```

验证器确认：

- 生成目录只包含 manifest 声明的文件，内容与冻结源一致；
- Skill frontmatter 与展示元数据是结构合法、字段完整的受支持 YAML，目标 tag 与 commit 存在；
- 本地 Markdown 链接和锚点、JSON 代码块、行尾空白有效；
- Skill 内全部 UTF-8 文本产物没有 HTTP(S) URL 或作者机器路径。

在替换正式目录之前，继续以生成目录为输入核查目标源码映射并编译示例：

```text
python3 scripts/validate_skill.py --skill <target>/generated-skill --dsh <target>/checkout
node scripts/check_examples.cjs --dsh <target>/checkout --skill <target>/generated-skill
```

示例编译只核查所选代码块与精确版本的类型面。对生成 Skill 声称可独立创建、安装和挂载的代表性 HOW-TO，还须在隔离消费项目核查包依赖解析、构建输出、公开安装入口、真实 Profile 装载、可观察行为和卸载；跨 Client 或 Remote 的任务分别验证相应运行面。根据本次纳入的插件任务选择验证对象，并在交付报告中列明实际执行步骤与结果。若目标版本或环境不允许运行某条路径，记录 `Not Covered` 和影响，不把静态校验写成端到端通过。

`--skill` 仅检查指定 Skill 目录；省略时两个脚本保持原有行为，检查正式 `skills/dsh-plugin-development/`。示例编译依赖目标 checkout 的锁定依赖、Host 构建和 generated Remote 声明。

以上检查全部通过后，维护者才可整体替换正式 Skill 目录。替换属于仓库修改，不代表已经暂存、提交、推送、创建 PR 或发布。

```text
node .agents/skills/create-dsh-skill/scripts/replace-generated-skill.mjs <target>
```

替换脚本拒绝正式 Skill 中待保留的工作区文件。若旧产物的已跟踪文件全部已被有意删除、目录为空，允许把它视为待替换状态；残留的未跟踪或忽略文件仍会阻止替换。脚本使用独占事务目录复制并核对已验证的新产物，再把正式旧目录整体移走并将新目录放入。新目录就位是明确的替换提交点：提交点前发生错误时恢复旧目录；提交点后的旧备份清理失败不撤销已经完成的替换，而是在成功结果中返回 `cleanupWarning` 与残留 `backupPath`，供维护者处理。不进行逐文件覆盖或选择性保留。
