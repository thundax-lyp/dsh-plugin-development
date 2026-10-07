# Workspace 注册表与归档活动扩展

## 目标版本和公开入口

目标为 `dsh-v0.2.0-rc.1`（commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`）。`@deepseek-ai/dsh-workspace` 默认导出 `WorkspaceRegistry`，其服务名为 `workspaceRegistry`。插件作者可通过 `ctx.workspaceRegistry` 管理工作区，也可独立监听本包声明的归档活动事件；完整活动插件见[向工作区归档报告活动](how-to-contribute-workspace-activity.md)。

## 注册表对象与成员

`WorkspaceRegistry` 是 `ctx.workspaceRegistry` 的服务类型，其成员与返回 `Workspace` 视图的关系如下。

`create(path,title?)` 把现有目录的 realpath 存成带稳定 `WorkspaceId` 的记录；`get(id)`、`list()`、`resolveByPath(path)` 查询，`delete(id)`、`insertBefore(id,beforeId?)` 改记录及顺序。`Workspace` 的 `path`、`title`、`createdAt`、`updatedAt`、`sessionIds` 为消费视图，`setTitle`、`attachSession`、`insertSessionBefore`、`detachSession`、`status` 为实例成员。注册表另有 `archivedSessionIds`、`archiveSession`、`unarchiveSession`、`pinnedSessionIds`、`pinSession`、`unpinSession`。写入经 storage-domain 持久化；`sessionIds` 只有记录候选且 Session header 的规范 cwd 与工作区目录相同才可见。detach/delete 不删除 Session 日志。目录暂时缺失由 `status()` 报 `missing-dir`，不会自动删除记录。

归档拦截的 `SessionActivity` 有 `kind` 和 `items`，`SessionActivityKindMap` 可由插件声明合并；非强制归档被拦截时抛出的 `WorkspaceActiveSessionError` 带 `activity`。事件顺序与停止语义见下节。

## 活动扩展与归档顺序

`workspace/session-activity` 是 waterfall。监听器先 `await next()`，把自身仍运行的 `SessionActivity` 放到结果前；`kind` 通过 `@deepseek-ai/dsh-workspace/types` 的 `SessionActivityKindMap` 声明合并，`items` 可带 `id` 与 `label`。不带 `stopActivity` 的 `archiveSession` 对已知且未归档 Session 询问一次；任一活动使其抛 `WorkspaceActiveSessionError`，不写 archive。`archiveSession(id,{stopActivity:true})` 先持久化归档并去掉 pin，再并行发 `workspace/session-stop`。监听器发起自己拥有的取消；返回表示停止请求已发出，不保证后台任务都结束。监听器失败会记录日志，归档不回滚。重复归档不重新问询或停止。

活动表是进程内运行状态，重启后须由任务本身的持久日志恢复；不能把该表当作 Session 事实。插件卸载时应取消并等待自己拥有的任务。若插件新建可见任务，其授权、会话归属和并发 ID 由插件负责；注册表事件不替插件做权限检查。需要模型看见的任务结论应写到 Session 日志。

## 验证边界

独立包编译并在 Cordis 上实际触发活动、停止及清理事件；未装载完整 WorkspaceRegistry + 存储 Profile，因此本例不声称归档持久化、header 过滤或重启恢复的端到端结果。
