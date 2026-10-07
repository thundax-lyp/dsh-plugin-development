# 配置 Codex PreToolUse 命令 Hook

## 任务

在已装载 Agent、Tool、`shell` 与 `sessionProjections` 的 Host 上，为 `dangerous_tool` 增加一个运行前阻断 Hook。该示例使用目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-hooks-codex` 桥接器；真实权限审批仍由 [工具执行策略 Hook](api-tool-policy-hooks.md) 所述机制负责。桥接器行为与限制见 [命令 Hook 桥接与内置 Guard](api-hook-bridges-guards.md)。

## 文件与装载

保存下列脚本到目标机器的绝对路径，例如 `/opt/dsh-hooks/pre-tool-check.mjs`。它只读桥接器提供的 JSON stdin，并以 exit 2 + stderr 拒绝目标工具；其余情况 exit 0。运行它的 Host 管理员负责审查脚本、执行权限和路径。

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
if (payload?.tool_name === 'dangerous_tool') {
  process.stderr.write('dangerous_tool is blocked by the configured hook\n')
  process.exit(2)
}
```

将下列 JSON 保存到 `/opt/dsh-hooks/hooks.json`。Codex matcher 是正则表达式，`^...$` 限定完整工具名；`timeout` 单位秒。示例绝对路径需替换为实际路径。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^dangerous_tool$",
        "hooks": [
          {
            "type": "command",
            "command": "node /opt/dsh-hooks/pre-tool-check.mjs",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

在 Host 的 Cordis 配置里，将桥接器放在它依赖的服务之后：

```yaml
- name: '@deepseek-ai/dsh-hooks-codex'
  config:
    configPath: /opt/dsh-hooks/hooks.json
    model: your-model-label
    defaultTimeoutMs: 600000
    stderrSummaryMaxChars: 1000
```

## 核验与边界

重载 Host 后确认配置没有“could not load”或“skipping”告警。以真实 Agent turn 调用 `dangerous_tool`，预期工具 body 不执行，Session 有配对 `hook/invoked`、`hook/result` log-only 事件且模型得到拒绝反馈；其他工具不会匹配。退出码 2 是阻断通道；脚本缺失、shell 启动失败、超时或其他非零退出在共享协议层是非阻断错误，不能将其作为安全边界。对真正不可绕过的限制还应实现 `ctx.tools.guard` 或受控权限预设。卸载插件会移除 listener 并 drain detached 运行；Hook 脚本应响应进程取消，外部副作用需要自行清理。
