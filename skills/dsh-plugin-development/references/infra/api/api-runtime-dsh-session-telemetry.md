# @deepseek-ai/dsh-session-telemetry：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## SessionTelemetryBackend 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetryBackend`。`SessionTelemetryBackend` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare abstract class SessionTelemetryBackend extends Service implements SessionTelemetrySink {
    constructor(ctx: Context);
    abstract readonly sharing: SessionTelemetrySharingStatus;
    abstract emit(record: SessionTelemetryRecord): void;
    flush?(): void;
    abstract shutdown(): Promise<void>;
}
```

成员检索：`emit`、`flush`、`sharing`、`shutdown`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetryCapture 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetryCapture`。`SessionTelemetryCapture` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionTelemetryCapture = 'live' | 'on-demand';
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetryCaptureOptions 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetryCaptureOptions`。`SessionTelemetryCaptureOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTelemetryCaptureOptions {
    capture?: SessionTelemetryCapture;
    includeHistory?: boolean;
}
```

成员检索：`capture`、`includeHistory`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetryCoordinator 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetryCoordinator`。`SessionTelemetryCoordinator` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionTelemetryCoordinator {
    constructor(ctx: Context, backend: SessionTelemetrySink, options?: SessionTelemetryCaptureOptions);
    captureSession(session: Session, throughSeq?: SessionSeqType): void;
}
```

成员检索：`captureSession`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetryRecord 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetryRecord`。`SessionTelemetryRecord` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTelemetryRecord {
    sourceEvent?: {
        sessionId: SessionId;
        envelope: Omit<SessionEvent, 'data'>;
    };
    channel: 'ledger' | 'ops';
    time: number;
    severity: SessionTelemetrySeverity;
    attributes: Record<string, string | number>;
    body: unknown;
}
```

成员检索：`attributes`、`body`、`channel`、`severity`、`sourceEvent`、`time`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetrySeverity 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetrySeverity`。`SessionTelemetrySeverity` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionTelemetrySeverity = 'info' | 'warn' | 'error';
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetrySharingStatus 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetrySharingStatus`。`SessionTelemetrySharingStatus` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionTelemetrySharingStatus = 'full' | 'feedback-only' | 'disabled';
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTelemetrySink 契约

从 `@deepseek-ai/dsh-session-telemetry` 导入 `SessionTelemetrySink`。`SessionTelemetrySink` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTelemetrySink {
    emit(record: SessionTelemetryRecord): void;
    flush?(): void;
    shutdown(): Promise<void>;
}
```

成员检索：`emit`、`flush`、`shutdown`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
