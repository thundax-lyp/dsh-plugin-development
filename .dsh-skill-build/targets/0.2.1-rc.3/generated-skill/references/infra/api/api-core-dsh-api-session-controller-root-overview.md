# @deepseek-ai/dsh-api-session-controller .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

- [公开对象组 1](api-core-dsh-api-session-controller-root-1.md)。
- [公开对象组 2](api-core-dsh-api-session-controller-root-2.md)。
- [公开对象组 3](api-core-dsh-api-session-controller-root-3.md)。
- [公开对象组 4](api-core-dsh-api-session-controller-root-4.md)。
- [公开对象组 5](api-core-dsh-api-session-controller-root-5.md)。
- [公开对象组 6](api-core-dsh-api-session-controller-root-6.md)。
- [公开对象组 7](api-core-dsh-api-session-controller-root-7.md)。
- [公开对象组 8](api-core-dsh-api-session-controller-root-8.md)。
- [公开对象组 9](api-core-dsh-api-session-controller-root-9.md)。


## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) 给出装载和验证顺序。
