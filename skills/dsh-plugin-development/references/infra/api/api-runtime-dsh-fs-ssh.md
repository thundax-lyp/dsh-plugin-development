# @deepseek-ai/dsh-fs-ssh：远程执行世界与配套后端

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在远程执行世界与配套后端任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[远程执行世界与配套后端](api-runtime-ssh-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-ssh.md)。

## SshFileSystem 契约

从 `@deepseek-ai/dsh-fs-ssh` 导入 `SshFileSystem`。`SshFileSystem` 是远程执行世界与配套后端的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SshFileSystem extends FileSystem {
    static inject: string[];
    get sandboxMode(): SandboxMode;
    resolve(path: string, opts?: {
        cwd?: string;
        signal?: AbortSignal;
    }): Promise<FsTarget>;
    processPath(target: FsTarget): string;
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
    writeText(target: FsTarget, content: string, expected?: FsWriteIntent, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy): Promise<FsWriteOutcome>;
    editText(target: FsTarget, edit: FsEditRequest, expected?: {
        version: FsVersion;
    }, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy): Promise<FsEditOutcome>;
}
```

成员检索：`contains`、`editText`、`fileUrl`、`listDir`、`lstat`、`processPath`、`readByteRange`、`readBytes`、`readText`、`resolve`、`sandboxMode`、`stat`、`streamText`、`writeText`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。
