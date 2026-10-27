# @deepseek-ai/dsh-session-telemetry-otel：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## Config 契约

从 `@deepseek-ai/dsh-session-telemetry-otel` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    mode?: SessionTelemetryMode;
    exporter?: Omit<LogExporterOptions, 'url'> & {
        url?: string;
    };
    processor?: SessionLogProcessorOptions;
    shutdownTimeoutMillis?: number;
    maxRequestBytes?: number;
}

export declare const Config: z<Config>;
```

成员检索：`exporter`、`maxRequestBytes`、`mode`、`processor`、`shutdownTimeoutMillis`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## DEFAULT_SHUTDOWN_TIMEOUT_MILLIS 契约

从 `@deepseek-ai/dsh-session-telemetry-otel` 导入 `DEFAULT_SHUTDOWN_TIMEOUT_MILLIS`。`DEFAULT_SHUTDOWN_TIMEOUT_MILLIS` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_SHUTDOWN_TIMEOUT_MILLIS = 3000;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## DEFAULT_TELEMETRY_MODE 契约

从 `@deepseek-ai/dsh-session-telemetry-otel` 导入 `DEFAULT_TELEMETRY_MODE`。`DEFAULT_TELEMETRY_MODE` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_TELEMETRY_MODE = SessionTelemetryMode.FEEDBACK_ONLY;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## OpenTelemetrySessionBackend 契约

从 `@deepseek-ai/dsh-session-telemetry-otel` 导入 `OpenTelemetrySessionBackend`。`OpenTelemetrySessionBackend` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class OpenTelemetrySessionBackend extends SessionTelemetryBackend {
    static inject: string[];
    static Config: z<Config>;
    readonly sharing: SessionTelemetrySharingStatus;
    constructor(ctx: Context, config: Config);
    emit(_record: SessionTelemetryRecord): void;
    shutdown(): Promise<void>;
}
```

成员检索：`emit`、`sharing`、`shutdown`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetryMode 契约

从 `@deepseek-ai/dsh-session-telemetry-otel` 导入 `SessionTelemetryMode`。`SessionTelemetryMode` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare enum SessionTelemetryMode {
    FEEDBACK_ONLY = "FEEDBACK_ONLY",
    DISABLED = "DISABLED"
}
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
