# Settings / Permission / Commands / User Questions 缺口核查

## 目标与归属

精确 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。本轮重读 `packages/settings/settings/src/index.ts`、`packages/interaction/permission-presets/src/index.ts`、`packages/interaction/commands/src/index.ts`/`types.ts`、`packages/interaction/user-questions/src/index.ts`/`types.ts` 与各自 tests；只为未覆盖的 Commands/User Questions 新建 `api-human-commands-questions.md` 与 `how-to-add-confirmation-command.md`。

## 候选映射

| 候选 ID | 公开入口与任务 | 当前权威专题 |
| --- | --- | --- |
| `settings.forms` | `SettingsForms.configure/describe/update/replace/mutate`、revision、secret masking、path ops | 已有 `api-settings.md`；Client 表单/卡片 `api-client-settings-forms.md` |
| `settings.secret-redaction` | 根入口 `redactSecrets` 与 redacted wire 词汇 | 已有 `api-settings.md` 的遮蔽事实；本轮不另立权威文档 |
| `permission.presets` | `PermissionPresetService.catalog/current/resolve/optionOf/set/registerAuto`、会话 projection/事件 | 已有 `api-permission-presets.md` 与 `how-to-compose-permission-preset-ui.md` |
| `commands.registration` | `CommandRuntime.register/list/find`、`CommandDefinition`/descriptor、`commands/change` | 新 `api-human-commands-questions.md` |
| `commands.execution` | `parseCommand/execute`、`CommandInvocation/Result/Execution`、日志 paired lifecycle/附件 admission | 新 `api-human-commands-questions.md` |
| `commands.file-receipt` | `registerFileReceiptResolver` 唯一 staged 文件 receipt owner slot | 新 `api-human-commands-questions.md` |
| `user-questions.ask` | `UserQuestionService.ask`、request/answer types、root/liveness/cancellation/errors | 新 `api-human-commands-questions.md` |
| `user-questions.answerer` | `user-questions/request` agent-scoped answerer waterfall | 新 `api-human-commands-questions.md` |

Settings 与 Permission Presets 两项已有代码核查、HOW-TO、隔离 settings card fixture；本轮没有重复文档或重跑其测试。两份旧 reference 验证段仍写“独立消费包尚未运行”一类旧界限，需由主整合在最终文档中统一更新为 `settings-ui-review.md` 已实际执行的范围，不把该 smoke 提升为真实浏览器/Profile save。

## 新消费包验证

`evidence/tests/human-commands-questions-consumer/` 用发布的 rc.1 npm 声明安装、`npm run build`、`npm run smoke`、`npm pack --dry-run --json` 均通过。真实 Cordis Host service 装载 `AgentRegistry`、`CommandRuntime`、`UserQuestionService`；以精确活跃 root Agent 和进程内 answerer 双身验证无 answerer 时 `NO_PROVIDER`、用户拒绝不写反馈、确认后 `feedback/record` 只写一次、三个命令调用都有 `command/run`/`command/done` 配对且 `recordInput:false` 不复制文字、插件卸载撤销 command。pack 仅含 lib、patch、manifest。

没有真实 Client、浏览器回答者、AgentLoop、Session 持久化 flush 或附件上传；进程内 answerer 只是隔离验证双身，生产路径必须由人类交互通道提供真实答案。`NO_PROVIDER` 的 handler 错误在 command runtime 记录成 error done；返回错误不保证远端 UI 展示样式。本轮也未验证 Settings/Permission 的实际 Profile 写入与投影恢复。
