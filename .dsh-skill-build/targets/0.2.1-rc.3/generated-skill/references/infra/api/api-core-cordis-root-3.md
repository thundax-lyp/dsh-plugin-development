# @deepseek-ai/cordis .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis 选型与组合](api-core-cordis-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## InjectKey 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`InjectKey`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type InjectKey = keyof {
    [K in keyof Context & string as Context[K] extends {
        [symbols.config]: any;
    } ? K : never]: any;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Logger 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Logger`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Logger extends LoggerOptions {
}

export interface Logger extends Record<LoggerType, LoggerMethod> {
}

export declare class Logger {
    static color(exporter: Exporter, code: number, value: any, decoration?: string): string;
    static code(name: string, level?: false | number): number;
    static format(exporter: Exporter, message: Message): string;
    constructor(options: LoggerOptions, service: LoggerService);
}
```

成员检索：`level`、`meta`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LoggerLevel 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`LoggerLevel`。

公开声明签名：

```text
export declare const enum LoggerLevel {
    ERROR = 0,
    INFO = 1,
    WARN = 2,
    DEBUG = 3
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LoggerMethod 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`LoggerMethod`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type LoggerMethod = (format: any, ...param: any[]) => void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LoggerOptions 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`LoggerOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface LoggerOptions {
    name: string;
    meta?: Partial<Message>;
    level?: number;
}
```

成员检索：`level`、`meta`、`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LoggerService 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`LoggerService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare namespace LoggerService {
    interface Intercept {
        name?: string;
        level?: number;
    }
}

export interface LoggerService extends Record<LoggerType, LoggerMethod> {
    (name?: string): Logger;
}

export declare class LoggerService {
    bufferSize: number;
    buffer: Message[];
    ctx: Context;
    _snMessage: number;
    _snExporter: number;
    exporters: Map<number, Exporter>;
    constructor(ctx: Context);
    exporter(exporter: Exporter): import("./fiber.ts").Disposable<Promise<void>>;
    [symbols.invoke](name?: string): Logger;
}
```

成员检索：`_snExporter`、`_snMessage`、`buffer`、`bufferSize`、`ctx`、`exporter`、`exporters`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LoggerType 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`LoggerType`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type LoggerType = 'error' | 'info' | 'warn' | 'debug';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
