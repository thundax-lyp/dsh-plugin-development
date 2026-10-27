# Session 耐久句柄、格式与只读投影

## 对象关系

SessionPersistence 的 create/open 交付 SessionHandle。writer 所有权与 read-only access 不同，append/flush/close 的完成判据必须依据具体 handle；写入权丢失要停止后续 append。原始 Session event 是事实来源，projection/cache/query 是派生读取，不能据缓存路径存在声称事实已提交。格式迁移属于持久化后端读取过程，插件不得直接改写历史 JSONL 或绕过支持版本检查。当前格式与历史迁移工具不可混用。 append 是 best-effort，flush 才是耐久屏障；create 在本进程可见不保证崩溃前已经物化到其他进程，handle.flush 强制物化。revision 只在同服务实例、同 session id 内比较，相等可当未变，不相等不承诺变化内容；它不参与 resume 或 writer 所有权。

## 选型与使用

SessionAlreadyOwnedError、SessionOwnershipLostError、SessionReadOnlyError、SessionPersistenceCorruptionError、SessionFormatUnsupportedError、SessionHandleClosedError 分别代表所有权、访问模式、损坏、版本与生命周期问题；不能盲目重放未知是否成功的 append。

- [@deepseek-ai/dsh-session-checkpoint-policy.](api-runtime-dsh-session-checkpoint-policy.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-format-catalog.](api-runtime-dsh-session-format-catalog.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-format-catalog./message-projections](api-runtime-dsh-session-format-catalog--message-projections.md)：子路径对象。
- [@deepseek-ai/dsh-session-format.](api-runtime-dsh-session-format.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-log-deepseek.](api-runtime-dsh-session-log-deepseek.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-persistence-jsonl.](api-runtime-dsh-session-persistence-jsonl.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-persistence.](api-runtime-dsh-session-persistence.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-projection-cache.](api-runtime-dsh-session-projection-cache.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-projection.](api-runtime-dsh-session-projection.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-stats.](api-runtime-dsh-session-stats.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-telemetry-otel.](api-runtime-dsh-session-telemetry-otel.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-telemetry.](api-runtime-dsh-session-telemetry.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-title-first-prompt-llm.](api-runtime-dsh-session-title-first-prompt-llm.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-title-llm.](api-runtime-dsh-session-title-llm.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-title.](api-runtime-dsh-session-title.md)：模块和公开对象。
- [@deepseek-ai/dsh-session-title./client](api-runtime-dsh-session-title--client.md)：子路径对象。
- [@deepseek-ai/dsh-session-title./types](api-runtime-dsh-session-title--types.md)：子路径对象。
- [@deepseek-ai/dsh-session-turn-outline.](api-runtime-dsh-session-turn-outline.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-working-directory.](api-runtime-dsh-tool-working-directory.md)：模块和公开对象。
- [@deepseek-ai/dsh-working-directory.](api-runtime-dsh-working-directory.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-session.md)说明配置、调用和清理顺序。
