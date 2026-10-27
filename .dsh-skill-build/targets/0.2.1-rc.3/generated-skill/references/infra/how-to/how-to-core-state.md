# 持久状态、作用域与配置

## 用 Session 事件记录可恢复的插件事实

相关对象：

- [PluginRecordMap](../api/api-core-dsh-session-root-2.md#pluginrecordmap-公开契约)。
- [Session](../api/api-core-dsh-session-root-2.md#session-公开契约)。
- [SessionEvent](../api/api-core-dsh-session-root-3.md#sessionevent-公开契约)。
- [SessionStore](../api/api-core-dsh-session-root-5.md#sessionstore-公开契约)。

目标：进程重启后仍可由 Session 日志重建插件向模型展示的事实。

1. 核对 [SessionStore 与 Session](../api/api-core-dsh-session-root-overview.md)、[AgentRegistry](../api/api-core-dsh-agent-root-overview.md) 和 [scope](../api/api-core-dsh-scope-root-overview.md)。Session 服务拥有追加日志与派生消息，持久写盘由独立 persistence 插件负责。创建内存 Session 不证明磁盘已耐久。
2. 在拥有记录格式的包扩展 `PluginRecordMap`，追加经验证且可无损 JSON 表达的记录。不把运行中 Promise、socket、Service 或凭据写进日志。模型可见内容来自耐久事件的投影，内存注册表只作为可重建索引。
3. 订阅 `session/event` 接收已提交事件；该通知 fire-and-forget，observer 失败不会回滚已经追加的日志。需要写盘完成时实现并等待 `session/flush` 并行检查点；不要在普通 event listener 返回 Promise 就声称调用者等过磁盘。
4. Agent 创建由 registry factory 完成，`setup(agentCtx, agent)` 在 session/agent 发布前完成作用域配置；setup 用于装配，不驱动 Agent。若需要对可变 provision 状态做最终检查，返回同步 commit；setup 或 commit 失败必须回滚未发布作用域。
5. 测试正常追加、无效数据拒绝、持久化失败、flush、重启重放和停用插件。只从 `session/created` 的同步 throw veto 创建；异步 rejection 无法撤销已经发生的同步发布边界。作用域监听器仅接收其 owner 范围，不能用进程全局 map 跨 session 共享可变业务状态。

完成判据：重放后模型可见事实等价，flush 失败不会被误报成功；创建失败没有半发布的 session/agent，停用后监听器和 scope 注册都消失。

## 修改配置表单并保护脱敏字段

相关对象：

- [SettingsConflictError](../api/api-core-dsh-settings-root-1.md#settingsconflicterror-公开契约)。
- [SettingsDescriptor](../api/api-core-dsh-settings-root-1.md#settingsdescriptor-公开契约)。
- [SettingsForms](../api/api-core-dsh-settings-root-1.md#settingsforms-公开契约)。
- [SettingsPathOp](../api/api-core-dsh-settings-root-1.md#settingspathop-公开契约)。

目标：更新目标 profile entry 的可编辑字段，同时防止陈旧 revision 覆盖新值或删除未知 secret。

1. 核对 [SettingsForms](../api/api-core-dsh-settings-root-overview.md) 和 [ConfigEditor](../api/api-core-dsh-config-editor-root-overview.md)。settings 以 entry id 为 namespace，投影活动实例的 Config volatile 字段，不是另一个 settings.yaml 存储。
2. 读取 `describe({redactSecrets:true})`，保留 revision。`value` 是有效值，`base` 是继承层，`user` 是用户覆盖；`applies` 为 live。远端读取必须脱敏，表单只回写用户改变的路径。
3. `update` 递归合并对象，数组及其他值替换；`replace` 重置 live 字段后应用完整 section，不能把脱敏视图当成完整文档替换，否则会删除未返回的 secret。编辑脱敏表单用有序 `mutate` set/unset path；unset 数组索引会删除该元素，继承字段的 unset 恢复其继承值。
4. 写入携带 expectedRevision。遇 `SettingsConflictError` 重新读取并让调用方协调；不直接无条件重试覆盖。输入必须是可无损 JSON 的普通对象，拒绝循环、Date、Map、BigInt、非有限数等。
5. 若调用 `configure({auto:false})` 提供自定义页策略，把其 disposer 注册为所属实例 effect；同一实例重复配置会拒绝。卸载后策略撤销，schema 和变化事件不再引用旧实例。

完成判据：正常修改即时作用于正确实例，陈旧 revision 拒绝，无关字段与 secret 保留，插件卸载不留下表单策略。
