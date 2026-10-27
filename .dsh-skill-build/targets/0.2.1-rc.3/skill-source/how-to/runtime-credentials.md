# 插件凭证、引用与交互授权

## 完成插件凭证、引用与交互授权插件任务

目标结果：插件凭证、引用与交互授权入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-credentials-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 挂载 credentials-local 保存凭证；要人机授权再挂载 authorization。插件先声明自己的 scope 与 CredentialKey，配置暴露 CredentialRef 而不是原始 secret。
2. registerFlow({key,label,methods,run})；methods 必须非空。run 使用 session.notify/prompt 与人交互，最终 session.commit(record)；服务确认该 attempt 内实际提交且仍存在。
3. 启动方传 interaction 与 signal。人类拒绝 prompt 才用 AuthorizationDeclinedError，撤销 signal 保留其原因；卸载 flow 撤销注册并等会话结算。不得把凭证存储当 Host 用户鉴权。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-authorization](../api/api-runtime-dsh-authorization.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-credentials-local](../api/api-runtime-dsh-credentials-local.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-credentials](../api/api-runtime-dsh-credentials.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-deepseek-account-platform](../api/api-runtime-dsh-deepseek-account-platform.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-deepseek-account-platform--types](../api/api-runtime-dsh-deepseek-account-platform--types.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-deepseek-account](../api/api-runtime-dsh-deepseek-account.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

AuthorizationDeclinedError 只用于人类明确拒绝，signal 撤销不能冒充人类回答。授权协议由 flow 自己实现；credentials 服务不是 Host 身份认证或多租户授权边界。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
