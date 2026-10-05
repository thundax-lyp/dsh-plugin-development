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
- Skill frontmatter、展示元数据、目标 tag 与 commit 存在；
- 本地 Markdown 链接和锚点、JSON 代码块、行尾空白有效；
- Skill 内没有 HTTP(S) URL 或本地绝对路径。

以上检查通过后，维护者才可整体替换正式 Skill 目录。替换属于仓库修改，不代表已经暂存、提交、推送、创建 PR 或发布。

```text
node .agents/skills/create-dsh-skill/scripts/replace-generated-skill.mjs <target>
```

替换脚本拒绝正式 Skill 中已有的工作区修改。它先复制已验证的新产物，随后把正式旧目录整体移走并将新目录放入；发生文件系统错误时恢复旧目录。成功后删除临时旧目录，不进行逐文件覆盖或保留。
