# 大结果落盘与可检索定位符

## 完成大结果落盘与可检索定位符插件任务

目标结果：大结果落盘与可检索定位符入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-spill-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 挂载 spill-local；要自动处理超长工具结果再加 spill-policy 并明确 maxInlineTokens。消费插件 inject spillStore，source 区分 tool 与 session-reference。
2. 调用 saveText({owner:{sessionId},source,suggestedName,content})，仅把返回 locator、bytes、retrievalHint 作为保存结果。模型结果和预览由原工具的规范结果产生。
3. 保存失败按调用任务保留 inline 原文或拒绝，不生成虚假 locator。卸载释放本插件操作；文件保留与到期归 backend，locator 本身不是读取授权。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-spill-local](../api/api-runtime-dsh-spill-local.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-spill-policy](../api/api-runtime-dsh-spill-policy.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-spill-policy--notice](../api/api-runtime-dsh-spill-policy--notice.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-spill](../api/api-runtime-dsh-spill.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

locator 为不透明值，不解析成固定本地路径。保存失败由调用方选择保持原结果或失败，不能报告保存成功；过期与回收由后端负责。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
