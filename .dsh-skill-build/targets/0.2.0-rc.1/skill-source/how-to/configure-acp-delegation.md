# 在 Profile 中配置一次 ACP 子进程委派

## 目标与前置

目标是让 DSH 父 Agent 通过模型工具把一项任务交给独立 ACP Agent，并取回前台规范结果。目标版本为 `dsh-v0.2.0-rc.1`。本文使用目标版本自带的 Host `@deepseek-ai/dsh-subagent`、`@deepseek-ai/dsh-subagent-acp` 和 `@deepseek-ai/dsh-tool-subagent`，不编写新 Provider。具体能力与失败边界由 [Subagent 服务](api-subagent-provider.md)、[ACP 后端](api-subagent-acp.md) 和 [模型可见工具](api-subagent-tools.md) 定义。

选用已经含有 `subagent` 服务和 `tools` 的 Profile（例如 `web`）；确认目标 Profile 安装了这两个可选插件包。子进程需有能在 stdio 运行的 ACP Agent 命令。下面以已安装的 `dsh --profile acp` 为例；它另有自己的 Profile、模型和凭据配置。若以同一 DSH 安装作孩子，显式设置独立 `DSH_HOME`，避免子进程读取父 Profile 或凭据。

## 实现步骤

1. 在目标 Profile 的 `cordis.patch.yml` 追加下列两条 `insert` 行，或把相同内容放入一次性的 `--patch` 文件。保持现有 patch 条目；不要覆盖整个用户文件。`command` 必须能在父进程环境中找到，`/absolute/path/to/child-home` 是已准备好的子 DSH home，不是文字占位可直接运行值。

    ```yaml
    - insert:
        - id: subagent-acp
          name: '@deepseek-ai/dsh-subagent-acp'
          config:
            providerName: acp
            command: dsh
            args: ['--profile', 'acp']
            permission: reject
            env:
              DSH_HOME: /absolute/path/to/child-home

        - id: tool-subagent-acp
          name: '@deepseek-ai/dsh-tool-subagent'
          config:
            provider: acp
            toolName: subagent_acp
            backgroundMode: one-shot
            maxDepth: provider-managed
    ```

2. 子 `acp` Profile 必须预先可独立启动并选定可用模型；其 stdout 由 ACP 协议占用，调试输出不能写入 stdout。`permission: reject` 会自动拒绝子 Agent 的审批请求；若部署明确决定自动允许，才改为 `allow`。子 Agent 需要的凭据在其隔离 home 或 `env` 中明确配置。父 Provider 会先擦除父环境中的凭据形状变量，再叠加显式 `env`。

3. 启动父 Profile，例如 `dsh --profile web --patch /absolute/path/to/acp-delegation.patch.yml`。用 `--dump-config` 检查最终树中 Provider 行和工具行均启用、`provider` 与 `providerName` 都是 `acp`，并确认没有同名 `toolName`。实际装载时 `@deepseek-ai/dsh-subagent-acp` 依赖 `subagents` 与 `subprocess`，委派工具依赖 `tools`、`subagents`、`systemPrompt` 和 `sessionProjections`。缺任何一项时应修复 Profile 组合，不以仅看到 YAML 行作为成功证据。

4. 让父 Agent 调用 `subagent_acp`，给出短 `description` 和完整 `prompt`，并显式选择前台（默认 one-shot 前台）。父工具返回子 Agent 的最终 assistant 输出，子内部中间消息和工具流不进入父 Session。若子运行非正常结束，工具把停止原因、有限诊断和已有部分输出表示为失败；不要把部分输出当作完成。调用方持有 run 并由内置工具在收集后释放。

5. 若需独立消费包，把上面的 patch 放入包内 `cordis.patch.yml`，在包 `package.json` 的 `dsh.bundle.patch` 指向它，并声明两个插件依赖；经 `dsh plugin --profile <name> add <package>` 安装。具体 bundle 元数据、构建与安装契约由插件管理专题负责。此处配置不构造新的 TypeScript 插件。

## 验证与完成边界

- `dsh --profile web --patch /absolute/path/to/acp-delegation.patch.yml --dump-config` 应显示两条有效行；然后启动真实父 Profile 并确认工具可见。一次调用须有子 ACP handshake、最终结果和父侧模型可见工具结果。
- 将 `command` 换成不存在的命令，应在发布前失败，不能出现可继续使用的 run；给父 Session 一个无 cwd 且配置未写 `cwd` 时也应拒绝。取消进行中的运行应返回取消/失败状态并观察子进程退出。卸载 Provider 后新启动应失败，已发布 run 仍须由持有者完成清理。
- 这些是真实组合的验收步骤；本次只做目标源码、公开配置和已有测试审查，未执行父/子两个 Profile 的握手、取消或卸载演练，因而该任务仍是待行为验证的草稿。
