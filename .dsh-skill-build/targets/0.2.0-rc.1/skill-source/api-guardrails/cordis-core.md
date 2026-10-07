# Cordis 插件、服务与生命周期

## 适用范围与入口

目标版本 `dsh-v0.2.0-rc.1` 的 Host 插件可从 `@deepseek-ai/cordis` 根入口导入 `Context`、`Plugin`、`Service`、`Fiber`、`Inject` 与 `EventOptions`。这里说明插件作者直接编写 Cordis 插件、提供服务和清理资源时需要的基础契约。要让独立包进入 DSH Profile，还须按 [Bundle 与 Profile 装载边界](api-profile-bundle.md)声明 bundle；`ctx.plugin()` 本身不安装包。

`Context` 是代理，服务访问受到注入及隔离范围约束。`ctx` 上的 `plugin`、`inject`、`provide`、`effect` 和事件方法由 registry、reflect、fiber、events 服务混入；它们不是任意对象属性。当前章节只处理 Host 侧基础入口，不把 Client 或 Remote 的装载规则推断为相同。

## 插件声明与依赖

`Plugin<T>` 接受 `(ctx, config) => ...` 函数、带构造函数的类，或有 `apply(ctx, config)` 的对象。`Plugin.Base<T>` 的 `name?` 用于诊断，`Config?` 是同步 Standard Schema 验证器，`inject?` 是服务名数组或“服务名 → intercept 配置”映射，`provide?` 宣告服务名，`intercept?` 宣告插件消费的服务配置。`ctx.plugin(plugin, config)` 返回 `Fiber & PromiseLike<Fiber>`；等待它可获知启动或配置错误。`ctx.inject(deps, callback)` 等价于创建带依赖声明的回调插件，缺少依赖时等待，依赖改变时重新加载。

插件函数可直接在自身 fiber 上注册资源。以下是仅演示 Cordis 基础生命周期的 Host 侧最小模块；`greeting` 是插件自身提供的服务名，类型增量属于插件包。如何打包、安装和验证 Profile，见 [制作并装载工具](how-to-register-model-tool.md)中的独立消费项目，它使用同一类 fiber 所有权。

```ts
import type { Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    greeting: { say(name: string): string }
  }
}

export const name = 'example-greeting'

export function apply(ctx: Context) {
  ctx.provide('greeting', {
    say(name) {
      return `Hello, ${name}!`
    },
  })
}
```

提供者的 fiber 激活后，同一隔离范围的消费者可声明 `inject = ['greeting']` 再访问 `ctx.greeting`。未声明依赖直接读取服务可能抛错。若消费者需要动态可选服务，用 `ctx.inject(['greeting'], callback)` 持有子 fiber；提供者撤销或卸载时，依赖 fiber 会失活并运行其清理。不能把已经关闭的 `ctx` 留给异步回调继续使用。

**对象类型与成员**

