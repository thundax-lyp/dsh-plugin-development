# @deepseek-ai/dsh-acp 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-acp` 让受信程序通过标准 ACP 自动操作持久 DeepSeek Harness agent：创建或恢复会话、选择模型与推理强度、挂载 MCP 服务器、提交或取消工作、接收语义更新，并独立关闭会话。进程外 subagent、测试运行器与脚本化控制器适合选择它；它刻意不提供 DSH 专用呈现数据与交互式 UI 功能。持久化支持跨进程重启列出、恢复与关闭会话，但不支持删除、fork、transcript（文本记录）回放与附加目录。运行 `pnpm dsh --profile acp` 可启动服务器；仓库客户端使用 `dsh-subagent-acp`。

### 使用本包

当脚本、测试运行器或另一个 harness 需要通过标准自动化协议端到端运行 agent 工作时，使用本包。常用路径是：启动服务器、创建或恢复会话、按需挂载 MCP 服务器并选择模型选项、发送提示词、消费语义更新，再关闭会话。

#### 何时选择

当自动化应拥有交互时选择它：管理持久会话、工具、模型选择与权限的进程外 subagent、测试运行器或脚本化控制器。当人类需要 DSH 专用呈现卡片、计划、标题、todo、终端视图或 elicitation 时请避开；本服务器刻意只提供标准 ACP v1 界面。

#### 最小配置

服务器创建的每个会话都使用此处配置的提供方与模型。两个字段都是可选的，以便由另一个 agent/request 监听器提供；可运行的演示组合会同时设置两者。Stdout 只承载协议流量，因此请让日志远离它。

```yaml
- name: '@deepseek-ai/dsh-acp'
  config:
    provider: deepseek-official
    model: deepseek-v4-pro
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `provider` | — | 每个会话 agent 的提供方路由 |
| `model` | — | 每个会话 agent 的模型 |
| `sessionListPageSize` | `100` | 单页 `session/list` 返回的最大摘要数量 |

#### 启动服务器

`pnpm dsh --profile acp` 会启动随附的 stdio 服务器。`acp` profile 会挂载会话持久化，因此客户端可以列出、恢复和关闭持久会话。`@deepseek-ai/dsh-subagent-acp` 会启动同一 profile 来执行进程外委派。

#### 协议约定

一个连接可以同时运行多个会话，彼此独立。客户端发出的调用如下：

| 调用 | 你会得到什么 |
|---|---|
| `initialize` | 稳定 ACP v1，以及 `session/list`、`session/resume`、`session/close` 与 Streamable HTTP MCP 支持；图片提示词只在持久附件存储和配置的确切路由支持时公布。 |
| `authenticate` | 立即成功；服务器不需要身份验证。 |
| `session/new` | 全新持久 agent；其绝对工作区与 stdio 或 HTTP MCP 服务器会在发布前通过校验，并返回完整配置选项状态。 |
| `session/list` | 按确定的新到旧顺序分页返回已持久化、可恢复的根会话；可选绝对 `cwd` 筛选会尽可能使用物理目录标识。 |
| `session/resume` | 恢复一个已持久化且非活跃的会话；组合前校验其规范工作区，并恢复日志但不回放旧更新。 |
| `session/close` | 停稳式取消、更新 drain、后代释放、持久化 flush，并且只释放指定 Agent 作用域。 |
| `session/set_config_option` | 串行更新公布的 `model` 或 `reasoning_effort`，并返回完整结果状态。 |
| `session/prompt` | 有序文本、资源链接与受支持图片，每个会话一次一个提示词；根 Agent 与后代完成且有序更新交付后才结算。 |
| `session/cancel` / `$/cancel_request` | 提示词所拥有的取消路径；没有进行中的 ACP 提示词时取消自主工作，未知会话 id 则为空操作。 |
| `session/update` | 已提交 assistant 消息与 thought、通用工具生命周期、配置变化与上下文用量，按会话串行交付。 |
| `session/request_permission` | 带一次性允许／拒绝选项的权限提示；你的客户端可以自动回答。 |

受管理后代运行期间、它们的结果触发根 Agent 后续轮次期间，以及已提交输出仍在交付期间，提示词保持进行中。输出交付期间接受的根 Agent 工作会加入同一活动区间，并在该区间完成后结算。最终结果包含最新根轮次的停止原因与所有助手输出交付错误；只有原始提示词轮次固定使用接受时捕获的模型选择。取消会停止调用时已有的根 Agent 活动，并等待该活动及其已排队输出完成。之后到达的子 Agent 消息可以启动自主工作，但不会延迟取消响应；会话仍可接受后续提示词。收件箱消息处于停放状态的空闲后代继续驻留，但不延迟提示词完成。关闭会话还会释放其后代。

即使前一轮已经完成，追加 `turn/start` 或 `turn/end` 失败仍会使提示词请求失败。

会话配置从实时 LLM（大语言模型）服务目录提供不透明的提供方／模型选项，并在确切模型声明推理选项时提供 `reasoning_effort`。提示词会在异步图片准入前快照该选择，并在该轮次的每个模型步骤中固定它；并发选项变更从下一轮次开始生效。ACP 客户端是受信控制器：stdio MCP 条目授权其绝对命令与环境，HTTP 条目授权其绝对 HTTP(S) URL 与 header；初始连接或发现失败会回滚尚未发布的 Agent。不支持的界面会被省略或拒绝：`session/load`、删除、fork、附加目录、SSE（Server-Sent Events）或 ACP 传输 MCP、mode、命令、计划、终端、客户端文件系统操作与 elicitation。

-----

### 已知限制与延期工作

这些限制说明本包何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是协议对比或任务积压。

- **仅一个主 workspace**——附加目录仍不支持。
- **仅光栅提示词图片**——PNG、JPEG、WebP 与 GIF 要求持久附件存储及确切的图片能力路由。
- **仅 MCP 工具**——MCP resource 与 prompt 没有 DSH 消费方。
- **没有 transcript 回放或交互式扩展**——会话删除、fork、`session/load`、mode、命令、计划、终端、客户端文件系统操作与 elicitation 仍不属于此自动化界面。

## AcpConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface AcpConfig {
    provider?: string;
    model?: string;
    sessionListPageSize?: number;
    stream?: Stream;
}
```

公开导入：`@deepseek-ai/dsh-acp`；公开符号：`AcpConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`model`、`provider`、`sessionListPageSize`、`stream`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-acp.md)。

## Config（.）

公开导入：`@deepseek-ai/dsh-acp`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const Config: Schema<AcpConfig>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-acp.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-acp`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: AcpConfig): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-acp.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-acp`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-acp.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-acp`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "acp";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-acp.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
