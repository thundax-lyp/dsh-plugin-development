# @deepseek-ai/dsh-storage：非 Session 状态的持久化

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在非 Session 状态的持久化任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[非 Session 状态的持久化](api-runtime-storage-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-storage.md)。

## BackendRegistry 契约

从 `@deepseek-ai/dsh-storage` 导入 `BackendRegistry`。`BackendRegistry` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class BackendRegistry {
    register(name: string, backend: StorageBackend): () => void;
    get(name: string): StorageBackend;
    names(): string[];
}
```

成员检索：`get`、`names`、`register`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## KvFacet 契约

从 `@deepseek-ai/dsh-storage` 导入 `KvFacet`。`KvFacet` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface KvFacet {
    open(descriptor: KvUnitDescriptor): Promise<KvUnit>;
}
```

成员检索：`open`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## KvUnit 契约

从 `@deepseek-ai/dsh-storage` 导入 `KvUnit`。`KvUnit` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface KvUnit {
    loadAll(): Promise<{
        tables: Record<string, Record<string, unknown>>;
        global: unknown;
    }>;
    putRecord(table: string, key: string, value: unknown): Promise<void>;
    deleteRecord(table: string, key: string): Promise<void>;
    backupRecord?(table: string, key: string): Promise<string>;
    setGlobal(value: unknown): Promise<void>;
    close(): Promise<void>;
}
```

成员检索：`backupRecord`、`close`、`deleteRecord`、`loadAll`、`putRecord`、`setGlobal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## KvUnitDescriptor 契约

从 `@deepseek-ai/dsh-storage` 导入 `KvUnitDescriptor`。`KvUnitDescriptor` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface KvUnitDescriptor {
    readonly name: string;
    readonly version: number;
    readonly tables: readonly string[];
    readonly hasGlobal: boolean;
    readonly layout?: 'single' | 'per-record';
    readonly compatibleVersions?: readonly number[];
}
```

成员检索：`compatibleVersions`、`hasGlobal`、`layout`、`name`、`tables`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## Storage 契约

从 `@deepseek-ai/dsh-storage` 导入 `Storage`。ctx.storage 是注册中心；form/mount 不执行记录写入。backend.register 与 mount 的 disposer 只移除注册，backend owner 负责 close。storage.domain 由 storage-domain 的声明合并提供。

```text
export declare class Storage extends Service {
    readonly backend: BackendRegistry;
    constructor(ctx: Context);
    mount<K extends keyof StorageForms>(form: K, facility: StorageForms[K]): () => void;
    form<K extends keyof StorageForms>(form: K): StorageForms[K];
    get domain(): StorageForms extends {
        domain: infer D;
    } ? D : never;
}
```

成员检索：`backend`、`domain`、`form`、`mount`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## StorageBackend 契约

从 `@deepseek-ai/dsh-storage` 导入 `StorageBackend`。`StorageBackend` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface StorageBackend {
    readonly kv?: KvFacet;
    close(): Promise<void>;
}
```

成员检索：`close`、`kv`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## StorageError 契约

从 `@deepseek-ai/dsh-storage` 导入 `StorageError`。`StorageError` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class StorageError extends Error {
    readonly code: StorageErrorCode;
    readonly name = "StorageError";
    constructor(code: StorageErrorCode, message: string, options?: ErrorOptions);
}
```

成员检索：`code`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## StorageErrorCode 契约

从 `@deepseek-ai/dsh-storage` 导入 `StorageErrorCode`。`StorageErrorCode` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type StorageErrorCode = 'backend-not-found' | 'form-not-mounted' | 'duplicate-backend' | 'duplicate-mount' | 'version-mismatch' | 'malformed-medium' | 'closed';
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## StorageForms 契约

从 `@deepseek-ai/dsh-storage` 导入 `StorageForms`。`StorageForms` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

声明来源包 `@deepseek-ai/dsh-storage`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface StorageForms {
}
```

声明来源包 `@deepseek-ai/dsh-storage-domain`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface StorageForms {
    domain: DomainFacility;
}
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## UNIT_NAME_RE 契约

从 `@deepseek-ai/dsh-storage` 导入 `UNIT_NAME_RE`。`UNIT_NAME_RE` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const UNIT_NAME_RE: RegExp;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## storageBackendServiceKey 契约

从 `@deepseek-ai/dsh-storage` 导入 `storageBackendServiceKey`。`storageBackendServiceKey` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function storageBackendServiceKey(name: string): string;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。
