# @deepseek-ai/dsh-deepseek-account-platform：插件凭证、引用与交互授权

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件凭证、引用与交互授权任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-credentials.md)。

## Config 契约

从 `@deepseek-ai/dsh-deepseek-account-platform` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    platformOrigin?: string;
    desktopPlatform?: 'darwin' | 'win32' | null;
    embeddedPageDist?: string;
    inferenceOrigin?: string;
    allowLoopbackHttp?: boolean;
    rewriteBrowserOrigin?: boolean;
    requestHeaders?: Record<string, string>;
    accountRequestHeaders?: Record<string, string>;
    requestTimeoutMs?: number;
    balanceTimeoutMs?: number;
    logoutMaxRetries?: number;
    logoutRetryDelayMs?: number;
    attemptTimeoutMs?: number;
}

export declare const Config: Schema<Schemastery.ObjectS<NoInfer<{
    platformOrigin: Schema<string, string, "defined">;
    desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
    embeddedPageDist: Schema<string, string, "defined">;
    inferenceOrigin: Schema<string, string, "defined">;
    allowLoopbackHttp: Schema<boolean, boolean, "defined">;
    rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
    requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    requestTimeoutMs: Schema<number, number, "defined">;
    balanceTimeoutMs: Schema<number, number, "defined">;
    logoutMaxRetries: Schema<number, number, "defined">;
    logoutRetryDelayMs: Schema<number, number, "defined">;
    attemptTimeoutMs: Schema<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    platformOrigin: Schema<string, string, "defined">;
    desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
    embeddedPageDist: Schema<string, string, "defined">;
    inferenceOrigin: Schema<string, string, "defined">;
    allowLoopbackHttp: Schema<boolean, boolean, "defined">;
    rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
    requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    requestTimeoutMs: Schema<number, number, "defined">;
    balanceTimeoutMs: Schema<number, number, "defined">;
    logoutMaxRetries: Schema<number, number, "defined">;
    logoutRetryDelayMs: Schema<number, number, "defined">;
    attemptTimeoutMs: Schema<number, number, "defined">;
}>>, "plain">;
```

成员检索：`accountRequestHeaders`、`allowLoopbackHttp`、`attemptTimeoutMs`、`balanceTimeoutMs`、`desktopPlatform`、`embeddedPageDist`、`inferenceOrigin`、`logoutMaxRetries`、`logoutRetryDelayMs`、`platformOrigin`、`requestHeaders`、`requestTimeoutMs`、`rewriteBrowserOrigin`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## PlatformAccount 契约

从 `@deepseek-ai/dsh-deepseek-account-platform` 导入 `PlatformAccount`。`PlatformAccount` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class PlatformAccount extends DeepSeekAccount {
    static inject: string[];
    static Config: Schema<Schemastery.ObjectS<NoInfer<{
        platformOrigin: Schema<string, string, "defined">;
        desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
        embeddedPageDist: Schema<string, string, "defined">;
        inferenceOrigin: Schema<string, string, "defined">;
        allowLoopbackHttp: Schema<boolean, boolean, "defined">;
        rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
        requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        requestTimeoutMs: Schema<number, number, "defined">;
        balanceTimeoutMs: Schema<number, number, "defined">;
        logoutMaxRetries: Schema<number, number, "defined">;
        logoutRetryDelayMs: Schema<number, number, "defined">;
        attemptTimeoutMs: Schema<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        platformOrigin: Schema<string, string, "defined">;
        desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
        embeddedPageDist: Schema<string, string, "defined">;
        inferenceOrigin: Schema<string, string, "defined">;
        allowLoopbackHttp: Schema<boolean, boolean, "defined">;
        rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
        requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        requestTimeoutMs: Schema<number, number, "defined">;
        balanceTimeoutMs: Schema<number, number, "defined">;
        logoutMaxRetries: Schema<number, number, "defined">;
        logoutRetryDelayMs: Schema<number, number, "defined">;
        attemptTimeoutMs: Schema<number, number, "defined">;
    }>>, "plain">;
    constructor(ctx: Context, config?: Config);
    [Service.init](): Promise<void>;
    getState(): Promise<AccountView>;
    getProfile(client: AccountClientMetadata): Promise<AccountDetails['profile'] | null>;
    getBalance(client: AccountClientMetadata): Promise<AccountDetails['balance'] | null>;
    getUnnotifiedBonuses(client: AccountClientMetadata): Promise<AccountBonusBatch | null>;
    ackBonusNotified(accountId: AccountUserId, orderId: AccountBonusOrderId, client: AccountClientMetadata): Promise<boolean>;
    rejectToken(token: string): Promise<void>;
    getDeviceIdentity(): Promise<{
        deviceId?: string;
        userId?: AccountUserId;
        osVersion: string;
    }>;
    getPlatformSession(): Promise<PlatformSession | null>;
    resolveToken(url: string): Promise<string | undefined>;
    startSignIn(client: AccountClientMetadata, callbackOrigin: string, loginSource: 'web' | 'desktop'): Promise<AccountView>;
    cancelSignIn(id: SignInAttemptId): Promise<AccountView>;
    signOut(client: AccountClientMetadata): Promise<AccountView>;
    watch(signal: AbortSignal, includeIdentityChanges?: boolean): AsyncIterable<AccountView>;
}
```

成员检索：`ackBonusNotified`、`cancelSignIn`、`getBalance`、`getDeviceIdentity`、`getPlatformSession`、`getProfile`、`getState`、`getUnnotifiedBonuses`、`rejectToken`、`resolveToken`、`signOut`、`startSignIn`、`watch`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。
