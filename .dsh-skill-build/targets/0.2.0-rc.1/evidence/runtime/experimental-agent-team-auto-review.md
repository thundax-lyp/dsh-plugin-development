# Experimental Agent Teams 与 Auto Review 裁决

目标 `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。以下均为已发布但可选的 experimental 包；不能从 npm 发布推出默认 Profile 已装载。

| 包 | 裁决 | 精确源码与职责 |
| --- | --- | --- |
| `@deepseek-ai/dsh-experimental-agent-team` | included | `packages/experimental/agent-team/src/index.ts` 的 `TeamService` 提供 `ctx.agentTeams`，方法 `membership/tryMembership/listMembers/spawnTeammate/sendMessage/createTask/getTask/listTasks/updateTask/waitForChange/interrupt`；`src/types.ts` 定义输入、CAS revision、状态与 `team/*` Session 事件。新增 `api-guardrails/experimental-agent-team.md` 与 `how-to/use-experimental-agent-team.md`。 |
| `@deepseek-ai/dsh-experimental-tool-agent-team` | merged | `packages/experimental/tool-agent-team/src/index.ts` 注入 agents/agentTeams/tools/systemPrompt，注册 Team scoped 模型工具及政策文本；不是另一个 Team 状态 owner。Profile patch 才决定它与普通 subagent 工具不冲突。 |
| `@deepseek-ai/dsh-experimental-client-ui-agent-team` | merged | `packages/experimental/client-ui-agent-team/src/index.ts` 的 Host `apply()` 为空；`./client` 浏览器入口拥有 roster/task UI，不是 Host Team API。与 Team Profile 组合，但需 Web/Client 实跑验证。 |
| `@deepseek-ai/dsh-experimental-agent-team-profile` | included composition | `packages/experimental/agent-team-profile/cordis.patch.yml` 是运行内容；其根 `src/index.ts` 导出空对象。Patch 要在 dsh-base 后应用，禁用 `tool-subagent-control`、`tool-subagent-list-agents`、`tool-subagent`、`tool-subagent-fork`，插入 `agent-team`（maxMembers 8 等）、`tool-agent-team`（fresh spawn/fork fork）和 `ui-agent-team`。 |
| `@deepseek-ai/dsh-experimental-auto-review` | merged to permission preset | `packages/experimental/auto-review/src/index.ts` 的 `apply` 注入 approval/llm/permissionPresets/sessions/tools，向 `tools/pre-execute` 前置审查，并用 `permissionPresets.registerAuto` 暂时发布固定 `auto` preset；`cordis.patch.yml` 只插入插件行。应在 `api-guardrails/permission-presets.md` 的 Auto 集成边界说明，不建立另一份权限服务 reference。 |

## Auto Review 的确切任务边界

本包可作为**部署者明确选择**的实验权限集成，在现有 Profile 的权限服务、LLM、审批和工具服务之后加载。它没有公开 Config、reviewer provider 注册 SPI 或可由第三方替换的风险分类方法；`REVIEW_POLICY`、请求五节构造、解析器和 `classifyRisk` 是包内私有实现。第三方插件作者可消费当前 `auto` preset 的结果，但不能把这个插件当作通用“自动许可”服务或自定义审批回调。用户是否选择 Auto 是当前 Session 的权限事实，默认 Profile 未因包存在而改变。

`apply` 前置监听每个 native tool call 和已启动 PTC inner call，在工具 body 前审查；外层 `run_code` 载体被明确跳过。它只在当前 Session 的 preset 为 `AUTO_PRESET` 时执行。审查失败返回 deny；审查拒绝在 `approval.overrideOf(session)==='never'` 时是终局拒绝，在 `ask` 下可进入普通用户审批；允许仍经过下游工具 gate。代码会把未能确定范围、Session 记录不一致、无完整路由或模型输出不符视为失败，不执行工具 body。`src/index.ts:678-739` 的卸载路径先停止接新请求，把仍选择 Auto 的 live Session 设为 `danger-full-access`，然后 abort 并等待在途审查；这项具体语义必须由权限章节原样说明，不能误写成卸载后 Auto 继续生效或静默回退原 preset。

`packages/interaction/permission-presets/src/index.ts:307-318` 的 `registerAuto` 是独占集成插槽，返回 effect disposer；同文件 `pinInitialPermission` 要求恢复的 Auto Session 有活跃集成，否则拒绝发布。因此 auto-review 适合合并到 permission-presets 的“可选 Auto 集成与恢复”任务；完整生命周期验证要装载真实 PermissionPreset/LLM/Approval/Session/Tools 并观察 native/PTC、ask/never、失败与卸载。不能以静态政策文本或包导出证明某次工具获准。

## 独立验证与未运行

隔离 `evidence/tests/experimental-agent-team-consumer` 安装这五个精确 `0.2.0-rc.1` 包、`@deepseek-ai/cordis@4.0.4`、Agent 同版与 TypeScript；从 Team HOW-TO 原样提取的 `team.ts` 通过 `tsc -p tsconfig.json`。`node smoke.mjs` 从**发布包**读取 patch，检查四个禁用行、三个插入行，并用 `TeamService.Config` 验证默认 `maxMembers=16` 和无效 0 拒绝，输出 `PASS team patch rows and deployment Config`。`node auto-review-smoke.mjs` 验证精确发布包的 name/inject/apply 与 opt-in patch，输出 `PASS auto-review package entry and opt-in patch`。

还用目标版本 `@deepseek-ai/dsh` CLI 在隔离 `DSH_HOME=/tmp/dsh-team-profile-KJN1wX` 执行 `dsh headless --patch <Team 发布包的 cordis.patch.yml> --dump-config`，exit 0，输出保存为 fixture 的 `composed-profile.yml`。实测四个普通 subagent 工具行均 `disabled: true`，末尾插入 `agent-team`、`tool-agent-team`、`ui-agent-team`，provider 分别 `spawn`/`fork`，Team `maxMembers: 8`。另在 `DSH_HOME=/tmp/dsh-auto-review-oUqdHy` 执行同一 CLI 并传 Auto Review 发布包 patch，exit 0，`composed-auto-review.yml` 有唯一 `auto-review` 行。这些是**配置合成**观察，不是 `dsh plugin add` 写入或插件 fiber 激活。未启动 Lead/teammate、持久 Session、任务 CAS、消息冷恢复、Web UI 或 Auto 审查模型/工具调用。因此本轮仍不是完整 Profile/生命周期/权限通过。
