# @deepseek-ai/dsh-credentials-local：插件凭证、引用与交互授权

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件凭证、引用与交互授权任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-credentials.md)。

## CREDENTIALS_FILENAME 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `CREDENTIALS_FILENAME`。`CREDENTIALS_FILENAME` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const CREDENTIALS_FILENAME = ".credentials.yaml";
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## Config 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    path?: string;
    dshHome?: string;
    watch?: boolean;
    debounceMs?: number;
}
```

成员检索：`debounceMs`、`dshHome`、`path`、`watch`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialsDocument 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `CredentialsDocument`。`CredentialsDocument` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CredentialsDocument {
    refs: Map<string, string>;
    records: Map<string, CredentialRecord>;
    ignoredKeys: string[];
}
```

成员检索：`ignoredKeys`、`records`、`refs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## DOCUMENT_VERSION 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `DOCUMENT_VERSION`。`DOCUMENT_VERSION` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DOCUMENT_VERSION = 1;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## LocalCredentialProvider 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `LocalCredentialProvider`。`LocalCredentialProvider` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalCredentialProvider extends CredentialProvider {
    config: Config;
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    [Service.init](): AsyncGenerator<() => Promise<void> | void, void, void>;
    resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined>;
    describe(ref: CredentialRef): Promise<CredentialInfo>;
    set(ref: CredentialRef, value: string): Promise<void>;
    unset(ref: CredentialRef): Promise<void>;
    readRecord(key: CredentialKey): Promise<CredentialRecord | undefined>;
    describeRecord(key: CredentialKey): Promise<CredentialRecordInfo>;
    listRecords(): Promise<readonly CredentialRecordEntry[]>;
    modifyRecord(key: CredentialKey, mutate: (current: CredentialRecord | undefined) => Promise<CredentialRecord | undefined>): Promise<CredentialRecord | undefined>;
    deleteRecord(key: CredentialKey): Promise<void>;
}
```

成员检索：`config`、`deleteRecord`、`describe`、`describeRecord`、`listRecords`、`modifyRecord`、`readRecord`、`resolve`、`set`、`unset`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## parseCredentialsDocument 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `parseCredentialsDocument`。`parseCredentialsDocument` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseCredentialsDocument(text: string, filename: string): CredentialsDocument;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## renderFlatLayoutMigration 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `renderFlatLayoutMigration`。`renderFlatLayoutMigration` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function renderFlatLayoutMigration(text: string): string | undefined;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## resolveSpec 契约

从 `@deepseek-ai/dsh-credentials-local` 导入 `resolveSpec`。`resolveSpec` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveSpec(config: Config): ResolvedSpec;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。
