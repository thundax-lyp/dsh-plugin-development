# @deepseek-ai/dsh-typert-protocol .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-typert-protocol 选型与组合](api-core-dsh-typert-protocol-root-overview.md)。

借助 `dsh-typert-protocol`，业务包可以向 Remote 客户端暴露 Host 方法：用 `@Remote`（作用域接收者用 `@RemoteScope`）标记方法，把服务绑定到 wire 命名空间，并通过可合并扩展的协议映射把 Host 对象与作用域 Context 关联到 wire identity。生成产物、Host Gateway 与 Client API 消费同一套调用描述符、编解码器与提供方约定。调用持有的值把清理责任交给 Gateway，不另增引用计数。本包不注册任何 Cordis 服务，也不运行 TypeScript 分析。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## InvocationDescriptor 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`InvocationDescriptor`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InvocationDescriptor {
    readonly id: string;
    readonly service: string;
    readonly namespace: string;
    readonly method: string;
    readonly implementation?: string;
    readonly mode?: 'stream';
    readonly invocation: {
        readonly kind: 'direct';
    } | {
        readonly kind: 'context';
        readonly context: string;
        readonly wire: string;
        readonly codec: TypertCodec;
    };
    readonly scope?: {
        readonly context: string;
        readonly wire: string;
    };
    readonly parameters: readonly InvocationParameterDescriptor[];
    readonly uplink?: {
        readonly codec: TypertCodec;
    };
    readonly cancellation?: {
        readonly parameter: 'signal';
    };
    readonly result: TypertCodec;
    readonly description?: string;
    readonly sourceLocation?: InvocationSourceLocation;
}
```

成员检索：`cancellation`、`description`、`id`、`implementation`、`invocation`、`method`、`mode`、`namespace`、`parameters`、`result`、`scope`、`service`、`sourceLocation`、`uplink`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## InvocationParameterDescriptor 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`InvocationParameterDescriptor`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InvocationParameterDescriptor {
    readonly name: string;
    readonly description?: string;
    readonly wire: string;
    readonly source: 'json' | 'lookup';
    readonly lookup?: string;
    readonly codec: TypertCodec;
    readonly acceptsUndefined?: true;
}
```

成员检索：`acceptsUndefined`、`codec`、`description`、`lookup`、`name`、`source`、`wire`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## InvocationSourceLocation 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`InvocationSourceLocation`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface InvocationSourceLocation {
    readonly file: string;
    readonly line: number;
    readonly column: number;
}
```

成员检索：`column`、`file`、`line`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## PeerId 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`PeerId`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type PeerId = Branded<'PeerId'>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## PeerScope 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`PeerScope`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PeerScope {
    readonly id: PeerId;
    readonly ctx: Context;
    readonly principal: Principal;
    readonly signal: AbortSignal;
    readonly interactions: 'answer' | 'none';
    dispose(): Promise<void>;
}
```

成员检索：`ctx`、`dispose`、`id`、`interactions`、`principal`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## Principal 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`Principal`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type Principal = PrincipalMap[keyof PrincipalMap];
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## PrincipalMap 公开契约

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`PrincipalMap`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PrincipalMap {
    owner: {
        readonly kind: 'owner';
    };
}
```

成员检索：`owner`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。

## Remote 公开契约

标准装饰器只支持公开实例方法。无参数形式保留方法名；字符串形式显式 wire export name；对象选项仅 name、mode:'stream'、resources，空对象和未知键拒绝。namespace/method/context segment 必须满足字母数字及 _$.- 的文法，且不能是 . 或 ..。标记在构造实例时附到其原型的版本化描述符；冲突标记拒绝。装饰器不会自动生成编解码器或开放网络端点，需所属包的 Loader entry 与 Typert artifact。

导入入口：`@deepseek-ai/dsh-typert-protocol`；公开符号：`Remote`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function Remote<This extends object, Args extends unknown[], Result>(_method: (this: This, ...args: Args) => Result, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Result>): void;

export declare function Remote(name: string): RemoteMethodDecorator;

export declare function Remote<This extends object, Args extends unknown[], Result>(options: NoInfer<RemoteMethodOptions<RemoteWireArgs<Args>>>): RemoteTypedMethodDecorator<This, Args, Result>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote)。
