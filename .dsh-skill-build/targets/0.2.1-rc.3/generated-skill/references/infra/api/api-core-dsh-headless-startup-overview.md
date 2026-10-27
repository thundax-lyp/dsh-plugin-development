# @deepseek-ai/dsh-headless ./startup

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-headless` 从命令行运行一个 dsh 任务并打印最终答案，然后退出——没有 GUI、没有服务器、没有浏览器。输入 `dsh --profile headless "run the tests"`，agent（智能体）会以与所有其他表层相同的模型、工具与安全默认值完成该任务。它非常适合脚本、CI 与一次性任务：进程不打开任何端口，也不会留下任何后台运行的东西。监督进程还可以通过按行 JSON 事件流（`--json`）驱动它，并用该事件流报告的标识（`--session-id`）在同一段对话上继续唤醒。退出码告诉你结果——任务完成时为 0，中止或出错时为 1。主要边界：每次调用只运行一个任务，没有交互式后续。

- [公开对象组 1](api-core-dsh-headless-startup-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
