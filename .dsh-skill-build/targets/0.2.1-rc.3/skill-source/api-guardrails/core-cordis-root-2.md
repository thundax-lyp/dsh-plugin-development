# @deepseek-ai/cordis .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis 选型与组合](api-core-cordis-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Events 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Events`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Events {
    'internal/plugin'(fiber: Fiber): void;
    'internal/status'(fiber: Fiber, oldValue: FiberState): void;
    'internal/config'(this: Fiber, config: any, next: () => any): any;
    'internal/service'(this: Context, name: string, value: any): void;
    'internal/update'(this: Fiber, config: any, noSave: boolean, next: () => void): void;
    'internal/get'(ctx: Context, name: string, error: Error, next: () => any): any;
    'internal/set'(ctx: Context, name: string, value: any, error: Error, next: () => boolean): boolean;
    'internal/listener'(this: Context, name: string, listener: any, prepend: boolean): void;
    'internal/dispatch'(mode: DispatchMode, name: string, args: any[], thisArg: any): void;
}
```

成员检索：`internal/config`、`internal/dispatch`、`internal/get`、`internal/listener`、`internal/plugin`、`internal/service`、`internal/set`、`internal/status`、`internal/update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## EventsService 公开契约

`on/once` 返回移除监听器的 disposer，监听器归当前 fiber 所有；once 在第一次调用后自行移除。emit 不等待 Promise，parallel 并行等待所有监听器，serial 按顺序等待直到 bail，bail 同步提前返回，waterfall 围绕最后的 next 延续。bail 值定义为除 null、false、undefined 外的任何值，因此 0 和空字符串也会停止。显式 thisArg 同时参与事件过滤，global 监听器会跳过过滤检查，不能随意用作跨 Agent 访问。

导入入口：`@deepseek-ai/cordis`；公开符号：`EventsService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class EventsService {
    _hooks: Record<keyof any, Hook[]>;
    constructor(ctx: Context);
    dispatch(type: string, args: any[]): ((...args: any[]) => any)[];
    parallel(...args: any[]): Promise<void>;
    emit(...args: any[]): void;
    serial(...args: any[]): Promise<any>;
    bail(...args: any[]): any;
    waterfall(...args: any[]): any;
    register(label: string, hooks: Hook[], callback: any, options: EventOptions): () => void;
    unregister(hooks: Hook[], callback: any): true | undefined;
    on(name: string | symbol, listener: (...args: any) => any, options?: boolean | EventOptions): any;
    once(name: string, listener: (...args: any) => any, options?: boolean | EventOptions): any;
}
```

成员检索：`_hooks`、`bail`、`dispatch`、`emit`、`on`、`once`、`parallel`、`register`、`serial`、`unregister`、`waterfall`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Exporter 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Exporter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Exporter {
    colors?: number | false;
    maxLength?: number;
    levels?: Record<string, number>;
    formatters?: Record<string, Formatter>;
    export(message: Message): void;
}
```

成员检索：`colors`、`export`、`formatters`、`levels`、`maxLength`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Fiber 公开契约

Fiber 是一个插件实例的生命周期句柄，不是插件模块。`ctx.plugin()` 返回它；函数、对象和类插件都有 fiber。PENDING 表示硬依赖缺失，LOADING 表示正在 apply，ACTIVE 表示完成，FAILED 表示 apply 或配置失败，UNLOADING/DISPOSED 表示清理进行或已结束。`dispose()` 等待本实例和子插件的异步清理，并且同一清理只执行一次。effect 内获取外部资源并返回 disposer；逆序启动 disposer 不等于异步清理严格串行，顺序要求写在一个 async disposer 中。

导入入口：`@deepseek-ai/cordis`；公开符号：`Fiber`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class Fiber {
    parent: Context;
    inject: Dict<any>;
    runtime: Plugin.Runtime | null;
    uid: number | null;
    readonly ctx: Context;
    config: any;
    _config: any;
    state: FiberState;
    readonly dispose: () => Promise<void>;
    store: Dict<Impl> | undefined;
    inertia: Promise<void> | undefined;
    readonly _hooks: Dict<DisposableList<Function>>;
    readonly _disposables: DisposableList<Disposable<any>>;
    constructor(parent: Context, config: any, inject: Dict<any>, runtime: Plugin.Runtime | null, getOuterStack: () => string[]);
    get name(): string;
    assertActive(): void;
    effect(execute: () => SyncEffect, label?: string): Disposable<Promise<void>>;
    effect(execute: () => Effect, label?: string): AsyncDisposable<Promise<void>>;
    getEffects(): EffectMeta[];
    _checkImpl(name: string): boolean | undefined;
    _refresh(): void;
    await(): Promise<this>;
    restart(): Promise<void>;
    update(config: any, noSave?: boolean): void;
}
```

成员检索：`_checkImpl`、`_config`、`_disposables`、`_hooks`、`_refresh`、`assertActive`、`await`、`config`、`ctx`、`dispose`、`effect`、`getEffects`、`inertia`、`inject`、`name`、`parent`、`restart`、`runtime`、`state`、`store`、`uid`、`update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## FiberState 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`FiberState`。

公开声明签名：

```text
export declare const enum FiberState {
    PENDING = 0,
    LOADING = 1,
    ACTIVE = 2,
    FAILED = 3,
    DISPOSED = 4,
    UNLOADING = 5
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Inject 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function Inject<K extends InjectKey>(name: K, config?: Context[K] extends {
    [symbols.config]: infer T;
} ? T : never): (value: any, decorator: ClassDecoratorContext<any> | ClassMethodDecoratorContext<any>) => void;

export type Inject<M = Dict> = (keyof M)[] | {
    [K in keyof M]?: M[K];
};

export declare namespace Inject {
    function resolve(inject: Inject | null | undefined, result?: Dict): Dict;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
