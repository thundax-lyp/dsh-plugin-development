# @deepseek-ai/dsh-experimental-agent-team-profile 使用路径

## 在 Web Profile 启用团队工具和成员看板

目标结果：在 Web Profile 启用团队工具和成员看板并观察结果及资源释放。

### 目标与前置

`dsh-experimental-agent-team-profile` 让 Agent Teams 的团队协作、工具和 Web 界面通过一个组合包启用。开启后可委派 teammate，并在 Web 中查看成员、任务看板和成员会话。普通 subagent 委派及名称重叠的全局 child control 会被禁用；Workflow 仍可创建 fresh 子代理。本包随 dsh 安装提供，默认关闭，可在插件页开启或添加到已初始化的 profile。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由包专题（本页维护其配置与装载契约）维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-experimental-agent-team-profile@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

### 使用本包

### 安装到 profile

将本包添加到已初始化的 profile，然后运行一个要求 Lead 委派工作的任务：

```sh
dsh plugin --profile headless add @deepseek-ai/dsh-experimental-agent-team-profile
dsh --profile headless "Use Agent Teams to split this task between two teammates, wait, and summarize."
```

profile 必须已经包含 `@deepseek-ai/dsh-base`，本层会使用其中的 Subagent 服务与提供方配置行。执行 `dsh plugin --profile <name> remove @deepseek-ai/dsh-experimental-agent-team-profile` 移除本包时，bundle 也会从 profile 的有序层列表中移除。

在 Web 或 Desktop 的插件页开启「智能体团队」，即可同时启用工具与界面。CLI 的 Web profile 也可使用以下命令：

```sh
dsh plugin --profile web add @deepseek-ai/dsh-experimental-agent-team-profile
```

已有 profile 的 `package.json` 中，`dsh.profile.bundles` 应只保留 `@deepseek-ai/dsh-experimental-agent-team-profile`，删除独立的 `@deepseek-ai/dsh-experimental-agent-team-web-profile` 条目。用户 patch 中的 `ui-agent-team` 配置仍然有效。

#### 获得的功能

本层会添加 Agent Teams domain，以及 Team-scoped 创建、roster、消息、interrupt、等待与任务板工具。直接委派使用支持 fresh 和 fork 上下文的 `spawn_teammate`。`subagent`、`subagent_fork` 工具和名称重叠的全局 child control 均被禁用。Workflow 保留 base profile 的 `spawn` 提供方，底层 Subagent 服务和两个提供方仍供 teammate 与 workflow 使用。

在 Web 和 Desktop 会话中，Team UI 显示成员列表与共享任务看板，并可打开成员会话。同一个组合包开关控制工具与浏览器 UI。插件页通过组合包的 `package.json.icon` 声明读取其图标，组合包禁用时也会显示。

-----

### 已知限制与延期工作

- **仅显式启用**——本包随安装提供但默认关闭；随附 CLI、Web、SDK、ACP 与 Python profile 都不会启用它。
- **Workflow 子代理工具**——Team 工具可见性限制也适用于 workflow 子代理。
- **共享 checkout**——所有 teammate 都观察同一个工作目录；本 bundle 不提供 worktree 隔离或文件系统锁。
- **预设内的子代理控件**——Web 预设仍可在预设作用域挂载 continuable Subagent 控件；顶层组合包不会替换这些注册。
- **需要 base profile**——本 patch 依赖 `dsh-base` 提供的配置行 id 与 Subagent 提供方；它不是独立 profile。

组合后的具体操作见[让模型创建成员并操作共享 Team 任务](how-to-capabilities-dsh-experimental-tool-agent-team.md)。

对象契约：[api-capabilities-dsh-experimental-tool-agent-team](../api/api-capabilities-dsh-experimental-tool-agent-team.md)。
