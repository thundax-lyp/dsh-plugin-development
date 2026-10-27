# @deepseek-ai/dsh-command-feedback：反馈记录与命令入口

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在反馈记录与命令入口任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[反馈记录与命令入口](api-runtime-feedback-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-feedback.md)。

## FEEDBACK_CATEGORIES 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `FEEDBACK_CATEGORIES`。`FEEDBACK_CATEGORIES` 是反馈记录与命令入口的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const FEEDBACK_CATEGORIES: readonly [
    "task-result",
    "instruction-following",
    "product-interaction",
    "service-stability",
    "resource-cost",
    "security-privacy-permission",
    "other"
];
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## FeedbackCategory 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `FeedbackCategory`。`FeedbackCategory` 是反馈记录与命令入口的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type FeedbackCategory = 'task-result' | 'instruction-following' | 'product-interaction' | 'service-stability' | 'resource-cost' | 'security-privacy-permission' | 'other';
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## FeedbackRecord 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `FeedbackRecord`。`FeedbackRecord` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FeedbackRecord {
    readonly text?: string;
    readonly category?: FeedbackCategory;
}
```

成员检索：`category`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## SessionFeedbackRecordRequest 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `SessionFeedbackRecordRequest`。`SessionFeedbackRecordRequest` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFeedbackRecordRequest {
    readonly sessionId: SessionId;
    readonly text?: string;
    readonly category?: FeedbackCategory;
}
```

成员检索：`category`、`sessionId`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## SessionFeedbackRecordResult 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `SessionFeedbackRecordResult`。`SessionFeedbackRecordResult` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type SessionFeedbackRecordResult = {
    readonly ok: true;
    readonly value: SessionFeedbackRecordValue;
} | {
    readonly ok: false;
    readonly error: SessionFeedbackSessionNotFound;
};
```

成员检索：`ok`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## SessionFeedbackRecordValue 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `SessionFeedbackRecordValue`。`SessionFeedbackRecordValue` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFeedbackRecordValue {
    readonly recorded: true;
}
```

成员检索：`recorded`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## SessionFeedbackService 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `SessionFeedbackService`。`SessionFeedbackService` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SessionFeedbackService extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    record(request: SessionFeedbackRecordRequest): Promise<SessionFeedbackRecordResult>;
}
```

成员检索：`record`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## SessionFeedbackSessionNotFound 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `SessionFeedbackSessionNotFound`。`SessionFeedbackSessionNotFound` 是反馈记录与命令入口的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionFeedbackSessionNotFound {
    readonly code: 'session-not-found';
    readonly sessionId: SessionId;
}
```

成员检索：`code`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context): void;
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "command-feedback";
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。

## recordFeedback 契约

从 `@deepseek-ai/dsh-command-feedback` 导入 `recordFeedback`。`recordFeedback` 是反馈记录与命令入口的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function recordFeedback(session: Session, entry: FeedbackRecord): void;
```

本对象的注册/资源责任由[反馈记录与命令入口](api-runtime-feedback-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-feedback.md)核对成功、拒绝与卸载结果。
