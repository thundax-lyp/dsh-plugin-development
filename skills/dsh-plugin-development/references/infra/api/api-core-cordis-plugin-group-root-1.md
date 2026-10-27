# @deepseek-ai/cordis-plugin-group .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis-plugin-group 选型与组合](api-core-cordis-plugin-group-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## default 公开契约

导入入口：`@deepseek-ai/cordis-plugin-group`；公开符号：`default`。

公开声明签名：

```text
export declare class Group extends EntryGroup {
    ctx: Context;
    config: EntryOptions[];
    static initial: Omit<EntryOptions, 'id'>[];
    static readonly [EntryGroup.key] = true;
    constructor(ctx: Context, config: EntryOptions[]);
    [Service.init](): AsyncGenerator<() => void, void, unknown>;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `context` | `get context(): Context;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `create` | `create(options: Omit<EntryOptions, 'id'>): Promise<string>;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `data` | `data: EntryOptions[];` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `remove` | `remove(id: string, isDispose?: boolean): void;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `stop` | `stop(): void;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `tree` | `tree: EntryTree;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `unlink` | `unlink(options: EntryOptions): void;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
| `update` | `update(config: EntryOptions[]): Promise<void>;` | [EntryGroup 权威声明](api-core-cordis-plugin-loader-root-1.md#entrygroup-公开契约) |
