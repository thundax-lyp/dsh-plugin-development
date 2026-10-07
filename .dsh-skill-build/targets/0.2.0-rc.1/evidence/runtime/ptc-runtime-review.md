# PTC Runtime 公开能力独立验证

- 精确源：`dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`；`packages/ptc-runtime/ptc-runtime/src/{index,types}.ts`、`ptc-runtime-node/src/{index,bindings,process,bootstrap}.ts`。组合线索：`ptc-runtime-node/tests/{setup,runtime,built-lib.e2e}.ts`。
- 隔离 npm 消费包 `evidence/tests/ptc-consumer` 安装精确 rc.1 的 runtime、Node provider、FS local、Subprocess local、Sandbox local、Sandbox policy、Session projections 和 Cordis 4.0.4。`npm install --ignore-scripts --no-audit --no-fund` 与 `npm run smoke` 通过，输出 `PTC Node runtime binding smoke passed`；运行发生在独立 Node 子进程，装载发布包 `process.js`。
- 实际观察：`resolve` + `run`、Host JSON binding、有效 JSON 完成值、空的程序 `process.env`、绑定拒绝的 `CatalogError`/成员名、程序异常作为 `result.error.kind='exception'`；runtime/进程清理后 smoke 结束。
- HOW-TO 的 manifest、tsconfig 与 TypeScript 代码块原样抽至 `howto-host-binding`，在精确 npm 声明上 `tsc -p` 通过。
- 安全边界：smoke 明确装载 `sandboxPolicy` 的 `danger-full-access`，因此不验证文件限制。未运行模型工具/Workflow 消费链、Session 日志、超时/abort、真实权限入口、跨平台封闭与重启恢复。Node process 隔离本身不代表授权或安全沙箱。

## parent 集成候选

- 包 `@deepseek-ai/dsh-ptc-runtime` / `@deepseek-ai/dsh-ptc-runtime-node`：`PtcRuntime`、`PtcRunRequest`、`PtcRunSpec`、`PtcRunResult`、`PtcBindingNamespace`、`NodePtcRuntime`。新 reference `api-guardrails/ptc-runtime.md`；任务 `how-to/how-to-run-program-with-host-binding.md`，heading `运行带 Host binding 的程序`。
- `@deepseek-ai/dsh-experimental-ptc-runtime-python` 位于 experimental，目标发布的 TypeScript Node backend 是此任务的实际消费路径；不把 Python backend 记为已发布支持。
