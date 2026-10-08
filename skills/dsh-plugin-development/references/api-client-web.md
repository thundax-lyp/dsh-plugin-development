# Client、Web、Remote 与 UI 扩展契约

## 适用范围与入口

本页用于给插件增加浏览器半边、向现有 Web slot 注入界面、维护浏览器侧共享视图状态、调用 Host Remote，或公开可实时编辑的 Config。目标版本固定为 `0.2.0-rc.2`。

核心入口是：

- Client 装载：插件包根入口加公开 `./client` 导出，以及 `package.json` 的 `dsh.client` 声明；
- UI 组合：`@deepseek-ai/dsh-client-ui-slots` 与目标 slot owner 的 `./client` 类型声明；
- 共享视图状态：`@deepseek-ai/dsh-client-store`；
- Host/Client RPC：`TypertRemoteService`、`@Remote`、生成的 `./typert`/`./remote` 与 `@deepseek-ai/dsh-api-remotes/client`；
- 配置表单：Host 的 `Config`/`Volatile<T>` 与 Client 的 `ctx.configForms`。

`apps/web`、`@deepseek-ai/dsh-web-frontend`、`@deepseek-ai/dsh-client-web` 是产品 shell 或启动基础设施，不是插件作者应直接扩展的 API。内置 `ui-*` 包的组件实现也不是共享组件库；跨包界面通过 slot，行为通过 Cordis service，声明只用 `import type`。

## Client 包与装载契约

一个动态 Client 插件包至少有普通 Host 入口和 `./client` 浏览器入口。`dsh.client.platform` 必须是 `web`。Web Profile 必须用包根 specifier 挂载该 Loader row 并安装该包依赖；挂载子路径不会替包根 row 携带 Client half。

`dsh.client.inject` 是包名信息边，不控制 Cordis 激活顺序；Cordis 的 `inject` 才等待 service。`dsh.client.external` 也不是 feature 依赖机制，只用于基础设施、传输或生成 assembly 的共享模块身份。普通 feature 不运行时导入另一个 feature 的值。

浏览器产物必须是 Client module system 接受的单文件 lazy-CJS factory。目标仓库的 `clientBundle` preset 没有作为公开包发布，因此独立消费包必须自行提供兼容构建器；仅把 TypeScript 源码列为 `./client` 不可装载。每次改浏览器半边都应至少验证：Client 声明编译、产物格式、Profile bare-row 装载、模块 materialization、Cordis fiber 激活与卸载。

## Slot 对象与成员

### `SlotMap`、`SlotEntryDef` 与注册

`SlotMap` 通过 declaration merging 定义 key。每项 `SlotEntryDef` 必须给出 `kind: 'single' | 'list' | 'keyed' | 'chain'` 和 `scope: 'root' | 'session-maybe' | 'session'`，可选 `owner`、`keyProps`、`hookContext`、`inject`。

插件调用 `ctx.slots.register(options, Component)`，返回幂等 disposer。常用 options：

| 成员           | 约束                                                                |
| -------------- | ------------------------------------------------------------------- |
| `name`         | 目标 `SlotMap` key；目标必须已由 owner 声明                         |
| `id` / `order` | `list` 使用；同 id 由 priority 选胜者                               |
| `key`          | `keyed` 使用，必须属于声明的 key 集                                 |
| `select`       | `chain` 必需，纯函数返回 matched 值或 `null`                        |
| `priority`     | 数值越小越先；相同 cell 和相同 priority 冲突                        |
| `children`     | 同时声明 child slot 并授权本 Component 渲染                         |
| `store`        | store handle 或 factory；由 renderer 按 scope 创建/缓存             |
| `inject`       | 在 apply 世界闭包 service，只返回数据、回调和 `hooks` 裸 observable |
| `locale`       | 已声明的 locale namespace，由框架注入类型化 `t`                     |

跨包向别人的 slot 注册时用 `ctx.slots.inject(key, () => ctx.slots.register(...))`。它等待 declaration，owner collapse 时撤销 contribution，重新声明后再注册；返回值归调用插件 effect 所有。不要裸 `register` 猜测装载顺序。

Component props 从 `PropsRuntime<K>`、`PropsRenderSlots<S>`、`PropsRenderFactories`、`PropsStore<H>`、`InjectFace<I>`、`PropsLocale<N>` 组合。Component 不接收 `ctx`，不自行订阅 service，也不手写框架 hook props。

