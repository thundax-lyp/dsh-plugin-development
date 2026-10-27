# 交付物与工作区变更呈现

## 完成交付物与工作区变更呈现插件任务

目标结果：交付物与工作区变更呈现入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-deliverables-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 文件交付选 tool-present，工作区修改观察选 workspace-changes；分别核对它们的 attachments/fs/session 所需依赖及 Client 消费。
2. 工具产出一份规范结果，保存可重建引用并经目标版本渲染契约呈现；Host 文件路径仅是引用，不保证浏览器访问。
3. 在真实 UI 观察文件可达、缺失或权限拒绝，重连从 Session 重建；卸载 Client 注册并终止本插件预览资源，保留原交付文件。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-tool-present](../api/api-runtime-dsh-tool-present.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-present--types](../api/api-runtime-dsh-tool-present--types.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-workspace-changes](../api/api-runtime-dsh-workspace-changes.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

呈现失败与内容生成失败分开；不要因为工具返回描述就宣称浏览器已打开文件或用户已看到渲染。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
