# @deepseek-ai/dsh-api-account-controller ./types

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

账号页面使用经过认证的 Remote 操作和快照流。控制器提供登录状态，不返回 token 或 PKCE 私密数据。

- [公开对象组 1](api-core-dsh-api-account-controller-types-1.md)。
- [公开对象组 2](api-core-dsh-api-account-controller-types-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) 给出装载和验证顺序。
