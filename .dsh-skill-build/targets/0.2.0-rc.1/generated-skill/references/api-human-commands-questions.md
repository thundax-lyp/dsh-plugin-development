# 人类命令与用户问题

## 两个公开入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件从 `@deepseek-ai/dsh-commands` 根入口使用 `ctx.commands.register`、`CommandDefinition`、`CommandInvocation`、`CommandResult`；从 `@deepseek-ai/dsh-user-questions` 使用 `ctx.userQuestions.ask` 与 `user-questions/request` answerer waterfall。`@deepseek-ai/dsh-commands/types` 和 `@deepseek-ai/dsh-user-questions/types` 是 Client 安全类型面，浏览器不导入 Host runtime。完整组合见 [注册需要用户确认的命令](how-to-add-confirmation-command.md)。

## CommandRuntime 契约

`register({name,description,input?,recordInput?,definitionId?,handler})` 返回精确 Cordis effect disposer。name 匹配小写 `[a-z][a-z0-9_-]*`，描述非空。`input.hint` 是非空发现提示，`input.attachments:true` 才接受上传附件；省略时含附件的命令在 handler 前报错。`recordInput` 默认 true，`false` 适用于已有权威领域事件保存参数的命令，避免同一 payload 重复写入日志。`definitionId` 是插件稳定身份，供特定 Client 呈现关联，不能单靠展示名推断身份。

全局注册向所有 Agent 可见，`agent.ctx` 中命令可遮蔽全局同名定义，同层重名抛错。`list(agent)` 返回排序、冻结的 handler-free `CommandDescriptor[]`；`find(agent,name)` 是 Host 查找；`commands/change` 是无 payload、无 scope 过滤的通知，UI 应按当前 Agent 重读目录。`parseCommand(line)` 保留名字后的原始空白；`execute(agent,line,submittedAttachments,signal)` 只处理已注册 slash 名称，未知语法/名字返回 `undefined` 且不写日志。已解析命令在 handler 前写 log-only `command/run`，settle 后写 `command/done`，同一 `commandId` 配对；不进入模型请求。handler 结果只能是 `{kind:'success',text?,sourceEventSeq?}` 或 `{kind:'error',text}`，会被验证和冻结；抛错/取消仍尝试记录 error done。附件在 handler 前由 attachment service 完整 admission，handler 对已持久化的 image/file blocks 的使用负责；`registerFileReceiptResolver` 是 staged 文件上传所有者的唯一 resolver slot，不是一般插件必须注册的东西。

命令 handler 得到 exact Agent、保留空白的 `rawInput`、`signal`、已 admission 的附件和已记录的 `commandId`。所有外部副作用必须响应取消；runtime 可停止等待不合作 handler，但不能回滚已发生动作。若领域事件是模型可见事实，使用该事件自己的 Session surface 路径；命令 lifecycle 本身是 log-only。

## UserQuestionService 契约

`ask({questions,agent?,signal?})` 要求非空 questions。每项有 caller 给定 `id`、问题文字、可选 detail/header/options/multiSelect/intent；回答是 `{answers:[{id,selected,custom?}]}`。`user-questions/request` answerer 可返回答案占用请求，或 `next()` 委托；无回答者抛 `UserQuestionError` `NO_PROVIDER`。有 Agent 时必须是 registry 的**同一个活跃对象**且是运行时 root；被其他 Agent 拥有的子代理返回 `DELEGATED_CALLER`，同 id 的旧对象返回 `CALLER_NOT_LIVE`。恢复的 lineage-bearing Session 若成为新 runtime root 可正常询问。取消时为 `ASK_ABORTED`；空题为 `EMPTY_QUESTIONS`。`plan-review` intent 仅改变 UI 呈现，`approve` 必须指向该题自己的选项且有可展示的 `detail`，否则 `BAD_INTENT`；一般确认不要标成 plan review。

Answerer 是 UI/人类交互所有者，必须在自己的 Agent scope 与连接生命周期内注册、尊重 signal，并返回真实用户选择；不要在插件中伪造批准。提问方把答案结果连同后续动作的决定写在自己所属 Session 或命令事件路径中；单独 `ask` 的进程内返回值不是自动持久事实。内置 `tool-ask-user` 是模型工具适配层，不把该工具与问答服务本身混成同一个注册入口。

## 对象类型与成员

| 公开对象              | 可用成员与职责                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `CommandRuntime`      | `register`/`registerFileReceiptResolver` 归属定义或 staged 文件上传解析器；`list`/`find` 读当前 Agent 目录；`execute` 执行已注册命令。 |
| `CommandDefinition`   | `name`、`description`、`handler` 必需；`input`、`recordInput`、`definitionId` 可选，决定发现提示、附件允许、日志输入与稳定身份。       |
| `CommandDescriptor`   | handler-free 的 `name`、`description`、可选 `input`、`definitionId`；给 Client 发现使用，不直接执行。                                  |
| `CommandInvocation`   | `agent`、`rawInput`、`attachments`、`commandId`、`signal`；handler 在该取消与日志身份下运行。                                          |
| `CommandResult`       | `kind` 为 success/error；可选 `text`，success 还可带 `sourceEventSeq`，以领域事件支持后续模型可见事实。                                |
| `parseCommand`        | 解析 slash 输入，无效语法返回 `undefined`；它不查命令注册表，只有 `execute` 会进入命令生命周期。                                       |
| `UserQuestionService` | `ask` 向当前真实 answerer 发题；无提供者、取消或不符合 root Agent 条件按稳定错误码失败。                                               |
| `UserQuestionError`   | 带稳定错误码的服务失败类型；不能把它当作用户已拒绝的答案。                                                                             |

## 来源与验证

`packages/interaction/commands/src/index.ts`、`types.ts`、`brand.ts` 与 tests；`packages/interaction/user-questions/src/index.ts`、`types.ts` 与 tests；Client 组合另见 `ui-commands`、`ui-user-questions` 的实际浏览器入口。隔离消费编译和 Host service smoke 见 `evidence/runtime/human-commands-questions-review.md`；真实浏览器问答未运行。Settings、Permission Presets 的现有归属仍是 [设置表单](api-settings.md)、[执行权限预设](api-permission-presets.md)，本页不重复其写入契约。
