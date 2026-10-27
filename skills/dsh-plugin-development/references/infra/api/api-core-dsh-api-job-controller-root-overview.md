# @deepseek-ai/dsh-api-job-controller .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`@deepseek-ai/dsh-api-job-controller` 拥有 Host 的 `ctx.jobController` 服务与生成的 Client `ctx.remote.job` namespace。它的两条 Remote 流都是 `ctx.jobs` 的投影：`job.list` 以整集帧镜像一个会话看得到的 job；`job.follow` 从绝对字节偏移发送一个 job 的保留输出；它唯一的命令 `job.kill` 代人类停止一个 job。Client 半侧安装 `ctx.jobs`——按引用计数的服务，会话头部任务列表渲染其名册与累积视图，其停止控件调用它的 `kill`。两条流都不触碰模型的消耗型游标与完成通知，人类 kill 也不是模型自己的杀停。

- [公开对象组 1](api-core-dsh-api-job-controller-root-1.md)。
- [公开对象组 2](api-core-dsh-api-job-controller-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败) 给出装载和验证顺序。
