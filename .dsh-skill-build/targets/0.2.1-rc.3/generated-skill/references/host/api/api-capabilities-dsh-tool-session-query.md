# @deepseek-ai/dsh-tool-session-query 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用实验性的 `dsh-tool-session-query` 工具可让模型搜索既往会话、检查事件匹配、追踪会话或事件关系，并读取精确事件数据。它的五个只读工具返回无游标文本；只有目标会话的 `cwd` 与调用方完全匹配时才允许跨会话访问，没有 `cwd` 的调用方只能检查自己。搜索会排除调用方会话，并在达到部署结果上限时要求模型缩小查询。本包是 opt-in；启用后，每次模型请求都会增加固定指引与五个工具 schema。

### 使用本包

当 agent 应该能搜索自己的既往会话并检查其关系与事件时挂载本包。常用路径是显式的：在 `ctx.sessionQuery`（由 `dsh-session-query-sqlite` 支撑）之上挂载插件，然后让模型调用这些工具。

#### 何时选择

当部署需要模型驱动的既往工作检索时选择它——例如 coding agent（编程智能体）在开始任务前搜索更早会话中做过的事。只需要程序化检索时避免使用：`ctx.sessionQuery` 本身服务代码调用方，无需面向模型的 schema、提示词与授权层。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxSearchResults` | `100` | 一次搜索调用返回的最大已授权命中数 |
| `searchTimeoutMs` | `30000` | 附加到两个全文搜索工具的协作式截止时间 |

#### 模型可以做什么

| 工具 | 模型得到什么 |
|---|---|
| `session_search` | 匹配字面查询的会话，经排序，带标题与最佳匹配摘录；始终省略调用方会话 |
| `session_event_search` | 一个已授权会话内匹配字面查询的事件；针对当前会话时，在调用它的步骤之前停止 |
| `session_trace` | 一个会话的已授权祖先链与后代树；未授权边界以不含隐藏 id 的标记出现 |
| `session_event_trace` | 一个事件的位置替换与被引用源事件关系 |
| `session_event_read` | 一个完整未删节事件（JSON），以及可选的相邻事件摘要 |

工作区授权是保守的：跨会话访问要求目标与调用方会话的 `cwd` 严格相等，没有 `cwd` 的调用方只能检查自己。请求的父 id 会在搜索前去重并按权限检查；缺失与跨工作区猜测行为完全相同。搜索结果无游标：结果达到上限时请模型缩小查询，绝不暴露提供方游标、偏移、分页大小或模型可控上限。工具边界的时间戳是带时区限定的 ISO 8601，并转换为包含端点的 epoch 毫秒过滤器。

#### 失败与恢复

每个可信查询服务调用都经过一个错误净化器：调用方取消被精确保留，语料库与提供方诊断进入内部日志，不安全或不可打印的失败回退到固定 `SESSION_QUERY_TOOL_FAILED` 代码与消息。本地参数校验与授权错误保留精确的工具自有消息（目标在调用方工作区之外时为 `SESSION_QUERY_TOOL_UNAUTHORIZED`）。本包不执行字节或字符截断，也不导入 spill 后端；需要限制内联输出的部署应挂载 `@deepseek-ai/dsh-spill-policy`，它可以在保留完整结果的同时替换过大的已渲染文本。

-----

### 已知限制与延期工作

这些限制说明本包何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是任务积压。

- **搜索有上限且无延续**——搜索最多返回部署上限，匹配更多时会请模型缩小查询；不提供延续 token。
- **保守的工作区身份**——工作区身份是字符串精确 `cwd` 相等，因此符号链接等价的路径不共享权限。
- **无 spill 策略时内联载荷**——未挂载通用 spill 策略的自定义组合会以内联方式接收完整追踪与事件载荷。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-session-query`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    maxSearchResults?: number;
    searchTimeoutMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-session-query.md)。

## DEFAULT_MAX_SEARCH_RESULTS（.）

公开导入：`@deepseek-ai/dsh-tool-session-query`；公开符号：`DEFAULT_MAX_SEARCH_RESULTS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MAX_SEARCH_RESULTS = 100;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-session-query.md)。

## DEFAULT_SEARCH_TIMEOUT_MS（.）

公开导入：`@deepseek-ai/dsh-tool-session-query`；公开符号：`DEFAULT_SEARCH_TIMEOUT_MS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_SEARCH_TIMEOUT_MS = 30000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-session-query.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-session-query`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-session-query.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-session-query`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-session-query.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-session-query`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-session-query";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-session-query.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
