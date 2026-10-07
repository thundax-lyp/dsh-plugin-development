# 把已有 MCP 服务器接入 Host Profile

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。这里把部署者已运行的 Streamable HTTP MCP 服务器接入 DSH，让模型调用其工具，并在服务器支持 resources 时列出/读取资源。首先确认端点 URL、认证方式、服务器可发布的工具以及该 Profile 的工具权限。桥接器的配置和生命周期见[MCP 客户端](api-mcp-client.md)。

## 实现步骤

在 Host Profile 依赖中加入精确版本的 `@deepseek-ai/dsh-mcp-client@0.2.0-rc.1`；基础 bundle 已提供 `tools` 和 `mcp-resources`，自定义组合必须显式装载二者。把下面的独立 patch 传给 Profile：

```yaml
- insert:
    - id: mcp-demo
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        transport: streamable-http
        serverName: demo
        url: http://127.0.0.1:3000/mcp
        failOnStartupError: true
        toolCallTimeoutMs: 30000
```

端点与端口是示例，请替换为部署者已启动的 MCP server 地址。若远端需认证，在该项 `headers` 中显式传入凭据，并由 Profile 密钥配置负责读取；不要把明文密钥提交到仓库。`serverName` 是 DSH 的稳定 namespace；修改它会改变模型工具名及权限匹配。`failOnStartupError: true` 使初次连接/发现失败时该插件实例加载失败；若服务允许稍后可用，改为 `false` 并监控重连。

先运行 `dsh --profile web --patch /absolute/path/to/mcp.patch.yml --dump-config`，核对最终树里仅有一个 `mcp-demo`，且 `tools` 与 `mcp-resources` 已启用。再启动该 Profile：验证可见名称为 `mcp__demo__<rawName>`，调用时参数和取消传给远端，返回 `isError` 时显式报错。若服务器声明 resources，分别试 `list_mcp_resources`、`list_mcp_resource_templates` 和 `read_mcp_resource`，每次指定 `server: demo`；无 resources 能力时这些工具不能凭空生成资源。

## 失败与清理验收

停止服务器并检查工具调用失败和重连日志；恢复后检查工具代更新，重复加载相同 `serverName` 应使后者失败且前者仍工作。卸载 `mcp-demo` 应移除其工具、资源提供方、服务器指令与连接；重启后相同 namespace 的工具名应稳定。资源 URI 和 cursor 来自远端，跨服务不能混用。对模型工具另核对允许调用的 Agent scope 和外部服务授权；配置成功本身不代表它们安全或可用。

本次参考源码说明验收路径；没有连接到用户的 MCP 服务器，也没有运行目标 Profile，因此此处的远端调用、重连和权限结果仍待实际部署验证。
