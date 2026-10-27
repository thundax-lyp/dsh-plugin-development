# connection：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host connection 负责请求 admission、Peer 身份和 transport 交互，浏览器通过 installConnection 安装连接循环并交给指定 hooks/sinks。RPC 失败是结构化通道，连接代际隔离旧响应；断线与恢复需通过状态 source 观察，不从 WebSocket 打开推定 Remote 或 Session 已恢复。

## ClientTransportHooks client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ClientTransportHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientTransportHooks {
    rpc?: ClientConnectionRpc;
    fetch?: RpcFetch;
    openStream?: RpcStreamOpen;
    loadBundle?(url: string): Promise<void>;
    ownsHost?: boolean;
    createWebSocket?: ConnectionWebSocketFactory;
    streamBaseUrl?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rpc` | `rpc?: ClientConnectionRpc;` |
| `fetch` | `fetch?: RpcFetch;` |
| `openStream` | `openStream?: RpcStreamOpen;` |
| `loadBundle` | `loadBundle?(url: string): Promise<void>;` |
| `ownsHost` | `ownsHost?: boolean;` |
| `createWebSocket` | `createWebSocket?: ConnectionWebSocketFactory;` |
| `streamBaseUrl` | `streamBaseUrl?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionGenerationState client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionGenerationState`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionGenerationState {
    getSnapshot(): ConnectionGeneration | undefined;
    subscribe(listener: () => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `getSnapshot(): ConnectionGeneration \| undefined;` |
| `subscribe` | `subscribe(listener: () => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionHandle client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionHandle`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionHandle {
    readonly interactions: ConnectionInteractions;
    readonly isLoopback: boolean;
    readonly generation: ConnectionGenerationState;
    readonly state: ConnectionStateSource;
    readonly rpc: ClientConnectionRpc;
    openWebSocket(path: string): ConnectionWebSocket;
    reconnect(): void;
    registerGenerationSource(source: ConnectionGenerationSource): () => void;
    start(sinks: ConnectionSinks, config?: ConnectionRecoveryConfig): ConnectionLoop;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `interactions` | `readonly interactions: ConnectionInteractions;` |
| `isLoopback` | `readonly isLoopback: boolean;` |
| `generation` | `readonly generation: ConnectionGenerationState;` |
| `state` | `readonly state: ConnectionStateSource;` |
| `rpc` | `readonly rpc: ClientConnectionRpc;` |
| `openWebSocket` | `openWebSocket(path: string): ConnectionWebSocket;` |
| `reconnect` | `reconnect(): void;` |
| `registerGenerationSource` | `registerGenerationSource(source: ConnectionGenerationSource): () => void;` |
| `start` | `start(sinks: ConnectionSinks, config?: ConnectionRecoveryConfig): ConnectionLoop;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionGenerationState {

  getSnapshot(): ConnectionGeneration | undefined

  subscribe(listener: () => void): () => void
}

export interface ConnectionStateSource {

  getSnapshot(): ConnectionState | undefined

  subscribe(listener: () => void): () => void
}

export interface ConnectionLoop {

  stop(): void
}
```

## ConnectionInstallOptions client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionInstallOptions`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionInstallOptions {
    readonly interactions?: ConnectionInteractions;
    readonly transport?: ClientTransportHooks;
    readonly recovery?: ConnectionRecoveryConfig;
    readonly location?: ConnectionLocation;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `interactions` | `readonly interactions?: ConnectionInteractions;` |
| `transport` | `readonly transport?: ClientTransportHooks;` |
| `recovery` | `readonly recovery?: ConnectionRecoveryConfig;` |
| `location` | `readonly location?: ConnectionLocation;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientTransportHooks {

  rpc?: ClientConnectionRpc

  fetch?: RpcFetch

  openStream?: RpcStreamOpen

  loadBundle?(url: string): Promise<void>

  ownsHost?: boolean

  createWebSocket?: ConnectionWebSocketFactory

  streamBaseUrl?: string
}

export interface ConnectionLocation {
  readonly hostname: string
}
```

## ConnectionLocation client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionLocation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionLocation {
    readonly hostname: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hostname` | `readonly hostname: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionLoop client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionLoop`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionLoop {
    stop(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `stop` | `stop(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionStateSource client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionStateSource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionStateSource {
    getSnapshot(): ConnectionState | undefined;
    subscribe(listener: () => void): () => void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `getSnapshot` | `getSnapshot(): ConnectionState \| undefined;` |
| `subscribe` | `subscribe(listener: () => void): () => void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ContentBlock client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ContentBlock`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [ContentBlock 权威契约](../../host/api/api-capabilities-dsh-llm-types.md#contentblock)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## MessageId client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `MessageId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [MessageId 权威契约](../../host/api/api-capabilities-dsh-llm-brand.md#messageid)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## SessionEvent client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `SessionEvent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SessionEvent 权威契约](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `data` | `data: SessionEventMap[K];` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `ignorable` | `ignorable?: true;` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `seq` | `seq: SessionSeq;` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `sourceEventSeqs` | `sourceEventSeqs?: never;` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `sourceEventSeqs` | `sourceEventSeqs?: SessionSeq[];` | [SurfaceIntent 权威声明](../../infra/api/api-core-dsh-session-root-5.md#surfaceintent-公开契约) |
| `sourceEventSeqs` | `sourceEventSeqs?: never;` | [SurfaceIntent 权威声明](../../infra/api/api-core-dsh-session-root-5.md#surfaceintent-公开契约) |
| `surfaceOp` | `surfaceOp?: never;` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `surfaceOp` | `surfaceOp: SurfaceOp;` | [SurfaceIntent 权威声明](../../infra/api/api-core-dsh-session-root-5.md#surfaceintent-公开契约) |
| `time` | `time: number;` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |
| `type` | `type: K;` | [SessionEvent 权威声明](../../infra/api/api-core-dsh-session-root-3.md#sessionevent-公开契约) |

## SessionId client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `SessionId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [SessionId 权威契约](../../infra/api/api-core-dsh-session-root-3.md#sessionid-公开契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## StreamChunk client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `StreamChunk`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [StreamChunk 权威契约](../../host/api/api-capabilities-dsh-llm-types.md#streamchunk)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## installConnection client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `installConnection`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function installConnection(ctx: Context, options?: ConnectionInstallOptions): void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionInstallOptions {

  readonly interactions?: ConnectionInteractions

  readonly transport?: ClientTransportHooks

  readonly recovery?: ConnectionRecoveryConfig

  readonly location?: ConnectionLocation
}

export interface ClientTransportHooks {

  rpc?: ClientConnectionRpc

  fetch?: RpcFetch

  openStream?: RpcStreamOpen

  loadBundle?(url: string): Promise<void>

  ownsHost?: boolean

  createWebSocket?: ConnectionWebSocketFactory

  streamBaseUrl?: string
}

export interface ConnectionLocation {
  readonly hostname: string
}
```

## Config root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `Config`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare const Config: z<ConnectionConfig>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionConfig {

  recovery?: ConnectionRecoveryConfig

  trustedHosts?: string[]

  cookieMaxAgeDays?: number

  maxRequestBodyBytes?: number
}
```

## ConnectionConfig root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionConfig`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionConfig {
    recovery?: ConnectionRecoveryConfig;
    trustedHosts?: string[];
    cookieMaxAgeDays?: number;
    maxRequestBodyBytes?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `recovery` | `recovery?: ConnectionRecoveryConfig;` |
| `trustedHosts` | `trustedHosts?: string[];` |
| `cookieMaxAgeDays` | `cookieMaxAgeDays?: number;` |
| `maxRequestBodyBytes` | `maxRequestBodyBytes?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## PeerId root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `PeerId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PeerId 权威契约](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerid-公开契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## PeerScope root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `PeerScope`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [PeerScope 权威契约](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerscope-公开契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `ctx` | `readonly ctx: Context;` | [PeerScope 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerscope-公开契约) |
| `id` | `readonly id: PeerId;` | [PeerScope 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerscope-公开契约) |
| `interactions` | `readonly interactions: 'answer' \| 'none';` | [PeerScope 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerscope-公开契约) |
| `principal` | `readonly principal: Principal;` | [PeerScope 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerscope-公开契约) |
| `signal` | `readonly signal: AbortSignal;` | [PeerScope 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-1.md#peerscope-公开契约) |

## Principal root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `Principal`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [Principal 权威契约](../../infra/api/api-core-dsh-typert-protocol-root-1.md#principal-公开契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `kind` | `readonly kind: 'owner';` | [PrincipalMap 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-1.md#principalmap-公开契约) |

## RemoteInvocation root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `RemoteInvocation`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

此入口是重导出，完整泛型、成员与调用契约见 [RemoteInvocation 权威契约](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约)；本入口不另定义类型。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。



继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `peer` | `readonly peer: PeerScope;` | [RemoteInvocation 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约) |
| `request` | `readonly request: { readonly namespace: string; readonly method: string; readonly args: Readonly<Record<string, unknown>>; };` | [RemoteInvocation 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约) |
| `service` | `readonly service: string;` | [RemoteInvocation 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约) |
| `signal` | `readonly signal: AbortSignal;` | [RemoteInvocation 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约) |
| `uplink` | `uplink<In = unknown>(): AsyncIterable<In>;` | [RemoteInvocation 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约) |
| `uplinkWindow` | `readonly uplinkWindow?: RemoteUplinkWindow \| undefined;` | [RemoteInvocation 权威声明](../../infra/api/api-core-dsh-typert-protocol-root-3.md#remoteinvocation-公开契约) |
