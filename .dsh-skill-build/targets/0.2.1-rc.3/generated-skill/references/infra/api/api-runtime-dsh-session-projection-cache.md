# @deepseek-ai/dsh-session-projection-cache：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## CheckpointIdentity 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `CheckpointIdentity`。`CheckpointIdentity` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type CheckpointIdentity = z.infer<typeof checkpointIdentity>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `createdAt` | `createdAt: z.ZodNumber;` | 来自上述类型组合的公开分支 |
| `cwd` | `cwd: z.ZodOptional<z.ZodString>;` | 来自上述类型组合的公开分支 |
| `formatVersion` | `formatVersion: z.ZodOptional<z.ZodNumber>;` | 来自上述类型组合的公开分支 |
| `inheritedEventCount` | `inheritedEventCount: z.ZodOptional<z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionLogOffset, number>>>;` | 来自上述类型组合的公开分支 |
| `isSeeded` | `isSeeded: z.ZodOptional<z.ZodBoolean>;` | 来自上述类型组合的公开分支 |

## CheckpointRecord 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `CheckpointRecord`。`CheckpointRecord` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type CheckpointRecord = z.infer<typeof checkpointRecord>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `identity` | `identity: z.ZodObject<{ formatVersion: z.ZodOptional<z.ZodNumber>; createdAt: z.ZodNumber; cwd: z.ZodOptional<z.ZodString>; isSeeded: z.ZodOptional<z.ZodBoolean>; inheritedEventCount: z.ZodOptional<z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionLogOffset, number>>>; }, z.core.$strip>;` | 来自上述类型组合的公开分支 |
| `rows` | `rows: z.ZodRecord<z.ZodString, z.ZodObject<{ ver: z.ZodNumber; seq: z.ZodPipe<z.ZodNumber, z.ZodTransform<-1 \| SessionSeq, number>>; val: z.ZodCustom<JsonValue, JsonValue>; }, z.core.$strip>>;` | 来自上述类型组合的公开分支 |

## Config 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    writeEveryEvents: number;
    writeIntervalMs: number;
}

export declare const Config: z<Config>;
```

成员检索：`writeEveryEvents`、`writeIntervalMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionProjectionCache 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `SessionProjectionCache`。`SessionProjectionCache` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionProjectionCache extends Service {
    config: Config;
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    cachedSnapshot(meta: SessionHeader, keys?: readonly Extract<keyof SessionProjectionMap, string>[]): ProjectionSnapshot | undefined;
    cachedPredecessorTitle(meta: SessionHeader): ProjectionSnapshot | undefined;
    hydratePrepared(session: Session, events: readonly SessionEvent[]): ProjectionSnapshot;
    write(session: Session): Promise<void>;
    coldSnapshot(meta: SessionHeader, inheritedEventCount: SessionLogOffset, events: readonly SessionEvent[]): ProjectionSnapshot;
}
```

成员检索：`cachedPredecessorTitle`、`cachedSnapshot`、`coldSnapshot`、`config`、`hydratePrepared`、`write`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## checkpointIdentity 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `checkpointIdentity`。`checkpointIdentity` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const checkpointIdentity: z.ZodObject<{
    formatVersion: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodNumber;
    cwd: z.ZodOptional<z.ZodString>;
    isSeeded: z.ZodOptional<z.ZodBoolean>;
    inheritedEventCount: z.ZodOptional<z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionLogOffset, number>>>;
}, z.core.$strip>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## checkpointRecord 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `checkpointRecord`。`checkpointRecord` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const checkpointRecord: z.ZodObject<{
    identity: z.ZodObject<{
        formatVersion: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodNumber;
        cwd: z.ZodOptional<z.ZodString>;
        isSeeded: z.ZodOptional<z.ZodBoolean>;
        inheritedEventCount: z.ZodOptional<z.ZodPipe<z.ZodNumber, z.ZodTransform<SessionLogOffset, number>>>;
    }, z.core.$strip>;
    rows: z.ZodRecord<z.ZodString, z.ZodObject<{
        ver: z.ZodNumber;
        seq: z.ZodPipe<z.ZodNumber, z.ZodTransform<-1 | SessionSeq, number>>;
        val: z.ZodCustom<JsonValue, JsonValue>;
    }, z.core.$strip>>;
}, z.core.$strip>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## checkpointRow 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `checkpointRow`。`checkpointRow` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const checkpointRow: z.ZodObject<{
    ver: z.ZodNumber;
    seq: z.ZodPipe<z.ZodNumber, z.ZodTransform<-1 | SessionSeq, number>>;
    val: z.ZodCustom<JsonValue, JsonValue>;
}, z.core.$strip>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## projectionCacheDomainSpec 契约

从 `@deepseek-ai/dsh-session-projection-cache` 导入 `projectionCacheDomainSpec`。`projectionCacheDomainSpec` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const projectionCacheDomainSpec: {
    name: string;
    version: number;
    compatibleVersions: number[];
    invalidRecords: "backup-and-skip";
    layout: "per-record";
    tables: {
        sessions: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<SessionId, {
            identity: {
                createdAt: number;
                formatVersion?: number | undefined;
                cwd?: string | undefined;
                isSeeded?: boolean | undefined;
                inheritedEventCount?: SessionLogOffset | undefined;
            };
            rows: Record<string, {
                ver: number;
                seq: -1 | SessionSeq;
                val: JsonValue;
            }>;
        }>;
    };
};
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
