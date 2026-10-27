# 声明扩展位置与可复用装配

## 接入 ui-slots

目标结果：能声明 children 或 Factory 并按类型组合、优先级和 scope 规则装配下游组件。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。纯 [SlotCore、SlotMap 与组合类型](../api/api-client-ui-slots-index.md) 定义声明与渲染授权；实际插件通过 [SlotRegistry](../api/api-client-ui-renderer-registry.md) 使用这些契约。先完成 [现有页面贡献](how-to-client-ui-renderer.md#接入-ui-renderer)；如果只需一个普通 React 子组件，无需先引入 Factory。

### 实现步骤

1. 若为自己的组件暴露下游扩展位置，在 declare module '@deepseek-ai/dsh-client-ui-slots' 的 SlotMap 中定义键的 kind、scope、owner 与必要 inject。把同一键的 runtime spec 放入自己 register 的 children；单独声明 TypeScript 类型不会创建运行时 slot。
2. 根据结果选 kind：single 是一格单一 winner，list 按 id 有序相加，keyed 按 key 分派，chain 对每个 entry 调纯 select，首个非 null 结果成为 matched。priority 数值越小越先；同单元相同 priority 冲突抛错，list 同 priority 再看 order。
3. 父组件只用由 children 推导出的 renderSlot/renderSlotChain；不得跨父级渲染未认领的键。子插件用 ctx.slots.inject 等待该键，再注册自己的 Component，所有权跟随父声明与自身 fiber 两条边界。
4. 可复用装配选择 Component Factory：在 SlotFactoryMap 声明 props、scope、可选 store/inject/locale/children/local slots；在 ctx.slots.registerFactory 安装同名 definition。调用位置的 renderFactorySlot 选择每个 occurrence 的 local Components，definition 用 useFactorySlot(name,fallback) 读取。Factory children 仍是普通全局 Slots，local slots 不是新的全局注册点。
5. occurrence 继承渲染位置的 scope，不给 renderFactorySlot 手传 Session identity。Store factory lazy 创建各 occurrence 的 handle；会导致持久 key 冲突的 persisted Store spec 会被 renderer 拒绝。共享 Store handle 不得跨 root/session scope。
6. 父 entry disposer 会递归撤销 child 声明、下游贡献与 store 挂载。Factory occurrence 崩溃走监督通道，但不移除共享 definition；single/keyed/list 某 entry 崩溃可能让其退位并显示下一 winner，不能把显示 fallback 当业务成功。

### 验证与完成边界

编译检查静态 children、kind 参数、props share 与 FactoryMap；运行时分别测试未声明注册、重复声明、同 priority 冲突和跨 scope handle 拒绝。对正常路径观察父子贡献可见，父退出时下游一起回收，重启无重复。Factory 至少渲染两个 occurrence，检验本地 Component 选择与 Store 状态独立；不用 persisted Store 时不承诺刷新恢复。纯注册表测试不能替代 Client bundle 与页面装载。

相关对象契约：

- [`ActionsDecl`、`BakedActions`、`BoundActions`、`DefineStore` 等对象](../api/api-client-ui-slots-store.md)。
- [`HostObservable`、`KeyedStandardSource`、`LocaleFace`、`RootStandardSourceContribution` 等对象](../api/api-client-ui-slots-renderer.md)。
