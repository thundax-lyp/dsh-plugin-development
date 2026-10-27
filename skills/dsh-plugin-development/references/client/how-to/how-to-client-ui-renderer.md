# 把组件挂到现有页面

## 接入 ui-renderer

目标结果：自有组件挂入公开 slot，贡献和等待随父声明及自身 fiber 回收。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。目标是增加一个随插件卸载的界面贡献，而不替换整个 AppFrame。[SlotRegistry](../api/api-client-ui-renderer-registry.md) 是 ctx.slots 的生产服务；[UiRendererService](../api/api-client-ui-renderer-index.md) 的 mount 由 Web boot kernel 使用，普通功能插件不再次挂载 React 根。

### 实现步骤

1. 导入目标 slot 所属包的 /client 类型，使 SlotMap 声明合并可见；运行时 export inject:['slots']，确认目标 Profile 已挂 ui-renderer 和 slot owner。完整独立包及 shell.overlay 示例见 [状态按钮与对话框](../examples/example-client-overlay.md)。
2. 从任务选择 slot：全局加法浮层用 shell.overlay list，完整全局页面用 main keyed，框架底栏用 shell.bottom single；不要注册 root，root single 已由框架占有，较低 priority 会遮蔽它并移除其所有 children。
3. 调用 ctx.slots.inject(key, callback) 等待声明，再在同步 callback 返回 ctx.slots.register 的 disposer。list 给唯一 id，keyed 给 key，single 通过 priority 明确遮蔽意图，chain 提供纯 select。注册必须在自己的插件 scope，经服务代理绑定调用者 context；不要脱离代理缓存一个箭头版注册方法。
4. 组件 props 用 PropsRuntime、PropsStore、PropsLocale 或 ComposedProps 从实际 SlotMap、StoreHandle 与 inject 定义推导，不手抄 sessionId、actions 或 hooks。只在组件 effect 中建立 DOM 订阅并返回清理；render 保持纯。
5. 原始数据从标准 snapshot source 注入，selector hooks 由 renderer 绑定。局部 UI 状态可用 React state；跨视图共享状态使用 store handle，session scope 按 Session 分实例。注册 children 意味着独占渲染授权，父贡献退出会级联移除声明与所有下游贡献。

### 验证与完成边界

在真实 Web Profile 检查可见贡献；停用父 owner 时子贡献退出，重新声明后 inject 重新安装；停用自己的包后 pending wait 和活动注册都消失。通过独立消费包验证 module factory 与生产 SlotRegistry/renderer；DOM 测试需同时检查可见内容和 ledger 为空，不能只断言 disposer 被调用。单元渲染不证明整个 Profile 的默认挂载或浏览器原生几何。
