# @deepseek-ai/dsh-scope .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-scope 选型与组合](api-core-dsh-scope-root-overview.md)。

`dsh-scope` 让插件作者能够为每个 agent 或分组提供隔离的贡献集合与统一生命周期。子作用域继承祖先贡献，且较近的定义优先；祖先作用域可以观察后代活动，这两种关系均不反向成立。释放作用域会移除它拥有的一切。按 agent 或分组隔离必须脱离 agent loop（智能体循环）与 preset 工作时，请使用这个零依赖库。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ScopedLayers 公开契约

注册按当前Context scope路由，视图沿scope chain继承祖先layer；全局和局部资源各有owner。创建新layer不代表建立全局service，也不提供durable状态存储；dispose应撤销其贡献并恢复祖先视图。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`ScopedLayers`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class ScopedLayers<L extends ScopeLayer> {
    readonly global: L;
    constructor(createLayer: (scope: ScopeKey | undefined) => L, onChange: () => void);
    peek(scope: ScopeKey | undefined): L | undefined;
    chainLayers(scope: ScopeKey | undefined): L[];
    merge<V>(scope: ScopeKey | undefined, pick: (layer: L) => NamedEntries<V>): Map<string, V>;
    effect(ctx: Context, action: (layer: L) => () => void, options: {
        label: string;
        notify?: boolean;
    }): () => void;
}
```

成员检索：`chainLayers`、`effect`、`global`、`merge`、`peek`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## bindScopeParent 公开契约

一个key只允许首次绑定parent；重复绑定throw，形成环也throw。返回ScopeParentBinding是唯一可重设该关系的能力，不向其他调用方开放任意relink。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`bindScopeParent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function bindScopeParent(key: ScopeKey, parent: ScopeKey): ScopeParentBinding;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## carrierKeyOf 公开契约

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`carrierKeyOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function carrierKeyOf(value: unknown): ScopeKey | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## createScope 公开契约

在活动ctx下挂一个scope子插件，继承创建者依赖API并标记opaque key。options.parent在scope可用前绑定祖先，所有经返回ctx的注册归该scope。dispose等待fiber及其后续异步inertia静止；把scope包含在原owner的effect链。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`createScope`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function createScope(ctx: Context, key: ScopeKey, options?: CreateScopeOptions): Scope;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## isScopeCarrier 公开契约

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`isScopeCarrier`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function isScopeCarrier(value: unknown): value is Scoped<object>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## scopeChainOf 公开契约

返回[key,parent,grandparent,...]，最近者在前，undefined给空链。调用方可据此构造继承视图，但不能假定该快照未来仍未被合法binder重设。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`scopeChainOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function scopeChainOf(key: ScopeKey | undefined): ScopeKey[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## scopeOf 公开契约

从Context原型继承链读取最近scope tag；未标记返回undefined。不要用默认全局scope覆盖undefined来规避隔离，未标记就是全局贡献的语义。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`scopeOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function scopeOf(ctx: Context): ScopeKey | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## scopeParentOf 公开契约

查询一个key的直接祖先，根scope返回undefined；只读查询不拥有rebind能力。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`scopeParentOf`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function scopeParentOf(key: ScopeKey): ScopeKey | undefined;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
