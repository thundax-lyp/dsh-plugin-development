# 当前 Session 的工作区变化摘要

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-workspace-changes` 为顶层 turn 记录 Git 工作树快照和文件工具编辑，追加仅含 turn 的 `workspace/changes` Session 事件，并通过 `ctx.workspaceChanges` 服务提供 live Session 的摘要和按需 diff。Host 插件可订阅事件并读取摘要，完整骨架见[读取工作区变化](how-to-read-workspace-changes.md)。

## 公开对象与成员

| 对象                                        | 成员与边界                                                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `WorkspaceChanges` / `ctx.workspaceChanges` | `summary(sessionId,seq)` 同步返回相应事件的摘要或 `undefined`；`diff(sessionId,seq,index,signal)` 异步返回一个文件的比较或 `undefined`，实时读取失败会抛错。 |
| `WorkspaceChangesSummary`                   | `turn`、`cwd`、最多 `maxFiles` 项的 `files`、完整 `total`、行数总计及可选 Git snapshot ids。                                                                 |
| `WorkspaceChangedFile`                      | 路径、展示路径、增删行数和可选 `binary`、`oversized` 标记；binary/oversized 无行比较。                                                                       |
| `WorkspaceFileDiff`                         | `text` 含前后存在性、hunks 和超时退化标记 `coarse`；另有 `binary`、`oversized` 变体。                                                                        |
| `Config`                                    | Git 命令时间/输出、文件数量/大小和 diff 计算时间上限。                                                                                                       |

## 生命周期与事实边界

只有带 cwd 的顶层 Session 被记录；subagent 或 delegation-depth 非零的 Session 被排除。Git 不可用或不在仓库时只总结文件工具编辑。事件本身是可重放的 turn 通知，摘要和 diff 保存在 Host 进程内，Session dispose 或 provider 卸载后返回 `undefined`。因此不能把这项临时比较当作可恢复的 Session 文件事实。若插件需要供模型长期使用的文件变化结论，应在 owning Session 中写自己的规范事件，并明确内容截断、权限和版本语义。

按事件的 `seq` 读取，不要只用 turn 编号：同一 turn 的后续摘要可替换之前的摘要。`summary.files` 受上限裁剪，`total` 可大于列表长度。读取路径及 diff 前仍须检查调用方对 Session 和工作区的访问权；服务方法不会替调用方认证远程请求。显示 diff 时处理 `binary`、`oversized`、`coarse` 和取消。

## 验证

精确目标源码 `src/index.ts`、`types.ts`、`recorder.ts` 定义边界；独立 Profile 测试应打开实际 Session/turn、编辑文件、读取事件 seq 与 diff，并在 Session dispose 后确认失效。仅编译消费骨架不能证明 Git、文件工具捕获和 Session 清理行为。
