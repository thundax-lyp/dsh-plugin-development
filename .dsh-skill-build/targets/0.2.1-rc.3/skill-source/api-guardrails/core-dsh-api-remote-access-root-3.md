# @deepseek-ai/dsh-api-remote-access .：公开对象 3

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remote-access 选型与组合](api-core-dsh-api-remote-access-root-overview.md)。

决定非 owner Peer 可以调用哪些 Remote 方法、可以收到哪些转发事件。业务包定义 role（限定一种资源种类的 action 集合），并为每种非 owner principal kind 注册一个 policy，把 role 绑定到资源上。API Gateway 解析一次调用或一个事件访问的资源，并在解析 lookup、解码参数之前询问本包。列表方法经 `allows()` 逐项过滤；每个 Peer 订阅自己的访问快照，Client 据此隐藏 Host 会拒绝的入口。设计由 Peer 身份属性 Agent Note 负责。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## RemoteAccessService 公开契约

对每个非owner调用按endpoint/action/全部资源判定；principal从Host创建Peer固定，wire不能设定。global与session/workspace等资源独立，global允许不蕴含任意session允许。所有实际访问资源必须由默认推导或resources reader列全；遗漏的资源不会自动被检查。owner成功不证明非owner可用。

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`RemoteAccessService`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RemoteAccessService extends TypertRemoteService {
    constructor(ctx: Context);
    registerPolicy<K extends Exclude<keyof PrincipalMap, 'owner'>>(kind: K, policy: RemoteAccessPolicy<PrincipalMap[K]>): () => void;
    invalidate(principal?: Principal): void;
    decide(request: RemoteAccessRequest<Principal>): RemoteAccessDecision;
    allows(resource: RemoteAccessResource): boolean;
    snapshotFor(principal: Principal): RemoteAccessBaseline;
    follow(signal: AbortSignal): AsyncIterable<RemoteAccessFrame>;
}
```

成员检索：`allows`、`decide`、`follow`、`invalidate`、`registerPolicy`、`snapshotFor`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertResourceKind 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`TypertResourceKind`。

公开声明签名：

```text
export type TypertResourceKind = Extract<keyof TypertResourceMap, string>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## TypertResourceMap 公开契约

导入入口：`@deepseek-ai/dsh-api-remote-access`；公开符号：`TypertResourceMap`。

公开声明签名：

声明来源包 `@deepseek-ai/dsh-typert-protocol`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface TypertResourceMap {
}
```

声明来源包 `@deepseek-ai/dsh-session`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertResourceMap {
    session: TypertResource<SessionId>;
}
```

声明来源包 `@deepseek-ai/dsh-workspace`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface TypertResourceMap {
    workspace: TypertResource<WorkspaceId>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
