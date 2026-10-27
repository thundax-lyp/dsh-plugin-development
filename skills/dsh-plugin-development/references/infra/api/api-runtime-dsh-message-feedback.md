# @deepseek-ai/dsh-message-feedback：反馈记录与命令入口

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在反馈记录与命令入口任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[反馈记录与命令入口](api-runtime-feedback-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-feedback.md)。

## Config 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    readonly maxNoteBytes: number;
}
```

成员检索：`maxNoteBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackDelete 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackDelete`。`MessageFeedbackDelete` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackDelete {
    readonly sessionId: SessionId;
    readonly messageId: MessageId;
}
```

成员检索：`messageId`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackDeleteRequest 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackDeleteRequest`。`MessageFeedbackDeleteRequest` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackDeleteRequest {
    readonly sessionId: SessionId;
    readonly messageId: MessageId;
    readonly ifVersion: MessageFeedbackVersion;
}
```

成员检索：`ifVersion`、`messageId`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackDeleteResult 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackDeleteResult`。`MessageFeedbackDeleteResult` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type MessageFeedbackDeleteResult = MessageFeedbackSuccess<MessageFeedbackDeleteValue> | MessageFeedbackRejected<MessageFeedbackSessionNotFound | MessageFeedbackVersionConflict>;
```

成员检索：`ok`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackDeleteValue 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackDeleteValue`。`MessageFeedbackDeleteValue` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackDeleteValue {
    readonly absent: true;
}
```

成员检索：`absent`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackFailure 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackFailure`。`MessageFeedbackFailure` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type MessageFeedbackFailure = MessageFeedbackSessionNotFound | MessageFeedbackTargetNotFound | MessageFeedbackVersionConflict | MessageFeedbackNoteBlank | MessageFeedbackNoteTooLarge;
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackItem 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackItem`。`MessageFeedbackItem` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackItem {
    readonly messageId: MessageId;
    readonly rating: MessageFeedbackRating;
    readonly note?: string;
    readonly category?: FeedbackCategory;
    readonly version: MessageFeedbackVersion;
    readonly createdAt: number;
    readonly updatedAt: number;
}
```

成员检索：`category`、`createdAt`、`messageId`、`note`、`rating`、`updatedAt`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackListRequest 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackListRequest`。`MessageFeedbackListRequest` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackListRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackListResult 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackListResult`。`MessageFeedbackListResult` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type MessageFeedbackListResult = MessageFeedbackSuccess<MessageFeedbackListValue> | MessageFeedbackRejected<MessageFeedbackSessionNotFound>;
```

成员检索：`ok`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackListValue 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackListValue`。`MessageFeedbackListValue` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackListValue {
    readonly items: readonly MessageFeedbackItem[];
}
```

成员检索：`items`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackNoteBlank 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackNoteBlank`。`MessageFeedbackNoteBlank` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackNoteBlank {
    readonly code: 'note-blank';
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackNoteTooLarge 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackNoteTooLarge`。`MessageFeedbackNoteTooLarge` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackNoteTooLarge {
    readonly code: 'note-too-large';
    readonly maxBytes: number;
    readonly actualBytes: number;
}
```

成员检索：`actualBytes`、`code`、`maxBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackPut 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackPut`。`MessageFeedbackPut` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackPut {
    readonly sessionId: SessionId;
    readonly item: MessageFeedbackItem;
}
```

成员检索：`item`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackPutRequest 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackPutRequest`。`MessageFeedbackPutRequest` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackPutRequest {
    readonly sessionId: SessionId;
    readonly messageId: MessageId;
    readonly rating: MessageFeedbackRating;
    readonly note?: string;
    readonly category?: FeedbackCategory;
    readonly ifVersion: MessageFeedbackVersion | null;
}
```

成员检索：`category`、`ifVersion`、`messageId`、`note`、`rating`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackPutResult 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackPutResult`。`MessageFeedbackPutResult` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type MessageFeedbackPutResult = MessageFeedbackSuccess<MessageFeedbackItem> | MessageFeedbackRejected<MessageFeedbackSessionNotFound | MessageFeedbackTargetNotFound | MessageFeedbackVersionConflict | MessageFeedbackNoteBlank | MessageFeedbackNoteTooLarge>;
```

成员检索：`ok`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackRating 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackRating`。`MessageFeedbackRating` 是反馈记录与命令入口的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type MessageFeedbackRating = 'positive' | 'negative';
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackRejected 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackRejected`。`MessageFeedbackRejected` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackRejected<E extends MessageFeedbackFailure> {
    readonly ok: false;
    readonly error: E;
}
```

成员检索：`error`、`ok`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackService 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackService`。`MessageFeedbackService` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class MessageFeedbackService extends TypertRemoteService {
    static inject: string[];
    static Config: s<Config>;
    constructor(ctx: Context, config: Config);
    list(request: MessageFeedbackListRequest): Promise<MessageFeedbackListResult>;
    put(request: MessageFeedbackPutRequest): Promise<MessageFeedbackPutResult>;
    delete(request: MessageFeedbackDeleteRequest): Promise<MessageFeedbackDeleteResult>;
}
```

成员检索：`delete`、`list`、`put`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackSessionNotFound 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackSessionNotFound`。`MessageFeedbackSessionNotFound` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackSessionNotFound {
    readonly code: 'session-not-found';
    readonly sessionId: SessionId;
}
```

成员检索：`code`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackSuccess 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackSuccess`。`MessageFeedbackSuccess` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackSuccess<T> {
    readonly ok: true;
    readonly value: T;
}
```

成员检索：`ok`、`value`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackTargetNotFound 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackTargetNotFound`。`MessageFeedbackTargetNotFound` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackTargetNotFound {
    readonly code: 'target-not-found';
    readonly sessionId: SessionId;
    readonly messageId: MessageId;
}
```

成员检索：`code`、`messageId`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackVersion 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackVersion`。`MessageFeedbackVersion` 是反馈记录与命令入口的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type MessageFeedbackVersion = Branded<'MessageFeedbackVersion'>;
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## MessageFeedbackVersionConflict 契约

从 `@deepseek-ai/dsh-message-feedback` 导入 `MessageFeedbackVersionConflict`。`MessageFeedbackVersionConflict` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface MessageFeedbackVersionConflict {
    readonly code: 'version-conflict';
    readonly current: MessageFeedbackItem | null;
}
```

成员检索：`code`、`current`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。
