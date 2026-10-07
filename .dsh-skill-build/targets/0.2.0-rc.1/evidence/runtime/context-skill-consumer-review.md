# Context 与 Skill 入口逐包审查及消费验证

目标 `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。精确包源码相对 checkout 如下。

| 包与入口 | 裁决 | 第三方任务与源码边界 | 新产物 |
| --- | --- | --- | --- |
| `@deepseek-ai/dsh-file-reference` | included | `packages/context/file-reference/src/index.ts` 默认抽象 `FileReferenceService.list(agent,query,signal)`、`FileReferenceCandidate` 及 `activeAtToken/formatFileMention`；UI/Host 消费路径候选，或实现自有 provider。候选不读内容。 | `api-guardrails/file-reference.md`、`how-to/complete-file-reference.md` |
| `@deepseek-ai/dsh-file-reference-local` | merged | `packages/context/file-reference-local/src/index.ts` 的 `LocalFileReferenceService` 是具体 provider，按 Agent cwd 搜索并在工具结果后失效；并入 file-reference 组合，不另建并行协议。 | 同上 |
| `@deepseek-ai/dsh-session-reference` | included | `packages/context/session-reference/src/index.ts` 的 `SessionReferenceResolver.listCandidates` 与 `prepare`、`src/uri.ts` 的规范 mention；Host UI 可展示候选，接收直接消息前可准备精确源快照。候选不读源日志，prepare 的快照才带 source/seq/省略事实。 | `api-guardrails/session-reference.md`、`how-to/list-session-references.md` |
| `@deepseek-ai/dsh-tool-workspace-dependencies` | included | `packages/skill/tool-workspace-dependencies/src/index.ts` 的 `resolvePrimaryRuntime/installPrimaryRuntime` 是部署载荷路径入口，`apply` 注册内置模型工具；需要可信绝对 source 与打包 payload，不下载依赖。 | `api-guardrails/workspace-dependencies.md`、`how-to/resolve-workspace-dependencies.md` |
| `@deepseek-ai/dsh-agent-instructions` | included | `packages/context/agent-instructions/src/index.ts` 的 `apply` 负责首轮与触及更新，`loadBaselineInstructions` 可供 Host 预览；`src/config.ts` 定义发现/预算规则。只读预览不提交 Session。 | `api-guardrails/agent-instructions.md`、`how-to/load-agent-instructions.md` |

## 实际运行

隔离项目 `evidence/tests/context-skill-consumer` 安装上述五个 `0.2.0-rc.1` 包、`@deepseek-ai/cordis@4.0.4`、Agent/Session 同版与 TypeScript。四篇 HOW-TO 代码块原样提取为 `.ts`，`./node_modules/.bin/tsc -p tsconfig.json` exit 0。`node smoke.mjs` 在系统临时目录建 `.git`、AGENTS.md、当前平台最小 runtime manifest/入口，输出 `PASS instruction preview and bundled-runtime path resolution`；`node reference-smoke.mjs` 输出 `PASS file token and session reference grammar`。

未运行真实 Agent + Local FileReference Provider 候选搜索、SessionReferenceResolver 与 sessionQuery/投影/源日志组合、Agent instruction 首轮/触及更新、`load_workspace_dependencies` 模型工具和真实 bundled Python/Node 执行。运行脚本仅验证只读预览、原位载荷路径、引用语法和声明；不将其提升为完整 Profile/Client/恢复证明。
