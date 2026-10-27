# @deepseek-ai/dsh-hmr .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

在应用运行期间重载插件源码和配置。模块替换、Include 刷新与 profile 配置变更共用一个队列。包安装在该队列之外执行。`ctx.hmr` 保留现有 Cordis HMR 的配置和事件。

- [公开对象组 1](api-core-dsh-hmr-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
