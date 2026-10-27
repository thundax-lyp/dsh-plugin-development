# @deepseek-ai/dsh-api-workspace-files ./client

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

使用本包可从 Web Client 预览 Session 文件系统允许读取的文件。它按页读取 UTF-8 文本、按有界窗口或完整文件读取原始字节、从基文件目录解析关联文件，并报告文件元数据。可以跟随一个文件或一个目录直接子项的变化。文件读取和监听可以指向工作区外路径；目录列举和监听仍限定于工作区。本服务不提供修改操作。

- [公开对象组 1](api-core-dsh-api-workspace-files-client-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) 给出装载和验证顺序。
