# @deepseek-ai/dsh-client-ui-cordis .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-client-ui-cordis` 渲染历史生成插件卡片，并为进程内定义提供控制面板。用户可以操作程序消费者提供的定义；重启后持久化卡片仍可读取，但不会重建定义。新建 Creator 插件使用 Plugin Manager。

- [公开对象组 1](api-core-dsh-client-ui-cordis-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包) 给出装载和验证顺序。
