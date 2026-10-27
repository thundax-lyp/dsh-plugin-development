# @deepseek-ai/dsh-cmdline .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-cmdline` 让应用从启动器 flag 之后原样留下的参数中解析自己的 flag、`--help` 与错误。解析值可以覆盖配置默认值，而无需改写配置。应用还可以通过启动器的关停路径请求进程退出。适用于拥有自有命令行界面的应用 bin。它不增加提示词、schema 或模型可见内容。

- [公开对象组 1](api-core-dsh-cmdline-root-1.md)。
- [公开对象组 2](api-core-dsh-cmdline-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
