# 非 Session 状态的持久化

## 完成非 Session 状态的持久化插件任务

目标结果：非 Session 状态的持久化入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-storage-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. base-backed Profile 直接复用既有 storage stack，不重复 insert 或修改共享根。独立空组合才装配 storage、storage-json 与 storage-domain：json.config.root 显式指定数据根，domain.config.backend 设 json；有多个 backend 时通过 routes 按 domain name 选择。
2. 在 owning 包一次 defineDomain：name、version、tables 的 zod schema。消费者 inject storageDomain，在 effect 内 await open(spec)，保留 typed handle。
3. 按[完整持久插件](../examples/example-runtime-storage.md)写入、关闭再重开。get 返回对象不可改，put 是完整替换，update 的纯函数在队列槽内运行。卸载等待 close。



安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-storage-domain](../api/api-runtime-dsh-storage-domain.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-storage-json](../api/api-runtime-dsh-storage-json.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-storage-sqlite](../api/api-runtime-dsh-storage-sqlite.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-storage](../api/api-runtime-dsh-storage.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

重复后端/形态、backend-not-found、facet-unsupported、already-open、invalid-record、missing-key、closed 均要显式处理；没有跨表事务或跨进程变更广播，不能据 domain/changed 推断多实例一致性。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
