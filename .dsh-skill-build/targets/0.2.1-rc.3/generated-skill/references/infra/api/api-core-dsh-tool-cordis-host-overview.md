# @deepseek-ai/dsh-tool-cordis ./host

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

编写插件代码前查询 Host 和 Client 的运行时 API。创造模式同时提供这些只读工具与 Plugin Manager，后者负责持久化 profile 变更。检查注册表由 Cordis host runner 提供；浏览器查询需要已连接的页面。

- [公开对象组 1](api-core-dsh-tool-cordis-host-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包) 给出装载和验证顺序。
