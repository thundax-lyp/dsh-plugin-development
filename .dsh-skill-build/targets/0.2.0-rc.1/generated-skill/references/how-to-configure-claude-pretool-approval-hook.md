# 配置 Claude Code PreToolUse 审批 Hook

## 准备

目标 `dsh-v0.2.0-rc.1` 的 Host 需要 `shell`、`sessionProjections`、ToolRuntime、ApprovalService 及拥有当前 Agent 的真实用户回答者。`@deepseek-ai/dsh-hooks-claude-code` 读取进程级配置，将 `PreToolUse` 的 `permissionDecision:'ask'` 映射成 `tools/pre-execute` 的 ask；最终仍由 DSH ApprovalService 决定是否放行并记录审计。详见 [命令 Hook 桥接与内置 Guard](api-hook-bridges-guards.md)。

## 命令与配置

保存为 `/opt/dsh-hooks/ask-sensitive.mjs`：

```js
let body = ''
for await (const chunk of process.stdin) body += chunk
let payload
try {
  payload = JSON.parse(body)
} catch {
  process.stderr.write('invalid hook input\n')
  process.exit(2)
}
if (payload?.tool_name === 'sensitive_tool') {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: 'Sensitive tool needs one-time approval',
    },
  }))
}
```

保存为 `/opt/dsh-hooks/claude-hooks.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "sensitive_tool",
        "hooks": [{ "type": "command", "command": "node /opt/dsh-hooks/ask-sensitive.mjs", "timeout": 10 }]
      }
    ]
  }
}
```

在上述服务之后装载：

```yaml
- name: '@deepseek-ai/dsh-hooks-claude-code'
  config:
    configPath: /opt/dsh-hooks/claude-hooks.json
    defaultTimeoutMs: 600000
    stderrSummaryMaxChars: 1000
```

纯字母数字和下划线的 matcher 在此方言按精确名称匹配；需要正则语义时使用其他字符构成正则并检查实际匹配。脚本的 `hookEventName` 必须和当前事件相同，否则 per-event 决定被丢弃。`ask` 不是批准；若无 Agent、无审批服务或无人类回答者，调用封闭拒绝。脚本的 exit 2 是直接阻断，其他非零退出或执行基础设施错误不构成安全边界。卸载桥接器移除 listener 并 drain detached 任务；外部副作用需由脚本自行响应取消并清理。真实 Agent turn 应检查 `approval/asked`、`approval/decided` 与 `hook/invoked`、`hook/result` 日志。
