# @deepseek-ai/dsh-sdk-app .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

以 `dsh-base` 为基础的 SDK stdio 应用 `dsh` profile 组合包。它继承 base 默认禁用模块 HMR（热模块替换）的策略；其 patch 挂载应用自有的零选项命令提供方，并且只在该提供方接受调用后启动 `dsh-sdk-jsonrpc-server`。因此，`dsh --profile sdk --help` 会写出 help 并退出，不会占用 stdin 或 stdout。独立的 `sdk-minimal` bundle 复用同一个启动提供方，并提供自己的 profile 名称。

- [公开对象组 1](api-core-dsh-sdk-app-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#使用-sdk-驱动独立-harness-并回收子进程) 给出装载和验证顺序。
