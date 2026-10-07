# Client snapshot store 与 slot 状态

## 入口与任务

目标为 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-client-store` 根入口是 React-free 状态引擎；插件作者在 Client `apply(ctx)` 中用 `defineStore` 声明一个 slot 的局部显示状态，再把 handle 交给 `ctx.slots.register({ store }, Component)`。完整装载、交互和清理代码见 [给 Session header 增加局部状态](how-to-add-stateful-client-slot.md)。基础注册规则见 [Web Client Slots](api-client-slots.md)。

## 对象类型与成员

| 对象/成员                                                             | 精确语义                                                                                                                                                              |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineStore(spec)`                                                   | `spec.init()` 每个实例生成新状态；`spec.actions` 是全部写入操作，draft 经 Immer 修改；可选 `spec.persist` 是 `localStorage` key 前缀。返回 `EngineStoreHandle<T,A>`。 |
| `StoreSpec.init`, `StoreSpec.actions`, `StoreSpec.persist`            | `init`、`actions` 必填；`persist` 可选。actions 的首参是 draft，组件收到的 actions 已去掉此参。                                                                       |
| `StoreHandle.spec`, `StoreHandle.create(scopeKey?)`                   | handle 的对象身份决定 renderer 实例共享；`create` 是 framework/test 调用，组件和普通注册方不手动创建生产实例。Session scope 的持久 key 加上 scopeKey。                |
| `StoreInstance.getSnapshot`, `subscribe`, `actions`, `clearPersisted` | 实例是裸 observable；`clearPersisted()` 只删当前实例的持久 key，fiber 关闭不会自动调用。                                                                              |
| `PropsStore<H>.useStore`, `.actions`                                  | renderer 从声明的 store seat 合成 React selector hook 与动作。组件用 `useStore(s => ...)` 读取，通过 `actions` 写入，不拿原始 store。                                 |
| `BoundActions<H>`, `BakedActions<T,A>`, `HandleOf<H>`                 | 在注册 `inject` 工厂或自定义 props 类型中恢复已绑定动作类型；factory store 用 `HandleOf` 归一化。                                                                     |
| `StoreDecl`, `StoreFactory`, `StoreHandle`                            | 注册 `store` 可以是共享 handle 或 `() => handle`。共享 handle 在一个插件 `apply` 内创建；factory 使每个 entry × scope 独占实例。                                      |
| `createSnapshotStore(init, opts?)`                                    | 直接返回 `SnapshotStore<T>`；默认同步通知，`flush: 'raf'` 合并一帧的通知。`persist: { name }` 可选。它不生成 React hook。                                             |
| `SnapshotStore.getSnapshot`, `subscribe`, `update`, `set`             | `update` 用 Immer draft；`set` 整体替换；`subscribe` 返回 unsubscribe。                                                                                               |
| `notifySubscribers(listeners,label,...args)`, `shallowEqual(a,b)`     | 分别安全遍历订阅者与比较 selector 浅层值；是辅助函数，没有 Cordis 生命周期。                                                                                          |

`StoreSpec`、`StoreHandle` 等契约由 `packages/client/store/src/contract.ts` 定义，并在根入口重导出；引擎在 `src/index.ts`。renderer 负责把实例绑定到 slot 和合成 hook。不要在模块顶层导出共享 handle：模块缓存会让插件重新装载后的状态所有权不清。React 组件不可自己调用 `handle.create()`；同一持久 key 的两个手动实例还会交叉写一个 `localStorage` 条目。

## 生命周期、失败与边界

把 handle 创建在 Client `apply` 中，注册和等待目标 slot 的 disposer 归 Cordis fiber；Session scope 结束时 renderer 释放相应实例。`persist` 是可选浏览器显示状态，存储读取、写入失败只记录错误并降级，不保证跨浏览器或 Host 恢复。`clearPersisted()` 必须由真正拥有该持久值删除语义的代码显式调用；普通卸载保留它。状态不应充当 Session 消息、模型工具结果或可恢复业务事实；这些应由 Host/Session 所有。

`flush: 'raf'` 的通知会在下一帧到达，挂载于同一帧的组件可能先读到新状态；控制输入应采用默认同步通知。`createSnapshotStore` 返回的不是 `useStore`；仅在 slot props 的 `PropsStore<H>` 中使用 renderer 提供的 hook。没有目标 slot 声明或未装载 `./client`，声明编译通过也不会显示组件。

发布包的 `lib/index.js` 在 Node 直接导入 `zustand/vanilla`、`zustand/middleware`、`zustand/shallow` 和 `immer`，而目标包 `package.json` 将 `zustand`、`immer` 放在 `devDependencies`。独立 Node 消费者若直接运行该根入口，需在自己的依赖中显式安装兼容版本；Web Client 构建还须确认静态模块表确实提供此引擎。此处是目标发布包的实际运行依赖边界，不应由声明编译结果掩盖。

## 验证

本页的完整示例在隔离包 `evidence/tests/client-store-upload-consumer/src/stateful-slot.tsx` 对精确 `0.2.0-rc.1` 发布声明通过 Client TypeScript 编译；单独 Node smoke 在显式安装两个运行依赖后验证实例隔离、同步回调、裸 snapshot 更新及无 localStorage 时的 `clearPersisted()`。另一个同 API 的隔离 Web Profile/Chrome probe 实际观察 `Count 0 → Count 1`、离开 Session 后消失、返回后重置为 `Count 0`、在线卸载插件后按钮消失。Chrome probe 是精简手写 lazy-CJS 半边，并非从本页 TSX 自动编译的 bundle；浏览器 localStorage 持久化仍未覆盖。
