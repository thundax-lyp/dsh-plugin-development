# 声明带 Persona 的 Agent Preset

## 目标与前置

在装有 `@deepseek-ai/dsh-agent-preset-registry`、Cordis Loader、SessionProjectionRegistry 和 SystemPrompt 的 Host 中，声明一个 `reviewer` Agent preset，仅该预设的 Agent 使用专属 persona。Registry 的 `default` 必须指向实际存在的 preset；没有首次声明前可暂时选待注册 ID。API、修订与错误边界见 [Agent Preset 与范围内 Persona](api-agent-presets-persona.md)。

## 声明

在 Host 配置中先装载 Registry，再装载声明 row；子 `persona` 由 preset 的隔离 Loader scope 装载，不能挪到全局：

```yaml
- name: '@deepseek-ai/dsh-agent-preset-registry'
  config:
    default: reviewer
- name: '@deepseek-ai/dsh-agent-preset'
  config:
    id: reviewer
    name: Reviewer
    description: Review workspace changes with evidence.
    order: 10
    plugins:
      - name: '@deepseek-ai/dsh-persona'
        config:
          prefix: Review workspace changes. Cite observed files and tests.
          suffix: Keep conclusions tied to evidence.
```

若作者在自己的 Host 插件内动态注册同样的定义，`inject = ['agentPresets']` 后于插件 `apply` 中通过 `ctx.effect` 或 async generator 管理 `await ctx.agentPresets.register(definition)` 返回的异步 disposer；不得注册后丢失所有权。子 plugin 名需由 Loader 可解析。对于任意外部输入的子 entry，先验证来源与配置权限；preset 能装载 Host plugin，不是无权限的内容模板。

## 验证与清理

Host 启动后读 `ctx.agentPresets.list()`，`reviewer` 应无 `broken`；用未发布 Agent 的 scoped context `mount(...,'reviewer')` 后，SystemPrompt 在该 scope 渲染专属 prefix/suffix，而全局仍保留部署 persona。首轮开始后调用 `select` 应得到 `agent-preset/locked`；首轮前成功的选择写 Session 事件。配置缺失、子包装载失败或服务注入未就绪会在 roster 产生诊断，不能只凭行存在认为 Agent 可用。移除声明 row 后新 Agent 不再选该 ID；旧 Agent 的挂载直到其 scope 结束才排空。不可将 persona 子 row 全局挂载：会与部署 section 同名冲突。
