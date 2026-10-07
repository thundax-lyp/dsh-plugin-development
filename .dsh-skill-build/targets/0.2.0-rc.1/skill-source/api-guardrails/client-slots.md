# Web Client Slots

## 适用范围与入口

为 Web Client 已声明的显示位置加入 React 内容时，使用 `@deepseek-ai/dsh-client-ui-slots` 的类型和 `@deepseek-ai/dsh-client-ui-renderer/client` 提供的 `ctx.slots`。本页适用于 `dsh-v0.2.0-rc.1`。前者的根导出是纯类型/注册核心，后者的 `./client` 导出在浏览器 Cordis 树中安装 `SlotRegistry`。普通消费包须按 [Client 模块](api-client-modules.md)构建并由启用的 Loader 行装载其 `./client` 半边；仅在 Host 挂插件不会显示 UI。

目标 slot 的 `SlotMap` 声明须通过其拥有者的 `./client` 类型导入。运行时必须有拥有者的组件声明该 slot；插件通过 `ctx.slots.inject(key, callback)` 等待该声明，再注册自己的内容。一个组件只能从 props 接收 owner 数据、标准 hook、私有注入值和获授权的子 slot 渲染器，不接收 Cordis `ctx`。资源地址驱动的数据见 [Client resources](api-client-resources.md)；两者组合的装载和清理步骤见 [在 Session header 显示 Client 资源](how-to-show-session-header-resource.md)。

## 契约与运行语义

`SlotMap` 的每个键由拥有者声明 `kind` (`single | list | keyed | chain`) 和 `scope` (`root | session-maybe | session`)，还可声明 `owner`、`keyProps`、`hookContext`、slot 级 `inject`。一个运行中的父注册在 `children` 中声明子 slot，且只有该父组件的 `renderSlot` 或 `renderSlotChain` 可渲染它。`root` 是核心预置声明。未声明的目标、重复子声明、同一 cell 同优先级的重复注册在装载时抛错。

`ctx.slots.register(options, component)` 返回幂等 disposer；renderer 服务把注册放进调用者的 Cordis effect，因此调用者 fiber 卸载会移除贡献并递归撤销其子声明。`ctx.slots.inject(key, callback)` 也归调用者 fiber 所有：目标声明已存在则同步执行；尚不存在则等到声明出现；声明撤销时执行 callback 的 disposer，重新声明时重新执行。callback 必须同步返回 disposer 或 disposer 迭代器。已声明时的 callback 错误同步抛出；延迟声明时的错误会停止等待并在微任务抛出，不自动重试。

下面的 Client 文件向已发布的 Conversation header list 加一项。`useSession` 来自 session 作用域标准 props。Web Profile 必须同时激活 renderer、session、conversation 和这个包的 Client 半边。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

function ReviewAction({ useSession }: PropsRuntime<'conversation.session.header.actions'>) {
  const running = useSession(snapshot => snapshot.running)
  return <button type="button" disabled={running}>Review</button>
}

export const inject = ['slots']

