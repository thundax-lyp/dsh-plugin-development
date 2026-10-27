# @deepseek-ai/dsh-timeout：工具输出预算、取消期限与进程代理

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在工具输出预算、取消期限与进程代理任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-util.md)。

## Deadline 契约

从 `@deepseek-ai/dsh-timeout` 导入 `Deadline`。`Deadline` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface Deadline {
    readonly signal: AbortSignal;
    [Symbol.dispose](): void;
}
```

成员检索：`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## IdleWatchdog 契约

从 `@deepseek-ai/dsh-timeout` 导入 `IdleWatchdog`。`IdleWatchdog` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface IdleWatchdog {
    readonly signal: AbortSignal;
    next<T>(iterator: AsyncIterator<T>): Promise<IteratorResult<T>>;
    pulse(): void;
    [Symbol.dispose](): void;
}
```

成员检索：`next`、`pulse`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## MAX_TIMER_DELAY_MS 契约

从 `@deepseek-ai/dsh-timeout` 导入 `MAX_TIMER_DELAY_MS`。`MAX_TIMER_DELAY_MS` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const MAX_TIMER_DELAY_MS = 2147483647;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## TimeoutReason 契约

从 `@deepseek-ai/dsh-timeout` 导入 `TimeoutReason`。`TimeoutReason` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class TimeoutReason extends Error {
    readonly code: string;
    readonly timeoutMs: number;
    name: string;
    constructor(code: string, timeoutMs: number);
}
```

成员检索：`code`、`name`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## clampTimeout 契约

从 `@deepseek-ai/dsh-timeout` 导入 `clampTimeout`。`clampTimeout` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function clampTimeout(requested: number | undefined, def: number, max: number, name?: string): number;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## deadline 契约

从 `@deepseek-ai/dsh-timeout` 导入 `deadline`。`deadline` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function deadline(upstream: AbortSignal | undefined, timeoutMs: number, code: string): Deadline;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## idleWatchdog 契约

从 `@deepseek-ai/dsh-timeout` 导入 `idleWatchdog`。`idleWatchdog` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function idleWatchdog(upstream: AbortSignal | undefined, timeoutMs: number, code: string): IdleWatchdog;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## timeoutOf 契约

从 `@deepseek-ai/dsh-timeout` 导入 `timeoutOf`。`timeoutOf` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function timeoutOf(x: AbortSignal | {
    reason?: unknown;
}, code?: string): TimeoutReason | undefined;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。
