# @deepseek-ai/dsh-api-job-controller .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-job-controller 选型与组合](api-core-dsh-api-job-controller-root-overview.md)。

`@deepseek-ai/dsh-api-job-controller` 拥有 Host 的 `ctx.jobController` 服务与生成的 Client `ctx.remote.job` namespace。它的两条 Remote 流都是 `ctx.jobs` 的投影：`job.list` 以整集帧镜像一个会话看得到的 job；`job.follow` 从绝对字节偏移发送一个 job 的保留输出；它唯一的命令 `job.kill` 代人类停止一个 job。Client 半侧安装 `ctx.jobs`——按引用计数的服务，会话头部任务列表渲染其名册与累积视图，其停止控件调用它的 `kill`。两条流都不触碰模型的消耗型游标与完成通知，人类 kill 也不是模型自己的杀停。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## JobListRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-job-controller`；公开符号：`JobListRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface JobListRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## JobView 公开契约

导入入口：`@deepseek-ai/dsh-api-job-controller`；公开符号：`JobView`。

公开声明签名：

```text
export interface JobView {
    readonly id: JobId;
    readonly kind: string;
    readonly label: string;
    readonly owner?: SessionId;
    readonly outputLimitBytes?: number;
    readonly status: JobStatus;
    readonly progress?: string;
    readonly detail?: string;
    readonly startedAt: number;
    readonly finishedAt?: number;
    readonly output: {
        readonly total: number;
        readonly earliest: number;
        readonly spillPaths?: readonly string[];
    };
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
