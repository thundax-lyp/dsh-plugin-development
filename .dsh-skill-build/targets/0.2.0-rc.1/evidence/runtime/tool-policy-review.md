# 工具策略 Hook 与审批组合核查

## 固定目标

`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。公开契约取自 `packages/core/tools/src/index.ts`、`packages/interaction/user-approval/src/index.ts`、同目录 `types.ts`，行为对照 `packages/core/tools/tests/tools.spec.ts`、`scoped.spec.ts` 和审批包 tests。作者文件是 `skill-source/api-guardrails/tool-policy-hooks.md`、`skill-source/how-to/how-to-add-tool-execution-policy.md`；隔离消费包为 `evidence/tests/tool-policy-consumer/`。

## 候选账本

| 候选 ID | 公开成员/事件 | 裁决 |
| --- | --- | --- |
| `tools.policy.pre` | `tools/pre-execute`、`PreToolDecision`、`ToolExecution` | 流水线 pre waterfall 可 allow/deny/cancel/ask；参数与调用身份不可改；异步门禁自己响应 signal。|
| `tools.policy.guard` | `ToolRuntime.guard`、`ToolGuard` | pre 和审批后单调拒绝，全局或 agent scope，精确 disposer。|
| `tools.policy.around` | `tools/execute`、`ToolDispatchExecution` | around dispatch，signal 可在 delegated lifetime 更换但原调用取消不可脱离。|
| `tools.policy.post` | `tools/post-execute`、`PostToolDecision` | 已派发结果 accept/replace/block，阻断不能回滚副作用。|
| `tools.policy.observe` | `tools/result`、`tools/change` | 最终结果只读冻结观察；change 为未过滤的目录通知。|
| `tools.policy.ptc-log` | `tools/ptc-dispatch-log`、`PtcDispatchLog` | 仅覆盖 PTC 子调用持久日志副本，异常回退原内容。|
| `approval.request` | `ApprovalService.request`、`approval/request`、`ApprovalRequest`、`ApprovalOutcome` | 仅 open turn；audited asked/decided；missing/throw/abort fail closed；只有 allowed-once 单次放行。|
| `approval.policy` | `ApprovalPolicy`、`setApprovalPolicy`、`ApprovalService.setPolicy` | ask/never；never 在回答者前拒绝；会话覆盖有日志。|

所有候选归属 `api-tool-policy-hooks.md`；`api-tools.md` 保持工具定义和输出契约归属。`TOOL_RUNTIME_SCHEDULER` 源码标记 `@internal`，不列作者扩展候选。

## 独立验证

在隔离消费包安装发布的 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-tools@0.2.0-rc.1`、`@deepseek-ai/dsh-user-approval@0.2.0-rc.1` 等依赖；`npm run build` 通过声明编译；`npm run smoke` 装载真实 Cordis `ToolRuntime`、`SystemPrompt`、`ApprovalService`，注册 echo 工具和策略插件，观察短调用执行、guard 禁止 body、长调用 ask 因无 Agent 封闭拒绝、卸载后策略消失；`npm pack --dry-run --json` 通过并只携带 lib、patch、manifest。没有模拟批准返回 `'allowed-once'`。

尚未跑真实 Profile、Agent open turn、客户端回答者、Session 审批审计/恢复或 PTC 子调用；这些由目标代码和对应行为测试支持，隔离 smoke 不宣称端到端验证。没有运行与本专题无关的 runtime 测试。
