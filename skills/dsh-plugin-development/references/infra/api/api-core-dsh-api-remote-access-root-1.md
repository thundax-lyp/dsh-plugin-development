# @deepseek-ai/dsh-api-remote-access .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remote-access 选型与组合](api-core-dsh-api-remote-access-root-overview.md)。

决定非 owner Peer 可以调用哪些 Remote 方法、可以收到哪些转发事件。业务包定义 role（限定一种资源种类的 action 集合），并为每种非 owner principal kind 注册一个 policy，把 role 绑定到资源上。API Gateway 解析一次调用或一个事件访问的资源，并在解析 lookup、解码参数之前询问本包。列表方法经 `allows()` 逐项过滤；每个 Peer 订阅自己的访问快照，Client 据此隐藏 Host 会拒绝的入口。设计由 Peer 身份属性 Agent Note 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## REMOTE_ACCESS_SNAPSHOT_KEY 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`REMOTE_ACCESS_SNAPSHOT_KEY`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const REMOTE_ACCESS_SNAPSHOT_KEY = "__DSH_REMOTE_ACCESS__";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessAction 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessAction`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessAction = RemoteAccessEndpoint | `event:${string}`;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessBaseline 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessBaseline`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessBaseline = Extract<RemoteAccessFrame, {
    type: 'baseline';
}>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessBinding 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessBinding`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessBinding = {
    [K in RemoteAccessResourceKind]: {
        readonly role: RemoteAccessRole<K>;
        readonly resource: RemoteAccessResourceOf<K>;
        readonly condition?: RemoteAccessCondition<K>;
    };
}[RemoteAccessResourceKind];
```

成员检索：`condition`、`resource`、`role`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessCondition 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessCondition`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessCondition<K extends RemoteAccessResourceKind> = (request: {
    readonly action: RemoteAccessAction;
    readonly resource: RemoteAccessResourceOf<K>;
    readonly args?: Readonly<Record<string, unknown>>;
}) => RemoteAccessDecision;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessDecision 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessDecision`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessDecision = {
    readonly kind: 'allow';
} | {
    readonly kind: 'deny';
    readonly reason: string;
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessDeniedDetails 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessDeniedDetails`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteAccessDeniedDetails {
    readonly action: string;
    readonly reason: string;
}
```

成员检索：`action`、`reason`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessEndpoint 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessEndpoint`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessEndpoint = `${string}/${string}`;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
