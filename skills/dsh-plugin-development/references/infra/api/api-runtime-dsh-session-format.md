# @deepseek-ai/dsh-session-format：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## SessionFormatArtifact 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatArtifact`。`SessionFormatArtifact` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatArtifact {
    readonly header: SessionFormatHeader;
    readonly inheritedEventCount: number;
    readonly events: readonly SessionFormatEvent[];
}
```

成员检索：`events`、`header`、`inheritedEventCount`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatArtifactDecoder 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatArtifactDecoder`。`SessionFormatArtifactDecoder` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatArtifactDecoder {
    readonly header: SessionFormatHeader;
    readonly headerInheritedEventCount?: number;
    decodeRow(rowValue: unknown, context: SessionFormatMigrationContext): void;
    finish(context: SessionFormatMigrationContext): number;
}
```

成员检索：`decodeRow`、`finish`、`header`、`headerInheritedEventCount`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatCatalog 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatCatalog`。`SessionFormatCatalog` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatCatalog {
    readonly currentVersion: number;
    readHeader(headerValue: unknown): SessionFormatHeaderReadResult;
    createRestore(headerValue: unknown, options: SessionFormatRestoreOptions): SessionFormatRestore;
    encodeCurrentHeader(header: SessionFormatHeader, inheritedEventCount: number): SessionFormatJsonObject;
    encodeCurrentEvent(event: SessionFormatEvent): SessionFormatJsonObject;
}
```

成员检索：`createRestore`、`currentVersion`、`encodeCurrentEvent`、`encodeCurrentHeader`、`readHeader`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatCatalogOptions 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatCatalogOptions`。`SessionFormatCatalogOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatCatalogOptions extends SessionFormatChainOptions {
    readonly codecs: readonly SessionFormatCodec[];
    readonly restoreCurrent: (artifact: SessionFormatArtifact) => SessionFormatArtifact;
    readonly currentEncoder: SessionFormatCurrentEncoder;
    readonly restoreTransformedCurrent: (artifact: SessionFormatArtifact) => SessionFormatArtifact;
}
```

成员检索：`codecs`、`currentEncoder`、`currentVersion`、`migrations`、`restoreCurrent`、`restoreCurrentHeader`、`restoreTransformedCurrent`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatChain 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatChain`。`SessionFormatChain` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatChain {
    readonly currentVersion: number;
    createStream(header: SessionFormatHeader, inheritedEventCount: number | undefined, context: SessionFormatMigrationContext): SessionFormatMigrationStream;
    migrateHeader(header: SessionFormatHeader): SessionFormatHeader;
}
```

成员检索：`createStream`、`currentVersion`、`migrateHeader`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatChainOptions 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatChainOptions`。`SessionFormatChainOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatChainOptions {
    readonly currentVersion: number;
    readonly migrations: readonly SessionFormatMigration[];
    readonly restoreCurrentHeader: (header: SessionFormatHeader) => SessionFormatHeader;
}
```

成员检索：`currentVersion`、`migrations`、`restoreCurrentHeader`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatCodec 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatCodec`。`SessionFormatCodec` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatCodec {
    readonly version: number;
    decodeHeader(value: unknown): SessionFormatHeader;
    createDecoder(headerValue: unknown, recovery: SessionFormatRecovery): SessionFormatArtifactDecoder;
}
```

成员检索：`createDecoder`、`decodeHeader`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatCurrentEncoder 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatCurrentEncoder`。`SessionFormatCurrentEncoder` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatCurrentEncoder {
    encodeHeader(header: SessionFormatHeader, inheritedEventCount: number): SessionFormatJsonObject;
    encodeEvent(event: SessionFormatEvent): SessionFormatJsonObject;
}
```

成员检索：`encodeEvent`、`encodeHeader`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatError 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatError`。`SessionFormatError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionFormatError extends Error {
    readonly name: string;
}
```

