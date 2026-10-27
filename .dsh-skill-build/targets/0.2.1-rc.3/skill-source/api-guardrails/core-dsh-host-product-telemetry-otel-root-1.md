# @deepseek-ai/dsh-host-product-telemetry-otel .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-product-telemetry-otel 选型与组合](api-core-dsh-host-product-telemetry-otel-root-overview.md)。

将选定的产品使用事件发送到 OTLP/HTTP 接收服务。事件包含名称、字符串摘要、发生时间，以及标量或单层对象属性。挂载插件不会自动采集信息；应用需要显式提交每个事件。发送采用尽力而为方式，不代表数据已入仓。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-host-product-telemetry-otel`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    endpoint: string;
    channel: string;
    serviceName: string;
    serviceVersion: string;
    compression?: 'none' | 'gzip';
    maxExportBatchSize: number;
    maxQueueSize: number;
    scheduledDelayMillis: number;
    timeoutMillis: number;
    exportTimeoutMillis: number;
    shutdownTimeoutMillis: number;
}

export declare const Config: z<Partial<Config>, Config>;
```

成员检索：`channel`、`compression`、`endpoint`、`exportTimeoutMillis`、`maxExportBatchSize`、`maxQueueSize`、`scheduledDelayMillis`、`serviceName`、`serviceVersion`、`shutdownTimeoutMillis`、`timeoutMillis`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## ProductTelemetryRecord 公开契约

要求event name、string body与Unix毫秒timestamp；attributes只允许scalar string/number/boolean和一层这类值对象。severity可选且默认INFO，observed time在本地入队赋值。由consumer显式选择字段，不能自动带Session文本或隐式标识。

导入入口：`@deepseek-ai/dsh-host-product-telemetry-otel`；公开符号：`ProductTelemetryRecord`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ProductTelemetryRecord = OTelEventRecord;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## ProductTelemetryScalar 公开契约

产品attribute的scalar词汇；不允许用任意JSON嵌套对象绕过字段选择。即使类型能容纳字符串，也不代表允许加入凭据或用户消息内容。

导入入口：`@deepseek-ai/dsh-host-product-telemetry-otel`；公开符号：`ProductTelemetryScalar`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ProductTelemetryScalar = OTelEventScalar;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## default 公开契约

导入入口：`@deepseek-ai/dsh-host-product-telemetry-otel`；公开符号：`default`。

目标版本编译声明（省略源码注释与实现体）：

```text
export default class ProductTelemetry extends Service {
    static inject: string[];
    static Config: z<Partial<Config>, Config>;
    constructor(ctx: Context, config: Config);
    emit(record: ProductTelemetryRecord): void;
}
```

成员检索：`emit`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
