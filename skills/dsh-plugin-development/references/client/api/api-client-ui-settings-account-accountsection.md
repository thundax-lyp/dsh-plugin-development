# ui-settings-account：accountsection 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-settings-account 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## AccountSectionInjected client

入口 `@deepseek-ai/dsh-client-ui-settings-account/client`，公开符号 `AccountSectionInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AccountSectionInjected {
    avatarFailed: (snapshot: AccountAvatarSnapshot) => void;
    subscribeSessionExpired?: (listener: () => void) => () => void;
    subscribeModelSignInRequired?: (listener: () => void) => () => void;
    openPlatformPage?: PlatformPages['open'];
    hooks: {
        account: HostObservable<AccountSnapshot>;
        theme: HostObservable<ThemeSnapshot>;
    };
    refreshAccount: () => Promise<void>;
    contactUs: () => void;
    showLogin: (visible: boolean) => void;
    setOnboarding: (active: boolean) => void;
    bonusNoticeShown: (orderId: BonusNotice['orderId']) => void;
    bonusNoticeDismissed: (orderId: BonusNotice['orderId']) => void;
    start: () => Promise<void>;
    cancel: (id: SignInAttemptId) => Promise<void>;
    hasRunningAccountTasks: () => Promise<boolean>;
    signOut: () => Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `avatarFailed` | `avatarFailed: (snapshot: AccountAvatarSnapshot) => void;` |
| `subscribeSessionExpired` | `subscribeSessionExpired?: (listener: () => void) => () => void;` |
| `subscribeModelSignInRequired` | `subscribeModelSignInRequired?: (listener: () => void) => () => void;` |
| `openPlatformPage` | `openPlatformPage?: PlatformPages['open'];` |
| `hooks` | `hooks: { account: HostObservable<AccountSnapshot>; theme: HostObservable<ThemeSnapshot>; };` |
| `refreshAccount` | `refreshAccount: () => Promise<void>;` |
| `contactUs` | `contactUs: () => void;` |
| `showLogin` | `showLogin: (visible: boolean) => void;` |
| `setOnboarding` | `setOnboarding: (active: boolean) => void;` |
| `bonusNoticeShown` | `bonusNoticeShown: (orderId: BonusNotice['orderId']) => void;` |
| `bonusNoticeDismissed` | `bonusNoticeDismissed: (orderId: BonusNotice['orderId']) => void;` |
| `start` | `start: () => Promise<void>;` |
| `cancel` | `cancel: (id: SignInAttemptId) => Promise<void>;` |
| `hasRunningAccountTasks` | `hasRunningAccountTasks: () => Promise<boolean>;` |
| `signOut` | `signOut: () => Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-account.md#接入-ui-settings-account) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface AccountSnapshot {

  notices?: readonly BonusNotice[]


  view: AccountView | undefined

  details: Partial<AccountDetails> | undefined

  avatar: AccountAvatarSnapshot | undefined

  failed: boolean

  loginVisible?: boolean

  loginFailed?: boolean

  onboarding?: boolean

  desktopOnboardingVisible?: boolean
}
```

## AccountSectionProps client

入口 `@deepseek-ai/dsh-client-ui-settings-account/client`，公开符号 `AccountSectionProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type AccountSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.account'> & InjectFace<AccountSectionInjected>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-account.md#接入-ui-settings-account) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface AccountSectionInjected {

  avatarFailed: (snapshot: AccountAvatarSnapshot) => void

  subscribeSessionExpired?: (listener: () => void) => () => void

  subscribeModelSignInRequired?: (listener: () => void) => () => void

  openPlatformPage?: PlatformPages['open']


  hooks: {
    account: HostObservable<AccountSnapshot>

    theme: HostObservable<ThemeSnapshot>
  }

  refreshAccount: () => Promise<void>

  contactUs: () => void

  showLogin: (visible: boolean) => void

  setOnboarding: (active: boolean) => void

  bonusNoticeShown: (orderId: BonusNotice['orderId']) => void

  bonusNoticeDismissed: (orderId: BonusNotice['orderId']) => void

  start: () => Promise<void>

  cancel: (id: SignInAttemptId) => Promise<void>

  hasRunningAccountTasks: () => Promise<boolean>

  signOut: () => Promise<void>
}

export interface AccountSnapshot {

  notices?: readonly BonusNotice[]


  view: AccountView | undefined

  details: Partial<AccountDetails> | undefined

  avatar: AccountAvatarSnapshot | undefined

  failed: boolean

  loginVisible?: boolean

  loginFailed?: boolean

  onboarding?: boolean

  desktopOnboardingVisible?: boolean
}
```

## AccountSnapshot client

入口 `@deepseek-ai/dsh-client-ui-settings-account/client`，公开符号 `AccountSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface AccountSnapshot {
    notices?: readonly BonusNotice[];
    view: AccountView | undefined;
    details: Partial<AccountDetails> | undefined;
    avatar: AccountAvatarSnapshot | undefined;
    failed: boolean;
    loginVisible?: boolean;
    loginFailed?: boolean;
    onboarding?: boolean;
    desktopOnboardingVisible?: boolean;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `notices` | `notices?: readonly BonusNotice[];` |
| `view` | `view: AccountView \| undefined;` |
| `details` | `details: Partial<AccountDetails> \| undefined;` |
| `avatar` | `avatar: AccountAvatarSnapshot \| undefined;` |
| `failed` | `failed: boolean;` |
| `loginVisible` | `loginVisible?: boolean;` |
| `loginFailed` | `loginFailed?: boolean;` |
| `onboarding` | `onboarding?: boolean;` |
| `desktopOnboardingVisible` | `desktopOnboardingVisible?: boolean;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-settings-account.md#接入-ui-settings-account) 在真实装载路径检验成功、失败与卸载。
