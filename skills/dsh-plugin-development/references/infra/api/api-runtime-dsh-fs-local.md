# @deepseek-ai/dsh-fs-local：文件读取、原子写入与观察保护

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在文件读取、原子写入与观察保护任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-fs.md)。

## Config 契约

从 `@deepseek-ai/dsh-fs-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    cwd?: string;
    diffBasisMaxBytes?: number;
}
```

成员检索：`cwd`、`diffBasisMaxBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## LocalFileSystem 契约

从 `@deepseek-ai/dsh-fs-local` 导入 `LocalFileSystem`。`LocalFileSystem` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalFileSystem extends FileSystem {
    watch(target: FsTarget, changed: (error?: Error) => void, signal: AbortSignal): Promise<() => Promise<void>>;
    static Config: z<Config>;
    readonly config: ResolvedConfig;
    internals: FsIoInternals;
    constructor(ctx: Context, config: Config);
    resolve(path: string, opts?: {
        cwd?: string;
        signal?: AbortSignal;
    }): Promise<FsTarget>;
    processPath(target: FsTarget): string;
    processPathFromHostPath(hostPath: string): string | undefined;
    fileUrl(target: FsTarget): string;
    contains(parent: FsTarget, child: FsTarget): boolean;
    stat(target: FsTarget, signal?: AbortSignal): Promise<FsInfo | undefined>;
    lstat(path: string, opts?: {
        cwd?: string;
    }, signal?: AbortSignal): Promise<FsPathInfo | undefined>;
    readText(target: FsTarget, signal?: AbortSignal): Promise<string>;
    streamText(target: FsTarget, signal?: AbortSignal): Promise<AsyncIterable<string>>;
    readBytes(target: FsTarget, signal: AbortSignal | undefined, maxBytes: number): Promise<Uint8Array>;
    readByteRange(target: FsTarget, range: {
        offset: number;
        length: number;
    }, signal?: AbortSignal): Promise<Uint8Array>;
    listDir(target: FsTarget, signal?: AbortSignal): Promise<FsDirEntry[]>;
    writeText(target: FsTarget, content: string, expected?: FsWriteIntent, signal?: AbortSignal): Promise<FsWriteOutcome>;
    editText(target: FsTarget, edit: FsEditRequest, expected?: {
        version: FsVersion;
    }, signal?: AbortSignal): Promise<FsEditOutcome>;
}
```

成员检索：`config`、`contains`、`editText`、`fileUrl`、`internals`、`listDir`、`lstat`、`processPath`、`processPathFromHostPath`、`readByteRange`、`readBytes`、`readText`、`resolve`、`stat`、`streamText`、`watch`、`writeText`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。
