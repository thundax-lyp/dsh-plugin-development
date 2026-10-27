# @deepseek-ai/dsh-typert-loader .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

挂载 `dsh-typert-loader` 后，Loader 组合中每个挂载的包都会自动把其生成的 Typert 反射与 schema factory 贡献给运行时注册表——并在包或本插件卸载时自动撤销。没有该导出的包会被跳过，因此在任何 Loader 组合中挂载它都是安全的。显式 `packages` 用于覆盖嵌套在另一 Loader 配置项之下的插件，这些插件的 fiber 不携带可解析的包说明符。它是仅支持 Node 的插件，需要配置树解析锚点才能解析包。

- [公开对象组 1](api-core-dsh-typert-loader-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote) 给出装载和验证顺序。
