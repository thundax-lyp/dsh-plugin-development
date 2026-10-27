# @deepseek-ai/dsh-host-directory-picker .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

web GUI 让操作者通过 OS 选择器或应用内浏览器选择工作区目录。操作者能接触宿主屏幕时使用原生选项；远程客户端或需要在应用内列举和创建目录时使用浏览选项。消费方会获得交互类型，并能呈现匹配的工作流。目录选择仅限 GUI 宿主，不会影响 agent loop（智能体循环）。浏览工作流一次只公开一棵目录树；不支持多根目录。

- [公开对象组 1](api-core-dsh-host-directory-picker-root-1.md)。
- [公开对象组 2](api-core-dsh-host-directory-picker-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
