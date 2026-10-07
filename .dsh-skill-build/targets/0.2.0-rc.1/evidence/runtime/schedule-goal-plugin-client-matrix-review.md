# Schedule / Goal / Plugin Manager / Client 基础服务 pending 审计

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。机器可读 `schedule-goal-plugin-client-matrix.json` 枚举 7 包的 27 个公开 entry、498 个 object、1146 个 member，保留原账本 `currentDecision`，另给推荐 `included|merged|excluded`、owner、section、任务与 source。建议计数：entry 9/11/7、object 46/374/78、member 218/785/143（顺序为 included/merged/excluded）。矩阵没有改共享 ledger。

## 逐包边界

- `dsh-schedule`：Host `ScheduleService` 的 `create/list/catalog/history/update/delete` 六成员均在 `schedule.md#服务成员与规则` 明列。`./client` 为同任务的浏览器安全 DTO，`./remote`/`./typert` 为生成链，`./invariant` 为内部门禁；不产生第二套提醒注册点。记录类型、规则解析和 helper 标 `merged`，若以后要把它们提升 included，需在该 section 给字段/规则和独立消费例子。
- `dsh-goal`：Host `GoalService` 的 get/create/edit/pause/resume/complete/block/clear/disarm 对 live Agent 生效；`remoteExportCreate` 是 `create` 的 Remote 结果薄包装，本任务建议合并，不把它当新权限入口。`GoalRef.id/revision` 由 `goal.md#对象与行为` 解释；Client/types 是相同投影数据的类型面，Remote/typert/invariant 是同一服务生成或门禁面。
- `dsh-plugin-manager`：根服务的管理方法和 DTO 已在 `plugin-manager.md#契约与运行语义` 的对象子表与文字说明。`./operations`、`./registry` 的包管理/registry 实现工具及 `./tools` 不应被当成普通第三方管理扩展注册点；`./remote`/`./typert` 是同服务生成面；`./types` 的对象在根入口也已公开，子入口当前 excluded 不影响根类型。矩阵保留原来已 included 的根对象，不借本轮改写其事实。
- `dsh-client-ui-sidebar-right`：`SidebarRightTabDefinition` 与 keyed slot 是第三方 tab 的两阶段扩展。`ISidebarRight` 的 11 个导航/状态成员已补入 `sidebar-right-tabs.md#公开对象与成员`；其它布局控制器与内置 view props 先合并到此任务。Host 根只是 Loader 行。
- `dsh-client-shortcuts`：可编辑 Client 命令仍由 `Shortcuts.register` 持有；本轮补其 `runtime/platform/stopSequenceMs` 三个只读成员。`./protocol` 的解析、归一化、持久结构是同一快捷键编辑任务，不各自建立注册 API；已有 included 的 binding/command/profile 保留。
- `dsh-client-ui-input-trigger`：`InputTriggerService` 与 `InputTriggerServiceContract` 的 `registerSource/sessionOf` 已补进 `client-input-trigger.md#公开对象与成员`。`InputTriggerController` 是 Session 局部菜单控制器；当前参考只明确 `lexicon/pick/openReference`，其余 pending 控制方法建议 merged，不能因 public class 而声称普通来源插件必须接管菜单状态机。
- `dsh-client-connection`：Host `HostConnectionHandle` 的八成员及 `HostConnectionFetch.register`/`HostConnectionRpc.handle,intercept` 已在 `client-connection.md#对象类型与成员` 明列；本轮补后两张 face 的对象名。根 DTO `ConnectionConfig`、`ConnectionFetchRoute`、`ConnectionRpcHandlerResult` 有表内契约；其余 RPC wire 与浏览器 transport 实现类型合并到同一个受保护连接任务。Client generation/handle 已 included 的对象成员维持原决定。

## 验证与限制

只检查精确 checkout 的 package.json、公开声明/source 路径和既有参考的 owner section；四篇属于本专题的 Client reference 做了表格补项与行尾空白检查。没有重新编译这些已验证例子、重跑 Browser/Profile 或 Schedule/Goal 到期/续行。`merged` 的 owner/section 是任务路由，**不**表示该 symbol 的每个 member 已在正文定义；晋升 included 前仍需按精确 section 复核完整成员和可执行例子。
