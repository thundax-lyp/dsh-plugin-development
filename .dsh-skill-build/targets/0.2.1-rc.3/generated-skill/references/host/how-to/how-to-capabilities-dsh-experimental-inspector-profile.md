# @deepseek-ai/dsh-experimental-inspector-profile 使用路径

## 启用隔离的 Inspector 调试组合

目标结果：启用隔离的 Inspector 调试组合并观察结果及资源释放。

### 目标与前置

启用这个可选组合包，即可在 Sidebar 检查 Session 数据，并在底部面板打开 NodeJS 诊断。组合包启用两个 Inspector 和 Host fetch 采集；组合包自身在插件管理器中默认关闭。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由包专题（本页维护其配置与装载契约）维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-experimental-inspector-profile@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

### 使用本包

在插件管理器的官方分组中启用**开发者工具**，即可为当前 Web profile 选择 `@deepseek-ai/dsh-experimental-inspector-profile`。

从 Sidebar 的新建 tab 菜单或引导页打开**会话数据诊断**。Session Inspector 提供一个视图，可选择原始数据或对话分组展示形式，初始选中原始数据。

按 **Ctrl/Cmd+Shift+.** 可展开或收起底部面板中的 **NodeJS 诊断**，使用打包后的 DevTools 前端。启用组合包会启动本地调试后端和未经脱敏的 Host fetch 采集，不需要用户配置覆盖或调试参数。

-----

### 已知限制与延期工作

- **仅支持 Web** — 检查视图依赖 Web 应用的 Session 服务。
- **内部诊断** — 组件开关保持可用，但没有专用 Web 调试按钮。显式启用后会进行未脱敏采集并允许执行本地代码，请参阅安全限制。
