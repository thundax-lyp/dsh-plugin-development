# @deepseek-ai/dsh-settings .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-settings 选型与组合](api-core-dsh-settings-root-overview.md)。

编辑插件通过 `.volatile()` 声明的字段，并查看其实际值。表单以 profile 条目 id 标识插件、保留秘密值，并拒绝过期写入。更改通过当前 profile 的 Cordis patch 持久化。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RedactedSecret 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`RedactedSecret`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RedactedSecret {
    path: string[];
    set: boolean;
}
```

成员检索：`path`、`set`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## RedactedValue 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`RedactedValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RedactedValue {
    value: unknown;
    secrets: RedactedSecret[];
}
```

成员检索：`secrets`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## SettingsConflictError 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`SettingsConflictError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SettingsConflictError extends Error {
    readonly code = "SETTINGS_CONFLICT";
    readonly expected: number;
    readonly actual: number;
    constructor(ns: SettingsNamespace, expected: number, actual: number);
}
```

成员检索：`actual`、`code`、`expected`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## SettingsDescribeOptions 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`SettingsDescribeOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SettingsDescribeOptions {
    redactSecrets?: boolean;
}
```

成员检索：`redactSecrets`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## SettingsDescriptor 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`SettingsDescriptor`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SettingsDescriptor {
    ns: SettingsNamespace;
    autoGenerate: boolean;
    schema: unknown;
    value: unknown;
    revision: number;
    base?: unknown;
    user?: unknown;
    applies: 'live';
    secrets?: RedactedSecret[];
}
```

成员检索：`applies`、`autoGenerate`、`base`、`ns`、`revision`、`schema`、`secrets`、`user`、`value`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## SettingsForms 公开契约

服务键 settings，依赖 configEditor、profileContext。describe 返回活动 Config volatile 字段的表单与 revision，远端必须 redactSecrets。update 合并普通对象，数组整体替换；replace 重置 live 字段后设置 section，不能使用脱敏文档重建完整 section。mutate 使用按序 set/unset 路径，不重述未读 secret；unset 数组索引删除元素，继承键 unset 恢复 base。expectedRevision 不符抛 SettingsConflictError，应重读后协调。configure 只设置所属实例的自动页 policy，同实例重复注册拒绝，调用方把返回 disposer 归入 effect。

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`SettingsForms`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class SettingsForms extends Service {
    static inject: string[];
    constructor(ownerContext: Context);
    configure(presentation: {
        auto?: boolean;
    }, owner?: Fiber): () => void;
    get writable(): boolean;
    get documentPath(): string;
    prepareDocument(): Promise<string>;
    describe(options?: SettingsDescribeOptions): SettingsDescriptor[];
    update(ns: string, patch: object, expectedRevision?: number): Promise<void>;
    replace(ns: string, section: object, expectedRevision?: number): Promise<void>;
    mutate(ns: string, ops: readonly SettingsPathOp[], expectedRevision?: number): Promise<void>;
}
```

成员检索：`configure`、`describe`、`documentPath`、`mutate`、`prepareDocument`、`replace`、`update`、`writable`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## SettingsNamespace 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`SettingsNamespace`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SettingsNamespace = Branded<'SettingsNamespace'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。

## SettingsPathOp 公开契约

导入入口：`@deepseek-ai/dsh-settings`；公开符号：`SettingsPathOp`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SettingsPathOp = {
    op: 'set';
    path: readonly string[];
    value: unknown;
} | {
    op: 'unset';
    path: readonly string[];
};
```

成员检索：`op`、`path`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段)。
