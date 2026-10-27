# dsh-experimental-webworker-runtime-posix-path 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 posix-path 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-webworker-runtime.md)；本页逐项保留对象的参数、字段和判别分支。

## posixPath（.）

公开导入：`@deepseek-ai/dsh-experimental-webworker-runtime`；公开符号：`posixPath`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const SEP = "/";
export declare function normalize(path: string): string;
export declare function join(...segments: string[]): string;
export declare function resolve(...segments: string[]): string;
export declare function dirname(path: string): string;
export declare function basename(path: string, suffix?: string): string;
export declare function extname(path: string): string;
export declare function isAbsolute(path: string): boolean;
export declare function relative(from: string, to: string): string;
export declare function parse(path: string): {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
};
export declare function toNamespacedPath(path: string): string;
export declare function pathToFileUrl(path: string): string;
export declare function fileUrlToPath(url: string | URL): string;

```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-webworker-runtime.md)。

这是 worker VFS 的纯 POSIX namespace，不是 `node:path` 的词法替代品；dirname、basename、parse 会先规范化路径。没有后台资源或取消。fileUrlToPath 拒绝非 file URL。方法如下：

| 方法 | 精确签名 |
| --- | --- |
| `normalize` | `function normalize(path: string): string;` |
| `join` | `function join(...segments: string[]): string;` |
| `resolve` | `function resolve(...segments: string[]): string;` |
| `dirname` | `function dirname(path: string): string;` |
| `basename` | `function basename(path: string, suffix?: string): string;` |
| `extname` | `function extname(path: string): string;` |
| `isAbsolute` | `function isAbsolute(path: string): boolean;` |
| `relative` | `function relative(from: string, to: string): string;` |
| `parse` | `function parse(path: string): { root: string; dir: string; base: string; ext: string; name: string; };` |
| `toNamespacedPath` | `function toNamespacedPath(path: string): string;` |
| `pathToFileUrl` | `function pathToFileUrl(path: string): string;` |
| `fileUrlToPath` | `function fileUrlToPath(url: string &#124; URL): string;` |
