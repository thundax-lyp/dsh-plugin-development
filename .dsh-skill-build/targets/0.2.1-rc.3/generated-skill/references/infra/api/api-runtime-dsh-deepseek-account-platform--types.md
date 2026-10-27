# @deepseek-ai/dsh-deepseek-account-platform./types：插件凭证、引用与交互授权

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件凭证、引用与交互授权任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-credentials.md)。

## AccountView 契约

完整公开声明：

```text
export interface AccountView {
    readonly status: 'signed-out' | 'credential-stored';
    readonly links: AccountLinks;
    readonly attempt: SignInAttemptView | null;
}
```


从 `@deepseek-ai/dsh-deepseek-account-platform/types` 导入 `AccountView`。`AccountView` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## SignInAttemptView 契约

完整公开声明：

```text
export interface SignInAttemptView {
    readonly id: SignInAttemptId;
    readonly phase: 'initializing' | 'waiting-browser' | 'exchanging' | 'committing' | 'succeeded' | 'cancelled' | 'expired' | 'failed';
    readonly authorizeUrl?: string;
    readonly expiresAt?: number;
    readonly errorCode?: SignInErrorCode;
}
```


从 `@deepseek-ai/dsh-deepseek-account-platform/types` 导入 `SignInAttemptView`。`SignInAttemptView` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。
