# 配置官方 DeepSeek API-key 与请求重试

## 前置

目标 `dsh-v0.2.0-rc.1` Host 先装载 `@deepseek-ai/dsh-llm`、Credentials Service、Agent 与 SessionProjectionRegistry。Base Profile 已装载 `llm-retry` 与官方 API-key route；自定义 Profile 按这些依赖装载。API key 保存在 Credentials Provider 下，配置仅保存引用名。真实请求仍需外部 DeepSeek endpoint/账号权限。边界见 [内置 LLM 路由、重试与 Token Meter](api-llm-builtins-retry-meter.md)。

## 配置

在自定义 Host 的 Cordis 条目中启用重试执行器和固定路由；`retryPolicy` 只写在 Provider 配置下：

```yaml
- name: '@deepseek-ai/dsh-llm-retry'
  config: {}
- name: '@deepseek-ai/dsh-llm-deepseek-api-key'
  config:
    apiKeyEnv: DEEPSEEK_API_KEY
    retryPolicy:
      mode: normal
      maxRetries: 2
      retryableCodes: [RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT]
      backoff:
        initialDelayMs: 500
        maxDelayMs: 5000
        jitterRatio: 0.1
```

把真实秘密写入 Credentials Provider 的 `DEEPSEEK_API_KEY` 引用，或由可信启动环境提供同名变量；不要写进 YAML、Session 或模型输出。选用 `provider: deepseek-official` 与该 route 目录中的模型 ID。`apiKeyEnv` 必须是合法凭证引用名；没有值时请求以 `MISSING_CREDENTIAL` 失败，不应把它加到 retryable codes。`maxRetries` 是首次请求之后的重试次数；若同一 Agent turn 发生可重试失败，Session 有 `llm/retry` 和 `llm/retry-started` 事件。直接 `ctx.llm.stream()` 没有 Agent 恢复器，不会因这份配置自动重试。取消或卸载期间等待必须停止；对无法确认是否已被远端接受的请求，业务方仍需处理幂等。
