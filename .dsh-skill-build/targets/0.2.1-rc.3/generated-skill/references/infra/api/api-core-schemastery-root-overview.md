# @deepseek-ai/schemastery .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`@deepseek-ai/schemastery` 的此模块公开以下对象、配置和值。类型用于检查调用契约，运行时插件贡献仍须经 Loader 或 `ctx.plugin()` 装载。

- [公开对象组 1](api-core-schemastery-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
