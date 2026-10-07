# 让 Agent 查询同一工作区的历史 Session

## 目标与前置

目标版本 `dsh-v0.2.0-rc.1`。此任务采用配置路径：开启现有 [Session 查询服务](api-session-query.md) 的全文索引，并装载 `@deepseek-ai/dsh-tool-session-query`，让 Agent 使用五个只读历史工具。无需写新的 TypeScript 插件。基础 `web` Profile 已有 `ctx.sessionQuery`、Session、投影与持久化组合，但 `session-query-sqlite` 默认 `openAt: never`，且没有默认装载模型查询工具。

调用 Agent 必须有可信 Session `cwd`，才能读取其他同 cwd 的 Session；无 cwd 时只能读自己。服务本身没有鉴权，新增 Remote 或自写工具不能直接转发未经检查的 `ctx.sessionQuery`。模型工具在 `workspace-access.ts` 对候选和最终观察的 header 执行工作区校验。

## 实现步骤

1. 在父 Profile 安装精确版本的工具包：`dsh plugin --profile web add @deepseek-ai/dsh-tool-session-query@0.2.0-rc.1`。该命令在 Profile 目录运行包管理器；包本身没有 bundle 层，仍须在 patch 显式装载。若使用自有 bundle，把此依赖加入 bundle package 并由它的 patch 提供下面的条目。

2. 将下列内容写入独立 `session-history.patch.yml`。第一行按已有 `session-query-sqlite` id 覆盖配置，保留独立派生索引路径；这里使用临时 `:memory:` 索引，它在进程重启后由 Session 日志重建。`first-search` 只在首次检索时打开 SQLite。第二行添加模型工具。持久索引可换为 Profile 自有的绝对路径，不能复用 Session 持久化数据库路径。

    ```yaml
    - id: session-query-sqlite
      config:
        path: ':memory:'
        openAt: first-search

    - insert:
        - id: tool-session-query
          name: '@deepseek-ai/dsh-tool-session-query'
          config:
            maxSearchResults: 100
            searchTimeoutMs: 30000
    ```

3. 执行 `dsh --profile web --patch /absolute/path/to/session-history.patch.yml --dump-config`，检查最终树的 `session-query-sqlite` 为 `first-search` 且 `tool-session-query` 已启用。然后正常启动同一 Profile；工具需要 `tools`、`systemPrompt`、`sessionQuery` 和 `sessionProjections`，任何服务缺失都应先修复组合。索引和工具注册属于各自 Cordis fiber，Profile 卸载时会释放；查询工具不会修改历史 Session。

4. 在工作区目录创建至少两个 Session，先让旧 Session 留下可检索的独特文本，再让新 Agent 调用 `session_search`。它应返回历史 Session 的最佳事件匹配与片段，不返回当前 Session；随后用 `session_event_search`、`session_trace` 或 `session_event_read` 检查具体命中。工具内部处理服务 cursor，模型看到的是无 cursor 的文本结果和受部署上限约束的提示。完整原始事件的读取与展示仅对已授权目标执行。

5. 若不需要模型全文检索，只使用可信 Host `ctx.sessionQuery` 的 `readSession`、`readEvent`、`filterEvents` 等精确方法，保留 `openAt: never` 即可；需要自行在调用路径做授权和输出裁剪。可选的投影缓存仅加速跨重启读，不替代权威 Session 日志。

## 验证与完成边界

- 成功：同 cwd 的旧 Session 能搜索并读取，当前 Session 不出现在跨 Session 搜索；`session_event_read` 的目标 seq 与历史日志一致。
- 授权：不同 cwd 的 Session 即使知道 id 也不能读取；无 cwd 的 Agent 只能读自己。缺失与越权目标在模型边界应等价，不能泄漏其他工作区元数据。
- 失败与清理：改回 `openAt: never` 时两种全文检索明确失败，但 `readEvent` 仍可用；故意设置无效索引路径时首个搜索失败且不能损坏 Session 持久化；取消搜索、卸载工具和重启 Profile 后分别检查工具可见性、进程资源释放与重新建索引。
- 本次只完成目标 tag 源码和配置审查，没有安装工具包、运行 Profile、创建双 Session 或执行权限/重启测试。因此上面是待运行的验收流程，不能视作已验证结果。
