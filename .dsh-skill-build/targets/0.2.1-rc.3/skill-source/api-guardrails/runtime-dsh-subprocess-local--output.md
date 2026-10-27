# @deepseek-ai/dsh-subprocess-local./output：受管理子进程与原始输出

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在受管理子进程与原始输出任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[受管理子进程与原始输出](api-runtime-subprocess-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-subprocess.md)。

## ManagedProcessBinding 契约

从 `@deepseek-ai/dsh-subprocess-local/output` 导入 `ManagedProcessBinding`。`ManagedProcessBinding` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ManagedProcessBinding {
    spillDir: string;
    onSpillFailure: SpillFailureReporter;
}
```

成员检索：`onSpillFailure`、`spillDir`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## OutputCollector 契约

从 `@deepseek-ai/dsh-subprocess-local/output` 导入 `OutputCollector`。`OutputCollector` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class OutputCollector {
    constructor(maxBytes: number, label: string, spill: SpillOptions | undefined);
    push(chunk: Buffer): void;
    readFrom(fromByte: number): {
        text: string;
        nextOffset: number;
        lossy: boolean;
        spillPath?: string;
    };
    snapshot(): {
        bytes: Buffer;
        totalBytes: number;
    };
    seal(): void;
    finalize(): CollectedOutput;
}
```

成员检索：`finalize`、`push`、`readFrom`、`seal`、`snapshot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SpillFailureReporter 契约

从 `@deepseek-ai/dsh-subprocess-local/output` 导入 `SpillFailureReporter`。`SpillFailureReporter` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SpillFailureReporter = (error: unknown, label: string) => void;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SpillOptions 契约

从 `@deepseek-ai/dsh-subprocess-local/output` 导入 `SpillOptions`。`SpillOptions` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SpillOptions {
    maxBytes: number;
    dir: string;
    onFailure: SpillFailureReporter;
}
```

成员检索：`dir`、`maxBytes`、`onFailure`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## logSpillFailure 契约

从 `@deepseek-ai/dsh-subprocess-local/output` 导入 `logSpillFailure`。`logSpillFailure` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function logSpillFailure(logger: {
    error(message: string, ...detail: unknown[]): void;
}, owner: string): SpillFailureReporter;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## prepareManagedProcessBinding 契约

从 `@deepseek-ai/dsh-subprocess-local/output` 导入 `prepareManagedProcessBinding`。`prepareManagedProcessBinding` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function prepareManagedProcessBinding(internals?: {
    spillDir?: string;
    onSpillFailure?: SpillFailureReporter;
}): ManagedProcessBinding;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。
