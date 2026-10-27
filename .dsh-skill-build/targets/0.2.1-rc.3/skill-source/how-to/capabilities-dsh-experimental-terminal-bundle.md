# @deepseek-ai/dsh-experimental-terminal-bundle 使用路径

## 启用持久终端工具组合

目标结果：启用持久终端工具组合并观察结果及资源释放。

### 目标与前置

为所有智能体添加六个实验性全局终端工具。组合包拥有隔离的终端注册表和平台 shell 后端；终端仍由智能体拥有。 Web 和 Desktop 随附此功能，默认关闭。在插件页选择它即可启用。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由包专题（本页维护其配置与装载契约）维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-experimental-terminal-bundle@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

### 使用此包

在 Web 或 Desktop 中打开插件页，在官方分组启用 **持久终端**。关闭后移除其配置层。

启用或关闭组合包会在运行中的 Host 注册或移除其全局工具，因此所有预设（包括 minimal）中的每个智能体都会在下一次请求时看到变化。

-----

### 已知限制与暂缓工作

- 终端属于创建它们的智能体。POSIX 使用 Bash，Windows 使用 PowerShell；此 bundle 不与其他终端注册表共享。

-----

组合后的具体操作见[让模型复用有归属的持久终端](how-to-capabilities-dsh-tool-terminal.md)。

对象契约：[api-capabilities-dsh-tool-terminal](../api/api-capabilities-dsh-tool-terminal.md)。
