# @deepseek-ai/dsh-experimental-badge-skill-bundle 使用路径

## 让预设加载随包徽章 Skill

目标结果：让预设加载随包徽章 Skill并观察结果及资源释放。

### 目标与前置

让预设支持技能加载的智能体为文档、PR 等产出添加「powered by dsh」徽章。共享提供者不添加模型工具。 Web 和 Desktop 随附此功能，默认关闭。在插件页选择它即可启用。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由包专题（本页维护其配置与装载契约）维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-experimental-badge-skill-bundle@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

### 使用此包

在 Web 或 Desktop 中打开插件页，在官方分组启用 **DSH 徽章技能**。关闭后移除其配置层。

开关为已有和新建智能体添加或移除 Host 级技能提供方。提供技能加载能力的预设可以使用徽章；minimal 的工具目录保持不变。

-----

### 已知限制与暂缓工作

- 预设必须支持技能发现和加载才能使用徽章。此 bundle 不会为 minimal 预设添加技能工具。

-----

组合后的具体操作见[提供徽章生成 Skill](how-to-capabilities-dsh-skill-badge.md)。

对象契约：[api-capabilities-dsh-skill-badge](../api/api-capabilities-dsh-skill-badge.md)。
