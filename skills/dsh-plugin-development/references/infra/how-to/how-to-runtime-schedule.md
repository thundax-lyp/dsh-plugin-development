# 定时任务的声明与投递

## 完成定时任务的声明与投递插件任务

目标结果：定时任务的声明与投递入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-schedule-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 按 ScheduleService 的 inject 配齐 Session、存储与子任务服务后挂载 schedule；纯调度配置与真正模型执行分别验证。
2. create 请求必须提供合法 title、prompt 和 at/after/every/daily/weekly/cron 的对应规则，显式时区按所选 input 填写；先处理 NotFuture、InvalidRule、FrequencyTooHigh 等输入错误。
3. 修改内容与时间分别走 update 的公开形状，list/view 读取记录；dispatch 与 delivery receipt/history 验证实际投递，不把 future record 创建成功等同任务已执行。停用服务后不宣称未来仍有投递。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-schedule](../api/api-runtime-dsh-schedule.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-schedule--client](../api/api-runtime-dsh-schedule--client.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-schedule](../api/api-runtime-dsh-tool-schedule.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

InvalidRuleError、InvalidTimeZoneError、NotFutureError、FrequencyTooHighError、InvalidPromptError、SubagentSessionError 等区分输入与投递失败；不能因某次 Promise 返回就报告未来任务已经运行。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