export function apply(ctx: Context): void {
  ctx.slots.inject('conversation.session.header.actions', () =>
    ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'example-review',
      order: 100,
    }, ReviewAction))
}
```

此按钮只显示状态；若点击要改变业务事实，必须调用拥有该操作的服务，并将模型可见事实写进 Session；不能把 slot 本地状态当成持久记录。独立包的 package 导出、lazy-CJS 构建及 Profile 装载见 [构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)。

## 对象类型与成员

| 对象/成员                                                                  | 公开类型与位置                                                                                                  | 插件任务中的语义                                                                                                                                                          |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SlotMap[K]`                                                               | `@deepseek-ai/dsh-client-ui-slots`；`kind`, `scope` 必填；`owner?`, `keyProps?`, `hookContext?`, `inject?` 可选 | 类型合并的编译期声明；运行声明由父 `children` 提供。`owner` 是父 `renderSlot` 的本次输入，不是服务。                                                                      |
| `SlotRegistry.register`                                                    | `@deepseek-ai/dsh-client-ui-renderer/client` 的 `ctx.slots`，返回 `() => void`                                  | `name` 必填；按 kind 提供 `id`、`key`、`select` 等；`chain` selector 返回 matched 或 null。                                                                               |
| `SlotRegistry.inject`                                                      | `inject(key, callback): () => void`；callback 返回 disposer 或其 Iterable                                       | 在目标声明生命周期中安装贡献，并将等待和活跃贡献归调用者 fiber。                                                                                                          |
| `SlotRegistry.registerFactory`                                             | `(options, component) => disposer`；定义对照 `SlotFactoryMap`                                                   | 注册可复用 Factory 组件；每个渲染 occurrence 可获得独立 store handle，定义归调用者 fiber。                                                                                |
| `SlotRegistry.provideRoot`                                                 | `(contribution) => disposer`                                                                                    | 向 root 标准来源贡献唯一 hook 名和稳定 props；冲突时回滚，卸载时撤销并重建 binding。                                                                                      |
| `SlotRegistry.spec`, `entries`, `entriesOfSlot`                            | 声明查询、原始 entry 列表、每个 cell 当前胜出的 entry 列表                                                      | 只读检查当前组合；`entriesOfSlot` 每次返回新数组，不能直接当 React 快照源。                                                                                               |
| `SlotRegistry.snapshot`                                                    | `(root?) => LiveCompositionNode[]`                                                                              | 导出 JSON 安全声明树供诊断；不携带业务数据或持久 Session 事实。                                                                                                           |
| `SlotRegistry.subscribe`, `getVersion`                                     | 按 key 订阅变化并读取版本号                                                                                     | 用于自建观察器的订阅/快照配对；订阅返回函数须由插件 fiber 释放。                                                                                                          |
| `SlotRegistry.onEntryError`                                                | `(key, registration, error, {abdicated}) => void` 的订阅，返回 unsubscribe                                      | 观察普通 entry 或 Factory occurrence 崩溃；手动把退订函数纳入 `ctx.effect`。                                                                                              |
| `PropsRuntime<K>`                                                          | `@deepseek-ai/dsh-client-ui-slots`                                                                              | 目标 slot 的 owner/share、scope 标准 props 与 slot 级 inject；组件不要手抄签名。                                                                                          |
| `PropsRenderSlots<S>`                                                      | 同上                                                                                                            | 只有注册的 `children` 键可通过 `renderSlot` 调度；chain 子键用 `renderSlotChain`，其 `fallback` 在所有 selector 拒绝时显示。声明 session 子键时还提供 `SessionProvider`。 |
| `GlobalStandardProps`, `SessionStandardProps`, `SessionMaybeStandardProps` | 同上，其他 Client 包 declaration merge                                                                          | 根作用域都有全局 hook；严格 session 作用域提供确定的 session 值；可选 session 作用域在无绑定时返回可选值。具体 hook 取决于所装配的适配包。                                |

`single` 只显示当前优先级最低的贡献。`list` 按优先级、`order` 和注册顺序排列，不同 `id` 是普通追加路径；同 `id` 不同优先级是替换关系。`keyed` 按 owner 给的 `entryKey` 选 cell。`chain` 按优先级依次运行纯 selector，第一个非 `null` 值成为该组件的 `matched`。默认优先级和默认 `order` 均为 `0`；同一 cell 的同优先级冲突会抛错。

`register` 的 `name` 必填；各注册可按需提供 `children?`、`store?`、`inject?`、`locale?`。`single` 可给 `priority?`；`list` 必须有 `id`，可给 `order?`、`label?`、`priority?`；`keyed` 必须有 `key`，可给 `priority?`；`chain` 必须给纯函数 `select(owner)`，返回匹配值或 `null`，可给 `priority?`。

`SlotRegistry.install`、`installLocale`、`installScope`、`bindStoreScope` 是 shell/locale/session 适配包的启动和代际绑定操作；普通内容插件不应重装它们。服务级 `renderSlot` 只允许 shell 渲染 `root`，子 slot 必须通过组件 props 的 `renderSlot` 调度。

## 生命周期与状态

父 entry 的 disposer 递归撤销子 slot 及其贡献；插件的 `inject` 订阅会在父重新声明时重新安装。组件可通过注册 `inject` 闭包拿回调和可观测源；`hooks` 保留给 `getSnapshot`/`subscribe`，renderer 把它们变成选择器 hook。共享 view 状态可由声明的 store 承担；业务与模型事实应留在拥有它们的 Cordis 服务和 Session 日志。Session 绑定代际变化时，严格 session entry 会重挂；不能把组件局部状态当恢复事实。

## 失败、权限与边界

slot 注册不授予 Host 权限或模型工具权限。缺少实际 Client 模块、renderer、目标父声明或服务注入，类型编译通过也不会出现组件。重用已经占据的 `single` 或 keyed cell 是有意替换，应先核对当前目标 Profile；普通追加选 list 的新 `id`。renderer 的组件崩溃监督和定义冲突不等同于业务错误恢复。

## 验证

在精确 checkout 核对 `ui-slots` 类型、`ui-renderer/client` 的服务和目标 slot 声明；在独立包分别编译 Host 与 Client。隔离 Web Profile smoke 实际观察到 header list 的 `Ready` 内容、Session 页面离开后移除、返回后重新出现，以及在线移除插件后的消失。该 smoke 没有覆盖此处按钮示例的点击、session running 状态更新或父 entry 单独卸载后重建，使用时仍应按目标组件补测。
