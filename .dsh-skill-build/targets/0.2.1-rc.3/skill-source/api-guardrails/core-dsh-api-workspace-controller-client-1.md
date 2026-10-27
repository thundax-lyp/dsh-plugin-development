# @deepseek-ai/dsh-api-workspace-controller ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-workspace-controller 选型与组合](api-core-dsh-api-workspace-controller-client-overview.md)。

`@deepseek-ai/dsh-api-workspace-controller` 拥有 Host 的 `ctx.workspaceController` 服务和生成的 Client `ctx.remote.workspace` namespace。它的 Remote 方法负责创建、重命名、移除和重排 Workspace，在 Workspace 内重排 Session，归档与取消归档 Session，以及跟随完整的 Workspace 投影。当 Client 必须修改或跟随 Workspace 导航时，请通过 API 网关使用它。本包同时拥有 `ctx.directoryPickerController` 与生成的 `ctx.remote.directoryPicker` namespace，因为它承载的选目录 seam 是抽象的，自身从不作为 Loader entry。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ClientWorkspaceModel 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`ClientWorkspaceModel`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ClientWorkspaceModel implements WorkspaceFollowSink {
    constructor(remote: WorkspaceRemote);
    create(input: WorkspaceCreateRequest): Promise<RemoteResult<WorkspaceCreateValue>>;
    initializeDefault(signal?: AbortSignal): Promise<RemoteResult<WorkspaceValue | undefined>>;
    rename(workspaceId: WorkspaceId, title: string): Promise<RemoteResult<WorkspaceValue>>;
    delete(workspaceId: WorkspaceId): Promise<RemoteResult<WorkspaceDeleteValue>>;
    insertBefore(workspaceId: WorkspaceId, beforeWorkspaceId?: WorkspaceId): Promise<RemoteResult<WorkspaceOrderValue>>;
    insertSessionBefore(workspaceId: WorkspaceInsertSessionBeforeRequest['workspaceId'], sessionId: WorkspaceInsertSessionBeforeRequest['sessionId'], beforeSessionId?: WorkspaceInsertSessionBeforeRequest['beforeSessionId']): Promise<RemoteResult<WorkspaceValue>>;
    archiveSession(sessionId: WorkspaceArchiveSessionRequest['sessionId'], options?: Pick<WorkspaceArchiveSessionRequest, 'stopActivity'>): Promise<RemoteResult<WorkspaceArchiveValue>>;
    unarchiveSession(sessionId: WorkspaceUnarchiveSessionRequest['sessionId']): Promise<RemoteResult<WorkspaceArchiveValue>>;
    pinSession(sessionId: WorkspacePinSessionRequest['sessionId']): Promise<RemoteResult<WorkspacePinValue>>;
    unpinSession(sessionId: WorkspaceUnpinSessionRequest['sessionId']): Promise<RemoteResult<WorkspacePinValue>>;
    replaceBaseline(baseline: WorkspaceBaseline): void;
    upsertView(workspace: WorkspaceView): void;
    removeView(workspaceId: WorkspaceId): void;
    replaceOrder(workspaceIds: readonly WorkspaceId[]): void;
    replaceArchived(archivedSessionIds: WorkspaceArchiveValue['archivedSessionIds']): void;
    replacePinned(pinnedSessionIds: WorkspacePinValue['pinnedSessionIds']): void;
    handleCarrierFailure(): void;
    handleStreamFailure(error: unknown): void;
    subscribe(listener: () => void): () => void;
    getSnapshot(): WorkspaceSnapshot;
}
```

成员检索：`archiveSession`、`create`、`delete`、`getSnapshot`、`handleCarrierFailure`、`handleStreamFailure`、`initializeDefault`、`insertBefore`、`insertSessionBefore`、`pinSession`、`removeView`、`rename`、`replaceArchived`、`replaceBaseline`、`replaceOrder`、`replacePinned`、`subscribe`、`unarchiveSession`、`unpinSession`、`upsertView`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## IWorkspaces 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`IWorkspaces`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface IWorkspaces {
    readonly list: WorkspaceSource;
    create(input: {
        path: string;
    }): Promise<WorkspaceView>;
    initializeDefault(signal?: AbortSignal): Promise<WorkspaceView | undefined>;
    rename(workspaceId: WorkspaceId, title: string): Promise<WorkspaceView>;
    delete(workspaceId: WorkspaceId): Promise<void>;
    insertBefore(workspaceId: WorkspaceId, beforeWorkspaceId?: WorkspaceId): Promise<void>;
    archiveSession(sessionId: SessionId, options?: {
        readonly stopActivity?: boolean;
    }): Promise<void>;
    unarchiveSession(sessionId: SessionId): Promise<void>;
    pinSession(sessionId: SessionId): Promise<void>;
    unpinSession(sessionId: SessionId): Promise<void>;
    insertSessionBefore(workspaceId: WorkspaceId, sessionId: SessionId, beforeSessionId?: SessionId): Promise<WorkspaceView>;
}
```

