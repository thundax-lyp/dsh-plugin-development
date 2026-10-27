# @deepseek-ai/dsh-api-settings-controller .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`@deepseek-ai/dsh-api-settings-controller` 为浏览器配置界面提供生成的 `ctx.remote.settings` 与 `ctx.remote.credentials` namespace。它返回脱敏的 settings 与凭据元数据，支持 settings 与凭据写入而不返回机密值，并在 Host 桌面打开由提供方持有的 settings 或 Agent preset 位置。提供方缺失时，namespace 仍会注册，并返回可操作的配置错误。

- [公开对象组 1](api-core-dsh-api-settings-controller-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) 给出装载和验证顺序。
