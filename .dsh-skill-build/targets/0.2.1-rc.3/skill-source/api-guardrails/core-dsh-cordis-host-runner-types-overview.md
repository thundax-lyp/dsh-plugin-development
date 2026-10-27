# @deepseek-ai/dsh-cordis-host-runner ./types

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-cordis-host-runner` 提供运行时检查，并为程序调用方和浏览器控件保留进程内动态定义。Host 部分在 `node:vm` 中运行；浏览器部分使用 Client runner 和审批 UI。定义在重启后消失。Agent 通过 `tool-cordis` 发现 API，通过 Plugin Manager 安装持久化 bundle；没有模型工具创建动态定义。

- [公开对象组 1](api-core-dsh-cordis-host-runner-types-1.md)。





## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#运行并停止会话隔离的动态-cordis-包) 给出装载和验证顺序。