| 公开对象与成员                          | 目标版本类型或返回值                                                            | 插件任务中的用途和边界                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Context.plugin`                        | `<P extends Plugin>(plugin: P, ...args) => Fiber & PromiseLike<Fiber>`          | 在当前 scope 启动函数、类或对象插件；配置按插件的 `Config` 同步校验。             |
| `Context.inject`                        | `(deps: Inject, callback: Plugin.Function<void>) => Fiber & PromiseLike<Fiber>` | 依赖具备时启动回调，依赖替换时卸载、重启。                                        |
| `Context.provide`                       | `(name, value) => () => void`                                                   | 当前 fiber 提供服务；同一隔离 scope 的重名服务会报错；返回 disposer 可提前撤销。  |
| `Context.get`                           | `(name, strict?) => value \| undefined`                                         | 显式读取服务；`strict` 要求提供方 fiber 已激活。常规消费者应声明注入。            |
| `Context.set`                           | `(name, value) => void`                                                         | 仅提供方 fiber 可更新自己已提供的服务；未提供或跨 fiber 更新报错。                |
| `Context.isolate`                       | `(name: string, label?: symbol) => Context`                                     | 为单个服务名创建独立 scope；相同 label 可合并 scope。                             |
| `Context.intercept`                     | `(name, config) => Context`                                                     | 为其下插件增加服务特定配置；父 ctx 不变。                                         |
| `Context.extend`                        | `(meta?: {}) => Context`                                                        | 创建继承父 ctx 的子上下文，自己的 meta 覆盖继承字段。                             |
| `Context.effect`                        | 同步或异步 effect，返回可调用 disposer                                          | 立即注册受当前 fiber 管理的资源；取消或卸载时运行清理。                           |
| `Context.on` / `once`                   | `(event, listener, options?) => () => boolean`                                  | 监听当前事件并交由 fiber 清理；`once` 最多执行一次。                              |
| `Context.emit` / `parallel`             | `void` / `Promise<void>`                                                        | 同步广播或并发等待监听器；`parallel` 聚合拒绝。                                   |
| `Context.serial` / `bail` / `waterfall` | 事件声明的返回类型                                                              | 顺序等待首个 bail、同步首个 bail，或用 `next()` 包装后续处理。                    |
| `EventOptions.prepend?` / `global?`     | `boolean` / `boolean`                                                           | 前置插入；或不受上下文过滤限制地接收事件。不要将 `global` 用于私有 scope 的通知。 |
| `Service` constructor                   | `(ctx: Context, name: string)`                                                  | 注册 `ctx.<name>`，由所属 fiber 自动撤销；`Service.invoke` 可使实例可调用。       |
| `Fiber.await` / `dispose` / `restart`   | `Promise<Fiber>` / `Promise<void>` / `Promise<void>`                            | 分别等待稳定状态、清理插件、重启当前配置。                                        |
| `Fiber.update`                          | `(config: any, noSave?: boolean) => void`                                       | 验证并请求更新；实际重启经过 `internal/update` waterfall，不能把返回当成已完成。  |
| `Fiber.state` / `config` / `getEffects` | `FiberState` / 已验证配置 / `EffectMeta[]`                                      | 诊断当前运行状态和 effect 树，不是持久业务状态。                                  |

`Inject` 的数组形式只声明服务名；对象形式可给每个服务传入 intercept 配置。`Plugin.Base.Config` 的 `~standard.validate` 若异步返回，目标运行时抛 `TypeError`；若返回 issues，抛 `ValidationError`，插件函数不会启动。`FiberState` 有 `PENDING`、`LOADING`、`ACTIVE`、`FAILED`、`UNLOADING`、`DISPOSED`；等待 `Fiber` 完成启动检查，不能只凭 `plugin()` 已返回断言激活。

`Context.events` 持有事件分发器，`Context.registry` 管理插件与服务，`Context.reflect` 承载提供/读取与 fiber 元信息，`Context.logger` 产生当前上下文的日志入口。普通插件优先调用上表 `ctx.on`、`ctx.provide`、`ctx.plugin` 等受 fiber 管理的方法；直接操作这些底层服务时仍须遵守注入、scope 和卸载所有权。

## 生命周期与失败边界

`ctx.effect(execute, label?)` 立即执行，收集它产生的 disposer；嵌套 disposer 按逆序执行。提前调用返回的 disposer 是单次操作，fiber 卸载也会清理；异步清理须等待 Promise 沉静。已经卸载或正在卸载的 fiber 上创建 effect 会抛 `CordisError('INACTIVE_EFFECT')`。由 effect 返回无效清理形状也会失败。事件监听、服务提供和子插件都依赖 fiber 所有权，插件自身创建的额外网络请求、计时器与进程仍需在 effect 中关闭。

`Service` 构造器通过 `ctx.reflect.provide()` 注册服务。`ctx.provide()` 的可见性与当前 isolation label 相关；依赖服务失活时消费者卸载，再可用时重启。`Fiber.update()` 先解析配置，再经过可被扩展的更新链；未激活的 fiber 延后配置解析。Profile 的配置持久性属于 Profile/bundle 层，fiber 对象、监听器和 effect 是进程内暂态资源。插件需要跨重启业务事实时，必须另用该任务所属的持久接口。

## 验证

目标源码的 `vendor/cordis/package.json` 暴露根入口，`src/context.ts`、`registry.ts`、`service.ts`、`reflect.ts`、`fiber.ts`、`events.ts` 定义上述契约；生成的 `docs/cordis-api/` 是查找线索，结论以源码为准。目标 checkout 的内建调用方证实 `ctx.effect`、`Service` 和 `ctx.inject` 被组合使用。当前创建任务只在隔离 Profile 中实际验证了工具插件的 fiber 装载和撤销；上面的 `greeting` 独立包、事件派发方式、配置更新和服务重启行为还未做消费项目验证，不能据此声称端到端通过。
