# 工作区 Agent 指令加载

## 入口与任务

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-agent-instructions` 是 Host 插件，按工作区根与候选文件装载 `AGENTS.md`、`CLAUDE.md` 及本地 overlay。插件可被 Profile 装载以在首轮前提供基线、文件工具触及时更新 inbox；Host 调用方也可用 `loadBaselineInstructions` 只读预览。完整预览例见[读取工作区指令基线](how-to-load-agent-instructions.md)。文件内容是工作区提供的指令资料，不能越过更高优先级约束。

## 对象与语义

| 对象                                                          | 成员与边界                                                                                                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Config`                                                      | `dshHome`、`projectRootMarkers`、`instructionFileCandidates`、`localInstructionFileCandidates`、`maxBytes`、`maxSourceBytes`；默认根标记 `.git`，默认 base 与 local 候选如上。 |
| `loadBaselineInstructions(options,fileSystem?)`               | 从 cwd 到选定项目根、加用户全局文件发现/读取/渲染，返回 `RenderedAgentInstructions` 或 `undefined`；可用文件系统 provider 替换本机读取。                                       |
| `discoverBaselineInstructionFiles`、`renderAgentInstructions` | 分别只列候选和对已读文件做预算化渲染；不能据发现就声称内容已纳入。                                                                                                             |
| `apply(ctx,config)`                                           | 订阅 Agent、Session 与文件工具结果，把基线与触及更新纳入该 Agent 的上下文流程；需要 `sessionProjections`。                                                                     |

## 生命周期与恢复

插件以 source/version/基线身份处理首轮和续行，异步文件更新等待相应 step 提交后再写 inbox。`maxBytes` 是单批渲染预算，`maxSourceBytes` 是单文件读取限制；非正/非有限 `maxBytes` 使装载关闭。Provider 卸载取消投影任务并清理临时状态。预览 helper 仅返回文本，不写 Session；实际 Agent 使用需要装载插件，让消息/上下文进入规范 Session 流程。工作区文件可改变，恢复时不得用当前磁盘内容冒充历史已消费的版本。

## 验证

目标源码 `packages/context/agent-instructions/src/index.ts`、`src/config.ts`、`src/files.ts`、`src/render.ts`。独立编译和临时文件预览只验证发现/渲染；真实 Agent baseline、工具触及、commit 边界、取消及恢复要在 Session Profile 测试。
