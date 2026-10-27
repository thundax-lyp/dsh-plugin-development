# ui-slots：插件接入

## 对象关系

纯注册表没有 React 依赖。普通 Slots 通过 `SlotMap` 声明合并；`single` 按优先级取一个占位者，`list` 按 id 与 order 组合，`keyed` 按 key 分派，`chain` 依次调用纯 select 直到首个非 null。数字 priority 越小越先。同一单元的同一 priority 冲突、未声明的键、重复 children 声明、跨 scope 共享 Store handle 和缺少 select 的 chain 注册都会抛错。注册 disposer 递归收回 children 声明、贡献与 Store 挂载。Factory 在 `SlotFactoryMap` 声明，通过 registerFactory 安装，局部 slots 逐 occurrence 选择组件；children 仍为全局 Slots。

## 选型与使用

- [index 对象契约](api-client-ui-slots-index.md)。
- [renderer 对象契约](api-client-ui-slots-renderer.md)。
- [store 对象契约](api-client-ui-slots-store.md)。

完整操作见 [接入 ui-slots](../how-to/how-to-client-ui-slots.md#接入-ui-slots)。
