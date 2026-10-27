# @deepseek-ai/dsh-fs：文件读取、原子写入与观察保护

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在文件读取、原子写入与观察保护任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-fs.md)。

## FileSystem 契约

从 `@deepseek-ai/dsh-fs` 导入 `FileSystem`。由后端 subclass 提供 ctx.fs，消费者在 inject:['fs'] 中调用。resolve/contains 的 target 必须来自同一 provider；不能手写 key。watch 完成后由调用方关闭 watcher，其他 IO 按 signal 取消。

```text
export declare abstract class FileSystem extends Service {
    constructor(ctx: Context);
    watch(target: FsTarget, changed: (error?: Error) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    get sandboxMode(): SandboxMode | undefined;
    abstract resolve(path: string, opts?: {
        cwd?: string;
        signal?: AbortSignal;
    }): Promise<FsTarget>;
    abstract processPath(target: FsTarget): string;
    processPathFromHostPath(hostPath: string): string | undefined;
    abstract fileUrl(target: FsTarget): string;
    abstract contains(parent: FsTarget, child: FsTarget): boolean;
    abstract stat(target: FsTarget, signal?: AbortSignal): Promise<FsInfo | undefined>;
    abstract lstat(path: string, opts?: {
        cwd?: string;
    }, signal?: AbortSignal): Promise<FsPathInfo | undefined>;
    abstract readText(target: FsTarget, signal?: AbortSignal): Promise<string>;
    abstract streamText(target: FsTarget, signal?: AbortSignal): Promise<AsyncIterable<string>>;
    abstract readBytes(target: FsTarget, signal: AbortSignal | undefined, maxBytes: number): Promise<Uint8Array>;
    abstract readByteRange(target: FsTarget, range: {
        offset: number;
        length: number;
    }, signal?: AbortSignal): Promise<Uint8Array>;
    abstract listDir(target: FsTarget, signal?: AbortSignal): Promise<FsDirEntry[]>;
    abstract writeText(target: FsTarget, content: string, expected?: FsWriteIntent, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy): Promise<FsWriteOutcome>;
    abstract editText(target: FsTarget, edit: FsEditRequest, expected?: {
        version: FsVersion;
    }, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy): Promise<FsEditOutcome>;
}
```

成员检索：`contains`、`editText`、`fileUrl`、`listDir`、`lstat`、`processPath`、`processPathFromHostPath`、`readByteRange`、`readBytes`、`readText`、`resolve`、`sandboxMode`、`stat`、`streamText`、`watch`、`writeText`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsDirEntry 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsDirEntry`。`FsDirEntry` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FsDirEntry {
    name: string;
    type: 'file' | 'directory' | 'other';
    target: FsTarget;
    version?: FsVersion;
    size?: number;
}
```

成员检索：`name`、`size`、`target`、`type`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsEditOutcome 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsEditOutcome`。`FsEditOutcome` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FsEditOutcome {
    version: FsVersion;
    before: string;
    after: string;
}
```

成员检索：`after`、`before`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsEditRequest 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsEditRequest`。oldString 必须非空，newString 可空以删除；replaceAll=true 替换全部，否则必须唯一匹配。文本按后端规范化行尾后匹配。

```text
export interface FsEditRequest {
    oldString: string;
    newString: string;
    replaceAll: boolean;
}
```

成员检索：`newString`、`oldString`、`replaceAll`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsError 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsError`。`FsError` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class FsError extends HarnessError {
    readonly code: FsErrorCode;
    constructor(message: string, code: FsErrorCode, options?: ErrorOptions);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsErrorCode 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsErrorCode`。`FsErrorCode` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type FsErrorCode = 'FS_NOT_FOUND' | 'FS_NOT_DIRECTORY' | 'FS_NOT_TEXT' | 'FS_NOT_REGULAR_FILE' | 'FS_TOO_LARGE' | 'FS_PERMISSION_DENIED' | 'FS_SANDBOX_DENIED' | 'FS_IO_ERROR' | 'FS_STALE_VERSION' | 'FS_NOT_OBSERVED' | 'FS_AMBIGUOUS_EDIT' | 'FS_EDIT_NOT_FOUND' | 'FS_ABORTED';
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsInfo 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsInfo`。`FsInfo` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FsInfo {
    version: FsVersion;
    type: 'file' | 'directory' | 'other';
    size?: number;
}
```

成员检索：`size`、`type`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsObservation 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsObservation`。这是判别联合：present 必须带 readonly version: FsVersion，absent 不携带 version。负观察只允许 guarded create，不能编辑不存在的文件。

```text
export type FsObservation = {
    readonly kind: 'present';
    readonly version: FsVersion;
} | {
    readonly kind: 'absent';
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsPathInfo 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsPathInfo`。`FsPathInfo` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FsPathInfo {
    version: FsVersion;
    type: 'file' | 'directory' | 'symlink' | 'other';
    size?: number;
}
```

成员检索：`size`、`type`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsTarget 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsTarget`。targetKey 只用于身份比较，不可解析；displayPath 只用于模型/UI 展示，不能假定可在 Host 打开。

```text
export interface FsTarget {
    targetKey: FsTargetKey;
    displayPath: string;
}
```

成员检索：`displayPath`、`targetKey`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsTargetKey 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsTargetKey`。后端生产的不透明目标身份；消费者从 resolve 取得。品牌构造函数不校验字符串。

```text
export declare function FsTargetKey(key: string): FsTargetKey;

export type FsTargetKey = Branded<'FsTargetKey'>;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsVersion 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsVersion`。后端生产的不透明版本，消费者从 stat 或写入结果取得；品牌构造函数不执行验证，不可用自造版本绕过新鲜度检查。

```text
export declare function FsVersion(v: string): FsVersion;

export type FsVersion = Branded<'FsVersion'>;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsWriteIntent 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsWriteIntent`。这是判别联合：{kind:'createIfAbsent'} 或 {kind:'replaceIfVersion',version:FsVersion}。省略整个参数表示无条件覆盖，而不是第三个分支。

```text
export type FsWriteIntent = {
    kind: 'createIfAbsent';
} | {
    kind: 'replaceIfVersion';
    version: FsVersion;
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## FsWriteOutcome 契约

从 `@deepseek-ai/dsh-fs` 导入 `FsWriteOutcome`。operation 区分 create/update，before 为规范化文本或 null；null 还可能表示无法提供上下文 diff 基础，不只表示新建。after 是写后文本，version 是不透明新版本。

```text
export interface FsWriteOutcome {
    operation: 'create' | 'update';
    version: FsVersion;
    before: string | null;
    after: string;
}
```

成员检索：`after`、`before`、`operation`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。
