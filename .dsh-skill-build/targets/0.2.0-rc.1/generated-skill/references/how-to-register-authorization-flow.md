# 为插件注册人工授权流程

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。用户在授权界面为一个插件持有的服务粘贴 API key，插件把它提交为可持久读取的记录。完整可编译的 `package.json`、`tsconfig.json`、Host `src/index.ts` 和 `cordis.patch.yml` 位于 [授权流程 reference](api-authorization.md)；记录形状、读写与存储规则位于 [凭证 reference](api-credentials.md)。目标 Profile 需装载授权服务与一个凭证 Provider；base bundle 已提供两者。

## 实现步骤

1. 按授权 reference 的四个文件创建独立包；`credentialKey('example-authorization', 'sample-service')` 的 scope 与导出插件名一致。`inject = ['authorization', 'credentials']` 使缺少服务时无法装载。`registerFlow` 的 `methods` 非空，流程一次只服务该 key。Host 包内先运行 `npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm pack --dry-run --json`，确认声明及 bundle patch 都在包中。
2. 将包通过 `dsh plugin --profile <name> add ./dsh-authorization-consumer-rc1` 装入目标 Profile，使用 `dsh --profile <name> --dump-config` 核对授权、凭证 Provider、本包的行，然后真实启动。`--dump-config` 只能证明装配，不证明流程运行。
3. 调用者给 `begin` 提供 `key`、选用的 `paste-key` 方法和界面的 `interaction`。界面用 secret prompt 接收值；插件检查空值和 `session.signal`，通过 `session.commit({kind:'api-key', key: secret})` 原子提交。成功返回 `{status:'authorized'}` 后可用 `ctx.credentials.describeRecord(key)` 确认配置状态，不能把 `readRecord` 的实际值发往 Client。模型可见事实与 Session 记录均不接收秘密；该任务只有配置持久性，不生成模型任务事实。
4. 人拒绝时界面的 `prompt` 必须以 `AuthorizationDeclinedError` 拒绝，`begin` 返回 cancelled；关闭界面或卸载插件时取消请求/调用 flow disposer。若同键第二次开始，`ALREADY_IN_FLIGHT` 是拒绝而不是第二个 prompt；一个流程异常到达调用者并通过 `authorization/settled` 向其他观察界面报告 failed。退出登录若仅执行 `deleteRecord`，只删除本地记录；外部服务撤销需另行实现。

## 验证与完成边界

当前仅在隔离消费包运行了安装、Host 声明编译和 pack dry-run，记录在维护 evidence 中。完成任务还需真实 Profile 装载并观察：`list()` 出现该 key、授权成功后 `describeRecord().configured` 为 true、取消/拒绝不误报 authorized、卸载后 `describe(key)` 不再显示流程、重启后记录仍可读取但未完成中的尝试不会恢复。上述运行验证尚未执行；调用者必须提供实际授权界面或其它符合 `AuthorizationInteraction` 的入口，不能将包本身视为已有 UI。
