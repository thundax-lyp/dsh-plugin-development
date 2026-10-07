# 给插件配置凭证并接入执行权限

## 目标与前置

目标版本 `dsh-v0.2.0-rc.1`。一个 Host 插件需要调用外部服务时，在配置里保存环境变量形状的凭证引用，在每次外部操作前通过 `ctx.credentials.resolve()` 读取，并让执行权限仍由当前 Session 的 sandbox、approval 与工具 guard 决定。权威契约见 [凭证](api-credentials.md)、[授权流程](api-authorization.md)、[权限预设](api-permission-presets.md)、[实时设置](api-settings.md)；包安装和 Profile patch 步骤见 [Bundle 与 Profile](api-profile-bundle.md)。

## 实现步骤

1. 为 Host 包声明 `@deepseek-ai/cordis`、`@deepseek-ai/dsh-credentials` 和 `@deepseek-ai/schemastery` 版本与目标 Profile 一致。`src/index.ts` 导出插件名、`inject = ['credentials']` 和 `Config` schema。Config 字段存 `EXAMPLE_API_KEY` 这类**引用名称**；用户的真实值放入本地 Provider 管理文件或有效的环境来源。需要实时改引用时用 `z.string().volatile()`，操作开始读取 `.get()`。
2. 在每次需要外部服务的操作开始处调用 `credentialRef()` 校验名称，再 `await ctx.credentials.resolve(ref)`，无值则返回本次操作的明确失败；只将 `value` 传给私有网络适配器，完成后丢弃本次快照。不要把值传给模型工具规范结果、Session 事件、日志或 Client。轮换管理文件后，下一次操作重新解析即可看到新值。若是多字段 OAuth grant，则以插件注册名为 scope 构造 `CredentialKey`，使用 `modifyRecord`，交互式取得时注册 [授权流程](api-authorization.md)。
3. 在 bundle patch 中插入本插件的 Host 包，并检查目标 Profile 已装载 `credentials-local`。base bundle 有该 Provider；自定义 Profile 必须按依赖顺序装载。工具调用仍需遵守本工具的 guard 与 Session 的权限，不能以成功取得凭证推断已获执行许可。若业务需选择预设，使用已挂载的 `/permission` 命令或 `ctx.permissionPresets.set(session, name)`，不得手写 `permission/preset` 事件。
4. 可编辑实时字段通过 [设置表单](api-settings.md)进入 Profile patch；Web 端读已遮蔽的远端视图后用 `mutate` 按路径提交，带上 `expectedRevision`。`SettingsConflictError` 表示页面已过期，应重新读表单后让用户重新决定。卸载插件时 Cordis fiber 释放注册的监听器/flow；这不会删除凭证，删除记录由用户显式退出登录的路径执行。

## 验证与完成边界

先对独立 Host 包做声明编译，再在安装目标 Profile 的 `dsh --profile <name> --dump-config` 里确认 Provider 和消费插件行；真实启动后验证：未配置返回明确错误、已配置的下一次操作成功、轮换后下一次操作使用新值、只读进程环境遮蔽时拒绝写入、卸载插件后不再处理操作。若使用权限预设，还需核对 `/permission` 后 Session 中 `permission/preset` 与两个 knob 事件及重启恢复。若使用 Web 设置，另需浏览器表单实测。这里列出的是待执行的消费验证步骤，当前专题只完成源码审查，未做独立包编译或真实 Profile/浏览器运行。
