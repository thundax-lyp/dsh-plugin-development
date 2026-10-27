# 文件读取、原子写入与观察保护

## 完成文件读取、原子写入与观察保护插件任务

目标结果：文件读取、原子写入与观察保护入口可在目标 Profile 中完成操作并清理。

### 目标与前置

在 `@deepseek-ai/dsh-agent@0.2.1-rc.3` 的消费 Profile 中建立本主题的可调用入口，观察结果并完成本包资源清理。先按[主题选型](../api/api-runtime-fs-overview.md)选择需要的服务/后端；抽象定义、具体 provider 与工具/UI 消费包不是同一个组件。

### 实现与装载

先执行[已有 Profile 的组合检查](../how-to/how-to-core-profile.md#在已有-profile-中复用或替换服务)。默认 web/base 已有的服务直接注入使用；不要为调用服务再次插入同类实现。仅空组合或确认缺失时补足下列服务栈，替换 provider 前先停用原条目并保留其他消费者的依赖。

1. 在插件声明 inject = ['fs']；先检查现有 Profile；base 已提供 fs-sandbox，不重复加载 provider。仅独立空组合可安装 fs-local 提供本地后端，需要沙箱时选择 fs-sandbox 并满足其 sandbox/subprocess 依赖。不要同时装载两个竞争 ctx.fs 的 provider。
2. 调用 resolve(path,{cwd,signal})，再 stat/readText；保留读取所得 version。完整写入用 createIfAbsent 或 replaceIfVersion，文字替换调用 editText 并传旧 version。
3. 按[完整文件插件](../examples/example-runtime-fs.md)建立包和 bundle patch，执行构建、安装、观察与卸载。遇到 stale 重新读，不移除保护参数重放。



安装本地代码包前在包目录运行 `pnpm install`、`pnpm run build`，再执行 `dsh plugin --profile development add .`。Profile 未启用 HMR 时重启运行进程。普通 npm dependency 不会自动激活 Cordis 模块，包的 `dsh.bundle.patch` 中须有 insert 行。模块配置按其 Config/schema 声明填必填项，不能把 DSH 包版本套给 vendor 包：Cordis 版本是 `4.0.5`。

### 对象与后端选择

- [dsh-fs-local](../api/api-runtime-dsh-fs-local.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-fs-observation-policy](../api/api-runtime-dsh-fs-observation-policy.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-fs-sandbox](../api/api-runtime-dsh-fs-sandbox.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-fs](../api/api-runtime-dsh-fs.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-fs-search](../api/api-runtime-dsh-tool-fs-search.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-fs](../api/api-runtime-dsh-tool-fs.md)：本包导出、配置 schema、成员及失败/资源边界。
- [dsh-tool-str-replace-editor](../api/api-runtime-dsh-tool-str-replace-editor.md)：本包导出、配置 schema、成员及失败/资源边界。

### 验证与完成判据

按 FsError.code 区分 FS_STALE_VERSION、FS_NOT_OBSERVED、FS_EDIT_NOT_FOUND、FS_AMBIGUOUS_EDIT、FS_ABORTED；冲突后重新读取并取得新版本，不能删掉 expected 强制重放。

先在目标版本声明下编译，再在隔离 Profile 做上面列出的成功与失败操作。观察插件 fiber 已激活、返回值符合所选对象声明；缺少注入服务时先修复组合，不能通过重复手工调用 apply 补救。卸载本包后其注册不可再选用、它启动的资源已等待清理；重新装载不会残留重复注册。持久任务关闭后重开核对事实，进程内状态不承诺跨重启恢复。
