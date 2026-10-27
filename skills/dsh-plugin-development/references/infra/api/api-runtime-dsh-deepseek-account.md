# @deepseek-ai/dsh-deepseek-account：插件凭证、引用与交互授权

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件凭证、引用与交互授权任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-credentials.md)。

## AccountBonusBatch 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountBonusBatch`。`AccountBonusBatch` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountBonusBatch {
    readonly accountId: AccountUserId;
    readonly bonuses: readonly AccountBonusNotification[];
}
```

成员检索：`accountId`、`bonuses`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountBonusNotification 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountBonusNotification`。`AccountBonusNotification` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountBonusNotification {
    readonly title?: string;
    readonly orderId: AccountBonusOrderId;
    readonly campaign?: JsonValue;
    readonly amount?: JsonValue;
    readonly currency?: JsonValue;
    readonly grantedAt?: JsonValue;
    readonly expiresAt: string;
    readonly message: string;
}
```

成员检索：`amount`、`campaign`、`currency`、`expiresAt`、`grantedAt`、`message`、`orderId`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountBonusOrderId 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountBonusOrderId`。`AccountBonusOrderId` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type AccountBonusOrderId = Branded<'AccountBonusOrderId'>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountClientMetadata 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountClientMetadata`。`AccountClientMetadata` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountClientMetadata {
    readonly version: string;
    readonly locale: string;
    readonly timezoneOffsetSeconds: number;
}
```

成员检索：`locale`、`timezoneOffsetSeconds`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountDetails 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountDetails`。`AccountDetails` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountDetails {
    readonly profile: {
        readonly status: 'ready';
        readonly value: AccountProfile;
    } | {
        readonly status: 'failed';
    };
    readonly balance: {
        readonly status: 'ready';
        readonly value: readonly AccountWallet[];
        readonly bonusWallets: readonly AccountWallet[];
    } | {
        readonly status: 'failed';
    };
}
```

成员检索：`balance`、`profile`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountLinks 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountLinks`。`AccountLinks` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountLinks {
    readonly usageUrl: string;
    readonly topUpUrl: string;
}
```

成员检索：`topUpUrl`、`usageUrl`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountProfile 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountProfile`。`AccountProfile` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountProfile {
    readonly id: AccountUserId | null;
    readonly name: string | null;
    readonly contact: string | null;
    readonly avatarUrl?: string | null;
}
```

成员检索：`avatarUrl`、`contact`、`id`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountUserId 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountUserId`。`AccountUserId` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type AccountUserId = Branded<'AccountUserId'>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountView 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountView`。`AccountView` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountView {
    readonly status: 'signed-out' | 'credential-stored';
    readonly links: AccountLinks;
    readonly attempt: SignInAttemptView | null;
}
```

成员检索：`attempt`、`links`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AccountWallet 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `AccountWallet`。`AccountWallet` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AccountWallet {
    readonly currency: 'CNY' | 'USD';
    readonly balance: string;
}
```

成员检索：`balance`、`currency`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## DeepSeekAccount 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `DeepSeekAccount`。`DeepSeekAccount` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare abstract class DeepSeekAccount extends Service {
    constructor(ctx: Context);
    abstract getState(): Promise<AccountView>;
    abstract getProfile(client: AccountClientMetadata): Promise<AccountDetails['profile'] | null>;
    abstract getBalance(client: AccountClientMetadata): Promise<AccountDetails['balance'] | null>;
    abstract getUnnotifiedBonuses(client: AccountClientMetadata): Promise<AccountBonusBatch | null>;
    abstract ackBonusNotified(accountId: AccountUserId, orderId: AccountBonusOrderId, client: AccountClientMetadata): Promise<boolean>;
    abstract startSignIn(client: AccountClientMetadata, callbackOrigin: string, loginSource: 'web' | 'desktop'): Promise<AccountView>;
    abstract cancelSignIn(id: SignInAttemptId): Promise<AccountView>;
    abstract signOut(client: AccountClientMetadata): Promise<AccountView>;
    abstract watch(signal: AbortSignal, includeIdentityChanges?: boolean): AsyncIterable<AccountView>;
    abstract resolveToken(url: string): Promise<string | undefined>;
    abstract rejectToken(token: string): Promise<void>;
    abstract getPlatformSession(): Promise<PlatformSession | null>;
    abstract getDeviceIdentity(): Promise<{
        deviceId?: string;
        userId?: AccountUserId;
        osVersion: string;
    }>;
}
```

成员检索：`ackBonusNotified`、`cancelSignIn`、`getBalance`、`getDeviceIdentity`、`getPlatformSession`、`getProfile`、`getState`、`getUnnotifiedBonuses`、`rejectToken`、`resolveToken`、`signOut`、`startSignIn`、`watch`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## PlatformSession 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `PlatformSession`。`PlatformSession` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface PlatformSession {
    readonly origin: string;
    readonly token: string;
    readonly userId: AccountUserId | null;
    readonly embeddedPageDist?: string;
    readonly requestHeaders?: Readonly<Record<string, string>>;
}
```

成员检索：`embeddedPageDist`、`origin`、`requestHeaders`、`token`、`userId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## SignInAttemptId 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `SignInAttemptId`。`SignInAttemptId` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SignInAttemptId = Branded<'SignInAttemptId'>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## SignInAttemptView 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `SignInAttemptView`。`SignInAttemptView` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SignInAttemptView {
    readonly id: SignInAttemptId;
    readonly phase: 'initializing' | 'waiting-browser' | 'exchanging' | 'committing' | 'succeeded' | 'cancelled' | 'expired' | 'failed';
    readonly authorizeUrl?: string;
    readonly expiresAt?: number;
    readonly errorCode?: SignInErrorCode;
}
```

成员检索：`authorizeUrl`、`errorCode`、`expiresAt`、`id`、`phase`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## SignInErrorCode 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `SignInErrorCode`。`SignInErrorCode` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SignInErrorCode = 'no-response' | 'network' | 'protocol' | 'expired' | 'storage';
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## desktopClientHeaders 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `desktopClientHeaders`。`desktopClientHeaders` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function desktopClientHeaders(platform: 'darwin' | 'win32' | null): Record<string, string>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## installAccountTaskCancellation 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `installAccountTaskCancellation`。`installAccountTaskCancellation` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function installAccountTaskCancellation(ctx: Context): void;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## isRunningAccountTask 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `isRunningAccountTask`。`isRunningAccountTask` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isRunningAccountTask(agent: Pick<Agent, 'status' | 'session'>): boolean;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## mergePlatformCookies 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `mergePlatformCookies`。`mergePlatformCookies` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function mergePlatformCookies(base: string, override: string): string;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## platformClientHeaders 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `platformClientHeaders`。`platformClientHeaders` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function platformClientHeaders(platform: 'darwin' | 'win32' | null, client: AccountClientMetadata): Record<string, string>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## platformWireLocale 契约

从 `@deepseek-ai/dsh-deepseek-account` 导入 `platformWireLocale`。`platformWireLocale` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function platformWireLocale(locale: string): 'zh_CN' | 'en_US';
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。
