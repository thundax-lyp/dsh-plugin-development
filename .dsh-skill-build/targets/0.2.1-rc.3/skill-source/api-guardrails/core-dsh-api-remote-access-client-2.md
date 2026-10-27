# @deepseek-ai/dsh-api-remote-access ./client：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remote-access 选型与组合](api-core-dsh-api-remote-access-client-overview.md)。

决定非 owner Peer 可以调用哪些 Remote 方法、可以收到哪些转发事件。业务包定义 role（限定一种资源种类的 action 集合），并为每种非 owner principal kind 注册一个 policy，把 role 绑定到资源上。API Gateway 解析一次调用或一个事件访问的资源，并在解析 lookup、解码参数之前询问本包。列表方法经 `allows()` 逐项过滤；每个 Peer 订阅自己的访问快照，Client 据此隐藏 Host 会拒绝的入口。设计由 Peer 身份属性 Agent Note 负责。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access/client`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
