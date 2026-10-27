# Shell 命令、期限与持久执行句柄

## 完成Shell 命令、期限与持久执行句柄插件任务

目标结果：Shell 命令、期限与持久执行句柄入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-shell-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 默认 base 已有 `id: subprocess`，在非 Windows 上启用 `id: bash-sandbox`（Windows 使用 `pwsh-sandbox`）；消费插件声明 `inject = ['shell']` 并复用它，不再装载 bash-local。只有独立空组合才添加 subprocess-local 与一个 shell provider。若明确要改为裸本地执行，先停用原 shell provider，再启用 bash-local；这会改变隔离边界，不能把裸 backend 写成已隔离。
2. 消费插件 inject shell，先 resolve({command,...}) 后 execute(resolvedSpec)；await execution.result() 判断业务返回。要保留后台 handle 时 onExpiry 设 none，并由调用者单独限制等待。
3. 检查非零退出、准备失败、准备超时、运行超时与 signal 撤销。readOutput 连续调用不重复旧输出；停止调用者自己的 process 并等待，不卸载其他插件共享 subprocess。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-bash-local](../api/api-runtime-dsh-bash-local.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-bash-sandbox](../api/api-runtime-dsh-bash-sandbox.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-pwsh-local](../api/api-runtime-dsh-pwsh-local.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-pwsh-sandbox](../api/api-runtime-dsh-pwsh-sandbox.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-shell-env](../api/api-runtime-dsh-shell-env.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-shell](../api/api-runtime-dsh-shell.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-bash-persistent](../api/api-runtime-dsh-tool-bash-persistent.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-bash](../api/api-runtime-dsh-tool-bash.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-pwsh-persistent](../api/api-runtime-dsh-tool-pwsh-persistent.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-pwsh](../api/api-runtime-dsh-tool-pwsh.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

准备阶段超时可以返回已结算且无输出的 handle；准备失败或发布前取消会 reject。检查 timedOut、aborted、exit code，不把 Promise fulfilled 等同于命令成功。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
