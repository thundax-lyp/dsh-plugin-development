# Web Client resources

## 适用范围与入口

`dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-client-resources` 根导出是空 Host 插件，`./client` 导出浏览器插件、资源服务与类型。它用于一个 Client 包拥有某类地址的实时数据，而任意 [slot 组件](api-client-slots.md)只拿到 `dsh-resource://<protocol>/…` 地址时。目标 Web Profile 必须装载 `ui-renderer/client`，再装载 resources 和协议提供者的 Client 半边；[Client 模块](api-client-modules.md)决定半边怎样由 Loader 行实际送到页面。`ResourceProtocolMap` 在 `@deepseek-ai/dsh-client-ui-slots` 上 declaration merge，protocol 的值类型由其拥有者声明。

## 契约与运行语义

浏览器 `apply` 提供 `ctx.resources`，并通过 `ctx.slots.provideRoot` 把 `useResource` 注入所有 slot 作用域。提供者通过 `ctx.resources.register({ protocol, open })` 注册一个 protocol。`open(address, { signal })` 返回 `AsyncIterable<RemoteResult<Value>>`：首帧给当前值，后续帧给变化；`ok: false` 帧报告失败并保留旧值。provider 必须响应 `signal` 结束流。stream 内抛错不被 registry 折成失败帧。

以下 Client 提供者把一个固定值发布为 `dsh-resource://note/example`。它演示完整注册与 abort 边界；真实业务内容要从拥有该事实的服务取得，并按 [Client 模块](api-client-modules.md)打包。静态值不代表模型可见的持久事实。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-resources/client'

interface NoteView { text: string }

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface ResourceProtocolMap { note: NoteView }
}

export const inject = ['resources']

export function apply(ctx: Context): void {
  ctx.resources.register<'note'>({
    protocol: 'note',
    async *open(address, { signal }) {
      if (address !== 'dsh-resource://note/example') return
      yield { ok: true, value: { text: 'Ready' } }
      await new Promise<void>(resolve => {
        if (signal.aborted) resolve()
        else signal.addEventListener('abort', () => resolve(), { once: true })
      })
    },
  })
}
```

此切片仅覆盖 provider 本身。独立包还需 Host 根导出、`./client` 导出、lazy-CJS 构建、Loader 行和可消费 `useResource<'note'>` 的 slot 组件；完整组合路径见 [在 Session header 显示 Client 资源](how-to-show-session-header-resource.md)。本次隔离 Web Profile 已验证这类组合的首帧和中止，见下方验证记录；它不替代具体业务 provider 的测试。

## 对象类型与成员

| 类型/成员                 | 公开签名或形状                                                                                                         | 语义与边界                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `ResourceProtocolMap`     | `@deepseek-ai/dsh-client-ui-slots` 空接口，按 protocol 名合并值类型                                                    | 编译期值类型清单；运行期仍须有唯一 provider。                                                     |
| `ResourceStatus`          | `none`、`loading`、`live`、`failed`                                                                                    | 无 provider/非资源地址、等待首帧、最新成功帧、最新失败帧。                                        |
| `ResourceSnapshot<Value>` | `readonly status`、`readonly value: Value \| undefined`、`readonly failure: RemoteFailure \| undefined`                | 失败时保留最近成功值；`failure` 仅 failed 时有值。没有首帧前 value 无值。                         |
| `UseResource`             | `<P extends ResourceProtocol>(address: string) => ResourceSnapshot<ResourceProtocolMap[P]>`                            | 所有 slot 组件的标准 hook；类型参数按 protocol 选择返回值类型，调用本身不验证地址和类型参数相符。 |
| `ResourceProvider<P>`     | `readonly protocol: P`; `open(address, ctx: ResourceOpenContext): AsyncIterable<RemoteResult<ResourceProtocolMap[P]>>` | protocol 对应一个提供者；ctx 只有 `readonly signal: AbortSignal`。                                |
| `Resources.register`      | `<P>(provider: ResourceProvider<P>) => () => void`                                                                     | 重复 protocol 同时注册会抛错；返回幂等 disposer，Cordis effect 归调用者 fiber。                   |
| `Resources.pin`           | `(address: string, signal: AbortSignal) => void`                                                                       | 无订阅也保持流打开；signal 已中止时无动作，中止时释放。                                           |
| `Resources.source`        | `(address: string) => ObservableSnapshot<ResourceSnapshot<unknown>>`                                                   | React 之外读取裸源；`getSnapshot()` 不持有资源，`subscribe(listener)` 才持有并返回退订函数。      |

`ResourceProtocol` 是 `keyof ResourceProtocolMap & string`。地址通过 URL 解析，只有 `dsh-resource:` scheme 且非空 host 识别 protocol；host 比较为小写。其他 scheme（如 `sidebar://`）和无效 URL 以无 provider 的资源处理。protocol 需要 session/workspace 作用域时，由其地址路径编码，资源 registry 不推断当前 Session。

## 生命周期与状态

第一个 hook 订阅或 pin 打开流，其余 holder 共用；最后一个释放时 abort 流并丢弃快照状态。provider 后到时会打开已被持有的同 protocol 地址；provider 卸载时这些流被中止，快照转 `none`。registry 保留每个曾调用 `source()` 的地址记录以稳定引用，故不同地址记录数会随页面期间访问数量增长。资源快照是页面内临时状态，不会自动写进 Session；若数值要成为模型可见事实，必须由业务拥有者另行记录。

## 失败、权限与边界

失败应 yield `{ ok: false, error }`，下一次成功帧会清除 failure。provider 自然结束时保留最后状态；卸载后可能仍 yield 的帧会被丢弃，但忽略 `signal` 的 provider 可能继续做无用工作。重复注册抛错。此层只分发 Client 数据，不替 Host 授权，也不提供地址路径的安全校验；具体 protocol 需自己验证地址并遵守数据端口权限。

## 验证

上游 `resources/tests/apply.client.spec.ts` 核对服务与 hook 装配，资源测试核对订阅/pin、失败和卸载。独立插件的 Host/Client 类型编译和打包通过；隔离 Web Profile 中观察到首帧、离开 Session 时最后 holder 释放导致 abort、返回后的重新打开，以及在线卸载 provider 时再次 abort。后续变化、错误帧、pin 和同 protocol 重复注册仍须单独验证。
