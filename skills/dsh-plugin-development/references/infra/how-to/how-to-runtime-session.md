# Session 耐久句柄、格式与只读投影

## 完成Session 耐久句柄、格式与只读投影插件任务

目标结果：Session 耐久句柄、格式与只读投影入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-session-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 挂载 session-persistence-jsonl 并满足它声明的文件/存储前置。直接持久化消费者 inject sessionPersistence；使用当前 SessionHeader 与连续事件序号，不手工改历史文件。
2. create(header) 或 open(id,'write') 取得 writer handle；读取使用 open(id,'read')，不夺取写权。append 后 await flush 才跨耐久屏障；close 释放 owner。
3. 遇到 ownership lost 停止追加；未知结果先 read 核对 offset，不能直接重放。stat/list 的 revision 只在同 backend instance 与 id 内比较；关闭后重新打开验证完整前缀和 metadata。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-session-checkpoint-policy](../api/api-runtime-dsh-session-checkpoint-policy.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-format-catalog](../api/api-runtime-dsh-session-format-catalog.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-format-catalog--message-projections](../api/api-runtime-dsh-session-format-catalog--message-projections.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-format](../api/api-runtime-dsh-session-format.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-log-deepseek](../api/api-runtime-dsh-session-log-deepseek.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-persistence-jsonl](../api/api-runtime-dsh-session-persistence-jsonl.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-persistence](../api/api-runtime-dsh-session-persistence.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-projection-cache](../api/api-runtime-dsh-session-projection-cache.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-projection](../api/api-runtime-dsh-session-projection.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-stats](../api/api-runtime-dsh-session-stats.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-telemetry-otel](../api/api-runtime-dsh-session-telemetry-otel.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-telemetry](../api/api-runtime-dsh-session-telemetry.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-title-first-prompt-llm](../api/api-runtime-dsh-session-title-first-prompt-llm.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-title-llm](../api/api-runtime-dsh-session-title-llm.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-title](../api/api-runtime-dsh-session-title.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-title--client](../api/api-runtime-dsh-session-title--client.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-title--types](../api/api-runtime-dsh-session-title--types.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-session-turn-outline](../api/api-runtime-dsh-session-turn-outline.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-working-directory](../api/api-runtime-dsh-tool-working-directory.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-working-directory](../api/api-runtime-dsh-working-directory.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

SessionAlreadyOwnedError、SessionOwnershipLostError、SessionReadOnlyError、SessionPersistenceCorruptionError、SessionFormatUnsupportedError、SessionHandleClosedError 分别代表所有权、访问模式、损坏、版本与生命周期问题；不能盲目重放未知是否成功的 append。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
