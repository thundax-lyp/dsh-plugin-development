# 独立 Loader Profile 进程 smoke

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-loader-smoke` 是**测试支持库**，不装载为 Cordis service。`runLoaderSmoke` 负责隔离 cwd、启动测试 bin、关闭 stdin、限定超时、检查退出码和清理；被测 bin 必须自己通过 Loader 启动真实 `cordis.yml`。完整独立 consumer 见[测试真实 Loader Profile](how-to-smoke-loader-profile.md)，其中小型 bin 调用目标 `@deepseek-ai/dsh-app-boot.boot`，检查本地插件激活和卸载标记。

## 对象类型与成员

| 公开成员                                                      | 用途和边界                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `runLoaderSmoke(options)`                                     | `label/binScript/configPath/tsconfigPath` 必需；`mode:'src'\|'lib'`、`libBinScript`、`binArgs`、`sourceImport`、`env`、`processTimeoutMs`、`expectedExitCode`、`prepare/inspect` 可选；`tempDirPrefix` 或 caller 自有 `cwd` 二选一。返回完整 stdout/stderr。 |
| `resolveExampleMode` / `EXAMPLE_MODE_ENV` / `ExampleMode`     | `DSH_EXAMPLE_MODE` 缺失默认 src，非法值抛错；lib 走纯 Node/built `lib`，src 用 tsx 与 `TSX_TSCONFIG_PATH`。                                                                                                                                                  |
| `resolveExampleLaunch` / `ExampleLaunch`                      | 从 src bin 和可选 lib bin 组装命令/参数/环境；会清理继承的 proxy 名以免 fixture 请求误走外部代理。它只解析 spawn，不执行。                                                                                                                                   |
| `LOADER_SMOKE_TEST_TIMEOUT_MS`                                | 45 秒的测试框架推荐 deadline，给默认 30 秒进程诊断留余量；调用方可单独传 `processTimeoutMs`。                                                                                                                                                                |
| `runFixtureTurn` / `FixtureTurnOptions` / `FixtureTurnResult` | 更高层 Agent 轮次 fixture helper；仅在真实 Agent/Profile 装配后使用，本页任务的 Loader 启动 smoke 不依赖它。                                                                                                                                                 |

## 生命周期、失败与边界

runLoaderSmoke 创建临时 cwd 时最终删除它；若传已有 cwd，caller 自己清理。`prepare` 在 spawn 前、`inspect` 在期望退出后且清理前执行。spawn 时关闭 stdin，设置隔离 `DSH_HOME` 与 `DSH_AGENTS_HOME`；超时 SIGKILL，非预期 exit 与超时均带 stdout/stderr 诊断。`expectedExitCode` 只用于**预期的失败场景**，成功不能冒充失败测试。要验证插件行为，driver 必须在子进程内从真实 Profile 产生报告；测试不能预填报告再断言。smoke 本身不证明 Web/Client、Agent 轮次、权限或恢复。

## 验证

精确源码 `packages/test-support/loader-smoke/src/{index,agent-turn}.ts`；真实 Loader 启动由 `packages/boot/app-boot/src/index.ts:972-1035` 完成。隔离 `evidence/tests/loader-profile-consumer/` 用 npm rc.1、TS6 编译，真实 Loader 载入相对插件、记录激活与卸载、runLoaderSmoke 清理临时 cwd；见 `evidence/runtime/loader-smoke-profile-review.md`。未运行生产 base Profile 或真实 Agent 请求。
