# MCP 客户端桥接与资源入口

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-mcp-client` 是 Host Cordis 插件：每实例连接一台外部 MCP 服务器，将发现的 tools 以 `mcp__<serverName>__<rawName>` 的稳定本地名称注册到 `ctx.tools`。`@deepseek-ai/dsh-mcp-resources` 是共享资源服务，提供 `list_mcp_resources`、`list_mcp_resource_templates`、`read_mcp_resource` 三个模型工具；一个 MCP server 可以没有资源能力。配置任务见[连接 MCP 服务器](how-to-connect-mcp-server.md)。MCP 本身是外部协议；下面仅裁决目标版本桥接器的行为。

## 配置与公开成员

| 对象                                          | 公开成员和所有权                                                                                                                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `McpToolDefinitionOptions`                    | `name`、`rawName`、`description`、`inputSchema` 和 `call(args,execution)` 必需；`outputSchema?`、`taskRequired?` 可选。调用者自己注册返回的 ToolDefinition，传递取消并关闭底层连接。                                                                                            |
| `McpResult`                                   | `content: JsonValue[]` 保留原顺序，`structuredContent?` 是成功值的可选结构；不能从渲染文字重建规范值。                                                                                                                                                                          |
| `StdioConfig`                                 | 公开 TypeScript 形状要求 `transport:'stdio'`、`serverName`、`command`、`args`、`cwd`、`env`、`toolCallTimeoutMs`、`failOnStartupError`；仅 `maxInstructionBytes?`、`reconnect?` 可选。Loader schema 可填默认，直接构造对象须满足完整类型。命令直接执行，显式 env 由部署者授权。 |
| `StreamableHttpConfig`                        | 公开 TypeScript 形状要求 `transport:'streamable-http'`、`serverName`、`url`、`headers`、`toolCallTimeoutMs`、`failOnStartupError`；仅 `maxInstructionBytes?`、`reconnect?` 可选。Loader 可填默认；HTTP 凭证不写入日志或模型结果。                                               |
| `ReconnectConfig` / `ResolvedReconnectPolicy` | 前者可给 `enabled?`、`initialDelayMs?`、`maxDelayMs?`、`maxAttempts?`；后者是补全后的同名字段。配置重连并不保证服务器工作或工具调用可重放。                                                                                                                                     |

插件的 `name = 'mcp-client'`，`inject = ['tools']`。`Config` 是 `stdio` 或 `streamable-http` 判别联合：两者都必填 `serverName`（`[A-Za-z0-9_-]{1,32}`）、传输选择，分别必填 `command` 或 `url`。stdio 可配 `args`、`env`、`cwd`，HTTP 可配 `headers`。共有 `toolCallTimeoutMs`（默认 60000ms）、`failOnStartupError`（默认 false）、`maxInstructionBytes`（默认 32768）、`reconnect` 策略。连接初次发现完成才激活；严格启动选项使初次连接或同步失败拒绝该实例。

`createMcpToolDefinition(ctx, options)` 是另一个公开入口：把调用方已有的 MCP tool 描述及 `call(args, execution)` 回调变成 DSH `ToolDefinition`，回调保留原 `ToolExecution` 的 Agent/取消信号。使用者仍须自己注册、设置超时/取消及持有底层连接；不因此获得 MCP client 的监督器或资源服务。`McpResult` 为按顺序的规范 `{ content: JsonValue[], structuredContent? }`。`McpResourceRuntime.register(server, provider)` 在当前 scope effect 注册一个资源 provider；provider 的 `request` 收到 `McpResourceRequest` 和调用者 `ToolExecution`。

## 运行、所有权与模型结果

`serverName` 在注册 scope 唯一，子 Agent scope 可复用；远端 `serverInfo.name` 不决定本地工具名。原始 tool 名发送到 MCP `tools/call`，公开名只给 DSH 模型/权限使用。超长或非法字符名称规范化后附 12 位 identity hash。发现完整工具集后才交换注册代；获取失败保留旧代，注册冲突回滚尝试。连接断开时旧工具可能仍列出但调用失败；按退避策略重连，预算耗尽时注销。卸载停止重连、等待进行中的操作停稳、断开并注销工具和 namespace。

执行结果的 MCP `isError` 明确失败；成功时规范 JSON 值完整保留，模型渲染按块顺序投影。图片只有在当前路由支持且附件存储接纳时进入对话，否则呈现诊断；音频、嵌入资源等不支持的块也为诊断文本。服务器指令以带来源名称的字面系统提示词 section 呈现，不做模板插值；空指令不贡献文本。外部服务器不是权限边界，配置作者必须决定它能访问的工作目录、环境变量、HTTP 凭据和面向模型的工具权限。stdio 环境以清洗后的父环境为基座，再合并显式 `env`；传给 `env` 的密钥会进入该进程。

资源服务只在配置的 provider scope 中解析 server 名；列表 cursor 由服务器拥有。资源工具的参数显式含 server，`read_mcp_resource` 使用 URI。模型读取资源只是工具结果，不改变 Session 之外的事实；若资源内容需长期影响模型，应通过规范 Session 消息/事件保留。此桥接器不实现 MCP prompts。

## 验证

目标 Profile 中装载资源服务和 MCP client，以隔离 stdio 或 HTTP server 验证首次发现、工具调用、资源列表与读取、断连重连、取消、卸载及重复 namespace。单纯配置 schema 通过不证明远端可达、权限合规、模型结果或重启恢复。本次源码审查与实际运行边界记录在 evidence。
