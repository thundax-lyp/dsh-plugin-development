# @deepseek-ai/dsh-storage-domain：非 Session 状态的持久化

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在非 Session 状态的持久化任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[非 Session 状态的持久化](api-runtime-storage-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-storage.md)。

## Config 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    backend: string;
    routes?: Record<string, string>;
}

export declare const Config: z<Config>;
```

成员检索：`backend`、`routes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## Domain 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `Domain`。open 返回的 typed handle。调用者拥有 close；close 排空写队列后关闭 unit，完成后才释放 domain 名称。关闭后的读写报 closed。

```text
export interface Domain<S extends DomainSpec> {
    readonly name: string;
    readonly global: DomainGlobalHandleOf<S>;
    table<N extends keyof S['tables'] & string>(name: N): KvTable<TableKeyOf<S, N>, TableValueOf<S, N>>;
    close(): Promise<void>;
}
```

成员检索：`close`、`global`、`name`、`table`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainChanged 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainChanged`。只在本进程持久提交后发通知；它不是跨实例 CDC、事务回滚点或权限证明。

```text
export type DomainChanged = DomainChangedPut | DomainChangedDeleted;
```

成员检索：`domain`、`key`、`operation`、`table`、`value`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainError 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainError`。`DomainError` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class DomainError extends Error {
    readonly code: DomainErrorCode;
    readonly name = "DomainError";
    readonly detail?: InvalidRecordDetail;
    constructor(code: DomainErrorCode, message: string, options?: DomainErrorOptions);
}
```

成员检索：`code`、`detail`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainErrorCode 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainErrorCode`。`DomainErrorCode` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type DomainErrorCode = 'already-open' | 'facet-unsupported' | 'invalid-record' | 'missing-key' | 'closed';
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainErrorOptions 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainErrorOptions`。`DomainErrorOptions` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DomainErrorOptions extends ErrorOptions {
    readonly detail?: InvalidRecordDetail;
}
```

成员检索：`detail`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainFacility 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainFacility`。ctx.storageDomain.open 逐步预留名称、选择 route/backend、检查 kv、打开 unit、读取并校验全部数据；任一步失败关闭已打开 unit 并释放名称。get 用于诊断，typed consumer 保留 open 返回 handle。

```text
export declare class DomainFacility {
    constructor(ctx: Context, config: Config);
    open<S extends DomainSpec>(spec: S): Promise<Domain<S>>;
    get(name: string): DomainImpl | undefined;
    closeAll(): Promise<void>;
}
```

成员检索：`closeAll`、`get`、`open`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainGlobal 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainGlobal`。get 读取内存 singleton，set 等耐久写入完成才发布内存变化；initial 在尚无持久值时使用但不会自动写入。

```text
export interface DomainGlobal<G> {
    get(): G;
    set(value: G): Promise<void>;
}
```

成员检索：`get`、`set`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainGlobalHandleOf 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainGlobalHandleOf`。`DomainGlobalHandleOf` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type DomainGlobalHandleOf<S extends DomainSpec> = S extends {
    readonly global: DomainGlobalSpec<infer G>;
} ? DomainGlobal<G> : never;
```

成员检索：`get`、`set`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainGlobalSpec 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainGlobalSpec`。`DomainGlobalSpec` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DomainGlobalSpec<G> {
    readonly schema: ZodType<G>;
    readonly initial: G;
}
```

成员检索：`initial`、`schema`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainSpec 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainSpec`。name/table 名称匹配 UNIT_NAME_RE；version 是非负整数。global schema 不可接受 null。layout 默认 single；per-record 可声明更旧 compatibleVersions；backup-and-skip 仅当 backend 有 backupRecord 时将坏表记录备份并略过，global 校验失败仍拒绝。

```text
export interface DomainSpec {
    readonly name: string;
    readonly version: number;
    readonly layout?: 'single' | 'per-record';
    readonly compatibleVersions?: readonly number[];
    readonly invalidRecords?: 'backup-and-skip';
    readonly global?: DomainGlobalSpec<unknown>;
    readonly tables: Record<string, DomainTableSpec>;
}
```

成员检索：`compatibleVersions`、`global`、`invalidRecords`、`layout`、`name`、`tables`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## DomainTableSpec 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `DomainTableSpec`。`DomainTableSpec` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DomainTableSpec<K extends string = string, V = unknown> {
    readonly valueSchema: ZodType<V>;
    readonly __key?: K;
}
```

成员检索：`__key`、`valueSchema`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## GlobalValueOf 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `GlobalValueOf`。`GlobalValueOf` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type GlobalValueOf<S extends DomainSpec> = S['global'] extends DomainGlobalSpec<infer G> ? G : never;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## InvalidRecordDetail 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `InvalidRecordDetail`。`InvalidRecordDetail` 是非 Session 状态的持久化的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface InvalidRecordDetail {
    readonly table: string;
    readonly key: string;
}
```

成员检索：`key`、`table`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## KvTable 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `KvTable`。get/entries 等同步读取校验过的内存值，put/delete/update 走同一 domain 写队列。update 在队列槽内执行 transform，缺失 key 报 missing-key；不得原地修改返回记录。

```text
export interface KvTable<K extends string, V> {
    get(key: K): V | undefined;
    entries(): IterableIterator<[
        K,
        V
    ]>;
    keys(): IterableIterator<K>;
    readonly size: number;
    put(key: K, value: V): Promise<void>;
    delete(key: K): Promise<boolean>;
    update(key: K, fn: (current: V) => V): Promise<V>;
}
```

成员检索：`delete`、`entries`、`get`、`keys`、`put`、`size`、`update`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## TableKeyOf 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `TableKeyOf`。`TableKeyOf` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type TableKeyOf<S extends DomainSpec, N extends keyof S['tables']> = S['tables'][N] extends DomainTableSpec<infer K> ? K : never;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## TableValueOf 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `TableValueOf`。`TableValueOf` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type TableValueOf<S extends DomainSpec, N extends keyof S['tables']> = S['tables'][N] extends DomainTableSpec<string, infer V> ? V : never;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## defineDomain 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `defineDomain`。`defineDomain` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function defineDomain<S extends DomainSpec>(spec: S): S;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## descriptorOf 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `descriptorOf`。`descriptorOf` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function descriptorOf(spec: DomainSpec): KvUnitDescriptor;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## domainTable 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `domainTable`。`domainTable` 是非 Session 状态的持久化的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function domainTable<K extends string, V>(schema: ZodType<V>): DomainTableSpec<K, V>;
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-storage-domain` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "storage-domain";
```

本对象的注册/资源责任由[非 Session 状态的持久化](api-runtime-storage-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-storage.md)核对成功、拒绝与卸载结果。
