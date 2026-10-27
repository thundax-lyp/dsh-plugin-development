# connection：rpc 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host connection 负责请求 admission、Peer 身份和 transport 交互，浏览器通过 installConnection 安装连接循环并交给指定 hooks/sinks。RPC 失败是结构化通道，连接代际隔离旧响应；断线与恢复需通过状态 source 观察，不从 WebSocket 打开推定 Remote 或 Session 已恢复。

## ClientConnectionRpc client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ClientConnectionRpc`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientConnectionRpc {
    call(channel: string, endpoint: string, payload: unknown, signal?: AbortSignal): Promise<ConnectionRpcResult<unknown>>;
    readonly open?: (channel: string, endpoint: string, payload: unknown, signal: AbortSignal, uplink?: AsyncIterable<unknown>) => AsyncIterable<unknown>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `call` | `call(channel: string, endpoint: string, payload: unknown, signal?: AbortSignal): Promise<ConnectionRpcResult<unknown>>;` |
| `open` | `readonly open?: (channel: string, endpoint: string, payload: unknown, signal: AbortSignal, uplink?: AsyncIterable<unknown>) => AsyncIterable<unknown>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## ClientRequest client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ClientRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientRequest {
    readonly type: 'client-request';
    readonly rpcId: RpcId;
    readonly method: string;
    readonly payload: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `readonly type: 'client-request';` |
| `rpcId` | `readonly rpcId: RpcId;` |
| `method` | `readonly method: string;` |
| `payload` | `readonly payload: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcId = Branded<'rpc-id'>
```

## ConnectionRpcFailure client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionRpcFailure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionRpcFailure {
    readonly code: string;
    readonly message: string;
    readonly details: object;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `readonly code: string;` |
| `message` | `readonly message: string;` |
| `details` | `readonly details: object;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRpcResult client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionRpcResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRpcResult<T> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: ConnectionRpcFailure;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## RpcFetch client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `RpcFetch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RpcFetch = (input: string | URL, init: RequestInit) => Promise<Response>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## RpcId client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `RpcId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function RpcId(id: string): RpcId;

export type RpcId = Branded<'rpc-id'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## RpcMessage client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `RpcMessage`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RpcMessage = ClientRequest | ServerResponse;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientRequest {
  readonly type: 'client-request'
  readonly rpcId: RpcId
  readonly method: string
  readonly payload: unknown
}

export interface ServerResponse {
  readonly type: 'server-response'
  readonly rpcId: RpcId
  readonly result: ConnectionRpcResult<unknown>
}

export type RpcId = Branded<'rpc-id'>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## RpcRequest client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `RpcRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RpcRequest<P> {
    readonly rpcId: RpcId;
    readonly payload: P;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rpcId` | `readonly rpcId: RpcId;` |
| `payload` | `readonly payload: P;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcId = Branded<'rpc-id'>
```

## RpcResponse client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `RpcResponse`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface RpcResponse<T> {
    readonly rpcId: RpcId;
    readonly result: RpcResult<T>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rpcId` | `readonly rpcId: RpcId;` |
| `result` | `readonly result: RpcResult<T>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcId = Branded<'rpc-id'>

export type RpcResult<T> = ConnectionRpcResult<T>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## RpcResult client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `RpcResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RpcResult<T> = ConnectionRpcResult<T>;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## ServerResponse client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ServerResponse`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ServerResponse {
    readonly type: 'server-response';
    readonly rpcId: RpcId;
    readonly result: ConnectionRpcResult<unknown>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `readonly type: 'server-response';` |
