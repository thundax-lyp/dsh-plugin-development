# @deepseek-ai/dsh-api-remote-access .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remote-access 选型与组合](api-core-dsh-api-remote-access-root-overview.md)。

决定非 owner Peer 可以调用哪些 Remote 方法、可以收到哪些转发事件。业务包定义 role（限定一种资源种类的 action 集合），并为每种非 owner principal kind 注册一个 policy，把 role 绑定到资源上。API Gateway 解析一次调用或一个事件访问的资源，并在解析 lookup、解码参数之前询问本包。列表方法经 `allows()` 逐项过滤；每个 Peer 订阅自己的访问快照，Client 据此隐藏 Host 会拒绝的入口。设计由 Peer 身份属性 Agent Note 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteAccessFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteAccessFrame = {
    readonly type: 'baseline';
    readonly owner: true;
} | {
    readonly type: 'baseline';
    readonly owner: false;
    readonly grants: readonly RemoteAccessGrant[];
} | {
    readonly type: 'upsert';
    readonly grant: RemoteAccessGrant;
} | {
    readonly type: 'remove';
    readonly resource: RemoteAccessResource;
};
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessGrant 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessGrant`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteAccessGrant {
    readonly resource: RemoteAccessResource;
    readonly actions: readonly string[];
}
```

成员检索：`actions`、`resource`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessPolicy 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessPolicy`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteAccessPolicy<P extends Principal> {
    bindings(principal: P): readonly RemoteAccessBinding[];
    explain?(request: RemoteAccessRequest<P>): string | undefined;
}
```

成员检索：`bindings`、`explain`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteAccessRequest<P extends Principal> {
    readonly principal: P;
    readonly action: RemoteAccessAction;
    readonly resources: readonly RemoteAccessResource[];
    readonly args?: Readonly<Record<string, unknown>>;
}
```

成员检索：`action`、`args`、`principal`、`resources`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessResource 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessResource`。

公开声明签名：

```text
export type RemoteAccessResource = {
    readonly kind: 'global';
} | {
    [Kind in TypertResourceKind]: {
        readonly kind: Kind;
        readonly id: TypertResourceId<TypertResourceMap[Kind]>;
    };
}[TypertResourceKind];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessResourceKind 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessResourceKind`。

公开声明签名：

```text
export type RemoteAccessResourceKind = 'global' | TypertResourceKind;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessResourceOf 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessResourceOf`。

公开声明签名：

```text
export type RemoteAccessResourceOf<K extends RemoteAccessResourceKind> = Extract<RemoteAccessResource, {
    readonly kind: K;
}>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteAccessRole 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessRole`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteAccessRole<K extends RemoteAccessResourceKind> {
    readonly name: string;
    readonly resource: K;
    readonly actions: readonly RemoteAccessAction[];
}
```

成员检索：`actions`、`name`、`resource`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
