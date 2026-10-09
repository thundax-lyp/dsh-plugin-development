---
name: push-pr
description: Publish completed work in this repository as a GitHub pull request, then check CI and review status. Use when explicitly asked to push and create or update a PR; do not merge without separate authorization.
---

# Push PR

将本仓库已完成的分支工作发布为面向 `main` 的 PR，按实际提交、差异和验证证据填写描述，并回读远端状态。仅在用户显式调用 `$push-pr` 或明确要求推送并创建或更新 PR 时使用。

## 授权与依据

- 遵守根目录 [AGENTS.md](../../../AGENTS.md#授权与-git-安全)、[提交规则](../../../docs/00-governance/COMMIT-RULES.md)和 [PR 规则](../../../docs/00-governance/PR-RULES.md)。调用本 Skill 不授权新建 commit、改写历史或合并 PR；推送与 PR 写入分别以用户的明确请求为准。
- 发布前读取 [PR 模板](../../../.github/pull_request_template.md)和 [PR 验证工作流](../../../.github/workflows/pr-verify.yml)。只按当前差异读取创建 Skill、审核 Skill、生成产物或相关验证器的直接依据。
- 不把其他仓库的版本、运行环境、验证结果或 PR 状态当作本仓库事实。

## 1. 确认发布边界

检查 `git status --short --branch`、当前分支、`main...HEAD` 的提交与完整差异、暂存区、远端和 upstream。核实仓库地址、目标 PR 及 `gh auth status`；使用 GitHub 连接工具时同样核实目标仓库和 PR。

区分当前任务改动、用户已有改动和归属不明的改动。只纳入获得提交授权且属于本次交付的文件；不覆盖或丢弃其他改动。当前分支已有 open PR 时核实其 base 是 `main`，再决定更新；base 不符时请求用户确定目标。相关 commit 已被其他 PR 使用时，先核对归属，避免重复发布。

当前在 `main` 且有可发布的本地领先提交时，创建语义明确的非 `main` 分支承载它；没有可发布差异时停止。只推送非 `main` 分支。未发布提交也不自动 amend、rebase、squash 或重排；用户明确要求整理历史时，先核实远端与共享边界，并按其授权范围执行。

## 2. 收口与验证

按 [AGENTS.md 的验证矩阵](../../../AGENTS.md#验证与报告)选择检查。至少审阅完整 PR 差异、运行 `git diff --check`，检查文档链接与路径；创建流程、生成 Skill、TypeScript 示例或 source-map 变化时补齐对应验证。只记录实际执行且观察到的结果，未覆盖项写入 PR 的 `Not Covered`。

需要新 commit 时，先取得明确提交授权；按提交规则检查完整暂存差异并运行 `git diff --cached --check`。PR 标题使用 `Type(<project>): <中文阶段性交付结论>`，`project` 只能从提交规则的固定项目表选择。PR 可以跨项目，标题归属权威源项目，其他影响写入正文。

## 3. 推送与创建 PR

获得对应授权后，推送当前非 `main` 分支；有 upstream 时核实其目标，无 upstream 时使用 `git push -u origin <branch>`。远端回读确认分支与 head SHA。当前分支已有 base 为 `main` 的 open PR 时更新它，否则创建新 PR；PR 写入后回读标题、正文、base、head 和 URL。

PR 描述使用仓库模板的 `Closure`、`Scope`、`Verification Evidence`、`Not Covered`、`Cross-boundary Impact`、`Documentation And Task Closure`、`Risks` 字段。给出交付结果、实际验证及剩余限制，不把静态检查写成运行时行为验证。每轮修复后以最终远端 commit、差异与 checks 为准更新描述。

## 4. 检查与反馈

查看 `Governance`、`Skill Integrity` 及其他实际触发的 checks。PR 创建或更新后，在合理时间内观察状态；检查仍在运行、失败或未触发时如实报告，不推断通过。

对 reviewer 评论区分可执行问题、提问和无需修改的意见。读回评论上下文与代码证据后再决定修复；代码修复、commit、推送、回复和 resolve 分别遵守授权。Codex findings 的完整处置流程由用户显式调用 [Codex Comment Fix](../codex-comment-fix/SKILL.md)；不要仅因发布 PR 就自动执行该 Skill。每次 GitHub 写入后回读实际状态。

只有 PR 已存在、远端 head 与本地交付一致、描述符合模板，并且 checks 与未处理评论的状态已核实时，才报告 PR 已收口。未完成项说明具体状态、原因和下一步；不自动合并。