### Store

`defineStore({ init, actions, persist? })` 返回 store handle。`init` 每实例产生新状态；actions 是全部写入口。Component 通过 `props.useStore(selector)` 读取、`props.actions.*` 写入。`persist` 是浏览器 `localStorage` JSON，不是 Session 日志或 Host 持久化；同一持久 key 的多个 live instance 会互相污染，生产由 renderer 的 handle × scope 缓存避免。

`createSnapshotStore(init, { flush?, persist? })` 是 React-free observable。snapshot 在变化前保持引用稳定；`flush: 'raf'` 合并一帧通知，但帧中途新挂载者可能先读到新值。外部事实必须由同一个 source 发布，不能在 Component 中镜像成第二份状态。

## Remote 对象与成员

Host owner 继承 `TypertRemoteService`，构造时绑定 service key 与 namespace，并以 `@Remote(name?)` 暴露 wire 方法。Agent/Session lookup 只能是顶层参数；支持取消的方法以 `AbortSignal` 作为最后参数。业务签名不适配 wire 时写 `remoteExport*` adapter，保留业务方法原名。

失败用 `RemoteError(code, message, details, { cause? })`；领域 package declaration-merge `RemoteErrorDetailsMap`。Client 调用返回 `RemoteResult<T>`：先判 `ok`，再按 `error.code` 收窄 `details`。Remote 业务失败不是 Promise rejection；本地 assembly 缺陷应继续抛出。取消返回 `gateway/cancelled` failure。

Client 注入 `remote` 和 `remote.<namespace>`，直接调用 `ctx.remote.<namespace>.<method>()`。`ctx.remote.$host.home` 在首个 ready frame 前可能是 `undefined`，`isLoopback` 在页面生命周期固定；二者没有订阅。重连后依赖 `connection/reset` 或领域事件重读。普通 forwarded event 不重放，持久 UI 必须从 snapshot/query/cursor 恢复。

生成的 `./typert` 和 `./remote` 不手写。修改签名、namespace、failure code 或 export 后必须先运行目标仓库生成/构建，再分别编译 Host 与 Client。

## Settings 对象与成员

Host `Config` 中需要在线编辑的字段声明为 `Volatile<T>`，schema 节点调用 `.volatile()`；执行一次操作前调用 `.get()` 捕获一致快照。跨字段约束放在 Config schema `.check()`，Host 在持久化前验证。

`ctx.configForms.get<T>(entryId)` 返回共享 `ConfigForm<T>`：

- `getSnapshot()`：稳定引用，含 `status`、`value`、`base`、`user`、`revision`、`writable`、`mode`；
- `subscribe(listener)`：返回 disposer；
- `set(field, value)`：串行写一个顶层字段；
- `unset(field)`：删除 override，恢复继承值；
- `mutate(ops, expectedRevision?)`：同一 revision fence 下原子提交多项 path operation。

`mutate` 返回 Host 是否接受；transport failure 才 reject。staged editor 必须传开始编辑时读到的 revision；冲突保留 draft，并以最新 Host snapshot 恢复。非 loopback Web 为 `memory` 模式，普通 form 写入返回 false，不跨页面持久化。

为另一个插件的 namespace 提供页面时，调用 `ctx.configForms.whileServed(namespaces, register)` 并把返回 disposer 纳入 `ctx.effect`；这样 Host 未组合 owner 时页面不存在，owner 消失时页面同步撤销。

## 生命周期、失败与验证

所有 `register`、`inject`、Remote mount、事件订阅和 form watch 都由创建它们的 Cordis fiber 回收；显式 disposer 仍应进入 `ctx.effect`。卸载验证至少确认 slot entry 消失、store subscriber 停止、Remote contribution 不能继续调用、重连能从 owner snapshot 恢复，而不是只确认 React DOM 被移除。

静态编译只证明签名和两侧依赖面；module verifier 只证明 artifact graph 可 materialize；Profile smoke 才证明 Loader row、Client factory、Cordis service 和 slot owner 同时存在；浏览器观察才证明用户可见结果。独立消费项目、真实 Profile 与浏览器 smoke 应分别验证依赖解析、装载和用户可见结果。
