# @deepseek-ai/dsh-api-account-controller .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-account-controller 选型与组合](api-core-dsh-api-account-controller-root-overview.md)。

账号页面使用经过认证的 Remote 操作和快照流。控制器提供登录状态，不返回 token 或 PKCE 私密数据。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AccountController 公开契约

导入入口：`@deepseek-ai/dsh-api-account-controller`；公开符号：`AccountController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class AccountController extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    getState(): Promise<AccountView>;
    getProfile(client: AccountClientMetadata): Promise<AccountDetails['profile'] | null>;
    getBalance(client: AccountClientMetadata): Promise<AccountDetails['balance'] | null>;
    getUnnotifiedBonuses(client: AccountClientMetadata): Promise<AccountBonusBatch | null>;
    ackBonusNotified(accountId: AccountUserId, orderId: AccountBonusOrderId, client: AccountClientMetadata): Promise<boolean>;
    startSignIn(client: AccountClientMetadata, callbackOrigin: string, loginSource: 'web' | 'desktop'): Promise<AccountView>;
    cancelSignIn(attemptId: SignInAttemptId): Promise<AccountView>;
    hasRunningAccountTasks(): boolean;
    signOut(client: AccountClientMetadata): Promise<AccountView>;
    watchExpiry(signal: AbortSignal): AsyncIterable<'session-expired'>;
    watch(signal: AbortSignal): AsyncIterable<AccountView>;
}
```

成员检索：`ackBonusNotified`、`cancelSignIn`、`getBalance`、`getProfile`、`getState`、`getUnnotifiedBonuses`、`hasRunningAccountTasks`、`signOut`、`startSignIn`、`watch`、`watchExpiry`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
