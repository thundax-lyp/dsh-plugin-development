# @deepseek-ai/dsh-output-retention：工具输出预算、取消期限与进程代理

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在工具输出预算、取消期限与进程代理任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-util.md)。

## ItemRetainer 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `ItemRetainer`。`ItemRetainer` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class ItemRetainer<T> {
    constructor(strategy: ItemRetentionStrategy);
    push(item: T): PushDecision;
    finish(): RetainedItems<T>;
}
```

成员检索：`finish`、`push`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## ItemRetentionStrategy 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `ItemRetentionStrategy`。`ItemRetentionStrategy` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ItemRetentionStrategy = {
    kind: 'head';
    maxItems: number;
};
```

成员检索：`kind`、`maxItems`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## Omitted 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `Omitted`。`Omitted` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type Omitted = {
    kind: 'none';
} | {
    kind: 'exact';
    count: number;
} | {
    kind: 'unknown';
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## PushDecision 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `PushDecision`。`PushDecision` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface PushDecision {
    kept: boolean;
    truncated: boolean;
}
```

成员检索：`kept`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## RetainedItems 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `RetainedItems`。`RetainedItems` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RetainedItems<T> {
    items: T[];
    truncated: boolean;
    seen: number;
    kept: number;
    omitted: Omitted;
}
```

成员检索：`items`、`kept`、`omitted`、`seen`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## RetainedText 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `RetainedText`。`RetainedText` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RetainedText {
    text: string;
    truncated: boolean;
    omittedBytes: Omitted;
}
```

成员检索：`omittedBytes`、`text`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## RetentionNotice 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `RetentionNotice`。`RetentionNotice` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RetentionNotice {
    scope: string;
    strategy: 'head' | 'tail' | 'headTail';
    unit: 'items' | 'bytes' | 'chars' | 'lines';
    limit: number | {
        head: number;
        tail: number;
    };
    kept: number;
    omitted: Omitted;
}
```

成员检索：`kept`、`limit`、`omitted`、`scope`、`strategy`、`unit`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## TextRetainer 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `TextRetainer`。`TextRetainer` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class TextRetainer {
    constructor(strategy: TextRetentionStrategy);
    push(chunk: Uint8Array | string): PushDecision;
    finish(): RetainedText;
}
```

成员检索：`finish`、`push`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## TextRetentionStrategy 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `TextRetentionStrategy`。`TextRetentionStrategy` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type TextRetentionStrategy = {
    kind: 'head';
    maxBytes: number;
} | {
    kind: 'tail';
    maxBytes: number;
} | {
    kind: 'headTail';
    headBytes: number;
    tailBytes: number;
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## describeOmitted 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `describeOmitted`。`describeOmitted` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function describeOmitted(omitted: Omitted, unit: RetentionNotice['unit']): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## formatRetentionNotice 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `formatRetentionNotice`。`formatRetentionNotice` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatRetentionNotice(notice: RetentionNotice, recovery: (notice: RetentionNotice) => string): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## truncateWithoutSplittingSurrogatePair 契约

从 `@deepseek-ai/dsh-output-retention` 导入 `truncateWithoutSplittingSurrogatePair`。`truncateWithoutSplittingSurrogatePair` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function truncateWithoutSplittingSurrogatePair(text: string, maxChars: number): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。
