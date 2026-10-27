# @deepseek-ai/dsh-deepseek-llm-api-extensions 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

用于向 DeepSeek 官方 LLM（大语言模型）API 请求添加顶层字段的提供方特定注册表。`DeepSeekLlmApiExtensionRegistry` 注册 `ctx.deepseekLlmApiExtensions`；贡献插件分别认领一个经声明合并的字段，`dsh-llm-deepseek` 则在序列化基础请求后准备当前贡献。当插件必须添加经过验证的提供方特定字段且不能修改基础适配器时，请使用它。

### 服务

- `register(field, provider)` 为调用 fiber 保留一个字段。重复或格式错误的名称会同步失败；dispose（资源释放）该注册后，后续提供方可以再次认领。
- `prepare(request)` 对已注册提供方取快照，并发准备贡献，克隆并冻结返回的 JSON 值，然后返回 `{ fields, accept }`。某个提供方准备时抛错，注册表会省略其字段，其余字段照常返回，且只记录该字段的首次失败；请求取消会使 `prepare` 拒绝，即使某个提供方忽略信号，注册表也会停止等待。
- `accept()` 对每个捕获的 2xx 后回调只运行一次。并发调用会等待同一次结算，所有回调都在报告失败前完成，多个失败会合并为一个 `AggregateError`。

每个提供方都会看到确切的已序列化 Messages 请求体、请求 `AbortSignal`，以及可选的 `sessionId` 与辅助调用 `purpose`。提供方必须在取消后迅速停止自身工作；字段不适用于当前请求时返回 `undefined`。即使 HMR（热模块替换）在 HTTP 接受前移除了注册，已准备的操作仍会保留其捕获的提供方。

注册表拥有字段添加与生命周期，不拥有字段语义。`@deepseek-ai/dsh-session-log-deepseek` 拥有 `dsh_session_log`；`@deepseek-ai/dsh-plugin-package-inventory-deepseek` 拥有 `dsh_plugin_packages`。提供方无关的 LLM seam 与 `llm-pi-ai` 都不消费该注册表。

### 已知限制与暂缓事项

- **仅限 DeepSeek 官方请求**——该注册表刻意不提供提供方无关的路由，也不集成 pi-ai 适配器。
- **不约定字段顺序**——JSON 对象成员顺序取决于注册准备顺序，但接收方按名称寻址字段。

## DeepSeekLlmApiExtensionMap（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

声明来源包 `@deepseek-ai/dsh-deepseek-llm-api-extensions`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface DeepSeekLlmApiExtensionMap {
}
```

声明来源包 `@deepseek-ai/dsh-plugin-package-inventory-deepseek`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface DeepSeekLlmApiExtensionMap {
    dsh_plugin_packages: DeepSeekPluginPackageInventoryExtension;
}
```

声明来源包 `@deepseek-ai/dsh-session-log-deepseek`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface DeepSeekLlmApiExtensionMap {
    dsh_session_log: DeepSeekSessionLogExtension;
}
```

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`DeepSeekLlmApiExtensionMap`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## DeepSeekLlmApiExtensionProvider（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekLlmApiExtensionProvider<T extends DeepSeekLlmApiJson> {
    prepare(request: DeepSeekLlmApiExtensionRequest): PreparedDeepSeekLlmApiExtension<T> | undefined | Promise<PreparedDeepSeekLlmApiExtension<T> | undefined>;
}
```

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`DeepSeekLlmApiExtensionProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`prepare`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## DeepSeekLlmApiExtensionRegistry（.）

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`DeepSeekLlmApiExtensionRegistry`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class DeepSeekLlmApiExtensionRegistry extends Service {
    constructor(ctx: Context);
    register<K extends keyof DeepSeekLlmApiExtensionMap>(field: K, provider: DeepSeekLlmApiExtensionProvider<DeepSeekLlmApiExtensionMap[K]>): () => Promise<void>;
    prepare(request: DeepSeekLlmApiExtensionRequest): Promise<PreparedDeepSeekLlmApiExtensions>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## DeepSeekLlmApiExtensionRequest（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekLlmApiExtensionRequest {
    readonly body: Readonly<Record<string, DeepSeekLlmApiJson>>;
    readonly sessionId?: string;
    readonly purpose?: 'compaction' | 'session-title';
    readonly signal: AbortSignal;
}
```

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`DeepSeekLlmApiExtensionRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`body`、`purpose`、`sessionId`、`signal`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## DeepSeekLlmApiJson（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type DeepSeekLlmApiJson = null | boolean | number | string | DeepSeekLlmApiJson[] | {
    [key: string]: DeepSeekLlmApiJson;
};
```

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`DeepSeekLlmApiJson`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## PreparedDeepSeekLlmApiExtension（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PreparedDeepSeekLlmApiExtension<T extends DeepSeekLlmApiJson> {
    readonly value: T;
    accept?(): void | Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`PreparedDeepSeekLlmApiExtension`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`accept`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## PreparedDeepSeekLlmApiExtensions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface PreparedDeepSeekLlmApiExtensions {
    readonly fields: Readonly<Partial<DeepSeekLlmApiExtensionMap>>;
    accept(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-deepseek-llm-api-extensions`；公开符号：`PreparedDeepSeekLlmApiExtensions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`accept`、`fields`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    deepseekLlmApiExtensions: DeepSeekLlmApiExtensionRegistry;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `deepseekLlmApiExtensions` | `deepseekLlmApiExtensions: DeepSeekLlmApiExtensionRegistry` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-deepseek-llm-api-extensions.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
