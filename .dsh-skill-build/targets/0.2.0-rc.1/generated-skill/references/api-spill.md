# Spill 存储与大结果回收

## 目标与入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-spill` 默认导出抽象 `SpillStore` 服务（`ctx.spillStore`），其唯一存储操作为 `saveText(input):Promise<SpillRef>`；类型包括 `SaveTextSpill`、`SpillOwner`、`SpillSource`、`SpillRef`，`SpillLocator` 是不透明品牌。已发布 `@deepseek-ai/dsh-spill-local` 实现 Host 私有文件存储。完整消费示例见[保存插件大文本](how-to-save-large-report.md)。

## 保存契约与所有权

`SpillOwner` 用 `sessionId` 绑定保存归属，`SpillSource` 记录来源标签；`SpillLocator` 只是后端生成的不透明定位符，不是可自行拼接的文件路径。

`SaveTextSpill` 含 `{owner:{sessionId},source,suggestedName,content}`。`source` 是 tool（toolName、callId、label）或 session-reference（源 sessionId、label）之一，仅用于描述，不能作访问控制。backend 必须逐字保存完整 UTF-8 content，按 owner Session 分组，使用私有位置和不可碰撞文件名；`suggestedName` 只是需要清洗的单段提示，不能直接当路径。返回 `{locator,bytes,retrievalHint}`，bytes 是原文 UTF-8 长度；消费者把 locator 当不透明值，按 backend 的 retrievalHint 引导读取，不能从 locator 字符串推断本机路径。真实存储失败必须拒绝，调用方决定是否退回 inline。一个 Context 只装载一个 SpillStore backend。

`SpillStore.saveText(input)` 是调用方唯一持久化入口；返回 `SpillRef`，无检索或枚举成员。

`spill-policy` 在 `tools/post-execute` 和 PTC dispatch log 上做令牌预算后的可恢复显示副本，完整工具结果仍由工具执行层和 Session 事实负责；无 backend 或保存失败时保留 inline 结果并警告。`spill-store` 自身不提供保留期或检索 API；本地 backend 的 `cleanupPeriodDays` 只做启动时年龄清理，`0` 禁用。旧 locator 可出现在恢复或 fork 后的 Session 历史，backend 保留期可能使其失效。模型可见的规范工具 JSON 结果和引用应写入 Session 日志，不能只把临时 `SpillRef` 保存在内存。

## 验证边界

独立 npm 消费包已实际装载 local backend、写入完整文本、检查 byte 数/检索提示/0600 权限和同 Session 同 callId 两次不碰撞。未运行 `spill-policy` 工具钩子或 Session 恢复/过期清理；自定义远端 backend 也未验证。
