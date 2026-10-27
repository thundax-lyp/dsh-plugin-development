# store：插件接入

## 对象关系

createSnapshotStore 提供裸 getSnapshot/subscribe/update/set；defineStore 将 init/persist/actions 绑定为可装入 slot 的 StoreHandle。selector hook 由 renderer 注入，而非引擎产物自带。默认同步通知；raf 是显式选择，帧内多写合并通知。persist 是 localStorage 客户端偏好，不替代 Session 模型事实；一个 handle 只能挂同一 scope，session scope 为各 Session 分开实例。

## 选型与使用

- [contract 对象契约](api-client-store-contract.md)。
- [index 对象契约](api-client-store-index.md)。

完整操作见 [接入 store](../how-to/how-to-client-store.md#接入-store)。
