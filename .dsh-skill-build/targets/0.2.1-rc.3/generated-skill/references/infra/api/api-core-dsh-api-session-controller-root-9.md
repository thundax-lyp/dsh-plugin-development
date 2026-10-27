# @deepseek-ai/dsh-api-session-controller .：公开对象 9

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-session-controller 选型与组合](api-core-dsh-api-session-controller-root-overview.md)。

`@deepseek-ai/dsh-api-session-controller` 拥有 Host 的 `ctx.sessionController` 服务，以及生成的 Client `session`、`skills` 和 `fileReferences` Remote namespace。它提供 Session 生命周期与历史、Host generation 模型目录、人工后台任务终止、工作区路径打开、用户可调用 skill（技能）发现和 Agent（智能体）范围的文件引用。当 Client 需要按 Session 寻址的操作时，请通过 API Gateway 使用它。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionWireEvent 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionWireEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionWireEvent {
    readonly type: string;
    readonly seq: number;
    readonly time: number;
    readonly data: JsonValue;
    readonly ignorable?: true;
    readonly sourceEventSeqs?: JsonValue;
    readonly surfaceOp?: JsonValue;
}
```

成员检索：`data`、`ignorable`、`seq`、`sourceEventSeqs`、`surfaceOp`、`time`、`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionWireHeader 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionWireHeader`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SessionWireHeader {
    readonly version: number;
    readonly id: SessionId;
    readonly createdAt: number;
    readonly cwd?: string;
    readonly parentSession?: SessionId;
    readonly isSeeded: boolean;
    readonly origin?: 'subagent';
    readonly delegationDepth?: number;
    readonly agentPreset?: string;
}
```

成员检索：`agentPreset`、`createdAt`、`cwd`、`delegationDepth`、`id`、`isSeeded`、`origin`、`parentSession`、`version`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionWireSurfaceOp 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionWireSurfaceOp`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionWireSurfaceOp = 'append' | {
    readonly op: 'replace';
    readonly startSeq: number;
    readonly endSeq: number;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionWorkspacePathApplication 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SessionWorkspacePathApplication`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type SessionWorkspacePathApplication = NativeFileApplication;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SkillEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SkillEntry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SkillEntry {
    readonly path?: string;
    readonly name: string;
    readonly description: string;
    readonly whenToUse?: string;
    readonly modelInvocable: boolean;
}
```

成员检索：`description`、`modelInvocable`、`name`、`path`、`whenToUse`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SkillListRequest 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SkillListRequest`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SkillListRequest {
    readonly sessionId: SessionId;
}
```

成员检索：`sessionId`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SkillListValue 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`SkillListValue`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface SkillListValue {
    readonly skills: readonly SkillEntry[];
}
```

成员检索：`skills`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## buildModelCatalog 公开契约

导入入口：`@deepseek-ai/dsh-api-session-controller`；公开符号：`buildModelCatalog`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function buildModelCatalog(ctx: Context, defaultSelection?: ModelSelection): Promise<ModelCatalog>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