| `rpcId` | `readonly rpcId: RpcId;` |
| `result` | `readonly result: ConnectionRpcResult<unknown>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcId = Branded<'rpc-id'>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## transportError client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `transportError`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function transportError<T>(error: unknown): RpcResult<T>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcResult<T> = ConnectionRpcResult<T>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## ClientRequest root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ClientRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientRequest {
    readonly type: 'client-request';
    readonly rpcId: RpcId;
    readonly method: string;
    readonly payload: unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `readonly type: 'client-request';` |
| `rpcId` | `readonly rpcId: RpcId;` |
| `method` | `readonly method: string;` |
| `payload` | `readonly payload: unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcId = Branded<'rpc-id'>
```

## ConnectionAdmission root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionAdmission`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionAdmission = {
    readonly peer: PeerScope;
    readonly release: () => Promise<void>;
} | {
    readonly rejection: 401 | 403 | 409;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionFetchHandler root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionFetchHandler`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionFetchHandler {
    requestBodyMode(request: {
        readonly method: string;
        readonly url: URL;
    }): ConnectionRequestBodyMode;
    fetch(request: Request, peer: PeerScope): Promise<Response>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `requestBodyMode` | `requestBodyMode(request: { readonly method: string; readonly url: URL; }): ConnectionRequestBodyMode;` |
| `fetch` | `fetch(request: Request, peer: PeerScope): Promise<Response>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConnectionRequestBodyMode = 'buffered' | 'streaming'
```

## ConnectionFetchMethod root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionFetchMethod`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionFetchMethod = 'GET' | 'HEAD' | 'POST';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionFetchRoute root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionFetchRoute`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionFetchRoute {
    readonly path: string;
    readonly methods: readonly ConnectionFetchMethod[];
    readonly requestBody: ConnectionRequestBodyMode;
    readonly fetch: (request: Request) => Promise<Response>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `path` | `readonly path: string;` |
| `methods` | `readonly methods: readonly ConnectionFetchMethod[];` |
| `requestBody` | `readonly requestBody: ConnectionRequestBodyMode;` |
| `fetch` | `readonly fetch: (request: Request) => Promise<Response>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConnectionFetchMethod = 'GET' | 'HEAD' | 'POST'

export type ConnectionRequestBodyMode = 'buffered' | 'streaming'
```

## ConnectionIndexRequest root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionIndexRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionIndexRequest extends ConnectionTrustRequest {
    readonly method?: string | undefined;
    readonly url?: string | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `method` | `readonly method?: string \| undefined;` |
| `url` | `readonly url?: string \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionTrustRequest {

  readonly headers: Headers | Readonly<Record<string, string | readonly string[] | undefined>>
}
```

## ConnectionIndexResponse root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionIndexResponse`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionIndexResponse {
    writeHead(status: number, headers?: Readonly<Record<string, string>>): unknown;
    end(body?: string): unknown;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `writeHead` | `writeHead(status: number, headers?: Readonly<Record<string, string>>): unknown;` |
| `end` | `end(body?: string): unknown;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRequestBodyMode root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRequestBodyMode`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRequestBodyMode = 'buffered' | 'streaming';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRequestRejection root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRequestRejection`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRequestRejection = 401 | 403 | undefined;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRpcAttachment root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRpcAttachment`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionRpcAttachment {
    readonly path: readonly (string | number)[];
    readonly bytes: Uint8Array;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `path` | `readonly path: readonly (string \| number)[];` |
| `bytes` | `readonly bytes: Uint8Array;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRpcEndpointMatcher root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRpcEndpointMatcher`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRpcEndpointMatcher = (endpoint: string) => boolean;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRpcFailure root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRpcFailure`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionRpcFailure {
    readonly code: string;
    readonly message: string;
    readonly details: object;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `code` | `readonly code: string;` |
| `message` | `readonly message: string;` |
| `details` | `readonly details: object;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## ConnectionRpcHandler root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRpcHandler`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRpcHandler = (endpoint: string, payload: unknown, signal: AbortSignal, peer: PeerScope) => Promise<ConnectionRpcHandlerResult>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConnectionRpcHandlerResult =
  | {
    readonly ok: true
    readonly value: unknown

    readonly attachments?: readonly ConnectionRpcAttachment[]
  }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}

export interface ConnectionRpcAttachment {

  readonly path: readonly (string | number)[]

  readonly bytes: Uint8Array
}
```

## ConnectionRpcHandlerResult root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRpcHandlerResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRpcHandlerResult = {
    readonly ok: true;
    readonly value: unknown;
    readonly attachments?: readonly ConnectionRpcAttachment[];
} | {
    readonly ok: false;
    readonly error: ConnectionRpcFailure;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}

export interface ConnectionRpcAttachment {

  readonly path: readonly (string | number)[]

  readonly bytes: Uint8Array
}
```

## ConnectionRpcResult root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionRpcResult`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ConnectionRpcResult<T> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: ConnectionRpcFailure;
};
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## ConnectionTrustRequest root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ConnectionTrustRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionTrustRequest {
    readonly headers: Headers | Readonly<Record<string, string | readonly string[] | undefined>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `headers` | `readonly headers: Headers \| Readonly<Record<string, string \| readonly string[] \| undefined>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## HostConnectionFetch root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `HostConnectionFetch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HostConnectionFetch {
    register(route: ConnectionFetchRoute): () => Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `register` | `register(route: ConnectionFetchRoute): () => Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionFetchRoute {

  readonly path: string

  readonly methods: readonly ConnectionFetchMethod[]

  readonly requestBody: ConnectionRequestBodyMode

  readonly fetch: (request: Request) => Promise<Response>
}

export type ConnectionFetchMethod = 'GET' | 'HEAD' | 'POST'

export type ConnectionRequestBodyMode = 'buffered' | 'streaming'
```

## HostConnectionHandle root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `HostConnectionHandle`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HostConnectionHandle {
    readonly rpc: HostConnectionRpc;
    readonly fetch: HostConnectionFetch;
    readonly browserPeer: PeerScope;
    readonly allowsRemoteAuthorities: boolean;
    createSharedFetchHandler(channel: '/api'): ConnectionFetchHandler;
    requestRejection(request: ConnectionTrustRequest): ConnectionRequestRejection;
    admit(request: ConnectionTrustRequest): PeerAdmission;
    createPeer(options: {
        readonly principal: Principal;
        readonly interactions?: 'answer' | 'none';
    }): PeerScope;
    admitConnection(request: ConnectionTrustRequest): ConnectionAdmission;
    authorizeIndex(request: ConnectionIndexRequest, response: ConnectionIndexResponse): boolean;
    authenticatedUrl(baseUrl: string): string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `rpc` | `readonly rpc: HostConnectionRpc;` |
| `fetch` | `readonly fetch: HostConnectionFetch;` |
| `browserPeer` | `readonly browserPeer: PeerScope;` |
| `allowsRemoteAuthorities` | `readonly allowsRemoteAuthorities: boolean;` |
| `createSharedFetchHandler` | `createSharedFetchHandler(channel: '/api'): ConnectionFetchHandler;` |
| `requestRejection` | `requestRejection(request: ConnectionTrustRequest): ConnectionRequestRejection;` |
| `admit` | `admit(request: ConnectionTrustRequest): PeerAdmission;` |
| `createPeer` | `createPeer(options: { readonly principal: Principal; readonly interactions?: 'answer' \| 'none'; }): PeerScope;` |
| `admitConnection` | `admitConnection(request: ConnectionTrustRequest): ConnectionAdmission;` |
| `authorizeIndex` | `authorizeIndex(request: ConnectionIndexRequest, response: ConnectionIndexResponse): boolean;` |
| `authenticatedUrl` | `authenticatedUrl(baseUrl: string): string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ConnectionTrustRequest {

  readonly headers: Headers | Readonly<Record<string, string | readonly string[] | undefined>>
}

export type ConnectionRequestRejection = 401 | 403 | undefined

export interface ConnectionIndexRequest extends ConnectionTrustRequest {
  readonly method?: string | undefined
  readonly url?: string | undefined
}

export interface ConnectionIndexResponse {
  writeHead(status: number, headers?: Readonly<Record<string, string>>): unknown
  end(body?: string): unknown
}

export type PeerAdmission =
  | { readonly peer: PeerScope }
  | { readonly rejection: 401 | 403 }

export type ConnectionAdmission =
  | {
    readonly peer: PeerScope

    readonly release: () => Promise<void>
  }
  | { readonly rejection: 401 | 403 | 409 }

export interface HostConnectionFetch {

  register(route: ConnectionFetchRoute): () => Promise<void>
}

export interface HostConnectionRpc {

  handle(
    channel: string,
    handler: ConnectionRpcHandler,
  ): () => Promise<void>


  intercept(
    channel: '/api',
    matches: ConnectionRpcEndpointMatcher,
    handler: ConnectionRpcHandler,
  ): () => Promise<void>
}

export interface ConnectionFetchHandler {

  requestBodyMode(request: { readonly method: string; readonly url: URL }): ConnectionRequestBodyMode


  fetch(request: Request, peer: PeerScope): Promise<Response>
}

export type ConnectionRpcHandler = (
  endpoint: string,
  payload: unknown,
  signal: AbortSignal,
  peer: PeerScope,
) => Promise<ConnectionRpcHandlerResult>

export type ConnectionRpcEndpointMatcher = (endpoint: string) => boolean

export type ConnectionRequestBodyMode = 'buffered' | 'streaming'

export interface ConnectionFetchRoute {

  readonly path: string

  readonly methods: readonly ConnectionFetchMethod[]

  readonly requestBody: ConnectionRequestBodyMode

  readonly fetch: (request: Request) => Promise<Response>
}

export type ConnectionRpcHandlerResult =
  | {
    readonly ok: true
    readonly value: unknown

    readonly attachments?: readonly ConnectionRpcAttachment[]
  }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export type ConnectionFetchMethod = 'GET' | 'HEAD' | 'POST'

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}

export interface ConnectionRpcAttachment {

  readonly path: readonly (string | number)[]

  readonly bytes: Uint8Array
}
```

## HostConnectionRpc root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `HostConnectionRpc`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface HostConnectionRpc {
    handle(channel: string, handler: ConnectionRpcHandler): () => Promise<void>;
    intercept(channel: '/api', matches: ConnectionRpcEndpointMatcher, handler: ConnectionRpcHandler): () => Promise<void>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `handle` | `handle(channel: string, handler: ConnectionRpcHandler): () => Promise<void>;` |
| `intercept` | `intercept(channel: '/api', matches: ConnectionRpcEndpointMatcher, handler: ConnectionRpcHandler): () => Promise<void>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ConnectionRpcHandler = (
  endpoint: string,
  payload: unknown,
  signal: AbortSignal,
  peer: PeerScope,
) => Promise<ConnectionRpcHandlerResult>

export type ConnectionRpcEndpointMatcher = (endpoint: string) => boolean

export type ConnectionRpcHandlerResult =
  | {
    readonly ok: true
    readonly value: unknown

    readonly attachments?: readonly ConnectionRpcAttachment[]
  }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}

export interface ConnectionRpcAttachment {

  readonly path: readonly (string | number)[]

  readonly bytes: Uint8Array
}
```

## PeerAdmission root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `PeerAdmission`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type PeerAdmission = {
    readonly peer: PeerScope;
} | {
    readonly rejection: 401 | 403;
};
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## RpcId root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `RpcId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function RpcId(id: string): RpcId;

export type RpcId = Branded<'rpc-id'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

## RpcMessage root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `RpcMessage`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type RpcMessage = ClientRequest | ServerResponse;
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ClientRequest {
  readonly type: 'client-request'
  readonly rpcId: RpcId
  readonly method: string
  readonly payload: unknown
}

export interface ServerResponse {
  readonly type: 'server-response'
  readonly rpcId: RpcId
  readonly result: ConnectionRpcResult<unknown>
}

export type RpcId = Branded<'rpc-id'>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## ServerResponse root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `ServerResponse`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ServerResponse {
    readonly type: 'server-response';
    readonly rpcId: RpcId;
    readonly result: ConnectionRpcResult<unknown>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `type` | `readonly type: 'server-response';` |
| `rpcId` | `readonly rpcId: RpcId;` |
| `result` | `readonly result: ConnectionRpcResult<unknown>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type RpcId = Branded<'rpc-id'>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```

## transportError root

入口 `@deepseek-ai/dsh-client-connection`，公开符号 `transportError`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function transportError<T>(error: unknown): RpcResult<T>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type RpcResult<T> = ConnectionRpcResult<T>

export type ConnectionRpcResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ConnectionRpcFailure }

export interface ConnectionRpcFailure {
  readonly code: string
  readonly message: string
  readonly details: object
}
```
