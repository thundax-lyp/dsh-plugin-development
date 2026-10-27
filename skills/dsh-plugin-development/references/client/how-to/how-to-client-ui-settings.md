# 制作带草稿与 revision 栅栏的设置页

## 接入 ui-settings

目标结果：将自有 live Config 或已有 namespace 的 companion 设置页接入 Profile，暂存编辑并以首次编辑 revision 保存，冲突保留草稿，停用时清理页面。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本任务同时服务于表单契约查询与设置页实现；先识别自有配置或 companion namespace 的起点，再选择 ConfigForms 与 staged model。只查询时交付准确契约；实施时继续完成下面的包构建、装载和保存验证。

### 编辑自己的 live Config 与 companion namespace

自己的插件先在 Host 导出 `Config` schema，将可在线编辑的字段标成 `.volatile()`，用 `Volatile<T>` 接收并在每次业务操作开始时 `.get()`；命名空间是 Loader 行的唯一 entry id。普通字段不会进入 live form，secret 字段不得作为普通输入回显。base 组合已有 settings/config-editor，不能重复装载这些服务。独立自定义 Profile 要先组合对应服务。

为另一个已存在的 namespace 写 companion 包时，Host 是空 `apply`，Client 不自行创建 namespace。先用 `ctx.configForms.whileServed([entryId], register)` 跟随 Host 服务存在性，再在回调中 `ctx.configForms.get<T>(entryId)` 获得共享 scope。`whileServed` 返回的 disposer 必须由 `ctx.effect` 持有；它不是自动归属调用方的注册。scope 由 configForms 服务共享，页面只释放自己的 form 与 slot，不销毁共享 scope。

[完整的自有 Config 与 Client 设置页包](../examples/example-client-settings.md)给出源文件、lazy factory 构建、bundle、装载与验证。为 companion 改写时只替换 Host 空入口、所选 namespace 与对应字段，并确保其所有者已经组合；页面不能借此变成 Host 的配置所有者。

### 草稿、revision 与失败

使用 `new SettingsFormModel<T>(scope, specs, secrets?)`，不能省略字段 specs。首次 edit/reset 会锁定 baseline revision；保存必须用草稿开始时的 revision，不能临保存才读取最新镜像 revision 来覆盖他人的更改。模型一次 `mutate` 提交所有普通字段，冲突、拒绝或异常后保留草稿并显示 failed，成功才清空。用户显式 discard 后重新编辑，才以新快照建立 baseline；不能自动把冲突草稿当作最新版本重试。

如果自行管理草稿而不用模型，首次编辑保存 `scope.getSnapshot().revision`，随后始终调用 `scope.mutate(operations, baselineRevision)`；对 false 与 rejection 保留草稿。不得逐键调用 set 来冒充原子多字段保存。保存中禁用编辑与重复提交；停止服务或卸载时撤下页面、解除 React/store 订阅并 dispose model，已在 Host 接受的写入不能由 UI 卸载回滚，晚到 Promise 不得操作已卸载 UI。

### 查询步骤

1. 先区分自己要调用的方法、要实现的回调、要传给组件的 props，以及仅供状态读取的类型。以下每份权威子主题都保留精确签名、成员与联合分支；按公开符号进入对象独占小节。

   - [ui-settings-config-form-types](../api/api-client-ui-settings-config-form-types.md)。
   - [ui-settings-config-form](../api/api-client-ui-settings-config-form.md)。
   - [ui-settings-index](../api/api-client-ui-settings-index.md)。
   - [ui-settings-schema](../api/api-client-ui-settings-schema.md)。
   - [ui-settings-settings-mirror](../api/api-client-ui-settings-settings-mirror.md)。
   - [ui-settings-slots](../api/api-client-ui-settings-slots.md)。

2. 核对导入子路径：Host 根入口与浏览器 /client 不能混用；纯类型依赖使用 import type，不能因此推定服务已挂载。若对象是 props 或 snapshot，它只描述数据形状，不自动创建页面、Session、连接或权限。
3. 核对签名中的判别字段与可选项，再读其所在页的资源归属和失败通道。存在 status/phase/kind/ok 等联合分支时先判别再取分支字段；undefined 不等于成功空值。方法返回 disposer 或 unsubscribe 时记录由谁释放；带 signal 的请求记录谁拥有取消。
4. 将选中的公开对象用于自己的真实任务：新增页面贡献走 [slot 装配](how-to-client-ui-renderer.md#接入-ui-renderer)，浏览器包交付走 [独立 factory 构建](how-to-client-modules.md#接入-modules)，右侧内容走 [tab 注册](how-to-client-ui-sidebar-right.md#接入-ui-sidebar-right)。内置产品自己的状态与组件实现不作为可随意复制的包模板。

### 验证与完成边界

回答必须给出精确包名、export 子路径、符号与所需成员，指出 Host/Client 侧、启用前置以及失败/清理责任。只出现内部组件名、图标名或文件名，不能回答“提供了公开能力”。选择之后分别编译消费项目的 Host 与 Client；需要运行的插件按对应实施任务验证装载、一次真实动作与卸载。实现设置页还须按完整例验证 revision 冲突保留输入与卸载清理；仅查询公开契约不要求安装无关内置页面。

- [SettingsFormModel](../api/api-client-ui-primitives-form-model.md)：本任务的公开模型、scope 或字段转换契约。

- [SettingsFormScope](../api/api-client-ui-primitives-form-model.md)：本任务的公开模型、scope 或字段转换契约。

- [settingsNumberField](../api/api-client-ui-primitives-form-model.md)：本任务的公开模型、scope 或字段转换契约。
