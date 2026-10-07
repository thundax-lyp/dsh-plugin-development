# rc.1 output-retention 插件作者任务

精确 checkout `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`packages/util/output-retention/src/index.ts` 根导出 `ItemRetainer`、`TextRetainer`、`describeOmitted`、`formatRetentionNotice`、`truncateWithoutSplittingSurrogatePair` 及结果/策略类型。它明确是直接导入的库，无 `name/inject/apply`、Cordis service、事件或跨调用资源。第三方工具可完成“有界模型输出 + 精确省略 footer”，owner 建议 `references/api-output-retention.md` 的 `对象类型与成员`，完整任务 `references/how-to-bound-tool-output.md`。

隔离 `evidence/tests/output-retention-consumer/` 使用 npm 发布 `@deepseek-ai/dsh-output-retention@0.2.0-rc.1`、Cordis 4.0.4、TypeScript 6.0.3；`npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm run smoke`、`npm pack --dry-run --json` 均成功。smoke 观察 `headTail` 的多字节边界保留 `abc😀dijklmnop`、精确省略 4 字节、footer `Omitted 4 bytes.` 加工具恢复句，`ItemRetainer` 前两项与省略 1 项。独立包 dry-run 含编译 JS/d.ts。

未运行真实工具上游、Session 日志写入、二进制/权限失败、流取消或极大 chunk 的内存压测。`truncated` 只代表 retainer 自身预算省略，不能替代这些领域事实。
