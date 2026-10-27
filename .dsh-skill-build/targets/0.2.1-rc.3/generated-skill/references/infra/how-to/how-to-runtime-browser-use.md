# 浏览器自动化能力注册

## 完成浏览器自动化能力注册插件任务

目标结果：浏览器自动化能力注册入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-browser-use-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 先装载 browser-use 契约服务，再选择已公开且适合目标浏览器的具体驱动；实验 provider 只有在其实际依赖齐全时启用。
2. 注册/选择能力后发起一次本地页面操作并观察返回；不能因 service 可解析就宣称浏览器连接或登录已完成。驱动各自 Client/Remote 条件另行检查。
3. 取消操作传 signal，卸载撤销注册并停止本包创建的连接/浏览器；不要结束部署者共享或用户自己启动的浏览器。

需要创建代码包时，采用[独立包完整文件](../examples/example-core-service.md)建立 exports、构建和 bundle patch，按下面公开对象声明实现本任务；只配置现成后端无需另建包。

安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-browser-use](../api/api-runtime-dsh-browser-use.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-browser-use--brand](../api/api-runtime-dsh-browser-use--brand.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

清理期间仍保留 providerName，以阻止另一个 provider 抢占未释放资源。OS/浏览器权限与具体驱动错误由 provider 处理；名称注册不是用户授权。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
