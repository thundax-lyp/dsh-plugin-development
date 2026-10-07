# 创建 DSH Plugin Development Skill

[English](README.md)

本仓库提供 `$create-dsh-skill`：从 DeepSeek Harness（DSH）源码创建绑定具体版本的离线 `dsh-plugin-development` Agent Skill。生成的 Skill 教开发者制作 DSH Cordis 包和插件，不是 DSH 通用百科。

## 版本选择

显式调用 `$create-dsh-skill [version]`。省略版本时，创建流程按数值版本顺序选择最新已发布的 `@deepseek-ai/dsh-agent` RC（`X.Y.Z-rc.N`）；传入版本时，要求与已发布版本精确匹配。每次创建记录一个 DSH tag 和 commit，产品事实只取自该 checkout。**本仓库不固定 DSH 版本基线。**

## 创建流程

[创建 Skill](.agents/skills/create-dsh-skill/SKILL.md)准备精确 checkout，盘点代码导出及其对象成员和文档中的“如何……”任务标题，逐项裁决公开 API 与任务候选，并冻结 `skill-source/`。随后在隔离目录构建完整 Skill，以同一 checkout 独立验证，再整体替换 `skills/dsh-plugin-development/`。旧的生成结果不参与新一轮内容生成。

入口搜索与证据规则见[入口范围](.agents/skills/create-dsh-skill/references/entrypoint-scope.md)；文档必需结构见[reference 模板](.agents/skills/create-dsh-skill/references/reference-template.md)。所有能力候选和源码事实须在冻结前完成裁决。

`skills/dsh-plugin-development/` 是生成结果，在创建期间可以不存在。只有完整通过验证的产物才应复制到消费项目的 `.agents/skills/`。本仓库不包含 DSH runtime 或产品插件。

## 验证创建流程

```sh
pnpm install --frozen-lockfile
pnpm verify:skill
pnpm test:validation
pnpm format:check
git diff --check
```

验证生成结果时，按[创建 Skill 的验证流程](.agents/skills/create-dsh-skill/SKILL.md#验证与交付)把生成目录及其精确 DSH checkout 显式传给检查器。Host 和 Client 示例分开检查。结构检查通过不代表运行时行为已验证。

## 仓库结构

```text
.agents/skills/create-dsh-skill/   # 创建说明、参考、脚本和测试
.dsh-skill-build/                 # 分版本工作区；产物与裁决证据可被跟踪
skills/dsh-plugin-development/    # 已验证的生成结果，可能暂不存在
scripts/                          # 独立的产物检查器
docs/00-governance/               # 提交与 PR 规则
```

## License

[Apache License 2.0](LICENSE)
