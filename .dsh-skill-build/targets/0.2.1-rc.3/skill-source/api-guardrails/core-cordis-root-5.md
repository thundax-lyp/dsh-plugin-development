# @deepseek-ai/cordis .：公开对象 5

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis 选型与组合](api-core-cordis-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ValidationError 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`ValidationError`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ValidationError extends TypeError {
    name: string;
    constructor(issues: readonly StandardSchemaV1.Issue[]);
}
```

成员检索：`name`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## Volatile 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`Volatile`。

公开声明签名：

```text
export interface Volatile<T> {
    get(): VolatileSnapshot<T>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## VolatileSnapshot 公开契约

导入入口：`@deepseek-ai/cordis`；公开符号：`VolatileSnapshot`。

公开声明签名：

```text
export type VolatileSnapshot<T> = T extends object ? {
    readonly [K in keyof T]: VolatileSnapshot<T[K]>;
} : T;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
