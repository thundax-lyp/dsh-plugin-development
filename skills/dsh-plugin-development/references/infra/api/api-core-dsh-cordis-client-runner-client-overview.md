# @deepseek-ai/dsh-cordis-client-runner ./client

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-cordis-client-runner` 为程序调用方和现有浏览器控件运行进程内动态包的浏览器部分。它在请求获批或用户显式操作后加载定义，并在 Host 撤销运行时移除定义。页面刷新不会恢复定义。Creator UI 插件通过 Plugin Manager 使用已安装的 Client 模块。

- [公开对象组 1](api-core-dsh-cordis-client-runner-client-1.md)。
- [公开对象组 2](api-core-dsh-cordis-client-runner-client-2.md)。
- [公开对象组 3](api-core-dsh-cordis-client-runner-client-3.md)。
- [公开对象组 4](api-core-dsh-cordis-client-runner-client-4.md)。
- [公开对象组 5](api-core-dsh-cordis-client-runner-client-5.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包) 给出装载和验证顺序。
