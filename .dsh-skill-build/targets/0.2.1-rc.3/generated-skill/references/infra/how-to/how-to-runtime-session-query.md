# 检索与导出会话的只读视图

## 完成检索与导出会话的只读视图插件任务

目标结果：检索与导出会话的只读视图入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-session-query-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 先提供 session persistence 与 projection，再按 query-sqlite 的注入要求装配索引后端；消费者 inject sessionQuery，不直接读 SQLite 内部表。
2. 查询明确范围与 filters，保留结果 SessionId 和事件位置并能回查日志；搜索/导出只是 read model，不产生新的会话 writer。
3. 记录 provider 的 checkpoint/generation 以判断是否需要刷新；索引异常不当作源会话不存在。卸载关闭查询 cursor/订阅，保留源日志，不能复制旧版本缓存代替重建。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-session-log-export](../api/api-runtime-dsh-session-log-export.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-log-export--client](../api/api-runtime-dsh-session-log-export--client.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-query-sqlite](../api/api-runtime-dsh-session-query-sqlite.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-query](../api/api-runtime-dsh-session-query.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

索引失败或过期不等于源会话不存在；重建/刷新应遵守 provider 的代际与 checkpoint 契约，不能跨版本复制数据库。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
