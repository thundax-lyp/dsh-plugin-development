# dsh-experimental-webworker-runtime-memory 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 memory 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## MemoryVfs（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`MemoryVfs`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class MemoryVfs implements Vfs {
    constructor(options?: MemoryVfsOptions);
    flush(): Promise<void>;
    subscribe(listener: VfsMutationListener): () => void;
    readonly promises: {
        readFile: (path: string, options?: VfsReadOptions) => Promise<string | Uint8Array>;
        writeFile: (path: string, data: string | Uint8Array, options?: VfsWriteOptions) => Promise<void>;
        appendFile: (path: string, data: string | Uint8Array) => Promise<void>;
        mkdir: (path: string, options?: {
            recursive?: boolean;
            mode?: number;
        }) => Promise<string | undefined>;
        readdir: (path: string, options?: {
            withFileTypes?: boolean;
        }) => Promise<string[] & VfsDirent[]>;
        stat: (path: string, options?: VfsStatOptions) => Promise<VfsStats | VfsBigIntStats>;
        lstat: (path: string, options?: VfsStatOptions) => Promise<VfsStats | VfsBigIntStats>;
        realpath: (path: string) => Promise<string>;
        rename: (from: string, to: string) => Promise<void>;
        unlink: (path: string) => Promise<void>;
        rm: (path: string, options?: {
            recursive?: boolean;
            force?: boolean;
        }) => Promise<void>;
        mkdtemp: (prefix: string) => Promise<string>;
        link: (existing: string, next: string) => Promise<void>;
        truncate: (path: string, length?: number) => Promise<void>;
        chmod: (path: string, mode: number) => Promise<void>;
        opendir: (path: string) => Promise<VfsDir>;
        open: (path: string, flags?: string, mode?: number) => Promise<VfsFileHandle>;
        access: (path: string) => Promise<void>;
    };
    deferArchive(archive: VfsDeferredArchive): void;
    whenReadable(path: string): Promise<void> | undefined;
    readFileSync(path: string, options?: VfsReadOptions): string | Uint8Array;
    existsSync(path: string): boolean;
    statSync(path: string, options?: VfsStatOptions): VfsStats | VfsBigIntStats;
    readdirSync(path: string, options?: {
        withFileTypes?: boolean;
    }): string[] & VfsDirent[];
    realpathSync(path: string): string;
    mkdirSync(path: string, options?: {
        recursive?: boolean;
        mode?: number;
    }): string | undefined;
    writeFileSync(path: string, data: string | Uint8Array, options?: VfsWriteOptions): void;
    opendir(path: string): VfsDir;
    open(path: string, flags?: string, mode?: number): VfsFileHandle;
    openFileSync(path: string, flags?: string, mode?: number): VfsOpenFile;
    appendFileSync(path: string, data: string | Uint8Array): void;
    renameSync(from: string, to: string): void;
    linkSync(existing: string, next: string): void;
    truncateSync(path: string, length?: number): void;
    chmodSync(path: string, mode: number): void;
    unlinkSync(path: string): void;
    rmSync(path: string, options?: {
        recursive?: boolean;
        force?: boolean;
    }): void;
    mkdtempSync(prefix: string): string;
    seed(path: string, data: string | Uint8Array, options?: VfsSeedOptions): void;
    seedDirectory(path: string, options?: VfsSeedOptions): void;
    usage(): {
        files: number;
        directories: number;
        bytes: number;
    };
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## loadVfsImage（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`loadVfsImage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function loadVfsImage(image: Uint8Array, root?: string, vfs?: MemoryVfs): MemoryVfs;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## loadVfsOverlay（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`loadVfsOverlay`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function loadVfsOverlay(image: Uint8Array, root: string, vfs: MemoryVfs): MemoryVfs;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
