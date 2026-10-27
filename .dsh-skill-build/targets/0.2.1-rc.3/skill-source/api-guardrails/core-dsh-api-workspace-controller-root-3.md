# @deepseek-ai/dsh-api-workspace-controller .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-workspace-controller 选型与组合](api-core-dsh-api-workspace-controller-root-overview.md)。

`@deepseek-ai/dsh-api-workspace-controller` 拥有 Host 的 `ctx.workspaceController` 服务和生成的 Client `ctx.remote.workspace` namespace。它的 Remote 方法负责创建、重命名、移除和重排 Workspace，在 Workspace 内重排 Session，归档与取消归档 Session，以及跟随完整的 Workspace 投影。当 Client 必须修改或跟随 Workspace 导航时，请通过 API 网关使用它。本包同时拥有 `ctx.directoryPickerController` 与生成的 `ctx.remote.directoryPicker` namespace，因为它承载的选目录 seam 是抽象的，自身从不作为 Loader entry。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WorkspaceFollowFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceFollowFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type WorkspaceFollowFrame = {
    readonly type: 'baseline';
    readonly value: WorkspaceBaseline;
} | WorkspaceFollowIncrement;
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceFollowIncrement 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceFollowIncrement`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type WorkspaceFollowIncrement = {
    readonly type: 'replace';
    readonly value: WorkspaceBaseline;
} | {
    readonly type: 'upsert';
    readonly workspace: WorkspaceView;
} | {
    readonly type: 'remove';
    readonly workspaceId: WorkspaceId;
} | {
    readonly type: 'order';
    readonly workspaceIds: readonly WorkspaceId[];
} | {
    readonly type: 'archived';
    readonly archivedSessionIds: readonly SessionId[];
} | {
    readonly type: 'pinned';
    readonly pinnedSessionIds: readonly SessionId[];
};
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceId 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceId`。

公开声明签名：

```text
export type WorkspaceId = Branded<'WorkspaceId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceInsertBeforeRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceInsertBeforeRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceInsertBeforeRequest {
    readonly workspaceId: WorkspaceId;
    readonly beforeWorkspaceId?: WorkspaceId;
}
```

成员检索：`beforeWorkspaceId`、`workspaceId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceInsertSessionBeforeRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceInsertSessionBeforeRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceInsertSessionBeforeRequest {
    readonly workspaceId: WorkspaceId;
    readonly sessionId: SessionId;
    readonly beforeSessionId?: SessionId;
}
```

成员检索：`beforeSessionId`、`sessionId`、`workspaceId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceOrderValue 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspaceOrderValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspaceOrderValue {
    readonly workspaceIds: readonly WorkspaceId[];
}
```

成员检索：`workspaceIds`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspacePinSessionRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspacePinSessionRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspacePinSessionRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspacePinValue 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`WorkspacePinValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WorkspacePinValue {
    readonly pinnedSessionIds: readonly SessionId[];
}
```

成员检索：`pinnedSessionIds`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
