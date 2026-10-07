# Client slash 命令贡献与 Host 命令装饰

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-client-ui-commands/client` 装载 `ctx.commandUi: CommandUiRuntime`，提供 `register()` 添加纯 Client slash 命令，`decorate()` 为已有 Host 命令的裸调用提供 popup 或本地动作。根入口只有空 `apply()`，用作 Loader 的 Host 行。它依赖 `inputTriggers`、`sessions`、`remote.commands`、`locale`；Client 包构建和 Loader 装载见 [构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)。完整贡献任务见 [添加 Client slash 命令](how-to-add-client-command.md)。

## 契约与运行语义

`CommandUiRuntime` 自己注册 `/` 输入触发源和 `conversation.input.overlay` popup。插件作者只调用 `ctx.commandUi.register({name,available,ui,...})`，不再注册另一套 `/` source。`register` 的 `name` 不含 `/`；同名 Client 贡献在注册时失败，与 Host catalog 冲突在候选合成时失败，不会悄然遮蔽 Host 命令。`available(session)` 在每次候选查询中对当前 Session 投影求值。`label()` 与 `description()` 每次生成候选时读取，可随 locale 更新。

`ui.kind: 'action'` 的 `run(session)` 是同步 Client 动作：消费命令 token，不向 Host 提交文本，也不会给 Session 增加模型可见事实。`ui.kind: 'popupSelect'` 的 `options(session,signal)` 异步列出选项，`onSelect(option,session)` 处理选择；`SelectOption.active` 会成为打开时默认高亮，`confirmation` 可要求页内确认。若选择必须影响模型或工作区，回调需调用相应 Session/Remote API 并验证接受与日志，不要把 popup 成功当作 Host 接受。

`decorate({name,available,ui})` 只改已有 Host 命令的**裸调用** UI；Host catalog、带参数输入和执行日志继续属于 Host 命令。没有 Host descriptor 的名字不会由装饰生成候选。`dismiss(name)` 关闭该命令的现存 popup，保留 composer 草稿。`popupFor(actx)` 是 overlay 层取当前 retained Session scope 的控制器，不是一般插件打开 popup 的入口。

## 公开对象与成员

| 对象                                                                  | 插件作者需要的成员与约束                                                                                                                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CommandUiRuntime` / `CommandUiContract`                              | `register(contribution): () => void`、`decorate(decoration): () => void`、`dismiss(name): void`、`popupFor(actx)`；前两者随调用 fiber 清理，返回的 disposer 可提前撤销。                   |
| `CommandContribution`                                                 | `name`、`available(session)`、`ui` 必需；`label()`、`description()`、`icon` 可选。                                                                                                         |
| `CommandDecoration`                                                   | `name` 指向 Host 命令，`available(session)` 与 `ui` 必需。                                                                                                                                 |
| `CommandUiSpec` / `ActionSpec`                                        | 判别字段 `kind: 'action'` 与同步 `run(session)`；不自动提交 Host 命令。                                                                                                                    |
| `PopupSelectSpec`                                                     | `kind: 'popupSelect'`、`options(session,signal)`、`onSelect(option,session)`。                                                                                                             |
| `SelectOption` / `SelectConfirmation`                                 | 行的 `id`、`label` 必需；`badge`、`detail`、`active`、`confirmation` 可选；确认文本有 `title`、`description`、`acknowledgeLabel`、`cancelLabel`、`confirmLabel`。                          |
| `CommandDirectory` / `DirectoryStatus`                                | Session-keyed Host catalog 缓存；`status`、`resolve`、`invalidateAll`、`resetSession`、`resetConnected`、`warm`、`refresh`、`ensureReady` 是该服务的内部组合面，普通贡献无需自建第二目录。 |
| `PopupSelectController` / `PopupSpec` / `PopupState` / `TokenSegment` | 共享 popup shell 控制类型；业务贡献通过 `PopupSelectSpec` 交给 `commandUi`，无需自行驱动控制器。                                                                                           |

## 生命周期、失败与边界

注册与装饰都是当前 Client fiber 的 effect，卸载后撤销；尚在进行的 `options` 应遵守传入 signal。Session 离开、断连、Host 命令目录变化会使旧候选失效，代码不得缓存选中行作为永久 authority。`CommandUiRuntime` 对 Host catalog 使用 retained Session、单飞缓存以及变更/重连重置，外部贡献只负责自己的业务协议。此参考经目标源码与发布声明核查；隔离编译见创建证据，未以真实浏览器操作 slash 弹窗。
