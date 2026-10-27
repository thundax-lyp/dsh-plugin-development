# @deepseek-ai/dsh-experimental-plugin-market-bundle 使用路径

## 为 Web 启用插件市场组合

目标结果：为 Web 启用插件市场组合并观察结果及资源释放。

### 目标与前置

此可选组合包（bundle）挂载自定义插件市场：Host 的 `pluginMarket` 服务读取用户添加的插件市场索引，Web 端提供插件页的发现标签页。随包配置默认禁用。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由包专题（本页维护其配置与装载契约）维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-experimental-plugin-market-bundle@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

### 使用此包

打开 Web 侧栏中的**插件**，点击**实验性插件**旁的**更多**，启用**自定义插件市场**；启用后它也会出现在主列表中。页面随后显示**已安装**和**发现**两个标签页；**发现**用于添加索引源并安装其中的组合包。禁用此组合包会移除发现标签页和 `plugin_market` 工具；已保存的索引源保留在 profile 中。

-----

### 已知限制与后续工作

- 目前没有官方插件市场；发现标签页只列出用户添加的索引源。

-----
