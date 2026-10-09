# PR 规则

授权与 Git 安全规则见 [AGENTS.md](../../AGENTS.md#授权与-git-安全)；提交与 PR 标题格式见[提交规则](COMMIT-RULES.md#标题与项目)。

## 分支与范围

开发变更通过 `branch -> PR -> review -> merge` 进入 `main`，不直接推送开发中的内容。分支使用简短稳定的英文名，如 `docs/clarify-maintenance`。每个 PR 围绕一个可审查、可验证的目标，可包含多个内聚的提交；跨项目或技术领域时说明不能拆分的原因、跨边界影响并扩大验证。Draft 同样必须说明范围、风险与验证。

发布和收口操作可显式调用 [Push PR Skill](../../.agents/skills/push-pr/SKILL.md)；具体 Git 写入仍按 [AGENTS.md](../../AGENTS.md#授权与-git-安全) 的授权边界执行。

## PR 内容

使用 [PR 模板](../../.github/pull_request_template.md)，说明交付结果而非只列文件，完整填写：

- `Closure`、`Scope`：完成结果、纳入与排除的工作。
- `Verification Evidence`、`Not Covered`：实际命令和结果，未覆盖检查及原因、影响。
- `Cross-boundary Impact`：API、生命周期、权限、数据、配置和分发影响。
- `Documentation And Task Closure`、`Risks`：文档同步、剩余工作、残余风险与运行依赖。

不适用项填写 `N/A` 并说明原因，不留空或假称通过。不包含凭证、本地绝对路径、临时文件、未发布草稿、个人机器信息或 Agent 内部执行叙述。

## 审查与合并

审查从 merge base 开始的完整 PR 差异，评估需求、契约、所有权、失败路径和验证。每个问题说明具体触发条件、可观察影响与修正方向，不将猜测或纯风格偏好当缺陷。请求合并前解决可执行反馈，重跑受影响检查。

**只有用户明确要求时才合并 PR。** 默认使用普通 merge commit 保留有意义的分支提交；用户明确要求 squash 时才采用该方式。
