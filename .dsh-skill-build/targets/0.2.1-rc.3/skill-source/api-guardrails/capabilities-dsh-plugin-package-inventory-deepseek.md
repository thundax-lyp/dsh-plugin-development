# @deepseek-ai/dsh-plugin-package-inventory-deepseek 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

用于 DeepSeek 官方 LLM API 请求的尽力收集型活跃 Loader 插件包清单。该函数插件注入 Loader、存活 Agent 注册表与 `ctx.deepseekLlmApiExtensions`，并拥有 `dsh_plugin_packages` 字段。当官方 API 需要活动包清单进行请求诊断时，请启用它。

### 配置

| 配置键 | 默认值 | 含义 |
|---|---:|---|
| `enabled` | `true` | 注册 `dsh_plugin_packages` 贡献。将其设为 `false` 可省略包元数据。 |

随附 profile 使用该默认值，因此只要准备成功，每个 DeepSeek 官方请求都会携带包清单。

### 已知限制与暂缓事项

- **仅含 Loader 包来源**——以编程方式创建的子 fiber 与内存动态插件没有权威 NPM 名称／版本来源，因此不在该清单内。
- **省略不可用身份**——包元数据不可用时，清单可能不完整。
- **原地替换包需要重启**——manifest 身份会在进程存活期内缓存。Loader 的启用、禁用、挂载、卸载与普通源码 HMR 仍会刷新存活配置项集合，但在同一进程中把已挂载包的 manifest 替换为另一版本并不是受支持的升级路径。

## Config（.）

公开导入：`@deepseek-ai/dsh-plugin-package-inventory-deepseek`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    enabled?: boolean;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md)。

## DeepSeekPluginPackageIdentity（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekPluginPackageIdentity {
    readonly name: string;
    readonly version?: string;
}
```

公开导入：`@deepseek-ai/dsh-plugin-package-inventory-deepseek`；公开符号：`DeepSeekPluginPackageIdentity`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`name`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md)。

## DeepSeekPluginPackageInventoryExtension（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekPluginPackageInventoryExtension {
    readonly version: 1;
    readonly packages: readonly DeepSeekPluginPackageIdentity[];
}
```

公开导入：`@deepseek-ai/dsh-plugin-package-inventory-deepseek`；公开符号：`DeepSeekPluginPackageInventoryExtension`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`packages`、`version`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-plugin-package-inventory-deepseek`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-plugin-package-inventory-deepseek`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-plugin-package-inventory-deepseek`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "plugin-package-inventory-deepseek";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-plugin-package-inventory-deepseek.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
