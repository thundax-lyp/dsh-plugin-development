# 检索与导出会话的只读视图

## 对象关系

检索索引是耐久会话事实的派生 read model，查询结果不能充当 writer 认证或跨实例路由。消费者应保留 SessionId 与事件位置以便回查原日志，并按查询范围与可见性约束选择结果。session-log-export 生成面向消费的投影，不能把导出文本写回原日志。query provider 及依赖的 persistence/projection 必须在实际组合中可用。

## 选型与使用

索引失败或过期不等于源会话不存在；重建/刷新应遵守 provider 的代际与 checkpoint 契约，不能跨版本复制数据库。

- [@deepseek-ai/dsh-session-log-export.](api-runtime-dsh-session-log-export.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-log-export./client](api-runtime-dsh-session-log-export--client.md)：子路径对象。
- [@deepseek-ai/dsh-session-query-sqlite.](api-runtime-dsh-session-query-sqlite.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-query.](api-runtime-dsh-session-query.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-session-query.md)说明配置、调用和清理顺序。
