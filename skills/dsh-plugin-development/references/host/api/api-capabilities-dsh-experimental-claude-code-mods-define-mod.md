# dsh-experimental-claude-code-mods-define-mod 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 define-mod 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-claude-code-mods.md)；本页逐项保留对象的参数、字段和判别分支。

## ModConfig（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ModConfig = Record<string, string | number | boolean | string[]>;
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModPlugin（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModPlugin {
    readonly name: string;
    readonly inject: readonly string[];
    readonly Config: z<ModConfig>;
    readonly definition: ModDefinition;
    apply(ctx: Context, config: ModConfig): Promise<() => Promise<void>>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModPlugin`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`Config`、`apply`、`definition`、`inject`、`name`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ModSpec（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ModSpec {
    readonly name: string;
    readonly version?: string;
    readonly root?: string;
    readonly userConfig?: PluginOptions;
    readonly register: ModRegister;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ModSpec`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`register`、`root`、`userConfig`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## defineMod（.）

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`defineMod`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function defineMod(spec: ModSpec): ModPlugin;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。
