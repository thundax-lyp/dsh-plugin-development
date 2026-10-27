# @deepseek-ai/dsh-session-title：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## Config 契约

从 `@deepseek-ai/dsh-session-title` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    readonly fallbackMaxWords: number;
    readonly fallbackMaxBytes: number;
    readonly maxTitleBytes: number;
}
```

成员检索：`fallbackMaxBytes`、`fallbackMaxWords`、`maxTitleBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleAutomaticMode 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleAutomaticMode`。`SessionTitleAutomaticMode` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionTitleAutomaticMode = 'first-prompt' | 'all-prompts';
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleEventData 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleEventData`。`SessionTitleEventData` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleEventData {
    readonly title: string;
    readonly messageSeqs: SessionSeq[];
    readonly source: SessionTitleSource;
}
```

成员检索：`messageSeqs`、`source`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleInvalidError 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleInvalidError`。`SessionTitleInvalidError` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionTitleInvalidError extends Error {
    readonly name = "SessionTitleInvalidError";
}
```

成员检索：`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleModelIdentity 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleModelIdentity`。`SessionTitleModelIdentity` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleModelIdentity {
    readonly provider: string;
    readonly model: string;
}
```

成员检索：`model`、`provider`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleProvider 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleProvider`。`SessionTitleProvider` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleProvider {
    readonly id: SessionTitleProviderId;
    readonly automatic: SessionTitleAutomaticMode;
    generate(request: SessionTitleProviderRequest): Promise<SessionTitleProviderResult>;
}
```

成员检索：`automatic`、`generate`、`id`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleProviderId 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleProviderId`。`SessionTitleProviderId` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function SessionTitleProviderId(id: string): SessionTitleProviderId;

export type SessionTitleProviderId = Branded<'SessionTitleProviderId'>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleProviderRequest 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleProviderRequest`。`SessionTitleProviderRequest` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleProviderRequest {
    readonly session: Session;
    readonly messages: readonly SessionTitleUserMessage[];
    readonly route?: SessionTitleModelIdentity;
    readonly currentTitle?: SessionTitleSnapshot;
    readonly signal: AbortSignal;
}
```

成员检索：`currentTitle`、`messages`、`route`、`session`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleProviderResult 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleProviderResult`。`SessionTitleProviderResult` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleProviderResult {
    readonly title: string;
    readonly messageSeqs: readonly SessionSeq[];
    readonly model?: SessionTitleModelIdentity;
}
```

成员检索：`messageSeqs`、`model`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleService 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleService`。`SessionTitleService` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionTitleService extends Service {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    get(session: Session): SessionTitleSnapshot | undefined;
    rename(session: Session, title: string): SessionTitleSnapshot;
    refresh(session: Session, signal?: AbortSignal): Promise<SessionTitleSnapshot | undefined>;
    register(provider: SessionTitleProvider): () => Promise<void>;
}
```

成员检索：`get`、`refresh`、`register`、`rename`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleSnapshot 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleSnapshot`。`SessionTitleSnapshot` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleSnapshot extends SessionTitleEventData {
    readonly eventSeq: SessionSeq;
    readonly updatedAt: number;
}
```

成员检索：`eventSeq`、`messageSeqs`、`source`、`title`、`updatedAt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleSource 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleSource`。`SessionTitleSource` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionTitleSource = {
    readonly kind: 'fallback';
} | {
    readonly kind: 'provider';
    readonly provider: SessionTitleProviderId;
    readonly model?: SessionTitleModelIdentity;
} | {
    readonly kind: 'user';
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleUserMessage 契约

从 `@deepseek-ai/dsh-session-title` 导入 `SessionTitleUserMessage`。`SessionTitleUserMessage` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleUserMessage {
    readonly seq: SessionSeq;
    readonly text: string;
}
```

成员检索：`seq`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## TitleProjection 契约

从 `@deepseek-ai/dsh-session-title` 导入 `TitleProjection`。`TitleProjection` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type TitleProjection = SessionTitleSnapshot;
```

成员检索：`eventSeq`、`messageSeqs`、`source`、`title`、`updatedAt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## fallbackSessionTitle 契约

从 `@deepseek-ai/dsh-session-title` 导入 `fallbackSessionTitle`。`fallbackSessionTitle` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function fallbackSessionTitle(input: string, maxWords: number, maxBytes: number): string;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## foldSessionTitle 契约

从 `@deepseek-ai/dsh-session-title` 导入 `foldSessionTitle`。`foldSessionTitle` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function foldSessionTitle(events: readonly SessionEvent[]): SessionTitleSnapshot | undefined;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## normalizeSessionTitle 契约

从 `@deepseek-ai/dsh-session-title` 导入 `normalizeSessionTitle`。`normalizeSessionTitle` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function normalizeSessionTitle(input: string, maxBytes: number): string;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## titleProjectionDefinition 契约

从 `@deepseek-ai/dsh-session-title` 导入 `titleProjectionDefinition`。`titleProjectionDefinition` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const titleProjectionDefinition: {
    key: "title";
    stateVersion: number;
    stateSchema: zod.ZodType<string | null, unknown, zod.core.$ZodTypeInternals<string | null, unknown>>;
    init: () => null;
    apply: (state: string | null, event: SessionEvent) => string | null;
    wire: {
        viewSchema: zod.ZodType<string | null, unknown, zod.core.$ZodTypeInternals<string | null, unknown>>;
        view: (state: string | null) => string | null;
    };
};
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## truncateTitleUtf8 契约

从 `@deepseek-ai/dsh-session-title` 导入 `truncateTitleUtf8`。`truncateTitleUtf8` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function truncateTitleUtf8(input: string, maxBytes: number): string;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
