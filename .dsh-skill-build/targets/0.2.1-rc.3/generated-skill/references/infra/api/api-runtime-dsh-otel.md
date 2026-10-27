# @deepseek-ai/dsh-otel：插件遥测通道与有界关闭

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在插件遥测通道与有界关闭任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-telemetry.md)。

## EventLogOptions 契约

从 `@deepseek-ai/dsh-otel` 导入 `EventLogOptions`。`EventLogOptions` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EventLogOptions {
    exporter: LogExporterOptions;
    resourceAttributes: Attributes;
    scope: {
        name: string;
        version?: string;
    };
    processor: Omit<BatchLogRecordProcessorOptions, 'exporter'>;
    onFailure: SessionLogOptions['onFailure'];
}
```

成员检索：`exporter`、`onFailure`、`processor`、`resourceAttributes`、`scope`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## EventLogReporter 契约

从 `@deepseek-ai/dsh-otel` 导入 `EventLogReporter`。`EventLogReporter` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class EventLogReporter {
    constructor(options: EventLogOptions);
    emit(record: OTelEventRecord): void;
    shutdown(signal?: AbortSignal): Promise<void>;
}
```

成员检索：`emit`、`shutdown`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## LogExporterOptions 契约

从 `@deepseek-ai/dsh-otel` 导入 `LogExporterOptions`。`LogExporterOptions` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type LogExporterOptions = Omit<OTLPExporterNodeConfigBase, 'selfObsMeterProvider'> & {
    url: string;
};
```

成员检索：`url`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## OTelEventRecord 契约

从 `@deepseek-ai/dsh-otel` 导入 `OTelEventRecord`。`OTelEventRecord` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface OTelEventRecord {
    eventName: string;
    body: string;
    timestamp: number;
    severityNumber?: SeverityNumber;
    attributes?: Record<string, OTelEventScalar | Record<string, OTelEventScalar>>;
}
```

成员检索：`attributes`、`body`、`eventName`、`severityNumber`、`timestamp`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## OTelEventScalar 契约

从 `@deepseek-ai/dsh-otel` 导入 `OTelEventScalar`。`OTelEventScalar` 是插件遥测通道与有界关闭的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type OTelEventScalar = string | number | boolean;
```

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## SessionLogOptions 契约

从 `@deepseek-ai/dsh-otel` 导入 `SessionLogOptions`。`SessionLogOptions` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogOptions {
    exporter: LogExporterOptions;
    processor?: SessionLogProcessorOptions;
    maxRequestBytes?: number;
    scope: {
        name: string;
        version?: string;
    };
    resourceAttributes: Attributes;
    onFailure: (message: string, error?: Error) => void;
}
```

成员检索：`exporter`、`maxRequestBytes`、`onFailure`、`processor`、`resourceAttributes`、`scope`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## SessionLogProcessorOptions 契约

从 `@deepseek-ai/dsh-otel` 导入 `SessionLogProcessorOptions`。`SessionLogProcessorOptions` 是插件遥测通道与有界关闭的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionLogProcessorOptions = Omit<BatchLogRecordProcessorOptions, 'exporter' | 'selfObsMeterProvider'>;
```

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## SessionLogRecord 契约

从 `@deepseek-ai/dsh-otel` 导入 `SessionLogRecord`。`SessionLogRecord` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionLogRecord {
    sessionId: SessionId;
    event: Omit<SessionEvent, 'data'> & {
        data: unknown;
    };
    attributes?: Attributes;
    severityNumber?: SeverityNumber;
}
```

成员检索：`attributes`、`event`、`sessionId`、`severityNumber`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## SessionLogReporter 契约

从 `@deepseek-ai/dsh-otel` 导入 `SessionLogReporter`。`SessionLogReporter` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionLogReporter {
    constructor(options: SessionLogOptions);
    reportSessionLog(record: SessionLogRecord): void;
    stopPending(): void;
    shutdown(): Promise<void>;
}
```

成员检索：`reportSessionLog`、`shutdown`、`stopPending`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。

## default 契约

从 `@deepseek-ai/dsh-otel` 导入 `default`。`default` 是插件遥测通道与有界关闭的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export default class OTel extends Service {
    constructor(ctx: Context);
    createEventReporter(options: EventLogOptions): EventLogReporter;
    createSessionLogReporter(options: SessionLogOptions): SessionLogReporter;
}
```

成员检索：`createEventReporter`、`createSessionLogReporter`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[插件遥测通道与有界关闭](api-runtime-telemetry-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-telemetry.md)核对成功、拒绝与卸载结果。
