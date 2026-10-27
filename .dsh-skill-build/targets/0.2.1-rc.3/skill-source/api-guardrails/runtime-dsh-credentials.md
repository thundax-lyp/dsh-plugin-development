# @deepseek-ai/dsh-credentials：插件凭证、引用与交互授权

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件凭证、引用与交互授权任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-credentials.md)。

## ApiKeyRecord 契约

从 `@deepseek-ai/dsh-credentials` 导入 `ApiKeyRecord`。`ApiKeyRecord` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ApiKeyRecord {
    readonly kind: 'api-key';
    readonly key?: string;
    readonly env?: Readonly<Record<string, string>>;
}
```

成员检索：`env`、`key`、`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialInfo 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialInfo`。`CredentialInfo` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CredentialInfo {
    configured: boolean;
    source?: string;
    writable: boolean;
}
```

成员检索：`configured`、`source`、`writable`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialKey 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialKey`。`CredentialKey` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type CredentialKey = Branded<'CredentialKey'>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialProvider 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialProvider`。`CredentialProvider` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare abstract class CredentialProvider extends Service {
    constructor(ctx: Context);
    abstract resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined>;
    abstract describe(ref: CredentialRef): Promise<CredentialInfo>;
    abstract set(ref: CredentialRef, value: string): Promise<void>;
    abstract unset(ref: CredentialRef): Promise<void>;
    abstract readRecord(key: CredentialKey): Promise<CredentialRecord | undefined>;
    abstract describeRecord(key: CredentialKey): Promise<CredentialRecordInfo>;
    abstract listRecords(): Promise<readonly CredentialRecordEntry[]>;
    abstract modifyRecord(key: CredentialKey, mutate: (current: CredentialRecord | undefined) => Promise<CredentialRecord | undefined>): Promise<CredentialRecord | undefined>;
    abstract deleteRecord(key: CredentialKey): Promise<void>;
}
```

成员检索：`deleteRecord`、`describe`、`describeRecord`、`listRecords`、`modifyRecord`、`readRecord`、`resolve`、`set`、`unset`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialRecord 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialRecord`。按 type 判别 api-key/grant，secret 只在服务内部及授权消费者使用；配置和 UI 使用引用或 info 投影，不能把 secret 写入模型日志。

```text
export type CredentialRecord = ApiKeyRecord | GrantRecord;
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialRecordEntry 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialRecordEntry`。`CredentialRecordEntry` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CredentialRecordEntry {
    key: CredentialKey;
    kind: CredentialRecord['kind'];
}
```

成员检索：`key`、`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialRecordInfo 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialRecordInfo`。`CredentialRecordInfo` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CredentialRecordInfo {
    configured: boolean;
    kind?: CredentialRecord['kind'];
    writable: boolean;
}
```

成员检索：`configured`、`kind`、`writable`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## CredentialRef 契约

从 `@deepseek-ai/dsh-credentials` 导入 `CredentialRef`。`CredentialRef` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type CredentialRef = Branded<'CredentialRef'>;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## GrantRecord 契约

从 `@deepseek-ai/dsh-credentials` 导入 `GrantRecord`。`GrantRecord` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GrantRecord {
    readonly kind: 'grant';
    readonly payload: unknown;
}
```

成员检索：`kind`、`payload`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## ResolvedCredential 契约

从 `@deepseek-ai/dsh-credentials` 导入 `ResolvedCredential`。`ResolvedCredential` 是插件凭证、引用与交互授权的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ResolvedCredential {
    value: string;
    source: string;
}
```

成员检索：`source`、`value`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## credentialKey 契约

从 `@deepseek-ai/dsh-credentials` 导入 `credentialKey`。`credentialKey` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function credentialKey(scope: string, id: string): CredentialKey;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## credentialKeyId 契约

从 `@deepseek-ai/dsh-credentials` 导入 `credentialKeyId`。`credentialKeyId` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function credentialKeyId(key: CredentialKey): string;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## credentialKeyScope 契约

从 `@deepseek-ai/dsh-credentials` 导入 `credentialKeyScope`。`credentialKeyScope` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function credentialKeyScope(key: CredentialKey): string;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## credentialRef 契约

从 `@deepseek-ai/dsh-credentials` 导入 `credentialRef`。`credentialRef` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function credentialRef(value: string): CredentialRef;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## isCredentialKeySegment 契约

从 `@deepseek-ai/dsh-credentials` 导入 `isCredentialKeySegment`。`isCredentialKeySegment` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isCredentialKeySegment(value: string): boolean;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## isCredentialRefName 契约

从 `@deepseek-ai/dsh-credentials` 导入 `isCredentialRefName`。`isCredentialRefName` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isCredentialRefName(value: string): boolean;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。

## parseCredentialKey 契约

从 `@deepseek-ai/dsh-credentials` 导入 `parseCredentialKey`。`parseCredentialKey` 是插件凭证、引用与交互授权的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseCredentialKey(value: string): CredentialKey;
```

本对象的注册/资源责任由[插件凭证、引用与交互授权](api-runtime-credentials-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-credentials.md)核对成功、拒绝与卸载结果。
