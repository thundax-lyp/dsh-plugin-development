# 配置 DeepSeek Account 模型路由

## 准备

目标 `dsh-v0.2.0-rc.1` 的 Base Profile 已包含 `@deepseek-ai/dsh-deepseek-account-platform` 与 `@deepseek-ai/dsh-llm-deepseek-account`。自定义 Host Profile 需先装载 credentials、authorization、LLM runtime，再装载这两个包；Platform Account 还需要签入回调使用的 Host HTTP 路径。不要在配置或 Session 中放 token。账号和模型 route 的具体限制见 [DeepSeek Account 服务与模型认证](api-deepseek-account-auth.md)。

## 组合

在自定义 Cordis 配置中，将以下片段放在上述依赖之后；未声明的配置采用包的默认值。生产环境保持 HTTPS Platform 与 inference origin，只有开发 Mock 且在 loopback 上才启用 `allowLoopbackHttp`。

```yaml
- name: '@deepseek-ai/dsh-deepseek-account-platform'
  config:
    platformOrigin: https://platform.deepseek.com
    inferenceOrigin: https://api.deepseek.com
- name: '@deepseek-ai/dsh-llm-deepseek-account'
  config: {}
```

Host 或 Client 的账号登录界面应调用账号控制器的 `startSignIn`，由用户在浏览器完成授权；其他插件不接收 token。登录后，选择 `provider: deepseek-account` 和当前目录中的模型 ID。`llm-deepseek-account` 的 `Config` 只负责 DeepSeek 协议与模型目录，没有 API-key 字段。需要独立 API key 时选择 `deepseek-official` 的另一条 route，不将两个凭证源混合。

## 核验与失败处理

登录前 `ctx.llm.listProviders()` 可显示 `deepseek-account` route，`listModels('deepseek-account')` 应为空；尝试推理得到 `ACCOUNT_SIGN_IN_REQUIRED`，不会借用 API-key。登录并得到允许的 inference-origin token 后，目录出现所配置模型；这一步需在真实 Profile 中验证。签出后目录再次为空，新请求要求登录。401 会将当前 token 失效并发出账号过期通知；旧请求的错误保留。若要接入自己的账号体系，先完整实现 `DeepSeekAccount` 服务契约与安全的 origin 绑定；单独替换 LLM route 的 `resolveAuth` 测试替身不能代替登录实现。
