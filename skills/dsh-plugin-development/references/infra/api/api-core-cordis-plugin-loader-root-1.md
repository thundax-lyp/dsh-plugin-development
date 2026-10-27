# @deepseek-ai/cordis-plugin-loader .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis-plugin-loader 选型与组合](api-core-cordis-plugin-loader-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Entry 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`Entry`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/cordis-plugin-loader`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export declare class Entry {
    loader: Loader;
    static readonly key: unique symbol;
    ctx: Context;
    fiber?: Fiber;
    moduleNamespace: unknown;
    parent: EntryGroup;
    options: EntryOptions;
    subgroup?: EntryGroup;
    subtree?: EntryTree;
    _initTask?: Promise<void>;
    constructor(loader: Loader);
    get context(): Context;
    get id(): string;
    get disabled(): boolean;
    evaluate(expr: string): any;
    refresh(): Promise<void>;
    update(options: Partial<EntryOptions>, create?: boolean, force?: boolean): Promise<void>;
    getOuterStack: () => string[];
    init(): Promise<void>;
}
```

声明来源包 `@deepseek-ai/cordis-plugin-loader`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface Entry {
    realm: LocalRealm;
}
```

成员检索：`_initTask`、`context`、`ctx`、`disabled`、`evaluate`、`fiber`、`getOuterStack`、`id`、`init`、`loader`、`moduleNamespace`、`options`、`parent`、`realm`、`refresh`、`subgroup`、`subtree`、`update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## EntryGroup 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`EntryGroup`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class EntryGroup {
    ctx: Context;
    tree: EntryTree;
    static readonly key: unique symbol;
    data: EntryOptions[];
    constructor(ctx: Context, tree: EntryTree);
    get context(): Context;
    create(options: Omit<EntryOptions, 'id'>): Promise<string>;
    unlink(options: EntryOptions): void;
    remove(id: string, isDispose?: boolean): void;
    update(config: EntryOptions[]): Promise<void>;
    stop(): void;
}
```

成员检索：`context`、`create`、`ctx`、`data`、`remove`、`stop`、`tree`、`unlink`、`update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## EntryOptions 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`EntryOptions`。

目标版本编译声明（省略源码注释与实现体）：

声明来源包 `@deepseek-ai/cordis-plugin-loader`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface EntryOptions {
    id: string;
    name: string;
    config?: any;
    group?: boolean | null;
    disabled?: boolean | null;
    inject?: Inject | null;
}
```

声明来源包 `@deepseek-ai/cordis-plugin-loader`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface EntryOptions {
    intercept?: Dict | null;
    isolate?: Dict<true | string> | null;
}
```

成员检索：`config`、`disabled`、`group`、`id`、`inject`、`intercept`、`isolate`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## EntryTree 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`EntryTree`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare abstract class EntryTree {
    static readonly sep = ":";
    ctx: Context;
    enableLogs?: boolean;
    root: EntryGroup;
    store: Dict<Entry>;
    constructor(ctx: Context);
    get context(): Context;
    entries(): Generator<Entry, void, void>;
    getTasks(): Promise<void>[];
    await(): Promise<void>;
    ensureId(options: Partial<EntryOptions>): string;
    resolve(id: string): Entry;
    resolveGroup(id: string | null): EntryGroup;
    create(options: Omit<EntryOptions, 'id'>, parent?: string | null, position?: number): Promise<string>;
    remove(id: string): void;
    update(id: string, options: Omit<EntryOptions, 'id' | 'name'>, parent?: string | null, position?: number): Promise<void>;
    import(name: string, getOuterStack?: () => string[]): any;
    abstract write(): void;
}
```

成员检索：`await`、`context`、`create`、`ctx`、`enableLogs`、`ensureId`、`entries`、`getTasks`、`import`、`remove`、`resolve`、`resolveGroup`、`root`、`store`、`update`、`write`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Group 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`Group`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class Group extends EntryGroup {
    ctx: Context;
    config: EntryOptions[];
    static initial: Omit<EntryOptions, 'id'>[];
    static readonly [EntryGroup.key] = true;
    constructor(ctx: Context, config: EntryOptions[]);
    [Service.init](): AsyncGenerator<() => void, void, unknown>;
}
```

成员检索：`config`、`context`、`create`、`ctx`、`data`、`remove`、`stop`、`tree`、`unlink`、`update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## JsExpr 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`JsExpr`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface JsExpr {
    __jsExpr: string;
}
```

成员检索：`__jsExpr`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
