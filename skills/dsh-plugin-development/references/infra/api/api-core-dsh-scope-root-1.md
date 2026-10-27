# @deepseek-ai/dsh-scope .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-scope 选型与组合](api-core-dsh-scope-root-overview.md)。

`dsh-scope` 让插件作者能够为每个 agent 或分组提供隔离的贡献集合与统一生命周期。子作用域继承祖先贡献，且较近的定义优先；祖先作用域可以观察后代活动，这两种关系均不反向成立。释放作用域会移除它拥有的一切。按 agent 或分组隔离必须脱离 agent loop（智能体循环）与 preset 工作时，请使用这个零依赖库。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AnonymousEntries 公开契约

匿名注册表保留同层多条贡献和各自disposer；没有按名字遮蔽的选择语义。effect登记的条目归调用scope，移除只撤销该次注册，不删除其他owner的贡献。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`AnonymousEntries`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class AnonymousEntries<V> implements EntryValues<V> {
    append(value: V): () => void;
    values(): IterableIterator<V>;
    isEmpty(): boolean;
}
```

成员检索：`append`、`isEmpty`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## CreateScopeOptions 公开契约

parent为可选的祖先ScopeKey，创建时通过bindScopeParent绑定且binding不暴露给普通调用方。它建立注册向下继承和事件向上传播关系，不提供权限或多租户进程隔离。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`CreateScopeOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface CreateScopeOptions {
    parent?: ScopeKey;
}
```

成员检索：`parent`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## NamedEntries 公开契约

单表按插入顺序保留借用值。insert(name,value)遇同表重复名调用构造时提供的duplicateError并throw；成功返回仅移除该次插入的幂等undo。get/has按名查询，keys/entries/values为当前非空table generation的live迭代器；表被清空后旧迭代器不会观察未来新generation。跨scope遮蔽由ScopedLayers.merge负责，不是此表自行执行。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`NamedEntries`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class NamedEntries<V> implements EntryValues<V> {
    constructor(duplicateError: (name: string) => Error);
    insert(name: string, value: V): () => void;
    get(name: string): V | undefined;
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    entries(): IterableIterator<[
        string,
        V
    ]>;
    values(): IterableIterator<V>;
    isEmpty(): boolean;
}
```

成员检索：`entries`、`get`、`has`、`insert`、`isEmpty`、`keys`、`values`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## Scope 公开契约

ctx用于注册归该scope所有的贡献；rawDispose是精确Cordis disposer，适合放入有序复合effect；dispose是共享的quiescent边界，竞态调用等待同一次清理完成。调用方必须最终释放scope，不能仅删除自己的key映射而保留子fiber。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`Scope`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Scope {
    ctx: Context;
    rawDispose: () => Promise<void> | void;
    dispose(): Promise<void>;
}
```

成员检索：`ctx`、`dispose`、`rawDispose`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ScopeKey 公开契约

不透明object身份，按引用比较而不是字段值比较。两个结构相同的新对象是不同scope，不能序列化一个key后期望自动恢复其identity关系。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`ScopeKey`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ScopeKey = object;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ScopeLayer 公开契约

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`ScopeLayer`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ScopeLayer {
    isEmpty(): boolean;
}
```

成员检索：`isEmpty`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## ScopeParentBinding 公开契约

rebind(parent)再次检查环；只有原binder持有此能力。调用方必须保证旧parent下未保留任何已产生的内容，即blank-session重新组合前提；关系表本身无法知道Session日志是否已经留存事实。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`ScopeParentBinding`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ScopeParentBinding {
    rebind(parent: ScopeKey): void;
}
```

成员检索：`rebind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。

## Scoped 公开契约

scopeTarget返回的routing-only事件接收者品牌；泛型只帮助dispatch检查，不暴露真实subject属性。真实subject必须显式放在事件参数里，不能把carrier强转后当Agent或Session读取。

导入入口：`@deepseek-ai/dsh-scope`；公开符号：`Scoped`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type Scoped<T extends object> = object & {
    readonly [ScopedBrand]: T;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-state.md#用-session-事件记录可恢复的插件事实)。
