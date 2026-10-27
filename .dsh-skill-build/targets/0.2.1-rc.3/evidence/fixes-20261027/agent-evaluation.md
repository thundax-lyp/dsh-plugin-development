# 真实 Agent 复测

从本次已独立验证的 generated-skill 复制到两个独立消费项目的 `.agents/skills/dsh-plugin-development`。使用宿主当前配置的真实 Codex CLI / 模型，未指定不同模型。依赖只用预先准备的目标版本本地包链接；任务禁止联网、安装依赖、改外部项目或提交。模型正常服务连接不属于消费插件的外部运行时测试。没有进行无 Skill 对照，本次不以此推断总体提升比例。

## 自然查询

问句为 DSH Web UI 是否提供对话框、如何使用，并关注焦点、Escape、关闭和异步清理。未在问句中点名 Skill。事件记录观察到 Agent 主动读取 Skill 入口、控件 HOW-TO、Modal API 和公开包版本；回答正确使用根导出的 Modal、受控 open/onClose、焦点与 owner 自有异步清理。当前查询 fixture 没有安装 ui-primitives，Agent 明确将依据限定于随附契约，不冒充编译/浏览器验证。完整回答见 [查询回答](agent-query-answer.md)，其中依赖业务的 load/setValue 片段是说明性代码，不是可独立构建组件。

## 实现与主 Agent 回读

任务：在已存在 subprocess/bash-sandbox 的 Profile 前提下制作一次性 printf Shell consumer，提供独立包、exports、构建、bundle patch、卸载取消及隔离测试，不改变既有隔离方式。第一轮 Agent 自动读取 Skill 路由与公开声明，生成插件、包配置和仅新增 consumer 的 patch，实际构建成功。随后模型连接反复超时并停滞；主 Agent 中断该进程，在同一隔离项目发起一次真实 Agent 续作。网络问题不是声明检查或任务行为通过。

续作 Agent 重新读取本地 Skill、现有实现和公开 Cordis/Shell 声明，补充 README 与测试并运行 npm test。主 Agent 回读代码、patch 和测试，再独立执行 `npm test`：TypeScript 构建成功，14 项测试通过、0 失败。成功测试第一轮曾把结束后的幂等 kill 计数当作失败，Agent 修正为检查成功结束前不 kill、卸载后结束句柄的 kill 无操作；没有删除失败路径。

代码使用真实 `execution.result()`、保留 Profile workdir/sandbox 默认设置、拥有自己的 AbortController、卸载等待未决工作及晚到 handle 清理。Patch 只 insert `local-shell-probe`，没有再次注册 subprocess/bash-sandbox。测试使用真实 Cordis Context/Service 生命周期和可控制的 shell 替身，检查退出码/超时/取消/信号/输出/截断/stderr/沙箱拒绝、准备失败、运行失败等待关闭、卸载取消及异步准备返回后清理，共 14 项。完整 Agent 回答见 [实现回答](agent-implementation-answer.md)；消费产物文件摘要见 [摘要](agent-artifact-hashes.json)。消费项目保留在临时目录，未把示例产品加入本仓库。

## 结论与边界

两个实际 Agent 场景均按版本边界找到正确路由并产出所需回答或可构建实现。实现测试使用 shell 替身，不能证明实际 printf、沙箱执行、完整用户 Profile 或浏览器。另一个主流程 profile-check 已运行依赖完备 Loader 子集及真实本地 printf，两者是独立证据，不能将后者算成该 Agent 实际操作。未评估所有 API 的 Agent 使用效果。
