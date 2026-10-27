# @deepseek-ai/cordis-plugin-logger-console .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis-plugin-logger-console 选型与组合](api-core-cordis-plugin-logger-console-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ColorSupportLevel 公开契约

导入入口：`@deepseek-ai/cordis-plugin-logger-console`；公开符号：`ColorSupportLevel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ColorSupportLevel = 0 | 1 | 2 | 3;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## ConsoleExporter 公开契约

导入入口：`@deepseek-ai/cordis-plugin-logger-console`；公开符号：`ConsoleExporter`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare namespace ConsoleExporter {
    interface Config {
        colors?: false | ColorSupportLevel;
        maxLength?: number;
        levels?: Record<string, number>;
        showDiff?: boolean;
        showTime?: string;
        label?: LabelStyle;
    }
}

export declare class ConsoleExporter implements Exporter {
    ctx: Context;
    static readonly name = "logger-console";
    static readonly Config: z<ConsoleExporter.Config>;
    colors: false | ColorSupportLevel;
    maxLength?: number;
    levels?: Record<string, number>;
    showDiff: boolean;
    showTime: string;
    label?: LabelStyle;
    timestamp: number;
    formatters: Record<string, Formatter>;
    constructor(ctx: Context, config?: ConsoleExporter.Config);
    getDefaults(): {
        colors: false | ColorSupportLevel;
        showTime: string;
        showDiff: boolean;
    };
    export(message: Message): void;
    render(message: Message): string;
}
```

成员检索：`colors`、`ctx`、`export`、`formatters`、`getDefaults`、`label`、`levels`、`maxLength`、`render`、`showDiff`、`showTime`、`timestamp`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LabelStyle 公开契约

导入入口：`@deepseek-ai/cordis-plugin-logger-console`；公开符号：`LabelStyle`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface LabelStyle {
    width?: number;
    margin?: number;
    align?: 'left' | 'right';
}
```

成员检索：`align`、`margin`、`width`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
