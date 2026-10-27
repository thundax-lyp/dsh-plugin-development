# @deepseek-ai/dsh-api-settings-controller .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-settings-controller 选型与组合](api-core-dsh-api-settings-controller-root-overview.md)。

`@deepseek-ai/dsh-api-settings-controller` 为浏览器配置界面提供生成的 `ctx.remote.settings` 与 `ctx.remote.credentials` namespace。它返回脱敏的 settings 与凭据元数据，支持 settings 与凭据写入而不返回机密值，并在 Host 桌面打开由提供方持有的 settings 或 Agent preset 位置。提供方缺失时，namespace 仍会注册，并返回可操作的配置错误。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## CredentialsController 公开契约

与settings controller一起装载的凭据Remote owner；具体凭据读写provider缺失时应明确报告，不把namespace存在当凭据配置完成。Secret值不能进入普通settings描述或模型上下文，身份与授权仍由Peer/RemoteAccess控制。

导入入口：`@deepseek-ai/dsh-api-settings-controller`；公开符号：`CredentialsController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class CredentialsController extends TypertRemoteService {
    constructor(ctx: Context);
    describe(refs: string[]): Promise<Record<string, CredentialInfo>>;
    set(ref: string, value: string): Promise<void>;
    unset(ref: string): Promise<void>;
}
```

成员检索：`describe`、`set`、`unset`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SettingsController 公开契约

Host拥有settings Remote namespace，所有读取均要求redactSecrets:true并逐字段投影wire view，避免provider额外属性泄漏。update/replace/mutate委派settings provider，provider拒绝按settings/conflict或settings/rejected分类；缺provider返回明确配置诊断。构造时并列挂载credentials namespace，但这不代表任意凭据provider存在。

导入入口：`@deepseek-ai/dsh-api-settings-controller`；公开符号：`SettingsController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SettingsController extends TypertRemoteService {
    constructor(ctx: Context, internals?: SettingsControllerInternals);
    describe(): SettingsDescribeValue;
    update(ns: string, patch: Record<string, JsonValue>, expectedRevision: number | undefined): Promise<SettingsNamespaceView>;
    replace(ns: string, section: Record<string, JsonValue>, expectedRevision: number | undefined): Promise<SettingsNamespaceView>;
    mutate(ns: string, ops: SettingsPathOpView[], expectedRevision: number | undefined): Promise<SettingsNamespaceView>;
    openSettingsDocument(signal: AbortSignal): Promise<SettingsDocumentOpenValue>;
}
```

成员检索：`describe`、`mutate`、`openSettingsDocument`、`replace`、`update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SettingsControllerInternals 公开契约

导入入口：`@deepseek-ai/dsh-api-settings-controller`；公开符号：`SettingsControllerInternals`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SettingsControllerInternals {
    readonly openTextFile?: (path: string, signal: AbortSignal) => Promise<void>;
}
```

成员检索：`openTextFile`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SettingsDocumentOpenValue 公开契约

导入入口：`@deepseek-ai/dsh-api-settings-controller`；公开符号：`SettingsDocumentOpenValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SettingsDocumentOpenValue {
    readonly opened: true;
}
```

成员检索：`opened`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
