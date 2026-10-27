# 工具输出预算、取消期限与进程代理

## 完成工具输出预算、取消期限与进程代理插件任务

目标结果：工具输出预算、取消期限与进程代理入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-util-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 在插件peer/dev依赖中固定需要的辅助包；这些库直接import，不写入Cordis insert行。输出预算选择ItemRetainer或TextRetainer，每次工具调用新建实例，不能跨调用共享游标。
2. 根据全量观察结果调用push/finish，将truncated和准确omitted值放进同一份工具规范结果；权限/网络/读取错误独立表示，不能塞入预算truncated。完整工具结构见[工具示例](../examples/example-core-tool.md)。
3. 异步操作用deadline或idleWatchdog融合调用者signal，在finally调用Symbol.dispose清timer；signal不自动停止IO，仍须等待所属handle清理。对Node fetch使用launcher已安装的代理，对其他HTTP客户端按proxyRouteFor配置，子进程用proxyEnvironmentForChild。禁止插件重复install全局代理策略。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-home-paths](../api/api-runtime-dsh-home-paths.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-http-proxy](../api/api-runtime-dsh-http-proxy.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-output-retention](../api/api-runtime-dsh-output-retention.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-timeout](../api/api-runtime-dsh-timeout.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

clampTimeout 的公开 requested 必须正且有限，零不是公开禁用哨兵；deadline 内部 timeoutMs<=0 才表示不设 timer。signal reason 保留第一触发原因；必须 dispose timer。代理继承子进程时使用 proxyEnvironmentForChild；对其他HTTP客户端读取 proxyRouteFor，不绕过用户路由。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
