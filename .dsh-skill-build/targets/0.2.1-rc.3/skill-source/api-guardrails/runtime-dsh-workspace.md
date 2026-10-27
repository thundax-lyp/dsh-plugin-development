# @deepseek-ai/dsh-workspace：工作区归属与会话管理

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在工作区归属与会话管理任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[工作区归属与会话管理](api-runtime-workspace-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-workspace.md)。

## ArchiveSessionOptions 契约

从 `@deepseek-ai/dsh-workspace` 导入 `ArchiveSessionOptions`。`ArchiveSessionOptions` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ArchiveSessionOptions {
    readonly stopActivity?: boolean;
}
```

成员检索：`stopActivity`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## SessionActivity 契约

从 `@deepseek-ai/dsh-workspace` 导入 `SessionActivity`。`SessionActivity` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionActivity {
    readonly kind: SessionActivityKind;
    readonly items?: readonly SessionActivityItem[];
}
```

成员检索：`items`、`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## SessionActivityItem 契约

从 `@deepseek-ai/dsh-workspace` 导入 `SessionActivityItem`。`SessionActivityItem` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionActivityItem {
    readonly id: string;
    readonly label?: string;
}
```

成员检索：`id`、`label`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## SessionActivityKind 契约

从 `@deepseek-ai/dsh-workspace` 导入 `SessionActivityKind`。`SessionActivityKind` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionActivityKind = keyof SessionActivityKindMap;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## SessionActivityKindMap 契约

从 `@deepseek-ai/dsh-workspace` 导入 `SessionActivityKindMap`。`SessionActivityKindMap` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

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

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## SessionActivityRequest 契约

从 `@deepseek-ai/dsh-workspace` 导入 `SessionActivityRequest`。`SessionActivityRequest` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionActivityRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## Workspace 契约

从 `@deepseek-ai/dsh-workspace` 导入 `Workspace`。`Workspace` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface Workspace {
    readonly id: WorkspaceId;
    readonly path: string;
    readonly title: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly sessionIds: readonly SessionId[];
    setTitle(title: string): Promise<void>;
    attachSession(sessionId: SessionId): Promise<void>;
    insertSessionBefore(sessionId: SessionId, beforeSessionId?: SessionId): Promise<void>;
    detachSession(sessionId: SessionId): Promise<void>;
    status(): Promise<'ok' | 'missing-dir'>;
}
```

成员检索：`attachSession`、`createdAt`、`detachSession`、`id`、`insertSessionBefore`、`path`、`sessionIds`、`setTitle`、`status`、`title`、`updatedAt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceActiveSessionError 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceActiveSessionError`。`WorkspaceActiveSessionError` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class WorkspaceActiveSessionError extends Error {
    readonly sessionId: SessionId;
    readonly activity: readonly SessionActivity[];
    constructor(sessionId: SessionId, activity: readonly SessionActivity[]);
}
```

成员检索：`activity`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceArchivedSessionPinError 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceArchivedSessionPinError`。`WorkspaceArchivedSessionPinError` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class WorkspaceArchivedSessionPinError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId);
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceDomainState 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceDomainState`。`WorkspaceDomainState` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type WorkspaceDomainState = z.infer<typeof workspaceDomainState>;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `archivedSessionIds` | `archivedSessionIds: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>>;` | 来自上述类型组合的公开分支 |
| `defaultWorkspaceId` | `defaultWorkspaceId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>>;` | 来自上述类型组合的公开分支 |
| `initialized` | `initialized: z.ZodBoolean;` | 来自上述类型组合的公开分支 |
| `pendingMutation` | `pendingMutation: z.ZodOptional<z.ZodDiscriminatedUnion<[ z.ZodObject<{ operation: z.ZodLiteral<"create">; workspaceId: z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>; }, z.core.$strip>, z.ZodObject<{ operation: z.ZodLiteral<"delete">; workspaceId: z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>; }, z.core.$strip> ], "operation">>;` | 来自上述类型组合的公开分支 |
| `pinnedSessionIds` | `pinnedSessionIds: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>>;` | 来自上述类型组合的公开分支 |
| `workspaceIds` | `workspaceIds: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>>;` | 来自上述类型组合的公开分支 |

## WorkspaceId 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceId`。`WorkspaceId` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function WorkspaceId(id: string): WorkspaceId;

