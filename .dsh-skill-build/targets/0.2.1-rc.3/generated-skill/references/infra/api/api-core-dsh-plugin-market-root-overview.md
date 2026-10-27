# @deepseek-ai/dsh-plugin-market .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`pluginMarket` 读取用户配置的插件市场索引，用 `dsh-plugin-market-index` 校验，并为每个条目标注 profile 中的安装状态、DSH 兼容性以及安装它所需的精确参数。Web 的发现标签页和 `plugin_market` agent 工具通过它读取；安装本身经由 `pluginManager.installBundle` 进行。格式及其理由见索引格式 Agent Note；Host 与 Web 的设计见发现 Agent Note。

- [公开对象组 1](api-core-dsh-plugin-market-root-1.md)。
- [公开对象组 2](api-core-dsh-plugin-market-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
