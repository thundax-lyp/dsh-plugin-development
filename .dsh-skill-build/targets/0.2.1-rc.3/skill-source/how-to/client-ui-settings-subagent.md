# 查询子 Agent 配额与模型配置卡片类型

## 接入 ui-settings-subagent

目标结果：查询子 Agent 配额与模型配置卡片类型，能指出精确公开声明、运行侧和接入前置。

### 查询目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本任务用于查询子 Agent 配额与模型配置卡片类型，完成结果是一份可核对的公开契约选择，不以安装整个内置页面代替实现自己的插件。

### 查询步骤

1. 先区分自己要调用的方法、要实现的回调、要传给组件的 props，以及仅供状态读取的类型。以下每份权威子主题都保留精确签名、成员与联合分支；按公开符号进入对象独占小节。

   - [ui-settings-subagent-index](../api/api-client-ui-settings-subagent-index.md)。
   - [ui-settings-subagent-locales](../api/api-client-ui-settings-subagent-locales.md)。
   - [ui-settings-subagent-subagent-card-controller](../api/api-client-ui-settings-subagent-subagent-card-controller.md)。
   - [ui-settings-subagent-subagent-limits-card-controller](../api/api-client-ui-settings-subagent-subagent-limits-card-controller.md)。
   - [ui-settings-subagent-subagent-model-selection-card-controller](../api/api-client-ui-settings-subagent-subagent-model-selection-card-controller.md)。
   - [ui-settings-subagent-subagentcard](../api/api-client-ui-settings-subagent-subagentcard.md)。

2. 核对导入子路径：Host 根入口与浏览器 /client 不能混用；纯类型依赖使用 import type，不能因此推定服务已挂载。若对象是 props 或 snapshot，它只描述数据形状，不自动创建页面、Session、连接或权限。
3. 核对签名中的判别字段与可选项，再读其所在页的资源归属和失败通道。存在 status/phase/kind/ok 等联合分支时先判别再取分支字段；undefined 不等于成功空值。方法返回 disposer 或 unsubscribe 时记录由谁释放；带 signal 的请求记录谁拥有取消。
4. 将选中的公开对象用于自己的真实任务：新增页面贡献走 [slot 装配](how-to-client-ui-renderer.md#接入-ui-renderer)，浏览器包交付走 [独立 factory 构建](how-to-client-modules.md#接入-modules)，右侧内容走 [tab 注册](how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right)。内置产品自己的状态与组件实现不作为可随意复制的包模板。

### 验证与完成边界

回答必须给出精确包名、export 子路径、符号与所需成员，指出 Host/Client 侧、启用前置以及失败/清理责任。只出现内部组件名、图标名或文件名，不能回答“提供了公开能力”。选择之后分别编译消费项目的 Host 与 Client；需要运行的插件按对应实施任务验证装载、一次真实动作与卸载。这个查询任务本身不声称已经独立重建该内置功能。
