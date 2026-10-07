# 配置重复工具调用提醒

## 任务

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-repeat-tool-reminder` 是现成 Host 插件。Base Profile 已装载；自定义 Profile 在 Agent/Tool 事件可用后装载一次。它在相同 Agent 连续重复完全相同的工具名和规范 JSON 参数时追加提醒，不会拒绝调用。行为见 [命令 Hook 桥接与内置 Guard](api-hook-bridges-guards.md)。

## 配置

以下完整插件条目只跟踪 `web_*` 工具，但跳过 `web_search`；在第二、第四次相同调用后提醒：

```yaml
- name: '@deepseek-ai/dsh-repeat-tool-reminder'
  config:
    thresholds: [2, 4]
    include: ['web_*']
    exclude: [web_search]
    argumentsPreviewChars: 200
```

`include` 为空时跟踪所有工具；`exclude` 的调用既不计数也不重置链。配置的 `*` 是工具名通配符，不检查注册表中当前是否存在该工具。阈值需为非空、无重复、至少 2 的整数，预览长度需为正整数；错误在装载时抛出。运行真实 Agent turn，连续两次调用相同 `web_fetch` 和相同参数，第二次应出现带 `repeat-tool-reminder` 来源的模型可见提醒；改变参数、工具名或收到新用户消息后重新计数。直接无 Agent 的工具调用不产生提醒。卸载插件会移除事件 listener；不需要由消费插件维护计数。