成员检索：`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatEvent 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatEvent`。`SessionFormatEvent` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatEvent extends SessionFormatJsonObject {
    readonly type: string;
    readonly seq: number;
    readonly time: number;
    readonly data: SessionFormatJsonValue;
}
```

成员检索：`data`、`seq`、`time`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatEventCollector 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatEventCollector`。`SessionFormatEventCollector` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionFormatEventCollector implements SessionFormatMigrationContext {
    readonly values: SessionFormatEvent[];
    emitEvent(event: SessionFormatEvent): void;
    emitRun(run: SessionFormatEventRun): void;
}
```

成员检索：`emitEvent`、`emitRun`、`values`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatEventRun 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatEventRun`。`SessionFormatEventRun` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatEventRun {
    readonly runType: string;
    readonly firstSeq: number;
    readonly eventCount: number;
    expand(): Iterable<SessionFormatEvent>;
}
```

成员检索：`eventCount`、`expand`、`firstSeq`、`runType`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatHeader 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatHeader`。`SessionFormatHeader` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatHeader extends SessionFormatJsonObject {
    readonly version: number;
    readonly id: string;
    readonly createdAt: number;
    readonly cwd?: string;
    readonly parentSession?: string;
    readonly isSeeded: boolean;
    readonly origin?: 'subagent';
    readonly delegationDepth: number;
    readonly agentPreset?: string;
}
```

成员检索：`agentPreset`、`createdAt`、`cwd`、`delegationDepth`、`id`、`isSeeded`、`origin`、`parentSession`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatHeaderReadResult 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatHeaderReadResult`。`SessionFormatHeaderReadResult` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionFormatHeaderReadResult = {
    readonly status: 'current' | 'migration-required';
    readonly storedVersion: number;
    readonly targetVersion: number;
    readonly header: SessionFormatHeader;
} | {
    readonly status: 'unsupported';
    readonly storedVersion: number;
    readonly targetVersion: number;
    readonly reason: string;
} | {
    readonly status: 'malformed';
    readonly storedVersion?: number;
    readonly targetVersion: number;
    readonly reason: string;
};
```

成员检索：`status`、`storedVersion`、`targetVersion`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatJsonObject 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatJsonObject`。`SessionFormatJsonObject` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatJsonObject {
    readonly [key: string]: SessionFormatJsonValue;
}
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatJsonPrimitive 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatJsonPrimitive`。`SessionFormatJsonPrimitive` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionFormatJsonPrimitive = null | boolean | number | string;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatJsonValue 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatJsonValue`。`SessionFormatJsonValue` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionFormatJsonValue = SessionFormatJsonPrimitive | readonly SessionFormatJsonValue[] | SessionFormatJsonObject;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatMigration 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatMigration`。`SessionFormatMigration` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatMigration {
    readonly name: string;
    readonly fromVersion: number;
    readonly toVersion: number;
    migrateHeader(header: SessionFormatHeader): SessionFormatHeader;
    createStage(input: SessionFormatMigrationStageInput): SessionFormatMigrationStage;
    validateTargetHeader(header: SessionFormatHeader): void;
}
```

成员检索：`createStage`、`fromVersion`、`migrateHeader`、`name`、`toVersion`、`validateTargetHeader`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatMigrationContext 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatMigrationContext`。`SessionFormatMigrationContext` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatMigrationContext {
    emitEvent(event: SessionFormatEvent): void;
    emitRun(run: SessionFormatEventRun): void;
}
```

成员检索：`emitEvent`、`emitRun`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatMigrationStage 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatMigrationStage`。`SessionFormatMigrationStage` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatMigrationStage {
    readonly headerInheritedEventCount?: number;
    transformEvent(event: SessionFormatEvent, context: SessionFormatMigrationContext): void;
    transformRun(run: SessionFormatEventRun, context: SessionFormatMigrationContext): void;
    finish(context: SessionFormatMigrationContext): number;
}
```

成员检索：`finish`、`headerInheritedEventCount`、`transformEvent`、`transformRun`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatMigrationStageInput 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatMigrationStageInput`。`SessionFormatMigrationStageInput` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatMigrationStageInput {
    readonly sourceHeader: SessionFormatHeader;
    readonly targetHeader: SessionFormatHeader;
    readonly sourceInheritedEventCount: number | undefined;
    readonly sourceKind: 'decoded' | 'transformed';
}
```

成员检索：`sourceHeader`、`sourceInheritedEventCount`、`sourceKind`、`targetHeader`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatMigrationStream 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatMigrationStream`。`SessionFormatMigrationStream` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatMigrationStream extends SessionFormatMigrationContext {
    readonly header: SessionFormatHeader;
    finish(): number;
}
```

