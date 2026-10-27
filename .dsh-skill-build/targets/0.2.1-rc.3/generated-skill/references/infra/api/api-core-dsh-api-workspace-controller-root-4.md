# @deepseek-ai/dsh-api-workspace-controller .：公开对象 4

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-workspace-controller 选型与组合](api-core-dsh-api-workspace-controller-root-overview.md)。

`@deepseek-ai/dsh-api-workspace-controller` 拥有 Host 的 `ctx.workspaceController` 服务和生成的 Client `ctx.remote.workspace` namespace。它的 Remote 方法负责创建、重命名、移除和重排 Workspace，在 Workspace 内重排 Session，归档与取消归档 Session，以及跟随完整的 Workspace 投影。当 Client 必须修改或跟随 Workspace 导航时，请通过 API 网关使用它。本包同时拥有 `ctx.directoryPickerController` 与生成的 `ctx.remote.directoryPicker` namespace，因为它承载的选目录 seam 是抽象的，自身从不作为 Loader entry。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WorkspaceRenameRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceRenameRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceRenameRequest {
    readonly workspaceId: WorkspaceId;
    readonly title: string;
}
```

成员检索：`title`、`workspaceId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceUnarchiveSessionRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceUnarchiveSessionRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceUnarchiveSessionRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceUnpinSessionRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceUnpinSessionRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceUnpinSessionRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceValue 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceValue {
    readonly workspace: WorkspaceView;
}
```

成员检索：`workspace`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceView 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceView`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceView {
    readonly workspaceId: WorkspaceId;
    readonly path: string;
    readonly title: string;
    readonly sessionIds: readonly SessionId[];
    readonly createdAt: string;
    readonly updatedAt: string;
}
```

成员检索：`createdAt`、`path`、`sessionIds`、`title`、`updatedAt`、`workspaceId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
