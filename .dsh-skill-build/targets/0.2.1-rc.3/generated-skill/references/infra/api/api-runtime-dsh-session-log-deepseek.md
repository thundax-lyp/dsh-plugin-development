# @deepseek-ai/dsh-session-log-deepseek：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## Config 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    enabled: Volatile<boolean>;
    maxBytes: number;
}

export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    maxBytes: z<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    maxBytes: z<number, number, "defined">;
}>>, "plain">;
```

成员检索：`enabled`、`maxBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## DeepSeekSessionLogExtension 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `DeepSeekSessionLogExtension`。`DeepSeekSessionLogExtension` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeepSeekSessionLogExtension {
    readonly version: 1;
    readonly sessionFormatVersion: number;
    readonly session: DeepSeekSessionLogWireHeader;
    readonly afterSeq: number;
    readonly throughSeq: number;
    readonly events: readonly DeepSeekSessionLogWireEvent[];
}
```

成员检索：`afterSeq`、`events`、`session`、`sessionFormatVersion`、`throughSeq`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## DeepSeekSessionLogWireEvent 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `DeepSeekSessionLogWireEvent`。`DeepSeekSessionLogWireEvent` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type DeepSeekSessionLogWireEvent = {
    [K in SessionEvent['type']]: {
        readonly type: K;
        readonly seq: number;
        readonly time: number;
        readonly data: JsonValue;
        readonly ignorable?: true;
    } & (K extends SurfaceEventType ? {
        readonly surfaceOp: DeepSeekSessionLogWireSurfaceOp;
    } & (K extends 'assistant/message' ? {
        readonly sourceEventSeqs?: never;
    } : {
        readonly sourceEventSeqs?: readonly number[];
    }) : {
        readonly surfaceOp?: never;
        readonly sourceEventSeqs?: never;
    });
}[SessionEvent['type']] | {
    readonly type: string;
    readonly seq: number;
    readonly time: number;
    readonly data: JsonValue;
    readonly ignorable: true;
    readonly surfaceOp?: JsonValue;
    readonly sourceEventSeqs?: JsonValue;
};
```

成员检索：`data`、`ignorable`、`seq`、`sourceEventSeqs`、`surfaceOp`、`time`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## DeepSeekSessionLogWireHeader 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `DeepSeekSessionLogWireHeader`。`DeepSeekSessionLogWireHeader` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeepSeekSessionLogWireHeader {
    readonly version: number;
    readonly id: string;
    readonly createdAt: number;
    readonly cwd?: string;
    readonly parentSession?: string;
    readonly seedLength?: number;
    readonly origin?: 'subagent';
    readonly delegationDepth?: number;
    readonly agentPreset?: string;
}
```

成员检索：`agentPreset`、`createdAt`、`cwd`、`delegationDepth`、`id`、`origin`、`parentSession`、`seedLength`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## DeepSeekSessionLogWireSurfaceOp 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `DeepSeekSessionLogWireSurfaceOp`。`DeepSeekSessionLogWireSurfaceOp` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type DeepSeekSessionLogWireSurfaceOp = 'append' | {
    readonly op: 'replace';
    readonly startSeq: number;
    readonly endSeq: number;
};
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## acceptedThrough 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `acceptedThrough`。`acceptedThrough` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function acceptedThrough(session: Session): SessionSeqCursor;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-session-log-deepseek` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "session-log-deepseek";
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