成员检索：`archiveSession`、`create`、`delete`、`initializeDefault`、`insertBefore`、`insertSessionBefore`、`list`、`pinSession`、`rename`、`unarchiveSession`、`unpinSession`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivity 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`SessionActivity`。

公开声明签名：

```text
export interface SessionActivity {
    readonly kind: SessionActivityKind;
    readonly items?: readonly SessionActivityItem[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivityItem 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`SessionActivityItem`。

公开声明签名：

```text
export interface SessionActivityItem {
    readonly id: string;
    readonly label?: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivityKind 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`SessionActivityKind`。

公开声明签名：

```text
export type SessionActivityKind = keyof SessionActivityKindMap;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivityKindMap 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`SessionActivityKindMap`。

公开声明签名：

声明来源包 `@deepseek-ai/dsh-workspace`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface SessionActivityKindMap {
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    turn: true;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    subagent: true;
}
```

声明来源包 `@deepseek-ai/dsh-schedule`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    schedule: true;
}
```

声明来源包 `@deepseek-ai/dsh-jobs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    job: true;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceArchiveError 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`WorkspaceArchiveError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class WorkspaceArchiveError extends Error {
    readonly rpcError: RemoteFailure;
    readonly name = "WorkspaceArchiveError";
    constructor(rpcError: RemoteFailure);
}
```

成员检索：`name`、`rpcError`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## WorkspaceController 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller/client`；公开符号：`WorkspaceController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class WorkspaceController extends Service implements IWorkspaces {
    readonly list: WorkspaceSource;
    constructor(ctx: Context, model: ClientWorkspaceModel);
    create(input: {
        path: string;
    }): Promise<WorkspaceView>;
    initializeDefault(signal?: AbortSignal): Promise<WorkspaceView | undefined>;
    rename(workspaceId: WorkspaceId, title: string): Promise<WorkspaceView>;
    delete(workspaceId: WorkspaceId): Promise<void>;
    insertBefore(workspaceId: WorkspaceId, beforeWorkspaceId?: WorkspaceId): Promise<void>;
    archiveSession(sessionId: SessionId, options?: {
        readonly stopActivity?: boolean;
    }): Promise<void>;
    unarchiveSession(sessionId: SessionId): Promise<void>;
    pinSession(sessionId: SessionId): Promise<void>;
    unpinSession(sessionId: SessionId): Promise<void>;
    insertSessionBefore(workspaceId: WorkspaceId, sessionId: SessionId, beforeSessionId?: SessionId): Promise<WorkspaceView>;
}
```

成员检索：`archiveSession`、`create`、`delete`、`initializeDefault`、`insertBefore`、`insertSessionBefore`、`list`、`pinSession`、`rename`、`unarchiveSession`、`unpinSession`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
