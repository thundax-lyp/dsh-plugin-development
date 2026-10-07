# Compaction 与模型请求恢复

## 公开服务与请求错误 Hook

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-compaction` 根入口公开 `CompactionEngine` 抽象 service、`CompactionResult`、`CompactionTrigger`、`ManualCompactionError`、checkpoint source 构造/识别和工具配对边界检查。Profile 装载一个 `ctx.compaction` 实现；已发布 `@deepseek-ai/dsh-compaction-basic` 是默认可组合后端。完整组合见 [装载可恢复 Compaction](how-to-compose-compaction-recovery.md)。

`CompactionEngine.compactIfNeeded(agent,'pressure'|'context-overflow',signal)` 返回成功结果或无安全区间时 `null`；`compactNow(agent,signal,sourceCommandId?)` 要求 idle Agent 的 `runMaintenance` 所有权，开始独立持久事务；`compactRegion(start,end,agent,signal?)` 的边界是**当前 surface 位置**，不是 seq 数值排序，工具调用/结果必须成对。`CompactionResult` 给出 transaction id、start/summary/end seq、被遮蔽 surface 节点、摘要和 token accounting。手动失败用 `ManualCompactionError.code` 分类 busy/cancelled/changed/summary/commit/persistence，已失败的事务仍在日志中可见。任意插件不能直接写一个“摘要文字”冒充已完成 compact：规范路径需 `compaction/start`、`compaction/summary`、紧邻的 `user/message` surface replace、`compaction/end`，并保留原始事件用于恢复。

`compaction/summary-error` 是**同步** waterfall `(payload,next)=>boolean`；payload 包含 Session、所选输入的 event seqs、error 与可选 signal。只有在**同步写入了可恢复、持久的输入变化**后才可返回 true；否则调用 `next()`。backend 随后重新选择并计价输入。已发布 `compaction-image-offload` 在模型要求 image offload 时记录 durable `image/offload` 并返回 true，是具体实现示范；不用错误文字猜失败类型。

Agent 的公开 `agent/request-error` 是异步 waterfall：payload 有 live Agent、turn/step、provider、结构化 `LlmFailure`、adapter retry policy 和 signal；处理者只在自己完成恢复并有可重试进展时返回 `{kind:'retry'}`，否则 `next()`，默认 `undefined` 使失败结束。`BasicCompactionEngine` 的自动路径在 step 压力处调用 `compactIfNeeded`，在 `CONTEXT_WINDOW_EXCEEDED_CODE` 且未取消、有 durable surface `replaceGeneration` 前进且未超过 maxOverflowRetries 时取得重试所有权。它避免把“捕获到 overflow 错误”本身当成已修复；多次请求仍由 Session 日志重建。

## 组合与模型可见事实

`BasicCompactionEngine` 依赖 `llm`、`tokenMeter`、`sessions`；`ToolResultPruner` 可选但需 `tokenMeter`。后者的 `pruneContent` 按 Unicode code point 截取 head/marker/tail，`pruneSession` 对每个过长当前 tool-result 写 `compaction/prune` shadow price，紧接着写 replacement tool/result；前一节点仍留规范日志。非文字块保留相对顺序。一次 pass 后面的写失败，先前成功 replacement 保持 durable。`BasicCompactionConfig` 可控制 threshold、headroom、retention、summary model、重试次数和 exact provider/model 策略；`auto` 默认 true。压力需要最新已持久路由请求与窗口预算；没有足够安全区间、单个过大的保留单元或请求 envelope 不能靠 surface compaction 修复。

`compactCheckpointSource` 标记实际 summary replacement 的模型可见 user message；摘要生成时 `compaction/summary` 记录模型 provider/model、可选 usage、输入范围和 raw output，以便从 Session 重建。`image-offload` 使用额外投影使被选择的输入图像在后续请求中替换为占位文字；不是删除原附件。插件自己的恢复规则必须有 Session 事件与投影所有权，避免进程内缓存充当唯一进展证明。

## 对象类型与成员

| 公开对象                  | 可用成员与约束                                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CompactionEngine`        | `compactIfNeeded`、`compactNow`、`compactRegion`；前者自动触发，后两者要求明确的维护/区间所有权。                                                                                                                                        |
| `BasicCompactionEngine`   | 上述三种操作和 `config`；已发布实现，不能把其私有请求重试算法当作所有 Engine 的接口。                                                                                                                                                    |
| `BasicCompactionConfig`   | `auto`、`thresholdRatio`、`headroomTokens`、`retainRatio`、`retainTokens`、`maxTokens` 控制触发与保留；`summarizationProvider`、`summarizationModel`、`modelPolicies` 路由摘要；`compactionRetries`、`maxOverflowRetries` 限制失败重试。 |
| `ToolResultPruner`        | `config`、`measureContent`、`pruneContent`、`pruneSession`；只有 `pruneSession` 对 Session 写入耐久替换，字符串截取本身不是 compaction 事务。                                                                                            |
| `CompactionResult`        | `compactionId`、`startSeq`、`summarySeq`、`endSeq` 标识事务；`summary`、`shadowedSeqs`、`shadowedRange`、`shadowedTokenCount` 解释结果；手动路径可有 `sourceCommandId`。                                                                 |
| `CompactionTrigger`       | 自动压缩原因类型，当前可为 pressure/context-overflow；不是可注册触发器。                                                                                                                                                                 |
| `ManualCompactionError`   | `name`、`code` 用于手动失败分类；不以错误文字控制恢复。                                                                                                                                                                                  |
| `compactCheckpointSource` | 为规范摘要替换消息构造来源信息；不能单独提交它就宣称摘要已生效。                                                                                                                                                                         |

## 来源和边界

`packages/compaction/compaction/src/index.ts`、`types.ts`、`checkpoint.ts`；`packages/compaction/compaction-basic/src/index.ts`、`config.ts`、`region.ts`；`packages/compaction/compaction-tool-result-pruner/src/index.ts`；`packages/compaction/compaction-image-offload/src/index.ts`；`packages/core/agent/src/runtime-types.ts`，及各包 tests。隔离消费包范围见 `evidence/runtime/compaction-recovery-review.md`；未运行完整 AgentLoop 模型请求恢复。
