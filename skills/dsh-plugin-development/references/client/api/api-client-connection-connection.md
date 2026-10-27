# connection：connection 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host connection 负责请求 admission、Peer 身份和 transport 交互，浏览器通过 installConnection 安装连接循环并交给指定 hooks/sinks。RPC 失败是结构化通道，连接代际隔离旧响应；断线与恢复需通过状态 source 观察，不从 WebSocket 打开推定 Remote 或 Session 已恢复。

## ConnectionGeneration client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionGeneration`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionGeneration {
    readonly id: number;
    readonly host: ConnectionHostInfo;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `id` | `readonly id: number;` |
| `host` | `readonly host: ConnectionHostInfo;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionHostInfo {

  readonly home: string
}
```

## ConnectionGenerationSource client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionGenerationSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionGenerationSource = (signal: AbortSignal, ready: (host: ConnectionHostInfo) => void) => Promise<void>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionHostInfo {

  readonly home: string
}
```

## ConnectionHostInfo client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionHostInfo`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionHostInfo {
    readonly home: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `home` | `readonly home: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionSinks client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionSinks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionSinks {
    onConnected?: (host: ConnectionHostInfo) => void;
    onStateChange?: (state: ConnectionState) => void;
    onReconnectRequested?: () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `onConnected` | `onConnected?: (host: ConnectionHostInfo) => void;` |
| `onStateChange` | `onStateChange?: (state: ConnectionState) => void;` |
| `onReconnectRequested` | `onReconnectRequested?: () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionHostInfo {

  readonly home: string
}

export type ConnectionState =
  | 'connected'
  | 'disconnected'
  | 'connecting'
```

## ConnectionState client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionState = 'connected' | 'disconnected' | 'connecting';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。
