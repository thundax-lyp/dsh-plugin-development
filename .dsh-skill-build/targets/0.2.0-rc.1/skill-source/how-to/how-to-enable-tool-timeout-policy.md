# 给 Web 工具启用协作式超时

## 任务

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-tool-call-timeout-policy` 读取每个工具定义的 `timeoutMs`，在 `tools/execute` 中为该调用建立 deadline。Base Profile 已装载此策略；自定义 Profile 需要在 ToolRuntime 之后装载。它没有自己的配置字段。更多边界见 [命令 Hook 桥接与内置 Guard](api-hook-bridges-guards.md)。

## 配置

下面的 `@deepseek-ai/dsh-tool-web` 会把两个配置值放在各自工具定义的 `timeoutMs` 上，策略插件据此执行；在完整 Host 中还需装载 Web Search 与 Fetch Provider。

```yaml
- name: '@deepseek-ai/dsh-tool-call-timeout-policy'
- name: '@deepseek-ai/dsh-tool-web'
  config:
    search: true
    fetch: true
    searchTimeoutMs: 10000
    fetchTimeoutMs: 20000
```

自写工具也可在 `defineTool` 定义上设置正的 `timeoutMs`，并在 `execute(args, exec)` 中把 `exec.signal` 传给网络或子进程，响应取消并等待资源清理。完整工具注册骨架见 [制作并装载一个模型工具插件](how-to-register-model-tool.md)。未声明 `timeoutMs` 的工具会原样执行。超时到达后，策略 abort 派发时的 signal，等下游合作收敛再返回 `isError:true`、`error.info.code:'TOOL_TIMEOUT'` 的单一规范结果；不合作的工具可能一直占用调用，不能把此策略当成硬杀进程。检查实际工具调用与结果中的错误码，并在取消后的资源释放完成后卸载插件。
