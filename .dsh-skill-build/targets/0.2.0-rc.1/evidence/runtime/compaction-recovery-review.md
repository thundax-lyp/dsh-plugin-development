# Compaction / Context Recovery 核查

## 精确目标

`dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。公开事实来自 `packages/compaction/compaction/src/index.ts`、`types.ts`、`checkpoint.ts`，`compaction-basic/src/index.ts`、`types.ts`、`config.ts`，`compaction-tool-result-pruner/src/index.ts`，`compaction-image-offload/src/index.ts`，`packages/core/agent/src/runtime-types.ts` 与对应 tests。新作者文件 `api-compaction-context-recovery.md`、`how-to-compose-compaction-recovery.md`；隔离消费包 `evidence/tests/compaction-recovery-consumer/`。

## 候选账本

| 候选 ID | 公开成员或事件 | 归属 |
| --- | --- | --- |
| `compaction.engine` | `CompactionEngine.compactIfNeeded/compactNow/compactRegion`、trigger/result/manual error | `api-compaction-context-recovery.md` |
| `compaction.checkpoint` | `compactCheckpointSource`、`isCompactCheckpointSource`、`toolPairingBalancedBefore/After`、Session 事件 | `api-compaction-context-recovery.md` |
| `compaction.summary-recovery` | `compaction/summary-error` 同步 waterfall | `api-compaction-context-recovery.md` |
| `compaction.basic` | `BasicCompactionEngine`、`BasicCompactionConfig`、auto pressure/overflow 恢复 | `api-compaction-context-recovery.md` |
| `compaction.tool-pruner` | `ToolResultPruner.pruneContent/pruneSession/measureContent`、配置/result | `api-compaction-context-recovery.md` |
| `compaction.image-offload` | 发布插件 `apply` 的 durable image-offload 恢复路径 | `api-compaction-context-recovery.md` |
| `agent.request-recovery` | `agent/request-error`、`RequestErrorAction`、结构化 failure/signal | `api-compaction-context-recovery.md` |

`BasicCompactionEngine` 是一个已发布实现，`CompactionEngine` 是唯一 service 抽象；`ToolResultPruner` 可独立组合，但它的 Session mutation 必须保持 shadow-price 与 replacement 邻接。`agent/request-error` 不是无条件 retry 开关；需 durable surface 或其他可重建进展。

## 独立验证与未覆盖范围

隔离包安装发布 rc.1 声明，通过 `npm run build`、`npm run smoke`、`npm pack --dry-run --json`。smoke 装载真实 `LlmRuntime`、`SessionStore`、`SessionProjectionRegistry`、`TokenMeter`，再装载示例插件，确认 `ctx.compaction` 和 `ctx.toolResultPruner` 注册、长文本 `pruneContent` 缩小、父插件卸载清除两个 service。Prettier 和 JSON 代码块检查另行执行。

本次没有 AgentLoop step、真实模型摘要、`compactNow` idle maintenance、`compactRegion` durable 替换、Session 重启恢复、`summary-error` image offload 或 context overflow retry 的独立运行。上述语义由目标代码与现有测试支持；组合/内容纯函数 smoke 不证明端到端恢复。
