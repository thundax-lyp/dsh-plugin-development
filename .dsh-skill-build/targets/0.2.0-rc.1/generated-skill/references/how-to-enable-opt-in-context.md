# 启用时间与 tmux 上下文

## 目标与前置

给已有 `agents`、`sessionProjections` 的 Host Profile 增加请求时钟；若部署确实在 tmux 内并希望给模型提供 pane 位置，再增加 tmux 行。公开契约见 [可选上下文](api-opt-in-context-plugins.md)。该任务是 bundle patch，无 TypeScript 插件入口。

## 实现步骤

新建包目录。`package.json`：

```json
{
  "name": "example-opt-in-context",
  "version": "0.1.0",
  "private": true,
  "files": ["cordis.patch.yml"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "dependencies": {
    "@deepseek-ai/dsh-time-context": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tmux-context": "0.2.0-rc.1"
  }
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-time-context
      name: '@deepseek-ai/dsh-time-context'
      config:
        timeZone: UTC
        refreshIntervalMs: 600000
    - id: example-tmux-context
      name: '@deepseek-ai/dsh-tmux-context'
      config:
        refreshIntervalMs: 0
```

将此 patch 层加入有前置 service 的目标 Profile。无需 tmux 时删除第二个 insert 行；只保留第一项即可。先用目标 Profile 的 Loader 检查两项成功装载、无 duplicate id，再启动一个 Agent turn。确认 Session 日志里出现 `source.kind='time-context'` 的 `user/message`；真正运行于 tmux pane 且允许 `ctx.shell` 查询时，确认 `source.kind='tmux-context'`。在普通终端不出现 tmux 事件是预期行为。再次运行 step 时按配置验证节流，取消/拒绝 step 后检查没有新注入；恢复 Session 时从事件来源重建事实。卸载 patch 后再次创建 turn，确认不再新增两种来源。