export type WorkspaceId = WorkspaceIdBrand;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceMoveInvalidError 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceMoveInvalidError`。`WorkspaceMoveInvalidError` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class WorkspaceMoveInvalidError extends Error {
    constructor(message: string);
}
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceOrderInvalidError 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceOrderInvalidError`。`WorkspaceOrderInvalidError` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class WorkspaceOrderInvalidError extends Error {
    readonly workspaceId: WorkspaceId;
    constructor(workspaceId: WorkspaceId);
}
```

成员检索：`workspaceId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceRecord 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceRecord`。`WorkspaceRecord` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type WorkspaceRecord = z.infer<typeof workspaceRecord>;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `createdAt` | `createdAt: z.ZodString;` | 来自上述类型组合的公开分支 |
| `path` | `path: z.ZodString;` | 来自上述类型组合的公开分支 |
| `sessionIds` | `sessionIds: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>;` | 来自上述类型组合的公开分支 |
| `title` | `title: z.ZodString;` | 来自上述类型组合的公开分支 |
| `updatedAt` | `updatedAt: z.ZodString;` | 来自上述类型组合的公开分支 |

## WorkspaceRegistry 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceRegistry`。`WorkspaceRegistry` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class WorkspaceRegistry extends Service {
    static inject: string[];
    constructor(ctx: Context);
    create(path: string, title?: string): Promise<Workspace>;
    initializeDefault(resolveDirectory: () => Promise<string>): Promise<Workspace | undefined>;
    get(id: WorkspaceId): Workspace | undefined;
    list(): Workspace[];
    delete(id: WorkspaceId): Promise<boolean>;
    insertBefore(id: WorkspaceId, beforeId?: WorkspaceId): Promise<readonly WorkspaceId[]>;
    get archivedSessionIds(): readonly SessionId[];
    archiveSession(sessionId: SessionId, options?: ArchiveSessionOptions): Promise<void>;
    unarchiveSession(sessionId: SessionId): Promise<void>;
    get pinnedSessionIds(): readonly SessionId[];
    pinSession(sessionId: SessionId): Promise<void>;
    unpinSession(sessionId: SessionId): Promise<void>;
    resolveByPath(path: string): Promise<Workspace | undefined>;
}
```

成员检索：`archiveSession`、`archivedSessionIds`、`create`、`delete`、`get`、`initializeDefault`、`insertBefore`、`list`、`pinSession`、`pinnedSessionIds`、`resolveByPath`、`unarchiveSession`、`unpinSession`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## WorkspaceUnknownSessionError 契约

从 `@deepseek-ai/dsh-workspace` 导入 `WorkspaceUnknownSessionError`。`WorkspaceUnknownSessionError` 是工作区归属与会话管理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class WorkspaceUnknownSessionError extends Error {
    readonly sessionId: SessionId;
    constructor(sessionId: SessionId, verb: 'archive' | 'pin');
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## realpathNormalize 契约

从 `@deepseek-ai/dsh-workspace` 导入 `realpathNormalize`。`realpathNormalize` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function realpathNormalize(path: string): Promise<string>;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## workspaceDomainSpec 契约

从 `@deepseek-ai/dsh-workspace` 导入 `workspaceDomainSpec`。`workspaceDomainSpec` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const workspaceDomainSpec: {
    name: string;
    version: number;
    global: {
        schema: z.ZodObject<{
            initialized: z.ZodBoolean;
            defaultWorkspaceId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>>;
            workspaceIds: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>>;
            archivedSessionIds: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>>;
            pinnedSessionIds: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>>;
            pendingMutation: z.ZodOptional<z.ZodDiscriminatedUnion<[
                z.ZodObject<{
                    operation: z.ZodLiteral<"create">;
                    workspaceId: z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>;
                }, z.core.$strip>,
                z.ZodObject<{
                    operation: z.ZodLiteral<"delete">;
                    workspaceId: z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>;
                }, z.core.$strip>
            ], "operation">>;
        }, z.core.$strip>;
        initial: {
            initialized: boolean;
            workspaceIds: never[];
            archivedSessionIds: never[];
            pinnedSessionIds: never[];
        };
    };
    tables: {
        workspaces: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<WorkspaceId, {
            path: string;
            title: string;
            sessionIds: SessionId[];
            createdAt: string;
            updatedAt: string;
        }>;
    };
};
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## workspaceDomainState 契约

从 `@deepseek-ai/dsh-workspace` 导入 `workspaceDomainState`。`workspaceDomainState` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const workspaceDomainState: z.ZodObject<{
    initialized: z.ZodBoolean;
    defaultWorkspaceId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>>;
    workspaceIds: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>>;
    archivedSessionIds: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>>;
    pinnedSessionIds: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>>;
    pendingMutation: z.ZodOptional<z.ZodDiscriminatedUnion<[
        z.ZodObject<{
            operation: z.ZodLiteral<"create">;
            workspaceId: z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>;
        }, z.core.$strip>,
        z.ZodObject<{
            operation: z.ZodLiteral<"delete">;
            workspaceId: z.ZodPipe<z.ZodString, z.ZodTransform<WorkspaceId, string>>;
        }, z.core.$strip>
    ], "operation">>;
}, z.core.$strip>;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。

## workspaceRecord 契约

从 `@deepseek-ai/dsh-workspace` 导入 `workspaceRecord`。`workspaceRecord` 是工作区归属与会话管理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const workspaceRecord: z.ZodObject<{
    path: z.ZodString;
    title: z.ZodString;
    sessionIds: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
```

本对象的注册/资源责任由[工作区归属与会话管理](api-runtime-workspace-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-workspace.md)核对成功、拒绝与卸载结果。
