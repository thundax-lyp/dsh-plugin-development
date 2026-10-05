# 仓库协作规范

## 定位与边界

本仓库维护 `dsh-plugin-development` Agent Skill：面向 DeepSeek Harness（DSH）Cordis 包和插件的离线开发指南。唯一固定基线为 **`dsh-v0.1.2-rc.1`**；只有用户明确要求升级时才能改变，不混用其他 tag 或持续变化分支的事实与 API。

`skills/` 是待编辑和分发的 Skill 源目录，不是本仓库的 Agent Skill 安装目录；消费项目安装时才复制到其 `.agents/skills/`。

仓库只容纳 Skill、参考文档及其维护设施。不添加 DSH runtime、示例产品、生成的能力目录或无关插件实现；不将示例、快照或实验包当作已发布默认组件。有源文件和生成器的产物必须通过所属生成流程更新。

## 文件职责

| 文件或目录                                                                         | 职责                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| `README.md`、`README_zh-CN.md`                                                     | 对外说明项目用途、使用方式与边界                 |
| `skills/dsh-plugin-development/SKILL.md`                                           | 适用场景、基线、路由流程、跨主题不变量和完成边界 |
| `skills/dsh-plugin-development/agents/openai.yaml`                                 | 展示元数据、默认提示词和调用策略                 |
| `skills/dsh-plugin-development/references/`                                        | 自包含的主题参考文档、示例及验证矩阵             |
| [开发路由](skills/dsh-plugin-development/references/plugin-development-routing.md) | 按任务选择最小相关参考集，不复制正文             |
| [源码映射](skills/dsh-plugin-development/maintenance/source-map.md)                | 维护与审计使用的固定版本证据索引                 |
| [测试与文档维护](skills/dsh-plugin-development/maintenance/skill-maintenance.md)   | 详细验证命令、生成流程及发布检查                 |
| [基线升级 Skill](.agents/skills/dsh-skill-upgrade/SKILL.md)                        | 人工唤起的完整基线升级流程                       |
| [提交规则](docs/00-governance/COMMIT-RULES.md)                                     | 提交边界、标题与提交前检查                       |
| [PR 规则](docs/00-governance/PR-RULES.md)                                          | 分支、PR 交付、审查与合并规则                    |
| [PR 模板](.github/pull_request_template.md)                                        | PR 交付说明与验证证据格式                        |

## 工作流程

1. **确认现状。** 检查 `git status` 和相关差异，区分当前任务、用户已有变更与暂存内容。保留无关或归属不明确的改动。
2. **定位事实。** 普通插件开发使用路由和主题参考；维护 Skill 时从 source-map 定位精确基线中的实现及证据，不借用其他分支的同名文件。
3. **修改事实所属文件。** 同步受影响的入口、元数据、路由和中英文概览；没有事实变化的文件不为形式一致而改写。
4. **验证并交付。** 按下方矩阵运行检查，审阅完整任务差异，报告结果与剩余限制。默认保留工作区变更，不暂存或提交。

## 内容与证据

### 事实裁决

冲突按以下优先级处理：**公开类型与运行时代码 → 可执行仓库门禁 → 行为测试 → 所属包 README → 其他叙述文档**。

明确区分目标版本已实现的行为、仓库强制规则、基于现有原语推导的建议和外部协议要求。不将设计建议写成产品事实。文件、符号或测试路径存在，只能作为定位线索，不能代替语义核查或实际验证结果。

### 文档组织

- 每项事实只有一个权威归属，其他位置通过相对链接引用；标题和锚点保持稳定。
- 每份 reference 对其路由主题自包含，不依赖无关文档才能理解；路由保持索引职责。
- `SKILL.md` 保持简洁，详细解释、代码骨架和验证矩阵放入对应 reference。
- 公开文档描述当前行为；保持概览、Skill 入口、元数据、路由与参考内容一致，不将编辑历史写入产品说明。

### 代码示例

示例必须匹配固定 tag 的公开类型、包导出和运行时行为，不虚构 API。使用完整、最小的骨架，并满足：

- 每个注册和异步资源都明确所有权、失败、取消与清理路径。
- 模型可见事实能从 Session 日志重建。
- 模型工具只有一份规范 JSON 结果，渲染保持纯函数。

## 验证与报告

按变更面选择最小适用检查；公开契约、共享基础设施、生命周期或分发变化需要扩大验证范围。纯文档修改不运行无关的 DSH runtime 测试。具体命令与发布流程以[测试与文档维护](skills/dsh-plugin-development/maintenance/skill-maintenance.md)为准。

| 变更面                | 必需检查                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| 任意文档或治理变更    | 格式、本地 Markdown 链接及锚点、行尾空白、`git diff --check`、任务差异范围                            |
| 任意 Skill 变更       | 上述检查，加 frontmatter/元数据合法且一致、基线一致、全部 JSON 代码块可解析、Skill 目录无 HTTP(S) URL |
| TypeScript 示例变化   | 对照固定版本声明编译；Host/Client 编译面分开验证                                                      |
| source-map 变化       | 在精确基线 checkout 核查每条路径及专题归属                                                            |
| 基线升级或 Skill 发布 | 完整发布验证，含示例编译、源码映射和必要的生成声明/构建前置                                           |

CI 保持两个独立、可见的 job：`Governance` 检查必需文件与格式；`Skill Integrity` 检查 Skill 元数据、基线、离线边界、Markdown 目标和 JSON 代码块。不能将两者隐藏在一个不透明的聚合脚本中。当前 CI **不覆盖** TypeScript 示例编译或独立 DSH checkout 的 source-map 路径检查。

只报告实际运行并观察到的结果。缺少 checkout、声明或命令时，记录未运行/失败/受阻的检查、原因与影响。报告分别说明设计就绪、行为实现和验证完成情况；自动检查通过不证明全部生命周期、权限、恢复或用户可见行为正确。PR 中未覆盖的检查放入 `Not Covered`。

## 基线升级

完整升级流程由人工唤起的 [基线升级 Skill](.agents/skills/dsh-skill-upgrade/SKILL.md) 负责；固定基线与版本不混用的仓库约束仍按本文件执行。

## 授权与 Git 安全

- 修改、检查、审查或验证不构成提交授权。用户明确要求提交后才暂存并提交当前任务文件；暂存、提交、推送、创建 PR 和合并 PR 的授权不互相替代。
- 不推定已获准调用外部服务或修改凭证。Reset、rebase、amend、squash、其他历史重写、推送、创建 PR、发布和合并均须用户明确要求对应操作。
- 重写已推送或共享的历史前，必须明确确认目标与风险；获准强制推送时使用 lease 保护。
- 不用破坏性命令丢弃提交、工作区变更或未跟踪文件。不混入无关格式化、重构、临时数据、凭证、本地绝对路径或用户拥有的改动。
- GitHub connector 与 `gh` 可能使用不同凭证；渠道失败不直接代表操作不可行，更换渠道也不扩大授权。回复、解决讨论、reaction、删除和关闭等写操作仍需对应授权。
- 使用 `gh` 前核实仓库、目标 PR/讨论/评论及 `gh auth status`。每次 GitHub 写入后回读验证最终状态，不能用命令退出成功代替回读。

## 提交与 PR

暂存或提交前读取[提交规则](docs/00-governance/COMMIT-RULES.md)；准备 PR、审查或合并前读取[PR 规则](docs/00-governance/PR-RULES.md)。授权与 Git 安全仍按上节执行。
