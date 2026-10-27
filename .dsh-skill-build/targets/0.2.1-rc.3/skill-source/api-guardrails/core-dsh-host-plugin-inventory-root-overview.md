# @deepseek-ai/dsh-host-plugin-inventory .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

客户端可以调用 `pluginInventory/list`，按加载顺序展示宿主的当前插件，包括每个条目的标识符、模块标识、有效启用状态、存活阶段与可用的展示文本。部署组合了 agent preset roster 时，还会报告各预设的元数据、健康状态与压平后的插件组合；没有 roster 时，预设数据缺席。每次响应都是供展示和诊断使用的只读即时快照：它不能修改插件，也不提供历史或变更订阅。

- [公开对象组 1](api-core-dsh-host-plugin-inventory-root-1.md)。
- [公开对象组 2](api-core-dsh-host-plugin-inventory-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
