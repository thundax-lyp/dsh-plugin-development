# 持久终端后端与会话

## 完成持久终端后端与会话插件任务

目标结果：持久终端后端与会话入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-terminal-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 组合 terminal、terminal-bash、sandbox、sandbox-policy 与 subprocess provider；需要模型工具时另外启用 tool-terminal。消费注入 terminals，backend 按 type 注册。
2. 按服务 spawn 的精确请求填写 owner Agent、backend type、工作目录和输出边界，保存 session id。send/read/signal/kill 都传同一个 owner，不能转用 fork 后的 Agent 对象。
3. 一次只发一个 send。根据 wait reason 决定继续交互，timeout 不代表 shell ready。卸载等待 kill 及后台 setup rollback；重新启动 Host 后不复用旧 terminal id。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-terminal-bash](../api/api-runtime-dsh-terminal-bash.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-terminal](../api/api-runtime-dsh-terminal.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

NO_BACKEND、NO_SESSION、FOREIGN_SESSION、SEND_ACTIVE、OWNER_NOT_LIVE 必须分别处理；TerminalBackendCleanupError 代表资源清理仍失败，不能向用户报告已关闭。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
