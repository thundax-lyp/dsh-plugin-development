# @deepseek-ai/dsh-acp-app .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

以 `dsh-base` 为基础的纯自动化 ACP stdio 应用 `dsh` profile 组合包。它继承 base 禁用模块 HMR（热模块替换）的策略；其 patch 设置 coding agent（编程智能体）persona 与默认模型路由、挂载应用自有的零选项命令提供方，并且只在该提供方接受调用后启动 `dsh-acp`。因此，`dsh --profile acp --help` 会写出 help 并退出，不会占用 stdin 或 stdout。

- [公开对象组 1](api-core-dsh-acp-app-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
