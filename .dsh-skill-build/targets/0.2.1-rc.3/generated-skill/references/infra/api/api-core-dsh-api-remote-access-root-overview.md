# @deepseek-ai/dsh-api-remote-access .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

决定非 owner Peer 可以调用哪些 Remote 方法、可以收到哪些转发事件。业务包定义 role（限定一种资源种类的 action 集合），并为每种非 owner principal kind 注册一个 policy，把 role 绑定到资源上。API Gateway 解析一次调用或一个事件访问的资源，并在解析 lookup、解码参数之前询问本包。列表方法经 `allows()` 逐项过滤；每个 Peer 订阅自己的访问快照，Client 据此隐藏 Host 会拒绝的入口。设计由 Peer 身份属性 Agent Note 负责。

- [公开对象组 1](api-core-dsh-api-remote-access-root-1.md)。
- [公开对象组 2](api-core-dsh-api-remote-access-root-2.md)。
- [公开对象组 3](api-core-dsh-api-remote-access-root-3.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) 给出装载和验证顺序。