成员检索：`emitEvent`、`emitRun`、`finish`、`header`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatRecovery 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatRecovery`。`SessionFormatRecovery` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionFormatRecovery = 'strict' | 'recoverable';
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatRestore 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatRestore`。`SessionFormatRestore` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatRestore {
    readonly header: SessionFormatHeader;
    decodeRow(rowValue: unknown): void;
    finish(): SessionFormatArtifact;
}
```

成员检索：`decodeRow`、`finish`、`header`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatRestoreOptions 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatRestoreOptions`。`SessionFormatRestoreOptions` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFormatRestoreOptions {
    readonly recovery: SessionFormatRecovery;
    readonly validation: 'transformed' | 'current';
}
```

成员检索：`recovery`、`validation`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionFormatUnsupportedMigrationError 契约

从 `@deepseek-ai/dsh-session-format` 导入 `SessionFormatUnsupportedMigrationError`。`SessionFormatUnsupportedMigrationError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionFormatUnsupportedMigrationError extends SessionFormatError {
    readonly name = "SessionFormatUnsupportedMigrationError";
}
```

成员检索：`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## createSessionFormatCatalog 契约

从 `@deepseek-ai/dsh-session-format` 导入 `createSessionFormatCatalog`。`createSessionFormatCatalog` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createSessionFormatCatalog(options: SessionFormatCatalogOptions): SessionFormatCatalog;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## createSessionFormatChain 契约

从 `@deepseek-ai/dsh-session-format` 导入 `createSessionFormatChain`。`createSessionFormatChain` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createSessionFormatChain(options: SessionFormatChainOptions): SessionFormatChain;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## defineSessionFormatMigration 契约

从 `@deepseek-ai/dsh-session-format` 导入 `defineSessionFormatMigration`。`defineSessionFormatMigration` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function defineSessionFormatMigration(migration: SessionFormatMigration): SessionFormatMigration;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## inspectSessionFormatVersion 契约

从 `@deepseek-ai/dsh-session-format` 导入 `inspectSessionFormatVersion`。`inspectSessionFormatVersion` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function inspectSessionFormatVersion(headerValue: unknown): number;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## isSessionFormatJsonObject 契约

从 `@deepseek-ai/dsh-session-format` 导入 `isSessionFormatJsonObject`。`isSessionFormatJsonObject` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isSessionFormatJsonObject(value: unknown): value is Record<string, unknown>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## parseSessionFormatLogFilename 契约

从 `@deepseek-ai/dsh-session-format` 导入 `parseSessionFormatLogFilename`。`parseSessionFormatLogFilename` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseSessionFormatLogFilename(filename: string): number | undefined;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## sessionFormatCount 契约

从 `@deepseek-ai/dsh-session-format` 导入 `sessionFormatCount`。`sessionFormatCount` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionFormatCount(value: unknown, label: string): number;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## sessionFormatLogFilename 契约

从 `@deepseek-ai/dsh-session-format` 导入 `sessionFormatLogFilename`。`sessionFormatLogFilename` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionFormatLogFilename(version: number): string;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## sessionFormatSafeInteger 契约

从 `@deepseek-ai/dsh-session-format` 导入 `sessionFormatSafeInteger`。`sessionFormatSafeInteger` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionFormatSafeInteger(value: unknown, label: string): number;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## sessionFormatVersion 契约

从 `@deepseek-ai/dsh-session-format` 导入 `sessionFormatVersion`。`sessionFormatVersion` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionFormatVersion(value: unknown, label?: string): number;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## snapshotSessionFormatHeader 契约

从 `@deepseek-ai/dsh-session-format` 导入 `snapshotSessionFormatHeader`。`snapshotSessionFormatHeader` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function snapshotSessionFormatHeader(header: SessionFormatHeader, label?: string): SessionFormatHeader;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## snapshotSessionFormatJson 契约

从 `@deepseek-ai/dsh-session-format` 导入 `snapshotSessionFormatJson`。`snapshotSessionFormatJson` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function snapshotSessionFormatJson(value: unknown, label?: string): SessionFormatJsonValue;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
