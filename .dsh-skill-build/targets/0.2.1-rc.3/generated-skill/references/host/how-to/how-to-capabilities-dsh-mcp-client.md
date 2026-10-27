# 发现并调用命名空间隔离的 MCP 工具操作指南

## 发现并调用命名空间隔离的 MCP 工具

目标结果：发现并调用命名空间隔离的 MCP 工具并观察结果及资源释放。

### 目标与前置

目标是在真实 Profile 内发现并调用一个受信 MCP server 的工具。需要 `tools`，资源能力另由 mcp-resources 接入；服务器命令在宿主运行。

### 实现和使用步骤

1. 按[本地 MCP 完整示例](../examples/example-local-mcp.md)先建立并安装加法 server，再创建配置 bundle。先确定 stdio 或 streamable-http；两分支分别提供 command 或 url，不能混用字段。
2. 为 server 选 `[A-Za-z0-9_-]{1,32}` 的唯一 serverName；同一注册 scope 内不可冲突。将超时、初始失败是否阻断及重连策略写入 config；stdio args 不经过 shell 插值。
3. 在隔离 home 的 Web Profile 安装 bundle 并启动。等首次 discovery 完成后观察 `mcp__localadd__add`，用 a=2、b=3 实际调用并检查规范内容为 5。不能只检查进程存活。
4. 调用示例 refuse 工具，确认 isError 保留。需要 resources 时先确认服务器宣告相应 capability，再使用资源列表/模板/读取接口；没有 tools capability 的资源服务器不应被误报为不可连接。
5. 中断 transport 并观察重连。新 generation 必须完整同步后发布；达到上限时旧工具和 server 指令撤回。卸载时确认 backoff 终止、transport 关闭、子进程退出。

### 失败、取消与完成判据

初始连接失败在 failOnStartupError=true 时阻断实例激活；false 不能被当成工具已可用。慢请求取消须到达 SDK/server，不以快速完成代替取消检查。验证实际发现、规范成功、规范错误、断线恢复与卸载无残留；HTTP 认证与平台网络按部署另行验证。

### 权威对象契约

- [api-capabilities-dsh-mcp-client](../api/api-capabilities-dsh-mcp-client.md)。
