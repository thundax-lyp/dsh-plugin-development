# 为原 Session 安排并删除提醒

## 目标与前置

在 `dsh-v0.2.0-rc.1` 的隔离 Web Profile 中装载 `@deepseek-ai/dsh-schedule`，为当前 Session 创建一小时后的提醒，读取该任务，再删除它。Schedule 的 Host API、规则、持久与交付边界见 [Schedule reference](api-schedule.md)。此任务需要 `agents`、`sessions`、`tools`、`storageDomain`、`sessionController` 和 `sessionPersistence`。发布的 Web 基础组合提供这些 Host 服务，但不默认装载 Schedule；不能仅把包加为依赖而不插入 Cordis 行。

## 创建 bundle 并装载

1. 在 Profile 外创建 `dsh-session-schedule/`，包含下面三个文件。此例只新增 Host Schedule 行；若还需当前时间/时区辅助或页面任务列表，可按目标 Profile 另行加入 `@deepseek-ai/dsh-time-context` 与 `@deepseek-ai/dsh-client-ui-schedule`，二者不构成 Host `ctx.schedule` 的必要前置。不要把实验性的 `schedule-bundle` 当成 Web 默认组件。

`package.json`：

```json
{
  "name": "dsh-session-schedule",
  "version": "0.1.0",
  "type": "module",
  "exports": { ".": "./lib/index.js" },
  "files": ["lib/index.js", "cordis.patch.yml"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "dependencies": {
    "@deepseek-ai/dsh-schedule": "0.2.0-rc.1"
  }
}
```

`lib/index.js`：

```js
export function apply() {}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: schedule
      name: '@deepseek-ai/dsh-schedule'
```

2. 从 bundle 的父目录创建隔离环境，安装 bundle 并检查最后合成的配置。`--dump-config` 中须有 Schedule 行、storage-json、storage-domain、Session persistence、Session controller 和 Tools 行；有行只能证明装配，仍须启动并观察实际调用。

```sh
export DSH_HOME="$PWD/dsh-schedule-home"
dsh --profile web --dump-default-config >/dev/null
dsh plugin --profile web add "file:$PWD/dsh-session-schedule"
dsh --profile web --dump-config
dsh --profile web
```

3. 在该 Profile 的一个 Agent Session 中调用内置 `schedule_create`，参数为 `{ "title": "Review results", "prompt": "Review the results and report the next action.", "after_seconds": 3600 }`。保存返回的 `id`，随后调用 `schedule_list({})` 并核对 id、title 与 committed `scheduledAt`。此调用绑定执行 Agent 的原 Session，无需由模型输入 Session id。Host 插件若直接调用服务，使用 [Schedule Host 示例](api-schedule.md#最小-host-调用) 的 `ctx.schedule.create(exec.agent.session.id, request, exec.signal)`，并在自己的边界校验访问者。
4. 若不再需要提醒，调用 `schedule_delete({ "id": "<上一步返回的 id>" })`，核对 `deleted: true`；再次 `schedule_list({})` 应不含该行。管理 API 的 `ctx.schedule.delete({ sessionId, id })` 也可由授权的 Host 调用者使用。删除不撤回已经入队的提醒消息，也会删除任务行保存的交付历史。
5. 若要验证持久性，在到期前新建另一任务并保存 id，干净停止 Profile、重启后再用同一 Session 的 `schedule_list` 核对 id；最后删除测试任务。真正到期交付需要原 Session 可被 Session controller 恢复且持久化 backend 的 `session/flush` 参与。缺少凭证的模型轮次可能无法完成，但不能因此把任务行写入当成交付完成。停用 Schedule bundle 前，先通过工具或授权 Host 管理接口处理仍 active 的任务；卸载服务会停止计时器，已存行不会自动消失。

## 验证边界

隔离 Cordis 宿主已实际装配目标版 Session、Agent、Tools、JSON storage/domain 和 Schedule，创建后在 `list`/`catalog` 观察到原 Session 的 active 行，删除后两者均为空；未来任务没有调用 Session resolver。本地 bundle 打包检查、隔离 Web Profile `plugin add`、配置行核对与 Web 启动均通过。完整 Web Profile 模型工具调用、重启恢复和到期交付尚未运行。具体的时区循环规则、失败回执、更新冲突及重复交付窗口以 [Schedule reference](api-schedule.md)为准。
