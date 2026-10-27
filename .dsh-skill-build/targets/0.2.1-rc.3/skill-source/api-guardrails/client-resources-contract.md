# resources：contract 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

ctx.resources 通过协议注册 ResourceProvider，source(address) 返回可订阅快照，pin 用 AbortSignal 管理引用。useResource 是 renderer 注入的全局标准 hook，不由组件自行手写跨实例订阅。资源地址与读取行为须由协议 provider 明确，不把地址字符串当成文件访问权限。

## ResourceOpenContext client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `ResourceOpenContext`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ResourceOpenContext {
    readonly signal: AbortSignal;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `signal` | `readonly signal: AbortSignal;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。

## ResourceProtocol client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `ResourceProtocol`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ResourceProtocol = Extract<keyof ResourceProtocolMap, string>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。

## ResourceProvider client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `ResourceProvider`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ResourceProvider<P extends ResourceProtocol> {
    readonly protocol: P;
    open(address: string, ctx: ResourceOpenContext): AsyncIterable<RemoteResult<ResourceProtocolMap[P]>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `protocol` | `readonly protocol: P;` |
| `open` | `open(address: string, ctx: ResourceOpenContext): AsyncIterable<RemoteResult<ResourceProtocolMap[P]>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ResourceProtocol = Extract<keyof ResourceProtocolMap, string>

export interface ResourceOpenContext {

  readonly signal: AbortSignal
}
```

## ResourceSnapshot client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `ResourceSnapshot`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ResourceSnapshot<Value> {
    readonly status: ResourceStatus;
    readonly value: Value | undefined;
    readonly failure: RemoteFailure | undefined;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `status` | `readonly status: ResourceStatus;` |
| `value` | `readonly value: Value \| undefined;` |
| `failure` | `readonly failure: RemoteFailure \| undefined;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ResourceStatus = 'none' | 'loading' | 'live' | 'failed'
```

## ResourceStatus client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `ResourceStatus`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ResourceStatus = 'none' | 'loading' | 'live' | 'failed';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。

## Resources client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `Resources`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface Resources {
    register<P extends ResourceProtocol>(provider: ResourceProvider<P>): () => void;
    pin(address: string, signal: AbortSignal): void;
    source(address: string): ObservableSnapshot<ResourceSnapshot<unknown>>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `register` | `register<P extends ResourceProtocol>(provider: ResourceProvider<P>): () => void;` |
| `pin` | `pin(address: string, signal: AbortSignal): void;` |
| `source` | `source(address: string): ObservableSnapshot<ResourceSnapshot<unknown>>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type ResourceProtocol = Extract<keyof ResourceProtocolMap, string>

export interface ResourceSnapshot<Value> {
  readonly status: ResourceStatus

  readonly value: Value | undefined

  readonly failure: RemoteFailure | undefined
}

export interface ResourceProvider<P extends ResourceProtocol> {

  readonly protocol: P

  open(address: string, ctx: ResourceOpenContext): AsyncIterable<RemoteResult<ResourceProtocolMap[P]>>
}

export type ResourceStatus = 'none' | 'loading' | 'live' | 'failed'

export interface ResourceOpenContext {

  readonly signal: AbortSignal
}
```

## UseResource client

入口 `@deepseek-ai/dsh-client-resources/client`，公开符号 `UseResource`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type UseResource = <P extends ResourceProtocol>(address: string) => ResourceSnapshot<ResourceProtocolMap[P]>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-resources.md#接入-resources) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type ResourceProtocol = Extract<keyof ResourceProtocolMap, string>

export interface ResourceSnapshot<Value> {
  readonly status: ResourceStatus

  readonly value: Value | undefined

  readonly failure: RemoteFailure | undefined
}

export type ResourceStatus = 'none' | 'loading' | 'live' | 'failed'
```
