# 文件系统 Provider 与写入策略事件

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-fs` 定义 Host `ctx.fs` 能力：路径解析、元数据、文本/字节读取、目录列表、原子写入和 literal edit。具体 Backend 由 `fs-local` 或 `fs-sandbox` 提供；`fs-local` 的 `cwd` 只是相对路径基准，不限制访问范围。`@deepseek-ai/dsh-tool-fs` 是模型工具消费者，它在读后发 `fs/observed`，写/编辑前查询 `fs/write-intent` 或 `fs/edit-intent`。默认 `fs-observation-policy` 基于同一 Session 已观察的版本给出保护性 intent。扩展只读路径的完整插件见[包装文件写入策略](how-to-guard-filesystem-writes.md)。

## 公开对象与成员

| 入口                       | 插件作者实际使用的成员                                                                                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FileSystem` / `ctx.fs`    | `resolve(path,{cwd?,signal?})` 得到稳定 `FsTarget`；`contains(parent,child)` 做同 Backend 身份的包含判定；`processPath`、`fileUrl` 是明确的执行世界映射；`stat`、`lstat`、`readText`、`streamText`、`readBytes`、`readByteRange`、`listDir`、`writeText`、`editText`；`watch` 可选。 |
| `FsTarget`                 | `targetKey` 不透明且用于身份/新鲜度，`displayPath` 仅供显示；不能解析 key 或把显示路径当安全边界。                                                                                                                                                                                   |
| `FsInfo` / `FsObservation` | `stat` 的 `{version,type,size?}`；`fs/observed` 的 `{kind:'present',version}` 或 `{kind:'absent'}`。                                                                                                                                                                                 |
| `FsWriteIntent`            | `createIfAbsent` 或 `replaceIfVersion`；无 intent 表示无条件写。Backend 在同一原子临界区检查版本。                                                                                                                                                                                   |
| `FsError`                  | 保留 `FS_NOT_FOUND`、`FS_NOT_OBSERVED`、`FS_STALE_VERSION`、`FS_PERMISSION_DENIED`、`FS_SANDBOX_DENIED`、`FS_ABORTED` 等稳定代码，模型工具再包装可读文本。                                                                                                                           |
| 策略事件                   | `fs/write-intent(target,actor,next)`、`fs/edit-intent(target,actor,next)` 是 waterfall 单槽决策；`fs/observed(target,observation,actor)` 是同步记录事件。                                                                                                                            |

`fs-observation-policy` 没有服务与配置。它用弱引用按 `actor.agent.session` 与 `targetKey` 保存已见版本；未读写入仅允许防覆盖创建，未读编辑以 `FS_NOT_OBSERVED` 拒绝，已读但外部变更以 `FS_STALE_VERSION` 拒绝。观察状态只在内存中，Session 恢复后必须重读；直接调用 `ctx.fs.readText` 不发 `fs/observed`。该策略不是权限或沙箱：会话已读文件后仍可能覆盖，只负责读后新鲜度。

## 组合、所有权与边界

`fs/write-intent` 与 `fs/edit-intent` 的首个返回决策生效。自定义包装器若要让默认读后策略继续执行，应先于它注册并对允许的目标 `return next()`；默认策略自身占满决策槽，不调用 `next()`，放在它之后的策略不会被触达。只读目录示例通过 `ctx.fs.contains` 判断 Backend 身份，并在受保护路径抛 `FsError('FS_PERMISSION_DENIED')`。策略插件通过 `ctx.on` 由 Cordis fiber 释放监听器。更广的 Agent 工具授权应在工具执行/审批边界实现；文件 Backend 沙箱需要 `fs-sandbox`，不能把这类事件当 OS 强制隔离。

`FsTarget` 来自同一个 Provider 后才可交给其 `contains`/IO。对外部输入先做调用者授权，再解析路径与限制操作；取消信号要传到 Backend。`watch` 返回的关闭函数由消费插件持有，失败和卸载都须释放。模型可见文件变化应由工具结果与 Session 事件记录；直接调用 `ctx.fs` 不自动生成模型日志。

## 验证

在目标版本声明下编译自定义策略；验证受保护路径拒绝，其他路径仍走默认观察策略；模拟先读、外部改动、写入与恢复。完整文件工具/沙箱行为需要在目标 Profile 运行，手调 waterfall 只能证明策略 listener 和 Backend 路径身份。
