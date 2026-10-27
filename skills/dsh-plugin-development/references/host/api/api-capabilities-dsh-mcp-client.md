# @deepseek-ai/dsh-mcp-client 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-mcp-client` 让模型使用外部 MCP（Model Context Protocol）服务器的工具与资源。每台服务器配置一条记录；其工具使用 `mcp__github__create_issue` 这样的名称。默认不启用任何服务器。随附 profile 已提供共享资源发现与读取。调用方作用域为空时，不添加 MCP 工具或提示词文本。服务器指令作为字面文本加入已记录的系统提示词；MCP 提示词模板不受支持。缓慢或崩溃的服务器可能延迟启动，或让调用失败直至恢复。

### 使用本包

#### 最小配置

每台服务器添加一条配置项即可，无需其他内容。harness 启动后，服务器的工具会出现在模型的工具列表中。

```yaml
- id: mcp-github
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: github
    transport: stdio
    command: npx
    args: ['-y', '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: !!js process.env.GITHUB_TOKEN

- id: mcp-web
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: web
    transport: streamable-http
    url: http://localhost:3000/mcp
    headers:
      Authorization: !!js '`Bearer ${process.env.MCP_TOKEN}`'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `transport` | 必填 | `stdio` 或 `streamable-http` |
| `serverName` | 必填 | 服务器工具名称的 namespace；`[A-Za-z0-9_-]{1,32}`，在一个注册作用域内唯一 |
| `command` / `args` / `env` / `cwd` | — | stdio：可执行文件、参数、合并到清洗过的环境之上的额外环境变量、工作目录 |
| `url` / `headers` | — | streamable-http：端点 URL 与额外请求标头 |
| `toolCallTimeoutMs` | `60,000` | 每次 `tools/call` 或资源请求的超时 |
| `maxInstructionBytes` | `32,768` | 包括服务器归属信息在内的服务器指令 UTF-8 字节上限；超出时连接失败 |
| `failOnStartupError` | `false` | 初始连接或工具同步失败时拒绝插件激活 |
| `reconnect.enabled` | `true` | 连接丢失后自动重新连接 |
| `reconnect.initialDelayMs` | `500` | 首次重连延迟；每次连续失败尝试翻倍 |
| `reconnect.maxDelayMs` | `30,000` | 退避上限；同时是重置尝试预算所需的正常运行时长 |
| `reconnect.maxAttempts` | `10` | 每次中断内连续失败尝试次数上限，超出后放弃 |

启动后，服务器的工具会以 `mcp__<serverName>__<tool>` 形式出现——试着用一条提示词调用其中一个。如果初始连接失败，harness 仍会启动，但该服务器的工具不会出现，并会记录一条错误。设置 `failOnStartupError: true` 会拒绝插件激活；app-boot 的启动策略仍允许可选 MCP 配置项失败，而不中止 harness。

#### 工具命名与共存

模型看到每个工具都带有稳定的服务器限定名称：`mcp__<serverName>__<rawName>`，例如 `mcp__github__create_issue`——与 Claude Code 和 Codex 使用的命名形态相同。只要服务器保持相同的工具名称，名称就保持不变，因此会话历史与权限规则在重启和重载后仍然有效。两个服务器可以同时提供名为 `search` 的工具，分别以 `mcp__github__search` 和 `mcp__web__search` 共存。

- 发布相同工具名称（例如 `search`）的两个服务器会在各自的 namespace 下共存。
- 两条配置项使用相同的服务器名称时，后加载的一条会在加载时以明确错误失败。
- 服务器在工具列表中两次列出同一工具时，其工具列表会被作为无效列表拒绝，上一组工具保持可用。
- SDK 负责发现分页及页数上限。发现失败会保留之前的工具；格式错误的游标链遵循 SDK 的处理行为。
- 工具更新与已有工具名称冲突时，该更新会被整体拒绝——绝不会得到该服务器的部分工具集。

#### 调用工具与读取结果

模型调用 MCP 工具时，调用会以每次调用超时（默认 60 秒）发往远程服务器，并像其他工具调用一样可以取消。结果按块顺序以普通文本返回；资源链接以文本形式显示名称与 URI。如果服务器报告错误，调用会明确失败——模型不会看到虚假的成功。

当前模型接受图片输入且 harness 启用了附件功能时支持图片；图片会像其他图片一样出现在对话中。不支持图片时——以及服务器返回音频或嵌入资源时——模型会看到清晰的诊断消息，而不是什么都没有。

#### 启动、工具更新与重连

服务器的工具会在 harness 开始首个轮次之前出现。服务器更改工具列表时，模型的工具集会自动更新；更新失败时，上一组工具继续可用。

服务器连接断开时——例如本地服务器进程崩溃——插件会以从 500 ms 起逐次翻倍、上限 30 s 的延迟自动重连，并刷新工具集；重连进度在日志中可见。中断期间最后已知的工具仍会列出，但对它们的调用会失败，直到服务器恢复。连续失败十次后，该服务器的工具会被移除，重连停止，直到你重载配置或重启 harness；服务器持续连接一段时间后，该计数会重置。设置 `reconnect.enabled: false` 可禁用自动重连——此时工具在断开后仍会列出，但调用失败，直到你重载。编辑配置项会在原地重载服务器连接，未变的名称保持不变。

-----

### 已知限制与延期工作

这些限制说明你无法用本插件做什么、以及何时需要运维注意。它们是当前包约束，不是与其他 MCP 客户端的对比，也不是任务积压。

- **资源按需读取**——随附 profile 提供共享资源服务；资源订阅与 MCP 提示词模板不受支持。
- **启动与发现超时继承自 MCP SDK**——插件不暴露单独的连接或发现超时。协商与发现使用 SDK 默认的 60 秒请求超时；发现也使用 SDK 的页数上限。插件卸载先关闭传输以中断待处理的启动请求，再等待清理。
- **重连处理协商失败与传输关闭**——初始探测失败或 stdio 子进程崩溃都会使用配置的重连预算。HTTP 建立连接后，请求失败使用 SDK 传输的恢复机制，而非重新创建连接。
- **图片是唯一的持久丰富结果桥接**——PNG、JPEG、WebP 与 GIF 在确切能力得到证明后进入 Native 上下文。音频与嵌入资源载荷仍只存在于执行局部并带明确诊断，资源链接只以文本保留名称与 URI。
- **无效的协议结果或输出 schema 由 SDK 拒绝**——桥接器不接受旧式 `toolResult` 替代结果，也不绕过已声明的 schema 校验。
- **要求基于任务的 MCP 工具在调用时被拒绝**——要求使用基于任务的执行（task-based execution）扩展的工具会抛出异常而非被桥接；该扩展未实现。

## Config（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type Config = StdioConfig | StreamableHttpConfig;

export declare const Config: z<ConfigInput, Config>;
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`failOnStartupError`、`maxInstructionBytes`、`reconnect`、`serverName`、`toolCallTimeoutMs`、`transport`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## McpResult（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type McpResult<Structured extends JsonValue = JsonValue> = {
    content: JsonValue[];
    structuredContent?: Structured;
};
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`McpResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`content`、`structuredContent`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## McpToolDefinitionOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface McpToolDefinitionOptions {
    name: string;
    rawName: string;
    description: string;
    inputSchema: Record<string, unknown>;
    outputSchema?: unknown;
    taskRequired?: boolean;
    call(args: Record<string, unknown>, execution: ToolExecution): Promise<unknown>;
}
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`McpToolDefinitionOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`call`、`description`、`inputSchema`、`name`、`outputSchema`、`rawName`、`taskRequired`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## ReconnectConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ReconnectConfig {
    enabled?: boolean;
    initialDelayMs?: number;
    maxDelayMs?: number;
    maxAttempts?: number;
}
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`ReconnectConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`enabled`、`initialDelayMs`、`maxAttempts`、`maxDelayMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## ResolvedReconnectPolicy（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type ResolvedReconnectPolicy = Readonly<Required<ReconnectConfig>>;
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`ResolvedReconnectPolicy`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`enabled`、`initialDelayMs`、`maxAttempts`、`maxDelayMs`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## StdioConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface StdioConfig {
    transport: 'stdio';
    serverName: string;
    command: string;
    args: string[];
    env: Record<string, string>;
    cwd: string;
    toolCallTimeoutMs: number;
    failOnStartupError: boolean;
    maxInstructionBytes?: number;
    reconnect?: ReconnectConfig;
}
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`StdioConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`args`、`command`、`cwd`、`env`、`failOnStartupError`、`maxInstructionBytes`、`reconnect`、`serverName`、`toolCallTimeoutMs`、`transport`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## StreamableHttpConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface StreamableHttpConfig {
    transport: 'streamable-http';
    serverName: string;
    url: string;
    headers: Record<string, string>;
    toolCallTimeoutMs: number;
    failOnStartupError: boolean;
    maxInstructionBytes?: number;
    reconnect?: ReconnectConfig;
}
```

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`StreamableHttpConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`failOnStartupError`、`headers`、`maxInstructionBytes`、`reconnect`、`serverName`、`toolCallTimeoutMs`、`transport`、`url`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## createMcpToolDefinition（.）

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`createMcpToolDefinition`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createMcpToolDefinition(ctx: Context, options: McpToolDefinitionOptions): ToolDefinition;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-mcp-client`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "mcp-client";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-mcp-client.md)。

### MCP 连接代际与清理

`Config` 是 transport 判别联合。stdio 分支需要 `serverName`、`command`；HTTP 分支需要 `serverName`、`url`。schema 补充 args/env/headers 与 deadline 等默认值，不能把已规范化接口的必填字段误作配置文件必填。serverName 匹配 `[A-Za-z0-9_-]{1,32}`，同一注册 scope 不允许两个活动实例持有同名；不同 Agent 的独立 scope 可重用。

远端工具名按 `mcp__<serverName>__<rawName>` 命名；非法字符或过长名称规范化并附 identity hash。工具发现和 generation 替换整体完成后发布；失败不把半套工具暴露给模型。资源能力与工具能力分别协商，只有 resources 的服务器也可连接。

初次连接/同步失败是否阻断激活由 `failOnStartupError` 控制。重连等待旧连接确认关闭，达到尝试上限则撤回工具。owner 卸载取消 backoff、关闭 transport、撤回工具和指令；不能在 shutdown 后重新发布迟到 generation。stdio command 是受信宿主程序，不受 Agent 文件 sandbox 约束。

工具调用和资源请求传递 caller signal 并应用 `toolCallTimeoutMs`；MCP `isError` 是规范工具结果的一部分，不能将其包装成成功。图像须先进入附件持久引用，再形成有序规范内容；界面渲染不生成第二份事实。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
