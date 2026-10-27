# @deepseek-ai/dsh-typert-protocol .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

- [公开对象组 1](api-core-dsh-typert-protocol-root-1.md)。
- [公开对象组 2](api-core-dsh-typert-protocol-root-2.md)。
- [公开对象组 3](api-core-dsh-typert-protocol-root-3.md)。
- [公开对象组 4](api-core-dsh-typert-protocol-root-4.md)。
- [公开对象组 5](api-core-dsh-typert-protocol-root-5.md)。
- [公开对象组 6](api-core-dsh-typert-protocol-root-6.md)。
- [公开对象组 7](api-core-dsh-typert-protocol-root-7.md)。
- [公开对象组 8](api-core-dsh-typert-protocol-root-8.md)。
- [公开对象组 9](api-core-dsh-typert-protocol-root-9.md)。
- [公开对象组 10](api-core-dsh-typert-protocol-root-10.md)。
- [公开对象组 11](api-core-dsh-typert-protocol-root-11.md)。
- [公开对象组 12](api-core-dsh-typert-protocol-root-12.md)。
- [公开对象组 13](api-core-dsh-typert-protocol-root-13.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote) 给出装载和验证顺序。
