# dsh-experimental-webworker-runtime-types 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 types 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## VfsDeferredArchive（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsDeferredArchive {
    readonly name: string;
    readonly root: string;
    readonly files: readonly VfsDeferredFile[];
    load(): Promise<Uint8Array>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsDeferredArchive`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`files`、`load`、`name`、`root`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsDeferredFile（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsDeferredFile {
    readonly path: string;
    readonly size: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsDeferredFile`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`path`、`size`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsDir（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsDir {
    readonly path: string;
    close(): Promise<void>;
    read(): Promise<{
        name: string;
    } | null>;
    [Symbol.asyncIterator](): AsyncGenerator<{
        name: string;
        isFile(): boolean;
        isDirectory(): boolean;
    }>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsDir`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`close`、`path`、`read`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsDirent（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsDirent {
    readonly name: string;
    readonly parentPath: string;
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsDirent`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`isDirectory`、`isFile`、`isSymbolicLink`、`name`、`parentPath`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsEncoding（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type VfsEncoding = 'utf8' | 'utf-8';
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsEncoding`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsError（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsError extends Error {
    code: string;
    path: string;
    syscall: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsError`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`code`、`path`、`syscall`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsFileHandle（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsFileHandle {
    write(data: string | Uint8Array): Promise<{
        bytesWritten: number;
    }>;
    writeFile(data: string | Uint8Array): Promise<void>;
    readFile(options?: VfsReadOptions): Promise<string | Uint8Array>;
    truncate(length?: number): Promise<void>;
    chmod(mode: number): Promise<void>;
    stat(options?: VfsStatOptions): Promise<VfsStats | VfsBigIntStats>;
    sync(): Promise<void>;
    datasync(): Promise<void>;
    close(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsFileHandle`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`chmod`、`close`、`datasync`、`readFile`、`stat`、`sync`、`truncate`、`write`、`writeFile`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsReadOptions（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type VfsReadOptions = VfsEncoding | {
    encoding?: VfsEncoding | null;
} | null | undefined;
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsReadOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsStats（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsStats {
    readonly size: number;
    readonly ino: number;
    readonly mtimeMs: number;
    readonly ctimeMs: number;
    readonly atimeMs: number;
    readonly birthtimeMs: number;
    readonly mtime: Date;
    readonly mode: number;
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsStats`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`atimeMs`、`birthtimeMs`、`ctimeMs`、`ino`、`isBlockDevice`、`isCharacterDevice`、`isDirectory`、`isFIFO`、`isFile`、`isSocket`、`isSymbolicLink`、`mode`、`mtime`、`mtimeMs`、`size`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

## VfsWriteOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface VfsWriteOptions {
    readonly encoding?: VfsEncoding | null;
    readonly mode?: number;
    readonly flag?: string;
}
```

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`VfsWriteOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`encoding`、`flag`、`mode`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。
