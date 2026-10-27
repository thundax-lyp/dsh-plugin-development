# ui-workspace：navigation 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-workspace 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## StartSessionOptions client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `StartSessionOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface StartSessionOptions extends DraftInitializationOptions {
    readonly agentPreset?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `agentPreset` | `readonly agentPreset?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。

## UiWorkspace client

入口 `@deepseek-ai/dsh-client-ui-workspace/client`，公开符号 `UiWorkspace`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface UiWorkspace {
    openSession(target: SessionTarget): void;
    openWorkspace(workspaceId: WorkspaceId, beforeOpen?: (sessionId: SessionId) => void, options?: Pick<StartSessionOptions, 'agentPreset'>): Promise<void>;
    forkSession(sessionId: SessionId, onCreated?: (childId: SessionId) => void, options?: Pick<Parameters<ISessions['fork']>[0], 'allowMigration'>): Promise<SessionId>;
    connectWorkspace(workspaceId: WorkspaceId, options?: Pick<StartSessionOptions, 'agentPreset'>): Promise<SessionId>;
    startSession(workspaceId?: WorkspaceId, options?: StartSessionOptions): void;
    archiveSession(sessionId: SessionId, options?: {
        readonly stopActivity?: boolean;
    }): Promise<void>;
    unarchiveSession(sessionId: SessionId): Promise<void>;
    pinSession(sessionId: SessionId): Promise<void>;
    unpinSession(sessionId: SessionId): Promise<void>;
    pickDirectory(): Promise<string | null>;
    listDirectory(path?: string, signal?: AbortSignal): Promise<DirectoryListing>;
    createDirectory(path: string, name: string): Promise<string>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `openSession` | `openSession(target: SessionTarget): void;` |
| `openWorkspace` | `openWorkspace(workspaceId: WorkspaceId, beforeOpen?: (sessionId: SessionId) => void, options?: Pick<StartSessionOptions, 'agentPreset'>): Promise<void>;` |
| `forkSession` | `forkSession(sessionId: SessionId, onCreated?: (childId: SessionId) => void, options?: Pick<Parameters<ISessions['fork']>[0], 'allowMigration'>): Promise<SessionId>;` |
| `connectWorkspace` | `connectWorkspace(workspaceId: WorkspaceId, options?: Pick<StartSessionOptions, 'agentPreset'>): Promise<SessionId>;` |
| `startSession` | `startSession(workspaceId?: WorkspaceId, options?: StartSessionOptions): void;` |
| `archiveSession` | `archiveSession(sessionId: SessionId, options?: { readonly stopActivity?: boolean; }): Promise<void>;` |
| `unarchiveSession` | `unarchiveSession(sessionId: SessionId): Promise<void>;` |
| `pinSession` | `pinSession(sessionId: SessionId): Promise<void>;` |
| `unpinSession` | `unpinSession(sessionId: SessionId): Promise<void>;` |
| `pickDirectory` | `pickDirectory(): Promise<string \| null>;` |
| `listDirectory` | `listDirectory(path?: string, signal?: AbortSignal): Promise<DirectoryListing>;` |
| `createDirectory` | `createDirectory(path: string, name: string): Promise<string>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-workspace.md#接入-ui-workspace) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface StartSessionOptions extends DraftInitializationOptions {

  readonly agentPreset?: string
}
```
