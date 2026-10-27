# ui-commands：directory 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-commands 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## CommandDirectory client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `CommandDirectory`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class CommandDirectory {
    constructor(fetchCommands: FetchCommands);
    status(sessionId: SessionId): DirectoryStatus;
    resolve(sessionId: SessionId, name: string): CommandDescriptor | undefined;
    invalidateAll(): void;
    resetSession(sessionId: SessionId): void;
    resetConnected(): void;
    warm(sessionId: SessionId): void;
    refresh(sessionId: SessionId): Promise<void>;
    ensureReady(sessionId: SessionId, signal: AbortSignal): Promise<readonly CommandDescriptor[]>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `constructor` | `constructor(fetchCommands: FetchCommands);` |
| `status` | `status(sessionId: SessionId): DirectoryStatus;` |
| `resolve` | `resolve(sessionId: SessionId, name: string): CommandDescriptor \| undefined;` |
| `invalidateAll` | `invalidateAll(): void;` |
| `resetSession` | `resetSession(sessionId: SessionId): void;` |
| `resetConnected` | `resetConnected(): void;` |
| `warm` | `warm(sessionId: SessionId): void;` |
| `refresh` | `refresh(sessionId: SessionId): Promise<void>;` |
| `ensureReady` | `ensureReady(sessionId: SessionId, signal: AbortSignal): Promise<readonly CommandDescriptor[]>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type DirectoryStatus = 'cold' | 'pending' | 'ready' | 'failed'
```

## DirectoryStatus client

入口 `@deepseek-ai/dsh-client-ui-commands/client`，公开符号 `DirectoryStatus`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type DirectoryStatus = 'cold' | 'pending' | 'ready' | 'failed';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-commands.md#接入-ui-commands) 在真实装载路径检验成功、失败与卸载。
