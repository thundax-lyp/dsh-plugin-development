# @deepseek-ai/dsh-mcp-resources 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-mcp-resources` 让模型发现和读取已配置 MCP 服务器提供的文档。随附 profile 在调用方作用域中配置了服务器时，自动提供三个共享工具。每个工具都要求显式指定服务器名称，并且仅在调用时读取内容。资源文本进入对话历史；二进制载荷仍可供程序化调用方访问，并以说明文字呈现给模型。

### 使用本包

随附 profile 已经统一挂载本包一次。你只需为所需服务器配置 MCP 客户端条目。

#### 服务器配置

通过客户端配置在目标作用域中添加服务器。本包没有配置字段。

调用方没有已配置 MCP 服务器时，在 native 或 PTC 模式下都看不到 MCP 提示词文本或资源工具。配置服务器后会启用三个共享资源工具，包括由其他提供方挂载客户端的服务器，以及没有工具或指令的服务器。只要客户端条目保持激活，连接失败就不会移除共享工具；资源调用会报告连接错误。

#### 发现与读取

挂载系统提示词组装服务时，提示词列出调用 agent 可见的服务器名称。将其中一个名称作为 `server` 调用 `list_mcp_resources` 或 `list_mcp_resource_templates`。未提供游标时，MCP SDK 收集服务器的全部分页；显式提供游标时返回一页；将其中的 `nextCursor` 原样作为 `cursor` 传入，以请求下一页。使用相同的 `server` 名称和显式 `uri`，通过 `read_mcp_resource` 读取已列出的 URI 或展开后的模板。

每个操作都在调用 agent 的作用域中解析服务器。缺少服务器参数或服务器不可用时，会在派发前失败。连接所有者负责请求取消、超时与恢复；失败的请求仍表现为失败的工具调用。

-----

### 已知限制与延后工作

资源访问由显式调用按需发起。

- 不具备 MCP `resources` 能力的已配置服务器仍会出现在服务器名称提示词中，并保持共享资源工具可用。SDK 返回空的资源列表与模板列表；不受支持的读取会失败。
- `tools.restrict()` 在注册过滤条件时检查全局或祖先作用域提供的名称。引用这些作用域中不存在的资源工具名称会报未知工具错误。注册在调用方自身作用域中的资源工具不受 allow/deny 掩码过滤。
- 不支持资源订阅与更新通知；再次调用列表或读取工具以获取当前内容。
- 二进制资源不会投影为原生图片或音频。程序化调用方保留其规范 base64 值。
- 调用方必须提供服务器名称。共享工具不会聚合不同服务器；分页遵循 MCP SDK。

## McpResourceProvider（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface McpResourceProvider {
    request(request: McpResourceRequest, exec: ToolExecution): Promise<JsonValue>;
}
```

公开导入：`@deepseek-ai/dsh-mcp-resources`；公开符号：`McpResourceProvider`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`request`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-resources.md)。

## McpResourceRequest（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type McpResourceRequest = {
    method: 'resources/list' | 'resources/templates/list';
    cursor?: string;
} | {
    method: 'resources/read';
    uri: string;
};
```

公开导入：`@deepseek-ai/dsh-mcp-resources`；公开符号：`McpResourceRequest`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`method`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-resources.md)。

## McpResourceRuntime（.）

公开导入：`@deepseek-ai/dsh-mcp-resources`；公开符号：`McpResourceRuntime`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class McpResourceRuntime extends Service {
    static inject: string[];
    constructor(ctx: Context);
    register(server: string, provider: McpResourceProvider): () => void;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

注册在调用方 Cordis scope 中完成。保留返回的 disposer，在插件不再提供该能力时释放；不要让异步任务在 owner 结束后继续写入注册表。服务实现与消费者各自承担其资源，注册回调不是持久化记录。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-resources.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    mcpResources: McpResourceRuntime;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `mcpResources` | `mcpResources: McpResourceRuntime` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-mcp-resources.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
