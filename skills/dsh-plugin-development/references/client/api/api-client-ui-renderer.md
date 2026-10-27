# ui-renderer：插件接入

## 对象关系

浏览器 `apply` 提供 `ctx.slots: SlotRegistry` 与 `ctx.uiRenderer`。插件使用服务代理方法 register/inject，不新建 SlotRegistry；代理将注册 effect 归入调用插件的 fiber。inject 等待目标 slot 的声明生命周期，声明消失就清理，重新声明再安装；回调必须同步返回 disposer 或 disposer iterable。不要注册 root：它是框架 AppFrame 的 single slot，覆盖它会移除整个页面；全局浮层使用 shell.overlay。

## 选型与使用

- [index 对象契约](api-client-ui-renderer-index.md)。
- [registry 对象契约](api-client-ui-renderer-registry.md)。

完整操作见 [接入 ui-renderer](../how-to/how-to-client-ui-renderer.md#接入-ui-renderer)。
