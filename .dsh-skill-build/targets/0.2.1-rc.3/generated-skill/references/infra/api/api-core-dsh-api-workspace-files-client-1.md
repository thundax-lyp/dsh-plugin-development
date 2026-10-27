# @deepseek-ai/dsh-api-workspace-files ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-workspace-files 选型与组合](api-core-dsh-api-workspace-files-client-overview.md)。

使用本包可从 Web Client 预览 Session 文件系统允许读取的文件。它按页读取 UTF-8 文本、按有界窗口或完整文件读取原始字节、从基文件目录解析关联文件，并报告文件元数据。可以跟随一个文件或一个目录直接子项的变化。文件读取和监听可以指向工作区外路径；目录列举和监听仍限定于工作区。本服务不提供修改操作。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WorkspaceFileParams 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files/client`；公开符号：`WorkspaceFileParams`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceFileParams {
    readonly line?: number;
}
```

成员检索：`line`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: ClientContext): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-files/client`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
