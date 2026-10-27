# @deepseek-ai/dsh-api-workspace-files .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-workspace-files 选型与组合](api-core-dsh-api-workspace-files-root-overview.md)。

使用本包可从 Web Client 预览 Session 文件系统允许读取的文件。它按页读取 UTF-8 文本、按有界窗口或完整文件读取原始字节、从基文件目录解析关联文件，并报告文件元数据。可以跟随一个文件或一个目录直接子项的变化。文件读取和监听可以指向工作区外路径；目录列举和监听仍限定于工作区。本服务不提供修改操作。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WorkspaceFileScope 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files`；公开符号：`WorkspaceFileScope`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceFileScope {
    readonly sessionId: SessionId;
    readonly workspaceRoot: string;
}
```

成员检索：`sessionId`、`workspaceRoot`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceFileStat 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files`；公开符号：`WorkspaceFileStat`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceFileStat {
    readonly absolutePath: string;
    readonly version: string;
    readonly bytes?: number;
}
```

成员检索：`absolutePath`、`bytes`、`version`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceFileText 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files`；公开符号：`WorkspaceFileText`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceFileText extends WorkspaceFileStat {
    readonly offset: number;
    readonly text: string;
    readonly lines: number;
    readonly eof: boolean;
}
```

成员检索：`absolutePath`、`bytes`、`eof`、`lines`、`offset`、`text`、`version`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceFileWatchFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files`；公开符号：`WorkspaceFileWatchFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type WorkspaceFileWatchFrame = {
    readonly kind: 'ready';
} | {
    readonly kind: 'change';
    readonly change: WorkspaceFileChange;
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceFiles 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files`；公开符号：`WorkspaceFiles`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class WorkspaceFiles extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    read(workspaceFileScope: WorkspaceFileScope, path: string, range: WorkspaceFileRange, signal: AbortSignal): Promise<WorkspaceFileText>;
    readBytes(workspaceFileScope: WorkspaceFileScope, path: string, options: WorkspaceByteReadOptions, signal: AbortSignal): Promise<WorkspaceFileBytes>;
    stat(workspaceFileScope: WorkspaceFileScope, path: string, signal: AbortSignal): Promise<WorkspaceFileStat>;
    list(workspaceFileScope: WorkspaceFileScope, path: string, signal: AbortSignal): Promise<WorkspaceDirectoryListing>;
    changes(workspaceFileScope: WorkspaceFileScope, path: string, signal: AbortSignal): AsyncIterable<WorkspaceFileWatchFrame>;
}
```

成员检索：`changes`、`list`、`read`、`readBytes`、`stat`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
