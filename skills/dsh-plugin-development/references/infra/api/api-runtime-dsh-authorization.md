# @deepseek-ai/dsh-authorization：插件凭证、引用与交互授权

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件凭证、引用与交互授权任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-credentials.md)。

## AuthorizationDeclinedError 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationDeclinedError`。`AuthorizationDeclinedError` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class AuthorizationDeclinedError extends AuthorizationError {
    constructor(message?: string);
}
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationEntry 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationEntry`。`AuthorizationEntry` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationEntry {
    key: CredentialKey;
    label: string;
    methods: readonly AuthorizationMethod[];
    inFlight: boolean;
}
```

成员检索：`inFlight`、`key`、`label`、`methods`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationError 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationError`。`AuthorizationError` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class AuthorizationError extends HarnessError {
    constructor(message: string, code: string, options?: ErrorOptions);
}
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationFlow 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationFlow`。以 CredentialKey 注册协议，methods 为非空 tuple；run 必须完成该 key 的实际写入，服务核对运行中曾提交且结束时仍存在才返回成功。

```text
export interface AuthorizationFlow {
    readonly key: CredentialKey;
    readonly label: string;
    readonly methods: readonly [
        AuthorizationMethod,
        ...AuthorizationMethod[]
    ];
    run(session: AuthorizationSession): Promise<void>;
}
```

成员检索：`key`、`label`、`methods`、`run`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationInteraction 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationInteraction`。`AuthorizationInteraction` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationInteraction {
    notify(notice: AuthorizationNotice): void;
    prompt(prompt: AuthorizationPrompt): Promise<string>;
}
```

成员检索：`notify`、`prompt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationMethod 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationMethod`。`AuthorizationMethod` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationMethod {
    id: string;
    label: string;
}
```

成员检索：`id`、`label`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationNotice 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationNotice`。`AuthorizationNotice` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationNotice {
    message: string;
    url?: string;
    code?: string;
}
```

成员检索：`code`、`message`、`url`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationOutcome 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationOutcome`。`AuthorizationOutcome` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationOutcome {
    status: AuthorizationStatus;
}
```

成员检索：`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationPrompt 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationPrompt`。`AuthorizationPrompt` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type AuthorizationPrompt = {
    signal?: AbortSignal;
} & ({
    kind: 'text';
    message: string;
    placeholder?: string;
} | {
    kind: 'secret';
    message: string;
    placeholder?: string;
} | {
    kind: 'select';
    message: string;
    options: readonly AuthorizationPromptOption[];
});
```

成员检索：`kind`、`message`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationPromptOption 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationPromptOption`。`AuthorizationPromptOption` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationPromptOption {
    id: string;
    label: string;
    description?: string;
}
```

成员检索：`description`、`id`、`label`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationRequest 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationRequest`。`AuthorizationRequest` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AuthorizationRequest {
    key: CredentialKey;
    method?: string;
    interaction: AuthorizationInteraction;
    signal?: AbortSignal;
}
```

成员检索：`interaction`、`key`、`method`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationService 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationService`。`AuthorizationService` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class AuthorizationService extends Service {
    static inject: string[];
    constructor(ctx: Context);
    registerFlow(flow: AuthorizationFlow): () => void;
    list(): readonly AuthorizationEntry[];
    describe(key: CredentialKey): AuthorizationEntry | undefined;
    cancel(key: CredentialKey): void;
    begin(request: AuthorizationRequest): Promise<AuthorizationOutcome>;
}
```

成员检索：`begin`、`cancel`、`describe`、`list`、`registerFlow`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationSession 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationSession`。单次 attempt 提供 method/signal/commit/notify/prompt。commit 驱动 credentials 持久写入并协调取消，notify 不阻塞流程；prompt 返回文本或 option id。

```text
export interface AuthorizationSession {
    readonly method: string;
    readonly signal: AbortSignal;
    commit(record: CredentialRecord): Promise<void>;
    notify(notice: AuthorizationNotice): void;
    prompt(prompt: AuthorizationPrompt): Promise<string>;
}
```

成员检索：`commit`、`method`、`notify`、`prompt`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationSettlement 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationSettlement`。`AuthorizationSettlement` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type AuthorizationSettlement = AuthorizationStatus | 'failed';
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## AuthorizationStatus 契约

从 `@deepseek-ai/dsh-authorization` 导入 `AuthorizationStatus`。`AuthorizationStatus` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type AuthorizationStatus = 'authorized' | 'cancelled';
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。
