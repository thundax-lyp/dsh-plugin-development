# @deepseek-ai/cordis .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis 选型与组合](api-core-cordis-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Message 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Message`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Message {
    sn: number;
    ts: number;
    name: string;
    type: LoggerType;
    level: number;
    args: any[];
    fiber?: WeakRef<Fiber>;
}
```

成员检索：`args`、`fiber`、`level`、`name`、`sn`、`ts`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Plugin 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Plugin`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type Plugin<T = any> = Plugin.Function<T> | Plugin.Constructor<T> | Plugin.Object<T>;

export declare namespace Plugin {
    interface Base<T = any> {
        name?: string;
        Config?: StandardSchemaV1<any, T>;
        inject?: Inject;
        provide?: string | string[];
        intercept?: Dict<boolean>;
    }
    interface Transform<S, T> {
        schema?: true;
        Config: (config: S) => T;
    }
    interface Function<T = any> extends Base<T> {
        (ctx: Context, config: T): any;
    }
    interface Constructor<T = any> extends Base<T> {
        new (ctx: Context, config: T): any;
    }
    interface Object<T = any> extends Base<T> {
        apply(ctx: Context, config: T): any;
    }
    interface Runtime {
        name?: string;
        fibers: DisposableList<Fiber>;
        callback: globalThis.Function;
        Config?: StandardSchemaV1;
    }
}
```

成员检索：`Config`、`inject`、`intercept`、`name`、`provide`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## RegistryService 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`RegistryService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RegistryService {
    ctx: Context;
    constructor(ctx: Context);
    get counter(): number;
    get size(): number;
    resolve(plugin: Plugin): Function | undefined;
    get(plugin: Plugin): Plugin.Runtime | undefined;
    has(plugin: Plugin): boolean;
    delete(plugin: Plugin): Plugin.Runtime | undefined;
    keys(): MapIterator<Function>;
    values(): MapIterator<Plugin.Runtime>;
    entries(): MapIterator<[
        Function,
        Plugin.Runtime
    ]>;
    forEach(callback: (value: Plugin.Runtime, key: Function) => void): void;
    inject(inject: Inject, callback: Plugin.Function<void>): Fiber & PromiseLike<Fiber>;
    plugin(plugin: Plugin, config?: any, getOuterStack?: () => string[]): Fiber & PromiseLike<Fiber>;
}
```

成员检索：`counter`、`ctx`、`delete`、`entries`、`forEach`、`get`、`has`、`inject`、`keys`、`plugin`、`resolve`、`size`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Service 公开契约

构造函数 `super(ctx, name)` 立即以 service key 提供实例，注册跟随 owner fiber 自动撤销；编译期另在 `@deepseek-ai/cordis` 合并 Context 字段。`name` 是实例服务名，不是 npm 名或 Loader entry id。Service.init 是 class 插件构造后初始化入口的 symbol；Service.invoke 使实例可调用。Service.check 是可用性谓词，Service.config 表达 intercept 配置的幻影类型。Service.resolveConfig 将 base、从根向下的 intercept、head 顺序合并，优先调用声明的 Config.merge，否则浅 Object.assign。消费方 inject service key，不能持有卸载后失效的实例继续使用。

导入入口：`@deepseek-ai/cordis`；公开符号：`Service`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare abstract class Service<out T = never> {
    static readonly init: unique symbol;
    static readonly check: unique symbol;
    static readonly config: unique symbol;
    static readonly invoke: unique symbol;
    static readonly extend: unique symbol;
    static readonly tracker: unique symbol;
    static readonly resolveConfig: unique symbol;
    [symbols.config]: T;
    name: string;
    constructor(ctx: Context, name: string);
    [symbols.resolveConfig](base?: T, head?: T): T;
    static [Symbol.hasInstance](instance: any): boolean;
}
```

成员检索：`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
